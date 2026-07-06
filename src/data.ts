import { District, Complaint, CouncilDecision, CouncilMeeting } from './types';

export const CAIRO_DISTRICTS: District[] = [
  {
    id: 'heliopolis',
    nameAr: 'مصر الجديدة',
    nameEn: 'Heliopolis',
    population: '150,000 نسمة',
    seatsCount: 24,
    presidentName: 'اللواء أ.ح / حسام لبيب',
    activeIssuesCount: 4,
    resolvedIssuesCount: 182,
    upcomingMeetingDate: '2026-07-12'
  },
  {
    id: 'nasr_city_east',
    nameAr: 'شرق مدينة نصر',
    nameEn: 'East Nasr City',
    population: '350,000 نسمة',
    seatsCount: 32,
    presidentName: 'اللواء / أحمد جودة',
    activeIssuesCount: 7,
    resolvedIssuesCount: 245,
    upcomingMeetingDate: '2026-07-15'
  },
  {
    id: 'maadi',
    nameAr: 'المعادي',
    nameEn: 'Maadi',
    population: '120,000 نسمة',
    seatsCount: 20,
    presidentName: 'المهندس / طارق الباز',
    activeIssuesCount: 3,
    resolvedIssuesCount: 141,
    upcomingMeetingDate: '2026-07-14'
  },
  {
    id: 'abdeen',
    nameAr: 'عابدين',
    nameEn: 'Abdeen',
    population: '95,000 نسمة',
    seatsCount: 16,
    presidentName: 'العميد / محمد أنيس',
    activeIssuesCount: 2,
    resolvedIssuesCount: 98,
    upcomingMeetingDate: '2026-07-20'
  },
  {
    id: 'zamalek',
    nameAr: 'الزمالك وغرب القاهرة',
    nameEn: 'Zamalek',
    population: '80,000 نسمة',
    seatsCount: 16,
    presidentName: 'اللواء / محمد عقل',
    activeIssuesCount: 1,
    resolvedIssuesCount: 76,
    upcomingMeetingDate: '2026-07-18'
  },
  {
    id: 'sayyeda_zeinab',
    nameAr: 'السيدة زينب',
    nameEn: 'Sayyeda Zeinab',
    population: '180,000 نسمة',
    seatsCount: 22,
    presidentName: 'المهندسة / ميرفت مطر',
    activeIssuesCount: 5,
    resolvedIssuesCount: 154,
    upcomingMeetingDate: '2026-07-13'
  },
  {
    id: 'helwan',
    nameAr: 'حلوان',
    nameEn: 'Helwan',
    population: '450,000 نسمة',
    seatsCount: 36,
    presidentName: 'اللواء / حسام طوبار',
    activeIssuesCount: 9,
    resolvedIssuesCount: 312,
    upcomingMeetingDate: '2026-07-22'
  },
  {
    id: 'shubra',
    nameAr: 'شبرا',
    nameEn: 'Shubra',
    population: '220,000 نسمة',
    seatsCount: 24,
    presidentName: 'المهندس / عادل عبد الظاهر',
    activeIssuesCount: 4,
    resolvedIssuesCount: 198,
    upcomingMeetingDate: '2026-07-16'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    title: 'تراكم مخلفات هدم وبناء بشارع اللاسلكي',
    category: 'cleaning',
    districtId: 'maadi',
    districtName: 'المعادي',
    description: 'توجد كميات كبيرة من مخلفات الهدم والبناء ملقاة على الرصيف والجزيرة الوسطى بشارع اللاسلكي أمام مبنى الاتصالات، مما يعيق حركة المشاة والسيارات ويسيء للمظهر الحضاري للحي.',
    citizenName: 'أحمد محمود القاضي',
    date: '2026-07-01',
    status: 'in_progress',
    votes: 38,
    userVoted: false,
    officialResponse: {
      responderName: 'م/ طارق الباز',
      responderRole: 'رئيس حي المعادي',
      text: 'تم رصد الشكوى وتوجيه إدارة النظافة والتجميل بالحي لرفع كافة المخلفات بالتنسيق مع شركة النظافة المتعاقد معها. جاري العمل وسيتم الانتهاء والرفع بالكامل خلال 48 ساعة.',
      date: '2026-07-03'
    }
  },
  {
    id: 'c2',
    title: 'هبوط أرضي مفاجئ بشارع الأهرام بجوار مدرسة نوتردام',
    category: 'roads',
    districtId: 'heliopolis',
    districtName: 'مصر الجديدة',
    description: 'يوجد هبوط أرضي مفاجئ في الحارة اليمنى من شارع الأهرام للقادم من ميدان الكوربة باتجاه كنيسة البازيليك، الهبوط يتسع تدريجياً ويمثل خطراً على سلامة السيارات والمارة في المساء.',
    citizenName: 'مروان الشافعي',
    date: '2026-07-04',
    status: 'under_review',
    votes: 56,
    userVoted: false
  },
  {
    id: 'c3',
    title: 'أعمدة الإنارة معطلة بمحيط مسجد السيدة زينب',
    category: 'lighting',
    districtId: 'sayyeda_zeinab',
    districtName: 'السيدة زينب',
    description: 'الشوارع الجانبية المحيطة بساحة مسجد السيدة زينب (خاصة حارة السد والسبع سقايات) تعاني من ظلام دامس منذ عدة أيام بسبب تلف الكابلات المغذية لأعمدة الإنارة، مما يشكل خطراً أمنياً على قاطني المنطقة والزوار ليلاً.',
    citizenName: 'فاطمة الزهراء علي',
    date: '2026-07-05',
    status: 'in_progress',
    votes: 42,
    userVoted: false,
    officialResponse: {
      responderName: 'أ/ مصطفى كمال',
      responderRole: 'مدير شبكة الإنارة بحي السيدة زينب',
      text: 'تم إدراج الشكوى ضمن خطة الصيانة العاجلة لشبكة الكهرباء والإنارة بالحي، وتم إرسال فنيين لتحديد العطل في كابل التغذية الأرضي وبدء أعمال الإصلاح الفوري.',
      date: '2026-07-05'
    }
  },
  {
    id: 'c4',
    title: 'بناء طابق عاشر مخالف بدون ترخيص بشارع مكرم عبيد',
    category: 'violations',
    districtId: 'nasr_city_east',
    districtName: 'شرق مدينة نصر',
    description: 'يقوم صاحب العقار رقم 25 مكرر بشارع مكرم عبيد ببناء شدة خشبية تمهيداً لصب سقف الطابق العاشر المخالف، مستغلاً الإجازات الأسبوعية وخارج أوقات العمل الرسمية دون مراعاة شروط التراخيص الصادرة للعقار.',
    citizenName: 'المهندس / نبيل شكري',
    date: '2026-07-02',
    status: 'resolved',
    votes: 89,
    userVoted: true,
    officialResponse: {
      responderName: 'اللواء / أحمد جودة',
      responderRole: 'رئيس حي شرق مدينة نصر',
      text: 'تحركت حملة مكبرة من إدارة المباني والإشغالات بالحي بصحبة قوة من شرطة المرافق، وتم وقف الأعمال فوراً، والتحفظ على الونش ومواد البناء، وتنزيل الشدة الخشبية وإزالة المخالفة في المهد بالكامل، وحيازة المحضر اللازم ضد المالك وتحويله للنيابة العسكرية.',
      date: '2026-07-03'
    }
  },
  {
    id: 'c5',
    title: 'تجمع مياه راكدة في حديقة ابن سندر بحدائق القبة',
    category: 'environment',
    districtId: 'shubra',
    districtName: 'شبرا',
    description: 'نتيجة تسرب في خط مياه الري الداخلي بالحديقة، تجمعت مياه راكدة بمساحة واسعة مما تسبب في انتشار الناموس والحشرات الطائرة والروائح الكريهة وتلف المسطحات الخضراء بالحديقة العامة.',
    citizenName: 'شريف فهمي',
    date: '2026-07-05',
    status: 'under_review',
    votes: 19,
    userVoted: false
  }
];

