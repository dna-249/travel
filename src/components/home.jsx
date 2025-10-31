import axios from "axios";
import React, { useState } from "react";

// 🚀 Professional Style & Best Practices: Login/Auth Component

/**
 * @typedef {object} LoginCredentials
 * @property {string} school - The username/school ID (as expected by the API).
 * @property {string} sex - The password (used as 'sex' key in the API payload).
 */

// Use a more specific name reflecting its purpose, like 'StudentSignIn' or 'PortalLoginForm'
const StudentSignIn = () => {
    // 1. State Management: Use object for related state for cleaner updates, or keep separate for simplicity.
    // We'll keep them separate as in the original, but with professional naming.
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); // Renamed for accurate semantics
    const [isLoading, setIsLoading] = useState(false); // New state for professional user feedback
    const [error, setError] = useState(null); // New state for structured error display

    const API_URL = 'https://portal-database-seven.vercel.app/student/create';

    /**
     * Handles the sign-in attempt, managing state for loading and errors.
     * @async
     */
    const handleSignIn = async (e) => {
        e.preventDefault(); // Prevents default form submission if wrapped in a <form>

        if (isLoading) return; // Prevent double submission

        // 2. Input Validation (Basic): Essential for professional code.
        if (!username || !password) {
            setError("Please enter both a username and password.");
            return;
        }

        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            // 3. API Call: Using descriptive payload variable.
            /** @type {LoginCredentials} */
            const payload = {
                school: username, // Map 'username' state to the API's 'school' field
                sex: password,   // Map 'password' state to the API's 'sex' field (NOTE: 'sex' is an odd key for a password, but maintained for API compatibility)
            };

            const response = await axios.post(API_URL, payload);

            console.log("API Response:", response.data);

            // 4. Structured Success/Error Check: Handle application-level errors from the server.
            if (response.data?.status === 'error') {
                throw new Error(response.data.message || 'Server-side creation failed.');
            }

            // SUCCESS LOGIC:
            // e.g., Redirect user, save token to storage, update global auth state.
            console.log("Sign-in successful!", response.data);

        } catch (err) {
            // 5. Robust Error Handling: Differentiate between Axios (network) and custom errors.
            const errorMessage = err.response?.data?.message
                || err.message
                || "An unexpected error occurred during sign-in.";

            setError(errorMessage);
            console.error("Sign-in/API error:", err);

        } finally {
            // 6. Cleanup: Always stop loading state, regardless of outcome.
            setIsLoading(false);
        }
    };

    return (
        // 7. HTML Structure: Wrap content in a <form> for better accessibility and event handling
        <div className="portal-container">
            <div className="sign-in-box">
                <header>
                    <h3>Welcome to Attasfiyah Portal</h3>
                    <p className="subtitle">Sign in to Continue</p>
                </header>

                {/* The form calls handleSignIn on submit */}
                <form onSubmit={handleSignIn}>
                    {/* Input fields */}
                    <input
                        type="text"
                        placeholder="Enter Username/School ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required // HTML required attribute for basic form validation
                        disabled={isLoading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    {/* Checkbox and Error Display */}
                    <div className="controls-row">
                        <label className="remember-me">
                            <input type="checkbox" disabled={isLoading} /> Remember Me
                        </label>
                    </div>
                    
                    {error && (
                        <p className="error-message">{error}</p> // Display structured error
                    )}

                    {/* The button is now a submit button and displays loading state */}
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <footer>
                    <p className="footer-note">Powered by **dnaTech@2025**</p>
                </footer>
            </div>
        </div>
    );
}

// 8. Export Naming: Consistent export of the renamed component.
export default StudentSignIn;