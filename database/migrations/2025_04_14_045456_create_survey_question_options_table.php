<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('survey_question_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_question_id')->constrained('survey_questions')->onDelete('cascade');
            $table->string('option_text');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_question_options');
    }
};
