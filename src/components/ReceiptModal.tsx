import React from 'react';
import {
  Printer,
  CheckCircle2,
  Download,
  Building,
  Calendar,
  FileCheck
} from 'lucide-react';
import { Payment } from '../types/index.ts';

interface ReceiptModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  onClose,
}) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Official Treasury Receipt
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-50/20 border-2 border-emerald-700/30 relative space-y-6 print:border-black print:m-0 print:p-8">
          
          {/* Top Mahallu Header */}
          <div className="text-center space-y-1 pb-4 border-b border-emerald-200/80">
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-900 uppercase tracking-widest bg-emerald-100 px-3 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Verified Transaction
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-gray-950 tracking-tight pt-1">
              MANOOR MAHALL JUMA MASJID COMMITTEE
            </h2>
            <p className="text-[11px] text-gray-600">
              Manoor, Malappuram, Kerala 676505 • Reg No: WKB-MLP-2024-118
            </p>
            <div className="font-mono text-xs font-bold text-emerald-900 pt-1">
              RECEIPT NO: {payment.receiptNumber}
            </div>
          </div>

          {/* Receipt Details Grid */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-gray-200">
              <div>
                <span className="text-gray-500 block text-[10px]">Payment Date:</span>
                <span className="font-mono font-bold text-gray-900">{payment.date}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-500 block text-[10px]">Payment Method:</span>
                <span className="font-bold text-gray-900">{payment.paymentMethod}</span>
              </div>
            </div>

            <div>
              <span className="text-gray-500 block text-[10px]">Received From:</span>
              <div className="font-display font-bold text-sm text-gray-950">
                {payment.memberName}
              </div>
              <div className="text-gray-600 text-xs">
                {payment.houseName} {payment.familyId ? `(Family ID: ${payment.familyId})` : ''}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-emerald-100 flex items-center justify-between">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">
                  Contribution Purpose / Head
                </span>
                <span className="font-bold text-emerald-900 text-sm">
                  {payment.category}
                </span>
                {payment.remarks && (
                  <p className="text-[11px] text-gray-500 mt-0.5">{payment.remarks}</p>
                )}
              </div>

              <div className="text-right">
                <span className="text-gray-500 block text-[10px] uppercase tracking-wider">
                  Amount Received
                </span>
                <span className="font-mono text-xl sm:text-2xl font-black text-gray-950">
                  ₹{payment.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {payment.transactionId && (
              <div className="font-mono text-[11px] text-gray-500">
                Ref / Txn ID: {payment.transactionId}
              </div>
            )}
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-emerald-200/80 flex items-end justify-between text-xs">
            <div>
              <div className="w-16 h-10 border-b border-gray-400 mb-1"></div>
              <div className="text-[10px] font-bold text-gray-700">Official Seal</div>
              <div className="text-[9px] text-emerald-800">Manoor Mahall Treasury</div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-gray-900">
                {payment.authorizedPerson || 'K. Mohammed Ashraf (Treasurer)'}
              </div>
              <div className="text-[10px] font-bold text-gray-700">Authorized Signatory</div>
              <div className="text-[9px] text-gray-500">Honorary Treasurer</div>
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 rounded-xl bg-gray-950 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-gray-900/10"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

      </div>
    </div>
  );
};
