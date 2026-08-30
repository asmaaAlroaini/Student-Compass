<?php

namespace App\Http\Requests\Api\V1\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreExamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'unit_id' => ['nullable', 'integer', 'exists:units,id'],
            'lesson_id' => ['nullable', 'integer', 'exists:lessons,id'],
            'title' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:practice,assessment,ministerial'],
            'duration_minutes' => ['required', 'integer', 'min:5', 'max:300'],
            'total_marks' => ['required', 'integer', 'min:1'],
            'pass_marks' => ['required', 'integer', 'min:1'],
            'questions' => ['required', 'array', 'min:1'],
            'questions.*.question_id' => ['required', 'integer', 'exists:questions,id'],
            'questions.*.marks' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'subject_id.required' => 'المادة الدراسية مطلوبة.',
            'title.required' => 'عنوان الامتحان مطلوب.',
            'type.required' => 'نوع الامتحان مطلوب (تجريبي / تقييمي / وزاري).',
            'duration_minutes.required' => 'مدة الامتحان بالدقائق مطلوبة.',
            'questions.required' => 'يجب تحديد أسئلة للامتحان.',
            'questions.min' => 'يجب أن يحتوي الامتحان على سؤال واحد على الأقل.',
        ];
    }
}
