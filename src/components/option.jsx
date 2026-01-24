import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const AdminOptionPage = () => {
    const navigate = useNavigate();
    const {id} = useParams()


    const primaryColor = '#0047AB'; // Dark Blue
    const secondaryColor = '#059669'; // Green for variety

    return (
        <div className="option-page-container">
            <style jsx>{`
                .option-page-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 1rem;
                    font-family: Arial, sans-serif;
                }
                .option-card {
                    width: 100%;
                    max-width: 400px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    border: 1px solid #e5e7eb;
                    text-align: center;

                }
                .portal-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-top: 12px;
                    color: #1f2937;
                }
                .selection-header {
                    font-size: 1.1rem;
                    font-weight: 600;
                    margin-bottom: 24px;
                    color: #4b5563;
                }
                .button-group {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .nav-button {
                    width: 100%;
                    padding: 16px;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s, background-color 0.3s;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .nav-button:active {
                    transform: scale(0.98);
                }
                .report-btn {
                    background-color: ${primaryColor};
                }
                .report-btn:hover {
                    background-color: #003685;
                }
                .result-btn {
                    background-color: ${secondaryColor};
                }
                .result-btn:hover {
                    background-color: #047857;
                }
                .footer-text {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                    margin-top: 24px;
                }
            `}</style>

            <div className="option-card">
                {/* School Header / Logo */}
                <div style={{ marginBottom: '24px' }}>
                    <img src="/aiiflogo.png"   style={{margin:'auto'}} width={100} height={100} alt="Logo" />
                    <h1 className="portal-title">Welcome Back!</h1>
                </div>

                <hr style={{ marginBottom: '24px', border: 'none', borderTop: '1px solid #bfdbfe' }} />

                <h2 className="selection-header">Please select an action:</h2>

                <div className="button-group">
                    <button 
                        className="nav-button report-btn"
                        onClick={() => navigate(`/progress/${id}`)}
                    >
                        📊 Progress Report
                    </button>

                    <button 
                        className="nav-button result-btn"
                        onClick={() => navigate(`/portal/${id}`)
}
                    >
                        🔍 Check Result
                    </button>
                </div>

                <p className="footer-text">
                    Logged in as student
                </p>
            </div>
        </div>
    );
};

export default AdminOptionPage;