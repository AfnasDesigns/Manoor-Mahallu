import React, { useState } from 'react';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Payment, Family } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface FinanceViewProps {
  payments: Payment[];
  families: Family[];
  onSelectReceipt: (p: Payment) => void;
  onRefreshPayments: () => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  payments,
  families,
  onSelectReceipt,
  onRefreshPayments,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  
  // Record Payment Modal
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState<string>(families[0]?.id || '');
  const [payCategory, setPayCategory] = useState<Payment['category']>('Mahallu Subscription');
  const [payAmount, setPayAmount] = useState<number>(500);
  const [payMethod, setPayMethod] = useState<'CASH' | 'UPI' | 'BANK_TRANSFER'>('UPI');
  const [payRemarks, setPayRemarks] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Record Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Salaries & Allowances');
  const [expenseAmount, setExpenseAmount] = useState<number>(10000);
  const [expensePaidTo, setExpensePaidTo] = useState('');
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const categories = [
    'ALL',
    'Mahallu Subscription',
    'Madrasa Fee',
    'Palli Contribution',
    'Zakat',
    'Sadaqah',
  ];

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.memberName.toLowerCase().includes(search.toLowerCase()) ||
      p.receiptNumber.toLowerCase().includes(search.toLowerCase()) ||
      p.houseName.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalInflow = payments.reduce((acc, p) => acc + p.amount, 0);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const fam = families.find((f) => f.id === selectedFamilyId);
    if (!fam) {
      alert('Please select a valid registered household.');
      return;
    }

    setSubmittingPayment(true);
    try {
      const newPay = await api.createPayment({
        familyId: fam.id,
        memberName: fam.headName,
        houseName: fam.houseName,
        category: payCategory,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        remarks: payRemarks || `${payCategory} collected`,
      });
      setShowPayModal(false);
      onRefreshPayments();
      // automatically open the generated receipt
      onSelectReceipt(newPay);
    } catch (err: any) {
      alert(err.message || 'Payment recording failed');
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleRecordExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount || !expensePaidTo) {
      alert('Please fill in expense title, amount, and recipient.');
      return;
    }

    setSubmittingExpense(true);
    try {
      await api.createTransaction({
        type: 'EXPENSE',
        category: expenseCategory,
        amount: Number(expenseAmount),
        date: new Date().toISOString().split('T')[0],
        description: expenseTitle,
        party: expensePaidTo,
        paymentMethod: 'BANK TRANSFER',
        createdBy: 'Treasurer',
      });
      setShowExpenseModal(false);
      setExpenseTitle('');
      setExpensePaidTo('');
      alert('Expense recorded in general ledger.');
    } catch (err: any) {
      alert(err.message || 'Expense recording failed');
    } finally {
      setSubmittingExpense(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Treasury & Baitul Maal
          </span>
          <h1 className="font-display text-2xl font-black text-gray-950 mt-1">
            Financial Ledger & Collections
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Transparent tracking of Mahallu subscriptions, Zakat distributions, and institutional disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ArrowUpRight className="w-4 h-4 text-red-600" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={() => setShowPayModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Collect Payment</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Total Recorded Collections</span>
          <div className="font-mono text-2xl font-black text-emerald-800 mt-1">
            ₹{totalInflow.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            From {payments.length} verified treasury transactions
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Monthly Operating Budget</span>
          <div className="font-mono text-2xl font-black text-gray-900 mt-1">
            ₹1,93,500
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Salaries (Khateeb, Muezzin, Usthad), KSEB & water
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Zakat & Relief Reserve</span>
          <div className="font-mono text-2xl font-black text-emerald-900 mt-1">
            ₹3,18,000
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">
            Designated for medical & student grants
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member, receipt #, or house..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl border border-gray-200/80 overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Receipt #</th>
                <th className="p-4">Member & House</th>
                <th className="p-4">Category</th>
                <th className="p-4">Date</th>
                <th className="p-4">Method</th>
                <th className="p-4 text-right">Amount (₹)</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="p-4 font-mono font-bold text-emerald-800">
                    {pay.receiptNumber}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{pay.memberName}</div>
                    <div className="text-[11px] text-gray-500">{pay.houseName}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                      {pay.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-600">
                    {pay.date}
                  </td>
                  <td className="p-4 font-semibold text-gray-700">
                    {pay.paymentMethod}
                  </td>
                  <td className="p-4 font-mono font-black text-gray-950 text-right text-sm">
                    ₹{pay.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onSelectReceipt(pay)}
                      className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-100 hover:text-emerald-900 text-gray-700 font-bold text-xs inline-flex items-center gap-1 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>View Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-950">
                Record Inflow Payment
              </h3>
              <button
                onClick={() => setShowPayModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Registered Household *</label>
                <select
                  value={selectedFamilyId}
                  onChange={(e) => setSelectedFamilyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                >
                  {families.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.houseName} — {f.headName} ({f.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Contribution Head</label>
                  <select
                    value={payCategory}
                    onChange={(e) => setPayCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Mahallu Subscription">Mahallu Subscription</option>
                    <option value="Madrasa Fee">Madrasa Fee</option>
                    <option value="Palli Contribution">Palli Contribution</option>
                    <option value="Zakat">Zakat</option>
                    <option value="Sadaqah">Sadaqah</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['CASH', 'UPI', 'BANK_TRANSFER'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setPayMethod(m)}
                      className={`py-2 text-[11px] font-bold rounded-xl border transition-all ${
                        payMethod === m
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notes / Remarks</label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  placeholder="e.g. March 2026 subscription"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPayment}
                  className="px-5 py-2 rounded-xl bg-emerald-800 text-white font-bold"
                >
                  {submittingPayment ? 'Processing...' : 'Issue Official Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-950">
                Disburse Treasury Expense
              </h3>
              <button
                onClick={() => setShowExpenseModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Expense Voucher Description *</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Mosque Electricity Bill - Feb 2026"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Expense Head</label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                  >
                    <option value="Salaries & Allowances">Salaries & Allowances</option>
                    <option value="Electricity & Utilities">Electricity & Utilities</option>
                    <option value="Mosque Maintenance">Mosque Maintenance</option>
                    <option value="Madrasa Stationery">Madrasa Stationery</option>
                    <option value="Community Welfare">Community Welfare</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Paid To / Vendor *</label>
                <input
                  type="text"
                  required
                  value={expensePaidTo}
                  onChange={(e) => setExpensePaidTo(e.target.value)}
                  placeholder="e.g. KSEB Electrical Section / Usthad"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="px-5 py-2 rounded-xl bg-gray-900 text-white font-bold"
                >
                  {submittingExpense ? 'Recording...' : 'Debit from Treasury'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
