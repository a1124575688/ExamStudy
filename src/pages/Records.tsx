import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { getToday } from '@/utils/date';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import type { StudyItem } from '@/types';

interface FormState {
  content: string;
  studyDate: string;
  tag: string;
}

const emptyForm: FormState = {
  content: '',
  studyDate: getToday(),
  tag: '',
};

export default function Records() {
  const studyItems = useAppStore((state) => state.studyItems);
  const addStudyItem = useAppStore((state) => state.addStudyItem);
  const updateStudyItem = useAppStore((state) => state.updateStudyItem);
  const deleteStudyItem = useAppStore((state) => state.deleteStudyItem);

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const sortedItems = [...studyItems].sort(
    (a, b) => new Date(b.studyDate).getTime() - new Date(a.studyDate).getTime()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.content.trim()) return;
    addStudyItem({
      content: form.content.trim(),
      studyDate: form.studyDate,
      tag: form.tag.trim(),
    });
    setForm(emptyForm);
    setIsAdding(false);
  };

  const handleEditStart = (item: StudyItem) => {
    setEditingId(item.id);
    setEditForm({
      content: item.content,
      studyDate: item.studyDate,
      tag: item.tag,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editForm.content.trim()) return;
    updateStudyItem(editingId, {
      content: editForm.content.trim(),
      studyDate: editForm.studyDate,
      tag: editForm.tag.trim(),
    });
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条学习记录吗？对应的复习任务也会一并删除。')) {
      deleteStudyItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-4 pb-28 pt-8 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#1B4332] md:text-4xl">
              学习记录
            </h1>
            <p className="mt-2 text-[#6B6B6B]">记录每天的学习内容，自动生成复习计划</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 rounded-xl bg-[#1B4332] px-4 py-2.5 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-[#143728] hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            新增
          </button>
        </header>

        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#4A4A4A]">
                  学习内容
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="今天学了什么？"
                  className="w-full resize-none rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
                  rows={3}
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#4A4A4A]">
                    学习日期
                  </label>
                  <input
                    type="date"
                    value={form.studyDate}
                    onChange={(e) => setForm({ ...form, studyDate: e.target.value })}
                    className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#4A4A4A]">
                    标签
                  </label>
                  <input
                    type="text"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="如：英语、数学"
                    className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setForm(emptyForm);
                  }}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-[#6B6B6B] transition hover:bg-[#F3F4F6]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={!form.content.trim()}
                  className="rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-[#143728] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  保存
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {sortedItems.length === 0 ? (
            <div className="rounded-3xl bg-white py-16 text-center shadow-sm">
              <p className="text-[#6B6B6B]">还没有学习记录，点击右上角新增一条吧。</p>
            </div>
          ) : (
            sortedItems.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {editingId === item.id ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <textarea
                      value={editForm.content}
                      onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      className="w-full resize-none rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none focus:border-[#1B4332]"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        value={editForm.studyDate}
                        onChange={(e) => setEditForm({ ...editForm, studyDate: e.target.value })}
                        className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none focus:border-[#1B4332]"
                      />
                      <input
                        type="text"
                        value={editForm.tag}
                        onChange={(e) => setEditForm({ ...editForm, tag: e.target.value })}
                        placeholder="标签"
                        className="w-full rounded-xl border border-[#E8E4DE] bg-[#FAFAF8] p-3 text-sm outline-none focus:border-[#1B4332]"
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="rounded-xl px-3 py-2 text-sm text-[#6B6B6B] hover:bg-[#F3F4F6]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        type="submit"
                        className="rounded-xl bg-[#1B4332] px-3 py-2 text-sm text-white hover:bg-[#143728]"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-[#9CA3AF]">{item.studyDate}</span>
                        {item.tag && (
                          <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#6B6B6B]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-lg leading-relaxed text-[#1F2937]">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStart(item)}
                        className="rounded-xl p-2 text-[#6B6B6B] transition hover:bg-[#F3F4F6]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded-xl p-2 text-[#EF4444] transition hover:bg-[#FEE2E2]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