export const COUNCIL_DECISIONS: CouncilDecision[] = [
  {
    id: 'd1',
    title: 'اعتماد الموازنة الإضافية لتطوير رصف المحاور الداخلية بالمعادي والمقطم',
    date: '2026-06-25',
    districtId: 'maadi',
    districtName: 'المعادي',
    summary: 'الموافقة على إعادة توجيه 15 مليون جنيه من فائض ميزانية الخدمات الترفيهية لتوجيهها لرفع كفاءة رصف الشوارع المتضررة وتدعيم بلوعات المطر بالمعادي.',
    details: 'عقد المجلس المحلي اجتماعه الطارئ برئاسة سكرتير عام المحافظة وبحضور ممثلي حي المعادي، وتم التصديق على مقترح لجنة الخطة والموازنة باعتماد مبلغ استثنائي مقداره 15 مليون جنيه لمشروعات الرصف والإنارة للشوارع الفرعية تلبية للطلبات المتكررة من المواطنين.',
    category: 'budget'
  },
  {
    id: 'd2',
    title: 'تطوير ساحة مصر الجديدة وتحويلها لمنطقة مشاة خضراء صديقة للبيئة',
    date: '2026-06-10',
    districtId: 'heliopolis',
    districtName: 'مصر الجديدة',
    summary: 'إقرار خطة مشتركة بين حي مصر الجديدة وجهاز التنسيق الحضاري لمنع ركن السيارات بالساحة وتكثيف زراعة الأشجار وتوفير ممرات دراجات.',
    details: 'أقر المجلس المحلي الخطة المقترحة لتحويل ممر الكوربة وشارع الأهرام الفرعي لساحة مشاة آمنة خضراء مع تخصيص مساحات لأصحاب المشاريع الصغيرة وعربات الطعام المرخصة بطرق منظمة، مع إلزام أصحاب العقارات التراثية بترميم الواجهات والحفاظ على الطابع المعماري التراثي الفريد.',
    category: 'planning'
  },
  {
    id: 'd3',
    title: 'تنظيم مواعيد عمل الباعة الجائلين ونقلهم للأسواق الحضارية الجديدة بالشرق والغرب',
    date: '2026-06-18',
    districtId: 'nasr_city_east',
    districtName: 'شرق مدينة نصر',
    summary: 'حظر تجول الباعة الجائلين حول تقاطع مصطفى النحاس مع مكرم عبيد، وإصدار تراخيص لنقلهم لباكيات السوق الحضاري بالحي الثامن.',
    details: 'في إطار القضاء على العشوائية المرورية والازدحام في الميادين الكبرى لمدينة نصر، وافق المجلس المحلي لحي شرق على حظر أي تواجد إشغالي غير مرخص بمحيط مكرم عبيد ومصطفى النحاس، وتوفير بدائل مجهزة بالكهرباء والخدمات وتوزيع الباكيات بالقرعة العلنية على الباعة المستحقين بأسعار رمزية.',
    category: 'services'
  }
];

