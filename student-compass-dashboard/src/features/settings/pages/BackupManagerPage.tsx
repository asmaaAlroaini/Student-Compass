import { useState } from 'react';
import {
  Database,
  Download,
  Trash2,
  HardDrive,
  Clock,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';

interface BackupRecord {
  id: string;
  filename: string;
  type: 'database' | 'media';
  size: string;
  created_at: string;
}

const mockBackups: BackupRecord[] = [
  {
    id: '1',
    filename: 'student_compass_db_2026_08_30.sql.gz',
    type: 'database',
    size: '14.2 MB',
    created_at: '2026-08-30 04:00:00',
  },
  {
    id: '2',
    filename: 'media_attachments_2026_08_28.zip',
    type: 'media',
    size: '86.5 MB',
    created_at: '2026-08-28 04:00:00',
  },
  {
    id: '3',
    filename: 'student_compass_db_2026_08_23.sql.gz',
    type: 'database',
    size: '13.8 MB',
    created_at: '2026-08-23 04:00:00',
  },
];

export default function BackupManagerPage() {
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBackup = async (type: 'database' | 'media') => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newBackup: BackupRecord = {
      id: String(Date.now()),
      filename: `student_compass_${type}_${new Date().toISOString().slice(0, 10)}.sql.gz`,
      type,
      size: type === 'database' ? '14.5 MB' : '92.1 MB',
      created_at: new Date().toLocaleString('ar-EG'),
    };
    setBackups((prev) => [newBackup, ...prev]);
    setIsGenerating(false);
    toast.success('تم إنشاء وتجهيز النسخة الاحتياطية بنجاح 💾');
  };

  const handleDelete = (id: string) => {
    setBackups((prev) => prev.filter((b) => b.id !== id));
    toast.info('تم حذف ملف النسخة الاحتياطية.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Database className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-black text-white tracking-tight">إدارة النسخ الاحتياطي وقواعد البيانات</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
              Disaster Recovery
            </span>
          </div>
          <p className="text-sm text-slate-400">
            أخذ نسخ احتياطية فورية من بيانات النظام، وحفظ ملفات ومرفقات الدروس وبنك الأسئلة.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleGenerateBackup('database')}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            نسخ قاعدة البيانات الآن
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-white">114.5 MB</div>
            <div className="text-[11px] text-slate-400">إجمالي حجم النسخ المحفوظة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-white">يومياً (04:00 AM)</div>
            <div className="text-[11px] text-slate-400">الجدولة التلقائية النشطة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-300">مؤمن ومشفر</div>
            <div className="text-[11px] text-slate-400">حالة التخزين السحابي</div>
          </div>
        </div>
      </div>

      {/* ── Backups List ── */}
      <div className="rounded-3xl bg-[#0c142b] border border-white/[0.07] overflow-hidden space-y-4">
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            سجل النسخ الاحتياطية المتوفرة للتحميل والاستعادة
          </h2>
          <span className="text-xs text-slate-500">{backups.length} ملف محفوظ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#090f20] border-b border-white/[0.05]">
              <tr>
                <th className="px-5 py-3.5 text-slate-400 font-bold">اسم الملف</th>
                <th className="px-5 py-3.5 text-slate-400 font-bold">النوع</th>
                <th className="px-5 py-3.5 text-slate-400 font-bold">الحجم</th>
                <th className="px-5 py-3.5 text-slate-400 font-bold">تاريخ الإنشاء</th>
                <th className="px-5 py-3.5 text-slate-400 font-bold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-white" dir="ltr">
                    {b.filename}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        b.type === 'database'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/20'
                      }`}
                    >
                      {b.type === 'database' ? 'قاعدة بيانات SQL' : 'ملفات ومرفقات'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300 font-semibold">{b.size}</td>
                  <td className="px-5 py-3.5 text-slate-400 font-mono">{b.created_at}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toast.success(`جاري تنزيل ملف ${b.filename}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
                        title="تحميل الملف"
                      >
                        <Download className="w-3.5 h-3.5" />
                        تحميل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                        title="حذف النسخة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
