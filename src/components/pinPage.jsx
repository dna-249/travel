import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// IMPORTANT: In a production environment, this Admin PIN should NEVER be stored 
// in the front-end code. It should be securely checked via a server-side API.
const ADMIN_SECRET_PIN = "2025"; 

const AdminPinPage = () => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (pin === ADMIN_SECRET_PIN) {
            // Success: Navigate to the Admin Dashboard (e.g., '/admin/dashboard')
            // Note: You must define this route in your router (e.g., App.jsx)
            navigate('/admin'); 
        } else {
            setError('Invalid Admin PIN. Please check and try again.');
        }
    };

    const primaryColor = '#0047AB'; // Dark Blue

    return (
        <div className="pin-page-container">
            <style jsx>{`
                .pin-page-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 1rem;
                    font-family: Arial, sans-serif;
                }
                .pin-card {
                    width: 100%;
                    max-width: 380px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                }
                .logo-image {
                    margin: 0 auto 12px;
                    height: 80px;
                    width: 80px;
                    object-fit: cover;
                    border-radius: 50%;
                    border: 2px solid rgba(0, 71, 171, 0.5);
                }
                .portal-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-top: 12px;
                    color: #1f2937;
                }
                .form-header {
                    font-size: 1.125rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                    text-align: center;
                    color: #b91c1c; /* Use Red for Admin Access Warning/Accent */
                }
                .input-field {
                    width: 100%;
                    padding: 12px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 1.125rem;
                    transition: border-color 0.3s, box-shadow 0.3s;
                    box-sizing: border-box;
                }
                .input-field:focus {
                    border-color: ${primaryColor};
                    box-shadow: 0 0 0 3px rgba(0, 71, 171, 0.2);
                    outline: none;
                }
                .submit-button {
                    width: 100%;
                    padding: 14px;
                    margin-top: 16px;
                    color: white;
                    font-weight: 700;
                    border: none;
                    border-radius: 8px;
                    background-color: ${primaryColor};
                    cursor: pointer;
                    transition: background-color 0.3s, box-shadow 0.3s;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .submit-button:hover {
                    background-color: #003685;
                }
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .footer-text {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-top: 24px;
                }
            `}</style>

            <div className="pin-card">
                
                {/* School Header / Logo */}
                <div style={{marginBottom: '24px'}}>
                    <img src="/aiiflogo.png"  style={{margin:'auto'}}  width={100} height={100 }/>
                    <h1 className="portal-title">
                        Admin Access
                    </h1>
                </div>

                <hr style={{marginBottom: '24px', border: 'none', borderTop: '1px solid #bfdbfe'}} />

                <form onSubmit={handleSubmit}>
                    <h2 className="form-header">
                        Administrative PIN Required
                    </h2>
                    
                    <div style={{marginBottom: '16px'}}>
                        <label 
                            htmlFor="pin" 
                            style={{display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'left'}}
                        >
                            Admin PIN
                        </label>
                        <input
                            // Use type="password" for security
                            type="password" 
                            id="pin"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            placeholder="****"
                            className="input-field"
                            style={error ? {borderColor: '#ef4444'} : {}}
                            inputMode="numeric"
                        />
                    </div>

                    {error && (
                        <p className="error-message">
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Login as Admin
                    </button>
                </form>

                <p className="footer-text">
                    This is a secure area. Unauthorized access is prohibited.
                </p>
            </div>
        </div>
    );
};

export default AdminPinPage;