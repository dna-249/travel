import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const WeeklyReport = () => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [day, setDay] = useState('Saturday'); // Default to Saturday
  const { id } = useParams(); 

  // --- STATES ---
  const [fetchedData, setFetchedData] = useState(null); // Data from API
  const [focusedField, setFocusedField] = useState(null); // Track user focus
  
  const [teacherData, setTeacherData] = useState(
    days.map(d => ({ 
      day: d, date: '', remark: '', total: '', tajweed: '', 
      hifz: '', tajError: '', hifzError: '', toV: '', fromV: '', chapter: '' 
    }))
  );
  
  const [teacherComments, setTeacherComments] = useState({ week: '', term: '', comment: '', name: '', signature: '' });
  const [mgmtData, setMgmtData] = useState({
    newHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' },
    prevHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' },
    hodComment: ''
  });

  const [parentData, setParentData] = useState({ name: '', comment: '', date: '' });
  const [status, setStatus] = useState({ teacher: 'idle', mgmt: 'idle', parent: 'idle' });

  // --- FETCH DATA ---
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const res = await axios.get(`https://portal-database-seven.vercel.app/student/${id}`);
        setFetchedData(res.data);
      } catch (err) {
        console.error("Error fetching student data:", err);
      }
    };
    if (id) loadStudentData();
  }, [id]);

  // --- POST HANDLER ---
  const submitToBackend = async (section) => {
    setStatus(prev => ({ ...prev, [section]: 'loading' }));
    const dayKey = day.slice(0, 3).toLowerCase();
    
    try {
      const activeRow = teacherData.find(r => r.day === day);
      const response = await axios.put(
        `https://portal-database-seven.vercel.app/student/push/${id}/${dayKey}`, 
        {
          date: activeRow?.date,
          tajweed: activeRow?.tajweed,
          hifz: activeRow?.hifz,
          tajError: activeRow?.tajError,
          hifzError: activeRow?.hifzError,
          toV: activeRow?.toV,
          fromV: activeRow?.fromV,
          chapter: activeRow?.chapter,
          weeks: teacherComments.week,
          terms: teacherComments.term, 
          teacherComment: teacherComments.comment,
          teacherName: teacherComments.name, 
          teacherSign: teacherComments.signature, 
          newStarting: mgmtData.newHifz.starting,
          newStopping: mgmtData.newHifz.stopping,
          newScore: mgmtData.newHifz.score,
          hodComment: mgmtData.hodComment,
          prevStarting: mgmtData.prevHifz.starting,
          preStopping: mgmtData.prevHifz.stopping, 
          preScore: mgmtData.prevHifz.score,
        }
      );
      
      if (response.status === 200 || response.status === 204) {
        setStatus(prev => ({ ...prev, [section]: 'success' }));
        setTimeout(() => setStatus(prev => ({ ...prev, [section]: 'idle' })), 3000);
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, [section]: 'error' }));
    }
  };

  // --- HELPER TO GET DISPLAY VALUE ---
  const getDisplayValue = (idx, field, currentRowValue) => {
    const isEditing = focusedField === `${idx}-${field}`;
    if (isEditing) return currentRowValue;

    // Map long day name to short key (Saturday -> sat)
    const dayKey = teacherData[idx].day.slice(0, 3).toLowerCase();
    const dbValue = fetchedData?.[dayKey]?.[field];

    return dbValue !== undefined && dbValue !== "" ? dbValue : currentRowValue;
  };

  // --- STYLES ---
  const inputClass = "w-full h-full bg-transparent text-center focus:bg-blue-100 outline-none transition-all";
  const underlineInput = "border-b border-dotted border-black px-2 focus:bg-blue-50 outline-none";

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-[11px] text-black font-sans">
      <section className="mb-10 border-b-2 border-gray-300 pb-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">TEACHER'S WEEKLY REPORT</h1>
        
        <div className="flex justify-between mb-4 font-bold text-[12px]">
          <div>Week <input className={underlineInput} value={teacherComments.week} onChange={e => setTeacherComments({...teacherComments, week: e.target.value})} /></div>
          <div>Term <input className={underlineInput} value={teacherComments.term} onChange={e => setTeacherComments({...teacherComments, term: e.target.value})} /></div>
        </div>

        <table className="w-full border-collapse border border-black mb-4">
          <thead className="bg-gray-100 text-[9px]">
            <tr className="h-12">
              {['Date', 'Remark', 'Total', 'Tajweed', 'Hifz', 'Rule', 'Point', 'To', 'From', 'Chapter', 'Days'].map(h => (
                <th key={h} className="border border-black p-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teacherData.map((row, idx) => (
              <tr key={idx} className="h-8">
                {['date', 'remark', 'total', 'tajweed', 'hifz', 'tajError', 'hifzError', 'toV', 'fromV', 'chapter'].map((field) => (
                  <td key={field} className="border border-black">
                    <input 
                      type={field === "date" ? "date" : "text"} 
                      className={inputClass} 
                      value={getDisplayValue(idx, field, row[field])} 
                      onFocus={() => setFocusedField(`${idx}-${field}`)}
                      onBlur={() => setFocusedField(null)}
                      onChange={(e) => {
                        const updated = [...teacherData];
                        updated[idx][field] = e.target.value;
                        setTeacherData(updated);
                      }} 
                    />
                  </td>
                ))}
                <td 
                  onClick={() => setDay(row.day)} 
                  className={`border border-black font-bold text-center cursor-pointer transition-all ${
                    day === row.day ? "bg-blue-600 text-white" : "bg-gray-50 text-black hover:bg-gray-200"
                  }`}
                >
                  {row.day}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-y-4 mb-4">
          <div className="col-span-2">Comments: <input className="w-3/4 border-b border-black outline-none" value={teacherComments.comment} onChange={e => setTeacherComments({...teacherComments, comment: e.target.value})} /></div>
          <div>Signature: <input className={underlineInput} value={teacherComments.signature} onChange={e => setTeacherComments({...teacherComments, signature: e.target.value})} /></div>
          <div className="text-right">Name: <input className={underlineInput} value={teacherComments.name} onChange={e => setTeacherComments({...teacherComments, name: e.target.value})} /></div>
        </div>
        
        <div className="flex items-center gap-4">
            <button onClick={() => submitToBackend('teacher')} className="px-6 py-2 bg-blue-800 text-white font-bold rounded">
                Submit {day} Report
            </button>
            {status.teacher !== 'idle' && <span>{status.teacher}...</span>}
        </div>
      </section>

      {/* Remaining Management/Parent sections kept as per your logic... */}
    </div>
  );
};

export default WeeklyReport;