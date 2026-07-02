import { useState, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Download, Upload, AlertCircle, Check } from 'lucide-react';
import type { AppData } from '@/types';

export default function Backup() {
  const exportData = useAppStore((state) => state.exportData);
  const importData = useAppStore((state) => state.importData);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ebbinghaus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: '数据已导出到本地文件' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text) as AppData;
        if (!Array.isArray(parsed.studyItems) || !Array.isArray(parsed.reviewTasks)) {
          throw new Error('文件格式不正确');
        }
        importData(parsed);
        setMessage({ type: 'success', text: '数据导入成功' });
      } catch (error) {
        setMessage({ type: 'error', text: `导入失败：${error instanceof Error ? error.message : '未知错误'}` });
      } finally {
        if (inputRef.current) inputRef.current.value = '';
        setTimeout(() => setMessage(null), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] px-4 pb-28 pt-8 md:pt-24">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#1B4332] md:text-4xl">
            数据备份
          </h1>
          <p className="mt-2 text-[#6B6B6B]">导出学习记录到本地，或从文件恢复</p>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B4332]/10">
              <Download className="h-6 w-6 text-[#1B4332]" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1B4332]">导出数据</h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              将当前所有学习记录和复习状态导出为 JSON 文件，便于备份或迁移到其他设备。
            </p>
            <button
              onClick={handleExport}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#1B4332] px-5 py-2.5 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-[#143728] hover:shadow-md"
            >
              <Download className="h-4 w-4" />
              导出 JSON
            </button>
          </div>

          <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#D97706]/10">
              <Upload className="h-6 w-6 text-[#D97706]" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#1B4332]">导入数据</h2>
            <p className="mt-2 text-sm text-[#6B6B6B]">
              选择之前导出的 JSON 文件恢复数据。注意：导入会覆盖当前所有数据。
            </p>
            <input
              ref={inputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="mt-5 flex items-center gap-2 rounded-xl bg-[#D97706] px-5 py-2.5 text-sm font-medium text-white shadow transition hover:-translate-y-0.5 hover:bg-[#B45309] hover:shadow-md"
            >
              <Upload className="h-4 w-4" />
              选择文件导入
            </button>
          </div>

          {message && (
            <div
              className={`flex items-center gap-2 rounded-xl border p-4 ${
                message.type === 'success'
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
