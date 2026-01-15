import axios from 'axios';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const WeeklyReport = () => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const [day, setDay] = useState('')
  
  // 1. FIXED: useParams is a hook and must be called with ()
  const { id } = useParams(); 

  // --- STATES ---
  const [teacherData, setTeacherData] = useState(
    days.map(day => ({ 
      day, date: '', remark: '', total: '', tajweed: '', 
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

  // --- POST HANDLER ---
  const submitToBackend = async (section) => {
    setStatus(prev => ({ ...prev, [section]: 'loading' }));
    
    try {
      // 2. FIXED: Accessing teacherData as an array and combining with single state objects
      const payload = {
        // We send the entire array of daily records
         ...teacherData, 
        // Metadata from teacherComments
        week: teacherComments.week,
        term: teacherComments.term,
        teacherComment: teacherComments.comment,
        teacherName: teacherComments.name,
        teacherSign: teacherComments.signature,
        // Management data
        management: mgmtData,
        // Parent data
        parent: parentData
      };

      const response = await axios.put(
        `https://portal-database-seven.vercel.app/student/push/${id}/${day.slice(0,3).toLocaleLowerCase()}`, 
       {
          date:teacherData[0]?.date,
          tajweed:teacherData[0]?.tajweed,
          hifz:teacherData[0]?.hifz,
          tajError:teacherData[0]?.tajError,
          hifzError:teacherData[0]?.hifzError,
          toV:teacherData[0]?.toV,
          fromV:teacherData[0]?.fromV,
          chapter:teacherData[0]?.chapter,
          weeks:teacherData[0]?.week,
          terms:teacherData[0]?.term, 
          teacherComment:teacherComments.comment,
          teacherName:teacherComments.name, 
          teacherSign:teacherComments.signature , 
          newStarting: mgmtData.newHifz.starting,
          newStopping: mgmtData.newHifz.stopping,
          newScore: mgmtData.newHifz.score,
          hodComment: mgmtData.hodComment,
          prevStarting: mgmtData.prevHifz.starting,
          preStopping: mgmtData.prevHifz.stopping, 
          preScore: mgmtData.prevHifz.score,}
      );
      
      // 3. FIXED: Axios uses response.status (Fetch uses response.ok)
      if (response.status === 200 || response.status === 204) {
        setStatus(prev => ({ ...prev, [section]: 'success' }));
        setTimeout(() => setStatus(prev => ({ ...prev, [section]: 'idle' })), 3000);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setStatus(prev => ({ ...prev, [section]: 'error' }));
      setTimeout(() => setStatus(prev => ({ ...prev, [section]: 'idle' })), 5000);
    }
  };

  // --- UI COMPONENTS ---
  const StatusMessage = ({ type }) => {
    if (type === 'idle') return null;
    const config = {
      loading: { text: 'Saving changes...', color: 'text-blue-600', icon: '🔄' },
      success: { text: 'Report saved successfully!', color: 'text-green-600', icon: '✅' },
      error: { text: 'Failed to save. Try again.', color: 'text-red-600', icon: '❌' }
    };
    return (
      <div className={`flex items-center gap-2 font-bold text-[12px] ${config[type].color}`}>
        <span>{config[type].icon}</span> {config[type].text}
      </div>
    );
  };

  const SubmitButton = ({ section, onClick, label }) => {
    const isIdle = status[section] === 'idle';
    return (
      <div className="flex items-center gap-4 mt-4 print:hidden">
        <button
          onClick={onClick}
          disabled={!isIdle}
          className={`px-6 py-2 rounded font-bold text-white transition-all ${
            !isIdle ? 'bg-gray-400' : 'bg-blue-800 hover:bg-blue-900'
          }`}
        >
          {status[section] === 'loading' ? 'Processing...' : label}
        </button>
        <StatusMessage type={status[section]} />
      </div>
    );
  };

  const inputClass = "w-full h-full bg-transparent text-center focus:bg-blue-50 outline-none transition-all";
  const underlineInput = "border-b border-dotted border-black px-2 focus:bg-blue-50 outline-none";

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white text-[11px] text-black font-sans">
      
      {/* TEACHER SECTION */}
      <section className="mb-10 border-b-2 border-gray-300 pb-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-4">TEACHER'S WEEKLY REPORT</h1>
        
        <div className="flex justify-between mb-4 font-bold text-[12px]">
          <div>Week <input className={underlineInput} value={teacherComments.week} onChange={e => setTeacherComments({...teacherComments, week: e.target.value})} /></div>
          <div>Term <input className={underlineInput} value={teacherComments.term} onChange={e => setTeacherComments({...teacherComments, term: e.target.value})} /></div>
        </div>

        <table className="w-full border-collapse border border-black mb-4">
          <thead className="bg-gray-100 text-[9px]">
            <tr className="h-12">
              <th className="border border-black p-1">Date</th>
              <th className="border border-black p-1">Remark</th>
              <th className="border border-black p-1 w-12">Total (100)</th>
              <th className="border border-black p-1">Tajweed (30)</th>
              <th className="border border-black p-1">Hifz (70)</th>
              <th className="border border-black p-1">Tajweed Rule</th>
              <th className="border border-black p-1">Hifz Point</th>
              <th className="border border-black p-1">To Verse</th>
              <th className="border border-black p-1">From Verse</th>
              <th className="border border-black p-1">Chapters</th>
              <th className="border border-black p-1 bg-gray-200">Days</th>
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
                      value={row[field]} 
                      onChange={(e) => {
                        const updated = [...teacherData];
                        updated[idx][field] = e.target.value;
                        setTeacherData(updated);
                      }} 
                    />
                  </td>
                ))}
                <td onClick={()=>setDay(row.day)} className={day === row.day? " border border-black text-white bg-sky-500/100 font-bold text-center": "border border-black bg-gray-50 font-bold text-center"}>{row.day}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-y-4 mb-4">
          <div className="col-span-2">Comments: <input className="w-3/4 border-b border-black outline-none" value={teacherComments.comment} onChange={e => setTeacherComments({...teacherComments, comment: e.target.value})} /></div>
          <div>Signature: <input className={underlineInput} value={teacherComments.signature} onChange={e => setTeacherComments({...teacherComments, signature: e.target.value})} /></div>
          <div className="text-right">Name: <input className={underlineInput} value={teacherComments.name} onChange={e => setTeacherComments({...teacherComments, name: e.target.value})} /></div>
        </div>
        
        <SubmitButton section="teacher" label="Submit Teacher Report" onClick={() => submitToBackend('teacher')} />
      </section>

      {/* MANAGEMENT SECTION */}
      <section className="mb-10 border-b-2 border-gray-300 pb-8">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Management Weekly Report</h2>
        <table className="w-full border-collapse border border-black text-center mb-4">
          <thead className="bg-gray-100 h-10 uppercase text-[9px]">
            <tr>
              <th className="border border-black p-1">Remark</th>
              <th className="border border-black p-1">Grade</th>
              <th className="border border-black p-1">Score</th>
              <th className="border border-black p-1">Stopping</th>
              <th className="border border-black p-1">Starting</th>
              <th className="border border-black p-1 bg-gray-200 w-40 font-bold">Topic</th>
            </tr>
          </thead>
          <tbody>
            {[{l:'New Hifz', k:'newHifz'}, {l:'Prev Hifz', k:'prevHifz'}].map((topic) => (
              <tr key={topic.k} className="h-12">
                {['remark', 'grade', 'score', 'stopping', 'starting'].map(field => (
                  <td key={field} className="border border-black">
                    <input className={inputClass} value={mgmtData[topic.k][field]} onChange={e => setMgmtData({...mgmtData, [topic.k]: {...mgmtData[topic.k], [field]: e.target.value}})} />
                  </td>
                ))}
                <td className="border border-black font-bold bg-gray-50 text-[10px]">{topic.l}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mb-4 font-bold">
          HOD Comment: <input className="w-3/4 border-b border-black outline-none font-normal" value={mgmtData.hodComment} onChange={e => setMgmtData({...mgmtData, hodComment: e.target.value})} />
        </div>
        <SubmitButton section="mgmt" label="Submit Management Report" onClick={() => submitToBackend('mgmt')} />
      </section>

      {/* PARENT SECTION */}
      <section>
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Parent's Weekly Report</h2>
        <p className="mb-4 italic text-gray-800">
          I, <input className={underlineInput} value={parentData.name} onChange={e => setParentData({...parentData, name: e.target.value})} /> hereby certify progress.
        </p>
        <SubmitButton section="parent" label="Submit Parent Report" onClick={() => submitToBackend('parent')} />
      </section>
    </div>
  );
};

export default WeeklyReport;