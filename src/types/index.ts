export type ReviewStatus = 'pending' | 'completed' | 'skipped';

export interface StudyItem {
  id: string;
  content: string;
  studyDate: string;
  tag: string;
  createdAt: string;
}

export interface ReviewTask {
  id: string;
  studyItemId: string;
  reviewDate: string;
  interval: number;
  status: ReviewStatus;
  completedAt?: string;
}

export interface AppData {
  studyItems: StudyItem[];
  reviewTasks: ReviewTask[];
}

export interface TodayReviewItem {
  task: ReviewTask;
  studyItem: StudyItem;
}
