import React, { useState, useEffect } from 'react';
import {
  Coins,
  Calculator,
  RotateCcw,
  Save,
  Printer,
  Download,
  ShieldCheck,
  AlertTriangle,
  Settings,
  History,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Info,
  Scale,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { User, ZakatConfiguration, ZakatCalculationRecord } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface ZakatCalculatorPageProps {
  currentUser: User | null;
  onBack?: () => void;
  onOpenAuth?: () => void;
}

export const ZakatCalculatorPage: React.FC<ZakatCalculatorPageProps> = ({
  currentUser,
  onBack,
  onOpenAuth,
}) => {
  // Step indicator (1 to 4)
  const [activeStep, setActiveStep] = useState<number>(1);

  // Configuration
  const [config, setConfig] = useState<ZakatConfiguration>({
    id: 'zakat-config-1',
    goldPricePerGram: 6850,
    silverPricePerGram: 88,
    goldNisabGrams: 85,
    silverNisabGrams: 595,
    standardZakatRate: 0.025,
    ushrRainfedRate: 0.10,
    ushrIrrigatedRate: 0.05,
    defaultNisabStandard: 'GOLD',
    methodologyNotes: 'Standard Shafi & Hanafi Zakat calculation methodology based on Gold and Silver Nisab thresholds.',
    updatedAt: '2026-09-01T00:00:00.000Z',
    updatedBy: 'Chief Qazi, Manoor Mahall',
  });

  const [nisabStandard, setNisabStandard] = useState<'GOLD' | 'SILVER'>('GOLD');

  // Asset inputs
  const [goldGrams, setGoldGrams] = useState<string>('0');
  const [goldValueOverride, setGoldValueOverride] = useState<string>('');
  const [silverGrams, setSilverGrams] = useState<string>('0');
  const [silverValueOverride, setSilverValueOverride] = useState<string>('');
  const [cashInHand, setCashInHand] = useState<string>('0');
  const [bankBalance, setBankBalance] = useState<string>('0');

  const [businessStock, setBusinessStock] = useState<string>('0');
  const [agriculturalHarvestValue, setAgriculturalHarvestValue] = useState<string>('0');
  const [agriculturalIrrigationType, setAgriculturalIrrigationType] = useState<'RAINFED' | 'IRRIGATED'>('RAINFED');
  const [livestockValue, setLivestockValue] = useState<string>('0');

  const [loansReceivable, setLoansReceivable] = useState<string>('0');
  const [otherEligibleAssets, setOtherEligibleAssets] = useState<string>('0');

  // Liabilities / deductions
  const [immediateDebts, setImmediateDebts] = useState<string>('0');
  const [pendingBillsTaxes, setPendingBillsTaxes] = useState<string>('0');
  const [dueWages, setDueWages] = useState<string>('0');
  const [otherLiabilities, setOtherLiabilities] = useState<string>('0');

  // Calculation Results
  const [result, setResult] = useState<any | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationTitle, setCalculationTitle] = useState<string>(`Zakat Calculation - ${new Date().getFullYear()}`);

  // Saved calculations drawer
  const [savedRecords, setSavedRecords] = useState<ZakatCalculationRecord[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');

  // Scholar/Admin Config Modal
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [adminConfigForm, setAdminConfigForm] = useState<Partial<ZakatConfiguration>>({});

  const isAdminOrScholar = currentUser && [
    'SUPER ADMIN', 'SECRETARY', 'TREASURER', 'COMMITTEE', 'MADRASA ADMIN'
  ].includes(currentUser.role);

  // Load config & saved calculations
  useEffect(() => {
    loadConfig();
    if (currentUser) {
      loadSavedCalculations();
    }
  }, [currentUser]);

  const loadConfig = async () => {
    try {
      const cfg = await api.getZakatConfig();
      if (cfg) {
        setConfig(cfg);
        setNisabStandard(cfg.defaultNisabStandard || 'GOLD');
        setAdminConfigForm(cfg);
      }
    } catch (e) {
      console.warn('Failed to load Zakat config:', e);
    }
  };

  const loadSavedCalculations = async () => {
    try {
      const list = await api.getMyZakatCalculations();
      if (list) setSavedRecords(list);
    } catch (e) {
      console.warn('Failed to load saved Zakat records:', e);
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const payload = {
        nisabStandard,
        goldGrams: parseFloat(goldGrams) || 0,
        goldValue: goldValueOverride ? parseFloat(goldValueOverride) : undefined,
        silverGrams: parseFloat(silverGrams) || 0,
        silverValue: silverValueOverride ? parseFloat(silverValueOverride) : undefined,
        cashInHand: parseFloat(cashInHand) || 0,
        bankBalance: parseFloat(bankBalance) || 0,
        businessStock: parseFloat(businessStock) || 0,
        agriculturalHarvestValue: parseFloat(agriculturalHarvestValue) || 0,
        agriculturalIrrigationType,
        livestockValue: parseFloat(livestockValue) || 0,
        loansReceivable: parseFloat(loansReceivable) || 0,
        otherEligibleAssets: parseFloat(otherEligibleAssets) || 0,
        immediateDebts: parseFloat(immediateDebts) || 0,
        pendingBillsTaxes: parseFloat(pendingBillsTaxes) || 0,
        dueWages: parseFloat(dueWages) || 0,
        otherLiabilities: parseFloat(otherLiabilities) || 0,
      };

      const res = await api.calculateZakat(payload);
      setResult(res);
      setActiveStep(4); // jump to summary view
    } catch (e: any) {
      alert(e.message || 'Error executing Zakat calculation');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setGoldGrams('0');
    setGoldValueOverride('');
    setSilverGrams('0');
    setSilverValueOverride('');
    setCashInHand('0');
    setBankBalance('0');
    setBusinessStock('0');
    setAgriculturalHarvestValue('0');
    setLivestockValue('0');
    setLoansReceivable('0');
    setOtherEligibleAssets('0');
    setImmediateDebts('0');
    setPendingBillsTaxes('0');
    setDueWages('0');
    setOtherLiabilities('0');
    setResult(null);
    setActiveStep(1);
    setSaveSuccessMsg('');
  };

  const handleSave = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      else alert('Please sign in to save your calculation to your member account.');
      return;
    }
    if (!result) {
      await handleCalculate();
    }

    try {
      const payload = {
        title: calculationTitle,
        year: new Date().getFullYear(),
        nisabStandard,
        goldPricePerGram: result?.goldPricePerGram || config.goldPricePerGram,
        silverPricePerGram: result?.silverPricePerGram || config.silverPricePerGram,
        nisabValue: result?.nisabValue || (nisabStandard === 'GOLD' ? config.goldNisabGrams * config.goldPricePerGram : config.silverNisabGrams * config.silverPricePerGram),
        totalAssets: result?.totalAssets || 0,
        deductibleLiabilities: result?.deductibleLiabilities || 0,
        netZakatableWealth: result?.netZakatableWealth || 0,
        zakatPayable: result?.zakatDue || 0,
        assets: result?.assets || {},
        deductions: result?.deductions || {},
        methodologyVersion: result?.methodologyVersion || 'Manoor Mahall Standard Fiqh',
      };

      await api.saveZakatCalculation(payload);
      setSaveSuccessMsg('Calculation saved successfully to your member profile!');
      loadSavedCalculations();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to save calculation');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Standard cross-browser PDF generation using print layout trigger
    window.print();
  };

  const handleSaveAdminConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await api.updateZakatConfig(adminConfigForm);
      setConfig(updated);
      setShowConfigModal(false);
      alert('Zakat methodology and market rates updated successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to update Zakat configuration');
    }
  };

  const handleDeleteSavedRecord = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved calculation?')) return;
    try {
      await api.deleteZakatCalculation(id);
      loadSavedCalculations();
    } catch (e: any) {
      alert(e.message || 'Failed to delete record');
    }
  };

  // Nisab benchmarks
  const currentGoldNisab = config.goldNisabGrams * config.goldPricePerGram;
  const currentSilverNisab = config.silverNisabGrams * config.silverPricePerGram;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                id="btn-zakat-back"
                onClick={onBack}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  Zakat Calculator
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Manoor Mahall Islamic Wealth & Ushr Engine • Fiqh Compliant
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                id="btn-saved-zakat"
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <History className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">My Calculations</span>
                {savedRecords.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {savedRecords.length}
                  </span>
                )}
              </button>
            )}

            {isAdminOrScholar && (
              <button
                id="btn-zakat-config"
                onClick={() => setShowConfigModal(true)}
                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/60 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Configure Rates & Methodology"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Methodology Config</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* MANDATORY DISCLAIMER BANNER */}
        <div className="bg-amber-50/80 border-l-4 border-amber-500 p-4 rounded-r-2xl shadow-2xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-extrabold uppercase tracking-wide block sm:inline">
              PRELIMINARY CALCULATION — REVIEW WITH A QUALIFIED SCHOLAR WHERE APPROPRIATE.
            </span>{' '}
            <span>
              This calculator provides automated estimates under standard Shafi'i and Hanafi jurisprudence approved by the Mahallu Council. Complex wealth, dispute receivables, mixed stocks, and multi-year Hawl exemptions should be certified with the Mahallu Qazi.
            </span>
          </div>
        </div>

        {/* Live Nisab Reference Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="font-bold text-amber-900">Gold Nisab (85g 24K):</span>
            <span className="font-extrabold text-amber-950 font-mono text-sm">
              ₹{currentGoldNisab.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-start gap-3 p-2.5 rounded-xl bg-slate-100 border border-slate-200">
            <span className="font-bold text-slate-700">Silver Nisab (595g):</span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">
              ₹{currentSilverNisab.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 p-2.5">
            <span className="text-slate-500 font-medium">Benchmark Standard:</span>
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setNisabStandard('GOLD')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  nisabStandard === 'GOLD' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gold
              </button>
              <button
                type="button"
                onClick={() => setNisabStandard('SILVER')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  nisabStandard === 'SILVER' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Silver
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-Step Navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-xs">
            <button
              onClick={() => setActiveStep(1)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 1 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>Gold, Silver & Cash</span>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 2 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>Business, Crops & Animals</span>
            </button>

            <button
              onClick={() => setActiveStep(3)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 3 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>Receivables & Debts</span>
            </button>

            <button
              onClick={() => {
                handleCalculate();
                setActiveStep(4);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 4 ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] flex items-center justify-center font-bold">4</span>
              <span>Zakat Summary & Due</span>
            </button>
          </div>
        </div>

        {/* STEP 1: Gold, Silver, Cash & Bank */}
        {activeStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Step 1: Precious Metals & Monetary Liquidity
              </h2>
              <p className="text-xs text-slate-500">
                Include gold jewelry (exceeding customary usage if following Shafi'i, or all gold under Hanafi), silver, liquid cash, and bank balances held for a lunar year.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gold */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <span>🟡 Gold (Grams)</span>
                  </label>
                  <span className="text-[11px] font-mono text-amber-800">
                    Rate: ₹{config.goldPricePerGram}/g
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={goldGrams}
                  onChange={(e) => setGoldGrams(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g. 100"
                />
                <div className="flex items-center justify-between text-[11px] text-amber-800">
                  <span>Computed Gold Value:</span>
                  <span className="font-bold font-mono">
                    ₹{((parseFloat(goldGrams) || 0) * config.goldPricePerGram).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Silver */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>⚪ Silver (Grams)</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-600">
                    Rate: ₹{config.silverPricePerGram}/g
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={silverGrams}
                  onChange={(e) => setSilverGrams(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g. 600"
                />
                <div className="flex items-center justify-between text-[11px] text-slate-700">
                  <span>Computed Silver Value:</span>
                  <span className="font-bold font-mono">
                    ₹{((parseFloat(silverGrams) || 0) * config.silverPricePerGram).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Cash in Hand */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900">
                  💵 Cash in Hand (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cashInHand}
                  onChange={(e) => setCashInHand(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">Physical currency, drawer cash, and home reserves.</p>
              </div>

              {/* Bank Balance */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900">
                  🏦 Bank Balances & Savings (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={bankBalance}
                  onChange={(e) => setBankBalance(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">Savings accounts, checking/current, and term deposits.</p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Next: Business & Agriculture</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Business Assets, Agricultural Produce & Livestock */}
        {activeStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Step 2: Business Merchandise, Crops & Livestock
              </h2>
              <p className="text-xs text-slate-500">
                Include wholesale/retail stock for trade, agricultural harvests subject to Ushr, and grazing animals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Assets */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900">
                  🏢 Business Inventory / Tradable Stock (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={businessStock}
                  onChange={(e) => setBusinessStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">Valued at current wholesale/market price intended for sale.</p>
              </div>

              {/* Agricultural Assets (Ushr) */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-emerald-950">
                    🌾 Agricultural Harvest Value (₹)
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-800">
                    Ushr Rate: {agriculturalIrrigationType === 'RAINFED' ? '10%' : '5%'}
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  value={agriculturalHarvestValue}
                  onChange={(e) => setAgriculturalHarvestValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  placeholder="0"
                />
                <div className="flex items-center gap-4 text-xs text-emerald-900">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="irrigation"
                      checked={agriculturalIrrigationType === 'RAINFED'}
                      onChange={() => setAgriculturalIrrigationType('RAINFED')}
                    />
                    <span>Rain-fed (10% Ushr)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="irrigation"
                      checked={agriculturalIrrigationType === 'IRRIGATED'}
                      onChange={() => setAgriculturalIrrigationType('IRRIGATED')}
                    />
                    <span>Artificially Irrigated (5% Ushr)</span>
                  </label>
                </div>
              </div>

              {/* Livestock */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 md:col-span-2">
                <label className="text-xs font-bold text-slate-900">
                  🐪 Livestock / Commercial Grazing Animal Wealth (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={livestockValue}
                  onChange={(e) => setLivestockValue(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">
                  Enter estimated value of commercial herds (cattle, goats, sheep) kept for breeding/sale.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Next: Receivables & Liabilities</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Receivables, Other Assets & Liabilities */}
        {activeStep === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                Step 3: Receivables & Deductible Liabilities
              </h2>
              <p className="text-xs text-slate-500">
                Include loans given that you expect to recover, and deduct short-term debts and due bills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Receivables */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900">
                  📑 Strong Receivables / Good Debts Owed to You (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={loansReceivable}
                  onChange={(e) => setLoansReceivable(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">Loans or sales credit you expect to be repaid promptly.</p>
              </div>

              {/* Other Assets */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-900">
                  📈 Other Eligible Assets (Shares, Funds, Cryptos) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={otherEligibleAssets}
                  onChange={(e) => setOtherEligibleAssets(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-slate-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-slate-500">Shariah-compliant shares, mutual funds, or digital assets.</p>
              </div>

              {/* Deductions Header */}
              <div className="md:col-span-2 pt-2 border-t border-slate-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Deductible Liabilities & Immediate Obligations
                </h3>
              </div>

              {/* Immediate Debts */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                <label className="text-xs font-bold text-rose-950">
                  💳 Immediate Debts Due (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={immediateDebts}
                  onChange={(e) => setImmediateDebts(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-rose-700">Money owed to creditors that must be paid immediately.</p>
              </div>

              {/* Due Wages and Bills */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-3">
                <label className="text-xs font-bold text-rose-950">
                  🧾 Pending Bills, Rent & Due Wages (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={dueWages}
                  onChange={(e) => setDueWages(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-rose-200 rounded-xl text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  placeholder="0"
                />
                <p className="text-[11px] text-rose-700">Wages of workers, shop/house rent, and utility bills due.</p>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                type="button"
                onClick={handleCalculate}
                disabled={isCalculating}
                className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>{isCalculating ? 'Computing...' : 'Calculate Zakat Due'}</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Comprehensive Results & Actions (Print, PDF, Save, Reset) */}
        {activeStep === 4 && result && (
          <div className="space-y-6">
            
            {/* Success alert when saved */}
            {saveSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Print Header (Only visible during printing) */}
            <div className="hidden print:block text-center border-b pb-4 mb-4">
              <h1 className="text-2xl font-bold">MANOOR MAHALLU ISLAMIC JURISPRUDENCE COUNCIL</h1>
              <p className="text-sm text-gray-600">Official Zakat Computation Statement</p>
              <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>

            {/* Result Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Assets
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">
                  ₹{result.totalAssets.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">All eligible categories</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                  Deductions
                </span>
                <span className="text-xl font-extrabold text-rose-700 font-mono mt-1 block">
                  -₹{result.deductibleLiabilities.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Immediate debts & bills</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">
                  Net Zakatable Assets
                </span>
                <span className="text-xl font-extrabold text-blue-900 font-mono mt-1 block">
                  ₹{result.netZakatableWealth.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Subject to Nisab check</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                  Nisab Threshold
                </span>
                <span className="text-xl font-extrabold text-amber-900 font-mono mt-1 block">
                  ₹{result.nisabValue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-amber-700 mt-1 block font-semibold">
                  {result.meetsNisab ? '✓ Meets Nisab' : '✗ Below Nisab'}
                </span>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-2xl text-white shadow-md shadow-emerald-700/20 sm:col-span-2 lg:col-span-1">
                <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider block">
                  Zakat Due
                </span>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
                  ₹{result.zakatDue.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 block">
                  {result.meetsNisab ? 'Payable (2.5% + Ushr)' : 'No Zakat Due'}
                </span>
              </div>

            </div>

            {/* Detailed Asset Breakdown Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-base text-slate-900">
                  Itemized Asset & Deduction Breakdown
                </h3>
                <span className="text-xs text-slate-500 font-mono">
                  Methodology: {result.methodologyVersion}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {Object.entries(result.breakdown).map(([key, val]: [string, any]) => (
                  <div key={key} className="py-2.5 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{key}</span>
                    <span className={`font-mono font-bold ${val < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {val < 0 ? `-₹${Math.abs(val).toLocaleString('en-IN')}` : `₹${val.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ushr Details if applicable */}
              {result.agriculturalZakatDue > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                  <span>Agricultural Ushr Included:</span>
                  <span className="font-bold font-mono">₹{result.agriculturalZakatDue.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Title input for saving */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Calculation Label / Note:
                  </label>
                  <input
                    type="text"
                    value={calculationTitle}
                    onChange={(e) => setCalculationTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Ramadan 1447 / Annual Zakat"
                  />
                </div>

                {/* Print & Action Buttons */}
                <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Calculation</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SAVED CALCULATIONS DRAWER / LIST */}
        {showHistory && currentUser && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  My Saved Zakat Calculations ({savedRecords.length})
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {savedRecords.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                You have not saved any calculations yet. Use the calculator above and click "Save Calculation".
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedRecords.map((rec) => (
                  <div key={rec.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{rec.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {new Date(rec.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-3">
                        <span>Net Wealth: ₹{rec.netZakatableWealth.toLocaleString('en-IN')}</span>
                        <span>Nisab Standard: {rec.nisabStandard}</span>
                        <span className="font-bold text-emerald-700">Zakat Due: ₹{rec.zakatPayable.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setResult({
                            ...rec,
                            totalAssets: rec.totalAssets,
                            deductibleLiabilities: rec.deductibleLiabilities,
                            netZakatableWealth: rec.netZakatableWealth,
                            nisabValue: rec.nisabValue,
                            meetsNisab: rec.netZakatableWealth >= rec.nisabValue,
                            zakatDue: rec.zakatPayable,
                            breakdown: {
                              'Recorded Wealth': rec.netZakatableWealth,
                              'Deductions': -rec.deductibleLiabilities,
                            },
                          });
                          setActiveStep(4);
                          setShowHistory(false);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                      >
                        View
                      </button>

                      <button
                        onClick={() => handleDeleteSavedRecord(rec.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SCHOLAR / ADMIN CONFIGURATION MODAL */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Zakat Methodology & Rate Configuration
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveAdminConfig} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Gold Rate (₹ per gram)
                    </label>
                    <input
                      type="number"
                      required
                      value={adminConfigForm.goldPricePerGram || 6850}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, goldPricePerGram: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Silver Rate (₹ per gram)
                    </label>
                    <input
                      type="number"
                      required
                      value={adminConfigForm.silverPricePerGram || 88}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, silverPricePerGram: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Gold Nisab Grams
                    </label>
                    <input
                      type="number"
                      required
                      value={adminConfigForm.goldNisabGrams || 85}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, goldNisabGrams: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Silver Nisab Grams
                    </label>
                    <input
                      type="number"
                      required
                      value={adminConfigForm.silverNisabGrams || 595}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, silverNisabGrams: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Standard Wealth Rate (e.g. 0.025 for 2.5%)
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      required
                      value={adminConfigForm.standardZakatRate || 0.025}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, standardZakatRate: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Default Nisab Standard
                    </label>
                    <select
                      value={adminConfigForm.defaultNisabStandard || 'GOLD'}
                      onChange={(e) => setAdminConfigForm({ ...adminConfigForm, defaultNisabStandard: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    >
                      <option value="GOLD">Gold Standard (85g)</option>
                      <option value="SILVER">Silver Standard (595g)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfigModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Save Configuration
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
