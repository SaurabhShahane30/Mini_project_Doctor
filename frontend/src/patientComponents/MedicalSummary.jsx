import React, { useState ,useEffect } from "react";
import axios from "axios";
import { FaUpload, FaFileMedical } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.mjs";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

const MedicalSummary = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [keyFindings, setKeyFindings] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fileName, setFileName] = useState("");

  // Groq API config
  const GROQ_API_KEY = "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";
  const MODEL = "llama-3.1-8b-instant";

  // ✅ Get patient name from login (localStorage)
  const user = JSON.parse(localStorage.getItem("user"));


  // Extract text from PDF
  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();
        const pageText = content.items.map((item) => item.str).join(" ");
        text += pageText + "\n";
      }
      return text;
    } catch (error) {
      throw new Error("Error extracting PDF text: " + error.message);
    }
  };

  // Groq API call
  const callGroqAPI = async (prompt) => {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "user", content: prompt }],
          max_tokens: 500,
          temperature: 0.3
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || `API error: ${response.status}`);
      if (data.choices && data.choices[0] && data.choices[0].message) return data.choices[0].message.content;
      throw new Error("Unexpected API response format");
    } catch (error) {
      throw new Error("API call failed: " + error.message);
    }
  };

  const generateMedicalSummary = async (text) => {
    const prompt = `As a medical expert, provide a concise summary of this medical report focusing on diagnosis, symptoms, and current health status:\n\n${text.slice(0, 3000)}`;
    return await callGroqAPI(prompt);
  };

  const generateKeyFindings = async (text) => {
    const prompt = `Extract key medical findings as bullet points from this medical report. Include lab results, vital signs, and clinical observations:\n\n${text.slice(0, 3000)}`;
    return await callGroqAPI(prompt);
  };

  const generateRecommendations = async (text) => {
    const prompt = `Provide clear medical recommendations based on this report including treatment suggestions, follow-up requirements, and lifestyle advice:\n\n${text.slice(0, 3000)}`;
    return await callGroqAPI(prompt);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setSummary("");
    setKeyFindings("");
    setRecommendations("");
    setErrorMsg("");
  };

const handleUpload = async () => {
  if (!file) {
    alert("Please select a PDF file.");
    return;
  }

  if (!GROQ_API_KEY) {
    setErrorMsg("Please add your Groq API key first!");
    return;
  }

  if (!patient) {
    setErrorMsg("Patient information not loaded yet.");
    return;
  }

  setLoading(true);
  setErrorMsg("");

  try {
    const arrayBuffer = await file.arrayBuffer();
    const extractedText = await extractTextFromPDF(arrayBuffer);

    if (!extractedText.trim()) throw new Error("No text extracted from the PDF.");

    const [genSummary, genFindings, genRecommendations] = await Promise.all([
      generateMedicalSummary(extractedText),
      generateKeyFindings(extractedText),
      generateRecommendations(extractedText)
    ]);

    setSummary(genSummary);
    setKeyFindings(genFindings);
    setRecommendations(genRecommendations);

    // ✅ Save report to MongoDB with logged-in patient info
    await axios.post("http://localhost:5000/api/reports", {
      patientId: patient._id, // use the patient's ID from the patient collection
      patientName: patient.name, // use the patient's name
      summary: genSummary,
      keyFindings: genFindings,
      recommendations: genRecommendations,
      createdAt: new Date(),
    });

    console.log("Report saved successfully to MongoDB.");
  } catch (err) {
    console.error(err);
    setErrorMsg(err.message);
  } finally {
    setLoading(false);
  }
};


  const formatMedicalText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong class='text-blue-800'>$1</strong>")
      .replace(/\n/g, "<br/>")
      .replace(/\n•/g, "<br/>•")
      .replace(/•/g, "<br/>•");
  };

    const [patient, setPatientData] = useState(null);

    // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
        
        const response = await axios.get('http://localhost:5000/api/patient', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatientData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch patient data');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPatientData();
  }, []);
  return (
    <div className="max-w-3xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center">Medical Report Analyzer</h1>

      {/* Patient info */}
      <p className="text-right text-gray-600 mb-3">Patient: <strong>{patient ? patient.name : "Loading..."}</strong></p>

      <div className="flex flex-col items-center space-y-4">
        {/* Upload Section */}
        <label className="cursor-pointer flex flex-col items-center p-6 border-2 border-dashed border-blue-400 rounded-lg w-full max-w-md hover:bg-blue-50 transition">
          <FaUpload className="text-blue-600 text-4xl mb-2" />
          <span className="text-gray-700">
            {fileName ? `📄 ${fileName}` : "Click to upload a Medical Report PDF"}
          </span>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded text-white w-full max-w-md transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Upload & Analyze"}
        </button>
      </div>

      {errorMsg && (
        <div className="mt-4 text-red-600 text-center bg-red-50 p-3 rounded">{errorMsg}</div>
      )}

      {summary && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800 flex items-center gap-2">
            <FaFileMedical className="text-blue-600" /> Medical Summary
          </h2>
          <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMedicalText(summary) }} />
        </div>
      )}

      {keyFindings && (
        <div className="mt-8 p-6 bg-green-50 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">🔍 Key Findings</h2>
          <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMedicalText(keyFindings) }} />
        </div>
      )}

      {recommendations && (
        <div className="mt-8 p-6 bg-orange-50 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-3 text-gray-800">💡 Recommendations</h2>
          <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatMedicalText(recommendations) }} />
        </div>
      )}
    </div>
  );
};

export default MedicalSummary;

