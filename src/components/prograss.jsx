import React from 'react';

const WeeklyReport = () => {
  const days = [
    { en: 'Saturday', ar: 'السبت' },
    { en: 'Sunday', ar: 'الأحد' },
    { en: 'Monday', ar: 'الإثنين' },
    { en: 'Tuesday', ar: 'الثلاثاء' },
    { en: 'Wednesday', ar: 'الأربعاء' },
    { en: 'Thursday', ar: 'الخميس' },
    { en: 'Friday', ar: 'الجمعة' },
  ];

  // Specific styles to match the uploaded image's branding
  const navyText = "text-[#2a3a8a]"; // Accurate navy blue from the image
  const tableBorder = "border border-black";
  const inputStyle = "w-full h-full border-none px-1 text-center bg-transparent focus:bg-blue-50 outline-none font-sans";
  const underlineStyle = "border-b border-black outline-none bg-transparent px-2 focus:border-blue-600 flex-grow text-center";

  return (
    <div className="min-h-screen bg-gray-200 py-12 px-4 print:bg-white print:py-0">
      {/* Container simulating a physical A4 paper */}
      <div className="max-w-[1000px] mx-auto bg-white p-12 shadow-[0_0_15px_rgba(0,0,0,0.2)] print:shadow-none print:p-4">
        
        {/* --- TEACHER'S WEEKLY REPORT SECTION --- */}
        <header className="mb-6">
          <h1 className={`${navyText} text-4xl font-bold text-center uppercase tracking-tight mb-8`}>
            TEACHER'S WEEKLY REPORT
          </h1>
          
          <div className="flex justify-between items-end gap-12 font-bold text-lg mb-2">
            <div className="flex items-end flex-1">
              <span>Week</span>
              <input type="text" className={underlineStyle} />
              <span className="ml-2">الأسبوع</span>
            </div>
            <div className="flex items-end flex-1">
              <span>Term</span>
              <input type="text" className={underlineStyle} />
              <span className="ml-2">الفترة</span>
            </div>
          </div>
        </header>

        {/* Attendance/Progress Table */}
        <div className="overflow-x-auto">
          <table className={`w-full ${tableBorder} border-collapse text-center`}>
            <thead className="text-[11px] font-bold">
              <tr>
                <th className={`${tableBorder} p-1 w-24`}>التاريخ<br/>Date</th>
                <th className={`${tableBorder} p-1`}>التقدير<br/>Remark</th>
                <th className={`${tableBorder} p-1 w-14`}>مجموع<br/>Total (100)</th>
                <th className={`${tableBorder} p-1 w-14`}>درجة التجويد<br/>Tajweed Score (30)</th>
                <th className={`${tableBorder} p-1 w-14`}>درجة الحفظ<br/>Hifz Score (70)</th>
                <th className={`${tableBorder} p-1 w-14`}>أخطاء التجويدية<br/>Tajweed Rule Error</th>
                <th className={`${tableBorder} p-1 w-14`}>أخطاء حفظية<br/>Hifz Point Error</th>
                <th className={`${tableBorder} p-1 w-12`}>إلى آية<br/>To Verse</th>
                <th className={`${tableBorder} p-1 w-12`}>من آية<br/>From Verse</th>
                <th className={`${tableBorder} p-1 w-32`}>سورة<br/>Chapters</th>
                <th className={`${tableBorder} p-1 w-24 bg-white`}>الأيام<br/>DAYS</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day, i) => (
                <tr key={i} className="h-11">
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={`${tableBorder} bg-gray-50 leading-tight text-right pr-2`}>
                    <div className="text-[12px] font-bold">{day.ar}</div>
                    <div className="text-[10px] uppercase font-bold">{day.en}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Teacher Feedback Lines */}
        <div className="mt-6 space-y-6">
          <div className="flex items-end">
            <span className="font-bold text-sm whitespace-nowrap">Teacher's Comments:</span>
            <input type="text" className="flex-grow border-b border-black outline-none px-2 mx-2" />
            <span className="font-bold text-sm whitespace-nowrap">:ملاحظات المعلم</span>
          </div>
          <div className="flex justify-between items-end gap-4">
            <div className="flex items-end flex-1">
              <span className="font-bold text-sm">Signature:</span>
              <input type="text" className="flex-grow border-b border-black outline-none px-2 mx-2" />
              <span className="font-bold text-sm">:التوقيق</span>
            </div>
            <div className="flex items-end flex-1">
              <span className="font-bold text-sm whitespace-nowrap">Teacher's Name:</span>
              <input type="text" className="flex-grow border-b border-black outline-none px-2 mx-2" />
              <span className="font-bold text-sm whitespace-nowrap">:اسم المعلم</span>
            </div>
          </div>
        </div>

        <div className="my-10 border-t-2 border-[#2a3a8a] opacity-20"></div>

        {/* --- MANAGEMENT WEEKLY REPORT SECTION --- */}
        <section>
          <h2 className={`${navyText} text-4xl font-bold text-center uppercase tracking-tight mb-8`}>
            MANAGEMENT WEEKLY REPORT
          </h2>
          <table className={`w-full ${tableBorder} border-collapse text-center text-sm font-bold`}>
            <thead className="bg-gray-50">
              <tr>
                <th className={`${tableBorder} p-3 w-1/4`}>التطبيق<br/>Remark</th>
                <th className={`${tableBorder} p-3 w-24`}>الدرجة<br/>Grade</th>
                <th className={`${tableBorder} p-3 w-24`}>النتيجة<br/>Score</th>
                <th className={`${tableBorder} p-3 w-1/5`}>الانتهاء<br/>Stopping</th>
                <th className={`${tableBorder} p-3 w-1/5`}>الابتداء<br/>Starting</th>
                <th className={`${tableBorder} p-3 w-32 bg-white`}>الموضوع<br/>Topic</th>
              </tr>
            </thead>
            <tbody>
              {['New Hifz', 'Previous Hifz'].map((topic, i) => (
                <tr key={i} className="h-14">
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={tableBorder}><input className={inputStyle} type="text" /></td>
                  <td className={`${tableBorder} bg-gray-50 leading-tight`}>
                    <div className="text-[13px]">{i === 0 ? 'الحفظ الجديد' : 'الحفظ السابق'}</div>
                    <div className="text-[11px] uppercase">{topic}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 space-y-6">
            <div className="flex items-end">
              <span className="font-bold text-sm">Qur'an HOD'S Comment:</span>
              <input type="text" className="flex-grow border-b border-black outline-none px-2 ml-2" />
            </div>
            <div className="flex items-end">
              <span className="font-bold text-sm">Sign/Date:</span>
              <input type="text" className="w-[450px] border-b border-black outline-none px-2 ml-2" />
            </div>
          </div>
        </section>

        <div className="my-10"></div>

        {/* --- PARENT/GUARDIAN'S WEEKLY REPORT SECTION --- */}
        <section>
          <h2 className={`${navyText} text-4xl font-bold text-center uppercase tracking-tight mb-6`}>
            PARENT/GUARDIAN'S WEEKLY REPORT
          </h2>
          <div className="text-[15px] leading-relaxed mb-8">
            I, <input type="text" className="w-[300px] border-b border-black outline-none px-2 text-center font-bold" /> the Parent/Guardian of the above named pupil/ward 
            hereby certified that, I listened, observed and supervised my child's/ward's progress for this week in 
            comparison with the school report and Allah is my witness.
          </div>
          <div className="space-y-6 mb-12">
            <div className="flex items-end">
              <span className="font-bold text-sm">Parent/Guardian's Comment:</span>
              <input type="text" className="flex-grow border-b border-black outline-none px-2 ml-2" />
            </div>
            <div className="flex items-end">
              <span className="font-bold text-sm">Sign/Date:</span>
              <input type="text" className="w-[450px] border-b border-black outline-none px-2 ml-2" />
            </div>
          </div>

          {/* Grading Legend (Footer) */}
          <div className="grid grid-cols-5 border-t border-l border-r border-black text-[11px] font-bold text-center">
            <div className="border-r border-b border-black p-3 bg-gray-50 uppercase">70-100 EXCELLENT (A)</div>
            <div className="border-r border-b border-black p-3 uppercase">60-69 VERY GOOD (B)</div>
            <div className="border-r border-b border-black p-3 bg-gray-50 uppercase">50-59 GOOD (C)</div>
            <div className="border-r border-b border-black p-3 uppercase">40-49 PASS (D)</div>
            <div className="border-b border-black p-3 bg-gray-50 uppercase">0-39 FAIL (F)</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeeklyReport;