
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptData } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const receiptSchema = {
  type: Type.OBJECT,
  properties: {
    depositDate: { type: Type.STRING, description: 'A data do depósito, no formato DD/MM/AAAA.' },
    amount: { type: Type.NUMBER, description: 'O valor total do depósito como um número.' },
    financialInstitution: { type: Type.STRING, description: 'O nome do banco ou instituição financeira de origem.' },
    depositorName: { type: Type.STRING, description: 'O nome completo da pessoa que fez o depósito. Se não estiver explícito, pode ser inferido.' },
    accountNumber: { type: Type.STRING, description: 'O número da conta e/ou agência de destino.' },
  },
  required: ['depositDate', 'amount', 'financialInstitution', 'depositorName', 'accountNumber']
};

export const analyzeReceipt = async (imageFile: File): Promise<ReceiptData> => {
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please set the API_KEY environment variable.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imagePart = await fileToGenerativePart(imageFile);

  const prompt = "Você é um especialista em extrair informações de recibos de depósito bancário. Analise a imagem fornecida e extraia os campos solicitados. Responda apenas com um objeto JSON válido que corresponda ao esquema fornecido. Se alguma informação não estiver claramente visível, use o valor `null` para esse campo.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: receiptSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);
    
    // Validate that the parsed data conforms to the ReceiptData interface
    const validatedData: ReceiptData = {
      depositDate: typeof parsedData.depositDate === 'string' ? parsedData.depositDate : null,
      amount: typeof parsedData.amount === 'number' ? parsedData.amount : null,
      financialInstitution: typeof parsedData.financialInstitution === 'string' ? parsedData.financialInstitution : null,
      depositorName: typeof parsedData.depositorName === 'string' ? parsedData.depositorName : null,
      accountNumber: typeof parsedData.accountNumber === 'string' ? parsedData.accountNumber : null,
    };
    
    return validatedData;

  } catch (error) {
    console.error("Error analyzing receipt with Gemini:", error);
    throw new Error("Falha ao analisar o recibo. Verifique o console para mais detalhes.");
  }
};
