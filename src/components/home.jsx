import axios from "axios";
import React, { useState ,useEffect} from "react";

import {useParams,useNavigate } from "react-router-dom"
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
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); // Renamed for accurate semantics
    const [loading, setLoading] = useState(false); // New state for professional studentName feedback
    const [error, setError] = useState(null); // New state for structured error display
   const nav = useNavigate()
    

    /**
     * Handles the sign-in attempt, managing state for loading and errors.
     * @async
     */
    const handleSignIn = async (e) => {
        e.preventDefault();
   setLoading(true)
   
    await axios.post(`https://portal-database-seven.vercel.app/student/login`,{
        studentName:username.trim(),
        password:password.trim()
      }).then(res => {setToken(res.data)})
      .catch(err => {if(!username){setLoading(false)
      } else {setLoading(false)}})
      ;
  }

  
  
  
  useEffect(() => {
    
    if(token) {handleVerify();}
  }, [token])
  
  
  const handleVerify = async() => {
  
    await axios.post(`https://portal-database-seven.vercel.app/student/verify`,{
      studentName:username.trim(),
      password:password.trim(),
      header:token
    }).then(res =>{ nav(`/portal/${res.data._id}`);setLoading(false);})
    .catch(err =>console.log(err) )
    setLoading(false)
   
    
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
                        disabled={loading}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    {/* Checkbox and Error Display */}
                    <div className="controls-row">
                        <label className="remember-me">
                            <input type="checkbox" disabled={loading} /> Remember Me
                        </label>
                    </div>
                    
                    {error && (
                        <p className="error-message">{error}</p> // Display structured error
                    )}

                    {/* The button is now a submit button and displays loading state */}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
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