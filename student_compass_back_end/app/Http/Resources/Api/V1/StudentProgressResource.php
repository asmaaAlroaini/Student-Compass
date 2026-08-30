<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentProgressResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'exam_id' => $this->exam_id,
            'exam_title' => $this->whenLoaded('exam', fn() => $this->exam->title),
            'score' => $this->score,
            'total_possible_score' => $this->total_possible_score,
            'percentage' => $this->percentage,
            'time_spent_seconds' => $this->time_spent_seconds,
            'status' => $this->status,
            'completed_at' => $this->completed_at?->toDateTimeString(),
        ];
    }
}
