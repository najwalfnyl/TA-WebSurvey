import { useState, useEffect } from "react";
import axios from "axios";

export default function QuestionSection({ initialQuestions = [], onQuestionsChange }) {
  const [questions, setQuestions] = useState([]);
  const [bankQuestions, setBankQuestions] = useState([]);

  useEffect(() => {
    axios.get("/api/bank-questions").then((res) => {
      setBankQuestions(res.data);
    });
  }, []);

  useEffect(() => {
    if (initialQuestions.length > 0) {
      setQuestions(initialQuestions);
    } else {
      setQuestions([]);
    }
  }, [initialQuestions]);

  useEffect(() => {
    if (typeof onQuestionsChange === 'function') {
      const timeout = setTimeout(() => {
        onQuestionsChange(questions);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [questions]);

  const handleSelectQuestion = (index, questionId) => {
    const selected = bankQuestions.find(q => q.id === parseInt(questionId));
    if (!selected) return;

    const updated = [...questions];
    updated[index] = {
      id: selected.id,
      text: selected.question_text,
      type: selected.question_type,
      isOpen: false,
      choices: selected.options?.map(opt => opt.option_text) || [],
      likertLabels: selected.likert_scales?.map(s => s.scale_label) || [],
      placeholderText: selected.placeholder_text || "",
      entities: selected.entities?.map(e => e.entity_name) || [],
    };
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      text: "",
      type: "Choose Type",
      isOpen: false,
      choices: [],
      likertLabels: [],
      placeholderText: "",
      entities: []
    }]);
  };

  const handleDeleteQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleChoiceChange = (questionIndex, choiceIndex, newValue) => {
    const updated = [...questions];
    updated[questionIndex].choices[choiceIndex] = newValue;
    setQuestions(updated);
  };

  const addChoice = (questionIndex) => {
    const updated = [...questions];
    updated[questionIndex].choices.push("");
    setQuestions(updated);
  };

  const removeChoice = (questionIndex, choiceIndex) => {
    const updated = [...questions];
    updated[questionIndex].choices.splice(choiceIndex, 1);
    setQuestions(updated);
  };

  const handlePlaceholderChange = (index, value) => {
    const updated = [...questions];
    updated[index].placeholderText = value;
    setQuestions(updated);
  };


  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mt-4">Pertanyaan</h3>

      <div className="space-y-3 mt-3">
        {questions.map((question, index) => (
          <div key={question.id} className="px-4 py-3 border rounded bg-[#E5E5E5] relative">

            {/* Bagian atas: nomor, dropdown, tipe sejajar */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-800 font-bold text-lg w-10">
                {String(index + 1).padStart(2, "0")}
              </span>

              <select
                onChange={(e) => handleSelectQuestion(index, e.target.value)}
                value={question.id}
                className="flex-1 p-2 border rounded text-sm"
              >
                <option value="">-- Pilih Pertanyaan dari Bank Soal --</option>
                {bankQuestions.map(q => (
                  <option key={q.id} value={q.id}>{q.question_text}</option>
                ))}
              </select>

              <input
                type="text"
                value={question.type}
                readOnly
                className="w-48 p-2 border rounded text-sm bg-gray-100"
              />

              <button
                onClick={() => handleDeleteQuestion(index)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-2 py-1 rounded"
              >
                -
              </button>
            </div>

            {/* Konten di bawahnya, tergantung tipe */}
            <div className="mt-2 text-sm">
              {question.type === "Text" && (
                <div className="flex items-center gap-2 mt-2 ml-[3rem]"> {/* ml-10/11/12 sesuai padding kiri dan nomor */}
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded"
                    value={question.placeholderText}
                    onChange={(e) => handlePlaceholderChange(index, e.target.value)}
                    placeholder="Masukkan placeholder..."
                  />
                </div>
              )}

              {question.type === "Likert Scale" && (
                <div className="mt-3 text-sm space-y-3">
                  {/* Entities Section */}
                  <div className="mt-2 ml-[3rem]">
                    <label className="font-semibold">Entities</label>
                    {question.entities.map((entity, i) => (
                      <div key={i} className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          value={entity}
                          onChange={(e) => handleEntityChange(index, i, e.target.value)}
                          className="p-2 border rounded w-full"
                        />
                        <button
                          onClick={() => removeEntity(index, i)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addEntity(index)}
                      className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      + Add Entity
                    </button>
                  </div>

                  {/* Likert Scale Labels Section */}
                  <div className="mt-2 ml-[3rem]">
                    <label className="font-semibold">Likert Scale</label>
                    <div>
                      {question.likertLabels.map((label, i) => (
                        <input
                          key={i}
                          type="text"
                          value={label}
                          onChange={(e) => handleLikertLabelChange(index, i, e.target.value)}
                          className="p-2 border rounded w-3/4 mt-1"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {question.type === "Multiple Choices" && (
                <div className="space-y-2">
                  {question.choices.map((choice, i) => (
                    <div key={i} className="flex gap-2 items-center mt-2 ml-[3rem]">
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded"
                        value={choice}
                        onChange={(e) => handleChoiceChange(index, i, e.target.value)}
                      />
                      <button
                        onClick={() => addChoice(index)}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >+</button>
                      <button
                        onClick={() => removeChoice(index, i)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >-</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleAddQuestion}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Tambah Pertanyaan
        </button>
      </div>
    </div>
  );
}
