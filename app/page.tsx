'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cleanedImageUrl, setCleanedImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setCleanedImageUrl('');
      setError('');
    }
  };

  // Handle image upload and C2PA removal
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/remove-c2pa', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process image');
      }

      // Get the cleaned image as a blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setCleanedImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Download the cleaned image
  const handleDownload = () => {
    if (cleanedImageUrl) {
      const a = document.createElement('a');
      a.href = cleanedImageUrl;
      a.download = `cleaned-${selectedFile?.name || 'image.png'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            C2PA Badge Remover
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Remove the CR (Content Credentials) badge from AI-generated images
          </p>
        </div>

        {/* Upload Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Upload Image
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 dark:text-gray-300
                         file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700
                         hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300
                         cursor-pointer"
              />
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                       text-white font-semibold py-3 px-6 rounded-lg transition-colors
                       disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Remove C2PA Metadata'}
            </button>
          </form>
        </div>

        {/* Image Preview */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Original Image */}
          {previewUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Original Image
              </h3>
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={previewUrl}
                  alt="Original"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                With C2PA metadata
              </p>
            </div>
          )}

          {/* Cleaned Image */}
          {cleanedImageUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Cleaned Image
              </h3>
              <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <Image
                  src={cleanedImageUrl}
                  alt="Cleaned"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white
                           font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Download
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                C2PA metadata removed
              </p>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-300">
            How it works
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Upload an image with C2PA metadata (e.g., from OpenAI DALL-E)</li>
            <li>• The tool strips all metadata including the CR badge information</li>
            <li>• Download the cleaned image without the Content Credentials badge</li>
            <li>• The image quality remains unchanged</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
