import axios from 'axios';
import React, { useState } from 'react';

// Mock API URL for demonstration purposes
const API_URL = "https://mock-api.dev/student/report/entry";

// Initial state structure matching the report card data for easy binding
const INITIAL_FORM_DATA = {
    // --- School/Student Info (Simplified) ---
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    studentName: "SAMBO MUHAMMAD MALAMIYO",
    class: "NURSERY CLASS 1",
    term: "FIRST TERM",
    session: "ACADEMIC YEAR 2024/2025",
    admissionNo: "ATBS/N1/2017/005",
    sex: "Male",
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect",

    // --- Subject Scores ---
    subjects: [
        { name: "QUR'AN", CA1: 5, CA2: 6, Ass: 4, Exam: 55 },
        { name: "TAJWEED", CA1: 7, CA2: 5, Ass: 6, Exam: 54 },
    ],
};

// --- Stylesheet Object (Ultra Compact Design) ---
const styles = {
    // Container Styles (Ultra Reduced Padding)
    container: {
        padding: '0.1rem', // FURTHER REDUCED for minimal screen margin
        backgroundColor: '#f3f4f6', // gray-100
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
    },
    title: {
        fontSize: '1.5rem', 
        fontWeight: '800', 
        color: '#1e40af', // blue-800
        marginBottom: '0.5rem', // FURTHER REDUCED
        textAlign: 'center',
        borderBottom: '2px solid #bfdbfe', // Slightly thinner border
        paddingBottom: '0.35rem', // FURTHER REDUCED
    },
    form: {
        maxWidth: '48rem', // max-w-4xl
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '0.75rem', // FURTHER REDUCED
        borderRadius: '0.75rem', 
        boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.05)', 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem', // FURTHER REDUCED (space between fieldsets)
    },
    // Fieldset Styles (Ultra Reduced Padding)
    fieldset: {
        padding: '0.35rem', // FURTHER REDUCED
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow-inner
    },
    legend: {
        padding: '0 0.5rem',
        fontSize: '1.125rem', // text-lg
        fontWeight: '700',
    },
    input: {
        width: '100%',
        padding: '0.3rem', // FURTHER REDUCED
        border: '1px solid #d1d5db', 
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
    },
    // Subject Entry Specific Styles (Ultra Reduced Padding)
    subjectCard: {
        padding: '0.3rem', // FURTHER REDUCED
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)', // shadow-md
        marginBottom: '0.2rem', // FURTHER REDUCED
        border: '1px solid #e5e7eb', 
    },
    subjectInput: {
        width: '100%',
        padding: '0.4rem', 
        marginBottom: '0.4rem', 
        borderBottom: '2px solid #60a5fa', 
        fontWeight: '700',
        fontSize: '0.9rem', 
        backgroundColor: '#f9fafb', 
        borderRadius: '0.5rem 0.5rem 0 0',
        border: 'none',
    },
    scoreInput: {
        width: '100%',
        padding: '0.15rem', // FURTHER REDUCED
        border: '1px solid #d1d5db',
        borderRadius: '0.4rem', 
        textAlign: 'center',
        fontSize: '0.8rem', 
    },
    scoreLabel: {
        display: 'block',
        fontSize: '0.65rem', 
        fontWeight: '600',
        color: '#4b5563', 
        marginBottom: '0', // REMOVED MARGIN
    },
    // Button Styles
    submitButton: {
        padding: '0.4rem 1.25rem', // FURTHER REDUCED
        fontSize: '0.85rem', // Slightly smaller text
        fontWeight: '700', 
        color: '#fff',
        borderRadius: '9999px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
    },
    // Notification Styles
    notificationBase: {
        marginTop: '0.15rem', // FURTHER REDUCED
        marginBottom: '0.35rem', // FURTHER REDUCED
        padding: '0.6rem', // Reduced padding
        textAlign: 'center',
        fontWeight: '500', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.3s',
        border: '2px solid',
        maxWidth: '48rem',
        margin: '0.15rem auto 0.35rem auto' // Reduced vertical margins
    },
    notificationSuccess: {
        backgroundColor: '#d1fae5', 
        color: '#065f46', 
        borderColor: '#10b981', 
    },
    notificationError: {
        backgroundColor: '#fee2e2', 
        color: '#991b1b', 
        borderColor: '#ef4444', 
    },
};

