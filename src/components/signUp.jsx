import axios from 'axios';
import React, { useState,useEffect } from 'react';

// --- STYLES (Combined and integrated for single-file use) ---
const styles = {
    container: {
        padding: '0.5rem', 
        backgroundColor: '#f7f9fb', 
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
    },
    title: {
        fontSize: '1.75rem', 
        fontWeight: '800', 
        color: '#1e40af', 
        marginBottom: '1rem',
        textAlign: 'center', 
        borderBottom: '3px solid #bfdbfe', 
        paddingBottom: '0.5rem',
    },
    form: {
        maxWidth: '36rem', 
        margin: '1.5rem auto', 
        backgroundColor: '#fff', 
        padding: '0.5rem',
        borderRadius: '0.75rem', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
    },
    fieldset: {
        padding: '0.75rem', 
        borderRadius: '0.5rem', 
        border: '2px solid #3b82f6',
    },
    legend: {
        padding: '0 0.5rem', 
        fontSize: '1.25rem', 
        fontWeight: '700', 
        color: '#2563eb',
    },
    // The key for responsiveness: ensures columns stack when viewport width is less than 300px (2 * 150px min)
    inputGroup: {
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '0.75rem', 
        marginTop: '0.5rem',
    },
    label: {
        display: 'block', 
        fontSize: '0.875rem', 
        fontWeight: '600', 
        color: '#374151', 
        marginBottom: '0.2rem'
    },
    input: {
        width: '100%', 
        padding: '0.5rem', 
        border: '1px solid #d1d5db', 
        borderRadius: '0.375rem',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    },
    submitButton: {
        padding: '0.75rem', 
        fontSize: '1rem', 
        fontWeight: '700', 
        color: '#fff', 
        backgroundColor: '#10b981',
        borderRadius: '0.5rem', 
        border: 'none', 
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    notificationBase: {
        padding: '0.75rem', 
        textAlign: 'center', 
        fontWeight: '600', 
        borderRadius: '0.5rem',
        maxWidth: '36rem', 
        margin: '0.5rem auto',
    },
    notificationSuccess: {
        backgroundColor: '#d1fae5', 
        color: '#065f46', 
        border: '1px solid #10b981',
    },
    notificationError: {
        backgroundColor: '#fee2e2', 
        color: '#991b1b', 
        border: '1px solid #ef4444',
    },
};

const getNotificationStyle = (type) => ({
    ...styles.notificationBase,
    ...(type === 'success' ? styles.notificationSuccess : styles.notificationError)
});
// ------------------------------------

// --- API Endpoint & INITIAL STATE (Unchanged) ---
const SIGNUP_API_URL = "https://portal-database-seven.vercel.app/student/create"; 

const INITIAL_SIGNUP_DATA = {
    studentName: '',
    sex: 'Male',
    password: '',     
    
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    class: 'NURSERY CLASS 1',
    session: "ACADEMIC YEAR 2025/2026",
    
    term: 'FIRST TERM',
    headRemark: 'N/A',
    classTeacherRemark: 'N/A',
    subjects: [],
};


const StudentSignupForm = () => {
    const [formData, setFormData] = useState(INITIAL_SIGNUP_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setNotification(null);

        // Validation check
        if (!formData.studentName || !formData.password || !formData.class) {
            setNotification({ type: 'error', message: '❌ Please fill in all required fields (Name, Password, Class).' });
            setIsSubmitting(false);
            setTimeout(() => setNotification(null), 5000);
            return;
        }

        const submissionData = { ...formData };
        
        const { password, ...logData } = submissionData;
        console.log("Submitting Student Data:", logData);

        try {
            // REALISTIC AXIOS POST REQUEST
            const response = await axios.post(
                SIGNUP_API_URL, 
                submissionData, 
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 8000
                }
            );

            if (response.status === 201 || response.status === 200) {
                const studentId = response.data.admissionNo || response.data._id || 'N/A';
                setNotification({ 
                    type: 'success', 
                    message: `✅ Student **${formData.studentName}** successfully registered! ID: ${studentId}` 
                });
                setFormData(INITIAL_SIGNUP_DATA);
            } else {
                throw new Error(`Submission failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error("Signup Submission Error:", error);
            let errorMessage = "❌ Network Error. Please check your connection.";

            if (axios.isAxiosError(error) && error.response) {
                const apiMessage = error.response.data?.message || error.response.data?.error;
                
                if (error.response.status === 400 && apiMessage) {
                    errorMessage = `❌ Validation Error: ${apiMessage}`;
                } else {
                    errorMessage = `❌ API Error (${error.response.status}): ${apiMessage || error.response.statusText}`;
                }
            } else if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
                 errorMessage = "❌ Request Timed Out or Network Blocked. Try again later.";
            }

            setNotification({ type: 'error', message: errorMessage });
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setNotification(null), 7000);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Student Enrollment & Login Setup 📝
            </h1>

            {notification && (
                <div style={getNotificationStyle(notification.type)}>
                    {notification.message}
                </div>
            )}

            <form style={styles.form} onSubmit={handleSubmit}>

                {/* --- 1. Combined Student Registration Section --- */}
                <fieldset style={styles.fieldset}>
                    <legend style={styles.legend}>Student Registration</legend>
                    <div style={styles.inputGroup}>
                        
                        {/* Full Name (1fr on mobile, 1/2 on desktop) */}
                        <div>
                            <label style={styles.label} htmlFor="studentName">Full Name *</label>
                            <input
                                type="text" id="studentName" name="studentName" value={formData.studentName} onChange={handleChange}
                                style={styles.input} required placeholder="e.g., NURA IBRAHIM"
                            />
                        </div>

                        {/* Password (1fr on mobile, 1/2 on desktop) */}
                        <div>
                            <label style={styles.label} htmlFor="password">Password *</label>
                            <input
                                type="password" id="password" name="password" value={formData.password} onChange={handleChange}
                                style={styles.input} required placeholder="Set a secure password"
                            />
                        </div>
                        
                        {/* Sex (1fr on mobile, 1/2 on desktop) */}
                        <div>
                            <label style={styles.label} htmlFor="sex">Sex *</label>
                            <select
                                id="sex" name="sex" value={formData.sex} onChange={handleChange}
                                style={styles.input} required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        
                        {/* Class (1fr on mobile, 1/2 on desktop) */}
                        <div>
                            <label style={styles.label} htmlFor="class">Class *</label>
                            <input
                                type="text" id="class" name="class" value={formData.class} onChange={handleChange}
                                style={styles.input} required placeholder="e.g., NURSERY CLASS 1"
                            />
                        </div>

                        {/* School (1fr on mobile, 1/2 on desktop - no manual span needed) */}
                         <div>
                            <label style={styles.label} htmlFor="school">School</label>
                            <input
                                type="text" id="school" name="school" value={formData.school} onChange={handleChange}
                                style={{...styles.input, backgroundColor: '#f3f4f6'}} disabled
                            />
                        </div>

                        {/* Session (1fr on mobile, 1/2 on desktop) */}
                        <div>
                            <label style={styles.label} htmlFor="session">Academic Session</label>
                            <input
                                type="text" id="session" name="session" value={formData.session} onChange={handleChange}
                                style={styles.input} placeholder="e.g., ACADEMIC YEAR 2025/2026"
                            />
                        </div>
                    </div>
                </fieldset>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                        ...styles.submitButton,alignSelf:"center",
                        backgroundColor: isSubmitting ? '#4ade80' : styles.submitButton.backgroundColor,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer'
                    }}
                    onMouseOver={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#059669'; }}
                    onMouseOut={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor; }}
                >
                    {isSubmitting ? 'Registering Student...' : 'Complete Registration'}
                </button>
            </form>
        </div>
    );
};

export default StudentSignupForm;
