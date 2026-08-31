<?php

namespace App\Http\Requests\Api\V1\Student;

use Illuminate\Foundation\Http\FormRequest;

class CreateQuestionReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'question_id' => ['required', 'integer', 'exists:questions,id'],
            'report_type' => ['nullable', 'string', 'max:50'],
            'description' => ['required', 'string', 'min:3', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'question_id.required' => 'معرف السؤال مطلوب.',
            'question_id.exists' => 'السؤال المحدد غير موجود.',
            'report_type.required' => 'نوع البلاغ مطلوب.',
            'report_type.in' => 'نوع البلاغ غير صالح.',
            'description.required' => 'توضيح سبب البلاغ مطلوب.',
            'description.min' => 'يجب إدخال تفاصيل أطول عن المشكلة (لا تقل عن 5 أحرف).',
        ];
    }
}