// Component to handle the array of subjects (reusable)
const SubjectEntry = ({ subject, index, handleSubjectChange, removeSubject }) => (
    <div style={styles.subjectCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}> {/* Reduced margin */}
            {/* Subject Name - Full width, more visible */}
            <input
                type="text"
                style={styles.subjectInput}
                value={subject.name}
                onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                placeholder="Subject Name"
            />
            <button
                type="button"
                onClick={() => removeSubject(index)}
                style={{
                    color: '#ef4444', // text-red-500
                    marginLeft: '0.5rem',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    padding: '0 0.25rem',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'} // hover:text-red-700
                onMouseOut={(e) => e.currentTarget.style.color = '#ef4444'}
                aria-label="Remove subject"
            >
                &times;
            </button>
        </div>

        {/* Scores Grid - FORCED 4 COLUMNS on all views */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', // CHANGED to 4 columns (4fr) for all views, including mobile
            gap: '0.3rem', 
            marginTop: '0.3rem', 
        }}>
            {['CA1', 'CA2', 'Ass', 'Exam'].map((field) => (
                <div key={field}>
                    <label style={styles.scoreLabel}>{field} {field === 'Exam' ? '(100)' : '(20)'}</label>
                    <input
                        type="number"
                        style={styles.scoreInput}
                        value={subject[field]}
                        onChange={(e) => handleSubjectChange(index, field, parseInt(e.target.value) || 0)}
                        placeholder={field}
                        min="0"
                        max={field === 'Exam' ? '100' : '20'}
                    />
                </div>
            ))}
        </div>
    </div>
);

// Main Data Entry Form Component
const App = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [isPosting, setIsPosting] = useState(false);
    const [notification, setNotification] = useState(null);

    // Handler for simple top-level fields
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
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            subjects: newSubjects
        }));
    };
    
    // Add new subject row
    const addSubject = () => {
        setFormData(prev => ({
            ...prev,
            subjects: [
                ...prev.subjects,
                { name: `NEW SUBJECT ${prev.subjects.length + 1}`, CA1: 0, CA2: 0, Ass: 0, Exam: 0 }
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

    // Simulate POST request
    const handleSubmit = async (e) => {
        e.preventDefault();
    
    setIsPosting(true);
    setNotification(null);

    const apiUrl = 'https://portal-database-seven.vercel.app/student/create';


   await axios.post(
    apiUrl,
    formData
  )
.then((response) => { // response object is available here!
    console.log("Server Response Data:", response.data); 

    // **Look for an error message or a specific success/failure flag here.**
    if (response.data && response.data.status === 'error') {
        // Server-side custom error handling
        throw new Error(response.data.message || 'Server-side creation failed.');
    }

    // ... rest of your success logic
})
.catch((error) => {
    // ... your existing catch block will now handle the custom throw
});
    setIsPosting(false);
    setTimeout(() => setNotification(null), 7000);
}


    // Define the six required fields
    const studentClassFields = [
        { label: "Student Name", name: "studentName", type: "text" },
        { label: "Class", name: "class", type: "text" },
        { label: "Admission No", name: "admissionNo", type: "text" },
        { label: "Term", name: "term", type: "text" },
        { label: "Sex", name: "sex", type: "text" },
        { label: "Session", name: "session", type: "text" },
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Student Report Card Data Entry
            </h1>

            {/* Notification Box */}
            {notification && (
                <div style={{
                    ...styles.notificationBase, 
                    ...(notification.type === 'success' ? styles.notificationSuccess : styles.notificationError)
                }}>
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                {/* 1. Student & Class Details */}
                <fieldset style={{...styles.fieldset, border: '2px solid #3b82f6'}}> 
                    <legend style={{...styles.legend, color: '#2563eb'}}>Student & Class Details</legend>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(1, 1fr)', // Default 1 column
                        gap: '0.6rem', // Reduced gap
                        marginTop: '0.4rem', // Reduced margin
                    }}>
                        {/* Mapped fields for Section 1 */}
                        {studentClassFields.map(({ label, name, type }) => (
                            <div key={name} style={{
                                // Simple Media Query simulation for 2 columns on desktop
                                '@media (min-width: 768px)': {
                                    gridColumn: 'span 1 / span 1',
                                    display: 'inline-block' 
                                }
                            }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    style={styles.input}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>

                {/* 2. Subject Scores */}
                <fieldset style={{...styles.fieldset, border: '2px solid #10b981'}}> 
                    <legend style={{...styles.legend, color: '#059669'}}>Subject Scores</legend>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}> {/* Reduced gap */}
                        {formData.subjects.map((subject, index) => (
                            <SubjectEntry 
                                key={index} 
                                index={index} 
                                subject={subject} 
                                handleSubjectChange={handleSubjectChange} 
                                removeSubject={removeSubject}
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            onClick={addSubject} 
                            style={{
                                marginTop: '0.4rem', // FURTHER REDUCED
                                padding: '0.3rem 0.7rem', // FURTHER REDUCED
                                fontSize: '0.75rem', // Smaller text
                                backgroundColor: '#10b981', 
                                color: '#fff', 
                                fontWeight: '600', 
                                borderRadius: '0.5rem', 
                                transition: 'background-color 0.2s', 
                                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'} 
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                            + Add Subject
                        </button>
                    </div>
                </fieldset>

                {/* 3. Remarks */}
                <fieldset style={{...styles.fieldset, border: '2px solid #f59e0b'}}> 
                    <legend style={{...styles.legend, color: '#d97706'}}>Teacher/Head Remarks</legend>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.5rem', // Reduced gap
                        marginTop: '0.4rem', // Reduced margin
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Class Teacher Remark</label>
                            <textarea
                                name="classTeacherRemark"
                                value={formData.classTeacherRemark}
                                onChange={handleChange}
                                rows="3"
                                style={styles.input}
                            ></textarea>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.1rem' }}>Head of School Remark</label>
                            <textarea
                                name="headRemark"
                                value={formData.headRemark}
                                onChange={handleChange}
                                rows="3"
                                style={styles.input}
                            ></textarea>
                        </div>
                    </div>
                </fieldset>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.3rem' }}>
                    <button
                        type="submit"
                        disabled={isPosting}
                        style={{
                            ...styles.submitButton,
                            backgroundColor: isPosting ? '#6b7280' : '#2563eb', // gray-500 or blue-600
                            cursor: isPosting ? 'not-allowed' : 'pointer',
                        }}
                        // Simulating hover/active states via JS for a pure inline style experience
                        onMouseOver={(e) => { if (!isPosting) e.currentTarget.style.backgroundColor = '#1d4ed8'; }} // hover:bg-blue-700
                        onMouseOut={(e) => { if (!isPosting) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                    >
                        {isPosting ? (
                            <>
                                <svg 
                                    style={{ marginRight: '0.5rem', height: '1.25rem', width: '1.25rem', color: '#fff', animation: 'spin 1s linear infinite' }} 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    fill="none" 
                                    viewBox="0 0 24 24"
                                >
                                    {/* Spinner animation keyframes are not possible inline, but the style property adds the spinning effect */}
                                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting Data...
                            </>
                        ) : (
                            '🚀 POST Report Data to API'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default App;
