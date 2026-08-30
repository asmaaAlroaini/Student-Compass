<?php

namespace App\Infrastructure\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    /**
     * حفظ أو استبدال ملف بشكل آمن:
     * - إذا تم إرسال ملف جديد: يتم رفعه وحذف الملف القديم (إن وجد) وإرجاع المسار الجديد.
     * - إذا لم يتم إرسال ملف جديد: يتم الإبقاء على المسار القديم كما هو دون أي تغيير.
     *
     * @param UploadedFile|null $newFile الملف الجديد المراد رفعه (اختياري)
     * @param string|null $oldFilePath المسار القديم المخزن حالياً في قاعدة البيانات
     * @param string $folder المجلد المستهدف بداخل storage/app/public
     * @return string|null
     */
    public function updateOrKeepFile(?UploadedFile $newFile, ?string $oldFilePath, string $folder = 'uploads'): ?string
    {
        // 1. إذا لم يتم تقديم ملف جديد، نحتفظ بالملف القديم كما هو
        if (!$newFile) {
            return $oldFilePath;
        }

        // 2. إذا وجد ملف جديد، نحذف الملف القديم من القرص التخزيني إن كان موجوداً
        if ($oldFilePath && Storage::disk('public')->exists($oldFilePath)) {
            Storage::disk('public')->delete($oldFilePath);
        }

        // 3. رفع وحفظ الملف الجديد وإرجاع المسار المخزن
        return $newFile->store($folder, 'public');
    }

    /**
     * حذف ملف من القرص التخزيني عند حذف العنصر نهائياً
     */
    public function deleteFile(?string $filePath): void
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }
    }
}
