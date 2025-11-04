import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

// API endpoints (Kept for reference, but API call is mocked/replaced)
const BASE_API_URL = "https://portal-database-seven.vercel.app/student";
const STUDENT_LIST_URL = `${BASE_API_URL}`;
// API endpoints for PUT/PATCH (MOCKING THESE ENDPOINTS)
const STUDENT_INFO_URL = (id) => `${BASE_API_URL}/${id}`;
const REMARKS_URL = (id) => `${BASE_API_URL}/${id}`;
// MOCK URL for Photo Upload (REPLACE WITH YOUR ACTUAL ENDPOINT)
const PHOTO_UPLOAD_URL = (id) => `/api/upload-photo/${id}`; // Example mock endpoint

// --- MASTER LIST OF ALL AVAILABLE SUBJECTS (Unchanged) ---
const ALL_SUBJECTS = [
    "QUR'AN", "TAJWEED", "TAUHEED", "FIQH", "HADITH", "ARABIC", "AZKHAR",
    "SIRAH", "HURUF"
]

// Initial state structure (Changed studentName)
const INITIAL_FORM_DATA = {
    // --- School/Student Info (Simplified) ---
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    studentName: "NURA IBRAHIM",
    class: "NURSERY CLASS 1",
    term: "FIRST TERM",
    session: "ACADEMIC YEAR 2024/2025",
    admissionNo: "ATBS/N1/2024/001", // Updated admissionNo (used as ID for the API)
    sex: "Female",
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect",
    
    // --- Subject Scores (Using the first few subjects as defaults) ---
    subjects: [
        { name: "QUR'AN", CA1: '', CA2: '', Ass: '', Exam: '', },
    ],
};

// --- Stylesheet Object (Modified to include photo styles) ---
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
    studentListItemHover: {
        backgroundColor: '#f3f4f6', fontWeight: '600',
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
    // Styles for Photo Upload
    photoContainer: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', 
        padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', 
        backgroundColor: '#f9fafb', width: '100%'
    },
    photoPreview: {
        width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden',
        border: '3px solid #10b981', marginBottom: '0.5rem', objectFit: 'cover',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
    },
    photoInput: {
        fontSize: '0.8rem',
        padding: '0.3rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        width: '100%',
        boxSizing: 'border-box'
    },
    uploadButton: {
        marginTop: '0.5rem',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '0.4rem 0.8rem',
        fontSize: '0.8rem',
        fontWeight: '600',
        borderRadius: '0.4rem',
        cursor: 'pointer',
        border: 'none',
        transition: 'background-color 0.2s',
        minWidth: '100px',
        width: '100%',
    },
};

