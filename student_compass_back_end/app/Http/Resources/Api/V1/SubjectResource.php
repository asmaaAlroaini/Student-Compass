<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'grade_level' => $this->grade_level,
            'track' => $this->track,
            'icon' => $this->icon,
            'units_count' => $this->whenCounted('units'),
            'lessons_count' => $this->whenCounted('lessons'),
            'units' => $this->whenLoaded('units'),
        ];
    }
}