export const UPCOMING_MEETINGS: CouncilMeeting[] = [
  {
    id: 'm1',
    title: 'جلسة مناقشة المخطط الاستراتيجي لحي مصر الجديدة والتراخيص السكنية',
    date: '2026-07-12',
    districtId: 'heliopolis',
    districtName: 'مصر الجديدة',
    agenda: [
      'مراجعة قيود الارتفاع البنائي للعقارات الجديدة في مصر الجديدة لمنع تشويه المظهر التراثي.',
      'عرض تقرير لجنة البيئة حول مستوى النظافة وأداء الشركة الجديدة المسؤولة عن جمع النفايات من المنازل.',
      'فتح باب النقاش لطلبات الإحاطة المقدمة من نواب المجلس بشأن رصف الشوارع المحيطة بمحطة مترو هارون.'
    ],
    summary: 'ستعقد الجلسة في تمام الساعة 11 صباحاً بقاعة المؤتمرات الكبرى بمركز شباب مصر الجديدة، ومتاحة لحضور أهالي الحي لعرض استفساراتهم المسجلة مسبقاً لدى سكرتارية الحي.',
    attendeesCount: 45
  },
  {
    id: 'm2',
    title: 'اجتماع المجلس المحلي الموسع لمناقشة أزمة مواقف السيارات العشوائية بالمعادي',
    date: '2026-07-14',
    districtId: 'maadi',
    districtName: 'المعادي',
    agenda: [
      'تنظيم مواقف سيارات السيرفيس حول محطة مترو حدائق المعادي والمعادي السكنية.',
      'دراسة مقترح تركيب كاميرات مراقبة لرصد مخالفات إشغال الطرق من قِبل الكافيهات والمحلات التجارية.',
      'مشروع تشجير وتجميل مداخل حي دجلة والمعادي القديمة بالتعاون مع لجان الشباب التطوعية.'
    ],
    summary: 'جلسة علنية هامة تجمع ممثلي إدارة المرور والشباب المتطوع مع رئيس الحي ومجلسه المحلي بقاعة مجلس حي المعادي بالمحكمة القديمة.',
    attendeesCount: 60
  }
];
