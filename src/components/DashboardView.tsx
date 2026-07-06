import React, { useState } from 'react';
import { CAIRO_DISTRICTS } from '../data';
import { District } from '../types';
import { Search, MapPin, Users, CheckCircle, AlertTriangle, Calendar, Info, Award } from 'lucide-react';

interface DashboardViewProps {
  onSelectDistrict: (districtId: string) => void;
  onNavigateToTab: (tabId: string) => void;
}

export default function DashboardView({ onSelectDistrict, onNavigateToTab }: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Stats calculation
  const totalDistricts = CAIRO_DISTRICTS.length;
  const totalSeats = CAIRO_DISTRICTS.reduce((sum, d) => sum + d.seatsCount, 0);
  const totalResolved = CAIRO_DISTRICTS.reduce((sum, d) => sum + d.resolvedIssuesCount, 0);
  const totalActive = CAIRO_DISTRICTS.reduce((sum, d) => sum + d.activeIssuesCount, 0);

  // Filter districts
  const filteredDistricts = CAIRO_DISTRICTS.filter(d =>
    d.nameAr.includes(searchTerm) || d.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in" id="dashboard-view-container">
      
      {/* Platform Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        <div className="relative z-10 max-w-3xl">
          <span className="bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-full tracking-wide uppercase">
            مستقبل الإدارة المحلية الرقمية
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mt-4 mb-3 leading-snug">
            تمكين الرقابة الشعبية والتطوير البلدي بمحافظة القاهرة
          </h2>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
            منصة <strong className="text-amber-400">محليات وطن</strong> تجمع بين المواطنين وأعضاء المجالس المحلية المنتخبة ورؤساء الأحياء في العاصمة. نهدف إلى تعزيز الشفافية، ومتابعة تنفيذ المشروعات المحلية، وتسهيل تقديم الشكاوى وحلها بالذكاء الاصطناعي.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateToTab('complaints')}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl transition duration-300 shadow-lg shadow-amber-500/20 text-sm"
              id="btn-raise-voice"
            >
              أبلغ عن مشكلة في حيك الآن
            </button>
            <button
              onClick={() => onNavigateToTab('advisor')}
              className="bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-600 font-bold px-6 py-3 rounded-xl transition duration-300 text-sm"
              id="btn-consult-advisor"
            >
              استشر المستشار المحلي الذكي
            </button>
          </div>
        </div>
      </div>

      {/* Main Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalDistricts} أحياء</div>
            <div className="text-xs text-slate-500 font-medium">مغذاة بالمنصة حالياً بمحافظة القاهرة</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalSeats} مقعداً</div>
            <div className="text-xs text-slate-500 font-medium">إجمالي المقاعد الشعبية المحلية</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-100 text-emerald-800 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalResolved.toLocaleString()} شكوى</div>
            <div className="text-xs text-slate-500 font-medium">تم حلها وإغلاقها من الأحياء والمجالس</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800">{totalActive} شكاوى نشطة</div>
            <div className="text-xs text-slate-500 font-medium">تخضع للمتابعة الفنية والإدارية الآن</div>
          </div>
        </div>

      </div>

      {/* Directory of Cairo Districts */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100" id="districts-directory">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">الدليل والتقرير السنوي لأحياء محافظة القاهرة</h3>
            <p className="text-xs text-slate-500 mt-1">
              اختر الحي لاستعراض الإحصائيات، أعضاء المجلس، ومواعيد انعقاد الجلسات التنفيذية والمحلية الشعبية.
            </p>
          </div>
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن الحي (مثال: مصر الجديدة، المعادي...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-700"
              id="district-search"
            />
          </div>
        </div>

        {/* Districts List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredDistricts.length > 0 ? (
            filteredDistricts.map((district) => (
              <div 
                key={district.id} 
                className="bg-slate-50 border border-slate-100 hover:border-emerald-500/30 rounded-2xl p-5 hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between"
                id={`district-card-${district.id}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-slate-800 group-hover:text-emerald-700 transition">
                        حي {district.nameAr}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono block mt-0.5">{district.nameEn} District</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-1 rounded-lg">
                      {district.seatsCount} مقعداً شعبياً
                    </span>
                  </div>

                  <div className="space-y-2 mt-4 text-xs text-slate-600">
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">رئيس الحي:</span>
                      <span className="font-semibold text-slate-700">{district.presidentName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">التعداد التقديري:</span>
                      <span className="font-semibold text-slate-700">{district.population}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/50 pb-1.5">
                      <span className="text-slate-400">الجلسة القادمة للمجلس:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3 inline" />
                        {district.upcomingMeetingDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="bg-amber-50 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {district.activeIssuesCount} نشطة
                    </span>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {district.resolvedIssuesCount} محلولة
                    </span>
                  </div>
                  
                  <button
                    onClick={() => onSelectDistrict(district.id)}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-0.5"
                  >
                    عرض الملف الكامل &larr;
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400">
              لا توجد أحياء تطابق بحثك حالياً. حاول استخدام كلمات مفتاحية أخرى.
            </div>
          )}
        </div>
      </div>

      {/* Local Administration Law Summary */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="p-4 bg-amber-500/10 text-amber-700 rounded-2xl">
          <Award className="h-8 w-8" />
        </div>
        <div className="space-y-1 flex-1">
          <h4 className="text-base font-bold text-amber-900 flex items-center gap-2">
            منظومة المجالس المحلية الشعبية والتنفيذية
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            يتشكل نظام الإدارة المحلية في جمهورية مصر العربية (قانون 43 لسنة 1979) من مستويين: 
            <strong> المجلس التنفيذي للحي</strong> (برئاسة رئيس الحي المعين ويضم مدراء المديريات الخدمية) و
            <strong> المجلس المحلي الشعبي</strong> (المشكل من نواب منتخبين شعبياً يمثلون لجان التخطيط والموازنة والخدمات والمرافق لتقديم الأدوات الرقابية كالطلبات والأسئلة وطلبات الإحاطة).
          </p>
        </div>
        <button
          onClick={() => onNavigateToTab('council')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs whitespace-nowrap self-stretch md:self-auto text-center"
        >
          اقرأ الدليل القانوني للمحليات
        </button>
      </div>

    </div>
  );
}
