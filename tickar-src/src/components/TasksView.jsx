import React, { useState } from 'react';
import { toPersianDigits, getCurrentJalaliDate } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import {
  Plus,
  Folder,
  Bell,
  Clock,
  Check,
  X,
  Edit2,
  Trash2,
  Flag,
  Calendar,
  Layers,
  ChevronDown,
  Sparkles,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PRIORITY_FLAGS = [
  { id: 'green', color: '#10b981', label: 'عادی' },
  { id: 'blue', color: '#3b82f6', label: 'متوسط' },
  { id: 'yellow', color: '#eab308', label: 'مهم' },
  { id: 'orange', color: '#f97316', label: 'خیلی مهم' },
  { id: 'pink', color: '#ec4899', label: 'فوری و حیاتی' },
  { id: 'none', color: '#6b7280', label: 'بدون برچسب' }
];

export function TasksView({
  tasks,
  categories,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTask,
  onOpenAiPlanner
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTaskDetail, setActiveTaskDetail] = useState(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(null);

  // Listen for open-quick-add event from floating (+) button
  React.useEffect(() => {
    const handleOpenQuickAdd = () => setIsCreatingTask(true);
    window.addEventListener('open-quick-add', handleOpenQuickAdd);
    return () => window.removeEventListener('open-quick-add', handleOpenQuickAdd);
  }, []);

  // Form states for Quick/Full Add
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('personal');
  const [priorityFlag, setPriorityFlag] = useState('green');
  const [scheduleTime, setScheduleTime] = useState('today');
  const [duration, setDuration] = useState('15');
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const jalali = getCurrentJalaliDate();

  // Filter tasks by category
  const filteredTasks = tasks.filter(t => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'none') return !t.category || t.category === 'none';
    return t.category === selectedCategory;
  });

  // Handle task completion with visual effects
  const handleToggle = (task, e) => {
    e?.stopPropagation();
    const newStatus = !task.completed;
    onToggleTask(task.id);

    if (newStatus) {
      audioEngine.playTaskComplete();
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#3ECF8E', '#F59E0B', '#3B82F6']
      });
    } else {
      audioEngine.playClick();
    }
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (isEditingTask) {
      onUpdateTask({
        ...isEditingTask,
        title: title.trim(),
        category,
        priority: priorityFlag,
        duration: parseInt(duration, 10) || 15,
        description,
        subtasks
      });
    } else {
      const newTask = {
        id: 't-' + Date.now(),
        title: title.trim(),
        category,
        priority: priorityFlag,
        schedule: scheduleTime,
        duration: parseInt(duration, 10) || 15,
        description,
        subtasks,
        completed: false,
        date: jalali.dateString,
        time: '۱۲:۰۰',
        createdAt: Date.now()
      };
      onAddTask(newTask);
      audioEngine.playClick();
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setCategory('personal');
    setPriorityFlag('green');
    setScheduleTime('today');
    setDuration('15');
    setDescription('');
    setSubtasks([]);
    setIsCreatingTask(false);
    setIsEditingTask(null);
  };

  const openEditModal = (task) => {
    setIsEditingTask(task);
    setTitle(task.title);
    setCategory(task.category || 'personal');
    setPriorityFlag(task.priority || 'green');
    setDuration(String(task.duration || '15'));
    setDescription(task.description || '');
    setSubtasks(task.subtasks || []);
    setActiveTaskDetail(null);
    setIsCreatingTask(true);
  };

  const addSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([...subtasks, { id: 'st-' + Date.now(), text: newSubtaskText.trim(), completed: false }]);
    setNewSubtaskText('');
  };

  const toggleSubtaskInDetail = (subtaskId) => {
    if (!activeTaskDetail) return;
    const updatedSubtasks = (activeTaskDetail.subtasks || []).map(st =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const updated = { ...activeTaskDetail, subtasks: updatedSubtasks };
    setActiveTaskDetail(updated);
    onUpdateTask(updated);
    audioEngine.playClick();
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : (catId === 'personal' ? 'شخصی' : catId === 'work' ? 'کاری' : catId === 'study' ? 'آموزشی' : 'بدون دسته‌بندی');
  };

  const getFlagColor = (flag) => {
    const f = PRIORITY_FLAGS.find(p => p.id === flag);
    return f ? f.color : '#10b981';
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4">
      {/* Top Title & Quick Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-[#3ECF8E]"></span>
          لیست کارها
        </h1>
        <button
          onClick={onOpenAiPlanner}
          className="text-xs text-[#3ECF8E] bg-[#18231c] border border-[#3ECF8E]/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          برنامه‌ریز هوشمند AI
        </button>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none text-xs">
        <button
          onClick={() => setIsCreatingTask(true)}
          className="w-8 h-8 rounded-xl bg-[#1c1e22] border border-[#2e323b] flex items-center justify-center text-[#9ca3af] hover:text-white shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          همه
        </button>

        <button
          onClick={() => setSelectedCategory('personal')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'personal'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          شخصی
        </button>

        <button
          onClick={() => setSelectedCategory('work')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'work'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          کاری
        </button>

        <button
          onClick={() => setSelectedCategory('study')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'study'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          آموزشی
        </button>

        <button
          onClick={() => setSelectedCategory('none')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'none'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          بدون دسته‌بندی
        </button>
      </div>

      {/* SECTION 1: امروز (Today) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between text-sm font-bold text-white px-1">
          <span>امروز</span>
          <span className="text-xs font-normal text-[#9ca3af]">
            {toPersianDigits(filteredTasks.length)} کار
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div
            onClick={() => setIsCreatingTask(true)}
            className="border-2 border-dashed border-[#2d3139] rounded-2xl p-5 text-center text-[#6b7280] hover:text-[#9ca3af] hover:border-[#3ECF8E]/40 cursor-pointer transition-all bg-[#141518]/50 flex items-center justify-center gap-2 text-sm"
          >
            <span>هیچ کاری برای امروز ثبت نکردی!</span>
            <Plus className="w-4 h-4 text-[#3ECF8E]" />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTasks.map((task) => {
              const flagColor = getFlagColor(task.priority);
              return (
                <div
                  key={task.id}
                  onClick={() => setActiveTaskDetail(task)}
                  className={`group relative flex items-center justify-between bg-[#191a1e] hover:bg-[#202227] border border-[#272a31] rounded-2xl p-3.5 transition-all cursor-pointer shadow-sm overflow-hidden ${
                    task.completed ? 'opacity-60 bg-[#16171a]' : ''
                  }`}
                >
                  {/* Colored vertical bar on right side */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1.5 rounded-r"
                    style={{ backgroundColor: flagColor }}
                  ></div>

                  {/* Right Title and Details */}
                  <div className="pr-3 flex-1 flex flex-col gap-1">
                    <span
                      className={`text-sm font-medium text-white transition-all ${
                        task.completed ? 'line-through text-[#6b7280]' : ''
                      }`}
                    >
                      {task.title}
                    </span>

                    <div className="flex items-center gap-2 text-[11px] text-[#8b929e]">
                      <span className="flex items-center gap-1 bg-[#22242a] px-2 py-0.5 rounded-lg">
                        <Bell className="w-3 h-3 text-[#f59e0b]" />
                        {toPersianDigits(task.time || '۱۲:۰۰')}
                      </span>

                      <span className="flex items-center gap-1 bg-[#22242a] px-2 py-0.5 rounded-lg">
                        <Folder className="w-3 h-3 text-[#3ECF8E]" />
                        {getCategoryName(task.category)}
                      </span>

                      {task.subtasks && task.subtasks.length > 0 && (
                        <span className="flex items-center gap-1 bg-[#22242a] px-2 py-0.5 rounded-lg">
                          <Layers className="w-3 h-3 text-[#3b82f6]" />
                          {toPersianDigits(task.subtasks.filter(s => s.completed).length)}/
                          {toPersianDigits(task.subtasks.length)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Left Squircle Checkmark Box */}
                  <button
                    onClick={(e) => handleToggle(task, e)}
                    className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                      task.completed
                        ? 'bg-[#10b981] border-[#10b981] text-black shadow-md shadow-[#10b981]/30'
                        : 'border-[#3a3e47] bg-[#22242b] hover:border-[#10b981] text-transparent hover:text-[#10b981]/50'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 2: فردا (Tomorrow) */}
      <section className="space-y-2">
        <div className="text-sm font-bold text-white px-1">فردا</div>
        <div
          onClick={() => {
            setScheduleTime('tomorrow');
            setIsCreatingTask(true);
          }}
          className="border-2 border-dashed border-[#282b33] rounded-2xl p-4 text-center text-[#717885] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/40 cursor-pointer transition-all bg-[#141518]/30 flex items-center justify-center gap-2 text-xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>هیچ کاری برای فردا نداری!</span>
        </div>
      </section>

      {/* SECTION 3: پس فردا (Day After Tomorrow) */}
      <section className="space-y-2">
        <div className="text-sm font-bold text-white px-1">پس فردا</div>
        <div
          onClick={() => {
            setScheduleTime('day_after');
            setIsCreatingTask(true);
          }}
          className="border-2 border-dashed border-[#282b33] rounded-2xl p-4 text-center text-[#717885] hover:text-[#3ECF8E] hover:border-[#3ECF8E]/40 cursor-pointer transition-all bg-[#141518]/30 flex items-center justify-center gap-2 text-xs"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>هیچ کاری برای پس فردا نداری!</span>
        </div>
      </section>

      {/* SECTION 4: تا ۷ روز آینده (Next 7 Days) */}
      <section className="space-y-2">
        <div className="text-sm font-bold text-white px-1">تا ۷ روز آینده</div>
        <div className="text-center text-xs text-[#525760] py-2">
          هیچ کاری برای تا ۷ روز آینده نداری!
        </div>
      </section>

      {/* SECTION 5: تا ۳۰ روز آینده (Next 30 Days) */}
      <section className="space-y-2">
        <div className="text-sm font-bold text-white px-1">تا ۳۰ روز آینده</div>
        <div className="text-center text-xs text-[#525760] py-2">
          هیچ کاری برای ۳۰ روز آینده نداری!
        </div>
      </section>

      {/* ========================================================================= */}
      {/* TASK DETAIL BOTTOM SHEET (Matching Lemoni scene_007.jpg) */}
      {/* ========================================================================= */}
      {activeTaskDetail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-5 space-y-4 max-h-[85vh] overflow-y-auto animate-slide-up shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-xl bg-[#23262f] text-[#3ECF8E] font-medium flex items-center gap-1">
                  <Folder className="w-3 h-3" />
                  {getCategoryName(activeTaskDetail.category)}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-xl bg-[#23262f] text-[#f59e0b] font-medium flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  {toPersianDigits(activeTaskDetail.time || '۱۲:۰۰')}
                </span>
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-lg font-bold text-white">
                {activeTaskDetail.title}
              </h2>
              {activeTaskDetail.description && (
                <p className="text-xs text-[#9ca3af] mt-1.5 leading-relaxed">
                  {activeTaskDetail.description}
                </p>
              )}
            </div>

            {/* Subtasks */}
            {activeTaskDetail.subtasks && activeTaskDetail.subtasks.length > 0 && (
              <div className="space-y-2 bg-[#1f2127] p-3 rounded-2xl border border-[#2b2e37]">
                <span className="text-xs font-bold text-[#d1d5db] block">
                  زیرکارها:
                </span>
                <div className="space-y-1.5">
                  {activeTaskDetail.subtasks.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => toggleSubtaskInDetail(st.id)}
                      className="flex items-center gap-2 text-xs text-[#d1d5db] cursor-pointer hover:text-white"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          st.completed
                            ? 'bg-[#10b981] border-[#10b981] text-black'
                            : 'border-[#4b5563] bg-[#2a2d36]'
                        }`}
                      >
                        {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={st.completed ? 'line-through text-[#6b7280]' : ''}>
                        {st.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Action Bar (Matching Lemoni: انجام شد / انجام نشد / ویرایش) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#252830]">
              <button
                onClick={() => {
                  onToggleTask(activeTaskDetail.id);
                  setActiveTaskDetail(null);
                  audioEngine.playTaskComplete();
                }}
                className="py-3 px-2 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#10b981]/20"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                انجام شد
              </button>

              <button
                onClick={() => {
                  onToggleTask(activeTaskDetail.id);
                  setActiveTaskDetail(null);
                  audioEngine.playClick();
                }}
                className="py-3 px-2 rounded-2xl bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] border border-[#ef4444]/30 font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <X className="w-4 h-4" />
                انجام نشد
              </button>

              <button
                onClick={() => openEditModal(activeTaskDetail)}
                className="py-3 px-2 rounded-2xl bg-[#252830] hover:bg-[#2e323c] text-white border border-[#323642] font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <Edit2 className="w-4 h-4 text-[#3ECF8E]" />
                ویرایش
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK / FULL ADD TASK MODAL (Matching Lemoni popup_010.jpg & popup_024.jpg) */}
      {/* ========================================================================= */}
      {isCreatingTask && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3ECF8E]"></span>
                {isEditingTask ? 'ویرایش کار' : 'کار جدید'}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">عنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلا: مطالعه کتاب یا جلسه کاری"
                autoFocus
                className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-3 text-sm text-white placeholder-[#6b7280] outline-none transition-all"
              />
            </div>

            {/* Priority Flag Selector with VIP Crowns */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-[#9ca3af]">برچسب و اولویت:</label>
                <span className="text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                  <Crown className="w-3 h-3" />
                  VIP آنلاک رایگان
                </span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRIORITY_FLAGS.map((flag) => (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => setPriorityFlag(flag.id)}
                    className={`relative w-11 h-10 rounded-xl flex items-center justify-center transition-all ${
                      priorityFlag === flag.id
                        ? 'ring-2 ring-[#3ECF8E] scale-105 shadow-md'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: `${flag.color}25`, border: `1.5px solid ${flag.color}` }}
                  >
                    <Flag className="w-4 h-4" style={{ color: flag.color }} />
                    <Crown className="w-2.5 h-2.5 absolute -bottom-1 -left-1 text-[#f59e0b] fill-[#f59e0b]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Time Pills */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">زمانبندی:</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'today', label: 'امروز' },
                  { id: 'tomorrow', label: 'فردا' },
                  { id: 'day_after', label: 'پس فردا' },
                  { id: 'custom', label: '📅 زمان‌بندی دلخواه' }
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScheduleTime(s.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                      scheduleTime === s.id
                        ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
                        : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration Pills */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">مدت زمان انجام:</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: '15', label: '۱۵ دقیقه' },
                  { id: '30', label: '۳۰ دقیقه' },
                  { id: '45', label: '۴۵ دقیقه' },
                  { id: '60', label: '۱ ساعت' },
                  { id: 'custom', label: '⏱️ دلخواه' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDuration(d.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                      duration === d.id
                        ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
                        : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1.5">دسته‌بندی:</label>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
                {[
                  { id: 'personal', label: 'شخصی' },
                  { id: 'work', label: 'کاری' },
                  { id: 'study', label: 'آموزشی' },
                  { id: 'ariamir', label: 'پروژه‌های ARIAMIR' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`px-3.5 py-2 rounded-xl font-medium shrink-0 transition-all ${
                      category === c.id
                        ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
                        : 'bg-[#202227] text-[#9ca3af] border border-[#2d313a]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtasks (Optional) */}
            <div className="space-y-2">
              <label className="text-xs text-[#9ca3af] block">زیرکارها (اختیاری):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); }}}
                  placeholder="افزودن گام یا زیرکار..."
                  className="flex-1 bg-[#202227] border border-[#2d313a] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#3ECF8E]"
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="px-3 bg-[#2a2d36] hover:bg-[#323642] text-white rounded-xl text-xs font-medium"
                >
                  افزودن
                </button>
              </div>
              {subtasks.length > 0 && (
                <div className="space-y-1 pt-1">
                  {subtasks.map((st, i) => (
                    <div key={st.id || i} className="flex items-center justify-between bg-[#202227] px-3 py-1.5 rounded-xl text-xs text-white">
                      <span>{st.text}</span>
                      <button
                        type="button"
                        onClick={() => setSubtasks(subtasks.filter((_, idx) => idx !== i))}
                        className="text-[#ef4444] hover:text-[#f87171]"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Submit Button (Matching Lemoni: ثبت ->) */}
            <div className="pt-3 border-t border-[#252830]">
              <button
                type="button"
                onClick={handleSaveTask}
                disabled={!title.trim()}
                className="w-full py-3.5 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] disabled:opacity-40 text-black font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-all shadow-lg shadow-[#10b981]/25"
              >
                <span>{isEditingTask ? 'بروزرسانی تغییرات' : 'ثبت کار'}</span>
                <span className="text-base font-bold">←</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
