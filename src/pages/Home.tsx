import { useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { getToday, getDayName } from '@/utils/date';
import { getReviewStageLabel } from '@/utils/ebbinghaus';
import { Check, Circle, RotateCcw } from 'lucide-react';

export default function Home() {
  const today = getToday();
  const todayItems = useAppStore((state) => state.getTodayReviewItems());
  const complete = useAppStore((state) => state.completeReviewTask);
  const skip = useAppStore((state) => state.skipReviewTask);
  const reset = useAppStore((state) => state.resetReviewTask);

  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const handleComplete = (taskId: string) => {
    complete(taskId);
    setCompletedIds((prev) => [...prev, taskId]);
  };

  const handleSkip = (taskId: string) => {
    skip(taskId);
  };

  const handleReset = (taskId: string) => {
    reset(taskId);
    setCompletedIds((prev) => prev.filter((id) => id !== taskId));
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-4 pb-28 pt-8 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] md:text-4xl">
            今日复习
          </h1>
          <p className="mt-2 text-[#6B6B6B]">
            {today} · {getDayName(today)} · 共 {todayItems.length} 项任务
          </p>
        </header>

        {todayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#E8E4DE]">
              <Circle className="h-10 w-10 text-[#9CA3AF]" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1B4332]">
              今天没有待复习内容
            </h2>
            <p className="mt-2 text-[#6B6B6B]">
              去“记录”页新增学习内容，系统会为你安排后续复习计划。
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayItems.map(({ task, studyItem }) => {
              const isCompleted = task.status === 'completed' || completedIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  className={`group relative rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                    isCompleted ? 'border-[#D1D5DB] opacity-70' : 'border-[#E8E4DE]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#1B4332]/10 px-3 py-1 text-xs font-medium text-[#1B4332]">
                          {getReviewStageLabel(task.interval)}
                        </span>
                        {studyItem.tag && (
                          <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs text-[#6B6B6B]">
                            {studyItem.tag}
                          </span>
                        )}
                        <span className="text-xs text-[#9CA3AF]">
                          学习于 {studyItem.studyDate}
                        </span>
                      </div>
                      <p
                        className={`font-serif text-lg leading-relaxed ${
                          isCompleted ? 'text-[#6B6B6B] line-through' : 'text-[#1F2937]'
                        }`}
                      >
                        {studyItem.content}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {isCompleted ? (
                        <button
                          onClick={() => handleReset(task.id)}
                          className="flex items-center gap-1 rounded-xl bg-[#F3F4F6] px-3 py-2 text-xs font-medium text-[#6B6B6B] transition hover:bg-[#E8E4DE]"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          撤销
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleComplete(task.id)}
                            className="flex items-center gap-1 rounded-xl bg-[#1B4332] px-4 py-2 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-[#143728] hover:shadow-md"
                          >
                            <Check className="h-4 w-4" />
                            完成
                          </button>
                          <button
                            onClick={() => handleSkip(task.id)}
                            className="flex items-center gap-1 rounded-xl bg-[#F3F4F6] px-4 py-2 text-sm font-medium text-[#6B6B6B] transition hover:bg-[#E8E4DE]"
                          >
                            跳过
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
