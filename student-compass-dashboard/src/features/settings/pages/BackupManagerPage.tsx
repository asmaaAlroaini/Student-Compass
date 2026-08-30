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
            <Database className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-black text-foreground tracking-tight">إدارة النسخ الاحتياطي وقواعد البيانات</h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Disaster Recovery
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            أخذ نسخ احتياطية فورية من بيانات النظام، وحفظ ملفات ومرفقات الدروس وبنك الأسئلة.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleGenerateBackup('database')}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-60 text-primary-foreground text-xs font-bold transition shadow-lg shadow-primary/20 cursor-pointer"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            نسخ قاعدة البيانات الآن
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-foreground">114.5 MB</div>
            <div className="text-xs text-muted-foreground">إجمالي حجم النسخ المحفوظة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-foreground">يومياً (04:00 AM)</div>
            <div className="text-xs text-muted-foreground">الجدولة التلقائية النشطة</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border text-card-foreground flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">مؤمن ومشفر</div>
            <div className="text-xs text-muted-foreground">حالة التخزين السحابي</div>
          </div>
        </div>
      </div>

      {/* ── Backups List ── */}
      <div className="rounded-3xl bg-card text-card-foreground border border-border overflow-hidden space-y-4 shadow-sm">
        <div className="p-5 border-b border-border/60 flex items-center justify-between bg-muted/20">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            سجل النسخ الاحتياطية المتوفرة للتحميل والاستعادة
          </h2>
          <span className="text-xs text-muted-foreground font-semibold">{backups.length} ملف محفوظ</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-muted/30 border-b border-border/60">
              <tr>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">اسم الملف</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">النوع</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">الحجم</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold">تاريخ الإنشاء</th>
                <th className="px-5 py-3.5 text-muted-foreground font-bold text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition">
                  <td className="px-5 py-3.5 font-mono font-bold text-foreground" dir="ltr">
                    {b.filename}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        b.type === 'database'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-primary/10 text-primary border-primary/20'
                      }`}
                    >
                      {b.type === 'database' ? 'قاعدة بيانات SQL' : 'ملفات ومرفقات'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-foreground font-semibold">{b.size}</td>
                  <td className="px-5 py-3.5 text-muted-foreground font-mono">{b.created_at}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toast.success(`جاري تنزيل ملف ${b.filename}`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground transition cursor-pointer"
                        title="تحميل الملف"
                      >
                        <Download className="w-3.5 h-3.5" />
                        تحميل
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition cursor-pointer"
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
