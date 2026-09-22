import { getCurrentJalaliDate } from '../utils/jalali';

const today = getCurrentJalaliDate().dateString;

export const INITIAL_CATEGORIES = [
  { id: 'ariamir', name: 'پروژه‌های ARIAMIR', color: '#3ECF8E', icon: 'Briefcase' },
  { id: 'work', name: 'کار و بیزنس', color: '#7965FF', icon: 'Zap' },
  { id: 'study', name: 'آموزش و مطالعه', color: '#79C0FF', icon: 'BookOpen' },
  { id: 'health', name: 'سلامتی و ورزش', color: '#FFCDA1', icon: 'Activity' },
  { id: 'finance', name: 'مالی و سرمایه', color: '#DA8D00', icon: 'DollarSign' },
  { id: 'personal', name: 'شخصی و تفریح', color: '#E54D2D', icon: 'Smile' }
];

export const INITIAL_TASKS = [
  {
    id: 't-1',
    title: 'بررسی نهایی دیزاین سیستم و انتشار نسخه جدید TickAR',
    description: 'تطابق فونت کلمه و پالت رنگی رسمی با برندبوک ARIAMIR و تست نسخه موبایل',
    category: 'ariamir',
    priority: 'high', // 'urgent' | 'high' | 'medium' | 'low'
    matrixQuadrant: 'do_first', // 'do_first' (فوری و مهم), 'schedule' (مهم غیرفوری), 'delegate' (فوری غیرمهم), 'eliminate' (نه فوری نه مهم)
    date: today,
    time: '10:30',
    completed: false,
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    subtasks: [
      { id: 'st-1', text: 'بررسی کنتراست رنگ‌های تم تاریک و سبز زمردی', completed: true },
      { id: 'st-2', text: 'تست عملکرد تقویم شمسی و یادآورها', completed: true },
      { id: 'st-3', text: 'بهینه‌سازی کدهای PWA و ذخیره‌سازی آفلاین', completed: false }
    ],
    recurrence: 'none'
  },
  {
    id: 't-2',
    title: 'سشن تمرکز عمیق (Deep Work) روی ماژول هوش مصنوعی',
    description: 'تحلیل الگوریتم‌های پیشنهاد برنامه و برنامه‌ریزی هوشمند تسک‌ها',
    category: 'ariamir',
    priority: 'high',
    matrixQuadrant: 'do_first',
    date: today,
    time: '14:00',
    completed: false,
    estimatedPomodoros: 4,
    completedPomodoros: 2,
    subtasks: [
      { id: 'st-21', text: 'بررسی پرامپت‌های برنامه‌ریزی هدفمند', completed: true },
      { id: 'st-22', text: 'تست شکستن اهداف بزرگ به گام‌های کوچک', completed: false }
    ],
    recurrence: 'daily'
  },
  {
    id: 't-3',
    title: '۳۰ دقیقه مطالعه کتاب «عادت‌های اتمی»',
    description: 'مرور فصل چهارم در مورد ساخت سیستم‌های پایدار روزانه',
    category: 'study',
    priority: 'medium',
    matrixQuadrant: 'schedule',
    date: today,
    time: '18:30',
    completed: true,
    estimatedPomodoros: 1,
    completedPomodoros: 1,
    subtasks: [],
    recurrence: 'daily'
  },
  {
    id: 't-4',
    title: 'ورزش و تمرینات کششی عصرگاهی',
    description: '۴۵ دقیقه تمرین با وزنه و هوازی برای بازیابی انرژی مغزی',
    category: 'health',
    priority: 'medium',
    matrixQuadrant: 'schedule',
    date: today,
    time: '19:30',
    completed: false,
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    subtasks: [
      { id: 'st-41', text: 'گرم کردن ۱۰ دقیقه', completed: false },
      { id: 'st-42', text: 'تمرین بالاتنه و شکم', completed: false },
      { id: 'st-43', text: 'حرکات کششی و ریکاوری', completed: false }
    ],
    recurrence: 'daily'
  },
  {
    id: 't-5',
    title: 'برنامه‌ریزی مالی و بازبینی اهداف ماهانه شرکت',
    description: 'بررسی بودجه توسعه محصول و تارگت‌های رشد فصل',
    category: 'finance',
    priority: 'low',
    matrixQuadrant: 'schedule',
    date: today,
    time: '21:00',
    completed: false,
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    subtasks: [],
    recurrence: 'monthly'
  }
];

