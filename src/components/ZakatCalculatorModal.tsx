import React, { useState } from 'react';
import {
  ShieldCheck,
  Calculator,
  Coins,
  Scale,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { api } from '../lib/api.ts';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ZakatCalculatorModal: React.FC<ZakatCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [suiteTab, setSuiteTab] = useState<'ZAKAT' | 'WARASATH'>('ZAKAT');

  // Zakat state
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [goldRate, setGoldRate] = useState<number>(6850);
  const [silverGrams, setSilverGrams] = useState<number>(0);
  const [silverRate, setSilverRate] = useState<number>(88);
  const [cashInHand, setCashInHand] = useState<number>(0);
  const [bankBalance, setBankBalance] = useState<number>(0);
  const [businessStock, setBusinessStock] = useState<number>(0);
  const [loansReceivable, setLoansReceivable] = useState<number>(0);
  const [debtsPayable, setDebtsPayable] = useState<number>(0);
  const [nisabStandard, setNisabStandard] = useState<'GOLD' | 'SILVER'>('GOLD');

  // Warasath state
  const [deceasedGender, setDeceasedGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [grossEstate, setGrossEstate] = useState<number>(5000000);
  const [funeralCosts, setFuneralCosts] = useState<number>(25000);
  const [debts, setDebts] = useState<number>(100000);
  const [bequests, setBequests] = useState<number>(0);
  const [spouseCount, setSpouseCount] = useState<number>(1);
  const [hasSons, setHasSons] = useState<boolean>(true);
  const [sonsCount, setSonsCount] = useState<number>(2);
  const [hasDaughters, setHasDaughters] = useState<boolean>(true);
  const [daughtersCount, setDaughtersCount] = useState<number>(1);
  const [hasMother, setHasMother] = useState<boolean>(true);
  const [hasFather, setHasFather] = useState<boolean>(false);
  const [warasathResult, setWarasathResult] = useState<any | null>(null);
  const [calculatingWarasath, setCalculatingWarasath] = useState(false);

  if (!isOpen) return null;

  // Real-time Zakat calculation
  const goldTotal = goldGrams * goldRate;
  const silverTotal = silverGrams * silverRate;
  const totalAssets = goldTotal + silverTotal + Number(cashInHand) + Number(bankBalance) + Number(businessStock) + Number(loansReceivable);
  const netZakatableWealth = Math.max(0, totalAssets - Number(debtsPayable));

  const nisabThreshold = nisabStandard === 'GOLD' ? 85 * goldRate : 595 * silverRate;
  const meetsNisab = netZakatableWealth >= nisabThreshold;
  const zakatPayable = meetsNisab ? Math.round(netZakatableWealth * 0.025) : 0;

  const handleComputeWarasath = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculatingWarasath(true);
    try {
      const res = await api.calculateWarasath({
        deceasedGender,
        grossEstate,
        funeralExpenses: funeralCosts,
        debts,
        bequests,
        spouseCount,
        hasSons,
        sonsCount,
        hasDaughters,
        daughtersCount,
        hasFather,
        hasMother,
      });
      setWarasathResult(res);
    } catch (e: any) {
      alert(e.message || 'Warasath computation failed');
    } finally {
      setCalculatingWarasath(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Islamic Jurisprudence Tools
            </span>
            <h2 className="font-display text-2xl font-black text-gray-950 mt-1">
              {suiteTab === 'ZAKAT' ? 'Manoor Zakat Calculator' : 'Warasath (Inheritance) Engine'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-2xl">
          <button
            onClick={() => setSuiteTab('ZAKAT')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              suiteTab === 'ZAKAT'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Coins className="w-4 h-4 text-emerald-700" />
            <span>Zakat Calculator (2.5%)</span>
          </button>
          <button
            onClick={() => setSuiteTab('WARASATH')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              suiteTab === 'WARASATH'
                ? 'bg-white text-emerald-950 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Warasath Estate Division</span>
          </button>
        </div>

        {suiteTab === 'ZAKAT' ? (
          <div className="space-y-6">
            
            {/* Nisab Benchmark Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>2026 Kerala Nisab Threshold</span>
                </div>
                <div className="text-[11px] text-emerald-700/90 mt-0.5">
                  Gold: 85 Grams (₹{(85 * goldRate).toLocaleString('en-IN')}) | Silver: 595 Grams (₹{(595 * silverRate).toLocaleString('en-IN')})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-emerald-800">Standard:</span>
                <select
                  value={nisabStandard}
                  onChange={(e) => setNisabStandard(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-900 focus:outline-none"
                >
                  <option value="GOLD">Gold (85g)</option>
                  <option value="SILVER">Silver (595g)</option>
                </select>
              </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Gold */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gold Quantity (Grams)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={goldGrams || ''}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
                  />
                  <span className="text-xs text-gray-500 font-mono">g</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Valued at: ₹{goldTotal.toLocaleString('en-IN')} (@ ₹{goldRate}/g)
                </div>
              </div>

              {/* Silver */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Silver Quantity (Grams)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={silverGrams || ''}
                    onChange={(e) => setSilverGrams(Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
                  />
                  <span className="text-xs text-gray-500 font-mono">g</span>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  Valued at: ₹{silverTotal.toLocaleString('en-IN')} (@ ₹{silverRate}/g)
                </div>
              </div>

              {/* Cash in Hand */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Liquid Cash in Hand (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashInHand || ''}
                  onChange={(e) => setCashInHand(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
                />
              </div>

              {/* Bank Balances */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bank Savings & Fixed Deposits (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bankBalance || ''}
                  onChange={(e) => setBankBalance(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
                />
              </div>

              {/* Business Merchandise */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Business Inventory / Merchandise (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={businessStock || ''}
                  onChange={(e) => setBusinessStock(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold bg-white"
                />
                <span className="text-[10px] text-gray-500">Wholesale cost value</span>
              </div>

              {/* Deductible Short-term Debts */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200">
                <label className="block text-xs font-bold text-red-900 mb-1">
                  Less: Immediate Debts Due (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={debtsPayable || ''}
                  onChange={(e) => setDebtsPayable(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-xl border border-red-200 text-sm font-semibold bg-white text-red-900"
                />
                <span className="text-[10px] text-red-700">Deductible liabilities</span>
              </div>

            </div>

            {/* Results Card */}
            <div className="p-6 rounded-3xl bg-emerald-950 text-white space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-800">
                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-300">
                    Net Zakatable Wealth
                  </div>
                  <div className="font-mono text-2xl sm:text-3xl font-black text-white mt-1">
                    ₹{netZakatableWealth.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="sm:text-right">
                  <div className="text-xs uppercase tracking-wider text-emerald-300">
                    Nisab Status ({nisabStandard})
                  </div>
                  <div className="mt-1">
                    {meetsNisab ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-800 text-emerald-200 border border-emerald-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Exceeds Nisab (Liable)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-amber-900/60 text-amber-200 border border-amber-700">
                        Below Nisab (No Zakat Due)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs text-emerald-200">
                    Total Zakat Payable (2.5% Rate):
                  </div>
                  <div className="text-3xl sm:text-4xl font-mono font-black text-emerald-300 mt-1">
                    ₹{zakatPayable.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="text-right text-xs text-emerald-200/80 max-w-xs">
                  Subject to one complete lunar year (Hawl) having passed on surplus wealth.
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Warasath Suite */
          <div className="space-y-6">
            <form onSubmit={handleComputeWarasath} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Deceased Person's Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeceasedGender('MALE')}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        deceasedGender === 'MALE'
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      Male (Late Brother/Father)
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeceasedGender('FEMALE')}
                      className={`py-2 text-xs font-bold rounded-xl border ${
                        deceasedGender === 'FEMALE'
                          ? 'bg-emerald-800 text-white border-emerald-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                    >
                      Female (Late Sister/Mother)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Gross Estate Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={grossEstate}
                    onChange={(e) => setGrossEstate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm font-semibold"
                  />
                </div>
              </div>

              {/* Deductions */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Funeral & Shroud Costs (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={funeralCosts}
                    onChange={(e) => setFuneralCosts(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Outstanding Debts (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={debts}
                    onChange={(e) => setDebts(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Valid Wasiyyah / Bequest (Max 1/3)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bequests}
                    onChange={(e) => setBequests(Number(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold bg-white"
                  />
                </div>
              </div>

              {/* Heirs composition */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-800">Surviving Legal Heirs:</span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  
                  {/* Spouses */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <label className="block font-bold text-gray-700 mb-1">
                      {deceasedGender === 'MALE' ? 'Surviving Wife/Wives' : 'Surviving Husband'}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={deceasedGender === 'MALE' ? 4 : 1}
                      value={spouseCount}
                      onChange={(e) => setSpouseCount(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-gray-300 font-bold bg-white"
                    />
                  </div>

                  {/* Sons */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <label className="block font-bold text-gray-700 mb-1">
                      Number of Sons
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={sonsCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSonsCount(val);
                        setHasSons(val > 0);
                      }}
                      className="w-full px-2 py-1 rounded border border-gray-300 font-bold bg-white"
                    />
                  </div>

                  {/* Daughters */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <label className="block font-bold text-gray-700 mb-1">
                      Number of Daughters
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={daughtersCount}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setDaughtersCount(val);
                        setHasDaughters(val > 0);
                      }}
                      className="w-full px-2 py-1 rounded border border-gray-300 font-bold bg-white"
                    />
                  </div>

                  {/* Parents checkboxes */}
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-center space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasMother}
                        onChange={(e) => setHasMother(e.target.checked)}
                        className="rounded text-emerald-800"
                      />
                      <span className="font-semibold text-gray-800">Mother Alive</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasFather}
                        onChange={(e) => setHasFather(e.target.checked)}
                        className="rounded text-emerald-800"
                      />
                      <span className="font-semibold text-gray-800">Father Alive</span>
                    </label>
                  </div>

                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={calculatingWarasath}
                  className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-900/10"
                >
                  {calculatingWarasath ? 'Computing...' : 'Calculate Shariah Shares'}
                </button>
              </div>

            </form>

            {/* Warasath Result Table */}
            {warasathResult && (
              <div className="p-5 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Net Distributable Estate: <span className="font-mono text-sm text-gray-900 font-extrabold">₹{warasathResult.netEstate.toLocaleString('en-IN')}</span>
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    SCHOLAR REVIEW MANDATORY
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-100 text-gray-700">
                      <tr>
                        <th className="p-2.5 rounded-l-xl">Heir Category</th>
                        <th className="p-2.5">Count</th>
                        <th className="p-2.5">Quranic Share</th>
                        <th className="p-2.5">Percentage</th>
                        <th className="p-2.5 rounded-r-xl text-right">Allocated Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {warasathResult.heirs.map((h: any, idx: number) => (
                        <tr key={idx} className="hover:bg-white/80">
                          <td className="p-2.5 font-bold text-gray-900">{h.relation}</td>
                          <td className="p-2.5 text-gray-600">{h.count}</td>
                          <td className="p-2.5 font-mono text-emerald-800 font-semibold">{h.shareFraction}</td>
                          <td className="p-2.5 text-gray-700">{h.sharePercentage}%</td>
                          <td className="p-2.5 font-mono font-bold text-right text-gray-900">
                            ₹{h.allocatedAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-gray-500 leading-relaxed italic border-t border-gray-200 pt-3">
                  {warasathResult.disclaimer}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
