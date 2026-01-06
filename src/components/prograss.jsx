import React, { useState } from 'react';

const WeeklyReport = () => {
  // 1. Teacher Section State
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [teacherData, setTeacherData] = useState(
    days.map(day => ({ day, date: '', remark: '', total: '', tajweed: '', hifz: '', tajError: '', hifzError: '', toV: '', fromV: '', chapter: '' }))
  );
  const [teacherComments, setTeacherComments] = useState({ comment: '', name: '', signature: '' });

  // 2. Management Section State
  const [mgmtData, setMgmtData] = useState({
    newHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' },
    prevHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' }
  });

  // 3. Parent Section State
  const [parentData, setParentData] = useState({ name: '', comment: '', date: '' });

  // Handlers
  const handleTeacherSubmit = () => console.log("Submitting Teacher Section:", { teacherData, teacherComments });
  const handleMgmtSubmit = () => console.log("Submitting Management Section:", mgmtData);
  const handleParentSubmit = () => console.log("Submitting Parent Section:", parentData);

  const inputClass = "w-full h-full bg-transparent text-center focus:bg-blue-50 outline-none";
  const underlineInput = "border-b border-dotted border-black px-2 focus:bg-blue-50 outline-none";

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-[11px] leading-tight print:p-0">
      
      {/* --- TEACHER SECTION --- */}
      <section className="mb-10 border-b-2 border-gray-200 pb-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">TEACHER'S WEEKLY REPORT</h1>
        
        <div className="flex justify-between mb-4 font-bold">
          <div>Week <input className={underlineInput} /> الأسبوع</div>
          <div>Term <input className={underlineInput} /> الفترة</div>
        </div>

        <table className="w-full border-collapse border border-black mb-4">
          <thead className="bg-gray-100">
            <tr className="h-12">
              <th className="border border-black p-1">Date<br/>التاريخ</th>
              <th className="border border-black p-1">Remark<br/>التقدير</th>
              <th className="border border-black p-1 w-12">Total<br/>مجموع</th>
              <th className="border border-black p-1">Tajweed (30)<br/>تجويد</th>
              <th className="border border-black p-1">Hifz (70)<br/>حفظ</th>
              <th className="border border-black p-1">Tajweed Error</th>
              <th className="border border-black p-1">Hifz Error</th>
              <th className="border border-black p-1">To Verse</th>
              <th className="border border-black p-1">From Verse</th>
              <th className="border border-black p-1">Chapters<br/>سورة</th>
              <th className="border border-black p-1 bg-gray-200">DAYS<br/>الأيام</th>
            </tr>
          </thead>
          <tbody>
            {teacherData.map((row, idx) => (
              <tr key={idx} className="h-8">
                <td className="border border-black"><input className={inputClass} type="date" /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black bg-gray-50 font-bold px-1">{row.day}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-y-4 mb-4">
          <div className="col-span-2">Teacher's Comments: <input className="w-3/4 border-b border-black outline-none" /></div>
          <div>Signature: <input className={underlineInput} /></div>
          <div className="text-right">Teacher's Name: <input className={underlineInput} /></div>
        </div>
        
        <button onClick={handleTeacherSubmit} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 print:hidden">
          Submit Teacher Report
        </button>
      </section>

      {/* --- MANAGEMENT SECTION --- */}
      <section className="mb-10 border-b-2 border-gray-200 pb-8">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Management Weekly Report</h2>
        <table className="w-full border-collapse border border-black text-center mb-4">
          <thead className="bg-gray-100 h-10">
            <tr>
              <th className="border border-black p-1">Remark<br/>التطبيق</th>
              <th className="border border-black p-1">Grade<br/>الدرجة</th>
              <th className="border border-black p-1">Score<br/>النتيجة</th>
              <th className="border border-black p-1">Stopping<br/>الإنتهاء</th>
              <th className="border border-black p-1">Starting<br/>الإبتداء</th>
              <th className="border border-black p-1 bg-gray-200 w-32">Topic<br/>الموضوع</th>
            </tr>
          </thead>
          <tbody>
            {['New Hifz', 'Previous Hifz'].map((topic) => (
              <tr key={topic} className="h-12">
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black"><input className={inputClass} /></td>
                <td className="border border-black font-bold bg-gray-50">{topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mb-4">
          Qur'an HOD's Comment: <input className="w-3/4 border-b border-black outline-none" />
        </div>
        
        <button onClick={handleMgmtSubmit} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 print:hidden">
          Submit Management Report
        </button>
      </section>

      {/* --- PARENT SECTION --- */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Parent/Guardian's Weekly Report</h2>
        <p className="mb-4 leading-relaxed">
          I, <input className={underlineInput} placeholder="Parent Name" /> the Parent/Guardian of the above named pupil/ward 
          hereby certified that, I listened, observed and supervised my child's/ward's progress for this week in 
          comparison with the school report and Allah is my witness.
        </p>
        <div className="space-y-4 mb-4">
          <div>Parent/Guardian's Comment: <input className="w-2/3 border-b border-black outline-none" /></div>
          <div>Sign/Date: <input className={underlineInput} type="date" /></div>
        </div>

        <button onClick={handleParentSubmit} className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 print:hidden">
          Submit Parent Report
        </button>
      </section>

      {/* --- GRADING KEY --- */}
      <div className="flex w-full border border-black text-center font-bold">
        <div className="flex-1 border-r border-black p-1">70-100 EXCELLENT (A)</div>
        <div className="flex-1 border-r border-black p-1">60-69 VERY GOOD (B)</div>
        <div className="flex-1 border-r border-black p-1">50-59 GOOD (C)</div>
        <div className="flex-1 border-r border-black p-1">40-49 PASS (D)</div>
        <div className="flex-1 p-1">0-39 FAIL (F)</div>
      </div>
    </div>
  );
};

export default WeeklyReport;