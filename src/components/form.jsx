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
    // Fields for student and class details are now strictly limited to the six requested fields
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect",

    // --- Subject Scores ---
    subjects: [
        { name: "QUR'AN", CA1: 5, CA2: 6, Ass: 4, Exam: 55 },
        { name: "TAJWEED", CA1: 7, CA2: 5, Ass: 6, Exam: 54 },
    ],
};

// --- Stylesheet Object (Replicating Tailwind's visual design) ---
const styles = {
    // Container Styles
    container: {
        padding: '1rem',
        backgroundColor: '#f3f4f6', // gray-100
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
    },
    title: {
        fontSize: '1.5rem', // text-3xl (md)
        fontWeight: '800', // font-extrabold
        color: '#1e40af', // blue-800
        marginBottom: '1.5rem',
        textAlign: 'center',
        borderBottom: '4px solid #bfdbfe', // border-blue-200
        paddingBottom: '0.75rem',
    },
    form: {
        maxWidth: '48rem', // max-w-4xl
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '2.5rem', // p-10 (md)
        borderRadius: '0.75rem', // rounded-xl
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', // shadow-2xl
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem', // space-y-8
    },
    // Fieldset Styles
    fieldset: {
        padding: '1.25rem',
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)', // shadow-inner
    },
    legend: {
        padding: '0 0.5rem',
        fontSize: '1.25rem', // text-xl
        fontWeight: '700', // font-bold
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db', // border-gray-300
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
    },
    // Subject Entry Specific Styles
    subjectCard: {
        padding: '0.75rem',
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // shadow-md
        marginBottom: '1rem',
        border: '1px solid #e5e7eb', // border-gray-200
    },
    subjectInput: {
        width: '100%',
        padding: '0.5rem',
        marginBottom: '0.75rem',
        borderBottom: '2px solid #60a5fa', // border-blue-400
        fontWeight: '700',
        fontSize: '1rem',
        backgroundColor: '#f9fafb', // bg-gray-50
        borderRadius: '0.5rem 0.5rem 0 0',
        border: 'none',
    },
    scoreInput: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        textAlign: 'center',
        fontSize: '0.875rem', // text-sm
    },
    scoreLabel: {
        display: 'block',
        fontSize: '0.75rem', // text-xs
        fontWeight: '600', // font-semibold
        color: '#4b5563', // text-gray-600
        marginBottom: '0.25rem',
    },
    // Button Styles
    submitButton: {
        padding: '0.75rem 2.5rem', // px-10 py-3
        fontSize: '1.125rem', // text-lg
        fontWeight: '700', // font-bold
        color: '#fff',
        borderRadius: '9999px', // rounded-full
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none',
    },
    // Notification Styles
    notificationBase: {
        marginTop: '1rem',
        marginBottom: '1.5rem',
        padding: '1rem',
        textAlign: 'center',
        fontWeight: '500', // font-medium
        borderRadius: '0.75rem', // rounded-xl
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
        transition: 'all 0.3s',
        border: '2px solid',
    },
    notificationSuccess: {
        backgroundColor: '#d1fae5', // bg-green-100
        color: '#065f46', // text-green-800
        borderColor: '#10b981', // border-green-500
    },
    notificationError: {
        backgroundColor: '#fee2e2', // bg-red-100
        color: '#991b1b', // text-red-800
        borderColor: '#ef4444', // border-red-500
    },
};

