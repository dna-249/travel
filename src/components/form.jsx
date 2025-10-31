import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';

// API endpoints (Kept for reference, but API call is mocked/replaced)
const BASE_API_URL = "https://portal-database-seven.vercel.app/student";
const STUDENT_LIST_URL = `${BASE_API_URL}`;

// --- MASTER LIST OF ALL AVAILABLE SUBJECTS (Unchanged) ---
const ALL_SUBJECTS = [
    "QUR'AN", "TAJWEED", "TAUHEED", "FIQH", "HADITH", "ARABIC", "AZKHAR",
    "SIRAH", "HURUF"]

// Initial state structure (Changed studentName)
const INITIAL_FORM_DATA = {
    // --- School/Student Info (Simplified) ---
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    // Changed default name to NURA
    studentName: "NURA IBRAHIM", 
    class: "NURSERY CLASS 1",
    term: "FIRST TERM",
    session: "ACADEMIC YEAR 2024/2025",
    admissionNo: "ATBS/N1/2024/001", // Updated admissionNo
    sex: "Female",
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect",

    // --- Subject Scores (Using the first few subjects as defaults) ---
    subjects: [
        { name: "QUR'AN", CA1: 0, CA2: 0, Ass: 0, Exam: 0, },
      ],
};

// --- Stylesheet Object (Unchanged) ---
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
    subjectInput: { // Used for the select element
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
};

// --- Helper function to format notification styles
const getNotificationStyle = (type) => ({
    ...styles.notificationBase,
    ...(type === 'success' ? styles.notificationSuccess : styles.notificationError)
});


/**
 * Main Data Entry Form Component
 */
