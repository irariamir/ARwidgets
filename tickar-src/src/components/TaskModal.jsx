import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Flag, 
  Plus, 
  Trash2, 
  Check, 
  Repeat, 
  Sparkles,
  Layers
} from 'lucide-react';
import { getCurrentJalaliDate, toPersianDigits, PERSIAN_MONTH_NAMES } from '../utils/jalali';

export function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTask = null, 
  categories = [] 
}) {
  const currentJalali = getCurrentJalaliDate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('ariamir');
  const [priority, setPriority] = useState('medium'); // urgent, high, medium, low
  const [matrixQuadrant, setMatrixQuadrant] = useState('do_first'); // do_first, schedule, delegate, eliminate
  const [date, setDate] = useState(currentJalali.dateString);
  const [time, setTime] = useState('10:00');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  const [recurrence, setRecurrence] = useState('none'); // none, daily, weekly, monthly
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskText, setNewSubtaskText] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDescription(initialTask.description || '');
      setCategory(initialTask.category || 'ariamir');
      setPriority(initialTask.priority || 'medium');
      setMatrixQuadrant(initialTask.matrixQuadrant || 'do_first');
      setDate(initialTask.date || currentJalali.dateString);
      setTime(initialTask.time || '10:00');
      setEstimatedPomodoros(initialTask.estimatedPomodoros || 2);
      setRecurrence(initialTask.recurrence || 'none');
      setSubtasks(initialTask.subtasks ? [...initialTask.subtasks] : []);
    } else {
      setTitle('');
      setDescription('');
      setCategory('ariamir');
      setPriority('medium');
      setMatrixQuadrant('do_first');
      setDate(currentJalali.dateString);
      setTime('10:00');
      setEstimatedPomodoros(2);
      setRecurrence('none');
      setSubtasks([]);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'st-' + Date.now(), text: newSubtaskText.trim(), completed: false }
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map((st) => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData = {
      id: initialTask ? initialTask.id : 't-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      matrixQuadrant,
      date,
      time,
      estimatedPomodoros: Number(estimatedPomodoros),
      completedPomodoros: initialTask ? initialTask.completedPomodoros || 0 : 0,
      completed: initialTask ? initialTask.completed : false,
      subtasks,
      recurrence
    };

    onSave(taskData);
    onClose();
  };

  const priorities = [
    { id: 'urgent', label: 'فوری و حیاتی', color: '#E54D2D', border: 'border-[#E54D2D]' },
    { id: 'high', label: 'اولویت بالا', color: '#DA8D00', border: 'border-[#DA8D00]' },
    { id: 'medium', label: 'متوسط', color: '#3ECF8E', border: 'border-[#3ECF8E]' },
    { id: 'low', label: 'پایین', color: '#79C0FF', border: 'border-[#79C0FF]' }
  ];

  const quadrants = [
    { id: 'do_first', label: 'فوری و مهم (انجام فوری)' },
    { id: 'schedule', label: 'مهم، غیرفوری (برنامه‌ریزی)' },
    { id: 'delegate', label: 'فوری، غیرمهم (واگذاری)' },
    { id: 'eliminate', label: 'نه مهم، نه فوری (حذف)' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg my-8 bg-[#121212] border border-[#2E2E2E] rounded-3xl p-6 shadow-2xl text-right">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#2E2E2E]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E]" />
            <h3 className="font-heading font-bold text-lg text-[#FAFAFA]">
              {initialTask ? 'ویرایش وظیفه' : 'تعریف وظیفه جدید'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#898989] hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#898989] mb-1.5">عنوان وظیفه *</label>
            <input 
              type="text"
              required
              placeholder="مثال: تکمیل ماژول پردازش داده شرکت ARIAMIR"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] text-white text-sm outline-none transition-all placeholder:text-[#525252]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-[#898989] mb-1.5">توضیحات و یادداشت</label>
            <textarea 
              rows={2}
              placeholder="نکات کلیدی یا جزییات تسک..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] focus:ring-1 focus:ring-[#3ECF8E] text-white text-xs outline-none transition-all placeholder:text-[#525252] resize-none"
            />
          </div>

          {/* Category & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-[#898989] mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#3ECF8E]" />
                دسته‌بندی
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Recurrence */}
            <div>
              <label className="block text-xs font-semibold text-[#898989] mb-1.5 flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-[#7965FF]" />
                تکرار دوره‌ای
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none"
              >
                <option value="none">بدون تکرار (یکباره)</option>
                <option value="daily">روزانه (هر روز)</option>
                <option value="weekly">هفتگی (یک روز در هفته)</option>
                <option value="monthly">ماهانه</option>
              </select>
            </div>

          </div>

          {/* Priority Pills */}
          <div>
            <label className="block text-xs font-semibold text-[#898989] mb-1.5 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-[#DA8D00]" />
              سطح اولویت
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPriority(p.id)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                    priority === p.id 
                      ? `${p.border} bg-white/10 text-white shadow-sm` 
                      : 'border-[#2E2E2E] bg-[#171717] text-[#898989] hover:text-white'
                  }`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Eisenhower Quadrant */}
          <div>
            <label className="block text-xs font-semibold text-[#898989] mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#79C0FF]" />
              ماتریس آیزنهاور (مدیریت زمان استراتژیک)
            </label>
            <select
              value={matrixQuadrant}
              onChange={(e) => setMatrixQuadrant(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] focus:border-[#3ECF8E] text-white text-xs outline-none"
            >
              {quadrants.map((q) => (
                <option key={q.id} value={q.id}>{q.label}</option>
              ))}
            </select>
          </div>

          {/* Date, Time & Pomodoro Estimate */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#898989] mb-1">تاریخ شمسی</label>
              <input 
                type="text"
                placeholder="1403/07/01"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] text-white text-xs text-center font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#898989] mb-1">ساعت یادآور</label>
              <input 
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] text-white text-xs text-center font-mono outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#898989] mb-1">تخمین پومودورو</label>
              <input 
                type="number"
                min="1"
                max="20"
                value={estimatedPomodoros}
                onChange={(e) => setEstimatedPomodoros(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-[#171717] border border-[#2E2E2E] text-white text-xs text-center font-mono outline-none"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-2 border-t border-[#2E2E2E]">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-[#898989]">چک‌لیست زیروظایف (Subtasks)</label>
              <span className="text-[11px] text-[#3ECF8E] font-mono">
                {toPersianDigits(subtasks.filter(s => s.completed).length)}/{toPersianDigits(subtasks.length)}
              </span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#171717] border border-[#242424]">
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(st.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        st.completed ? 'bg-[#3ECF8E] border-[#3ECF8E] text-black' : 'border-[#4A4A4A]'
                      }`}
                    >
                      {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <span className={`text-xs truncate ${st.completed ? 'line-through text-[#898989]' : 'text-[#FAFAFA]'}`}>
                      {st.text}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(st.id)}
                    className="text-[#898989] hover:text-[#E54D2D] p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex gap-2 mt-2">
              <input 
                type="text"
                placeholder="مرحله یا زیروظیفه جدید..."
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="flex-1 px-3 py-1.5 rounded-lg bg-[#171717] border border-[#2E2E2E] text-white text-xs outline-none placeholder:text-[#525252]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 rounded-lg bg-[#005936] hover:bg-[#006239] text-[#3ECF8E] text-xs font-bold transition-all"
              >
                افزودن
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#2E2E2E]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1C1C1C] hover:bg-[#242424] text-[#B4B4B4] text-xs font-semibold transition-all"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#005936] to-[#00C472] hover:brightness-110 text-black font-bold text-xs shadow-lg shadow-[#3ECF8E]/20 transition-all"
            >
              {initialTask ? 'ذخیره تغییرات' : 'ثبت وظیفه'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
