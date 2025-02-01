"use client";

export default function ImageModal({ imageUrl, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
        <img
          src={imageUrl}
          alt="Receipt"
          className="max-h-[80vh] w-full object-contain"
        />
        <div className="mt-4 flex justify-end">
          <a
            href={imageUrl}
            download
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
}
