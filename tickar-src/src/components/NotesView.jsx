import React, { useState } from 'react';
import { toPersianDigits, getCurrentJalaliDate } from '../utils/jalali';
import { audioEngine } from '../utils/audioEngine';
import {
  Search,
  Plus,
  Clock,
  Trash2,
  Check,
  X,
  FileText
} from 'lucide-react';

export function NotesView({ notes, onAddNote, onUpdateNote, onDeleteNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('none');

  const jalali = getCurrentJalaliDate();

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'none' && (!n.category || n.category === 'none')) ||
      n.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = (e) => {
    e?.preventDefault();
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      onUpdateNote({
        ...editingNote,
        title: title.trim() || 'یادداشت جدید',
        content: content.trim(),
        category
      });
    } else {
      const newNote = {
        id: 'n-' + Date.now(),
        title: title.trim() || 'یادداشت جدید',
        content: content.trim(),
        category,
        date: jalali.dateString,
        time: `${toPersianDigits(new Date().getHours())}:${toPersianDigits(new Date().getMinutes())}`,
        createdAt: Date.now()
      };
      onAddNote(newNote);
    }

    audioEngine.playClick();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('none');
    setIsCreatingNote(false);
    setEditingNote(null);
  };

  const openEdit = (n) => {
    setEditingNote(n);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category || 'none');
    setIsCreatingNote(true);
  };

  return (
    <div className="pb-28 px-4 pt-3 max-w-md mx-auto space-y-4 select-none">
      {/* Title (Matching Lemoni sec3_020.jpg: یادداشت‌ها) */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-[#3ECF8E]"></span>
          یادداشت‌ها
        </h1>
        <button
          onClick={() => setIsCreatingNote(true)}
          className="text-xs text-black font-bold bg-[#10b981] hover:bg-[#0ea372] px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-md shadow-[#10b981]/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          یادداشت جدید
        </button>
      </div>

      {/* Filter Category Pills (Matching Lemoni sec3_020.jpg) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setIsCreatingNote(true)}
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
          onClick={() => setSelectedCategory('none')}
          className={`px-3.5 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
            selectedCategory === 'none'
              ? 'bg-[#10b981] text-black font-bold shadow-md shadow-[#10b981]/20'
              : 'bg-[#1c1e22] text-[#9ca3af] hover:text-white border border-[#2a2d33]'
          }`}
        >
          بدون دسته‌بندی
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
      </div>

      {/* Search Input (Matching Lemoni sec3_020.jpg) */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="جستجو"
          className="w-full bg-[#191a1e] border border-[#272a31] focus:border-[#3ECF8E] rounded-2xl py-2.5 pr-10 pl-4 text-xs text-white placeholder-[#6b7280] outline-none transition-all"
        />
        <Search className="w-4 h-4 text-[#8b929e] absolute right-3.5 top-3" />
      </div>

      {/* Notes List (Matching Lemoni sec3_020.jpg) */}
      <div className="space-y-3">
        {filteredNotes.map((n) => (
          <div
            key={n.id}
            onClick={() => openEdit(n)}
            className="bg-[#191a1e] hover:bg-[#202227] border border-[#272a31] rounded-3xl p-4.5 space-y-2 cursor-pointer transition-all shadow-md group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white group-hover:text-[#3ECF8E] transition-colors">
                {n.title}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8b929e]">
                <Clock className="w-3.5 h-3.5 text-[#3ECF8E]" />
                <span>{toPersianDigits(n.date)} {n.time}</span>
              </div>
            </div>

            <p className="text-xs text-[#d1d5db] leading-relaxed line-clamp-3">
              {n.content}
            </p>
          </div>
        ))}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 text-[#6b7280] space-y-2">
            <FileText className="w-8 h-8 mx-auto text-[#4b5563]" />
            <p className="text-xs">یادداشتی وجود ندارد.</p>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* NOTE COMPOSER / EDIT MODAL */}
      {/* ========================================================================= */}
      {isCreatingNote && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#18191d] rounded-t-3xl border-t border-[#2d3139] p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#252830]">
              <h2 className="text-base font-bold text-white">
                {editingNote ? 'ویرایش یادداشت' : 'یادداشت جدید'}
              </h2>
              <button
                onClick={resetForm}
                className="w-8 h-8 rounded-full bg-[#23262f] text-[#9ca3af] hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1">عنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="عنوان یادداشت..."
                className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl px-4 py-2.5 text-sm text-white placeholder-[#6b7280] outline-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="text-xs text-[#9ca3af] block mb-1">متن یادداشت</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="متن یادداشت را اینجا بنویسید..."
                rows={6}
                className="w-full bg-[#202227] border border-[#2d313a] focus:border-[#3ECF8E] rounded-2xl p-3 text-xs text-white placeholder-[#6b7280] outline-none leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-[#252830]">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3 rounded-2xl bg-[#10b981] hover:bg-[#0ea372] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#10b981]/25"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                ذخیره یادداشت
              </button>

              {editingNote && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteNote(editingNote.id);
                    resetForm();
                  }}
                  className="p-3 rounded-2xl bg-[#ef4444]/15 hover:bg-[#ef4444]/25 text-[#ef4444] border border-[#ef4444]/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
