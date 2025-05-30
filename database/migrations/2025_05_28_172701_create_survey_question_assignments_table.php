<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveyQuestionAssignmentsTable extends Migration
{
    public function up()
    {
        Schema::create('survey_question_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_id')->constrained()->onDelete('cascade');
            $table->foreignId('survey_question_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(0); // Optional: urutan tampilan
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('survey_question_assignments');
    }
}