export const INITIAL_HABITS = [
  {
    id: 'h-1',
    name: 'کدنویسی و توسعه عمیق ARIAMIR',
    category: 'ariamir',
    icon: '💻',
    streak: 14,
    bestStreak: 28,
    targetDays: [0, 1, 2, 3, 4, 5], // Sat to Thu
    completedDates: [today],
    color: '#3ECF8E',
    timeOfDay: 'morning'
  },
  {
    id: 'h-2',
    name: 'نوشیدن ۸ لیوان آب (۲ لیتر)',
    category: 'health',
    icon: '💧',
    streak: 21,
    bestStreak: 30,
    targetDays: [0, 1, 2, 3, 4, 5, 6], // Every day
    completedDates: [today],
    color: '#79C0FF',
    timeOfDay: 'all_day'
  },
  {
    id: 'h-3',
    name: 'مطالعه و رشد فردی (حداقل ۲۰ صفحه)',
    category: 'study',
    icon: '📚',
    streak: 9,
    bestStreak: 15,
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [today],
    color: '#FFCDA1',
    timeOfDay: 'evening'
  },
  {
    id: 'h-4',
    name: 'تمرین تنفسی باکس و مدیتیشن ذهن',
    category: 'health',
    icon: '🧘',
    streak: 7,
    bestStreak: 12,
    targetDays: [0, 1, 2, 3, 4, 5, 6],
    completedDates: [],
    color: '#7965FF',
    timeOfDay: 'morning'
  },
  {
    id: 'h-5',
    name: 'پیاده‌روی یا ورزش هوازی ۳۰ دقیقه',
    category: 'health',
    icon: '🏃‍♂️',
    streak: 5,
    bestStreak: 10,
    targetDays: [0, 1, 2, 3, 4, 5],
    completedDates: [],
    color: '#3ECF8E',
    timeOfDay: 'evening'
  }
];

export const INITIAL_MOOD_LOGS = [
  {
    id: 'm-1',
    date: today,
    mood: 5, // 1 to 5 (5 is Best)
    energy: 9, // 1 to 10
    factors: ['کار و پروژه‌ها', 'تمرکز عمیق', 'ورزش', 'تغذیه سالم'],
    note: 'امروز انرژی فوق‌العاده‌ای داشتم. بخش‌های کلیدی اپلیکیشن با موفقیت طراحی شد و حس نظم بالایی دارم.',
    gratitude: 'شکرگزار پیشرفت پیوسته تیم ARIAMIR، ذهن پویا و سلامتی هستم.'
  }
];

export const PODCAST_EPISODES = [
  {
    id: 'pod-1',
    title: 'اصول تمرکز عمیق (Deep Work) و شکستن حواس‌پرتی‌ها',
    speaker: 'آکادمی توسعه فردی ARIAMIR',
    duration: '۱۲:۴۵',
    category: 'مدیریت زمان و تمرکز',
    summary: 'چگونه در عصر انفجار نوتیفیکیشن‌ها، توانایی ساعت‌ها کار متمرکز با کیفیت خارق‌العاده را دوباره در مغز خود احیا کنیم؟',
    transcript: 'در این پادکست می‌آموزیم که مغز انسان چگونه هنگام سوییچ مداوم بین وظایف دچار پسماند توجه (Attention Residue) می‌شود. برای ایجاد خروجی‌های شگفت‌انگیز در کار و زندگی، باید بلوک‌های زمانی ۹۰ دقیقه‌ای بدون کوچک‌ترین اختلال ایجاد کنید...',
    isVip: true,
    coverColor: 'from-[#15593B] to-[#0A0A0A]'
  },
  {
    id: 'pod-2',
    title: 'قانون ۵ ثانیه و پایان دادن به اهمال‌کاری مزمن',
    speaker: 'استاد مهدیه پوریا',
    duration: '۰۹:۱۵',
    category: 'انگیزه و غلبه بر تنبلی',
    summary: 'مکانیزم مغز برای متوقف کردن شما قبل از شروع کارهای سخت و تکنیک معکوس برای اقدام فوری بدون معطلی.',
    transcript: 'فاصله بین داشتن یک ایده برای اقدام تا زمانی که مغز شروع به بهانه‌تراشی می‌کند، فقط ۵ ثانیه است. وقتی می‌شمارید ۵، ۴، ۳، ۲، ۱ و حرکت می‌کنید، قشر جلوی مغز (Prefrontal Cortex) فعال شده و کنترل را از ناخودآگاه می‌گیرد...',
    isVip: true,
    coverColor: 'from-[#7965FF]/30 to-[#0A0A0A]'
  },
  {
    id: 'pod-3',
    title: 'سیستم‌سازی عادت‌ها به سبک کتاب عادت‌های اتمی',
    speaker: 'دکتر آریا قیوومی',
    duration: '۱۵:۲۰',
    category: 'عادت‌سازی و لایف‌استایل',
    summary: 'چرا اهداف شکست می‌خورند اما سیستم‌ها پیروز می‌شوند؟ راهنمای کاربردی تبدیل تغییرات کوچک ۱ درصدی به موفقیت‌های چشمگیر.',
    transcript: 'شما به سطح اهدافتان صعود نمی‌کنید، بلکه به سطح سیستم‌هایتان سقوط می‌کنید. راز ثبات در عادات این است که نشانه‌ها را آشکار، جذابیت را بالا، انجام را آسان و پاداش را فوری کنید...',
    isVip: true,
    coverColor: 'from-[#DA8D00]/30 to-[#0A0A0A]'
  },
  {
    id: 'pod-4',
    title: 'مدیریت انرژی روانی و ریکاوری مغز در طول روز',
    speaker: 'کلینیک روانشناسی و راندمان',
    duration: '۱۱:۱۰',
    category: 'سلامت ذهن و کنترل استرس',
    summary: 'چگونه باتری ذهنی خود را با تنفس، تغذیه و استراحت‌های استراتژیک پومودورو همیشه در حالت سبز نگه داریم؟',
    transcript: 'مدیریت انرژی از مدیریت زمان بسیار مهم‌تر است. اگر ۸ ساعت وقت داشته باشید اما مغزتان خسته باشد، بازدهی‌تان نزدیک به صفر خواهد بود. چرخه ۹۰ دقیقه تمرکز و ۱۰ دقیقه تنفس عمیق معجزه می‌کند...',
    isVip: true,
    coverColor: 'from-[#00C472]/30 to-[#0A0A0A]'
  }
];

