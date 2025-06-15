"use client";

import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState({
    english: "",
    hindi: "",
    japanese: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = () => {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = axios.postForm("/api/upload", formData);

    toast.promise(response, {
      loading: "Uploading and processing image...",
      success: (data: AxiosResponse) => {
        setResponse(data.data.output);
        setLoading(true);
        return "Image processed successfully!";
      },
      error: "Error uploading image",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-bg-base-100 via-base-300 to-bg-base-100">
      <div className="w-full max-w-xl mx-auto">
        <div className="card bg-base-200 shadow-lg rounded-lg">
          <div className="card-body">
            <h2 className="card-title text-2xl font-bold text-base-content">
              Upload an Image
            </h2>
            <p className="text-base-content">
              Choose an image to send to the backend for processing. Captions
              and audio will be generated in English, Hindi, and Japanese.
            </p>
            <div className="mt-4">
              <input
                type="file"
                accept="image/*"
                className="file-input file-input-bordered file-input-primary w-full"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </div>
            <button
              className="btn btn-primary w-full mt-4"
              onClick={handleImageUpload}
            >
              Upload
            </button>
          </div>
        </div>

        {loading && (
          <div className="card bg-base-300 shadow-lg rounded-lg mt-8">
            <div className="card-body">
              <h2 className="card-title text-xl font-semibold text-base-content">
                Processed Image and Results
              </h2>
              <div className="flex flex-col items-center">
                <img
                  src="/image.jpg"
                  alt="Processed"
                  className="w-60 h-auto rounded-lg border border-base-content shadow-sm mt-4"
                />
                <h3 className="text-lg font-medium text-base-content mt-4">
                  Generated Captions
                </h3>
                <ul className="list-disc list-inside text-base-content">
                  <li>
                    <strong>English:</strong> {response.english}
                  </li>
                  <li>
                    <strong>Hindi:</strong> {response.hindi}
                  </li>
                  <li>
                    <strong>Japanese:</strong> {response.japanese}
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-base-content">
                  Audio Outputs
                </h3>
                <div className="space-y-4 mt-4">
                  <audio controls className="w-full">
                    <source src="/english.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <audio controls className="w-full">
                    <source src="/hindi.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                  <audio controls className="w-full">
                    <source src="/japanese.mp3" type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