// --- Helper function to format notification styles
const getNotificationStyle = (type) => ({
    ...styles.notificationBase,
    ...(type === 'success' ? styles.notificationSuccess : type === 'error' ? styles.notificationError : styles.notificationInfo)
});


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

    const MOCK_STUDENT_DATA = [
        { name: "NURA IBRAHIM", id: "ATBS/N1/2024/001" },
        { name: "MARYAM UMAR", id: "ATBS/N1/2024/002" },
        { name: "SAMBO MUHAMMAD MALAMIYO", id: "ATBS/N1/2017/005" },
        { name: "AISHA BELLO", id: "ATBS/P1/2020/010" },
    ];

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

    // Submit Student Photo (uses FormData)
    const handleSubmitStudentPhoto = async () => {
        if (!formData.admissionNo) {
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

        const dataToSend = new FormData();
        dataToSend.append('studentPhoto', photoFile); 
        dataToSend.append('studentId', formData.admissionNo); 

        try {
            // --- MOCK API Call for Photo Upload START ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log('Mock Photo Submission successful for ID:', formData.admissionNo, 'File:', photoFile.name);
            const mockResponse = { status: 200 };
            // --- MOCK API Call END ---

            if (mockResponse.status === 200 || mockResponse.status === 201) {
                setNotification({ type: 'success', message: `📷 Photo for **${formData.studentName}** successfully uploaded! (Status: 200)` });
            } else {
                throw new Error(`Submission failed with status ${mockResponse.status}.`);
            }
        } catch (error) {
            console.error("Photo Submission Error (Mocked):", error);
            setNotification({ type: 'error', message: `❌ Failed to submit Photo: ${error.message || 'Network/Mocking Error'}` });
        } finally {
            setIsPostingPhoto(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };
    
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
        if (!formData.admissionNo) {
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
            sex: formData.sex,
            school: formData.school,
        };

        try {
            const response = await axios.put(
                STUDENT_INFO_URL(formData.admissionNo),
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                setNotification({ type: 'success', message: `✅ Student Info for **${formData.studentName}** successfully updated! (Status: 200)` });
            } else {
                throw new Error(`Submission failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Student Info Submission Error (Mocked):", error);
            setNotification({ type: 'error', message: `❌ Failed to submit Student Info: ${error.message || 'Network/Mocking Error'}` });
        } finally {
            setIsPostingInfo(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    // Submit Remarks Fields
    const handleSubmitRemarks = async () => {
        if (!formData.admissionNo) {
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
                REMARKS_URL(formData.admissionNo),
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 || response.status === 201) {
                setNotification({ type: 'success', message: `✅ Remarks for **${formData.studentName}** successfully updated! (Status: 200)` });
            } else {
                throw new Error(`Submission failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Remarks Submission Error (Mocked):", error);
            setNotification({ type: 'error', message: `❌ Failed to submit Remarks: ${error.message || 'Network/Mocking Error'}` });
        } finally {
            setIsPostingRemarks(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    // Submit a Single Subject Row
    const handleSingleSubjectSubmission = async (index) => {
        if (!formData.admissionNo) {
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
                `https://portal-database-seven.vercel.app/student/push/${formData.admissionNo}/${capitalizedName}`,
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
                    id: student._id 
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
        
        try {
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
        setFormData(prev => ({
            ...prev,
            studentName: student.name,
            admissionNo: student.id, 
        }));
        setShowStudentList(false);
        setNotification({
            type: 'success',
            message: `Selected **${student.name}** (ID: ${student.id}). You can now enter scores and remarks.`
        });
        setTimeout(() => setNotification(null), 5000);
    };

    // Filtered List Logic
    const filteredStudentList = useMemo(() => {
        if (!searchQuery) {
            return studentList;
        }
        const query = searchQuery.toLowerCase();
        return studentList.filter(student =>
            student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query)
        );
    }, [studentList, searchQuery]);

    // Define the six required fields
    const studentClassFields = [
        { label: "Student Name", name: "studentName", type: "text" },
        { label: "Class", name: "class", type: "text" },
        { label: "Admission No", name: "admissionNo", type: "text", disabled: true }, 
        { label: "Term", name: "term", type: "text" },
        { label: "Sex", name: "sex", type: "text" },
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
                        disabled={isPostingRow || !formData.admissionNo}
                        style={{
                            padding: '0.3rem 0.4rem', fontSize: '0.75rem', fontWeight: '700',
                            color: '#fff',
                            backgroundColor: isPostingRow ? '#a855f7' : '#915ec0ff',
                            borderRadius: '0.5rem', border: 'none',
                            cursor: (isPostingRow || !formData.admissionNo) ? 'not-allowed' : 'pointer',
                            flexGrow: 1, maxWidth: '10rem', alignSelf: 'stretch',
                            opacity: (!formData.admissionNo) ? 0.6 : 1,
                        }}
                        onMouseOver={(e) => { if (!isPostingRow && formData.admissionNo) e.currentTarget.style.backgroundColor = '#7e22ce'; }}
                        onMouseOut={(e) => { if (!isPostingRow && formData.admissionNo) e.currentTarget.style.backgroundColor = '#9333ea'; }}
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
                                disabled={!formData.admissionNo}
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
            <h1 style={{textAlign: 'center', margin: '1rem 0'}}><img src="/aiiflogo.jpg" alt="School Logo" width={100} height={100 }/></h1> 
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
                    
                    {/* MODIFIED: Student Info Content Container (1fr stacking on small screens) */}
                    <div style={{
                        display: 'flex', 
                        flexDirection: 'column', // Stacks column-wise on small screens
                        gap: '1rem', 
                        marginBottom: '0.8rem', 
                        paddingTop: '0.3rem',
                        // Note: For actual row layout on large screens with inline styles, 
                        // you'd need a CSS library or the use of `window.innerWidth`. 
                        // For demonstration, we keep it column-stacked primarily.
                        // For a quick fix simulating large screen:
                        '@media (min-width: 768px)': { 
                            flexDirection: 'row', 
                        }
                    }}>
                        {/* Photo Upload Section */}
                        <div style={{flexShrink: 0, width: '120px', margin: '0 auto'}}>
                            <div style={styles.photoContainer}>
                                <div style={styles.photoPreview}>
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Student Preview" style={{objectFit: 'cover', width: '100%', height: '100%'}} />
                                    ) : (
                                        <span style={{color: '#9ca3af', fontSize: '0.7rem', textAlign: 'center'}}>No Photo</span>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoFileChange}
                                    style={styles.photoInput}
                                    aria-label="Student Photo Upload"
                                />
                                <button
                                    type="button"
                                    onClick={handleSubmitStudentPhoto}
                                    disabled={isPostingPhoto || !formData.admissionNo || !photoFile}
                                    style={{
                                        ...styles.uploadButton,
                                        backgroundColor: isPostingPhoto ? '#047857' : styles.uploadButton.backgroundColor,
                                        cursor: (isPostingPhoto || !formData.admissionNo || !photoFile) ? 'not-allowed' : 'pointer',
                                        opacity: (!formData.admissionNo || !photoFile) ? 0.6 : 1,
                                    }}
                                >
                                    {isPostingPhoto ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            </div>
                        </div>

                        {/* Student Details Grid (Fields) */}
                        <div style={{
                            display: 'grid', 
                            // MODIFIED: Single 1fr column for maximum stacking (as requested)
                            gridTemplateColumns: '1fr', 
                            gap: '0.6rem', 
                            flexGrow: 1,
                            // Fallback for wider screens:
                            '@media (min-width: 400px)': { 
                                 gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                            }
                        }}>
                            {studentClassFields.map(({ label, name, type, disabled }) => (
                                <div key={name}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>{label}</label>
                                    <input
                                        type={type} name={name} value={formData[name]} onChange={handleChange}
                                        style={styles.input} required
                                        disabled={disabled}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Student Info Submission Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={handleSubmitStudentInfo}
                            disabled={isPostingInfo || !formData.admissionNo}
                            style={{
                                ...styles.submitButton,
                                backgroundColor: isPostingInfo ? '#4f46e5' : '#6366f1',
                                color: '#fff',
                                cursor: (isPostingInfo || !formData.admissionNo) ? 'not-allowed' : 'pointer',
                                opacity: (!formData.admissionNo) ? 0.6 : 1,
                            }}
                            onMouseOver={(e) => { if (!isPostingInfo && formData.admissionNo) e.currentTarget.style.backgroundColor = '#4338ca'; }}
                            onMouseOut={(e) => { if (!isPostingInfo && formData.admissionNo) e.currentTarget.style.backgroundColor = '#6366f1'; }}
                        >
                            {isPostingInfo ? 'Saving Info...' : 'Submit Student Info 💾'}
                        </button>
                    </div>
                </fieldset>

                {/* --- Student List Modal (Unchanged) --- */}
                {showStudentList && (
                    <div style={styles.listModalOverlay} onClick={() => setShowStudentList(false)}>
                        <div style={styles.listModalContent} onClick={(e) => e.stopPropagation()}>
                            <h4 style={{ margin: '0 0 1rem 0', color: '#1f2937', textAlign: 'center' }}>Select a Student</h4>
                            <button style={styles.closeButton} onClick={() => setShowStudentList(false)} title="Close List">&times;</button>
                            <div style={styles.searchContainer}>
                                <input
                                    type="text" placeholder="Search by Name or ID..." style={styles.searchInput}
                                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            {filteredStudentList.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {filteredStudentList.map(student => (
                                        <li
                                            key={student.id} onClick={() => handleStudentSelect(student)} style={styles.studentListItem}
                                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = styles.studentListItemHover.backgroundColor; e.currentTarget.style.fontWeight = styles.studentListItemHover.fontWeight; }}
                                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = styles.studentListItem.backgroundColor; e.currentTarget.style.fontWeight = 'normal'; }}
                                        >
                                            {student.name}
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {student.id}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#6b7280' }}>No students found matching your search.</p>
                            )}
                        </div>
                    </div>
                )}
                
                {/* 2. Subject Scores Fieldset (Unchanged) */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #10b981' }}>
                    <legend style={{ ...styles.legend, color: '#059669' }}>Subject Scores</legend>
                    
                    {formData.subjects.map(renderSubjectEntry)}

                    <button
                        type="button"
                        onClick={addSubject}
                        disabled={formData.subjects.length >= ALL_SUBJECTS.length}
                        style={{
                            ...styles.submitButton,
                            width: '100%', backgroundColor: '#fcd34d', color: '#92400e',
                            marginTop: '0.75rem', opacity: formData.subjects.length >= ALL_SUBJECTS.length ? 0.6 : 1,
                        }}
                        onMouseOver={(e) => { if (formData.subjects.length < ALL_SUBJECTS.length) e.currentTarget.style.backgroundColor = '#fbbf24'; }}
                        onMouseOut={(e) => { if (formData.subjects.length < ALL_SUBJECTS.length) e.currentTarget.style.backgroundColor = '#fcd34d'; }}
                    >
                        + Add Subject Row
                    </button>
                </fieldset>
                
                {/* 3. Remarks Fieldset (Unchanged) */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #f97316' }}>
                    <legend style={{ ...styles.legend, color: '#ea580c' }}>Remarks</legend>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Head Teacher Remark</label>
                            <textarea
                                name="headRemark"
                                value={formData.headRemark}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '4rem' }}
                                disabled={!formData.admissionNo}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Class Teacher Remark</label>
                            <textarea
                                name="classTeacherRemark"
                                value={formData.classTeacherRemark}
                                onChange={handleChange}
                                style={{ ...styles.input, minHeight: '4rem' }}
                                disabled={!formData.admissionNo}
                            />
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                        <button
                            type="button"
                            onClick={handleSubmitRemarks}
                            disabled={isPostingRemarks || !formData.admissionNo}
                            style={{
                                ...styles.submitButton,
                                backgroundColor: isPostingRemarks ? '#b45309' : '#f97316',
                                color: '#fff',
                                cursor: (isPostingRemarks || !formData.admissionNo) ? 'not-allowed' : 'pointer',
                                opacity: (!formData.admissionNo) ? 0.6 : 1,
                            }}
                            onMouseOver={(e) => { if (!isPostingRemarks && formData.admissionNo) e.currentTarget.style.backgroundColor = '#ea580c'; }}
                            onMouseOut={(e) => { if (!isPostingRemarks && formData.admissionNo) e.currentTarget.style.backgroundColor = '#f97316'; }}
                        >
                            {isPostingRemarks ? 'Saving Remarks...' : 'Submit Remarks ✨'}
                        </button>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

export default App;