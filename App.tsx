
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ReceiptDataDisplay from './components/ReceiptDataDisplay';
import Spinner from './components/icons/Spinner';
import { analyzeReceipt } from './services/geminiService';
import { ReceiptData } from './types';

function App() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setReceiptData(null);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError("Por favor, selecione uma imagem primeiro.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setReceiptData(null);

    try {
      const data = await analyzeReceipt(imageFile);
      setReceiptData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl mx-auto text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          Analisador de Recibos com IA
        </h1>
        <p className="mt-4 text-lg text-gray-400">
          Extraia dados de recibos de depósito com o poder do Gemini.
        </p>
      </header>

      <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 flex flex-col items-center">
          <ImageUploader onImageSelect={handleImageSelect} imageDataUrl={imageDataUrl} />
           {imageFile && (
            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="mt-6 w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-primary-800 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-3" />
                  Analisando...
                </>
              ) : (
                'Analisar Recibo'
              )}
            </button>
          )}
        </div>
        <div className="md:w-1/2 flex items-center justify-center">
            {isLoading && !error && (
                <div className="flex flex-col items-center justify-center p-8 bg-gray-800/50 rounded-lg w-full h-full">
                    <Spinner className="w-12 h-12" />
                    <p className="mt-4 text-gray-300">A IA está analisando a imagem...</p>
                </div>
            )}
            {error && (
                <div className="w-full p-6 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
                    <h3 className="font-bold">Erro na Análise</h3>
                    <p>{error}</p>
                </div>
            )}
            {!isLoading && receiptData && (
                <ReceiptDataDisplay data={receiptData} />
            )}
            {!isLoading && !receiptData && !error && (
                 <div className="flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg w-full h-full border-2 border-dashed border-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    <h3 className="text-lg font-semibold text-gray-400">Os resultados aparecerão aqui</h3>
                    <p className="text-sm text-gray-500">Envie uma imagem e clique em "Analisar Recibo" para começar.</p>
                </div>
            )}
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto text-center mt-12 text-gray-500 text-sm">
        <p>Desenvolvido com React, Tailwind CSS e Gemini API.</p>
      </footer>
    </div>
  );
}

export default App;
