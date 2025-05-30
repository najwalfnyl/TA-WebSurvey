import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

export default function CreateQuestion() {
    const [questionText, setQuestionText] = useState("");
    const [questionType, setQuestionType] = useState("Text");
    const [choices, setChoices] = useState([""]);
    const [likertLabels, setLikertLabels] = useState([""]);
    const [entities, setEntities] = useState([""]);
    const [loading, setLoading] = useState(false);

    const addInput = (stateSetter, values) => stateSetter([...values, ""]);
    const updateInput = (index, value, stateSetter, values) => {
        const updated = [...values];
        updated[index] = value;
        stateSetter(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/question-bank/store", {
                question_text: questionText,
                question_type: questionType,
                choices: choices.filter(c => c.trim() !== ""),
                likertLabels: likertLabels.filter(l => l.trim() !== ""),
                entities: entities.filter(e => e.trim() !== ""),
            });
            router.visit("/bank-soal");
        } catch (err) {
            alert("Gagal menyimpan pertanyaan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tambah Pertanyaan Bank Soal" />
            <div className="p-6 max-w-4xl mx-auto bg-white shadow rounded">
                <h1 className="text-2xl font-bold mb-4">Tambah Pertanyaan ke Bank Soal</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">Teks Pertanyaan</label>
                        <textarea
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="w-full border p-2 rounded"
                            rows="3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-medium">Tipe Pertanyaan</label>
                        <select
                            value={questionType}
                            onChange={(e) => setQuestionType(e.target.value)}
                            className="w-full border p-2 rounded"
                        >
                            <option value="Text">Text</option>
                            <option value="Multiple Choices">Multiple Choices</option>
                            <option value="Likert Scale">Likert Scale</option>
                        </select>
                    </div>

                    {questionType === "Multiple Choices" && (
                        <div>
                            <label className="block font-medium">Pilihan Jawaban</label>
                            {choices.map((choice, idx) => (
                                <input
                                    key={idx}
                                    value={choice}
                                    onChange={(e) => updateInput(idx, e.target.value, setChoices, choices)}
                                    className="block w-full border p-2 rounded mt-1"
                                    placeholder={`Pilihan ${idx + 1}`}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => addInput(setChoices, choices)}
                                className="text-sm text-blue-600 mt-2"
                            >
                                + Tambah Pilihan
                            </button>
                        </div>
                    )}

                    {questionType === "Likert Scale" && (
                        <>
                            <div>
                                <label className="block font-medium">Label Skala Likert</label>
                                {likertLabels.map((label, idx) => (
                                    <input
                                        key={idx}
                                        value={label}
                                        onChange={(e) => updateInput(idx, e.target.value, setLikertLabels, likertLabels)}
                                        className="block w-full border p-2 rounded mt-1"
                                        placeholder={`Label ${idx + 1}`}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addInput(setLikertLabels, likertLabels)}
                                    className="text-sm text-blue-600 mt-2"
                                >
                                    + Tambah Label
                                </button>
                            </div>

                            <div>
                                <label className="block font-medium">Entitas (dimensi yang diukur)</label>
                                {entities.map((entity, idx) => (
                                    <input
                                        key={idx}
                                        value={entity}
                                        onChange={(e) => updateInput(idx, e.target.value, setEntities, entities)}
                                        className="block w-full border p-2 rounded mt-1"
                                        placeholder={`Entitas ${idx + 1}`}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addInput(setEntities, entities)}
                                    className="text-sm text-blue-600 mt-2"
                                >
                                    + Tambah Entitas
                                </button>
                            </div>
                        </>
                    )}

                    <div className="pt-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Pertanyaan"}
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
