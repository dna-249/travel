import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

// API endpoints (Kept for reference, but API call is mocked/replaced)
const BASE_API_URL = "https://portal-database-seven.vercel.app/student";
const STUDENT_LIST_URL = `${BASE_API_URL}`;
// API endpoints for PUT/PATCH (MOCKING THESE ENDPOINTS)
const STUDENT_INFO_URL = (id) => `${BASE_API_URL}/${id}`;
const REMARKS_URL = (id) => `${BASE_API_URL}/${id}`;
// MOCK URL for Photo Upload (REPLACE WITH YOUR ACTUAL ENDPOINT)
// IMPORTANT: This should be your dedicated photo upload endpoint.
const PHOTO_UPLOAD_URL = (id) => `https://portal-database-seven.vercel.app/student/${id}`; 

// --- MASTER LIST OF ALL AVAILABLE SUBJECTS (Unchanged) ---
const ALL_SUBJECTS = [
    "QUR'AN", "TAJWEED", "TAUHEED", "FIQH", "HADITH", "ARABIC", "AZKHAR",
    "SIRAH", "HURUF"
]

// Initial state structure (Changed studentName)
const INITIAL_FORM_DATA = {
    // --- School/Student Info (Simplified) ---
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    studentName: "",
    class: "",
    term: "",
    session: "ACADEMIC YEAR 2025/2026",
    admissionNo: "", // Updated admissionNo (used as ID for the API)
    sex: "",
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect",
    existingPhotoUrl: null, // New field to hold existing photo URL
    
    // --- Subject Scores (Using the first few subjects as defaults) ---
    subjects: [
        { name: "QUR'AN", CA1: '', CA2: '', Ass: '', Exam: '', },
    ],
};

// --- Stylesheet Object (MODIFIED FOR MINIMALIST DESIGN) ---
const styles = {
    container: {
        padding: '0.1rem', backgroundColor: '#f3f4f6', minHeight: '100vh',
        fontFamily: 'Inter, sans-serif', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale',
    },
    title: {
        fontSize: '1.5rem', fontWeight: '800', color: '#1e40af', marginBottom: '0.5rem',
        textAlign: 'center', borderBottom: '2px solid #bfdbfe', paddingBottom: '0.35rem',
    },
    form: {
        maxWidth: '48rem', margin: '0 auto', backgroundColor: '#fff', padding: '0.75rem',
        borderRadius: '0.75rem', boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
    },
    fieldset: {
        padding: '0.35rem', borderRadius: '0.5rem', boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.06)', border: 'none',
    },
    legend: {
        padding: '0 0.5rem', fontSize: '1.125rem', fontWeight: '700',
    },
    input: {
        width: '100%', padding: '0.3rem', border: '1px solid #d1d5db', borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    submitButton: {
        padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: '600',
        borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    studentDetailsHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.25rem',
    },
    listButton: {
        padding: '0.2rem 0.2rem', fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#f97316',
        color: '#fff', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s',
    },
    listButtonHover: {
        backgroundColor: '#ea580c',
    },
    notificationBase: {
        marginTop: '0.15rem', marginBottom: '0.35rem', padding: '0.6rem', textAlign: 'center',
        fontWeight: '500', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s', border: '2px solid', maxWidth: '48rem', margin: '0.15rem auto 0.35rem auto'
    },
    notificationSuccess: {
        backgroundColor: '#d1fae5', color: '#065f46', borderColor: '#10b981',
    },
    notificationError: {
        backgroundColor: '#fee2e2', color: '#991b1b', borderColor: '#ef4444',
    },
    notificationInfo: {
        backgroundColor: '#bfdbfe', color: '#1d4ed8', borderColor: '#3b82f6',
    },
    // MODIFIED STYLES FOR MINIMALIST PHOTO SECTION
    photoContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '0.2rem', // Reduced padding
        border: '1px dashed #9ca3af', // Subtle dashed border
        borderRadius: '0.5rem', 
        backgroundColor: '#f9fafb', // Light background
        width: '100%',
        minHeight: '180px', // Ensures consistent vertical space
        justifyContent: 'space-around',
    },
    photoPreview: {
        width: '85px', // Reduced size
        height: '85px', // Reduced size
        borderRadius: '50%', 
        overflow: 'hidden',
        border: '3px solid #60a5fa', // Cleaner blue border
        marginBottom: '0.4rem', 
        objectFit: 'cover',
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#e5e7eb', // Placeholder background
    },
    photoInput: {
        fontSize: '0.75rem', // Reduced font size
        padding: '0.3rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box'
    },
    uploadButton: {
        marginTop: '0.5rem',
        backgroundColor: '#3b82f6', // Primary blue color
        color: 'white',
        padding: '0.4rem', // Reduced vertical padding
        fontSize: '0.75rem', // Reduced font size
        fontWeight: '600',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s',
        width: '100%',
    },
    subjectCard: {
        padding: '0.3rem', backgroundColor: '#fff', borderRadius: '0.75rem',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)', marginBottom: '0.2rem', border: '1px solid #e5e7eb',
    },
    subjectInput: {
        width: '100%', padding: '0.4rem', borderBottom: '2px solid #60a5fa', fontWeight: '700',
        fontSize: '0.9rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem',
        border: '1px solid #ccc', transition: 'background-color 0.2s', flexGrow: 2,
    },
    removeButton: {
        color: '#ef4444', fontSize: '1.25rem', fontWeight: '700', padding: '0 0.25rem',
        borderRadius: '50%', border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
        alignSelf: 'center', flexShrink: 0,
    },
    scoreLabel: {
        display: 'block', fontSize: '0.65rem', fontWeight: '600', color: '#4b5563', marginBottom: '0',
    },
    listModalOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    },
    listModalContent: {
        backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.75rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)', width: '90%', maxWidth: '400px',
        maxHeight: '80vh', overflowY: 'auto', position: 'relative',
    },
    studentListItem: {
        padding: '0.5rem', borderBottom: '1px solid #e5e7eb', cursor: 'pointer',
        transition: 'background-color 0.15s', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
    },
    closeButton: {
        background: 'none', border: 'none', fontSize: '1.5rem', fontWeight: '700',
        cursor: 'pointer', color: '#4b5563', position: 'absolute', top: '10px', right: '10px',
    },
    searchContainer: {
        marginBottom: '1rem',
    },
    searchInput: {
        width: '100%', padding: '0.5rem 1rem', borderRadius: '0.5rem',
        border: '1px solid #ccc', boxSizing: 'border-box',
    },
};

