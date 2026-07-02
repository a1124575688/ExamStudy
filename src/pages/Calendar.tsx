import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { getMonthDays, getFirstDayOfMonth, getToday, parseDate } from '@/utils/date';
import { getReviewStageLabel, getTaskStatusText } from '@/utils/ebbinghaus';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

export default function Calendar() {
  const today = getToday();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const getTasksForMonth = useAppStore((state) => state.getTasksForMonth);
  const getTasksByDate = useAppStore((state) => state.getTasksByDate);

  const daysInMonth = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const counts = getTasksForMonth(year, month);

  const selectedTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthLabel = `${year}年${month + 1}月`;
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const isToday = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === today;
  };

  const isSelected = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dateStr === selectedDate;
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-4 pb-28 pt-8 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] md:text-4xl">
            复习日历
          </h1>
          <p className="mt-2 text-[#6B6B6B]">查看每一天的复习任务分布</p>
        </header>

        <div className="rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={handlePrevMonth}
              className="rounded-xl p-2 text-[#6B6B6B] transition hover:bg-[#F3F4F6]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="font-serif text-lg font-semibold text-[#1B4332]">
              {monthLabel}
            </h2>
            <button
              onClick={handleNextMonth}
              className="rounded-xl p-2 text-[#6B6B6B] transition hover:bg-[#F3F4F6]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-sm text-[#6B6B6B]">
            {weekDays.map((day) => (
              <div key={day} className="py-2 font-medium">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
              const dayKey = String(day).padStart(2, '0');
              const count = counts[dayKey] || 0;
              const selected = isSelected(day);
              const todayMark = isToday(day);
              return (
                <button
                  key={day}
                  onClick={() =>
                    setSelectedDate(
                      `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    )
                  }
                  className={`relative aspect-square rounded-xl p-2 text-sm transition ${
                    selected
                      ? 'bg-[#1B4332] text-white shadow-md'
                      : todayMark
                        ? 'bg-[#D97706]/10 text-[#D97706]'
                        : 'text-[#1F2937] hover:bg-[#F3F4F6]'
                  }`}
                >
                  <span className="font-medium">{day}</span>
                  {count > 0 && (
                    <span
                      className={`absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        selected ? 'bg-white text-[#1B4332]' : 'bg-[#D97706] text-white'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E8E4DE] bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-serif text-lg font-semibold text-[#1B4332]">
            {selectedDate ? `${selectedDate} 的复习任务` : '选择一天查看详情'}
          </h3>
          {selectedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Circle className="mb-3 h-10 w-10 text-[#9CA3AF]" />
              <p className="text-[#6B6B6B]">这一天没有复习任务</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedTasks.map(({ task, studyItem }) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[#E8E4DE] p-4"
                >
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="rounded-full bg-[#1B4332]/10 px-2.5 py-0.5 text-xs font-medium text-[#1B4332]">
                        {getReviewStageLabel(task.interval)}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : task.status === 'skipped'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {getTaskStatusText(task.status)}
                      </span>
                    </div>
                    <p className="font-serif text-[#1F2937]">{studyItem.content}</p>
                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      学习于 {studyItem.studyDate}
                      {studyItem.tag && ` · ${studyItem.tag}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
