import type { StudyItem, ReviewTask } from '@/types';
import { addDays } from './date';

export const INTERVALS = [1, 2, 4, 7, 15, 30];

export function generateReviewTasks(studyItem: StudyItem): ReviewTask[] {
  return INTERVALS.map((interval) => ({
    id: `${studyItem.id}-${interval}`,
    studyItemId: studyItem.id,
    reviewDate: addDays(studyItem.studyDate, interval),
    interval,
    status: 'pending' as const,
  }));
}

export function getReviewStageLabel(interval: number): string {
  const labels: Record<number, string> = {
    1: '第 1 次复习',
    2: '第 2 次复习',
    4: '第 3 次复习',
    7: '第 4 次复习',
    15: '第 5 次复习',
    30: '第 6 次复习',
  };
  return labels[interval] || `第 ${interval} 天复习`;
}

export function getTaskStatusText(status: ReviewTask['status']): string {
  const map = {
    pending: '待复习',
    completed: '已完成',
    skipped: '已跳过',
  };
  return map[status];
}
