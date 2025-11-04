import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]); // State to hold student list
    const [selectedStudentId, setSelectedStudentId] = useState(''); // ID selected from dropdown
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const primaryColor = '#0047AB'; // Dark Blue

    // --- 1. Fetch Student List on Component Load ---
    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Request to get the list of all students (or names/IDs)
                const response = await axios.get('https://portal-database-seven.vercel.app/student');
                
                // Assuming the API returns an array of student objects:
                // [{ id: '123', studentName: 'Alice', ... }, { id: '456', studentName: 'Bob', ... }]
                setStudents(response.data);
                
                // Set the default selected ID if the list is not empty
                if (response.data.length > 0) {
                    setSelectedStudentId(response.data[0].id);
                }
            } catch (err) {
                console.error("Failed to fetch student list:", err);
                setError("Failed to load student list for selection.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudents();
    }, []); // Empty dependency array means this runs once on mount

    // --- 2. Handle View Report Button Click ---
    const handleViewReport = (e) => {
        e.preventDefault();
        
        if (!selectedStudentId) {
            alert('Please select a student first.');
            return;
        }
        
        // Route to the report page for the selected student ID
        navigate(`/portal/${selectedStudentId}`);
    };

    // --- 3. Render Logic ---

    // Loading State
    if (isLoading) {
        return (
            <div className="admin-dashboard-container" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <p style={{fontSize: '1.2rem', color: primaryColor}}>Loading student data...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="admin-dashboard-container">
                 <div className="dashboard-card" style={{borderColor: '#ef4444'}}>
                     <h1 style={{color: '#ef4444', marginBottom: '15px'}}>Data Error ❌</h1>
                     <p>{error}</p>
                     <p style={{marginTop: '10px'}}>Please check the API status: <code>https://portal-database.vercel.app/student</code></p>
                 </div>
            </div>
        );
    }
    
    // Main Dashboard Render
    return (
        <div className="admin-dashboard-container">
            <style jsx>{`
                .admin-dashboard-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f3f4f6;
                    padding: 1rem;
                    font-family: Arial, sans-serif;
                }
                .dashboard-card {
                    width: 100%;
                    max-width: 600px;
                    background-color: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
                    padding: 32px;
                    border: 1px solid #e5e7eb;
                    text-align: center;
                }
                .dashboard-header {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: ${primaryColor};
                    margin-bottom: 24px;
                }
                .option-button {
                    padding: 20px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s, background-color 0.2s;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    color: white;
                    background-color: ${primaryColor};
                    width: 100%;
                    max-width: 300px;
                }
                .option-button:hover {
                    transform: translateY(-2px);
                    background-color: #003685;
                }
                .lookup-form {
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #f9fafb;
                }
                .select-field {
                    width: 100%;
                    max-width: 250px;
                    padding: 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    font-size: 1rem;
                    margin-right: 10px;
                    cursor: pointer;
                }
                .view-button {
                    padding: 10px 20px;
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    color: white;
                    background-color: #10b981; /* Green accent color */
                    transition: background-color 0.2s;
                }
                .view-button:hover {
                    background-color: #059669;
                }
                .error-message {
                    color: #ef4444;
                    font-size: 0.875rem;
                    font-weight: 500;
                    margin-top: 10px;
                }
                @media (max-width: 550px) {
                    .lookup-form form {
                        flex-direction: column;
                        gap: 10px;
                    }
                    .select-field {
                        max-width: none;
                        margin-right: 0;
                    }
                }
            `}</style>

            <div className="dashboard-card">
                <h1 className="dashboard-header">
                    Welcome, Administrator 👋
                </h1>
                
                <p style={{marginBottom: '25px', color: '#4b5563', fontSize: '1.1rem'}}>
                    Please select an administrative task:
                </p>

                {/* Option 1: Route to /entry */}
                <div style={{marginBottom: '20px'}}>
                    <button 
                        className="option-button"
                        onClick={() => navigate('/entry')}
                    >
                        📝 Go to Data Entry Page 
                    </button>
                </div>

                <hr style={{margin: '20px 0', border: 'none', borderTop: '1px solid #eee'}} />

                {/* Option 2: View Student Report via Dropdown Menu */}
                <div className="lookup-form">
                    <h3 style={{fontSize: '1.25rem', fontWeight: '600', marginBottom: '15px', color: '#4b5563'}}>
                        View Student Report
                    </h3>
                    <form onSubmit={handleViewReport} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        
                        <select
                            className="select-field"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="" disabled>--- Select a Student ---</option>
                            {students.map(student => (
                                <option key={student.id} value={student.id}>
                                    {/* Display Student Name and ID/Class for easy lookup */}
                                    {`${student.studentName} (ID: ${student.id})`}
                                </option>
                            ))}
                        </select>
                        
                        <button 
                            type="submit"
                            className="view-button"
                            style={{minWidth: '120px'}}
                        >
                            View Report
                        </button>
                    </form>

                    <p style={{marginTop: '10px', fontSize: '0.85rem', color: '#6b7280'}}>
                        Currently viewing ID: <strong>{selectedStudentId || 'N/A'}</strong>
                    </p>
                </div>

                {/* Logout Button */}
                <button 
                    style={{marginTop: '30px', padding: '10px 20px', background: '#e0e7ff', color: primaryColor, border: '1px solid #c7d2fe', borderRadius: '4px', cursor: 'pointer'}}
                    onClick={() => navigate('/admin')}
                >
                    🔒 Logout
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;