export const DAILY_AFFIRMATIONS = [
  {
    quote: 'نظم و استمرار روزانه، تنها پلی است که رویاهای بزرگ را به دستاوردهای واقعی تبدیل می‌کند.',
    author: 'هویت سازمانی ARIAMIR',
    tags: ['استمرار', 'موفقیت', 'نظم']
  },
  {
    quote: 'ما همانی هستیم که مکرراً انجام می‌دهیم؛ پس برتری و کمال، یک عمل نیست بلکه یک عادت است.',
    author: 'ارسطو',
    tags: ['عادت', 'انگیزه']
  },
  {
    quote: 'تمرکز یعنی «نه» گفتن به صد ایده خوب دیگر، برای اینکه بتوانی روی یک ایده فوق‌العاده تمام انرژی‌ات را بگذاری.',
    author: 'استیو جابز',
    tags: ['تمرکز', 'اراده']
  },
  {
    quote: 'تغییرات کوچک و مداوم ۱ درصدی در روز، در پایان یک سال شما را ۳۷ برابر بهتر و قوی‌تر می‌سازد.',
    author: 'جیمز کلیر',
    tags: ['عادت‌های اتمی', 'رشد فردی']
  },
  {
    quote: 'ذهن آرام و سازمان‌یافته، قدرتمندترین سلاح در دنیای پرآشوب امروز است.',
    author: 'مانیفست موفقیت TickAR',
    tags: ['آرامش', 'کنترل ذهن']
  }
];

export const BADGES_LIST = [
  { id: 'b-vip', title: 'عضویت الماس ARIAMIR VIP', icon: '👑', desc: 'دسترسی رایگان و نامحدود به تمامی امکانات پرو و پیشرفته', unlocked: true },
  { id: 'b-first-task', title: 'شروع قدرتمند', icon: '🚀', desc: 'تیک زدن اولین وظیفه در تیک‌آر', unlocked: true },
  { id: 'b-streak-7', title: 'زنجیره آتشین ۷ روزه', icon: '🔥', desc: 'حفظ استمرار ۷ روز متوالی در ثبت عادات', unlocked: true },
  { id: 'b-focus-master', title: 'استاد تمرکز عمیق', icon: '⏱️', desc: 'تکمیل بیش از ۱۰ ساعت سشن پومودورو بدون وقفه', unlocked: true },
  { id: 'b-zen-master', title: 'ذهن آرام و متمرکز', icon: '🧘', desc: 'انجام ۵ تمرین تنفسی و ثبت روزانه مود', unlocked: false },
  { id: 'b-habit-architect', title: 'معمار عادات طلایی', icon: '🏛️', desc: 'ثبت و پایبندی به ۵ عادت همزمان در یک هفته', unlocked: false }
];
