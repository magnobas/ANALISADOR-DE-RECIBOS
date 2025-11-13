
import React, { useRef } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  imageDataUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, imageDataUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <label
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`flex justify-center items-center w-full h-64 md:h-96 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-300 ${imageDataUrl ? 'p-2' : ''}`}
      >
        <div className="text-center">
          {imageDataUrl ? (
            <img src={imageDataUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 4v.01M28 8l10 10m0 0v12a4 4 0 01-4 4H12a4 4 0 01-4-4V12a4 4 0 014-4h12z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-2 text-sm text-gray-400">
                <span className="font-semibold text-primary-400">Clique para enviar</span> ou arraste e solte
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF até 10MB</p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          id="file-upload"
          name="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>
      {imageDataUrl && (
         <button
          onClick={triggerFileSelect}
          className="mt-4 w-full text-sm py-2 px-4 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
         >
           Trocar Imagem
         </button>
      )}
    </div>
  );
};

export default ImageUploader;
