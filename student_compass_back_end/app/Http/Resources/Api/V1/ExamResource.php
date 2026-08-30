<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'type' => $this->type,
            'duration_minutes' => $this->duration_minutes,
            'total_marks' => $this->total_marks,
            'pass_marks' => $this->pass_marks,
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
        ];
    }
}
