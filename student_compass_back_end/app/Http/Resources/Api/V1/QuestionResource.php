<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subject_id' => $this->subject_id,
            'unit_id' => $this->unit_id,
            'lesson_id' => $this->lesson_id,
            'question_text' => $this->question_text,
            'question_image' => $this->question_image,
            'type' => $this->type,
            'options' => $this->options,
            'explanation' => $this->explanation,
            'difficulty' => $this->difficulty,
            'points' => $this->points,
            'marks_in_exam' => $this->whenPivotLoaded('exam_question', function () {
                return $this->pivot->marks;
            }),
        ];
    }
}
