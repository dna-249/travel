import React, { useState, useEffect } from 'react';

// --- Data & Logic Definitions ---

const BEHAVIOR_OPTIONS = ["EXCELLENT", "GOOD", "FAIR", "POOR"];
const GENDER_OPTIONS = ["Male", "Female"];

// Scoring thresholds
const GRADE_THRESHOLDS = [
    { score: 75, grade: 'A', remark: 'EXCELLENT' },
    { score: 65, grade: 'B', remark: 'VERY GOOD' },
    { score: 55, grade: 'C', remark: 'GOOD' },
    { score: 45, grade: 'D', remark: 'PASS' },
    { score: 0, grade: 'F', remark: 'FAIL' },
];

const ordinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// Initial Data Structure 
const INITIAL_STUDENT_DATA = {
    school: "ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA",
    studentName: "SAMBO MUHAMMAD MALAMIYO",
    class: "NURSERY CLASS 1",
    term: "FIRST TERM",
    session: "ACADEMIC YEAR 2024/2025",
    admissionNo: "ATBS/N1/2017/005",
    age: 6,
    sex: "Male",
    house: "A",
    noInClass: 7,
    // Editable boundaries for dynamic position calculation
    classHighest: 580, 
    classLowest: 372,  
    // Calculated fields (initialized to safe defaults)
    totalScore: 0, avgScore: 0, classPos: "", overallGrade: '', overallRemark: '',
    subjects: [
        { name: "QUR'AN", CA1: 5, CA2: 6, Exam: 59, Total: 0, Position: "2nd", Grade: "A", Remark: "EXCELLENT" },
        { name: "ARABIC LANGUAGE", CA1: 7, CA2: 5, Exam: 54, Total: 0, Position: "4th", Grade: "A", Remark: "EXCELLENT" },
        { name: "HURUF", CA1: 10, CA2: 8, Exam: 54, Total: 0, Position: "2nd", Grade: "A", Remark: "EXCELLENT" },
        { name: "ISLAMIC STUDIES", CA1: 5, CA2: 8, Exam: 54, Total: 0, Position: "4th", Grade: "A", Remark: "EXCELLENT" },
        { name: "MORAL ETHICS", CA1: 10, CA2: 6, Exam: 51, Total: 0, Position: "3rd", Grade: "A", Remark: "EXCELLENT" },
    ],
    behavior: {
        moralEthics: "EXCELLENT", punctuality: "GOOD", handWriting: "GOOD", honesty: "GOOD",
        fluency: "GOOD", selfControl: "GOOD", responsibility: "GOOD", initiative: "GOOD", politeness: "GOOD"
    },
    headRemark: "An excellent result, keep up the good work",
    classTeacherRemark: "A hardworking learner and shows respect"
};

// --- CORE CALCULATION FUNCTION ---
const getGradeAndRemark = (score) => {
    const gradeItem = GRADE_THRESHOLDS.find(item => score >= item.score);
    return gradeItem || { grade: 'F', remark: 'FAIL' };
};

const calculateReportData = (currentData) => {
    let newTotalScore = 0;
    const numSubjects = currentData.subjects.length;
    const numInClass = currentData.noInClass || 1; 

    // 1. Calculate subject Totals and Grades
    const updatedSubjects = (currentData.subjects || []).map(sub => {
        const total = sub.CA1 + sub.CA2 + sub.Exam;
        const { grade, remark } = getGradeAndRemark(total);
        newTotalScore += total;
        
        return { ...sub, Total: total, Grade: grade, Remark: remark };
    });

    // 2. Calculate Overall Scores
    const newAvgScore = numSubjects > 0 ? (newTotalScore / numSubjects).toFixed(2) : 0;
    const overallGradeItem = getGradeAndRemark(Number(newAvgScore));

    // 3. Calculate Class Position DYNAMICALLY
    let newClassPos = ordinal(1);
    const classHighest = currentData.classHighest;
    const classLowest = currentData.classLowest;
    const range = classHighest - classLowest;
    
    if (numInClass > 1 && range > 0) {
        if (newTotalScore >= classHighest) {
            newClassPos = ordinal(1);
        } else if (newTotalScore <= classLowest) {
            newClassPos = ordinal(numInClass);
        } else {
            // Linear interpolation to estimate rank between 1 and numInClass
            const scoreDifference = classHighest - newTotalScore;
            const normalizedPosition = scoreDifference / range; // 0 (highest) to 1 (lowest)

            // Estimated numerical rank (1st to Nth)
            let estimatedRank = normalizedPosition * (numInClass - 1) + 1;
            estimatedRank = Math.round(estimatedRank);
            
            // Ensure rank stays within 1 and N
            estimatedRank = Math.min(numInClass, Math.max(1, estimatedRank));
            
            newClassPos = ordinal(estimatedRank);
        }
    } else if (numInClass === 1) {
        newClassPos = ordinal(1);
    }
    
    // 4. Return the fully updated data object
    return {
        ...currentData,
        subjects: updatedSubjects,
        totalScore: newTotalScore,
        avgScore: Number(newAvgScore),
        classPos: newClassPos,
        overallGrade: overallGradeItem.grade,
        overallRemark: overallGradeItem.remark,
    };
};


