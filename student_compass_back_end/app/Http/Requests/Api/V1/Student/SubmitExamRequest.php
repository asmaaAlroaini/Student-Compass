<?php

namespace App\Http\Requests\Api\V1\Student;

use Illuminate\Foundation\Http\FormRequest;

class SubmitExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array', 'min:1'],
            'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'answers.*.student_answer' => ['required', 'string'],
            'time_spent_seconds' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'answers.required' => 'يرجى إرسال قائمة الإجابات.',
            'answers.array' => 'هيكل الإجابات غير صحيح.',
            'answers.*.question_id.required' => 'معرف السؤال مطلوب لكل إجابة.',
            'answers.*.question_id.exists' => 'أحد الأسئلة غير موجود بقاعدة البيانات.',
            'answers.*.student_answer.required' => 'نص الإجابة مطلوب لكل سؤال.',
            'time_spent_seconds.required' => 'الوقت المستغرق بالثواني مطلوب.',
        ];
    }
}
