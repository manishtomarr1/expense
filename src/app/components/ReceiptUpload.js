"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function ReceiptUpload({ setFieldValue, currentUrl }) {
  const [uploadedUrl, setUploadedUrl] = useState(currentUrl || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload/receipt", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadedUrl(data.url);
        setFieldValue("receiptUrl", data.url);
        toast.success("Receipt uploaded successfully!");
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload error");
    }
    setIsUploading(false);
  };

  const handleDelete = () => {
    setUploadedUrl("");
    setFieldValue("receiptUrl", "");
  };

  return (
    <div className="mt-2">
      {/* Show file input if no image is uploaded and not uploading */}
      {!uploadedUrl && !isUploading && (
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="block"
          />
        </div>
      )}
      {/* Display uploading indicator with bouncing dots */}
      {isUploading && (
        <div className="text-blue-600">
          Uploading<span className="animate-bounce">...</span>
        </div>
      )}
      {/* Display uploaded image preview with delete and reupload options */}
      {uploadedUrl && !isUploading && (
        <div className="flex flex-col items-center">
          <img
            src={uploadedUrl}
            alt="Receipt Preview"
            className="w-16 h-16 rounded-full object-cover cursor-pointer"
            onClick={() => window.open(uploadedUrl, "_blank")}
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Delete
            </button>
            <label className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer">
              Reupload
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
