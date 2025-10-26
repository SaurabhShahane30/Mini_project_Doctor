import { useState } from 'react';
import { Upload } from 'lucide-react';

// PdfUploader component for uploading PDF files
export function PdfUploader({ onUpload }) {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
    setFiles(selectedFiles);
    if (onUpload) onUpload(selectedFiles);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-8 flex flex-col items-center justify-center h-48">
      <label
        htmlFor="pdf-upload"
        className="cursor-pointer flex flex-col items-center justify-center h-full w-full border-2 border-dashed border-teal-600 rounded-md text-teal-600 hover:bg-teal-50 transition"
      >
        <Upload className="h-8 w-8 mb-2" />
        <span>Click or drag PDF files to upload</span>
        <input
          id="pdf-upload"
          type="file"
          accept="application/pdf"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
      {files.length > 0 && (
        <div className="mt-4 w-full max-h-32 overflow-auto">
          <p className="font-semibold mb-2">Selected PDFs:</p>
          <ul className="text-gray-700 list-disc list-inside">
            {files.map((file, idx) => (
              <li key={idx}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}