// ---------------------------------------------
// --- Report Input Form Component ---
// ---------------------------------------------
const ReportInputForm = ({ onSave }) => {
    const [formData, setFormData] = useState(INITIAL_STUDENT_DATA);

    // --- EFFECT: Auto-calculate totals, grades, and position ---
    useEffect(() => {
        setFormData(prevData => calculateReportData(prevData));
    }, [
        formData.subjects.map(s => s.CA1 + s.CA2 + s.Exam).join('-'), // Scores
        formData.classHighest,                                        // Class Highest
        formData.classLowest,                                         // Class Lowest
        formData.noInClass                                            // Number in Class
    ]);

    // Handlers
    const handleBasicChange = (e) => {
        const { name, value, type } = e.target;
        const finalValue = type === 'number' ? Number(value) : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleBehaviorChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            behavior: { ...prev.behavior, [name]: value }
        }));
    };

    const handleSubjectScoreChange = (index, field, value) => {
        const newSubjects = [...formData.subjects];
        let score = Number(value);
        if (isNaN(score)) score = 0;
        
        const maxScore = field.includes('CA') ? 17 : 66;
        if (score > maxScore) score = maxScore;
        if (score < 0) score = 0;
        
        newSubjects[index] = { ...newSubjects[index], [field]: score };
        setFormData(prev => ({ ...prev, subjects: newSubjects }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        alert(`Report Data Updated! Position: ${formData.classPos}`);
    };


    return (
        <form onSubmit={handleSubmit} className="report-input-form">
            <h2>📝 Student Report Data Entry</h2>
            <hr />

            {/* --- 1. Student Information --- */}
            <h3>Student & Class Info</h3>
            <div className="form-grid student-info-grid">
                <div><label>School Name:</label><input type="text" name="school" value={formData.school} onChange={handleBasicChange} required /></div>
                <div><label>Student Name:</label><input type="text" name="studentName" value={formData.studentName} onChange={handleBasicChange} required /></div>
                <div><label>Admission No:</label><input type="text" name="admissionNo" value={formData.admissionNo} onChange={handleBasicChange} required /></div>
                <div><label>Class:</label><input type="text" name="class" value={formData.class} onChange={handleBasicChange} /></div>
                <div><label>Term:</label><input type="text" name="term" value={formData.term} onChange={handleBasicChange} /></div>
                <div><label>Session:</label><input type="text" name="session" value={formData.session} onChange={handleBasicChange} /></div>
                <div><label>Age:</label><input type="number" name="age" value={formData.age} onChange={handleBasicChange} /></div>
                <div><label>Sex:</label><select name="sex" value={formData.sex} onChange={handleBasicChange}>{GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
            </div>
            <hr />

            {/* --- 2. Subject Scores (Inputs drive Total/Grade/Remark) --- */}
            <h3>Subject Scores and Grades</h3>
            <table className="subject-score-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>CA1 (Max 17)</th>
                        <th>CA2 (Max 17)</th>
                        <th>Exam (Max 66)</th>
                        <th>TOTAL</th>
                        <th>Position</th>
                        <th>GRADE</th>
                        <th>REMARK</th>
                    </tr>
                </thead>
                <tbody>
                    {/* SAFE MAPPING: Use safe navigation for formData.subjects */}
                    {(formData.subjects || []).map((subject, index) => (
                        <tr key={subject.name}>
                            <td>{subject.name}</td>
                            <td><input type="number" min="0" max="17" value={subject.CA1} onChange={(e) => handleSubjectScoreChange(index, 'CA1', e.target.value)} /></td>
                            <td><input type="number" min="0" max="17" value={subject.CA2} onChange={(e) => handleSubjectScoreChange(index, 'CA2', e.target.value)} /></td>
                            <td><input type="number" min="0" max="66" value={subject.Exam} onChange={(e) => handleSubjectScoreChange(index, 'Exam', e.target.value)} /></td>
                            <td style={{fontWeight: 'bold'}}>{subject.Total}</td>
                            <td><input type="text" value={subject.Position} readOnly style={{backgroundColor: '#eee'}} /></td>
                            <td style={{fontWeight: 'bold'}}>{subject.Grade}</td>
                            <td style={{fontWeight: 'bold'}}>{subject.Remark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />

            {/* --- 3. Overall Summary --- */}
            <h3>Overall Grading and Class Performance</h3>
            <div className="form-grid overall-info-grid">
                <div>
                    <label>CLASS HIGHEST (User Input):</label>
                    <input type="number" name="classHighest" value={formData.classHighest} onChange={handleBasicChange} />
                </div>
                <div>
                    <label>CLASS LOWEST (User Input):</label>
                    <input type="number" name="classLowest" value={formData.classLowest} onChange={handleBasicChange} />
                </div>
                <div>
                    <label>No. in Class (User Input):</label>
                    <input type="number" name="noInClass" value={formData.noInClass} onChange={handleBasicChange} />
                </div>
                <div style={{backgroundColor: '#e6ffed', padding: '10px', borderRadius: '4px'}}>
                    <label>Calculated TOTAL SCORE:</label>
                    <input type="number" readOnly value={formData.totalScore} style={{fontWeight: 'bold'}}/>
                </div>
                <div style={{backgroundColor: '#e6ffed', padding: '10px', borderRadius: '4px'}}>
                    <label>Calculated AVERAGE SCORE:</label>
                    <input type="number" step="0.01" readOnly value={formData.avgScore} style={{fontWeight: 'bold'}}/>
                </div>
                <div style={{backgroundColor: '#ffffe6', padding: '10px', borderRadius: '4px'}}>
                    <label>Calculated CLASS POSITION:</label>
                    <input type="text" readOnly value={formData.classPos} style={{fontWeight: 'bold'}}/>
                </div>
                <div style={{backgroundColor: '#e6ffed', padding: '10px', borderRadius: '4px'}}>
                    <label>Calculated OVERALL GRADE:</label>
                    <input type="text" readOnly value={formData.overallGrade} style={{fontWeight: 'bold'}}/>
                </div>
                <div style={{backgroundColor: '#e6ffed', padding: '10px', borderRadius: '4px'}}>
                    <label>Calculated OVERALL REMARK:</label>
                    <input type="text" readOnly value={formData.overallRemark} style={{fontWeight: 'bold'}}/>
                </div>
            </div>
            <hr />

            {/* --- 4. Behavior/Conduct & Remarks --- */}
            <h3>Behavior and Skills Assessment</h3>
            <div className="form-grid behavior-grid">
                {/* FIX APPLIED: Use safe fallback for formData.behavior (|| {}) */}
                {Object.keys(formData.behavior || {}).map(key => (
                    <div key={key}>
                        <label>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</label>
                        <select name={key} value={formData.behavior[key]} onChange={handleBehaviorChange}>
                            {BEHAVIOR_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                ))}
            </div>
            
            <h3>Official Remarks</h3>
            <div className="form-grid remarks-grid">
                <div>
                    <label>Class Teacher's Remark:</label>
                    <textarea name="classTeacherRemark" value={formData.classTeacherRemark} onChange={handleBasicChange} rows="2"></textarea>
                </div>
                <div>
                    <label>Head of School's Remark:</label>
                    <textarea name="headRemark" value={formData.headRemark} onChange={handleBasicChange} rows="2"></textarea>
                </div>
            </div>
            <hr />

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button type="submit" className="save-btn">💾 Save & Update Report Data</button>
            </div>
        </form>
    );
};

export default ReportInputForm;