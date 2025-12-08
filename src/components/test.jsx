import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔑 Professional Style & Best Practices: Forgot Password/Reset Component

const Scroll = () => {
    // State Management
    // Removed 'token' state as it's not typically used for the *initial* reset request
    const [username, setUsername] = useState(''); // Student Name for verification
    const [newPassword, setNewPassword] = useState(''); // New password field
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // State for structured error display
    const [success, setSuccess] = useState(false); // New state for success indicator
    const nav = useNavigate();

    /**
     * Handles the password reset request attempt.
     * In a real application, this would typically be a two-step process:
     * 1. Request reset link/code (using username/email).
     * 2. Use link/code to set new password.
     * This implementation simplifies it to a single request for demonstration.
     * @async
     */
    const handlePasswordReset = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        // 1. Clear previous status
        setError(null);
        setSuccess(false);

        // Basic validation
        if (!username.trim() || !newPassword.trim()) {
            setError("Please enter your name and the new password.");
            return;
        }

        setLoading(true);

        try {
            // NOTE: The API endpoint and request body are hypothetical for a password change/reset.
            // Replace with your actual reset/update password endpoint.
            const res = await axios.put(
                `https://portal-database-seven.vercel.app/student/${username}`, // Changed API endpoint
                {
                    password: newPassword.trim(), 
                }
            );
            
            // 2. SUCCESS: Password updated
            console.log('Password reset successful:', res.data);
            setSuccess(true);
            
            // Optional: Redirect back to the login page after a brief delay
            setTimeout(() => {
                nav("/"); // Redirect to the original sign-in page
            }, 3000); 

        } catch (err) {
            // 3. ERROR: Reset failed (e.g., username not found)
            console.error('Password Reset error:', err.response?.data || err.message);
            const errorMessage = err.response?.data?.message || "Password reset failed. Check your student name.";
            setError(errorMessage);
        } finally {
            // 4. FINALLY: Reset loading state
            setLoading(false);
        }
    };

    // Removed the handleVerify and useEffect blocks as they are specific to the login flow.

    return (
        <div className="portal-container">
            <div className="sign-in-box">
                <header>
                    <img src="/aiiflogo.png" width={100} height={100 } alt="Attasfiyah Logo"/>
                    {/* Updated Header Text */}
                    <h3>Reset Your Password</h3>
                    <p className="subtitle">Enter your **name** to create new password</p> 
                </header>

                <form onSubmit={handlePasswordReset}> 
                    {/* Input field 1: Username/Name */}
                    <input
                        type="text"
                        // Updated Placeholder
                        placeholder="Enter Student Name/School ID" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading || success}
                    />
                    {/* Input field 2: New Password */}
                    <input
                        type="password"
                        // Updated Placeholder
                        placeholder="Enter New Password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        disabled={loading || success}
                    />

                    {/* Removed Checkbox as it's irrelevant for password reset */}
                    <div className="controls-row">
                        <span onClick={() => nav('/')} style={{cursor: 'pointer', color: '#007bff'}}>
                            Go back to Sign In
                        </span>
                    </div>
                    
                    {/* --- Success/Error Indicator --- */}
                    {error && (
                        <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>
                            ❌ {error}
                        </p>
                    )}
                    
                    {success && !loading && (
                        <p className="success-message" style={{ color: 'green', fontWeight: 'bold' }}>
                            ✅ Password Successfully Reset! Redirecting to login...
                        </p>
                    )}
                    {/* --- End Status Indicator --- */}

                    {/* The button is a submit button */}
                    <button type="submit" disabled={loading || success}>
                        {/* Updated Button Text */}
                        {loading ? 'Processing...' : 'Set New Password'} 
                    </button>
                </form>

                <footer>
                    <p className="footer-note">Powered by **dnaTech@2025**</p>
                </footer>
            </div>
        </div>
    );
}

export default Scroll; // Renamed export