<?php

// app/Models/SurveyQuestionAssignment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestionAssignment extends Model
{
    protected $fillable = ['survey_id', 'survey_question_id', 'order'];

    public function survey()
    {
        return $this->belongsTo(Survey::class);
    }

    public function question()
    {
        return $this->belongsTo(SurveyQuestion::class, 'survey_question_id');
    }
}

