import React from 'react';
import { Landmark, ShieldAlert, Calendar, Users, Cpu } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  // Format current Cairo time nicely
  const getCairoTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Africa/Cairo'
    };
    return new Intl.DateTimeFormat('ar-EG', options).format(new Date());
  };

  const tabs = [
    { id: 'dashboard', label: 'الرئيسية والمؤشرات', icon: Landmark },
    { id: 'complaints', label: 'بوابـة صـوت المـواطـن', icon: ShieldAlert },
    { id: 'council', label: 'شؤون المجالس والقرارات', icon: Calendar },
    { id: 'advisor', label: 'مستشار محليات وطن (الذكاء الاصطناعي)', icon: Cpu, isAi: true },
  ];

  return (
    <header className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white shadow-xl border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          
          {/* Logo and App Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 text-emerald-950 p-2.5 rounded-xl shadow-md border border-amber-300 flex items-center justify-center animate-pulse">
              <Landmark className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-amber-400">مَحليات وَطَن</h1>
                <span className="text-xs bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-600 font-medium">
                  محافظة القاهرة
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-light mt-0.5">
                المنصة المتكاملة للمجالس المحلية الشعبية والرقابة البلدية والمشاركة المجتمعية
              </p>
            </div>
          </div>

          {/* Clock and Meta Information */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-lg py-1.5 px-3 flex items-center gap-2 text-emerald-200 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-ping"></span>
              <span className="font-semibold text-emerald-100">بوابة القاهرة الكبرى الرقمية</span>
              <span className="text-emerald-400 font-mono">v1.2</span>
            </div>
            <div className="hidden lg:block text-left text-xs text-emerald-200">
              <div className="font-medium text-amber-300">{getCairoTime()}</div>
              <div className="text-[10px] opacity-70">المجالس الشعبية المحلية - صوتك يقود التطوير</div>
            </div>
          </div>

        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-emerald-800/60 mt-1">
          <nav className="flex flex-wrap gap-1 md:gap-2 py-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-amber-500 text-emerald-950 shadow-md transform scale-102 font-bold'
                      : 'text-emerald-100 hover:bg-emerald-800/40 hover:text-white'
                  } ${tab.isAi ? 'border border-amber-500/20' : ''}`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-950' : tab.isAi ? 'text-amber-400' : 'text-emerald-300'}`} />
                  <span>{tab.label}</span>
                  {tab.isAi && (
                    <span className="bg-emerald-900 text-amber-400 text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
}
