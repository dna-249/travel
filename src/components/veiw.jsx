import React from 'react';

const WeeklyReportView = () =>{
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border border-gray-300 shadow-sm font-sans text-xs">
      {/* HEADER SECTION */}
      <h1 className="text-2xl font-bold text-center text-blue-800 uppercase mb-4">Teacher's Weekly Report</h1>
      <div className="flex justify-between mb-4 px-2">
        <span>Week_________________ الأسبوع</span>
        <span>Term_________________ الفترة</span>
      </div>

      {/* TEACHER TABLE */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse border border-black text-center">
          <thead className="bg-gray-50">
            <tr>
              <th rowSpan="2" className="border border-black p-1">التاريخ<br/>Date</th>
              <th rowSpan="2" className="border border-black p-1">التقدير<br/>Remark</th>
              <th rowSpan="2" className="border border-black p-1 w-12">مجموع<br/>Total (100)</th>
              <th className="border border-black p-1">درجة التجويد<br/>Tajweed Score (30)</th>
              <th className="border border-black p-1">درجة الحفظ<br/>Hifz Score (70)</th>
              <th className="border border-black p-1">أخطاء تجويدية<br/>Tajweed Rule Error</th>
              <th className="border border-black p-1">أخطاء حفظية<br/>Hifz Point Error</th>
              <th className="border border-black p-1">إلى آية<br/>To Verse</th>
              <th className="border border-black p-1">من آية<br/>From Verse</th>
              <th rowSpan="2" className="border border-black p-1">سورة<br/>Chapters</th>
              <th rowSpan="2" className="border border-black p-1">الأيام<br/>DAYS</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day} className="h-8">
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black"></td>
                <td className="border border-black font-semibold bg-gray-50 text-[10px]">
                  {day}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="col-span-2">Teacher's Comments: __________________________________________________________________ ملاحظات المعلم</div>
        <div>Signature: ____________________ التوقيع</div>
        <div className="text-right">Teacher's Name: ____________________ اسم المعلم</div>
      </div>

      {/* MANAGEMENT SECTION */}
      <h2 className="text-xl font-bold text-center text-blue-800 uppercase mb-4">Management Weekly Report</h2>
      <table className="w-full border-collapse border border-black text-center mb-6">
        <thead>
          <tr className="bg-gray-50">
            <th className="border border-black p-1">التطبيق<br/>Remark</th>
            <th className="border border-black p-1">الدرجة<br/>Grade</th>
            <th className="border border-black p-1">النتيجة<br/>Score</th>
            <th className="border border-black p-1">الإنتهاء<br/>Stopping</th>
            <th className="border border-black p-1">الإبتداء<br/>Starting</th>
            <th className="border border-black p-1">الموضوع<br/>Topic</th>
          </tr>
        </thead>
        <tbody>
          <tr className="h-10">
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black font-bold">الحفظ الجديد<br/>New Hifz</td>
          </tr>
          <tr className="h-10">
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black font-bold">الحفظ السابق<br/>Previous Hifz</td>
          </tr>
        </tbody>
      </table>

      {/* PARENT SECTION */}
      <h2 className="text-xl font-bold text-center text-blue-800 uppercase mb-2">Parent/Guardian's Weekly Report</h2>
      <div className="italic mb-4 text-[11px]">
        I, ___________________________________ the Parent/Guardian of the above named pupil/ward 
        hereby certified that, I listened, observed and supervised my child's/ward's progress for this week in 
        comparison with the school report and Allah is my witness.
      </div>
      <div className="mb-6">Parent/Guardian's Comment: __________________________________________________</div>
      <div className="mb-8">Sign/Date: __________________________________________________</div>

      {/* GRADING KEY */}
      <table className="w-full border border-black text-[10px] text-center">
        <tbody>
          <tr>
            <td className="border border-black p-1">70-100 EXCELLENT (A)</td>
            <td className="border border-black p-1">60-69 VERY GOOD (B)</td>
            <td className="border border-black p-1">50-59 GOOD (C)</td>
            <td className="border border-black p-1">40-49 PASS (D)</td>
            <td className="border border-black p-1">0-39 FAIL (F)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyReportView;