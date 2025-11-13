
import React from 'react';
import { ReceiptData } from '../types';

interface ReceiptDataDisplayProps {
  data: ReceiptData;
}

const DataRow: React.FC<{ label: string; value: string | number | null }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-700">
    <dt className="text-sm font-medium text-gray-400">{label}</dt>
    <dd className="mt-1 text-sm text-gray-100 sm:mt-0 sm:col-span-2 text-right">{value ?? 'N/A'}</dd>
  </div>
);

const ReceiptDataDisplay: React.FC<ReceiptDataDisplayProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden w-full">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-white">
          Informações Extraídas do Recibo
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-400">
          Dados analisados pela IA do Gemini.
        </p>
      </div>
      <div className="border-t border-gray-700">
        <dl className="px-4 py-5 sm:p-6 sm:grid-cols-3 sm:gap-4">
          <DataRow label="Data do Depósito" value={data.depositDate} />
          <DataRow label="Valor" value={data.amount !== null ? `R$ ${data.amount.toFixed(2).replace('.', ',')}` : null} />
          <DataRow label="Instituição Financeira" value={data.financialInstitution} />
          <DataRow label="Nome do Depositante" value={data.depositorName} />
          <DataRow label="Conta / Agência" value={data.accountNumber} />
        </dl>
      </div>
    </div>
  );
};

export default ReceiptDataDisplay;
