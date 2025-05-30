<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Collection;
use App\Models\Survey;
use Inertia\Inertia;

class QuestionBankController extends Controller
{
    public function store(Request $request)
{
    $data = $request->validate([
        'question_text' => 'required|string',
        'question_type' => 'required|in:Text,Multiple Choices,Likert Scale',
        'choices' => 'nullable|array',
        'choices.*' => 'nullable|string',
        'likertLabels' => 'nullable|array',
        'likertLabels.*' => 'nullable|string',
        'entities' => 'nullable|array',
        'entities.*' => 'nullable|string',
    ]);

    $choices = array_filter($data['choices'] ?? [], fn($c) => $c !== null && trim($c) !== '');
    $labels = array_filter($data['likertLabels'] ?? [], fn($l) => $l !== null && trim($l) !== '');
    $entities = array_filter($data['entities'] ?? [], fn($e) => $e !== null && trim($e) !== '');

    $question = \App\Models\SurveyQuestion::create([
        'survey_id' => null,
        'question_text' => $data['question_text'],
        'question_type' => $data['question_type'],
    ]);

    if ($data['question_type'] === 'Multiple Choices' && count($choices)) {
        foreach ($choices as $choice) {
            $question->options()->create(['option_text' => $choice]);
        }
    }

    if ($data['question_type'] === 'Likert Scale') {
        foreach (array_values($labels) as $i => $label) {
            $question->likertScales()->create([
                'scale_value' => $i + 1,
                'scale_label' => $label,
            ]);
        }

        foreach ($entities as $entity) {
            $question->entities()->create(['entity_name' => $entity]);
        }
    }


    return response()->json(['message' => 'OK']);
}

public function destroy($id)
{
    $question = \App\Models\SurveyQuestion::findOrFail($id);
    $question->options()->delete();
    $question->likertScales()->delete();
    $question->entities()->delete();
    $question->delete();

    return response()->json(['message' => 'Pertanyaan berhasil dihapus']);
}

    
    public function allQuestions()
{
    $questions = \App\Models\SurveyQuestion::with([
        'options',
        'likertScales',
        'entities',
    ])->whereNull('survey_id')->latest()->get();

    return response()->json($questions);
}


public function getAll()
{
    return \App\Models\SurveyQuestion::with(['options', 'likertScales', 'entities'])
        ->whereNull('survey_id') // atau yang memang bank soal
        ->latest()
        ->get();
}



}