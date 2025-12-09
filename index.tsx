import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// --- ICONS (Same as before but logic extracted) ---
const Icon = ({ size = 20, className="", ...props }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props} />
);
const Icons = {
    Shield: (p: any) => <Icon {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></Icon>,
    Book: (p: any) => <Icon {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></Icon>,
    Users: (p: any) => <Icon {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Icon>,
    Plus: (p: any) => <Icon {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Icon>,
    Trash: (p: any) => <Icon {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Icon>,
    Eye: (p: any) => <Icon {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></Icon>,
    Download: (p: any) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Icon>,
    Check: (p: any) => <Icon {...p}><polyline points="20 6 9 17 4 12"/></Icon>,
    Play: (p: any) => <Icon {...p}><polygon points="5 3 19 12 5 21 5 3"/></Icon>,
    LogOut: (p: any) => <Icon {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Icon>,
    Cloud: (p: any) => <Icon {...p}><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></Icon>,
    X: (p: any) => <Icon {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Icon>,
    Edit: (p: any) => <Icon {...p}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></Icon>,
    AlertTriangle: (p: any) => <Icon {...p}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></Icon>,
    Lock: (p: any) => <Icon {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Icon>,
    Clock: (p: any) => <Icon {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Icon>,
    ThumbsUp: (p: any) => <Icon {...p}><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></Icon>,
    ThumbsDown: (p: any) => <Icon {...p}><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/></Icon>,
    ChevronRight: (p: any) => <Icon {...p}><polyline points="9 18 15 12 9 6" /></Icon>,
    Map: (p: any) => <Icon {...p}><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></Icon>,
    Info: (p: any) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></Icon>,
    FileSpreadsheet: (p: any) => <Icon {...p}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></Icon>,
    Calculator: (p: any) => <Icon {...p}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></Icon>,
    BarChart: (p: any) => <Icon {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></Icon>,
    Flag: (p: any) => <Icon {...p}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></Icon>,
    ZoomIn: (p: any) => <Icon {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></Icon>,
    Shuffle: (p: any) => <Icon {...p}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></Icon>
};

// --- CONFIG ---
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCrpCFcwF9TtVMOzi2zNJYv-IVYKENC_i4",
    authDomain: "gnhs-online-exam-solution.firebaseapp.com",
    databaseURL: "https://gnhs-online-exam-solution-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "gnhs-online-exam-solution",
    storageBucket: "gnhs-online-exam-solution.firebasestorage.app",
    messagingSenderId: "582595227570",
    appId: "1:582595227570:web:b912bc8c007248a085feab",
    measurementId: "G-RSTERRCZ19"
};

const AUTHORIZED_TEACHERS = [
    "alvin.alfonso1262@gmail.com",
    "alvin.alfonso2222@gmail.com",
    "mitchie.alfonso@deped.gov.ph",
    "mitchiealfonso12@gmail.com",
    "alvina.rhss@gmail.com"
];

const ALLOWED_YEARS = ["7", "8", "9", "10", "11", "12"];
const QUESTION_TYPES_ORDER = [
    { type: 'multiple_choice', title: 'I. Multiple Choice' },
    { type: 'true_false', title: 'II. True or False' },
    { type: 'identification', title: 'III. Identification' },
    { type: 'essay', title: 'IV. Essay' }
];

if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.database();

// --- HELPERS ---
const calculateScore = (submission: any, examData: any) => {
    if (!examData || !examData.questions) return "N/A";
    let score = 0;
    let max = 0; 
    
    const questions = Array.isArray(examData.questions) ? examData.questions : Object.values(examData.questions || {});

    questions.forEach((q: any) => {
        const points = q.points || 1;
        max += points;
        
        if (submission.manualGrades && submission.manualGrades[q.id] !== undefined) {
            score += submission.manualGrades[q.id];
            return;
        }

        const studentAns = submission.answers[q.id];
        if (!studentAns) return;

        if (q.type === 'multiple_choice' || q.type === 'true_false') {
            if (studentAns === q.correctAnswer) score += points;
        } else if (q.type === 'identification') {
            if (q.correctAnswer && studentAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) score += points;
        }
    });
    return max > 0 ? `${score}/${max}` : "Manual";
};

const shuffleArray = (array: any[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

// --- COMPONENTS ---

const Calculator = ({ onClose }: any) => {
    const [display, setDisplay] = useState('0');
    const [prev, setPrev] = useState<number | null>(null);
    const [op, setOp] = useState<string | null>(null);
    const [newNum, setNewNum] = useState(true);

    const handleNum = (num: string) => {
        if(newNum) { setDisplay(num); setNewNum(false); }
        else setDisplay(display === '0' ? num : display + num);
    };

    const handleOp = (operator: string) => {
        setOp(operator);
        setPrev(parseFloat(display));
        setNewNum(true);
    };

    const calculate = () => {
        if(op && prev !== null) {
            const current = parseFloat(display);
            let result = 0;
            switch(op) {
                case '+': result = prev + current; break;
                case '-': result = prev - current; break;
                case '*': result = prev * current; break;
                case '/': result = prev / current; break;
            }
            setDisplay(String(result));
            setPrev(null); setOp(null); setNewNum(true);
        }
    };

    const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setNewNum(true); };

    return (
        <div className="fixed bottom-4 right-4 w-72 bg-white border-2 border-pastel-yellow rounded-2xl shadow-xl z-50 overflow-hidden animate-slide-up">
            <div className="bg-pastel-blueLight p-3 flex justify-between items-center border-b border-pastel-blue cursor-grab">
                <span className="text-pastel-navy font-bold flex items-center gap-2"><Icons.Calculator size={16}/> Calculator</span>
                <button onClick={onClose} className="text-pastel-navy hover:text-pastel-red"><Icons.X size={16}/></button>
            </div>
            <div className="p-4">
                <div className="bg-paper p-3 rounded-lg mb-4 text-right text-2xl font-mono text-pastel-navy border-2 border-pastel-blue overflow-x-auto">
                    {display}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => (
                        <button key={btn} onClick={() => { if(!isNaN(Number(btn)) || btn === '.') handleNum(btn); else if(btn === '=') calculate(); else handleOp(btn); }}
                            className={`p-3 rounded-lg font-bold transition-all shadow-sm ${btn === '=' ? 'bg-pastel-yellow text-pastel-navy col-span-2 hover:bg-yellow-200' : ['/','*','-','+'].includes(btn) ? 'bg-pastel-blue text-white hover:bg-blue-300' : 'bg-white text-pastel-navy border border-pastel-blueLight hover:bg-pastel-blueLight'}`}>
                            {btn}
                        </button>
                    ))}
                    <button onClick={clear} className="col-span-2 p-2 bg-pastel-red/20 text-red-500 rounded-lg border border-pastel-red text-xs uppercase font-bold hover:bg-pastel-red/30">Clear</button>
                </div>
            </div>
        </div>
    );
};

const ExamCard = ({ exam, onToggleStatus, onDelete, onViewResults, onEdit }: any) => {
    const isPublished = exam.status === 'published';
    const now = new Date().getTime();
    const start = exam.startDate ? new Date(exam.startDate).getTime() : 0;
    const end = exam.endDate ? new Date(exam.endDate).getTime() : Infinity;
    
    let statusLabel = "Draft";
    let statusColor = "text-gray-400 bg-gray-100 border-gray-200";
    
    if (isPublished) {
        if (now < start) {
            statusLabel = "Scheduled";
            statusColor = "text-blue-500 bg-blue-50 border-blue-200";
        } else if (now > end) {
            statusLabel = "Closed";
            statusColor = "text-red-500 bg-red-50 border-red-200";
        } else {
            statusLabel = "Active";
            statusColor = "text-green-600 bg-green-50 border-green-200";
        }
    }

    return (
        <div className="bg-white rounded-2xl p-6 mb-4 border-2 border-pastel-blueLight shadow-sm hover:shadow-lg hover:border-pastel-yellow transition-all duration-300 relative overflow-hidden group">
            <div className={`absolute left-0 top-0 bottom-0 w-2 ${isPublished ? 'bg-pastel-green' : 'bg-gray-300'}`}></div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pl-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-xl text-pastel-navy tracking-tight">{exam.title}</h3>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusColor}`}>
                            {statusLabel === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>}
                            {statusLabel}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                        <span className="bg-pastel-blueLight px-2 py-1 rounded-md text-pastel-navy font-medium">{exam.subject}</span>
                        <span className="bg-pastel-yellowDim text-pastel-navy px-2 py-1 rounded-md font-medium">{exam.yearLevel}</span>
                        {exam.duration && <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1"><Icons.Clock size={12}/> {exam.duration}m</span>}
                        {exam.startDate && <span className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1 text-xs">📅 {new Date(exam.startDate).toLocaleDateString()}</span>}
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 mt-4 md:mt-0">
                    <button onClick={() => onToggleStatus(exam)} className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${isPublished ? 'bg-pastel-yellowDim text-yellow-700 hover:bg-yellow-200' : 'bg-pastel-green text-green-800 hover:bg-green-300'}`}>
                        {isPublished ? <><Icons.X size={16}/> Unpublish</> : <><Icons.Cloud size={16}/> Publish</>}
                    </button>
                    <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                        <button onClick={() => onEdit(exam)} className="p-2 text-gray-400 hover:text-pastel-navy hover:bg-white rounded-lg transition-all" title="Edit"><Icons.Edit size={18}/></button>
                        <button onClick={() => onViewResults(exam.id)} className="p-2 text-gray-400 hover:text-pastel-blue hover:bg-white rounded-lg transition-all" title="Results"><Icons.BarChart size={18}/></button>
                        <button onClick={() => onDelete(exam.id)} className="p-2 text-gray-400 hover:text-pastel-red hover:bg-white rounded-lg transition-all" title="Delete"><Icons.Trash size={18}/></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GradingModal = ({ submission, examData, onClose }: any) => {
    const questions = examData.questions || [];
    const setManualGrade = (subId: string, qId: string, val: number) => {
        db.ref(`submissions/${subId}/manualGrades/${qId}`).set(val);
        db.ref(`submissions/${subId}/reviews/${qId}`).set(true);
    };
    return (
        <div className="fixed inset-0 z-[60] bg-pastel-navy/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl animate-slide-up">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-pastel-blueLight/50 rounded-t-3xl">
                    <div><h3 className="text-xl font-bold text-pastel-navy">{submission.studentName}</h3><p className="text-sm text-gray-500">Manual Grading</p></div>
                    <div className="flex items-center gap-4">
                         <div className="text-right"><p className="text-[10px] font-bold uppercase text-gray-400">Score</p><p className="text-2xl font-bold text-pastel-navy">{calculateScore(submission, examData)}</p></div>
                         <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><Icons.X/></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scroller bg-paper">
                    {questions.map((q: any, idx: number) => {
                        const studentAns = submission.answers[q.id];
                        const manualGrade = submission.manualGrades?.[q.id];
                        const maxPoints = q.points || 1;
                        let currentScore = manualGrade !== undefined ? manualGrade : (q.type === 'multiple_choice' || q.type === 'true_false' ? (studentAns === q.correctAnswer ? maxPoints : 0) : 0);
                        if (q.type === 'identification' && q.correctAnswer && studentAns?.toLowerCase() === q.correctAnswer.toLowerCase()) currentScore = maxPoints;

                        return (
                            <div key={q.id} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between mb-4">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Q{idx+1} • {q.type}</span>
                                    <span className="text-xs font-bold bg-pastel-blueLight text-pastel-navy px-2 py-1 rounded">{maxPoints} pts</span>
                                </div>
                                <p className="font-medium text-lg mb-4">{q.text}</p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                                    <span className="text-xs text-gray-400 font-bold block mb-1 uppercase">Answer</span>
                                    <span className="text-pastel-navy font-medium whitespace-pre-wrap">{studentAns || <i className="text-gray-400">No Answer</i>}</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-sm font-bold text-gray-400 mr-2">Grade:</span>
                                    <input type="number" min="0" max={maxPoints} value={manualGrade !== undefined ? manualGrade : currentScore} 
                                        onChange={(e) => setManualGrade(submission.id, q.id, Math.min(maxPoints, Math.max(0, parseInt(e.target.value)||0)))}
                                        className="w-16 p-2 text-center font-bold rounded-lg border-2 border-pastel-blueLight focus:border-pastel-yellow" />
                                    <span className="text-gray-400 text-sm">/ {maxPoints}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const TeacherDashboard = ({ user, teacherName, onLogout }: any) => {
    const [view, setView] = useState("list"); 
    const [exams, setExams] = useState<any[]>([]);
    const [newExam, setNewExam] = useState<any>({ title: "", subject: "", yearLevel: "", duration: "", startDate: "", endDate: "", questions: [], instructions: {} });
    const [qType, setQType] = useState("multiple_choice");
    const [curQ, setCurQ] = useState<any>({ text: "", options: ["","","",""], correctAnswer: "", points: 1 });
    const [editingExamId, setEditingExamId] = useState(null); 
    const [stats, setStats] = useState(null);

    useEffect(() => {
        db.ref('exams').orderByChild('teacherEmail').equalTo(user.email).on('value', s => {
            const data = s.val();
            setExams(data ? Object.entries(data).map(([k,v]: [string, any]) => ({id:k, ...v})).reverse() : []);
        });
    }, [user]);

    const saveExam = () => {
        if(!newExam.title || !newExam.subject) return alert("Missing details.");
        if(newExam.questions.length === 0) return alert("Add questions.");
        const payload = { 
            ...newExam, 
            duration: newExam.duration ? parseInt(newExam.duration) : null,
            teacherEmail: user.email, teacherName, 
            status: newExam.status || 'draft', 
            createdAt: new Date().toISOString()
        };
        if (editingExamId) db.ref(`exams/${editingExamId}`).update(payload);
        else db.ref('exams').push(payload);
        setNewExam({ title: "", subject: "", yearLevel: "", duration: "", startDate: "", endDate: "", questions: [], instructions: {} });
        setEditingExamId(null); setView("list");
    };

    const addQuestion = () => {
        if(!curQ.text) return;
        const newQ = { ...curQ, id: Date.now(), type: qType };
        setNewExam((p: any) => ({ ...p, questions: [...p.questions, newQ] }));
        setCurQ({ text: "", options: ["","","",""], correctAnswer: "", points: 1 });
    };

    // Simple "Duplicate" feature as a Question Bank proxy
    const importQuestions = () => {
        const sourceExam = exams[0]; // Just take latest for demo or add a selector
        if(sourceExam && confirm(`Import ${sourceExam.questions.length} questions from "${sourceExam.title}"?`)) {
            setNewExam((p: any) => ({...p, questions: [...p.questions, ...sourceExam.questions]}));
        } else if (!sourceExam) alert("No previous exams to import from.");
    };

    if (view === "results") return <ResultsDashboard examId={stats} onClose={() => { setView("list"); setStats(null); }} />;

    return (
        <div className="min-h-screen pb-20 bg-paper">
            <header className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-pastel-yellow p-2 rounded-xl text-pastel-navy"><Icons.Shield size={24}/></div>
                    <h1 className="text-xl font-bold text-pastel-navy tracking-tight">FocusExam <span className="text-pastel-blue font-medium text-sm">Teacher</span></h1>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-600 hidden md:block">{teacherName}</span>
                    <button onClick={onLogout} className="text-gray-400 hover:text-pastel-red bg-gray-50 p-2 rounded-xl transition-colors"><Icons.LogOut size={20}/></button>
                </div>
            </header>

            <div className="max-w-6xl mx-auto p-8 animate-slide-up">
                {view === 'list' && (
                    <>
                        <div className="flex justify-between items-center mb-10">
                            <div><h2 className="text-3xl font-bold text-pastel-navy">My Exams</h2><p className="text-gray-400 mt-1">Manage assessments & view analytics.</p></div>
                            <button onClick={() => { setView('create'); }} className="bg-pastel-yellow text-pastel-navy px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-yellow-300 shadow-md transition-all hover:-translate-y-1"><Icons.Plus size={20}/> New Exam</button>
                        </div>
                        {exams.length === 0 ? <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200"><p className="text-gray-400">No exams yet.</p></div> : <div className="grid gap-4">{exams.map((ex: any) => <ExamCard key={ex.id} exam={ex} onToggleStatus={(e: any) => db.ref(`exams/${e.id}/status`).set(e.status==='published'?'draft':'published')} onDelete={(id: any) => confirm("Delete?") && db.ref(`exams/${id}`).remove()} onViewResults={(id: any) => { setStats(id); setView('results'); }} onEdit={(e: any) => { setEditingExamId(e.id); setNewExam(e); setView('create'); }} />)}</div>}
                    </>
                )}

                {view === 'create' && (
                    <div className="grid lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-pastel-navy mb-6 flex items-center gap-2"><Icons.Book size={20} className="text-pastel-yellow"/> Exam Details</h3>
                                <div className="space-y-4">
                                    <input className="w-full p-3 rounded-xl text-sm" placeholder="Exam Title" value={newExam.title} onChange={e => setNewExam({...newExam, title: e.target.value})} />
                                    <input className="w-full p-3 rounded-xl text-sm" placeholder="Subject" value={newExam.subject} onChange={e => setNewExam({...newExam, subject: e.target.value})} />
                                    <select className="w-full p-3 rounded-xl text-sm" value={newExam.yearLevel} onChange={e => setNewExam({...newExam, yearLevel: e.target.value})}>
                                        <option value="">Select Year Level...</option>
                                        {ALLOWED_YEARS.map(y => <option key={y} value={`Grade ${y}`}>Grade {y}</option>)}
                                    </select>
                                    <input type="number" className="w-full p-3 rounded-xl text-sm" placeholder="Duration (Minutes)" value={newExam.duration} onChange={e => setNewExam({...newExam, duration: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-2">
                                        <div><label className="text-xs font-bold text-gray-400">Start Date</label><input type="datetime-local" className="w-full p-2 rounded-xl text-xs" value={newExam.startDate} onChange={e => setNewExam({...newExam, startDate: e.target.value})} /></div>
                                        <div><label className="text-xs font-bold text-gray-400">End Date</label><input type="datetime-local" className="w-full p-2 rounded-xl text-xs" value={newExam.endDate} onChange={e => setNewExam({...newExam, endDate: e.target.value})} /></div>
                                    </div>
                                    <button onClick={saveExam} className="w-full bg-pastel-yellow text-pastel-navy py-4 rounded-xl font-bold shadow-md hover:translate-y-[-2px] transition-all">Save Exam</button>
                                    <button onClick={()=>setView('list')} className="w-full text-gray-400 py-2 text-sm font-bold">Cancel</button>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-pastel-navy">Add Question</h3>
                                    <button onClick={importQuestions} className="text-xs font-bold text-pastel-blue bg-pastel-blueLight px-3 py-1 rounded-lg">Import Last</button>
                                </div>
                                <div className="flex gap-2 mb-4 bg-gray-50 p-1.5 rounded-xl">
                                    {['multiple_choice', 'true_false', 'identification', 'essay'].map(t => (
                                        <button key={t} onClick={() => setQType(t)} className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-lg transition-all ${qType === t ? 'bg-white text-pastel-navy shadow-sm' : 'text-gray-400'}`}>{t.replace('_', ' ').substring(0,8)}</button>
                                    ))}
                                </div>
                                <textarea className="w-full p-4 rounded-xl text-sm h-24 mb-4 resize-none" placeholder="Question text..." value={curQ.text} onChange={e => setCurQ({...curQ, text: e.target.value})}></textarea>
                                {qType === 'multiple_choice' && curQ.options.map((o: any, i: number) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input type="radio" checked={curQ.correctAnswer === o && o !== ""} onChange={() => setCurQ({...curQ, correctAnswer: o})} />
                                        <input className="flex-1 p-2 rounded-lg text-sm bg-gray-50" placeholder={`Option ${i+1}`} value={o} onChange={e => { const n = [...curQ.options]; n[i] = e.target.value; setCurQ({...curQ, options: n}); }}/>
                                    </div>
                                ))}
                                {qType === 'identification' && <input className="w-full p-3 rounded-xl text-sm mb-4" placeholder="Correct Answer" value={curQ.correctAnswer} onChange={e => setCurQ({...curQ, correctAnswer: e.target.value})} />}
                                {qType === 'true_false' && <div className="flex gap-4 mb-4">{['True', 'False'].map(o => <label key={o} className="flex-1 p-3 border rounded-lg cursor-pointer text-center"><input type="radio" checked={curQ.correctAnswer === o} onChange={()=>setCurQ({...curQ, correctAnswer: o})} className="mr-2"/>{o}</label>)}</div>}
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2"><span className="text-xs font-bold text-gray-400">Points:</span><input type="number" className="w-16 p-2 rounded-lg text-center" value={curQ.points} onChange={e => setCurQ({...curQ, points: parseInt(e.target.value)||1})} /></div>
                                    <button onClick={addQuestion} className="bg-pastel-blue text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-400">Add</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {newExam.questions.map((q: any, i: number) => (
                                    <div key={i} className="p-4 bg-white rounded-xl border border-gray-100 flex justify-between items-center">
                                        <div><span className="font-bold text-pastel-navy mr-2">{i+1}.</span><span className="text-gray-600 text-sm">{q.text}</span></div>
                                        <button onClick={() => setNewExam((p: any) => ({...p, questions: p.questions.filter((_: any, idx: number) => idx !== i)}))} className="text-pastel-red hover:bg-red-50 p-2 rounded"><Icons.Trash size={16}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ResultsDashboard = ({ examId, onClose }: any) => {
    const [subs, setSubs] = useState<any[]>([]);
    const [examData, setExamData] = useState<any>(null);
    const [view, setView] = useState("list"); // list or stats
    const [gradingSubId, setGradingSubId] = useState(null);

    useEffect(() => {
        db.ref(`exams/${examId}`).once('value').then(s => setExamData(s.val()));
        db.ref('submissions').orderByChild('examId').equalTo(examId).on('value', s => {
            setSubs(s.val() ? Object.entries(s.val()).map(([k,v]: [string, any]) => ({id:k, ...v})) : []);
        });
    }, [examId]);

    const activeSub = subs.find(s => s.id === gradingSubId);

    // Analytics Calculation
    const stats = useMemo(() => {
        if(!subs.length || !examData) return null;
        const scores = subs.map(s => {
            const str = calculateScore(s, examData);
            return str === "Manual" ? 0 : parseInt(str.split('/')[0]);
        });
        const max = scores.length ? Math.max(...scores) : 0;
        const min = scores.length ? Math.min(...scores) : 0;
        const avg = scores.length ? (scores.reduce((a,b)=>a+b,0)/scores.length).toFixed(1) : 0;
        
        // Distribution for bar chart
        const ranges = [0,0,0,0,0]; // 0-20, 21-40, 41-60, 61-80, 81-100%
        const maxPossible = examData.questions.reduce((a: any,b: any)=>a+(b.points||1),0);
        
        scores.forEach(s => {
            const pct = (s / maxPossible) * 100;
            if(pct <= 20) ranges[0]++;
            else if(pct <= 40) ranges[1]++;
            else if(pct <= 60) ranges[2]++;
            else if(pct <= 80) ranges[3]++;
            else ranges[4]++;
        });

        return { max, min, avg, ranges, maxPossible };
    }, [subs, examData]);

    return (
        <div className="fixed inset-0 z-50 bg-pastel-navy/30 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-paper rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border-4 border-white">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
                    <div className="flex gap-4 items-center">
                        <h2 className="text-xl font-bold text-pastel-navy">Results</h2>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button onClick={()=>setView('list')} className={`px-3 py-1 rounded text-sm font-bold ${view==='list'?'bg-white shadow-sm text-pastel-navy':'text-gray-400'}`}>List</button>
                            <button onClick={()=>setView('stats')} className={`px-3 py-1 rounded text-sm font-bold ${view==='stats'?'bg-white shadow-sm text-pastel-navy':'text-gray-400'}`}>Analytics</button>
                        </div>
                    </div>
                    <button onClick={onClose}><Icons.X/></button>
                </div>
                
                <div className="flex-1 overflow-auto p-6 bg-paper scroller">
                    {view === 'stats' && stats && (
                        <div className="animate-fade-in">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center"><p className="text-gray-400 text-xs font-bold uppercase">Average</p><p className="text-3xl font-bold text-pastel-blue">{stats.avg}</p></div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center"><p className="text-gray-400 text-xs font-bold uppercase">Highest</p><p className="text-3xl font-bold text-pastel-green">{stats.max}</p></div>
                                <div className="bg-white p-6 rounded-2xl border border-gray-100 text-center"><p className="text-gray-400 text-xs font-bold uppercase">Lowest</p><p className="text-3xl font-bold text-pastel-red">{stats.min}</p></div>
                            </div>
                            <div className="bg-white p-8 rounded-2xl border border-gray-100">
                                <h4 className="font-bold text-pastel-navy mb-6">Score Distribution</h4>
                                <div className="flex items-end h-40 gap-4">
                                    {stats.ranges.map((count, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                            <div className="w-full bg-pastel-blue rounded-t-lg transition-all group-hover:bg-pastel-navy" style={{height: `${(count/subs.length)*100}%`, minHeight: '4px'}}></div>
                                            <span className="text-xs text-gray-400 font-bold">{['0-20','21-40','41-60','61-80','81+'][i]}%</span>
                                            <span className="text-xs font-bold bg-gray-100 px-2 rounded-full">{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {view === 'list' && (
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-400 font-bold uppercase text-xs border-b border-gray-200"><tr><th className="p-4">Student</th><th className="p-4">Score</th><th className="p-4">Integrity</th><th className="p-4">Actions</th></tr></thead>
                            <tbody>
                                {subs.map(s => (
                                    <tr key={s.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                                        <td className="p-4 font-bold text-pastel-navy">{s.studentName}</td>
                                        <td className="p-4 font-bold text-pastel-blue">{calculateScore(s, examData)}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${s.cheatStats?.count>0?'bg-red-50 text-red-400':'bg-green-50 text-green-400'}`}>{s.cheatStats?.count} Flags</span></td>
                                        <td className="p-4"><button onClick={()=>setGradingSubId(s.id)} className="text-pastel-navy hover:bg-gray-100 p-2 rounded"><Icons.Edit size={16}/></button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            {activeSub && <GradingModal submission={activeSub} examData={examData} onClose={() => setGradingSubId(null)} />}
        </div>
    );
};

const StudentPortal = ({ onBack }: any) => {
    const [exams, setExams] = useState<any[]>([]);
    const [filteredExams, setFilteredExams] = useState<any[]>([]);
    const [activeExam, setActiveExam] = useState<any>(null);
    const [status, setStatus] = useState("loading");
    const [loginUser, setLoginUser] = useState<any>(null);
    const [profileData, setProfileData] = useState<any>(null);
    
    // Exam Taking State
    const [answers, setAnswers] = useState<any>({});
    const [flagged, setFlagged] = useState(new Set());
    const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
    const [fontSize, setFontSize] = useState(16);
    const [cheatCount, setCheatCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [showCalc, setShowCalc] = useState(false);
    
    const isSubmitting = useRef(false);

    useEffect(() => {
        const u = auth.currentUser;
        if (u) {
            setLoginUser(u);
            db.ref('students/' + u.uid).once('value').then(s => {
                const d = s.val();
                if(d && d.yearLevel) { setProfileData(d); setStatus('lobby'); }
                else setStatus('onboarding');
            });
        } else setStatus('login');
    }, []);

    useEffect(() => {
        db.ref('exams').orderByChild('status').equalTo('published').on('value', s => {
            if(s.val()) setExams(Object.entries(s.val()).map(([k,v]: [string, any]) => ({id:k, ...v})));
        });
    }, []);

    useEffect(() => {
        if(profileData) setFilteredExams(exams.filter(e => e.yearLevel === profileData.yearLevel && (profileData.myTeachers||[]).includes(e.teacherName)));
    }, [exams, profileData]);

    // Restore answers from local storage
    useEffect(() => {
        if(activeExam) {
            const saved = localStorage.getItem(`ans_${activeExam.id}_${loginUser.uid}`);
            if(saved) setAnswers(JSON.parse(saved));
            
            // Randomize once and save order or use existing
            setShuffledQuestions(activeExam.questions ? shuffleArray(activeExam.questions).map((q: any) => ({...q, options: q.type==='multiple_choice' ? shuffleArray(q.options) : q.options})) : []);
        }
    }, [activeExam]);

    // Auto-save
    useEffect(() => {
        if(activeExam && Object.keys(answers).length > 0) {
            localStorage.setItem(`ans_${activeExam.id}_${loginUser.uid}`, JSON.stringify(answers));
        }
    }, [answers, activeExam]);

    // Timer & Integrity
    useEffect(() => {
        if(status !== 'taking') return;
        const interval = setInterval(() => {
            if(timeLeft !== null) {
                setTimeLeft(t => {
                    if(t !== null && t <= 1) { clearInterval(interval); submit(true); return 0; }
                    return t !== null ? t - 1 : null;
                });
            }
        }, 1000);
        
        const handleBlur = () => { if(!isSubmitting.current) setCheatCount(c => c+1); };
        window.addEventListener("blur", handleBlur);
        document.addEventListener("visibilitychange", () => { if(document.hidden) handleBlur(); });

        return () => { clearInterval(interval); window.removeEventListener("blur", handleBlur); };
    }, [status, timeLeft]);

    const startExam = (exam: any) => {
        const now = new Date().getTime();
        const start = exam.startDate ? new Date(exam.startDate).getTime() : 0;
        const end = exam.endDate ? new Date(exam.endDate).getTime() : Infinity;

        if (now < start) return alert("Exam has not started yet.");
        if (now > end) return alert("Exam has closed.");

        setActiveExam(exam);
        if(exam.duration) setTimeLeft(exam.duration * 60);
        setStatus('taking');
    };

    const submit = (auto=false) => {
        if(!auto && !confirm("Submit Final Answers?")) return;
        isSubmitting.current = true;
        db.ref('submissions').push({
            uid: loginUser.uid, examId: activeExam.id, examTitle: activeExam.title, studentName: loginUser.displayName,
            answers, cheatStats: { count: cheatCount }, submittedAt: new Date().toISOString()
        }).then(() => {
            localStorage.removeItem(`ans_${activeExam.id}_${loginUser.uid}`);
            setStatus('submitted');
        });
    };

    const toggleFlag = (qid: string) => {
        const newSet = new Set(flagged);
        if(newSet.has(qid)) newSet.delete(qid); else newSet.add(qid);
        setFlagged(newSet);
    };

    if(status === 'login') return (
        <div className="min-h-screen flex items-center justify-center bg-paper">
            <button onClick={() => { const p = new firebase.auth.GoogleAuthProvider(); auth.signInWithPopup(p).then((r: any) => setLoginUser(r.user)); }} className="bg-white px-8 py-4 rounded-2xl shadow-xl font-bold text-pastel-navy border border-gray-100 hover:scale-105 transition-transform">Student Login</button>
        </div>
    );

    if(status === 'lobby') return (
        <div className="min-h-screen p-6 bg-paper relative overflow-hidden">
            <div className="max-w-md mx-auto relative z-10">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white">
                    <div className="flex justify-between items-center mb-8">
                        <div><h2 className="text-2xl font-bold text-pastel-navy">Exam Lobby</h2><p className="text-gray-400 text-sm">Welcome, {loginUser.displayName}</p></div>
                        <button onClick={onBack} className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-pastel-navy"><Icons.LogOut/></button>
                    </div>
                    <div className="space-y-4">
                        {filteredExams.map(ex => (
                            <button key={ex.id} onClick={() => startExam(ex)} className="w-full p-5 bg-white rounded-2xl border-2 border-pastel-blueLight hover:border-pastel-yellow hover:shadow-lg transition-all text-left group">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-pastel-navy group-hover:text-pastel-blue transition-colors">{ex.title}</h3>
                                        <p className="text-xs text-gray-400">{ex.subject}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-pastel-blueLight flex items-center justify-center text-pastel-blue group-hover:bg-pastel-yellow group-hover:text-pastel-navy"><Icons.Play size={14}/></div>
                                </div>
                            </button>
                        ))}
                        {filteredExams.length === 0 && <p className="text-center text-gray-400 py-10">No exams available for your level.</p>}
                    </div>
                </div>
            </div>
        </div>
    );

    if(status === 'taking') return (
        <div className="min-h-screen bg-paper select-none" onContextMenu={e => e.preventDefault()}>
            {showCalc && <Calculator onClose={()=>setShowCalc(false)} />}
            
            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-gray-100 px-6 py-3 flex justify-between items-center shadow-sm">
                <div><h1 className="font-bold text-pastel-navy">{activeExam.title}</h1><div className="text-xs text-gray-400 flex gap-2"><span>{Object.keys(answers).length} of {shuffledQuestions.length} Answered</span></div></div>
                <div className="flex gap-3">
                    <button onClick={()=>setFontSize(f => Math.max(12, f-2))} className="p-2 bg-gray-100 rounded-lg text-xs font-bold">A-</button>
                    <button onClick={()=>setFontSize(f => Math.min(24, f+2))} className="p-2 bg-gray-100 rounded-lg text-xs font-bold">A+</button>
                    <button onClick={()=>setShowCalc(!showCalc)} className="p-2 bg-pastel-yellowDim text-yellow-700 rounded-lg"><Icons.Calculator size={18}/></button>
                    {timeLeft !== null && <div className={`p-2 rounded-lg font-bold font-mono ${timeLeft < 300 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-blue-50 text-blue-500'}`}>{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</div>}
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6 pb-24">
                {shuffledQuestions.map((q: any, i: number) => (
                    <div key={q.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-6 relative">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-pastel-blue font-bold text-xl mr-4 select-none">{i+1}.</span>
                            <button onClick={()=>toggleFlag(q.id)} className={`text-gray-300 hover:text-pastel-red transition-colors ${flagged.has(q.id) ? 'text-pastel-red' : ''}`}><Icons.Flag/></button>
                        </div>
                        <p className="font-medium text-pastel-navy mb-6 leading-relaxed" style={{fontSize: `${fontSize}px`}}>{q.text}</p>
                        
                        {q.type === 'multiple_choice' && (
                            <div className="space-y-3">
                                {q.options.map((o: any) => (
                                    <label key={o} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${answers[q.id]===o ? 'border-pastel-yellow bg-pastel-yellowDim/30' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                                        <input type="radio" name={q.id} className="hidden" checked={answers[q.id]===o} onChange={()=>setAnswers({...answers, [q.id]:o})}/>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers[q.id]===o?'border-pastel-yellow bg-pastel-yellow':'border-gray-300'}`}>{answers[q.id]===o && <div className="w-2 h-2 bg-white rounded-full"></div>}</div>
                                        <span className="text-gray-700" style={{fontSize: `${fontSize}px`}}>{o}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {(q.type === 'essay' || q.type === 'identification') && <textarea className="w-full bg-gray-50 border-gray-100 p-4 rounded-xl" rows={4} placeholder="Type answer..." value={answers[q.id]||''} onChange={e=>setAnswers({...answers, [q.id]:e.target.value})} style={{fontSize: `${fontSize}px`}}></textarea>}
                        {q.type === 'true_false' && <div className="flex gap-4">{['True','False'].map(o=><label key={o} className={`flex-1 p-4 rounded-xl text-center cursor-pointer border-2 ${answers[q.id]===o?'border-pastel-yellow bg-pastel-yellowDim/30 font-bold':'border-transparent bg-gray-50'}`}><input type="radio" className="hidden" onChange={()=>setAnswers({...answers,[q.id]:o})}/>{o}</label>)}</div>}
                    </div>
                ))}
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100 flex justify-center">
                <button onClick={() => submit(false)} className="bg-pastel-navy text-white px-12 py-3 rounded-2xl font-bold shadow-lg hover:bg-slate-700 hover:scale-105 transition-all">Submit Exam</button>
            </div>
        </div>
    );
    
    return <div className="min-h-screen flex items-center justify-center bg-paper text-pastel-green font-bold text-2xl flex-col gap-4"><div className="p-6 bg-green-50 rounded-full"><Icons.Check size={48}/></div>Exams Submitted! <button onClick={()=>window.location.reload()} className="text-sm text-gray-400 underline mt-4">Return Home</button></div>;
};

// --- MAIN CONTROLLER ---
const App = () => {
    const [page, setPage] = useState('landing');
    const [user, setUser] = useState<any>(null);
    const [teacherName, setTeacherName] = useState("");

    const handleTeacherLogin = () => {
        const p = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(p).then((r: any) => {
            if(AUTHORIZED_TEACHERS.includes(r.user.email)) {
                setUser(r.user);
                db.ref('students/'+r.user.uid).once('value').then(s => {
                    const d = s.val();
                    if(d && d.displayName) { setTeacherName(d.displayName); setPage('teacher'); }
                    else { 
                        const name = prompt("Enter Display Name:");
                        if(name) { db.ref('students/'+r.user.uid).update({displayName:name}); setTeacherName(name); setPage('teacher'); }
                    }
                });
            } else alert("Unauthorized");
        });
    };

    if (page === 'landing') return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-paper relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pastel-yellow/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pastel-blue/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="text-center mb-12 relative z-10 animate-fade-in">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-pastel-yellow rounded-3xl text-pastel-navy mb-6 shadow-xl rotate-6"><Icons.Shield size={48}/></div>
                <h1 className="text-6xl font-extrabold text-pastel-navy mb-4 tracking-tight">Focus<span className="text-pastel-blue">Exam</span></h1>
                <p className="text-gray-400 text-lg">Secure. Simple. Pastel.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl relative z-10">
                <button onClick={handleTeacherLogin} className="group p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl hover:-translate-y-2 transition-all">
                    <div className="w-12 h-12 bg-pastel-blueLight rounded-2xl flex items-center justify-center text-pastel-blue mb-4 group-hover:bg-pastel-blue group-hover:text-white transition-colors"><Icons.Book/></div>
                    <h3 className="text-xl font-bold text-pastel-navy">Teacher</h3>
                </button>
                <button onClick={()=>setPage('student')} className="group p-8 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl hover:-translate-y-2 transition-all">
                    <div className="w-12 h-12 bg-pastel-yellowDim rounded-2xl flex items-center justify-center text-yellow-600 mb-4 group-hover:bg-pastel-yellow group-hover:text-white transition-colors"><Icons.Users/></div>
                    <h3 className="text-xl font-bold text-pastel-navy">Student</h3>
                </button>
            </div>
        </div>
    );

    if (page === 'teacher' && user) return <TeacherDashboard user={user} teacherName={teacherName} onLogout={() => { auth.signOut(); setPage('landing'); }} />;
    if (page === 'student') return <StudentPortal onBack={() => setPage('landing')} />;
    return <div/>;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);