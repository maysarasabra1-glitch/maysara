import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { CAIRO_DISTRICTS } from '../data';
import { Cpu, Send, Sparkles, HelpCircle, FileText, ArrowRight, BookOpen, PenTool, CheckCircle, Copy } from 'lucide-react';

interface AdvisorViewProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onSendDraftRequest: (districtName: string, title: string, description: string) => Promise<void>;
  isGenerating: boolean;
  draftParams: { districtName: string; title: string; description: string } | null;
  setDraftParams: (params: { districtName: string; title: string; description: string } | null) => void;
}

export default function AdvisorView({
  chatHistory,
  onSendMessage,
  onSendDraftRequest,
  isGenerating,
  draftParams,
  setDraftParams
}: AdvisorViewProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Form states for manual drafting
  const [manualDraft, setManualDraft] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftDistrict, setDraftDistrict] = useState(CAIRO_DISTRICTS[0].nameAr);

  // Copy helper
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isGenerating]);

  // Hook into auto draft parameters passed from the complaints tab
  useEffect(() => {
    if (draftParams) {
      setDraftDistrict(draftParams.districtName);
      setDraftTitle(draftParams.title);
      setDraftDesc(draftParams.description);
      setManualDraft(true);
    }
  }, [draftParams]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGenerating) return;
    const query = inputText;
    setInputText('');
    await onSendMessage(query);
  };

  const handleTriggerDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftTitle || !draftDesc || isGenerating) return;
    await onSendDraftRequest(draftDistrict, draftTitle, draftDesc);
    // Reset manual draft form view after calling
    setManualDraft(false);
    setDraftParams(null); // Clear the passed state
  };

  const copyToClipboard = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to parse simple bold markdown patterns to HTML safely
  const formatMarkdown = (text: string) => {
    // Escape HTML to prevent XSS but allow simple bold parsing
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Convert headers
    escaped = escaped.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-emerald-800 mt-3 mb-1">$1</h3>');
    escaped = escaped.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-emerald-900 mt-4 mb-2 border-r-2 border-emerald-600 pr-2">$1</h2>');
    escaped = escaped.replace(/^# (.*$)/gim, '<h1 class="text-lg font-black text-emerald-950 mt-5 mb-2">$1</h1>');
    
    // Convert bold text **word**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-800">$1</strong>');
    
    // Convert list items
    escaped = escaped.replace(/^\* (.*$)/gim, '<li class="mr-4 list-disc text-xs text-slate-600 mb-1">$1</li>');
    escaped = escaped.replace(/^- (.*$)/gim, '<li class="mr-4 list-disc text-xs text-slate-600 mb-1">$1</li>');
    
    // Restore carriage returns as line breaks
    return escaped.split('\n').map((line, idx) => {
      if (line.trim().startsWith('<li') || line.trim().startsWith('<h')) {
        return line;
      }
      return line.trim() ? `<p class="text-xs text-slate-600 leading-relaxed mb-2">${line}</p>` : '<div class="h-2"></div>';
    }).join('');
  };

  const sampleQuestions = [
    { text: 'ما هي خطوات تقديم شكوى هدم وبناء مخالفة لحى شرق مدينة نصر؟', category: 'complaint' },
    { text: 'هل يحق للمواطن حضور جلسات المجلس الشعبي المحلى لحى المعادى؟', category: 'law' },
    { text: 'ما هي اختصاصات لجنة الموازنة والتخطيط بالمجلس المحلى بموجب القانون رقم 43؟', category: 'legal' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in" id="advisor-view-root">
      
      {/* Sidebar Control Panel */}
      <div className="lg:col-span-1 space-y-4">
        
        <div className="bg-gradient-to-b from-emerald-900 to-emerald-950 rounded-2xl p-5 text-white border border-emerald-800 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="h-5 w-5 text-amber-400 animate-pulse" />
            <h4 className="text-sm font-bold text-amber-300">مستشار محليات وطن الذكي</h4>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            محرك ذكاء اصطناعي متطور مدعوم بنظام <strong className="text-white font-semibold">Gemini 3.5</strong>، تمت تغذيته بقانون الإدارة المحلية المصري ولائحة المجالس التنفيذية لمحافظة القاهرة.
          </p>
        </div>

        {/* Templates Selection */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-3">
          <h5 className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">أدوات الصياغة السريعة</h5>
          
          <button
            onClick={() => setManualDraft(true)}
            className={`w-full text-right p-3 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              manualDraft 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                : 'border-slate-100 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-2">
              <PenTool className="h-4 w-4 text-emerald-600" />
              <span>توليد صيغة شكوى رسمية للحي</span>
            </div>
            <ArrowRight className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              setManualDraft(false);
              onSendMessage('قم بصياغة نموذج "طلب إحاطة رسمي" يمكن لعضو المجلس المحلي تقديمه لرئيس الحي بشأن تدهور حالة رصف وتعبيد الطرق والمحاور الرئيسية بالحي.');
            }}
            className="w-full text-right p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-between text-slate-600"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600" />
              <span>نموذج طلب إحاطة لعضو مجلس</span>
            </div>
            <ArrowRight className="h-3 w-3" />
          </button>

          <button
            onClick={() => {
              setManualDraft(false);
              onSendMessage('اشرح لي بالتفصيل وببساطة ما هي المواد القانونية في قانون الإدارة المحلية المصري التي تحكم الرقابة الشعبية وحق المواطن في توجيه التوصيات.');
            }}
            className="w-full text-right p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold transition flex items-center justify-between text-slate-600"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              <span>دليل الرقابة الشعبية والقانون</span>
            </div>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* Quick FAQ / Presets */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-2">
          <h5 className="text-xs font-bold text-slate-700 pb-2 border-b border-slate-100">أسئلة استرشادية شائعة</h5>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => {
                setManualDraft(false);
                setInputText(q.text);
              }}
              className="w-full text-right p-2.5 rounded-lg hover:bg-slate-50 text-[11px] text-slate-500 leading-relaxed border border-transparent hover:border-slate-100 block transition"
            >
              • {q.text}
            </button>
          ))}
        </div>

      </div>

      {/* Main Chat Workspace */}
      <div className="lg:col-span-3 flex flex-col h-[650px] bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden" id="chat-workspace">
        
        {/* Chat Header */}
        <div className="bg-slate-50 border-b border-slate-100 py-3.5 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-100 text-emerald-800 p-1.5 rounded-lg">
              <Cpu className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">المستشار القانوني والبلدي الذكي</h4>
              <p className="text-[10px] text-emerald-700 font-medium">مستعد لصياغة مستنداتك القانونية والرد الفوري على تساؤلاتك</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
            <span className="text-[10px] font-bold text-slate-400">نشط ومتصل</span>
          </div>
        </div>

        {/* Chat Display / Manual Draft Form */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6" id="chat-scroller">
          
          {manualDraft ? (
            /* Special drafting interface */
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 max-w-2xl mx-auto space-y-4 animate-fade-in" id="draft-form-container">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  إدخال بيانات صياغة الشكوى الرسمية بالذكاء الاصطناعي
                </h4>
                <button 
                  onClick={() => {
                    setManualDraft(false);
                    setDraftParams(null);
                  }}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  العودة للدردشة الحرة
                </button>
              </div>

              <form onSubmit={handleTriggerDraft} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الحي المعني بالشأن:</label>
                    <select
                      value={draftDistrict}
                      onChange={(e) => setDraftDistrict(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    >
                      {CAIRO_DISTRICTS.map(d => (
                        <option key={d.id} value={d.nameAr}>حي {d.nameAr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">عنوان المشكلة العام:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: تراكم مخلفات الحفر وتكسير الأسفلت"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)} // Keep in sync if needed
                      onInput={(e: React.FormEvent<HTMLInputElement>) => setDraftTitle(e.currentTarget.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">وصف تفصيلي للأضرار والمكان:</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="صف القضية ومكان المشكلة وأهم الأضرار بوضوح... ليتم صياغة المستند بالمواد القانونية الداعمة."
                    value={draftDesc}
                    onInput={(e: React.FormEvent<HTMLTextAreaElement>) => setDraftDesc(e.currentTarget.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 text-slate-700"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setManualDraft(false);
                      setDraftParams(null);
                    }}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Cpu className="h-3.5 w-3.5" />
                    <span>توليد الصياغة الرسمية الفورية</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Traditional Chat Thread */
            <div className="space-y-6">
              {chatHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-3xl ${
                    msg.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto'
                  }`}
                  id={`chat-msg-${msg.id}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm font-bold text-xs ${
                    msg.role === 'user' 
                      ? 'bg-amber-500 text-slate-900' 
                      : 'bg-emerald-700 text-white'
                  }`}>
                    {msg.role === 'user' ? 'أنا' : 'عن'}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl p-4 relative group ${
                    msg.role === 'user'
                      ? 'bg-amber-500/10 border border-amber-500/15 text-slate-800 rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/50 text-slate-700 rounded-tl-none'
                  }`}>
                    <div className="text-[9px] text-slate-400 mb-1 block">
                      {msg.timestamp}
                    </div>

                    {msg.role === 'user' ? (
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      /* Model Response formatted elegantly */
                      <div className="space-y-2">
                        <div 
                          className="markdown-body text-xs" 
                          dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.text) }} 
                        />
                        
                        {/* Copy / Document Utilities for official models */}
                        <div className="pt-2 border-t border-slate-200/40 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(msg.text, msg.id)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-bold flex items-center gap-1 bg-white border border-slate-200/60 px-2 py-1 rounded"
                            title="نسخ النص الكامل للمطالبة"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <CheckCircle className="h-3 w-3 text-emerald-600" />
                                <span className="text-emerald-600">تم النسخ!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>نسخ المطلب</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isGenerating && (
                <div className="flex gap-3 max-w-lg ml-auto" id="loading-indicator">
                  <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 animate-pulse">
                    عن
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none p-4 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]"></span>
                    <span>المستشار الذكي يدرس طلبك ويصيغ الرد قانونياً...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          )}

        </div>

        {/* Input Bar (Hidden when drafting) */}
        {!manualDraft && (
          <form onSubmit={handleSend} className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2">
            <input
              type="text"
              disabled={isGenerating}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استشارتك القانونية أو البلدية هنا (مثال: ما هو دور لجنة الشباب بالحي؟)..."
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
              id="advisor-input"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 rounded-xl transition duration-300 flex items-center justify-center disabled:opacity-50"
              id="btn-send-message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

      </div>

    </div>
  );
}
