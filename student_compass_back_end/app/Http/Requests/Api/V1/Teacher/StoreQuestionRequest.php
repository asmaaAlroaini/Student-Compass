<?php

namespace App\Http\Requests\Api\V1\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'unit_id' => ['required', 'integer', 'exists:units,id'],
            'lesson_id' => ['required', 'integer', 'exists:lessons,id'],
            'question_text' => ['required', 'string', 'min:3'],
            'question_image' => ['nullable', 'string', 'max:500'],
            'type' => ['required', 'string', 'in:mcq,true_false,essay'],
            'options' => ['required_if:type,mcq', 'nullable', 'array'],
            'correct_answer' => ['required', 'string'],
            'explanation' => ['nullable', 'string'],
            'difficulty' => ['required', 'string', 'in:easy,medium,hard'],
            'year' => ['nullable', 'integer'],
            'source' => ['nullable', 'string', 'max:255'],
            'points' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' => 'المادة الدراسية مطلوبة.',
            'subject_id.exists' => 'المادة غير موجودة.',
            'unit_id.required' => 'الوحدة الدراسية مطلوبة.',
            'unit_id.exists' => 'الوحدة غير موجودة.',
            'lesson_id.required' => 'الدرس مطلوب.',
            'lesson_id.exists' => 'الدرس غير موجود.',
            'question_text.required' => 'نص السؤال مطلوب.',
            'type.required' => 'نوع السؤال مطلوب (اختيار من متعدد / صح وخطأ / مقالي).',
            'options.required_if' => 'الخيارات مطلوبة في أسئلة الاختيار من متعدد.',
            'correct_answer.required' => 'الإجابة الصحيحة مطلوبة.',
            'difficulty.required' => 'درجة الصعوبة مطلوبة (سهل / متوسط / صعب).',
        ];
    }
}