const App = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [postingSubjectIndex, setPostingSubjectIndex] = useState(null);
    const [notification, setNotification] = useState(null);

    // States for Student List Feature
    const [showStudentList, setShowStudentList] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [isFetchingList, setIsFetchingList] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // --- Memoized list of currently USED subject names ---
    const usedSubjectNames = useMemo(() => {
        // Collect all names currently in use in the form, converting to uppercase for comparison.
        return formData.subjects.map(s => s.name.toUpperCase());
    }, [formData.subjects]);

    // Handler for main form field changes
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    // Handler for Subject array changes
    const handleSubjectChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        newSubjects[index] = {
            ...newSubjects[index],
            // Ensure subject name is always uppercase for consistency with ALL_SUBJECTS list
            [field]: field === 'name' ? value.toUpperCase() : value
        };
        setFormData(prev => ({
            ...prev,
            subjects: newSubjects
        }));
    };

    // Add new subject row
    const addSubject = () => {
        // Find the first available subject not currently in use
        const nextSubject = ALL_SUBJECTS.find(name => !usedSubjectNames.includes(name)) || `NEW SUBJECT ${formData.subjects.length + 1}`;
        
        // Prevent adding a row if all subjects are already used
        if (nextSubject.startsWith("NEW SUBJECT")) {
             setNotification({ type: 'error', message: "All available subjects are already added to the list." });
             setTimeout(() => setNotification(null), 5000);
             return;
        }

        setFormData(prev => ({
            ...prev,
            subjects: [
                ...prev.subjects,
                // Assign the first available subject name
                { name: nextSubject, CA1: 0, CA2: 0, Ass: 0, Exam: 0 }
            ]
        }));
    };

    // Remove subject row
    const removeSubject = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            // FIX: The original code had an error here: `prev.subjects.subjects.filter`
            subjects: prev.subjects.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Submit a Single Subject Row (Kept logic for completeness)
    const handleSingleSubjectSubmission = async (index) => {
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
            // This API call is left as is, assuming a working API endpoint exists for PUT.
            const response = await axios.put(
                // Note: The ID '69035c3974cb429bc5e4d248' is hardcoded here.
                `https://portal-database-seven.vercel.app/student/push/69035c3974cb429bc5e4d248/${capitalizedName}`,
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
            console.error("Submission Error:", error);
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

    // --- MODIFIED: Fetch Student List to include Nura and Maryam ---
    const fetchStudentList = async () => {
        setIsFetchingList(true);
        setNotification(null);
        setSearchQuery('');
        
        // --- MOCK API DATA: Include Nura and Maryam as requested ---
        const MOCK_STUDENT_DATA = [
            { name: "NURA IBRAHIM", id: "ATBS/N1/2024/001" },
            { name: "MARYAM UMAR", id: "ATBS/N1/2024/002" },
            // Add a few placeholder/original students for a richer list
            { name: "SAMBO MUHAMMAD MALAMIYO", id: "ATBS/N1/2017/005" },
            { name: "AISHA BELLO", id: "ATBS/P1/2020/010" },
        ];
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Replaced API call with mock data
            const names = MOCK_STUDENT_DATA.map(student => ({
                name: student.name,
                id: student.id 
            }));

            // Optional: If you wanted to fetch real data AND merge the names:
            /*
            const response = await axios.get(STUDENT_LIST_URL);
            const apiNames = response.data.map(student => ({
                name: student.studentName,
                id: student._id
            }));
            const names = [...MOCK_STUDENT_DATA, ...apiNames.filter(a => !MOCK_STUDENT_DATA.some(m => m.id === a.id))];
            */
            
            setStudentList(names);
            setShowStudentList(true);
        } catch (error) {
            console.error("Error fetching student list (Mocked function error):", error);
            setNotification({
                type: 'error',
                message: `Failed to fetch student list. Check the console for details.`
            });
            setTimeout(() => setNotification(null), 7000);
        } finally {
            setIsFetchingList(false);
        }
    };

    // Select a Student from the List (Kept logic for completeness)
    const handleStudentSelect = (student) => {
        setFormData(prev => ({
            ...prev,
            studentName: student.name,
            admissionNo: student.id, // Set admissionNo from the selected student's ID
            // Optionally, you might want to fetch the rest of their data here
        }));
        setShowStudentList(false);
        setNotification({
            type: 'success',
            message: `Selected **${student.name}**. Now enter their scores.`
        });
        setTimeout(() => setNotification(null), 5000);
    };

    // Filtered List Logic (Unchanged)
    const filteredStudentList = useMemo(() => {
        if (!searchQuery) {
            return studentList;
        }
        const query = searchQuery.toLowerCase();
        return studentList.filter(student =>
            student.name.toLowerCase().includes(query) || student.id.toLowerCase().includes(query)
        );
    }, [studentList, searchQuery]);

    // Define the six required fields (Unchanged)
    const studentClassFields = [
        { label: "Student Name", name: "studentName", type: "text" },
        { label: "Class", name: "class", type: "text" },
        { label: "Admission No", name: "admissionNo", type: "text" },
        { label: "Term", name: "term", type: "text" },
        { label: "Sex", name: "sex", type: "text" },
        { label: "Session", name: "session", type: "text" },
    ];


    // --------------------------------------------------------------------------------
    // --- SUBJECT ENTRY LOGIC (Embedded in App component JSX) ---
    // --------------------------------------------------------------------------------

    const renderSubjectEntry = (subject, index) => {
        // 1. Determine which subjects are *not* currently used by other rows
        const namesUsedByOthers = usedSubjectNames.filter((_, i) => i !== index);

        // 2. Create the selective list for the dropdown
        const availableSubjectsForDropdown = ALL_SUBJECTS.filter(
            // Filter to include subjects that are NOT used by others AND are NOT the current subject
            name => !namesUsedByOthers.includes(name)
        );

        const isPostingRow = postingSubjectIndex === index;

        return (
            <div key={index} style={styles.subjectCard}>

                {/* Subject Dropdown | Remove Button | Submit Button */}
                <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '0.6rem', gap: '0.3rem' }}>

                    {/* MODIFIED: Subject Name Dropdown/Select */}
                    <select
                        style={styles.subjectInput}
                        value={subject.name}
                        onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                        aria-label={`Subject Name for row ${index + 1}`}
                    >
                        {/* Always include the current subject as the default selected option */}
                        <option value={subject.name}>{subject.name}</option>

                        {/* List other UNUSED subjects */}
                        {availableSubjectsForDropdown.filter(name => name !== subject.name).map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    {/* Remove Button */}
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

                    {/* Submit Subject Button */}
                    <button
                        type="button"
                        onClick={() => handleSingleSubjectSubmission(index)}
                        disabled={isPostingRow}
                        style={{
                            padding: '0.3rem 0.4rem', fontSize: '0.75rem', fontWeight: '700',
                            color: '#fff', backgroundColor: isPostingRow ? '#a855f7' : '#915ec0ff',
                            borderRadius: '0.5rem', border: 'none', cursor: isPostingRow ? 'not-allowed' : 'pointer',
                            flexGrow: 1, maxWidth: '10rem', alignSelf: 'stretch',
                        }}
                        onMouseOver={(e) => { if (!isPostingRow) e.currentTarget.style.backgroundColor = '#7e22ce'; }}
                        onMouseOut={(e) => { if (!isPostingRow) e.currentTarget.style.backgroundColor = '#9333ea'; }}
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
                        <legend style={{ ...styles.legend, color: '#2563eb' }}>Student Name</legend>
                        <button
                            type="button"
                            onClick={fetchStudentList}
                            disabled={isFetchingList}
                            style={{
                                ...styles.listButton,
                                backgroundColor: isFetchingList ? '#fb923c' : styles.listButton.backgroundColor
                            }}
                            onMouseOver={(e) => { if (!isFetchingList) e.currentTarget.style.backgroundColor = styles.listButtonHover.backgroundColor; }}
                            onMouseOut={(e) => { if (!isFetchingList) e.currentTarget.style.backgroundColor = styles.listButton.backgroundColor; }}
                        >
                            {isFetchingList ? 'Loading Names...' : 'Student List 📋'}
                        </button>
                    </div>

                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.6rem', marginTop: '0.4rem',
                    }}>
                        {studentClassFields.map(({ label, name, type }) => (
                            <div key={name}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>{label}</label>
                                <input
                                    type={type} name={name} value={formData[name]} onChange={handleChange}
                                    style={styles.input} required
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* --- Student List Modal (Unchanged in structure) --- */}
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
                                            {/* You will now see Nura and Maryam in this list */}
                                            {student.name}
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {student.id.substring(0, 8)}...</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#dc2626', marginTop: '1rem' }}>
                                    {searchQuery ? `No student found matching "${searchQuery}".` : 'No students found in the list.'}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                {/* --- END Student List Modal --- */}


                {/* 2. Subject Scores */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #10b981' }}>
                    <legend style={{ ...styles.legend, color: '#059669'}}>Subject Scores</legend>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {/* RENDER THE SUBJECT ROWS */}
                        {formData.subjects.map(renderSubjectEntry)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={addSubject}
                            style={{
                                marginTop: '0.4rem', padding: '0.3rem 0.7rem', fontSize: '0.75rem',
                                backgroundColor: '#10b981', color: '#fff', fontWeight: '600',
                                borderRadius: '0.5rem', transition: 'background-color 0.2s',
                                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)', border: 'none', cursor: 'pointer'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#059669'; }}
                            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; }}
                        >
                            + Add Subject
                        </button>
                    </div>
                </fieldset>

                {/* 3. Remarks (Unchanged) */}
                <fieldset style={{ ...styles.fieldset, border: '2px solid #f59e0b' }}>
                    <legend style={{ ...styles.legend, color: '#d97706'}}>Teacher/Head Remarks</legend>
                    <div style={{
                        display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.4rem',
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Class Teacher Remark</label>
                            <textarea
                                name="classTeacherRemark" value={formData.classTeacherRemark} onChange={handleChange}
                                rows="3" style={styles.input}
                            ></textarea>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Head of School Remark</label>
                            <textarea
                                name="headRemark" value={formData.headRemark} onChange={handleChange}
                                rows="3" style={styles.input}
                            ></textarea>
                        </div>
                    </div>
                </fieldset>
            </div>
        </div>
    );
};

export default App;