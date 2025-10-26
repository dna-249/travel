import React from 'react';// Assume you create this file for styles

// Import the mock data

const ReportPage = () => {
    const studentData = {
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
  totalScore: 508,
  avgScore: 72.57,
  classHighest: 580,
  classLowest: 372,
  classPos: "1st",
  overallGrade: "A",
  overallRemark: "EXCELLENT",
  subjects: [
    { name: "QUR'AN", CA1: 5, CA2: 6, Exam: 59, Total: 75, Position: "2nd", Grade: "A", Remark: "EXCELLENT" },
    { name: "ARABIC LANGUAGE", CA1: 7, CA2: 5, Exam: 54, Total: 74, Position: "4th", Grade: "A", Remark: "EXCELLENT" },
    { name: "HURUF", CA1: 10, CA2: 8, Exam: 54, Total: 79, Position: "2nd", Grade: "A", Remark: "EXCELLENT" },
    { name: "ISLAMIC STUDIES", CA1: 5, CA2: 8, Exam: 54, Total: 73, Position: "4th", Grade: "A", Remark: "EXCELLENT" },
    { name: "MORAL ETHICS", CA1: 10, CA2: 6, Exam: 51, Total: 72, Position: "3rd", Grade: "A", Remark: "EXCELLENT" },
  ],
  behavior: {
    moralEthics: "EXCELLENT",
    punctuality: "GOOD",
    handWriting: "GOOD",
    honesty: "GOOD",
    fluency: "GOOD",
    selfControl: "GOOD",
    responsibility: "GOOD",
    initiative: "GOOD",
    politeness: "GOOD"
  },
  headRemark: "An excellent result, keep up the good work",
  classTeacherRemark: "A hardworking learner and shows respect"
};

  const { school, studentName, class: studentClass, term, session, admissionNo, age, sex, house, noInClass, totalScore, avgScore, classHighest, classLowest, classPos, overallGrade, overallRemark, subjects, behavior, headRemark, classTeacherRemark } = studentData;

  return (
    <div className="report-container">
      {/* School Header */}
      <div className="school-header">
        <img src="/path/to/school_logo.png" alt="School Logo" className="logo" />
        <div className="school-info">
          <p className="school-name-ar">مدرسة التصفية للتحفيظ والدراسات الإسلامية، أبوجا</p>
          <h2 className="school-name-en">MADRASAT ALTASFIYAH TAHFEEZ AND ISLAMIYAH SCHOOL, ABUJA</h2>
          <h3 className="report-title">STATEMENT OF RESULT</h3>
        </div>
        <img src="/path/to/student_photo.jpg" alt="Student" className="student-photo" />
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
          {/* ... Add other rows like Class, Term, Age, House, etc. ... */}
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
          {/* ... etc. ... */}
        </tbody>
      </table>

      {/* Grading & Remark Summary */}
      <table className="summary-table">
        <thead>
          <tr>
            <th>No. of Titles Offered: 5</th>
            <th>Class Highest Final Score: {classHighest}</th>
            <th>% Average Score: {avgScore}%</th>
            <th>Class Lowest Final Score: {classLowest}</th>
            <th>Overall Grade: {overallGrade}</th>
            <th>Overall REMARK</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TOTAL SCORE: {totalScore}</td>
            <td>CLASS POSITION: {classPos}</td>
            <td>CLASS HIGHEST: {classHighest}</td>
            <td>GRADE: A</td>
            <td>REMARK: {overallRemark}</td>
          </tr>
        </tbody>
      </table>

      {/* Subject Grades Table */}
      <table className="grades-table">
        <thead>
          <tr className="main-header-row">
            <th rowSpan="2">SUBJECTS / المواد</th>
            <th colSpan="2">C.A. (34%)</th>
            <th>ANIMT (66%)</th>
            <th>EXAM (66%)</th>
            <th rowSpan="2">TOTAL (100%)</th>
            <th rowSpan="2">SUB/OBJ POSITION</th>
            <th rowSpan="2">GRADE</th>
            <th rowSpan="2">REMARK</th>
          </tr>
          <tr className="sub-header-row">
            <th>CA. 1 (17%)</th>
            <th>CA. 2 (17%)</th>
            <th>ANIMT (100%)</th>
            <th>Exam (100%)</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.name}</td>
              <td>{subject.CA1}</td>
              <td>{subject.CA2}</td>
              {/* Note: ANIMT column seems to be missing in the data/image structure, check the image columns carefully */}
              <td>-</td> {/* Placeholder for ANIMT */}
              <td>{subject.Exam}</td>
              <td>{subject.Total}</td>
              <td>{subject.Position}</td>
              <td>{subject.Grade}</td>
              <td>{subject.Remark}</td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="total-row">
            <td>TOTAL</td>
            <td>37</td>
            <td>33</td>
            <td>31</td> {/* Sum of ANIMT placeholders from image */}
            <td>272</td> {/* Sum of Exams from image */}
            <td>374</td> {/* Total score from image */}
            <td>-</td>
            <td>-</td>
            <td>EXCELLENT</td>
          </tr>
        </tbody>
      </table>
      
      {/* Behavior/Conduct Table */}
      <table className="behavior-table">
        <tbody>
          <tr>
            <td>BEHAVIOR</td>
            <td>{behavior.moralEthics}</td>
            <td>SKILLS</td>
            <td>REMARK</td>
            <td>{behavior.handWriting}</td>
          </tr>
          <tr>
            <td>PUNCTUALITY</td>
            <td>{behavior.punctuality}</td>
            <td>HAND WRITTING</td>
            <td>{behavior.handWriting}</td>
          </tr>
          {/* ... Add other rows like Punctuality, Honesty, etc. ... */}
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
    </div>
  );
};

export default ReportPage;