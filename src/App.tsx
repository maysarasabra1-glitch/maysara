import React, { useState } from 'react';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ComplaintsView from './components/ComplaintsView';
import CouncilView from './components/CouncilView';
import AdvisorView from './components/AdvisorView';
import { INITIAL_COMPLAINTS, CAIRO_DISTRICTS } from './data';
import { Complaint, ChatMessage, District } from './types';
import { Landmark, X, Phone, Mail, MapPin, Calendar, Users, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Data State
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  
  // Selected District Detail Panel state
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  // Complaint filtering context (when navigating tabs)
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('all');

  // AI Chat State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `مرحباً بك في منصة **محليات وطن** لمحافظة القاهرة. 🏛️\n\nأنا **مستشارك المحلي الذكي**. يمكنني مساعدتك في:\n\n1. **صياغة شكاوى وبلاغات رسمية قانونية ومكتوبة باحترافية** لإرسالها للحي أو رفعها للمحافظ.\n2. **شرح وتوضيح قوانين المجالس المحلية المصرية** (مثل القانون 43 لسنة 1979).\n3. **توضيح صلاحيات رئيس الحي والمجلس الشعبي المحلي** وكيفية تفعيل دور الرقابة المدنية.\n\nكيف يمكنني مساعدتك اليوم؟`,
      timestamp: 'الآن'
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // AI draft integration states
  const [draftParams, setDraftParams] = useState<{ districtName: string; title: string; description: string } | null>(null);

  // Add new complaint
  const handleAddComplaint = (newComp: Omit<Complaint, 'id' | 'date' | 'votes' | 'userVoted' | 'status'>) => {
    const complaintToAdd: Complaint = {
      ...newComp,
      id: `c-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'under_review',
      votes: 1,
      userVoted: true
    };
    setComplaints([complaintToAdd, ...complaints]);
  };

  // Upvote complaint
  const handleVoteComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        const userVoted = !c.userVoted;
        return {
          ...c,
          votes: userVoted ? c.votes + 1 : c.votes - 1,
          userVoted
        };
      }
      return c;
    }));
  };

  // Send general question to server-side AI endpoint
  const handleSendMessage = async (text: string) => {
    // Append user message immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text })
      });

      const data = await response.json();
      if (response.ok) {
        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || 'فشلت معالجة الاستشارة');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ عذراً، حدث خطأ أثناء محاولة الاتصال بالمستشار الذكي. تفاصيل الخطأ: ${err.message || 'مشكلة في الخادم'}. يرجى التحقق من مفتاح الـ API والاتصال بالشبكة.`,
        timestamp: 'الآن'
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Request legal draft document based on complaint details
  const handleSendDraftRequest = async (districtName: string, title: string, description: string) => {
    const userMsg: ChatMessage = {
      id: `user-draft-${Date.now()}`,
      role: 'user',
      text: `أرجو صياغة شكوى رسمية بشأن: "${title}" في حي ${districtName}.`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isDraftRequest: true,
          districtName,
          issueTitle: title,
          issueDescription: description
        })
      });

      const data = await response.json();
      if (response.ok) {
        const modelMsg: ChatMessage = {
          id: `model-draft-${Date.now()}`,
          role: 'model',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        };
        setChatHistory(prev => [...prev, modelMsg]);
      } else {
        throw new Error(data.error || 'فشلت معالجة صياغة المستند');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: `⚠️ عذراً، لم تنجح الصياغة الآلية. يرجى التأكد من ضبط مفتاح GEMINI_API_KEY بنجاح من إعدادات الخادم.\n\nتفاصيل الخطأ الفني: ${err.message}`,
        timestamp: 'الآن'
      };
      setChatHistory(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  // AI draft redirect trigger (called from complaints list)
  const handleDraftComplaintWithAI = (districtName: string, title: string, description: string) => {
    setDraftParams({ districtName, title, description });
    setActiveTab('advisor');
  };

  const handleSelectDistrict = (districtId: string) => {
    const district = CAIRO_DISTRICTS.find(d => d.id === districtId);
    if (district) {
      setSelectedDistrict(district);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="app-root">
      
      {/* Header component */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView 
            onSelectDistrict={handleSelectDistrict} 
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'complaints' && (
          <ComplaintsView 
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onVoteComplaint={handleVoteComplaint}
            onDraftComplaintWithAI={handleDraftComplaintWithAI}
            selectedDistrictId={selectedDistrictId}
            setSelectedDistrictId={setSelectedDistrictId}
          />
        )}

        {activeTab === 'council' && (
          <CouncilView />
        )}

        {activeTab === 'advisor' && (
          <AdvisorView 
            chatHistory={chatHistory}
            onSendMessage={handleSendMessage}
            onSendDraftRequest={handleSendDraftRequest}
            isGenerating={isGenerating}
            draftParams={draftParams}
            setDraftParams={setDraftParams}
          />
        )}

      </main>

      {/* Footer Branding */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex justify-center items-center gap-2">
            <span className="font-bold text-amber-400">مَحليات وَطَن © 2026</span>
            <span className="text-slate-600">|</span>
            <span>بوابة الشؤون البلدية والمجالس الشعبية بمحافظة القاهرة</span>
          </div>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            منصة وطنية مستقلة تهدف لرفع الوعي بالقوانين المحلية وتسهيل التواصل بين النواب المنتخبين والمواطنين والجهات التنفيذية لتحقيق رؤية مصر للتنمية المستدامة واللامركزية الإدارية.
          </p>
        </div>
      </footer>

      {/* District Profile Detail Modal (Sidebar Slide-over style) */}
      {selectedDistrict && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex justify-end animate-fade-in" id="district-modal">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col animate-slide-left overflow-y-auto">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 text-white p-6 relative">
              <button 
                onClick={() => setSelectedDistrict(null)}
                className="absolute top-6 left-6 text-emerald-100 hover:text-white p-1 rounded-lg bg-emerald-800/40"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 tracking-wider">الملف التعريفي والبلدي الكامل</span>
                <h3 className="text-xl font-black">حي {selectedDistrict.nameAr}</h3>
                <span className="text-xs text-emerald-200 block font-mono">{selectedDistrict.nameEn} District</span>
              </div>
            </div>

            {/* Modal Body Contents */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">رئيس مجلس الحي المعين</span>
                  <span className="text-xs font-bold text-slate-700">{selectedDistrict.presidentName}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">عدد المقاعد المحلية المنتخبة</span>
                  <span className="text-xs font-bold text-slate-700">{selectedDistrict.seatsCount} مقعداً شعبياً</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">إجمالي التعداد السكاني التقديري</span>
                  <span className="text-xs font-bold text-slate-700">{selectedDistrict.population}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[11px] text-slate-400 block font-semibold">تاريخ انعقاد الجلسة المقبلة</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {selectedDistrict.upcomingMeetingDate}
                  </span>
                </div>
              </div>

              {/* Statistics & Issues Bar */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">مؤشرات الأداء وشكاوى المواطنين بالحي</h4>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>نسبة الاستجابة وحل الشكاوى</span>
                    <span className="font-bold text-emerald-600">
                      {Math.round((selectedDistrict.resolvedIssuesCount / (selectedDistrict.resolvedIssuesCount + selectedDistrict.activeIssuesCount)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${(selectedDistrict.resolvedIssuesCount / (selectedDistrict.resolvedIssuesCount + selectedDistrict.activeIssuesCount)) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>شكاوى محلولة ومغلقة: {selectedDistrict.resolvedIssuesCount}</span>
                    <span>شكاوى نشطة تحت المعالجة: {selectedDistrict.activeIssuesCount}</span>
                  </div>
                </div>
              </div>

              {/* Council Contact Details */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Landmark className="h-4 w-4" />
                  بيانات التواصل مع سكرتارية مجلس الحي
                </h4>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-600" />
                    <span>الخط الساخن لخدمات حي {selectedDistrict.nameAr}: <strong>15499</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-600" />
                    <span>البريد الإلكتروني للشكاوى: <strong className="font-mono">cairo.gov.eg</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span>مقر رئاسة الحي والمركز التكنولوجي الموحد</span>
                  </div>
                </div>
              </div>

              {/* Active list filters link */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSelectedDistrictId(selectedDistrict.id);
                    setActiveTab('complaints');
                    setSelectedDistrict(null);
                  }}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-xl text-xs text-center block transition"
                >
                  استعراض جميع شكاوى ومطالب حي {selectedDistrict.nameAr}
                </button>
                <button
                  onClick={() => {
                    setDraftParams({
                      districtName: selectedDistrict.nameAr,
                      title: 'مطلب مستعجل بخصوص رفع كفاءة مرافق الحي',
                      description: 'توجد حاجة عاجلة لإعادة صيانة المرافق الفرعية والخدمات وتثبيت بلوعات لتصريف مياه الأمطار في الطرق الرئيسية لضمان سلامة قاطني الحي.'
                    });
                    setActiveTab('advisor');
                    setSelectedDistrict(null);
                  }}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs text-center block transition flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  <span>توليد طلب إحاطة رسمي لهذا الحي</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