// Component to handle the array of subjects (reusable)
const SubjectEntry = ({ subject, index, handleSubjectChange }) => (
    <div style={styles.subjectCard}>
        {/* Subject Name - Full width, more visible */}
        <input
            type="text"
            style={styles.subjectInput}
            value={subject.name}
            onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
            placeholder="Subject Name"
        />
        
        {/* Scores Grid - Simplified to a clean stack for mobile view, ensuring readability */}
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', // Use 2 columns to save vertical space but keep inputs large
            gap: '0.75rem', 
        }}>
            {['CA1', 'CA2', 'Ass', 'Exam'].map((field) => (
                <div key={field}>
                    <label style={styles.scoreLabel}>{field}</label>
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
const DataEntryForm = () => {
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

    // Simulate POST request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPosting(true);
        setNotification(null);

        const postPayload = JSON.stringify(formData, null, 2);

        try {
            // Simulate the network delay and response
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            const simulatedResponse = { 
                status: 201, 
                message: "Data successfully posted.",
                payload: postPayload
            };
            
            console.log("Simulated API Response:", simulatedResponse);
            console.log("Full JSON Payload Sent:", postPayload);

            setNotification({
                type: 'success', 
                message: `✅ Data submission successful! Status: ${simulatedResponse.status}. Check console for payload.`
            });

        } catch (e) {
            console.error("Error during simulated POST request:", e);
            setNotification({type: 'error', message: '❌ POST failed. Check console for details.'});
        } finally {
            setIsPosting(false);
            // Auto-hide notification after 7 seconds
            setTimeout(() => setNotification(null), 7000);
        }
    };

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
                
                {/* 1. Student & Class Details - Simplified to a single column stack */}
                <fieldset style={{...styles.fieldset, border: '2px solid #3b82f6'}}> {/* border-blue-500 */}
                    <legend style={{...styles.legend, color: '#2563eb'}}>Student & Class Details</legend> {/* text-blue-600 */}
                    
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', // Force stacking for optimal mobile view
                        gap: '1rem', 
                        marginTop: '0.75rem',
                    }}>
                        {/* Mapped fields for Section 1 */}
                        {studentClassFields.map(({ label, name, type }) => (
                            <div key={name}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>{label}</label>
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
                <fieldset style={{...styles.fieldset, border: '2px solid #10b981'}}> {/* border-green-500 */}
                    <legend style={{...styles.legend, color: '#059669'}}>Subject Scores</legend> {/* text-green-600 */}
                    
                    {/* Desktop Header Row (Hidden on mobile for minimization) */}
                    <div style={{
                        display: 'none', 
                        gap: '0.75rem',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        color: '#4b5563',
                        marginBottom: '0.5rem',
                        padding: '0 0.75rem',
                    }}>
                        <span style={{textAlign: 'left'}}>Subject</span>
                        <span>CA1 (17%)</span>
                        <span>CA2 (17%)</span>
                        <span>ASS</span>
                        <span>EXAM (66%)</span>
                    </div>

                    {/* Subject Entries */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {formData.subjects.map((subject, index) => (
                            <SubjectEntry 
                                key={index} 
                                index={index} 
                                subject={subject} 
                                handleSubjectChange={handleSubjectChange} 
                            />
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={addSubject} style={{
                            marginTop: '1rem', 
                            padding: '0.5rem 1rem', 
                            fontSize: '0.875rem', 
                            backgroundColor: '#10b981', // bg-green-500
                            color: '#fff', 
                            fontWeight: '600', 
                            borderRadius: '0.5rem', 
                            transition: 'background-color 0.2s', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#059669'} // hover:bg-green-600
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                        >
                            + Add Subject
                        </button>
                    </div>
                </fieldset>

                {/* 3. Remarks - Simplified to a single column stack */}
                <fieldset style={{...styles.fieldset, border: '2px solid #f59e0b'}}> {/* border-yellow-500 */}
                    <legend style={{...styles.legend, color: '#d97706'}}>Teacher/Head Remarks</legend> {/* text-yellow-600 */}
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', // Force stacking for optimal mobile view
                        gap: '1rem', 
                        marginTop: '0.75rem',
                    }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Class Teacher Remark</label>
                            <textarea
                                name="classTeacherRemark"
                                value={formData.classTeacherRemark}
                                onChange={handleChange}
                                rows="3"
                                style={styles.input}
                            ></textarea>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>Head of School Remark</label>
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
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                    <button
                        type="submit"
                        disabled={isPosting}
                        style={{
                            ...styles.submitButton,
                            backgroundColor: isPosting ? '#6b7280' : '#2563eb', // bg-gray-500 or bg-blue-600
                            cursor: isPosting ? 'not-allowed' : 'pointer',
                        }}
                        // Simulating hover/active states via JS for a pure inline style experience
                        onMouseOver={(e) => { if (!isPosting) e.currentTarget.style.backgroundColor = '#1d4ed8'; }} // hover:bg-blue-700
                        onMouseOut={(e) => { if (!isPosting) e.currentTarget.style.backgroundColor = '#2563eb'; }}
                    >
                        {isPosting ? (
                            <>
                                <svg className="animate-spin" style={{ marginRight: '0.75rem', height: '1.25rem', width: '1.25rem', color: '#fff' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

export default DataEntryForm;
