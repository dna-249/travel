import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // We keep axios for the final submission logic

const DataEntryPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        photoFile: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

    const primaryColor = '#0047AB'; // Dark Blue

    // --- 1. Handle Text Input Changes ---
    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // --- 2. Handle File Input Change (Local Preview) ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                photoFile: file,
            });
            // Create a temporary URL for immediate visual feedback
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, photoFile: null });
            setImagePreview(null);
        }
    };

    // --- 3. Handle Form Submission (Axios + FormData) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage({ type: '', text: '' });

        // Basic validation
        if (!formData.studentName || !formData.studentId || !formData.photoFile) {
            setSubmitMessage({ type: 'error', text: 'Please fill all fields and upload a photo.' });
            return;
        }

        setIsSubmitting(true);

        // *** CORE FILE UPLOAD LOGIC ***
        const dataToSend = new FormData();
        dataToSend.append('studentName', formData.studentName);
        dataToSend.append('studentId', formData.studentId);
        // 'studentPhoto' must match the field name your API server expects for the file
        dataToSend.append('studentPhoto', formData.photoFile); 

        try {
            // NOTE: Replace 'YOUR_API_ENDPOINT_HERE' with your actual data submission endpoint
            // Since we don't have a live endpoint, this is a mock API call:
            // const response = await axios.post('YOUR_API_ENDPOINT_HERE', dataToSend, {
            //     headers: { 'Content-Type': 'multipart/form-data' },
            // });
            
            // --- MOCK API CALL START ---
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
            console.log('Mock Submission successful:', dataToSend);
            // --- MOCK API CALL END ---


            setSubmitMessage({ type: 'success', text: `Data for ${formData.studentName} submitted successfully!` });
            
            // Clear the form after success
            setFormData({ studentName: '', studentId: '', photoFile: null });
            setImagePreview(null);

        } catch (error) {
            console.error('Submission failed:', error);
            setSubmitMessage({ type: 'error', text: 'Data submission failed. Check server console.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="entry-page-container">
            <style jsx>{`
                .entry-page-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 30px 1rem;
                    font-family: Arial, sans-serif;
                }
                .entry-card {
                    width: 100%;
                    max-width: 700px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    border: 1px solid #e5e7eb;
                }
                .entry-header {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: ${primaryColor};
                    margin-bottom: 30px;
                    text-align: center;
                }
                .form-group {
                    margin-bottom: 20px;
                }
                .form-group label {
                    display: block;
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #374151;
                }
                .input-field {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s;
                    box-sizing: border-box;
                }
                .input-field:focus {
                    border-color: ${primaryColor};
                    outline: none;
                }
                .submit-button {
                    width: 100%;
                    padding: 14px;
                    margin-top: 20px;
                    color: white;
                    font-weight: 700;
                    border: none;
                    border-radius: 8px;
                    background-color: #10b981; /* Green accent color */
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .submit-button:hover:not(:disabled) {
                    background-color: #059669;
                }
                .submit-button:disabled {
                    background-color: #9ca3af;
                    cursor: not-allowed;
                }
                .message-success {
                    color: #059669;
                    background-color: #d1fae5;
                    border: 1px solid #34d399;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .message-error {
                    color: #dc2626;
                    background-color: #fee2e2;
                    border: 1px solid #f87171;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .photo-upload-section {
                    display: flex;
                    align-items: flex-start;
                    gap: 30px;
                }
                .photo-preview {
                    width: 150px;
                    height: 150px;
                    border: 2px dashed #ccc;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .photo-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            `}</style>

            <div className="entry-card">
                <h1 className="entry-header">
                    New Student Data Entry 💾
                </h1>
                
                <button 
                    style={{padding: '8px 15px', background: '#e0e7ff', color: primaryColor, border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px'}}
                    onClick={() => navigate('/admin/dashboard')}
                >
                    &larr; Back to Dashboard
                </button>

                <form onSubmit={handleSubmit}>
                    
                    <div className="form-group">
                        <label htmlFor="studentName">Student Name (Full)</label>
                        <input
                            type="text"
                            id="studentName"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="studentId">Admission Number (Unique ID)</label>
                        <input
                            type="text"
                            id="studentId"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleInputChange}
                            className="input-field"
                            required
                            inputMode="numeric"
                            pattern="\d*"
                        />
                    </div>

                    <div className="form-group">
                        <label>Student Photo</label>
                        <div className="photo-upload-section">
                            <div className="photo-preview">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Student Preview" />
                                ) : (
                                    <span style={{color: '#9ca3af', fontSize: '0.8rem', textAlign: 'center'}}>150x150</span>
                                )}
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{marginTop: '40px'}}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting Data...' : 'Save New Student Data'}
                    </button>
                </form>

                {submitMessage.text && (
                    <div className={submitMessage.type === 'success' ? 'message-success' : 'message-error'}>
                        {submitMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataEntryPage;