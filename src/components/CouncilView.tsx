import React, { useState } from 'react';
import { CouncilDecision, CouncilMeeting } from '../types';
import { COUNCIL_DECISIONS, UPCOMING_MEETINGS } from '../data';
import { 
  Calendar, FileText, Landmark, Users, ClipboardList, BookOpen, 
  ChevronDown, ChevronUp, Scale, Bookmark, BadgeAlert, Coins, HelpCircle 
} from 'lucide-react';

interface CouncilViewProps {
  decisions?: CouncilDecision[];
  meetings?: CouncilMeeting[];
}

export default function CouncilView({ 
  decisions = COUNCIL_DECISIONS, 
  meetings = UPCOMING_MEETINGS 
}: CouncilViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'decisions' | 'meetings' | 'law'>('meetings');
  const [expandedDecisionId, setExpandedDecisionId] = useState<string | null>(null);

  const getCategoryBadgeColor = (category: CouncilDecision['category']) => {
    switch (category) {
      case 'budget':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'planning':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'services':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'social':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const getCategoryLabel = (category: CouncilDecision['category']) => {
    switch (category) {
      case 'budget': return 'موازنة وخطة مالية';
      case 'planning': return 'تخطيط وتنسيق حضاري';
      case 'services': return 'مرافق وخدمات بلدية';
      case 'social': return 'تنمية اجتماعية وثقافية';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="council-view-root">
      
      {/* Sub Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-wrap gap-1 md:gap-2">
        <button
          onClick={() => setActiveSubTab('meetings')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
            activeSubTab === 'meetings'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-subtab-meetings"
        >
          <Calendar className="h-4 w-4" />
          <span>الجلسات والاجتماعات القادمة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('decisions')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
            activeSubTab === 'decisions'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-subtab-decisions"
        >
          <FileText className="h-4 w-4" />
          <span>القرارات والسياسات المصادق عليها</span>
        </button>

        <button
          onClick={() => setActiveSubTab('law')}
          className={`flex-1 min-w-[120px] py-3 rounded-xl text-xs font-bold transition duration-200 flex items-center justify-center gap-2 ${
            activeSubTab === 'law'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
          id="btn-subtab-law"
        >
          <BookOpen className="h-4 w-4" />
          <span>الدليل والقانون المحلي المصري</span>
        </button>
      </div>

      {/* SUBTAB CONTENT 1: Meetings */}
      {activeSubTab === 'meetings' && (
        <div className="space-y-6" id="meetings-list-container">
          <div className="bg-emerald-50 text-emerald-900 rounded-xl p-4 border border-emerald-100 text-xs leading-relaxed">
            <strong>نظام علنية الجلسات:</strong> تعقد جلسات المجالس المحلية الشعبية واللجان الفرعية بمحافظة القاهرة بشكل علني، ويحق لأي مواطن مقيم في نطاق الحي حضور الجلسات العامة كصوت مراقب أو تسجيل كلمته لعرضها على اللجان المختصة بالتنسيق المسبق مع سكرتارية المجلس بالحي.
          </div>

          <div className="grid grid-cols-1 gap-6">
            {meetings.map((meeting) => (
              <div 
                key={meeting.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4 hover:shadow-md transition duration-300"
                id={`meeting-${meeting.id}`}
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
                      حي {meeting.districtName}
                    </span>
                    <h4 className="text-base font-bold text-slate-800 pt-2">{meeting.title}</h4>
                  </div>

                  <div className="flex flex-col text-left gap-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 justify-end">
                      <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                      تاريخ الجلسة: <strong className="text-slate-800 font-mono">{meeting.date}</strong>
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1.5 justify-end">
                      <Users className="h-3.5 w-3.5 text-emerald-600" />
                      المقاعد المسجلة: <strong className="text-emerald-700">{meeting.attendeesCount} ممثلاً شعبياً</strong>
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <ClipboardList className="h-4 w-4 text-emerald-600" />
                    جدول أعمال الجلسة المقترح:
                  </h5>
                  <ul className="list-decimal list-inside text-xs text-slate-600 space-y-2 pr-2">
                    {meeting.agenda.map((item, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-slate-500 leading-relaxed pt-2">
                  <span className="font-semibold text-slate-700">ملاحظات الحضور والمشاركة: </span>
                  {meeting.summary}
                </div>

                <div className="pt-2 flex justify-end">
                  <button 
                    onClick={() => alert(`تم حجز مقعد مراقبة افتراضي للجلسة المنعقدة بتاريخ ${meeting.date}. سنقوم بإرسال إشعار تذكير مسبقاً.`)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition duration-200"
                  >
                    طلب حضور بصفة مراقب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB CONTENT 2: Decisions */}
      {activeSubTab === 'decisions' && (
        <div className="space-y-4" id="decisions-list-container">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-base font-bold text-slate-800 pb-2">قرارات وتوصيات المجلس المحلي الشعبي بمحافظة القاهرة</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              تصفح القرارات المعتمدة للجان الشؤون القانونية والموازنة والمرافق لدورة الانعقاد الجارية. إن الشفافية هي عصب "محليات وطن".
            </p>
          </div>

          <div className="space-y-4">
            {decisions.map((decision) => {
              const isExpanded = expandedDecisionId === decision.id;
              return (
                <div 
                  key={decision.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3 hover:border-emerald-500/20 transition"
                  id={`decision-${decision.id}`}
                >
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeColor(decision.category)}`}>
                          {getCategoryLabel(decision.category)}
                        </span>
                        <span className="text-[11px] text-slate-400">بتاريخ: {decision.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-800 pt-1">{decision.title}</h4>
                      <p className="text-xs text-slate-500">مطبق في نطاق: <strong>حي {decision.districtName}</strong></p>
                    </div>

                    <button
                      onClick={() => setExpandedDecisionId(isExpanded ? null : decision.id)}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 px-3 py-1.5 bg-slate-50 rounded-xl"
                    >
                      {isExpanded ? (
                        <>
                          <span>إغلاق التفاصيل</span>
                          <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>عرض الحيثيات والتفاصيل</span>
                          <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl">
                    <strong>الخلاصة المعتمدة:</strong> {decision.summary}
                  </p>

                  {isExpanded && (
                    <div className="border-t border-slate-100 pt-3 space-y-2 animate-slide-down">
                      <h5 className="text-xs font-bold text-emerald-800">حيثيات القرار والأطر التنفيذية:</h5>
                      <p className="text-xs text-slate-600 leading-relaxed pl-4 border-r-2 border-emerald-500 pr-2">
                        {decision.details}
                      </p>
                      <div className="text-[10px] text-slate-400 mt-2">
                        * تم إقرار هذه المادة بالتنسيق مع لجنة الشؤون الدستورية والقانونية بمحافظة القاهرة لمطابقة اشتراطات هيئة الأبنية والتنسيق البلدي في العاصمة.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB CONTENT 3: Law Directory */}
      {activeSubTab === 'law' && (
        <div className="space-y-6" id="egyptian-law-directory">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
                <Scale className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">الدليل القانوني لقانون الإدارة المحلية المصري رقم 43 لسنة 1979</h3>
                <p className="text-xs text-slate-500">اعرف حقوقك كمواطن وكيفية تأثير المجالس المحلية على حياتك اليومية.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-emerald-600" />
                  أدوات الرقابة الشعبية للأعضاء المنتخبين
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يمنح القانون نواب المجلس المحلي المنتخبين أدوات قوية لرقابة أداء رؤساء الأحياء والأجهزة التنفيذية:
                </p>
                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1.5 pr-1">
                  <li><strong>طلب الإحاطة:</strong> لفت نظر المسؤول لتطوير أو إشغال أو خلل عاجل بالحي.</li>
                  <li><strong>السؤال البرلماني المحلي:</strong> طلب كتابي لتوضيح خطط موازنة أو مشروع رصف.</li>
                  <li><strong>الاستجواب:</strong> وسيلة لمحاسبة رئيس الحي أو مسؤولي الإدارات التنفيذية عند وجود تقصير جسيم.</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <BadgeAlert className="h-4 w-4 text-emerald-600" />
                  دور ومهام رئيس مجلس الحي التنفيذي
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  رئيس الحي هو الممثل الإداري والتنفيذي المعين من وزارة التنمية المحلية بمحافظة القاهرة. وتشمل صلاحياته:
                </p>
                <ul className="text-xs text-slate-500 list-disc list-inside space-y-1.5 pr-1">
                  <li>إصدار وتطبيق قرارات إزالة الإشغالات ومخالفات البناء فورا.</li>
                  <li>الإشراف الكامل على الموازنة الاستثمارية المخصصة للرصف والإنارة والتشجير بالحي.</li>
                  <li>تلقي الشكاوى العامة وحلها وتسهيل عمل المراكز التكنولوجية لخدمة المواطنين.</li>
                </ul>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-emerald-600" />
                  الموازنات الذاتية وصناديق الخدمات للحي
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  يسمح القانون لكل حي بإنشاء صندوق خاص يسمى <strong>"حساب الخدمات والتنمية المحلية"</strong> لتنمية الموارد الذاتية للحي من رسوم الرخص والإعلانات والأسواق الحرة. ويتم صرفها بقرار وموافقة المجلس المحلي في تمويل مشروعات النظافة العاجلة والتشجير ورصف الممرات الضيقة في العاصمة.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-3">
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-emerald-600" />
                  حق المواطن في منظومة اتخاذ القرار
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  تنص القوانين والدستور المصري على مبادئ الشفافية واللامركزية. يملك المواطنون الحق في تقديم العرائض وتوجيه المقترحات عبر لجان التنمية التشاركية وحضور الجلسات المفتوحة ومراجعة الموازنات التفصيلية والشكوى لدى المجلس الأعلى لحماية المصلحة العامة.
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
