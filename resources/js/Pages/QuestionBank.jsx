import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import axios from "axios";

export default function QuestionBank() {
    const [questions, setQuestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        axios.get("/question-bank").then((res) => {
            setQuestions(res.data);
        });
    }, []);

    const filteredQuestions = questions.filter((q) => {
        const matchSearch = q.question_text.toLowerCase().includes(searchTerm.toLowerCase());
        const matchType = typeFilter === "all" || q.question_type === typeFilter;
        return matchSearch && matchType;
    });

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus pertanyaan ini?")) return;
        try {
            await axios.delete(`/question-bank/${id}`);
            setQuestions(prev => prev.filter(q => q.id !== id));
        } catch (err) {
            alert("Gagal menghapus pertanyaan.");
            console.error(err);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Bank Soal" />
            <div className="py-7 px-7">
                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Bank Soal</h2>
                    <p className="text-gray-600 mb-6">
                        Pilih pertanyaan dari daftar di bawah ini untuk digunakan dalam survei.
                    </p>

                    {/* Search + Filter */}
                    <div className="flex justify-between items-center mb-5">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Cari Pertanyaan"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-4 pr-10 h-10 text-sm rounded-md border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <div className="absolute top-0 right-0 h-full flex items-center">
                                <div className="bg-[#34495E] h-full px-3 flex items-center justify-center rounded-r-md">
                                    <img src="/assets/Search.svg" alt="Search" className="w-4 h-4 invert brightness-0" />
                                </div>
                            </div>
                        </div>

                        <div className="relative ml-4">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-52 h-10 text-sm px-4 pr-10 rounded-md border border-blue-500 bg-white shadow-sm appearance-none focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                            >
                                <option value="all">Tipe: All</option>
                                <option value="Text">Text</option>
                                <option value="Multiple Choices">Multiple Choices</option>
                                <option value="Likert Scale">Likert Scale</option>
                            </select>
                            <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2">
                                <img src="/assets/Vector.svg" alt="dropdown" className="w-5 h-5" />
                            </div>
                        </div>

                        <button
                            onClick={() => router.visit('/question-bank/create')}
                            className="ml-4 px-4 h-10 bg-[#2563EB] text-white text-sm rounded-md hover:bg-gray-700"
                        >
                            + Tambah Pertanyaan
                        </button>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-4">#</th>
                                    <th className="p-4">Pertanyaan</th>
                                    <th className="p-4">Tipe</th>
                                    <th className="p-4">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuestions.length > 0 ? (
                                    filteredQuestions.map((q, index) => (
                                        <tr key={q.id} className="border-t">
                                            <td className="p-4">{index + 1}</td>
                                            <td className="p-4 font-medium text-gray-800">{q.question_text}</td>
                                            <td className="p-4 text-sm text-gray-600">{q.question_type}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => handleDelete(q.id)}
                                                    className="bg-[#FFDBD9] text-[#F84B40] text-sm px-3 py-1 rounded-md hover:bg-[#fbcaca] transition"
                                                >
                                                    Hapus
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center text-gray-500">
                                            Tidak ada pertanyaan ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
