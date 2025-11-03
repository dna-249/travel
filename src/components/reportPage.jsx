import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import {useParams,useNavigate } from "react-router-dom"

// import html2pdf from 'html2pdf.js'; <-- REMOVED: Caused resolution error.

// -------------------------------------------------------------------
// 1. DATA AND CALCULATION UTILITIES
// -------------------------------------------------------------------

// Placeholder for the API URL where the student report data resides

const ReportPage = () => {
    const [rawStudentData, setRawStudentData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [value,setValue] = useState("")

    const {id} = useParams()


// Grading Scale (out of 100)
const getGradeAndRemark = (score) => {
    if (score >= 75) {
        return { Grade: "A", Remark: "EXCELLENT" };
    } else if (score >= 70) {
        return { Grade: "B", Remark: "VERY GOOD" };
    } else if (score >= 60) {
        return { Grade: "C", Remark: "GOOD" };
    } else if (score >= 50) {
        return { Grade: "D", Remark: "PASS" };
    } else {
        return { Grade: "F", Remark: "FAIL" };
    }
};



useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Simulate fetching data from the API
                // In a real app, this would be: const response = await fetch(API_URL);
                
                // For demonstration, we use a delay and return the MOCK_DATA
                await axios.get(`https://portal-database-seven.vercel.app/student/${id}`)
                .then((res)=>{setValue(res.data);console.log(res)})
                .then(()=>console.log(value))
                .catch((error)=>console.log(error.message))
                
                // Simulate a successful response
                const fetchedData = MOCK_DATA; 
                
                // In a real app, you would check response.ok and parse JSON:
                // const fetchedData = await response.json();

                if (!fetchedData || fetchedData.subjects.length === 0) {
                     throw new Error("No data received or subject list is empty.");
                }

                setRawStudentData(fetchedData);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Failed to load report data. Please check the API connection. (Using mock data structure for demo).");
                // Optional: Fallback to mock data on failure if needed
                setRawStudentData(MOCK_DATA); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]); 





// Calculates Total, Grade, and Remark for a single subject
const calculateSubjectData = (subject) => {
    // Total is calculated from the four core assessment components
    const Total = subject.CA1 + subject.CA2 + subject.Ass + subject.Exam;

    const { Grade, Remark } = getGradeAndRemark(Total);

    return {
        ...subject,
        Total,
        Grade,
        Remark,
    };
};

// Calculates overall totals, average, and overall grade/remark
const calculateOverallData = (subjects) => {
    const initialTotals = {
        CA1_Total: 0,
        CA2_Total: 0,
        Ass_Total: 0,
        Exam_Total: 0,
        Overall_Total: 0,
    };

    const sums = subjects.reduce((acc, subject) => {
        acc.CA1_Total += subject.CA1;
        acc.CA2_Total += subject.CA2;
        acc.Ass_Total += subject.Ass;
        acc.Exam_Total += subject.Exam;
        acc.Overall_Total += subject.Total; 
        return acc;
    }, initialTotals);

    const subjectCount = subjects.length;
    // Calculate average score as a percentage of the total possible score (100 * subject count)
    const avgScore = subjectCount > 0 
        ? ((sums.Overall_Total / subjectCount)).toFixed(2)
        : 0;
    
    // Determine overall grade/remark based on the average score
    const { Grade: overallGrade, Remark: overallRemark } = getGradeAndRemark(parseFloat(avgScore));


    return {
        ...sums,
        avgScore: parseFloat(avgScore),
        Overall_Total: sums.Overall_Total,
        overallGrade,
        overallRemark,
    };
};

