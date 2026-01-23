import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

const Edit = () => {
  const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const lower = days.map((items)=> items.slice(0,3).toLocaleLowerCase())

  const [response, setResponse] = useState([''])
  const [datas, setDatas] =useState({ 
      day:'', date: '', remark: '', total: '', tajweed: '', 
      hifz: '', tajError: '', hifzError: '', toV: '', fromV: '', chapter: '' 
    })
const [datas2, setDatas2] =useState({
    newHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' },
    prevHifz: { starting: '', stopping: '', score: '', grade: '', remark: '' },
    hodComment: ''
  })
const [increase,setIncrease] =  useState(0)


  // 1. FIXED: useParams is a hook and must be called with ()
  const { id } = useParams(); 

  // --- STATES ---
  const [teacherData, setTeacherData] = useState(
    lower.map(day => ({ 
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

const getGradeAndRemark = (score) => {
    if (score >= 75) {
        return { Grade: "A", Remark: "EXCELLENT" };
    } else if (score >= 70) {
        return { Grade: "B", Remark: "VERY GOOD" };
    } else if (score >= 60) {
        return { Grade: "C", Remark: "GOOD" };
    } else if (score >= 50) {
        return { Grade: "D", Remark: "PASS" };
    } else if(score >= 1) {
        return { Grade: "F", Remark: "FAIL" };
    } else {
        return {Grade:"--",Remark:"--"}
    }
};


  useEffect( async ()=>{
    
    try {
                const res =await  axios.get(`https://portal-database-seven.vercel.app/student/${id}`)
                
                if (!res.data) {
                    throw new Error("No data received from API.");
                }
                
                setResponse(res.data); 
                console.log(res.data)
                
            } catch (err) {
                console.error("Fetch error:", err);
                }
  },[id])
  

  const move = () =>{
    const init = 0
    const last = response?.teacher?.[0]?.sat?.length
    if(increase === init){
      setIncrease(prev => prev + 1)
      console.log(increase)

    }  else if(increase === last){
      setIncrease(init)
      console.log(increase)
    
  } else{
      setIncrease(prev => prev + 1)
       console.log(increase)
  }
}
  const back = ()=>{
    const init = 0
    const last = response?.teacher?.[0]?.sat?.length
    
    if(increase === init){
      setIncrease(()=> last)
      console.log(increase)
    }  else{
      setIncrease(prev => prev - 1)
      console.log(increase)

    }
  }
const managementFunc =()=>{
  const nScore = getGradeAndRemark(response?.management?.[0]?.newScore?.[increase]?.newScore)
  const pScore = getGradeAndRemark(response?.management?.[0]?.preScore?.[increase]?.preScore)

  

  const data = {
newHifz: { starting:response?.management?.[0]?.newStarting?.[increase]?.newStarting,
          stopping:response?.management?.[0]?.newStopping?.[increase]?.newStopping,
          score:response?.management?.[0]?.newScore?.[increase]?.newScore,
          grade:nScore.Grade,
          remark:nScore.Remark, 
},
prevHifz: { starting:response?.management?.[0]?.prevStarting?.[increase]?.prevStarting,
            stopping:response?.management?.[0]?.preStopping?.[increase]?.preStopping,
            score:response?.management?.[0]?. preScore?.[increase]?. preScore,
            grade:pScore.Grade,
            remark:pScore.Remark,
          },

  };

//  setDatas2(()=>data);
  return data;

}

const totalScore =  (hifz,hifzError,tajweed,tajError) =>{
     const cal = parseInt(hifz) + parseInt(tajweed)
     const calErr = parseInt(hifzError) + parseInt(tajError)
     
      if(hifz || hifzError || tajError || tajweed ){ return{
        total: cal - calErr,
       }} else{
                return{
                  total:"--"
                }
       }

    }

const createDataSource = (daily,k) => {

  const {total } = totalScore(
     response?.teacher?.[0]?.[daily]?.[increase]?.hifz,
     response?.teacher?.[0]?.[daily]?.[increase]?.hifzError,
     response?.teacher?.[0]?.[daily]?.[increase]?.tajweed,
     response?.teacher?.[0]?.[daily]?.[increase]?.tajError,
  )
       const {Remark} = getGradeAndRemark(total)  
                                                                            
        const data =  {
              date: response?.teacher?.[0]?.[daily]?.[increase]?.[k],
              remark: Remark,
              total: total,
              tajweed: response?.teacher?.[0]?.[daily]?.[increase]?.[k], 
              hifz: response?.teacher?.[0]?.[daily]?.[increase]?.[k],
              tajError: response?.teacher?.[0]?.[daily]?.[increase]?.[k], 
              hifzError: response?.teacher?.[0]?.[daily]?.[increase]?.[k],
              toV: response?.teacher?.[0]?.[daily]?.[increase]?.[k],
              fromV: response?.teacher?.[0]?.[daily]?.[increase]?.[k],
              chapter: response?.teacher?.[0]?.[daily]?.[increase]?.[k]
        }

        // setDatas(()=>data);
        return data;
           
    };
    
    
  

  // --- POST HANDLER ---a
const returnValue = (val1, val2) => {
  // If val1 has a value (isn't null/undefined/empty), use it. 
  // Otherwise, use val2.
  return (val1 !== undefined && val1 !== null && val1 !== "") ? val1 : val2;
};

  const submitToBackend = async (section) => {
    setStatus(prev => ({ ...prev, [section]: 'loading' }));
   const arr = ['sat', 'sun', 'mon','tue','wed','thur','fri'];

for (let i = 0; i < arr.length; i++) {
  


    try {
     
      
      const response = await axios.put(
        `https://portal-database-seven.vercel.app/student/edit/${id}/${arr[i]}/${increase}`, 
       {
          date: returnValue(teacherData.date,teacherData[increase]?.date),
          tajweed: returnValue(teacherData.tajweed,teacherData[increase]?.tajweed ),
          hifz: returnValue(teacherData.hifz,teacherData[increase]?.hifz ),
          tajError: returnValue(teacherData.tajError,teacherData[increase]?.tajError ),
          hifzError: returnValue(teacherData.hifzError,teacherData[increase]?.hifzError ),
          toV: returnValue(teacherData.toV,teacherData[increase]?.toV ),
          fromV: returnValue(teacherData.fromV,teacherData[increase]?.fromV ),
          chapter: returnValue(teacherData.chapter,teacherData[increase]?.chapter, ),
          weeks: returnValue(teacherData.week,teacherData[increase]?.week ),
          terms: returnValue(teacherData.term,teacherData[increase]?.term, ), 
          teacherComment: returnValue(teacherComments.comment, teacherComments[increase]?.comment),
          teacherName: returnValue(teacherComments.name,  teacherComments[increase]?.name), 
          teacherSign: returnValue(teacherComments.signature ,  teacherComments[increase]?.signature ), 
          newStarting: returnValue( mgmtData.newHifz.starting,'datas2.newHifz.starting'),
          newStopping: returnValue( mgmtData.newHifz.stopping,'datas2.newHifz.stopping '),
          newScore: returnValue( mgmtData.newHifz.score,'datas2.newHifz.score '),
          hodComment: returnValue( mgmtData.hodComment,'datas2.hodComment '),
          prevStarting: returnValue( mgmtData.prevHifz.starting,'datas2.prevHifz.starting '),
          preStopping: returnValue( mgmtData.prevHifz.stopping,'datas2.prevHifz.stopping, '), 
          preScore: returnValue( mgmtData.prevHifz.score,'datas2.prevHifz.score '),
      
          parentName: returnValue(parentData.name, parentData[increase]?.name),
          parentComment: returnValue(parentData.comment, parentData[increase]?.comment),
          parentDate: returnValue(parentData.date,  parentData[increase]?.date)
        }
      );
      
      // 3. FIXED: Axios uses response.status (Fetch uses response.ok)
      if (response.status === 200 || response.status === 204) {
        setStatus(prev => ({ ...prev, [section]: 'success' }));
        setTimeout(() => setStatus(prev => ({ ...prev, [section]: 'idle' })), 3000);
      }
    } catch  (error){
      console.error("Submission error details:", error.response?.data || error.message);
      setStatus(prev => ({ ...prev, [section]: 'error' }));
      setTimeout(() => setStatus(prev => ({ ...prev, [section]: 'idle' })), 5000);
    }
  }

  };

  // --- UI COMPONENTS ---z
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
    <div className="max-w-5xl mx-auto p-8 bg-white text-[11px] leading-tight text-black font-sans">
      
      {/* --- TEACHER SECTION --- */}
      <section className="mb-10 border-b-2 border-gray-300 pb-8">
        <h1 className="text-2xl font-bold text-center text-blue-900 mb-4 tracking-tighter">TEACHER'S WEEKLY REPORT</h1>
        
        <div className="flex justify-between mb-4 font-bold text-[12px]">
          <div>Week <input className={underlineInput} value={teacherComments.week} onChange={e => setTeacherComments({...teacherComments, week: e.target.value})} /> الأسبوع</div>
          <div onClick={()=>back()}><FaArrowAltCircleLeft/> </div>
          <div onClick={()=>move()}><FaArrowAltCircleRight /></div>
          <div>Term <input className={underlineInput} value={teacherComments.term} onChange={e => setTeacherComments({...teacherComments, term: e.target.value})} /> الفترة</div>
        </div>

        <table className="w-full border-collapse border border-black mb-4">
          <thead className="bg-gray-100 uppercase text-[9px]">
            <tr className="h-12">
              <th className="border border-black p-1">التاريخ<br/>Date</th>
              <th className="border border-black p-1">التقدير<br/>Remark</th>
              <th className="border border-black p-1 w-12">مجموع<br/>Total (100)</th>
              <th className="border border-black p-1">درجة التجويد<br/>Tajweed (30)</th>
              <th className="border border-black p-1">درجة الحفظ<br/>Hifz (70)</th>
              <th className="border border-black p-1">أخطاء تجويدية<br/>Tajweed Rule</th>
              <th className="border border-black p-1">أخطاء حفظية<br/>Hifz Point</th>
              <th className="border border-black p-1">إلى آية<br/>To Verse</th>
              <th className="border border-black p-1">من آية<br/>From Verse</th>
              <th className="border border-black p-1">سورة<br/>Chapters</th>
              <th className="border border-black p-1 bg-gray-200 uppercase">Days<br/>الأيام</th>
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
                      value={row[field]? row[field] :createDataSource(row?.day, field)[field]}
                      onChange={(e) => {
                        const updated = [...teacherData];
                        updated[idx][field] = e.target.value;
                        setTeacherData(updated);
                      }} 
            
                    />
                  </td>
                ))}
                <td  className={ "border border-black bg-gray-50 font-bold text-center"}>{row.day.toLocaleUpperCase()
                  }</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-y-4 mb-4">
          <div className="col-span-2">Teacher's Comments: <input className="w-3/4 border-b border-black outline-none" value={teacherComments.comment ? response?.teacher?.[0]?.teacherComment?.[increase]?.teacherComment : teacherComments.comment} onChange={e => setTeacherComments({...teacherComments, comment: e.target.value})} /> ملاحظات المعلم</div>
          <div>Signature: <input className={underlineInput} value={teacherComments.signature ? response?.teacher?.[0]?.teacherSign?.[increase]?.teacherSign : teacherComments.signature} onChange={e => setTeacherComments({...teacherComments, signature: e.target.value})} /> التوقيع</div>
          <div className="text-right">Teacher's Name: <input className={underlineInput} value={teacherComments.name ? response?.teacher?.[0]?.teacherName?.[increase]?.teacherName: teacherComments.name} onChange={e => setTeacherComments({...teacherComments, name: e.target.value})} /> اسم المعلم</div>
        </div>
        <SubmitButton section="teacher" label="Submit Teacher Report" onClick={() => submitToBackend('teacher', 'teacher-report', { teacherData, teacherComments })} />
        
      </section>

      {/* --- MANAGEMENT SECTION --- */}
      <section className="mb-10 border-b-2 border-gray-300 pb-8">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Management Weekly Report</h2>
        <table className="w-full border-collapse border border-black text-center mb-4">
          <thead className="bg-gray-100 h-10 uppercase text-[9px]">
            <tr>
              <th className="border border-black p-1">التطبيق<br/>Remark</th>
              <th className="border border-black p-1">الدرجة<br/>Grade</th>
              <th className="border border-black p-1">النتيجة<br/>Score</th>
              <th className="border border-black p-1">الإنتهاء<br/>Stopping</th>
              <th className="border border-black p-1">الإبتداء<br/>Starting</th>
              <th className="border border-black p-1 bg-gray-200 w-40 font-bold">الموضوع<br/>Topic</th>
            </tr>
          </thead>
          <tbody>
            {[{l:'الحفظ الجديد New Hifz', k:'newHifz'}, {l:'الحفظ السابق Prev Hifz', k:'prevHifz'}].map((topic) => (
              <tr key={topic.k} className="h-12">
                {['remark', 'grade', 'score', 'stopping', 'starting'].map(field => (
                  <td key={field} className="border border-black">
                    <input className={inputClass}  value={ mgmtData[topic.k][field] ?  mgmtData[topic.k][field]: managementFunc()[topic.k][field]} onChange={e => setMgmtData({...mgmtData, [topic.k]: {...mgmtData[topic.k], [field]: e.target.value}})} />
                  </td>
                ))}
                <td className="border border-black font-bold bg-gray-50 text-[10px]">{topic.l}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mb-4 font-bold">
          Qur'an HOD's Comment: <input className="w-3/4 border-b border-black outline-none font-normal" value={!mgmtData.hodComment ? response?.management?.[0]?.hodComment?.[increase]?.hodComment:  mgmtData.hodComment} onChange={e => setMgmtData({...mgmtData, hodComment: e.target.value})} /> ملاحظات رئيس القسم
        </div>
        <SubmitButton section="mgmt" label="Submit Management Report" onClick={() => submitToBackend('mgmt', 'management-report', mgmtData)} />
      </section>

      {/* --- PARENT SECTION --- */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-center text-blue-900 mb-4 uppercase">Parent/Guardian's Weekly Report</h2>
        <p className="mb-4 leading-relaxed text-[12px] italic text-gray-800">
          I, <input className={underlineInput} value={!parentData.name ? response?.parent?.[0]?.parentName?.[increase]?.parentName : parentData.name} onChange={e => setParentData({...parentData, name: e.target.value})} /> the Parent/Guardian of the above named pupil/ward hereby certified that, I listened, observed and supervised my child's/ward's progress for this week in comparison with the school report and Allah is my witness.
        </p>
        <div className="space-y-4 mb-4">
          <div className="font-bold">Parent/Guardian's Comment: <input className="w-2/3 border-b border-black outline-none font-normal" value={!parentData.comment? response?.parent?.[0]?.parentComment?.[increase]?.parentComment : parentData.comment} onChange={e => setParentData({...parentData, comment: e.target.value})} /></div>
          <div className="font-bold">Sign/Date: <input className={underlineInput} type="date" value={!parentData.date? response?.parent?.[0]?.parentDate?.[increase]?.parentDate : parentData.date} onChange={e => setParentData({...parentData, date: e.target.value})} /></div>
        </div>

        <SubmitButton section="parent" label="Submit Parent Report" onClick={() => submitToBackend('parent', 'parent-report', parentData)} />
      </section>

      {/* --- GRADING KEY --- */}
      <div className="flex w-full border border-black text-center font-bold text-[10px] uppercase mt-10 bg-gray-50">
        <div className="flex-1 border-r border-black p-2">70-100 EXCELLENT (A)</div>
        <div className="flex-1 border-r border-black p-2">60-69 VERY GOOD (B)</div>
        <div className="flex-1 border-r border-black p-2">50-59 GOOD (C)</div>
        <div className="flex-1 border-r border-black p-2">40-49 PASS (D)</div>
        <div className="flex-1 p-2">0-39 FAIL (F)</div>
      </div>
    </div>
  );
};

export default Edit;