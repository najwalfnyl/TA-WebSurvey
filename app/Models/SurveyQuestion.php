<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SurveyQuestion extends Model
{
    protected $fillable = ['survey_id', 'question_text', 'question_type', 'order'];


    public function surveys()
{
    return $this->belongsToMany(Survey::class, 'survey_question_assignments')->withPivot('order');
}

    public function options() {
        return $this->hasMany(SurveyQuestionOption::class);
    }

    public function answers() {
        return $this->hasMany(Answer::class, 'question_id');
    }

    public function likertScales()
    {
        return $this->hasMany(LikertScale::class, 'question_id');
    }  

    public function entities()
    {
        return $this->hasMany(LikertEntity::class, 'question_id'); // Menambahkan relasi ke tabel likert_entities
    }
}
