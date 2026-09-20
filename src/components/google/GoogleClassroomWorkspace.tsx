import React, { useState, useEffect, useCallback } from 'react';
import {
  GraduationCap, BookOpen, Users, Plus, Trash2, CheckCircle2,
  Clock, FileText, Send, Sparkles, RefreshCw, MessageSquare
} from 'lucide-react';
import { GoogleAuthBar } from './GoogleAuthBar';
import { callGoogleApi } from '../../lib/googleApi';
import { getGoogleWorkspaceToken } from '../../firebase';

interface Course {
  id: string;
  name: string;
  section: string;
  instructor: string;
  enrolledCount: number;
  color: string;
  announcements: { id: string; author: string; text: string; time: string; comments: { author: string; text: string }[] }[];
  assignments: { id: string; title: string; dueDate: string; points: number; submitted: boolean }[];
}

export const GoogleClassroomWorkspace: React.FC = () => {
  const [token, setToken] = useState<string | null>(getGoogleWorkspaceToken());
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c-1',
      name: 'Financial Engineering 401: Multi-Rail Banking & ZKP',
      section: 'Spring Cohort A',
      instructor: 'Dr. Marcus Vance (Citigroup Fellow)',
      enrolledCount: 42,
      color: 'from-blue-600 to-indigo-700',
      announcements: [
        {
          id: 'an-1',
          author: 'Dr. Marcus Vance',
          text: 'Welcome everyone! Today we will analyze the Fedwire priority disbursement IMAD flow and RSA-OAEP-256 JWE encryption standards.',
          time: 'Yesterday',
          comments: [
            { author: 'Sarah Lin', text: 'Will we have sample JWE payloads to test in our development sandbox?' },
            { author: 'Dr. Marcus Vance', text: 'Yes, check Assignment 1 for sandbox API keys.' }
          ]
        }
      ],
      assignments: [
        { id: 'as-1', title: 'Lab 1: Verify Citigroup 5-Part JWE Decryption with AES-GCM', dueDate: 'Sep 18', points: 100, submitted: true },
        { id: 'as-2', title: 'Lab 2: Implement ISO 20022 pacs.008 XML Parser & UETR Generator', dueDate: 'Sep 25', points: 150, submitted: false },
        { id: 'as-3', title: 'Term Project: Autonomous Underwriting Engine with Groth16 zk-SNARKs', dueDate: 'Oct 15', points: 300, submitted: false }
      ]
    },
    {
      id: 'c-2',
      name: 'Quantitative Risk & Continuous Merton Default Models',
      section: 'Graduate Research',
      instructor: 'Prof. Elena Rostova',
      enrolledCount: 28,
      color: 'from-emerald-600 to-teal-700',
      announcements: [
        {
          id: 'an-2',
          author: 'Prof. Elena Rostova',
          text: 'Lecture notes on Black-Scholes volatility surfaces and distance-to-default thresholds have been uploaded.',
          time: '3 days ago',
          comments: []
        }
      ],
      assignments: [
        { id: 'as-4', title: 'Problem Set 1: Calculate Probability of Default for Leveraged SPV', dueDate: 'Sep 20', points: 50, submitted: false },
        { id: 'as-5', title: 'Problem Set 2: Delta-Gamma Continuous Dynamic Hedging', dueDate: 'Oct 02', points: 75, submitted: false }
      ]
    }
  ]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('c-1');
  const [activeSubTab, setActiveSubTab] = useState<'stream' | 'classwork' | 'people'>('stream');
  const [newAnnouncementText, setNewAnnouncementText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Fetch live courses from Google Classroom API
  const fetchLiveClassroomCourses = useCallback(async () => {
    if (!token) return;
    setIsSyncing(true);
    try {
      const res = await callGoogleApi<{ courses?: any[] }>(
        'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE'
      );

      if (res.courses && res.courses.length > 0) {
        const liveCourses: Course[] = res.courses.map((c: any) => ({
          id: c.id,
          name: c.name || 'Google Classroom Course',
          section: c.section || 'General',
          instructor: 'Google Classroom Instructor',
          enrolledCount: 1,
          color: 'from-purple-600 to-indigo-700',
          announcements: [],
          assignments: []
        }));

        setCourses((prev) => {
          const ids = new Set(liveCourses.map((l) => l.id));
          return [...liveCourses, ...prev.filter((l) => !ids.has(l.id))];
        });
        setStatusMsg(`Synchronized ${res.courses.length} live Google Classroom courses!`);
      }
    } catch (err: any) {
      console.warn('Google Classroom fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchLiveClassroomCourses();
    }
  }, [token, fetchLiveClassroomCourses]);

  const handlePostAnnouncement = () => {
    if (!newAnnouncementText.trim()) return;
    const newAn = {
      id: `an-${Date.now()}`,
      author: 'You (Lead Architect)',
      text: newAnnouncementText,
      time: 'Just now',
      comments: []
    };

    setCourses(
      courses.map((c) => {
        if (c.id !== selectedCourseId) return c;
        return { ...c, announcements: [newAn, ...c.announcements] };
      })
    );
    setNewAnnouncementText('');
  };

  const handlePostComment = (announcementId: string) => {
    if (!newCommentText.trim()) return;
    setCourses(
      courses.map((c) => {
        if (c.id !== selectedCourseId) return c;
        return {
          ...c,
          announcements: c.announcements.map((an) => {
            if (an.id !== announcementId) return an;
            return {
              ...an,
              comments: [...an.comments, { author: 'You', text: newCommentText }]
            };
          })
        };
      })
    );
    setNewCommentText('');
  };

  const toggleAssignmentSubmitted = (assignmentId: string) => {
    setCourses(
      courses.map((c) => {
        if (c.id !== selectedCourseId) return c;
        return {
          ...c,
          assignments: c.assignments.map((as) => (as.id === assignmentId ? { ...as, submitted: !as.submitted } : as))
        };
      })
    );
  };

  return (
    <div id="google-classroom-workspace" className="space-y-4">
      {/* Google Auth Bar */}
      <GoogleAuthBar
        appName="Google Classroom"
        scopeDescription="Connect your Google Account to synchronize courses, assignments, and educational curricula."
        onTokenChange={(t) => setToken(t)}
      />

      {statusMsg && (
        <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {statusMsg}
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-[#8B949E] hover:text-white">✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Google Classroom Education Hub</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                CLASSROOM V1 API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Academic curricula, quantitative assignments, and real-time classroom lecture streams
            </p>
          </div>
        </div>

        {token && (
          <button
            onClick={fetchLiveClassroomCourses}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Courses
          </button>
        )}
      </div>

      {/* Course Select Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCourseId(c.id)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer bg-gradient-to-br ${c.color} ${
              selectedCourseId === c.id ? 'ring-2 ring-white shadow-xl scale-[1.01]' : 'opacity-70 hover:opacity-100 border-transparent'
            }`}
          >
            <h3 className="font-bold text-base text-white">{c.name}</h3>
            <p className="text-xs text-white/80 mt-1">{c.section} • {c.instructor}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20 text-xs text-white/90">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> {c.enrolledCount} Enrolled
              </span>
              <span>{c.assignments.length} Assignments</span>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail View */}
      <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 pb-3 gap-3">
          {(['stream', 'classwork', 'people'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                activeSubTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* SUBTAB: STREAM */}
        {activeSubTab === 'stream' && (
          <div className="space-y-4">
            {/* Post Announcement */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <input
                type="text"
                placeholder="Announce something to your class..."
                value={newAnnouncementText}
                onChange={(e) => setNewAnnouncementText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePostAnnouncement()}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handlePostAnnouncement}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Post Announcement
                </button>
              </div>
            </div>

            {/* Announcement Stream */}
            <div className="space-y-3">
              {selectedCourse.announcements.map((an) => (
                <div key={an.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{an.author}</span>
                    <span className="text-slate-500">{an.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{an.text}</p>

                  {/* Comments */}
                  {an.comments.length > 0 && (
                    <div className="pl-4 space-y-2 pt-2 border-t border-slate-800/80">
                      {an.comments.map((cm, idx) => (
                        <div key={idx} className="text-[11px] text-slate-400">
                          <span className="font-bold text-slate-300">{cm.author}: </span>
                          <span>{cm.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add class comment..."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment(an.id)}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handlePostComment(an.id)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold rounded-lg cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: CLASSWORK */}
        {activeSubTab === 'classwork' && (
          <div className="space-y-3">
            {selectedCourse.assignments.map((as) => (
              <div
                key={as.id}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{as.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Due {as.dueDate} • {as.points} points
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleAssignmentSubmitted(as.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    as.submitted
                      ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {as.submitted ? 'Turned In ✓' : 'Submit Assignment'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SUBTAB: PEOPLE */}
        {activeSubTab === 'people' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Instructors</h4>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs text-white font-semibold">
                {selectedCourse.instructor}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Classmates ({selectedCourse.enrolledCount})</h4>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                <p>• Sarah Lin (Quantitative Research Lead)</p>
                <p>• David Sterling (Treasury Operations)</p>
                <p>• Alexey Petrov (ZKP Cryptographer)</p>
                <p>• Maya Johnson (Smart Contract Auditor)</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
