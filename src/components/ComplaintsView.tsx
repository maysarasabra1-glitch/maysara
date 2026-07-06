import React, { useState } from 'react';
import { Complaint } from '../types';
import { CAIRO_DISTRICTS } from '../data';
import { 
  ShieldAlert, CheckCircle, Clock, AlertTriangle, MessageSquare, 
  ThumbsUp, Plus, Search, Filter, HelpCircle, ArrowRight, CornerDownLeft, Sparkles 
} from 'lucide-react';

interface ComplaintsViewProps {
  complaints: Complaint[];
  onAddComplaint: (complaint: Omit<Complaint, 'id' | 'date' | 'votes' | 'userVoted' | 'status'>) => void;
  onVoteComplaint: (id: string) => void;
  onDraftComplaintWithAI: (districtName: string, title: string, description: string) => void;
  selectedDistrictId: string;
  setSelectedDistrictId: (id: string) => void;
}

export default function ComplaintsView({
  complaints,
  onAddComplaint,
  onVoteComplaint,
  onDraftComplaintWithAI,
  selectedDistrictId,
  setSelectedDistrictId
}: ComplaintsViewProps) {
  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form Fields State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<Complaint['category']>('cleaning');
  const [formDistrict, setFormDistrict] = useState(CAIRO_DISTRICTS[0].id);
  const [formDescription, setFormDescription] = useState('');
  const [formCitizenName, setFormCitizenName] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter complaints
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = c.title.includes(searchTerm) || c.description.includes(searchTerm);
    const matchesDistrict = selectedDistrictId === 'all' || c.districtId === selectedDistrictId;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    return matchesSearch && matchesDistrict && matchesCategory && matchesStatus;
  });

  const categories = [
    { id: 'all', label: 'كل التصنيفات' },
    { id: 'cleaning', label: 'النظافة والتجميل' },
    { id: 'roads', label: 'الرصف وإشغالات الطرق' },
    { id: 'violations', label: 'مخالفات البناء واللوائح' },
    { id: 'lighting', label: 'شبكات إنارة وكهرباء' },
    { id: 'environment', label: 'شؤون البيئة والحدائق' },
    { id: 'others', label: 'أخرى / خدمات حكومية' }
  ];

  const statuses = [
    { id: 'all', label: 'كل الحالات' },
    { id: 'under_review', label: 'تحت المراجعة والفحص' },
    { id: 'in_progress', label: 'جاري العمل والإصلاح' },
    { id: 'resolved', label: 'تمت الاستجابة والحل' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formCitizenName) {
      alert('من فضلك املأ جميع الحقول المطلوبة.');
      return;
    }

    const matchedDistrict = CAIRO_DISTRICTS.find(d => d.id === formDistrict);
    
    onAddComplaint({
      title: formTitle,
      category: formCategory,
      districtId: formDistrict,
      districtName: matchedDistrict ? matchedDistrict.nameAr : 'حي مجهول',
      description: formDescription,
      citizenName: formCitizenName
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setIsFormOpen(false);
      // Reset form fields
      setFormTitle('');
      setFormDescription('');
      setFormCitizenName('');
    }, 2000);
  };

  const getStatusBadge = (status: Complaint['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            تم الحل والرد الرسمي
          </span>
        );
      case 'in_progress':
        return (
          <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            جاري العمل عليها الآن
          </span>
        );
      case 'under_review':
        return (
          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            قيد الفحص والمراجعة
          </span>
        );
    }
  };

  const getCategoryLabel = (cat: Complaint['category']) => {
    const matched = categories.find(c => c.id === cat);
    return matched ? matched.label : 'عامة';
  };

  return (
    <div className="space-y-6 animate-fade-in" id="complaints-view-root">
      
      {/* Search and Action Bar */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">بوابة صوت المواطن وعرض المشكلات</h3>
          <p className="text-xs text-slate-500 mt-1">
            قم بالبحث عن القضايا البلدية في حيك، اضغط على زر الإعجاب لدعم القضية، أو صغ شكوى رسمية بمساعدة مستشار الذكاء الاصطناعي.
          </p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2 text-sm shadow-md shadow-emerald-600/15"
          id="btn-trigger-form"
        >
          <Plus className="h-4 w-4" />
          <span>تقديم بلاغ / شكوى جديدة</span>
        </button>
      </div>

      {/* Slide-down Form Container */}
      {isFormOpen && (
        <div className="bg-white border-2 border-emerald-500/20 rounded-2xl p-6 shadow-lg animate-slide-down" id="complaint-submission-form">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
            <h4 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-emerald-600" />
              تعبئة استمارة الإبلاغ عن مشكلة محلية
            </h4>
            <button 
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold"
            >
              إلغاء وعودة
            </button>
          </div>

          {submitSuccess ? (
            <div className="py-8 text-center space-y-3" id="form-success-alert">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h5 className="text-base font-bold text-slate-800">تم تسجيل بلاغك بنجاح!</h5>
              <p className="text-xs text-slate-500">
                لقد أدرجنا شكواك في الدليل المفتوح ليقوم أهالي حيك بدعمها، وسيتم رفعها لسكرتارية الحي فوراً.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم مقدم الشكوى (ثنائي أو ثلاثي) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: محمد أحمد علي"
                    value={formCitizenName}
                    onChange={(e) => setFormCitizenName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">عنوان المشكلة بوضوح *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تراكم القمامة أمام المدرسة الإعدادية"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اختر الحي التابع له البلاغ *</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700"
                  >
                    {CAIRO_DISTRICTS.map(d => (
                      <option key={d.id} value={d.id}>حي {d.nameAr}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">نوع وتصنيف المشكلة *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Complaint['category'])}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700"
                  >
                    <option value="cleaning">النظافة والتجميل</option>
                    <option value="roads">الرصف وإشغالات الطرق</option>
                    <option value="violations">مخالفات البناء واللوائح</option>
                    <option value="lighting">شبكات إنارة وكهرباء</option>
                    <option value="environment">شؤون البيئة والحدائق</option>
                    <option value="others">أخرى / خدمات حكومية</option>
                  </select>
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">تفاصيل ووصف المشكلة ومكانها بدقة *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="من فضلك صف الشكوى والأضرار الناتجة وموقع المشكلة بالتفصيل لتسهيل المتابعة..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-700"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  ملاحظة: الشكاوى المنشورة هنا تساعد لجان الرقابة الشعبية وأعضاء المجلس على متابعتها والضغط لحلها.
                </p>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl transition duration-300 text-sm"
                  id="btn-submit-complaint"
                >
                  نشر الشكوى الآن
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Main Filter Panel */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4" id="filters-container">
        <div className="flex items-center gap-2 text-slate-700 pb-3 border-b border-slate-100">
          <Filter className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-bold">فرز وتصفية القضايا</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* District Selector */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">تصفية حسب الحي:</label>
            <select
              value={selectedDistrictId}
              onChange={(e) => setSelectedDistrictId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="all">كل أحياء محافظة القاهرة</option>
              {CAIRO_DISTRICTS.map(d => (
                <option key={d.id} value={d.id}>حي {d.nameAr}</option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">حسب التصنيف:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">حالة الاستجابة والحل:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              {statuses.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Text Search inside current filters */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="ابحث بكلمة مفتاحية في الشكاوى المفلترة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4" id="complaints-list-container">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <div 
              key={complaint.id}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition duration-300 space-y-4"
              id={`complaint-card-${complaint.id}`}
            >
              
              {/* Card Header Info */}
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                      حي {complaint.districtName}
                    </span>
                    <span className="text-[11px] text-slate-400">{complaint.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800">{complaint.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-1 rounded-full font-medium">
                    {getCategoryLabel(complaint.category)}
                  </span>
                  {getStatusBadge(complaint.status)}
                </div>
              </div>

              {/* Description & Details */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {complaint.description}
              </p>

              {/* Citizen Identity */}
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">مقدم الطلب:</span>
                <span>{complaint.citizenName}</span>
              </div>

              {/* Official Response Section if exists */}
              {complaint.officialResponse && (
                <div className="bg-emerald-50/50 border border-emerald-500/10 rounded-xl p-4 space-y-2 relative" id={`response-${complaint.id}`}>
                  <div className="absolute top-0 left-4 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-b-md flex items-center gap-0.5">
                    <CheckCircle className="h-2.5 w-2.5" />
                    استجابة إدارية معتمدة
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                    <CornerDownLeft className="h-3.5 w-3.5" />
                    <span>الرد الرسمي لـ {complaint.officialResponse.responderName} ({complaint.officialResponse.responderRole})</span>
                    <span className="text-[10px] text-slate-400 font-normal"> - {complaint.officialResponse.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pr-5">
                    "{complaint.officialResponse.text}"
                  </p>
                </div>
              )}

              {/* Footer Interaction Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                
                {/* Voting Action */}
                <button
                  onClick={() => onVoteComplaint(complaint.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs transition duration-300 font-bold ${
                    complaint.userVoted
                      ? 'bg-amber-500 text-emerald-950'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                  id={`btn-vote-${complaint.id}`}
                >
                  <ThumbsUp className={`h-4 w-4 ${complaint.userVoted ? 'fill-current' : ''}`} />
                  <span>{complaint.votes} مواطن يؤيد المطلب</span>
                </button>

                {/* AI Assistant draft integration */}
                <button
                  onClick={() => onDraftComplaintWithAI(complaint.districtName, complaint.title, complaint.description)}
                  className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs px-4 py-2 rounded-xl transition duration-300 font-bold flex items-center gap-1.5 border border-emerald-500/10"
                  id={`btn-ai-draft-${complaint.id}`}
                >
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                  <span>توليد صيغة شكوى رسمية للحي</span>
                </button>

              </div>

            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-100">
            لا توجد بلاغات تطابق معايير الفرز والبحث حالياً.
          </div>
        )}
      </div>

    </div>
  );
}
