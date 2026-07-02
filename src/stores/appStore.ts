import { create } from 'zustand';
import type { StudyItem, ReviewTask, AppData, ReviewStatus } from '@/types';
import { generateReviewTasks } from '@/utils/ebbinghaus';
import { getToday } from '@/utils/date';
import { loadFromGitHub, saveToGitHub, getFileSha } from '@/utils/githubSync';

const STORAGE_KEY = 'ebbinghaus-study-data';
const SYNC_KEY = 'ebbinghaus-last-sync';

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

interface AppState extends AppData {
  syncStatus: 'idle' | 'loading' | 'saving' | 'error';
  syncError: string | null;
  lastSyncAt: string | null;
  addStudyItem: (item: Omit<StudyItem, 'id' | 'createdAt'>) => void;
  updateStudyItem: (id: string, item: Omit<StudyItem, 'id' | 'createdAt'>) => void;
  deleteStudyItem: (id: string) => void;
  completeReviewTask: (taskId: string) => void;
  skipReviewTask: (taskId: string) => void;
  resetReviewTask: (taskId: string) => void;
  exportData: () => AppData;
  importData: (data: AppData) => void;
  syncFromGitHub: () => Promise<void>;
  syncToGitHub: () => Promise<void>;
  getTodayReviewItems: () => Array<{ task: ReviewTask; studyItem: StudyItem }>;
  getTasksByDate: (date: string) => Array<{ task: ReviewTask; studyItem: StudyItem }>;
  getTasksForMonth: (year: number, month: number) => Record<string, number>;
}

function loadLocalData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppData;
      return {
        studyItems: parsed.studyItems || [],
        reviewTasks: parsed.reviewTasks || [],
      };
    }
  } catch (error) {
    console.error('Failed to load data from localStorage:', error);
  }
  return { studyItems: [], reviewTasks: [] };
}

function loadLastSyncAt(): string | null {
  try {
    return localStorage.getItem(SYNC_KEY);
  } catch {
    return null;
  }
}

export const useAppStore = create<AppState>((set, get) => {
  const initialData = loadLocalData();

  const persist = (next: AppData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  };

  const getStudyItem = (id: string) => {
    return get().studyItems.find((item) => item.id === id);
  };

  const makeReviewItems = (tasks: ReviewTask[]) => {
    return tasks
      .map((task) => {
        const studyItem = getStudyItem(task.studyItemId);
        return studyItem ? { task, studyItem } : null;
      })
      .filter(Boolean) as Array<{ task: ReviewTask; studyItem: StudyItem }>;
  };

  const syncToGitHub = async () => {
    const data = { studyItems: get().studyItems, reviewTasks: get().reviewTasks };
    try {
      const sha = await getFileSha();
      await saveToGitHub(data, sha || undefined);
      const now = new Date().toISOString();
      localStorage.setItem(SYNC_KEY, now);
      set({ syncStatus: 'idle', syncError: null, lastSyncAt: now });
    } catch (error) {
      console.error('Failed to sync to GitHub:', error);
      set({ syncStatus: 'error', syncError: (error as Error).message });
    }
  };

  return {
    ...initialData,
    syncStatus: 'idle',
    syncError: null,
    lastSyncAt: loadLastSyncAt(),

    addStudyItem: (item) => {
      const newItem: StudyItem = {
        ...item,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      const newTasks = generateReviewTasks(newItem);
      set((state) => {
        const next = {
          studyItems: [...state.studyItems, newItem],
          reviewTasks: [...state.reviewTasks, ...newTasks],
        };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    updateStudyItem: (id, item) => {
      set((state) => {
        const studyItems = state.studyItems.map((si) =>
          si.id === id ? { ...si, ...item } : si
        );
        const target = studyItems.find((si) => si.id === id);
        const reviewTasks = target
          ? state.reviewTasks.map((task) => {
              if (task.studyItemId !== id) return task;
              const interval = task.interval;
              const baseDate = new Date(target.studyDate + 'T00:00:00');
              baseDate.setDate(baseDate.getDate() + interval);
              const year = baseDate.getFullYear();
              const month = String(baseDate.getMonth() + 1).padStart(2, '0');
              const day = String(baseDate.getDate()).padStart(2, '0');
              const reviewDate = `${year}-${month}-${day}`;
              return { ...task, reviewDate };
            })
          : state.reviewTasks;
        const next = { studyItems, reviewTasks };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    deleteStudyItem: (id) => {
      set((state) => {
        const next = {
          studyItems: state.studyItems.filter((si) => si.id !== id),
          reviewTasks: state.reviewTasks.filter((rt) => rt.studyItemId !== id),
        };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    completeReviewTask: (taskId) => {
      set((state) => {
        const reviewTasks = state.reviewTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: 'completed' as ReviewStatus, completedAt: new Date().toISOString() }
            : task
        );
        const next = { ...state, reviewTasks };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    skipReviewTask: (taskId) => {
      set((state) => {
        const reviewTasks = state.reviewTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'skipped' as ReviewStatus } : task
        );
        const next = { ...state, reviewTasks };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    resetReviewTask: (taskId) => {
      set((state) => {
        const reviewTasks = state.reviewTasks.map((task) =>
          task.id === taskId
            ? { ...task, status: 'pending' as ReviewStatus, completedAt: undefined }
            : task
        );
        const next = { ...state, reviewTasks };
        persist(next);
        return next;
      });
      syncToGitHub();
    },

    exportData: () => {
      return { studyItems: get().studyItems, reviewTasks: get().reviewTasks };
    },

    importData: (data) => {
      const next = {
        studyItems: data.studyItems || [],
        reviewTasks: data.reviewTasks || [],
      };
      set(next);
      persist(next);
      syncToGitHub();
    },

    syncFromGitHub: async () => {
      set({ syncStatus: 'loading', syncError: null });
      try {
        const remote = await loadFromGitHub();
        if (remote) {
          const next = {
            studyItems: remote.studyItems || [],
            reviewTasks: remote.reviewTasks || [],
          };
          set(next);
          persist(next);
        }
        const now = new Date().toISOString();
        localStorage.setItem(SYNC_KEY, now);
        set({ syncStatus: 'idle', syncError: null, lastSyncAt: now });
      } catch (error) {
        console.error('Failed to sync from GitHub:', error);
        set({ syncStatus: 'error', syncError: (error as Error).message });
      }
    },

    syncToGitHub: async () => {
      set({ syncStatus: 'saving', syncError: null });
      await syncToGitHub();
    },

    getTodayReviewItems: () => {
      const today = getToday();
      const tasks = get().reviewTasks.filter(
        (task) => task.reviewDate === today && task.status === 'pending'
      );
      return makeReviewItems(tasks);
    },

    getTasksByDate: (date) => {
      const tasks = get().reviewTasks.filter((task) => task.reviewDate === date);
      return makeReviewItems(tasks);
    },

    getTasksForMonth: (year, month) => {
      const counts: Record<string, number> = {};
      get().reviewTasks.forEach((task) => {
        const date = new Date(task.reviewDate + 'T00:00:00');
        if (date.getFullYear() === year && date.getMonth() === month) {
          const day = String(date.getDate()).padStart(2, '0');
          counts[day] = (counts[day] || 0) + 1;
        }
      });
      return counts;
    },
  };
});

// 应用启动时自动从 GitHub 拉取数据
setTimeout(() => {
  useAppStore.getState().syncFromGitHub();
}, 0);