// Helper function to format notification styles
const getNotificationStyle = (type) => ({
    ...styles.notificationBase,
    ...(type === 'success' ? styles.notificationSuccess : type === 'error' ? styles.notificationError : styles.notificationInfo)
});

// --- NEW COMPONENT: StudentListModal with Class Filter ---
const CLASS_OPTIONS = [
    { label: "All Classes", value: "" },
    { label: "Basic 1", value: "basic 1" },
    { label: "Basic 2", value: "basic 2" },
    { label: "Basic 3", value: "basic 3" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advance", value: "Advance" },
];

const StudentListModal = ({
    studentList,
    isFetchingList,
    onClose,
    onStudentSelect,
    searchQuery,
    setSearchQuery,
    classFilter,
    setClassFilter,
}) => {
    return (
        <div style={styles.listModalOverlay} onClick={onClose}>
            <div 
                style={styles.listModalContent} 
                onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                <h3 style={{ marginTop: '0', marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                    Select Student ({studentList.length} Found)
                </h3>

                <div style={styles.searchContainer}>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="Search by Name or ID..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search student list"
                    />

                    {/* Class Filter Select (NEW ELEMENT) */}
                    <select
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value)}
                        style={{ ...styles.searchInput, marginTop: '0.5rem' }}
                        aria-label="Filter by Class"
                    >
                        {CLASS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                </div>

                {isFetchingList && <p style={getNotificationStyle('info')}>Loading student list...</p>}

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {studentList.length === 0 && !isFetchingList && (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>No students match your criteria.</p>
                    )}
                    {studentList.map((student) => (
                        <div
                            key={student.id}
                            style={styles.studentListItem}
                            onClick={() => onStudentSelect(student)}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                        >
                            <span style={{ fontWeight: '600' }}>{student.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                {student.class}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
// --- END StudentListModal ---


/**
 * Main Data Entry Form Component
 */
const App = () => {
    // --- NEW PHOTO STATES ---
    const [photoFile, setPhotoFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isPostingPhoto, setIsPostingPhoto] = useState(false);
    // -------------------------

    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [postingSubjectIndex, setPostingSubjectIndex] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isPostingInfo, setIsPostingInfo] = useState(false);
    const [isPostingRemarks, setIsPostingRemarks] = useState(false);
    const [showStudentList, setShowStudentList] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [isFetchingList, setIsFetchingList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    // --- NEW STATE FOR CLASS FILTER ---
    const [classFilter, setClassFilter] = useState(''); 
    // ----------------------------------


    const MOCK_STUDENT_DATA = [ ]
    const usedSubjectNames = useMemo(() => {
        return formData.subjects.map(s => s.name.toUpperCase());
    }, [formData.subjects]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    // Handle Photo File Selection and Preview
    const handlePhotoFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            setPhotoFile(null);
            setImagePreview(null);
        }
    };

    // --- REALISTIC AXIOS FILE UPLOAD LOGIC ---
    const handleSubmitStudentPhoto = async () => {
        if (!formData.id) {
            setNotification({ type: 'error', message: "Please select a student first (Admission No is missing)." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }
        if (!photoFile) {
            setNotification({ type: 'error', message: "Please select a photo file to upload." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        setIsPostingPhoto(true);
        setNotification(null);

   
  
        try {

            const form = new FormData()
            form.append("file",photoFile)
            form.append("upload_preset","user_images")
            form.append("cloud_name","dukgqyyek")

        const res = await fetch(`https://api.cloudinary.com/v1_1/dukgqyyek/image/upload`,{
            method:"POST",
            body:form})

            const url = await res.json()
            console.log(url.secure_url)
        
            // 2. Make the Axios PUT/POST request
            // Note: File uploads commonly use POST, but we use PUT as per the request 
            // and the API endpoint structure which might be for "updating" the photo.
            const response = await axios.put(
                PHOTO_UPLOAD_URL(formData.id), // Your API endpoint
                {studentPhoto:url.secure_url}, // The FormData payload
                { 
                    headers: { 
                        // IMPORTANT: Axios and the browser will automatically set 
                        // 'Content-Type': 'multipart/form-data' for FormData
                        // You should generally NOT set this header manually when using FormData
                        // However, some backends might require custom headers (e.g., authorization)
                    } 
                }
            );

            // 3. Handle response
            if (response.status === 200 || response.status === 201) {
                
                // IMPORTANT: The server should return the permanent URL of the uploaded image
                const newPhotoUrl = url.secure_url || imagePreview; 

                setFormData(prev => ({
                    ...prev,
                    // Set the permanent URL returned by the API
                    existingPhotoUrl: newPhotoUrl, 
                }));
                // Clear file input/preview states
                setPhotoFile(null);
                setImagePreview(null); 

                setNotification({ type: 'success', message: `📷 Photo for **${formData.studentName}** successfully uploaded! (Status: ${response.status})` });
            } else {
                // Handle non-200 responses
                const errorMsg = response.data?.message || response.statusText;
                throw new Error(errorMsg);
            }
        } catch (error) {
            // Handle network errors or exceptions thrown above
            console.error("Photo Submission Error:", error.response || error);
            const errorMessage = error.response 
                ? `API Error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`
                : `Network Error: ${error.message}`;
                
            setNotification({ type: 'error', message: `❌ Failed to submit Photo: ${errorMessage}` });
        } finally {
            setIsPostingPhoto(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };
    // --- END REALISTIC AXIOS FILE UPLOAD LOGIC ---
    
    // Handler for Subject array changes
    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index] = {
            ...newSubjects[index],
            [field]: field === 'name' ? value.toUpperCase() : value
        };
        setFormData(prev => ({
            ...prev,
            subjects: newSubjects
        }));
    };

    // Add new subject row
    const addSubject = () => {
        const nextSubject = ALL_SUBJECTS.find(name => !usedSubjectNames.includes(name)) || `NEW SUBJECT ${formData.subjects.length + 1}`;
        if (nextSubject.startsWith("NEW SUBJECT")) {
            setNotification({ type: 'error', message: "All available subjects are already added to the list." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        setFormData(prev => ({
            ...prev,
            subjects: [
                ...prev.subjects,
                { name: nextSubject, CA1: '', CA2: '', Ass: '', Exam: '' }
            ]
        }));
    };

    // Remove subject row
    const removeSubject = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            subjects: prev.subjects.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Submit Student Info Fields
    const handleSubmitStudentInfo = async () => {
        if (!formData.id) {
            setNotification({ type: 'error', message: "Please select a student first (Admission No is missing)." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        setIsPostingInfo(true);
        setNotification(null);

        const payload = {
            studentName: formData.studentName,
            class: formData.class,
            term: formData.term,
            session: formData.session,
            admissionNo:formData.admissionNo,
            sex: formData.sex,
            password: formData.password
        };

        try {
            const response = await axios.put(
                STUDENT_INFO_URL(formData.id),
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                setNotification({ type: 'success', message: `✅ Student Info for **${formData.studentName}** successfully updated! (Status: 200)` });
            } else {
                throw new Error(`Submission failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Student Info Submission Error:", error);
            setNotification({ type: 'error', message: `❌ Failed to submit Student Info: ${error.message || 'Network Error'}` });
        } finally {
            setIsPostingInfo(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    // Submit Remarks Fields
    const handleSubmitRemarks = async () => {
        if (!formData.id) {
            setNotification({ type: 'error', message: "Please select a student first (Admission No is missing)." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }
        
        setIsPostingRemarks(true);
        setNotification(null);

        const payload = {
            headRemark: formData.headRemark,
            classTeacherRemark: formData.classTeacherRemark,
        };

        try {
            const response = await axios.put(
                REMARKS_URL(formData.id),
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                setNotification({ type: 'success', message: `✅ Remarks for **${formData.studentName}** successfully updated! (Status: 200)` });
            } else {
                throw new Error(`Submission failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Remarks Submission Error:", error);
            setNotification({ type: 'error', message: `❌ Failed to submit Remarks: ${error.message || 'Network Error'}` });
        } finally {
            setIsPostingRemarks(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    // Submit a Single Subject Row
    const handleSingleSubjectSubmission = async (index) => {
        if (!formData.id) {
            setNotification({ type: 'error', message: "Please select a student first (Admission No is missing)." });
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        setPostingSubjectIndex(index);
        setNotification(null);

        const subjectToSubmit = formData.subjects[index];
        const { name, ...scores } = subjectToSubmit;

        const capitalizedName = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (!capitalizedName) {
            setNotification({ type: 'error', message: "Subject name cannot be empty." });
            setPostingSubjectIndex(null);
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        const { CA1, CA2, Exam, Ass } = scores;

        try {
            const response = await axios.put(
                `https://portal-database-seven.vercel.app/student/push/${formData.id}/${capitalizedName}`,
                { CA1: CA1, CA2: CA2, Ass: Ass, Exam: Exam },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 201 || response.status === 200) {
                setNotification({ type: 'success', message: `✅ Subject **${name}** data successfully posted! Status: ${response.status}` });
            } else {
                const dataMessage = response.data?.message || response.data?.error || response.statusText;
                throw new Error(`Submission failed with status ${response.status}. Message: ${dataMessage}`);
            }
        } catch (error) {
            console.error("Subject Submission Error:", error);
            let errorMessage = "An unknown error occurred during submission.";
            if (error.response) {
                errorMessage = `API Error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
            } else if (error.request) {
                errorMessage = "No response received from the server. Check network connection.";
            } else {
                errorMessage = `Client Error: ${error.message}`;
            }
            setNotification({ type: 'error', message: `❌ Failed to submit **${name}**: ${errorMessage}` });
        } finally {
            setPostingSubjectIndex(null);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    // Fetch student list on component mount
    useEffect(()=>{
        setIsFetchingList(true);
        axios.get(STUDENT_LIST_URL)
            .then((response)=> {
                const apiNames = response.data.map(student => ({
                    name: student.studentName,
                    id: student._id,
                    class :student.class,
                    studentName: student.studentName,
                    term: student.term,
                    session: student.session,
                    admissionNo:student.admissionNo,
                    sex: student.sex,
                    image: student.studentPhoto,
                    password: student.password
                }));
                const names = [...MOCK_STUDENT_DATA, ...apiNames.filter(a => !MOCK_STUDENT_DATA.some(m => m.id === a.id))];
                setStudentList(names);
            })
            .catch(error => {
                console.warn("Could not fetch real student list, using mock data.", error);
                setStudentList(MOCK_STUDENT_DATA);
            })
            .finally(() => {
                setIsFetchingList(false);
            });
    },[])

    const fetchStudentList = async () => {
        if (studentList.length > 0) {
            setShowStudentList(true);
            return;
        }

        setIsFetchingList(true);
        setNotification({ type: 'info', message: "Fetching student list..." });
        setSearchQuery('');
        setClassFilter(''); // Reset class filter when fetching/opening
        
        try {
            // Re-use the useEffect logic to fetch list
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowStudentList(true);
            setNotification(null);
        } catch (error) {
            console.error("Error fetching student list:", error);
            setNotification({
                type: 'error',
                message: `Failed to fetch student list. Check the console for details.`
            });
            setTimeout(() => setNotification(null), 5000);
        } finally {
            setIsFetchingList(false);
        }
    };

    // Select a Student from the List
    const handleStudentSelect = (student) => {
        let mockPhoto = null;
        if (student.id === "ATBS/N1/2024/001") {
            // Mocking an existing photo for the first student
            mockPhoto = "/aiiflogo.jpg"; 
        } else {
            mockPhoto = null;
        }

        setFormData(prev => ({
            ...prev,
            studentName: student.name,
            id: student.id,
            class :student.class,
            studentName: student.studentName,
            term: student.term,
            session: student.session,
            admissionNo:student.admissionNo,
            sex: student.sex,
            image: student.studentPhoto,
            password: student.password // Set the mock existing URL
        }));

        setImagePreview(null);
        setPhotoFile(null);
        setShowStudentList(false);
        setNotification({
            type: 'success',
            message: `Selected **${formData.image}** (ID: ${student.id})`
        });
        setTimeout(() => setNotification(null), 5000);
    };

    // Filtered List Logic (MODIFIED TO INCLUDE CLASS FILTER)
    const filteredStudentList = useMemo(() => {
        let filteredList = studentList;
        
        // 1. Apply Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredList = filteredList.filter(student =>
                student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query)
            );
        }

        // 2. Apply Class Filter (NEW LOGIC)
        if (classFilter) {
            // Case-insensitive filtering on the class field
            filteredList = filteredList.filter(student =>
                student.class && student.class.toLowerCase() === classFilter.toLowerCase()
            );
        }

        return filteredList;
    }, [studentList, searchQuery, classFilter]); // <-- DEPENDENCY UPDATED

    // Define the six required fields
    const studentClassFields = [
        { label: "Student Name", name: "studentName", type: "text" },
        { label: "Class", name: "class", type: "text" },
        { label: "Admission No", name: "admissionNo", type: "text"}, 
        { label: "Term", name: "term", type: "text" },
        { label: "Sex", name: "sex", type: "text" },
        { label: "Password", name: "password", type: "number" },
        { label: "Session", name: "session", type: "text" },
    ];


    const renderSubjectEntry = (subject, index) => {
        const namesUsedByOthers = usedSubjectNames.filter((_, i) => i !== index);

        const availableSubjectsForDropdown = ALL_SUBJECTS.filter(
            name => !namesUsedByOthers.includes(name)
        );

        const isPostingRow = postingSubjectIndex === index;

        return (
            <div key={index} style={styles.subjectCard}>

                {/* Subject Dropdown | Remove Button | Submit Button */}
                <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '0.6rem', gap: '0.3rem' }}>

                    <select
                        style={styles.subjectInput}
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        aria-label={`Subject Name for row ${index + 1}`}
                    >
                        <option value={subject.name}>{subject.name}</option>

                        {availableSubjectsForDropdown.filter(name => name !== subject.name).map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={() => removeSubject(index)}
                        style={{
                            ...styles.removeButton,
                            backgroundColor: '#fee2e2', border: '1px solid #f87171',
                            width: '2rem', height: '2rem', lineHeight: '1.25rem',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.color = '#b91c1c'; e.currentTarget.style.backgroundColor = '#fecaca'; }}
                        onMouseOut={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; }}
                        aria-label="Remove subject"
                        title="Remove Subject"
                    >
                        &times;
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSingleSubjectSubmission(index)}
                        disabled={isPostingRow || !formData.id}
                        style={{
                            padding: '0.3rem 0.4rem', fontSize: '0.75rem', fontWeight: '700',
                            color: '#fff',
                            backgroundColor: isPostingRow ? '#a855f7' : '#915ec0ff',
                            borderRadius: '0.5rem', border: 'none',
                            cursor: (isPostingRow || !formData.id) ? 'not-allowed' : 'pointer',
                            flexGrow: 1, maxWidth: '10rem', alignSelf: 'stretch',
                            opacity: (!formData.id) ? 0.6 : 1,
                        }}
                        onMouseOver={(e) => { if (!isPostingRow && formData.id) e.currentTarget.style.backgroundColor = '#7e22ce'; }}
                        onMouseOut={(e) => { if (!isPostingRow && formData.id) e.currentTarget.style.backgroundColor = '#9333ea'; }}
                        aria-label="Submit this subject's scores"
                        title="Submit Subject Data"
                    >
                        {isPostingRow ? 'Sending...' : 'Submit Row'}
                    </button>
                </div>

                {/* Scores Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.3rem', marginTop: '0.3rem',
                }}>
                    {['CA1', 'CA2', 'Ass', 'Exam'].map((field) => (
                        <div key={field}>
                            <label style={styles.scoreLabel}>{field} {field === 'Exam' ? '(100)' : '(20)'}</label>
                            <input
                                type="number"
                                style={styles.input}
                                value={subject[field]}
                                onChange={(e) => handleSubjectChange(index, field, parseInt(e.target.value) || 0)}
                                placeholder={field}
                                min="0"
                                max={field === 'Exam' ? '100' : '20'}
                                aria-label={`${field} score for ${subject.name}`}
                                disabled={!formData.id}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // --------------------------------------------------------------------------------
    // --- MAIN RENDER ---
    // --------------------------------------------------------------------------------

    return (
        <div style={styles.container}>
            <h1 style={{textAlign: 'center', margin: '1rem 0'}}>
                <img src="/aiiflogo.png" alt="School Logo" width={100} height={100 }/></h1> 
            <h1 style={styles.title}>
                Student Data Entry 📝
            </h1>

            {/* Notification Box */}
            {notification && (
                <div style={getNotificationStyle(notification.type)}>
                    {notification.message}
                </div>
            )}

            <div style={styles.form}>

                {/* 1. Student & Class Details */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #3b82f6', position: 'relative' }}>
                    <div style={styles.studentDetailsHeader}>
                        <legend style={{ ...styles.legend, color: '#2563eb' }}>Student Info</legend>
                        <button
                            type="button"
                            onClick={fetchStudentList}
                            disabled={isFetchingList}
                            style={{
                                ...styles.listButton,width:"100px",
                                backgroundColor: isFetchingList ? '#fb923c' : styles.listButton.backgroundColor
                            }}
                            onMouseOver={(e) => { if (!isFetchingList) e.currentTarget.style.backgroundColor = styles.listButtonHover.backgroundColor; }}
                            onMouseOut={(e) => { if (!isFetchingList) e.currentTarget.style.backgroundColor = styles.listButton.backgroundColor; }}
                        >
                            {isFetchingList ? 'Loading Names...' : 'Student List 📋'}
                        </button>
                    </div>
                    
                    {/* Student Info Content Container (Flexible/Stacking Layout) */}
                    <div style={{
                        display: 'flex', 
                        flexDirection: window.innerWidth < 768 ? 'column' : 'row', // Responsive Column/Row
                        gap: '1rem', 
                        marginBottom: '0.8rem', 
                        paddingTop: '0.3rem',
                    }}>
                        {/* Photo Upload Section (Minimised/Professional) */}
                        <div style={{ flexShrink: 0, width: '120px', margin: '0 auto' }}>
                            <div style={styles.photoContainer}>
                                <div style={styles.photoPreview}>
                                    {/* Display NEW preview OR EXISTING photo OR Placeholder */}
                                    {imagePreview || formData.image ? (
                                        <img 
                                            src={imagePreview || formData.image} 
                                            alt="Student Preview" 
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <span style={{color: '#9ca3af', fontSize: '0.8rem'}}>
                                            {formData.image? <img 
                                            src={formData.image} 
                                            alt="Student Preview" 
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        /> :" No Photo"} </span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    onChange={handlePhotoFileChange}
                                    style={styles.photoInput}
                                    accept="image/*"
                                />
                                <button
                                    type="button"
                                    onClick={handleSubmitStudentPhoto}
                                    disabled={!formData.id || isPostingPhoto || !photoFile}
                                    style={{
                                        ...styles.uploadButton,
                                        backgroundColor: isPostingPhoto ? '#1e40af' : styles.uploadButton.backgroundColor,
                                        cursor: (!formData.id || isPostingPhoto || !photoFile) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isPostingPhoto ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            </div>
                        </div>


                        {/* Student Info Text Inputs (takes up the rest of the space) */}
                        <div style={{ flexGrow: 1 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                                {studentClassFields.map((field) => (
                                    <div key={field.name}>
                                        <label style={styles.scoreLabel}>{field.label}</label>
                                        <input
                                            type={field.type}
                                            name={field.name}
                                            value={formData[field.name]}
                                            onChange={handleChange}
                                            style={styles.input}
                                            disabled={!formData.id && field.name !== 'admissionNo'} // Disable if no student selected
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit Info Button */}
                    <button
                        type="button"
                        onClick={handleSubmitStudentInfo}
                        disabled={!formData.id || isPostingInfo}
                        style={{
                            ...styles.submitButton, 
                            backgroundColor: isPostingInfo ? '#1d4ed8' : '#3b82f6', 
                            color: '#fff', 
                            marginTop: '0.5rem',
                            cursor: (!formData.id || isPostingInfo) ? 'not-allowed' : 'pointer'
                        }}
                        onMouseOver={(e) => { if (!isPostingInfo && formData.id) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                        onMouseOut={(e) => { if (!isPostingInfo && formData.id) e.currentTarget.style.backgroundColor = '#3b82f6'; }}
                    >
                        {isPostingInfo ? 'Submitting Info...' : 'Update Student Info'}
                    </button>

                </fieldset>

                {/* 2. Subject Scores */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #9333ea' }}>
                    <legend style={{ ...styles.legend, color: '#9333ea' }}>Subject Scores</legend>
                    
                    {formData.subjects.map(renderSubjectEntry)}

                    <button
                        type="button"
                        onClick={addSubject}
                        disabled={!formData.id || ALL_SUBJECTS.length <= usedSubjectNames.length}
                        style={{
                            ...styles.submitButton,
                            backgroundColor: '#c084fc', color: '#fff', marginTop: '0.5rem',
                            cursor: (!formData.id || ALL_SUBJECTS.length <= usedSubjectNames.length) ? 'not-allowed' : 'pointer'
                        }}
                        onMouseOver={(e) => { if (formData.id && ALL_SUBJECTS.length > usedSubjectNames.length) e.currentTarget.style.backgroundColor = '#a855f7'; }}
                        onMouseOut={(e) => { if (formData.id && ALL_SUBJECTS.length > usedSubjectNames.length) e.currentTarget.style.backgroundColor = '#c084fc'; }}
                    >
                        Add Subject ➕
                    </button>

                </fieldset>
                
                {/* 3. Remarks Section */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #10b981' }}>
                    <legend style={{ ...styles.legend, color: '#059669' }}>Remarks</legend>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                            <label style={styles.scoreLabel}>Head Teacher Remark</label>
                            <textarea
                                name="headRemark"
                                value={formData.headRemark}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '3rem' }}
                                disabled={!formData.id}
                            />
                        </div>
                        <div>
                            <label style={styles.scoreLabel}>Class Teacher Remark</label>
                            <textarea
                                name="classTeacherRemark"
                                value={formData.classTeacherRemark}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '3rem' }}
                                disabled={!formData.id}
                            />
                        </div>
                    </div>
                    
                    {/* Submit Remarks Button */}
                    <button
                        type="button"
                        onClick={handleSubmitRemarks}
                        disabled={!formData.id || isPostingRemarks}
                        style={{
                            ...styles.submitButton, 
                            backgroundColor: isPostingRemarks ? '#059669' : '#10b981', 
                            color: '#fff', 
                            marginTop: '0.5rem',
                            cursor: (!formData.id || isPostingRemarks) ? 'not-allowed' : 'pointer'
                        }}
                        onMouseOver={(e) => { if (!isPostingRemarks && formData.id) e.currentTarget.style.backgroundColor = '#047857'; }}
                        onMouseOut={(e) => { if (!isPostingRemarks && formData.id) e.currentTarget.style.backgroundColor = '#10b981'; }}
                    >
                        {isPostingRemarks ? 'Submitting Remarks...' : 'Update Remarks'}
                    </button>
                </fieldset>

            </div>

            {/* Student List Modal (MODIFIED TO PASS NEW PROPS) */}
            {showStudentList && (
                <StudentListModal
                    studentList={filteredStudentList}
                    isFetchingList={isFetchingList}
                    onClose={() => setShowStudentList(false)}
                    onStudentSelect={handleStudentSelect}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    classFilter={classFilter} // <-- PASS NEW PROP
                    setClassFilter={setClassFilter} // <-- PASS NEW PROP
                />
            )}
        </div>
    );
};

export default App;