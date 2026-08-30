import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  Loader2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  useBulkImportPreview,
  useBulkImportConfirm,
  useDownloadTemplate,
} from '../hooks/useQuestions';
import { ROUTES } from '@/constants/routes';
import type { BulkImportPreviewResponse } from '../types/question.types';

type ImportStep = 'upload' | 'preview' | 'success';

export default function QuestionBulkImportPage() {
  const [step, setStep] = useState<ImportStep>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewResult, setPreviewResult] = useState<BulkImportPreviewResponse['data'] | null>(null);
  const [filterView, setFilterView] = useState<'all' | 'valid' | 'invalid'>('all');
  const [importedCount, setImportedCount] = useState<number>(0);

  const { mutate: downloadTemplate, isPending: isDownloadingTemplate } = useDownloadTemplate();
  const { mutate: previewImport, isPending: isPreviewing } = useBulkImportPreview();
  const { mutate: confirmImport, isPending: isConfirming } = useBulkImportConfirm();

  // Handle Drag and Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && (dropped.name.endsWith('.csv') || dropped.name.endsWith('.txt'))) {
      setFile(dropped);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  // Submit file for backend inspection and preview
  const handlePreviewSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('csv_file', file);

    previewImport(formData, {
      onSuccess: (res) => {
        setPreviewResult(res.data);
        setStep('preview');
      },
    });
  };

  // Confirm import of valid rows
  const handleConfirmSubmit = () => {
    if (!previewResult || previewResult.valid_questions.length === 0) return;

    confirmImport(previewResult.valid_questions, {
      onSuccess: (res) => {
        setImportedCount(res.imported_count);
        setStep('success');
      },
    });
  };

  const allRows = [
    ...(previewResult?.valid_questions ?? []).map((q) => ({ ...q, status: 'valid' as const })),
    ...(previewResult?.invalid_questions ?? []).map((q) => ({ ...q, status: 'invalid' as const })),
  ];

  const filteredRows = allRows.filter((r) => {
    if (filterView === 'valid') return r.status === 'valid';
    if (filterView === 'invalid') return r.status === 'invalid';
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto" dir="rtl">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to={ROUTES.DASHBOARD.QUESTIONS}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white tracking-tight">
                استيراد الأسئلة الجماعي (Excel / CSV)
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                50,000+ سؤال
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              رفع وفحص واعتماد آلاف الأسئلة دفعة واحدة مع المعايرة الذكية للأخطاء قبل الإدراج.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => downloadTemplate()}
          disabled={isDownloadingTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition border border-white/10 cursor-pointer disabled:opacity-50"
        >
          {isDownloadingTemplate ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          تنزيل قالب الاستيراد الموحد
        </button>
      </div>

      {/* ── Stepper Navigation ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'upload', label: '1. رفع الملف', desc: 'تحديد أو سحب ملف الأسئلة' },
          { id: 'preview', label: '2. المعاينة والفحص', desc: 'مراجعة السجلات وتدقيق الأخطاء' },
          { id: 'success', label: '3. اعتماد واستيراد', desc: 'إدراج الأسئلة في بنك الأسئلة' },
        ].map((s) => {
          const isActive = step === s.id;
          const isDone = (step === 'preview' && s.id === 'upload') || (step === 'success' && (s.id === 'upload' || s.id === 'preview'));
          return (
            <div
              key={s.id}
              className={`p-4 rounded-2xl border transition-all ${
                isActive
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-300 shadow-lg shadow-blue-500/5'
                  : isDone
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-[#0c142b] border-white/[0.06] text-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="w-2 h-2 rounded-full bg-current" />}
                <div className="text-xs font-bold">{s.label}</div>
              </div>
              <div className="text-[11px] opacity-75 mt-1">{s.desc}</div>
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Upload ── */}
      {step === 'upload' && (
        <div className="space-y-6">
          {/* Instructions Box */}
          <div className="p-5 rounded-3xl bg-[#0c142b] border border-white/[0.07] space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              تعليمات تجهيز ملف الاستيراد
            </h2>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>يرجى استخدام ملف بتنسيق <strong className="text-blue-300 font-mono">CSV (UTF-8)</strong> لضمان عدم تلف الحروف العربية.</li>
              <li>الأعمدة المطلوبة: <code className="text-blue-300 font-mono text-[11px]">subject_id</code>, <code className="text-blue-300 font-mono text-[11px]">unit_id</code>, <code className="text-blue-300 font-mono text-[11px]">lesson_id</code>, <code className="text-blue-300 font-mono text-[11px]">question_text</code>, <code className="text-blue-300 font-mono text-[11px]">type</code>, <code className="text-blue-300 font-mono text-[11px]">correct_answer</code>, <code className="text-blue-300 font-mono text-[11px]">difficulty</code>.</li>
              <li>لأسئلة الاختيار من متعدد: اكتب الخيارات في أعمدة <code className="text-blue-300 font-mono text-[11px]">option_1</code> إلى <code className="text-blue-300 font-mono text-[11px]">option_4</code> واكتب نص الإجابة المطابق تماماً في <code className="text-blue-300 font-mono text-[11px]">correct_answer</code>.</li>
              <li>الدرجات المسموحة لـ <code className="text-blue-300 font-mono text-[11px]">difficulty</code> هي: <code className="text-blue-300 font-mono text-[11px]">easy</code>, <code className="text-blue-300 font-mono text-[11px]">medium</code>, <code className="text-blue-300 font-mono text-[11px]">hard</code>.</li>
            </ul>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="p-10 rounded-3xl border-2 border-dashed border-white/15 hover:border-blue-500/50 bg-[#0c142b]/60 hover:bg-[#0c142b] transition flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {file ? file.name : 'اسحب وأفلت ملف الأسئلة هنا'}
              </h3>
              <p className="text-xs text-slate-400">
                {file ? `${(file.size / 1024).toFixed(1)} KB — جاهز للفحص` : 'أو تصفح الملفات من جهازك (ملف CSV)'}
              </p>
            </div>

            <label className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition border border-white/10 cursor-pointer">
              تصفح الملفات
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Submit for preview action */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePreviewSubmit}
              disabled={!file || isPreviewing}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 cursor-pointer"
            >
              {isPreviewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isPreviewing ? 'جاري قراءة وفحص الملف...' : 'فحص ومعاينة الأسئلة'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 2: Preview ── */}
      {step === 'preview' && previewResult && (
        <div className="space-y-6">

          {/* KPI Summary */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-[#0c142b] border border-white/[0.07] space-y-1">
              <span className="text-[11px] text-slate-400">إجمالي السجلات المقروءة</span>
              <div className="text-2xl font-black text-white">{previewResult.total_rows}</div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] text-emerald-300">سجلات صالحة للاستيراد</span>
              <div className="text-2xl font-black text-emerald-300">{previewResult.valid_count}</div>
            </div>
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1">
              <span className="text-[11px] text-rose-300">سجلات بها أخطاء</span>
              <div className="text-2xl font-black text-rose-300">{previewResult.invalid_count}</div>
            </div>
          </div>

          {/* Filter view pills */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilterView('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterView === 'all' ? 'bg-blue-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                عرض الكل ({allRows.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterView('valid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterView === 'valid' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                الصحيحة فقط ({previewResult.valid_count})
              </button>
              <button
                type="button"
                onClick={() => setFilterView('invalid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  filterView === 'invalid' ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                التي بها أخطاء ({previewResult.invalid_count})
              </button>
            </div>

            <button
              type="button"
              onClick={() => setStep('upload')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← اختيار ملف آخر
            </button>
          </div>

          {/* Preview Table */}
          <div className="rounded-2xl bg-[#0c142b] border border-white/[0.07] overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-right text-xs">
                <thead className="sticky top-0 bg-[#090f20] z-10 border-b border-white/[0.07]">
                  <tr>
                    <th className="px-4 py-3 text-slate-500 font-bold">#</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">الحالة</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">نص السؤال</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">النوع</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">الإجابة الصحيحة</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">الصعوبة</th>
                    <th className="px-4 py-3 text-slate-500 font-bold">ملاحظات / الأخطاء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filteredRows.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition">
                      <td className="px-4 py-3 text-slate-500 font-mono">{i + 1}</td>
                      <td className="px-4 py-3">
                        {row.status === 'valid' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            صالح
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            <AlertTriangle className="w-3 h-3" />
                            خطأ
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs truncate font-medium text-white">
                        {row.question_text || '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-400">{row.type || 'mcq'}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-300">{row.correct_answer || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{row.difficulty || 'medium'}</td>
                      <td className="px-4 py-3 text-rose-300 font-medium">
                        {row.errors?.join(', ') || 'جاهز للإدراج'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action confirmation bar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.07]">
            <div className="text-xs text-slate-400">
              سيتم استيراد <strong className="text-emerald-300 font-bold">{previewResult.valid_count}</strong> سؤال تم التحقق من صحتها وتجاوزت الفحص.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('upload')}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                إلغاء والعودة
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={previewResult.valid_count === 0 || isConfirming}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
              >
                {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                {isConfirming ? 'جاري إدراج الأسئلة في قاعدة البيانات...' : `تأكيد واستيراد ${previewResult.valid_count} سؤال`}
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ── STEP 3: Success ── */}
      {step === 'success' && (
        <div className="p-10 rounded-3xl bg-[#0c142b] border border-emerald-500/30 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">تم الاستيراد بنجاح! 🎉</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              تم اعتماد وإدراج <strong className="text-emerald-300 font-bold">{importedCount}</strong> سؤال في بنك الأسئلة المركزي، وهي الآن جاهزة للاستخدام في الامتحانات والمسابقات.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setPreviewResult(null);
                setStep('upload');
              }}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              استيراد ملف إضافي
            </button>
            <Link
              to={ROUTES.DASHBOARD.QUESTIONS}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
            >
              <HelpCircle className="w-4 h-4" />
              الانتقال لبنك الأسئلة
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
