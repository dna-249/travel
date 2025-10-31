import axios from 'axios';
import React, { useState,useEffect } from 'react';

// Mock API URL for demonstration purposes
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

    // --- Subject Scores (The input format) ---
    subjects: [
        { name: "QUR'AN", CA1: "", CA2: "", Ass: "", Exam: "", },
        { name: "TAJWEED", CA1: "", CA2: "", Ass: "", Exam: "", },
        { name:"TAUHEED", CA1:"", CA2:"", Ass:"",  Exam:""},
        { name: "FIQH",CA1:"",  CA2:"",    Ass:"",Exam:"" },
        { name: "HADITH",CA1:"", CA2:"", Ass:"",  Exam:"" },
        { name: "ARABIC",CA1:"", CA2:"", Ass:"",  Exam:"" },
        { name: "AZKHAR",CA1:"", CA2:"", Ass:"",  Exam:"" },
        { name: "SIRAH",CA1:"" , CA2:"", Ass:"",  Exam:"" },
        { name: "HURUF",CA1:"", CA2:"", Ass:"",  Exam:"" },

    ],
};

// --- Stylesheet Object (Ultra Compact Design) ---
const styles = {
    container: {
        padding: '0.1rem', 
        backgroundColor: '#f3f4f6', 
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif', 
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
    },
    title: {
        fontSize: '1.5rem', 
        fontWeight: '800', 
        color: '#1e40af', 
        marginBottom: '0.5rem', 
        textAlign: 'center',
        borderBottom: '2px solid #bfdbfe', 
        paddingBottom: '0.35rem', 
    },
    form: {
        maxWidth: '48rem', 
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '0.75rem', 
        borderRadius: '0.75rem', 
        boxShadow: '0 8px 12px -3px rgba(0, 0, 0, 0.1), 0 3px 5px -2px rgba(0, 0, 0, 0.05)', 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem', 
    },
    fieldset: {
        padding: '0.35rem', 
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.06)', 
        border: 'none', 
    },
    legend: {
        padding: '0 0.5rem',
        fontSize: '1.125rem', 
        fontWeight: '700',
    },
    input: {
        width: '100%',
        padding: '0.3rem', 
        border: '1px solid #d1d5db', 
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', 
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    subjectCard: {
        padding: '0.3rem', 
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.05)', 
        marginBottom: '0.2rem', 
        border: '1px solid #e5e7eb', 
    },
    subjectInput: {
        width: '100%',
        padding: '0.4rem', 
        borderBottom: '2px solid #60a5fa', 
        fontWeight: '700',
        fontSize: '0.9rem', 
        backgroundColor: '#f9fafb', 
        borderRadius: '0.5rem',
        border: 'none',
        transition: 'background-color 0.2s',
        flexGrow: 2,
    },
    removeButton: {
        color: '#ef4444', 
        fontSize: '1.25rem',
        fontWeight: '700',
        padding: '0 0.25rem',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        alignSelf: 'center',
        flexShrink: 0,
    },
    scoreInput: {
        width: '100%',
        padding: '0.15rem', 
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
        marginBottom: '0', 
    },
    notificationBase: {
        marginTop: '0.15rem', 
        marginBottom: '0.35rem', 
        padding: '0.6rem', 
        textAlign: 'center',
        fontWeight: '500', 
        borderRadius: '0.75rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
        transition: 'all 0.3s',
        border: '2px solid',
        maxWidth: '48rem',
        margin: '0.15rem auto 0.35rem auto'
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

// --- Helper function to format notification styles
const getNotificationStyle = (type) => ({
    ...styles.notificationBase,
    ...(type === 'success' ? styles.notificationSuccess : styles.notificationError)
});

/**
 * SubjectEntry Component for managing scores for a single subject.
 */
const SubjectEntry = ({ subject, index, handleSubjectChange, removeSubject, handleSingleSubjectSubmission, isPostingRow }) => {
    useEffect(() => {
      axios.get("https://portal-database-seven.vercel.app/student")
      .then((res)=>{console.log(res)})
      .catch(()=>{})

    }, [])
    



    return (
        <div style={styles.subjectCard}>
            
            {/* The main subject action bar: Subject Input | Remove Button | Submit Button */}
            <div style={{ display: 'flex', alignItems: 'stretch', marginBottom: '0.6rem', gap: '0.3rem' }}>
                
                {/* Subject Name Input */}
                <input
                    type="text"
                    style={styles.subjectInput}
                    value={subject.name}
                    onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                    placeholder="Subject Name"
                    aria-label={`Subject Name for row ${index + 1}`}
                />
                
                {/* Remove Button */}
                <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    style={{
                        ...styles.removeButton,
                        backgroundColor: '#fee2e2',
                        border: '1px solid #f87171',
                        width: '2rem', 
                        height: '2rem', 
                        lineHeight: '1.25rem',
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
                    onClick={() => handleSingleSubjectSubmission(index)} // Call the specific submission handler
                    disabled={isPostingRow}
                    style={{
                        padding: '0.3rem 0.4rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        color: '#fff',
                        backgroundColor: isPostingRow ? '#a855f7' : '#915ec0ff', // Darken when posting
                        borderRadius: '0.5rem',
                        border: 'none',
                        cursor: isPostingRow ? 'not-allowed' : 'pointer',
                        flexGrow: 1, 
                        maxWidth: '10rem', 
                        alignSelf: 'stretch', 
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
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
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
                            aria-label={`${field} score for ${subject.name}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * Main Data Entry Form Component
 */
const App = () => {
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    // Track which subject index is currently being submitted
    const [postingSubjectIndex, setPostingSubjectIndex] = useState(null); 
    const [notification, setNotification] = useState(null);

    // Handler for all form field changes (main info and subjects)
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

    // --- CRITICAL UPDATE: Submit a Single Subject Row with MINIMAL PAYLOAD ---
    const handleSingleSubjectSubmission = async (index) => {
        setPostingSubjectIndex(index);
        setNotification(null);

        const subjectToSubmit = formData.subjects[index];
        const { name, ...scores } = subjectToSubmit;

        // 1. Transform the single subject into the required API format (Key-Value map)
        const capitalizedName = name.toUpperCase().replace(/[^A-Z0-9]/g, ''); 
        if (!capitalizedName) {
            setNotification({ type: 'error', message: "Subject name cannot be empty." });
            setPostingSubjectIndex(null);
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        const transformedSubjects = { [capitalizedName]: [scores] };

        // 2. Construct the final payload for the API, including ONLY the subject data.
        // **This fulfills the request to submit ONLY the row's data.**
        const apiPayload = {
            subjects: transformedSubjects, 
        };

        console.log(`Minimal API Payload for row ${index} being sent:`, apiPayload);
        const { CA1,CA2,Exam ,Ass} = scores;
        
        try {
            const response = await axios.put(
               `https://portal-database-seven.vercel.app/student/push/69035c3974cb429bc5e4d248/${capitalizedName}`,
                {CA1:CA1,CA2:CA2, Ass:Ass, Exam:Exam},
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
                // If the API failed because the required metadata (like student name, class, etc.) was missing:
                if (error.response.status === 400) {
                     errorMessage = `API Error (400 - Bad Request): The server likely requires student/class metadata which was not included in this minimal payload. Message: ${error.response.data?.message || error.response.statusText}`;
                } else {
                    errorMessage = `API Error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
                }
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
    // --- END CRITICAL UPDATE ---

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
                Student Data Entry 📝
            </h1>

            {/* Notification Box */}
            {notification && (
                <div style={getNotificationStyle(notification.type)}>
                    {notification.message}
                </div>
            )}

            {/* The main form container is now purely for layout */}
            <div style={styles.form}> 
                
                {/* 1. Student & Class Details (Data is held in state, but not submitted here) */}
                <fieldset style={{...styles.fieldset, border: '2px solid #3b82f6'}}> 
                    <legend style={{...styles.legend, color: '#2563eb'}}>Student & Class Details</legend>
                    
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: '0.6rem', 
                        marginTop: '0.4rem', 
                    }}>
                        {studentClassFields.map(({ label, name, type }) => (
                            <div key={name}>
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
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}> 
                        {formData.subjects.map((subject, index) => (
                            <SubjectEntry 
                                key={index} 
                                index={index} 
                                subject={subject} 
                                handleSubjectChange={handleSubjectChange} 
                                removeSubject={removeSubject}
                                handleSingleSubjectSubmission={handleSingleSubjectSubmission}
                                isPostingRow={postingSubjectIndex === index} // Pass the posting state for that specific row
                            />
                        ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button 
                            type="button" 
                            onClick={addSubject} 
                            style={{
                                marginTop: '0.4rem', 
                                padding: '0.3rem 0.7rem', 
                                fontSize: '0.75rem', 
                                backgroundColor: '#10b981', 
                                color: '#fff', 
                                fontWeight: '600', 
                                borderRadius: '0.5rem', 
                                transition: 'background-color 0.2s', 
                                boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#059669';}} 
                            onMouseOut={(e) => {e.currentTarget.style.backgroundColor = '#10b981';}}
                        >
                            + Add Subject
                        </button>
                    </div>
                </fieldset>

                {/* 3. Remarks (Data is held in state, but not submitted here) */}
                <fieldset style={{...styles.fieldset, border: '2px solid #f59e0b'}}> 
                    <legend style={{...styles.legend, color: '#d97706'}}>Teacher/Head Remarks</legend>
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0.5rem', 
                        marginTop: '0.4rem', 
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
            </div>
        </div>
    );
};

export default App;