// -------------------------------------------------------------------
// 2. MOCK DATA (Fallback/Expected API Shape)
// -------------------------------------------------------------------
// This mock data is used as a temporary placeholder while fetching.
const MOCK_DATA = {
    school:value?.school ,
    studentName:value?.studentName ,
    class:value?.class ,
    term:value?.term ,
    session:value?.session ,
    admissionNo:value?.admissionNo ,
    age:value?.age,
    sex:value?.sex,
    house:value?.house ,
    noInClass:value?.noInClass ,
    classHighest:value?.classHighest ,
    classLowest:value?.classLowest ,
    classPos:value?.classPos ,
    headRemark:value?.headRemark ,
    classTeacherRemark:value?.classTeacherRemark ,
    // NOTE: Grade, Remark, and Total will be calculated from these values
    subjects: [
        { name: "QUR'AN", CA1:value?.subjects?.QURAN.CA1,    CA2: value?.subjects?.QURAN.CA2, Ass: value?.subjects?.QURAN.Ass, Exam: value?.subjects?.QURAN.Exam, Position: "2nd" },
        { name: "TAJWEED", CA1:value?.subjects?.TAJWEED.CA1,    CA2: value?.subjects?.TAJWEED.CA2, Ass: value?.subjects?.TAJWEED.Ass, Exam: value?.subjects?.TAJWEED.Exam, Position: "4th" },
        { name: "TAUHEED", CA1:value?.subjects?.TAUHEEDCA1,     CA2: value?.subjects?.TAUHEED.CA2, Ass: value?.subjects?.TAUHEED.Ass, Exam: value?.subjects?.TAUHEED.Exam, Position: "2nd" },
        { name: "FIQH", CA1:value?.subjects?.FIQH.CA1,    CA2: value?.subjects?.FIQH.CA2, Ass: value?.subjects?.FIQH.Ass, Exam: value?.subjects?.FIQH.Exam, Position: "4th" },
        { name: "HADITH", CA1:value?.subjects?.HADITH.CA1,     CA2: value?.subjects?.HADITH.CA2, Ass: value?.subjects?.HADITH.Ass, Exam: value?.subjects?.HADITH.Exam, Position: "3rd" },
        { name: "ARABIC", CA1:value?.subjects?.ARABIC.CA1,     CA2: value?.subjects?.ARABIC.CA2, Ass: value?.subjects?.ARABIC.Ass, Exam: value?.subjects?.ARABIC.Exam, Position: "3rd" },
        { name: "AZKHAR", CA1:value?.subjects?.AZKHAR.CA1,     CA2: value?.subjects?.AZKHAR.CA2, Ass: value?.subjects?.AZKHAR.Ass, Exam: value?.subjects?.AZKHAR.Exam, Position: "3rd" },
        { name: "SIRAH", CA1:value?.subjects?.SIRAH.CA1,     CA2: value?.subjects?.SIRAH.CA2, Ass: value?.subjects?.SIRAH.Ass, Exam: value?.subjects?.SIRAH.Exam, Position: "3rd" },
        { name: "HURUF", CA1:value?.subjects?.HURUF.CA1,     CA2: value?.subjects?.HURUF.CA2, Ass: value?.subjects?.HURUF.Ass, Exam: value?.subjects?.HURUF.Exam, Position: "3rd" },
    ],
    behavior: {
        moralEthics: "EXCELLENT", punctuality: "GOOD", handWriting: "GOOD",
        honesty: "GOOD", fluency: "GOOD", selfControl: "GOOD",
        responsibility: "GOOD", initiative: "GOOD", politeness: "GOOD"
    },
};



    // --- Calculated Data (UseMemo for efficiency) ---
    const calculatedData = useMemo(() => {
        if (!rawStudentData) return null;

        // Step 1: Calculate Subject Totals, Grades, and Remarks
        const automatedSubjects = rawStudentData.subjects.map(calculateSubjectData);
        
        // Step 2: Calculate Overall Totals and Averages
        const overallStats = calculateOverallData(automatedSubjects);

        // Step 3: Combine all data for rendering
        return {
            ...rawStudentData,
            subjects: automatedSubjects,
            totalScore: overallStats.Overall_Total,
            avgScore: overallStats.avgScore,
            overallGrade: overallStats.overallGrade,
            overallRemark: overallStats.overallRemark,
            overallStats: overallStats,
        };
    }, [rawStudentData]);

    // --- Print and Download Handlers (Updated) ---
    const handleDownloadPdf = () => {
        // Use window.html2pdf() which is globally available after the script tag loads
        if (window.html2pdf) {
            const element = document.querySelector('.report-container');
            var opt = {
                margin: 0.5,
                filename: 'Sambo_Result_Report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 5, media: 'print' },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            window.html2pdf().set(opt).from(element).save();
        } else {
            // Fallback to browser print if script didn't load (or for quick printing)
            window.print();
        }
    };

    // --- Loading and Error States ---
    if (isLoading) {
        return (
            <div style={{display:"flex",justifyItems:"center",alignItems:"center",minHeight:"100vh"}} className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">
                    <svg style={{width:"150px",height:"150px"}} className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Report Data...
                </div>
            </div>
        );
    }

    if (error && !calculatedData) {
        return (
            <div className="p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-lg mx-auto mt-10">
                <h3 className="font-bold text-lg">Error Loading Data</h3>
                <p>{error}</p>
            </div>
        );
    }
    
    // Fallback if data is null (shouldn't happen with the current logic, but good practice)
    if (!calculatedData) return <div>No report data available.</div>;

    // --- Destructuring Data for JSX ---
    const { 
        studentName, class: studentClass, admissionNo, age, sex, house, noInClass, 
        totalScore, avgScore, overallGrade, overallRemark, subjects, behavior, 
        headRemark, classTeacherRemark, overallStats 
    } = calculatedData;
    
    // --- JSX Render ---
    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans">
            {/* Inject the html2pdf library via CDN to ensure it's available globally */}
            <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
            
            <style jsx global>{`
                .report-container {
                    max-width: 8.5in;
                    margin: 0 auto;
                    background-color: white;
                    border: 1px solid #ccc;
                    padding: 20px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .school-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    border-bottom: 3px double #333;
                    padding-bottom: 10px;
                }
                .logo, .student-photo {
                    width: 70px;
                    height: 70px;
                    border: 1px solid #ddd;
                    object-fit: cover;
                    border-radius: 4px;
                    background: #eee;
                }
                .school-info {
                    text-align: center;
                    flex-grow: 1;
                }
                .school-name-en {
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0;
                    color: #004d40;
                }
                .report-title {
                    font-size: 1.1rem;
                    margin-top: 5px;
                    color: #333;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                    font-size: 0.9rem;
                }
                .info-table td {
                    padding: 5px 10px;
                    border: none;
                }
                .info-table .label {
                    font-weight: 600;
                    width: 15%;
                    color: #555;
                }
                .info-table .value{
                    font-weight: 400;
                    width: 35%;
                    border-bottom: 1px dashed #ccc;
                }
                .grades-table th, .grades-table td {
                    border: 1px solid #ddd;
                    padding: 8px 5px;
                    text-align: center;
                }
                .grades-table th {
                    background-color: #e0f2f1;
                    color: #004d40;
                    font-weight: 700;
                }
                .main-header-row th:first-child {
                    background-color: #004d40;
                    color: white;
                }
                .total-row td {
                    font-weight: 700;
                    background-color: #f0f4c3;
                    color: #333;
                }
                .remarks-section {
                    margin-top: 30px;
                    border-top: 1px solid #ccc;
                    padding-top: 15px;
                }
                .remarks-section p {
                    margin: 5px 0;
                }
                .signatures {
                    display: flex;
                    justify-content: space-around;
                    margin-top: 30px;
                    text-align: center;
                }
                .signatures span {
                    display: block;
                    width: 40%;
                    border-top: 1px solid #000;
                    padding-top: 5px;
                    font-style: italic;
                    font-size: 0.85rem;
                }
                .print-download-btn {
                    padding: 10px 20px;
                    margin: 10px;
                    background-color: #004d40;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background-color 0.3s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .print-download-btn:hover {
                    background-color: #00695c;
                }
                @media print {
                    .print-download-btn {
                        display: none;
                    }
                    .report-container {
                        border: none;
                        box-shadow: none;
                    }
                }
                
                @media (max-width: 600px) {
                    .school-header {
                        flex-direction: column;
                        text-align: center;
                    }
                    .logo, .student-photo {
                        margin: 5px auto;
                    }
                    .school-info {
                        order: 3;
                    }
                    table {
                        font-size: 0.75rem;
                    }
                    .grades-table th, .grades-table td {
                        padding: 4px 2px;
                    }
                }
            `}</style>

            <div className="report-container">
                {/* School Header */}
                <div className="school-header">
                    <img src="https://placehold.co/70x70/004D40/FFFFFF?text=Logo" alt="School Logo" className="logo" />
                    <div className="school-info">
                        <p style={{fontSize:"20px"}} className="school-name-ar">مدرسة التصفية للتحفيظ والدراسات الإسلامية، أبوجا</p>
                        <h2 className="school-name-en">MADRASAT ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA</h2>
                        <h3 className="report-title">STATEMENT OF RESULT</h3>
                    </div>
                    <img src="https://placehold.co/70x70/E0F2F1/333333?text=Photo" alt="Student" className="student-photo" />
                </div>
                
                {/* Student Info Table */}
                <table className="info-table">
                    <tbody>
                        <tr>
                            <td className="label">NAME:</td>
                            <td className="value">{studentName}</td>
                            <td className="label">TERM BEGINS:</td>
                            <td className="value">04/01/2025</td>
                            <td className="label">ADMISSION No:</td>
                            <td className="value">{admissionNo}</td>
                            <td className="label">SEX:</td>
                            <td className="value">{sex}</td>
                        </tr>
                        <tr>
                            <td className="label">CLASS:</td>
                            <td className="value">{studentClass}</td>
                            <td className="label">No. in Class:</td>
                            <td className="value">{noInClass}</td>
                            <td className="label">Age:</td>
                            <td className="value">{age}</td>
                            <td className="label">House:</td>
                            <td className="value">{house}</td>
                        </tr>
                        <tr>
                            <td className="label">Class Pos:</td>
                            <td className="value">{calculatedData.classPos}</td>
                            <td className="label">TOTAL SCORE:</td>
                            <td className="value">
                                <span style={{fontWeight: 'bold', color: '#004d40'}}>{totalScore}</span>
                            </td>
                            <td className="label">AVG. SCORE:</td>
                            <td className="value">
                                <span style={{fontWeight: 'bold', color: '#004d40'}}>{avgScore}</span>
                            </td>
                            <td className="label">OVERALL GRADE:</td>
                            <td className="value">
                                <span style={{fontWeight: 'bold', color: 'darkred'}}>{overallGrade}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                
                {/* Subject Grades Table */}
                <table className="grades-table">
                    <thead>
                        <tr className="main-header-row">
                            <th rowSpan="2">SUBJECTS / المواد</th>
                            <th colSpan="3">C.A. (34% + Ass)</th>
                            <th>EXAM (66%)</th>
                            <th rowSpan="2">TOTAL (100%)</th>
                            <th rowSpan="2">SUB/OBJ POSITION</th>
                            <th rowSpan="2">GRADE</th>
                            <th rowSpan="2">REMARK</th>
                        </tr>
                        <tr className="sub-header-row">
                            <th>CA. 1 (17%)</th>
                            <th>CA. 2 (17%)</th>
                            <th>ASS</th>
                            <th>Exam (100%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map((subject, index) => ( 
                            <tr key={index}>
                                <td>{subject.name}</td>
                                <td>{subject.CA1}</td>
                                <td>{subject.CA2}</td>
                                <td>{subject.Ass}</td>
                                <td>{subject.Exam}</td>
                                <td>{subject.Total}</td>
                                <td>{subject.Position}</td> 
                                <td>{subject.Grade}</td> 
                                <td>{subject.Remark}</td>
                            </tr>
                        ))}
                        {/* Total row: Uses dynamically calculated sums */}
                        <tr className="total-row">
                            <td>**TOTAL**</td>
                            <td>{overallStats.CA1_Total}</td>
                            <td>{overallStats.CA2_Total}</td>
                            <td>{overallStats.Ass_Total}</td>
                            <td>{overallStats.Exam_Total}</td>
                            <td>{overallStats.Overall_Total}</td>
                            <td>-</td>
                            <td>-</td>
                            <td>{overallRemark}</td>
                        </tr>
                    </tbody>
                </table>
                
                {/* Behavior/Conduct Table (Simplified) */}
                <table className="behavior-table grades-table">
                    <thead>
                        <tr className="main-header-row">
                            <th>BEHAVIOR</th>
                            <th>SCORE</th>
                            <th>SKILLS</th>
                            <th>SCORE</th>
                            <th>CONDUCT</th>
                            <th>SCORE</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Moral Ethics</td><td>{behavior.moralEthics}</td>
                            <td>Hand Writing</td><td>{behavior.handWriting}</td>
                            <td>Punctuality</td><td>{behavior.punctuality}</td>
                        </tr>
                        <tr>
                            <td>Honesty</td><td>{behavior.honesty}</td>
                            <td>Fluency</td><td>{behavior.fluency}</td>
                            <td>Self Control</td><td>{behavior.selfControl}</td>
                        </tr>
                        <tr>
                            <td>Responsibility</td><td>{behavior.responsibility}</td>
                            <td>Initiative</td><td>{behavior.initiative}</td>
                            <td>Politeness</td><td>{behavior.politeness}</td>
                        </tr>
                    </tbody>
                </table>

                {/* Footer Remarks */}
                <div className="remarks-section">
                    <p><strong>Class Teacher's Remark:</strong> {classTeacherRemark}</p>
                    <p><strong>Head of School's Remark:</strong> {headRemark}</p>
                    <div className="signatures">
                        <span>Signature & Stamp</span>
                        <span>Date</span>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}} className="print-button-container">
                    <button onClick={handleDownloadPdf} className="print-download-btn">
                        🖨️ Print / Download Report (PDF)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
