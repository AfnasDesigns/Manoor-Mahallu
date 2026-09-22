import React, { useState, useEffect } from 'react';
import {
  Scale,
  Calculator,
  RotateCcw,
  Save,
  Printer,
  Download,
  Send,
  AlertTriangle,
  History,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Users,
  Building,
  CreditCard,
  FileCheck,
  Award,
  BookOpen,
  Info
} from 'lucide-react';
import { User, WarasathCase, InheritanceCalculationResult } from '../../types/index.ts';
import { api } from '../../lib/api.ts';

interface WarasathCalculatorPageProps {
  currentUser: User | null;
  onBack?: () => void;
  onOpenAuth?: () => void;
}

export const WarasathCalculatorPage: React.FC<WarasathCalculatorPageProps> = ({
  currentUser,
  onBack,
  onOpenAuth,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // 1. Deceased Information
  const [deceasedName, setDeceasedName] = useState<string>('Late Marhum');
  const [deceasedGender, setDeceasedGender] = useState<'MALE' | 'FEMALE'>('MALE');
  const [maritalStatus, setMaritalStatus] = useState<'MARRIED' | 'UNMARRIED' | 'WIDOWED' | 'DIVORCED'>('MARRIED');

  // 2. Legal Heirs Information
  const [spouseCount, setSpouseCount] = useState<number>(1);
  const [sonsCount, setSonsCount] = useState<number>(2);
  const [daughtersCount, setDaughtersCount] = useState<number>(1);
  const [hasFather, setHasFather] = useState<boolean>(false);
  const [hasMother, setHasMother] = useState<boolean>(true);
  const [hasPaternalGrandfather, setHasPaternalGrandfather] = useState<boolean>(false);
  const [hasPaternalGrandmother, setHasPaternalGrandmother] = useState<boolean>(false);
  const [hasMaternalGrandmother, setHasMaternalGrandmother] = useState<boolean>(false);
  const [fullBrothersCount, setFullBrothersCount] = useState<number>(0);
  const [fullSistersCount, setFullSistersCount] = useState<number>(0);

  // 3. Estate Assets
  const [cashInHand, setCashInHand] = useState<string>('50000');
  const [bankBalance, setBankBalance] = useState<string>('350000');
  const [goldValue, setGoldValue] = useState<string>('400000');
  const [landPropertyValue, setLandPropertyValue] = useState<string>('4000000');
  const [businessValue, setBusinessValue] = useState<string>('500000');
  const [otherAssetsValue, setOtherAssetsValue] = useState<string>('0');

  // 4. Deductions Before Distribution
  const [funeralExpenses, setFuneralExpenses] = useState<string>('25000');
  const [debts, setDebts] = useState<string>('100000');
  const [bequests, setBequests] = useState<string>('0');

  // Results & Case Management
  const [result, setResult] = useState<InheritanceCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [savedCases, setSavedCases] = useState<WarasathCase[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');
  const [currentCaseId, setCurrentCaseId] = useState<string>('');

  // Scholar review submission state
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Scholar certification form (for scholars/admins)
  const isScholarOrAdmin = currentUser && [
    'SUPER ADMIN', 'SECRETARY', 'MADRASA ADMIN', 'COMMITTEE'
  ].includes(currentUser.role);
  const [showScholarCertModal, setShowScholarCertModal] = useState<boolean>(false);
  const [certStatus, setCertStatus] = useState<'CERTIFIED_ACCURATE' | 'REVISIONS_REQUIRED'>('CERTIFIED_ACCURATE');
  const [scholarComments, setScholarComments] = useState<string>('Verified and certified in accordance with standard Shafi\'i Fara\'id jurisprudence.');
  const [scholarFatwaRef, setScholarFatwaRef] = useState<string>('Mahallu Fatwa Reg: 2026/F-09');

  useEffect(() => {
    if (currentUser) {
      loadCases();
    }
  }, [currentUser]);

  const loadCases = async () => {
    try {
      const cases = await api.getMyWarasathCases();
      if (cases) setSavedCases(cases);
    } catch (e) {
      console.warn('Failed to load Warasath cases:', e);
    }
  };

  const calculateGrossEstate = (): number => {
    return (
      (parseFloat(cashInHand) || 0) +
      (parseFloat(bankBalance) || 0) +
      (parseFloat(goldValue) || 0) +
      (parseFloat(landPropertyValue) || 0) +
      (parseFloat(businessValue) || 0) +
      (parseFloat(otherAssetsValue) || 0)
    );
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    try {
      const gross = calculateGrossEstate();
      const payload = {
        deceasedName,
        deceasedGender,
        maritalStatus,
        grossEstate: gross,
        funeralExpenses: parseFloat(funeralExpenses) || 0,
        debts: parseFloat(debts) || 0,
        bequests: parseFloat(bequests) || 0,
        heirsInput: {
          spouseCount: maritalStatus === 'MARRIED' ? spouseCount : 0,
          sonsCount,
          daughtersCount,
          hasFather,
          hasMother,
          hasPaternalGrandfather,
          hasPaternalGrandmother,
          hasMaternalGrandmother,
          fullBrothersCount,
          fullSistersCount,
        },
      };

      const res = await api.calculateWarasath(payload);
      setResult(res);
      setActiveStep(3); // Navigate to Result breakdown view
    } catch (e: any) {
      alert(e.message || 'Error executing inheritance calculation');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setDeceasedName('Late Marhum');
    setDeceasedGender('MALE');
    setMaritalStatus('MARRIED');
    setSpouseCount(1);
    setSonsCount(2);
    setDaughtersCount(1);
    setHasFather(false);
    setHasMother(true);
    setHasPaternalGrandfather(false);
    setHasPaternalGrandmother(false);
    setHasMaternalGrandmother(false);
    setFullBrothersCount(0);
    setFullSistersCount(0);
    setCashInHand('0');
    setBankBalance('0');
    setGoldValue('0');
    setLandPropertyValue('0');
    setBusinessValue('0');
    setOtherAssetsValue('0');
    setFuneralExpenses('0');
    setDebts('0');
    setBequests('0');
    setResult(null);
    setCurrentCaseId('');
    setActiveStep(1);
    setActionSuccessMsg('');
  };

  const handleSaveCase = async () => {
    if (!currentUser) {
      if (onOpenAuth) onOpenAuth();
      else alert('Please sign in to save this inheritance case in your profile.');
      return;
    }

    if (!result) {
      await handleCalculate();
    }

    try {
      const gross = calculateGrossEstate();
      const payload = {
        deceasedName,
        deceasedGender,
        maritalStatus,
        grossEstate: gross,
        funeralExpenses: parseFloat(funeralExpenses) || 0,
        debts: parseFloat(debts) || 0,
        bequests: parseFloat(bequests) || 0,
        netEstate: result?.netEstate || 0,
        heirs: result?.heirs || [],
        assets: [
          { type: 'CASH', description: 'Cash in Hand', estimatedValue: parseFloat(cashInHand) || 0 },
          { type: 'BANK', description: 'Bank Accounts', estimatedValue: parseFloat(bankBalance) || 0 },
          { type: 'GOLD', description: 'Gold Assets', estimatedValue: parseFloat(goldValue) || 0 },
          { type: 'LAND', description: 'Land and Property', estimatedValue: parseFloat(landPropertyValue) || 0 },
          { type: 'BUSINESS', description: 'Business Holdings', estimatedValue: parseFloat(businessValue) || 0 },
          { type: 'OTHER', description: 'Other Assets', estimatedValue: parseFloat(otherAssetsValue) || 0 },
        ],
        notes: `Prepared via Manoor Mahall Digital Warasath System`,
      };

      const saved = await api.saveWarasathCase(payload);
      setCurrentCaseId(saved.id);
      setActionSuccessMsg(`Inheritance Case ${saved.id} saved successfully!`);
      loadCases();
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (e: any) {
      alert(e.message || 'Failed to save case');
    }
  };

  const handleSubmitForReview = async () => {
    if (!currentCaseId) {
      // Save first
      await handleSaveCase();
    }

    setIsSubmittingReview(true);
    try {
      // Find case id
      const targetId = currentCaseId || savedCases[0]?.id;
      if (!targetId) {
        alert('Please save the case before submitting for scholar review.');
        return;
      }
      await api.submitWarasathReview(targetId, reviewNotes);
      setShowReviewModal(false);
      setActionSuccessMsg(`Case ${targetId} submitted to Mahallu Scholars Council for official verification.`);
      loadCases();
      setTimeout(() => setActionSuccessMsg(''), 5000);
    } catch (e: any) {
      alert(e.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleScholarCertify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCaseId) {
      alert('Please select or save a case first.');
      return;
    }
    try {
      await api.recordScholarReview({
        caseId: currentCaseId,
        status: certStatus,
        comments: scholarComments,
        fatwaOrReference: scholarFatwaRef,
      });
      setShowScholarCertModal(false);
      setActionSuccessMsg(`Case ${currentCaseId} officially certified!`);
      loadCases();
      setTimeout(() => setActionSuccessMsg(''), 5000);
    } catch (e: any) {
      alert(e.message || 'Failed to record scholar review');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                id="btn-warasath-back"
                onClick={onBack}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-display font-bold text-lg text-slate-900 leading-tight">
                  Warasath (Islamic Inheritance) Calculator
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Manoor Mahall Islamic Fara'id Engine • Shafi'i & Hanafi Jurisprudence
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                id="btn-saved-warasath"
                onClick={() => setShowHistory(!showHistory)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <History className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">My Cases</span>
                {savedCases.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {savedCases.length}
                  </span>
                )}
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
              PRELIMINARY — SCHOLAR VERIFICATION REQUIRED.
            </span>{' '}
            <span>
              Islamic inheritance distribution involves strict legal requirements under Surah An-Nisa (Verses 11, 12, 176). This digital engine calculates canonical fixed shares (Ashab al-Furud), Awl deficit adjustments, and Asabah residuary portions for preliminary evaluation. Final execution requires formal certification from the Mahallu Qazi or Shariah Board.
            </span>
          </div>
        </div>

        {/* Step indicator */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs">
            <button
              onClick={() => setActiveStep(1)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 1 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">1</span>
              <span>1. Deceased & Legal Heirs</span>
            </button>

            <button
              onClick={() => setActiveStep(2)}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 2 ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-bold">2</span>
              <span>2. Estate Assets & Deductions</span>
            </button>

            <button
              onClick={() => {
                handleCalculate();
                setActiveStep(3);
              }}
              className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                activeStep === 3 ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[11px] flex items-center justify-center font-bold">3</span>
              <span>3. Distribution Shares & Certification</span>
            </button>
          </div>
        </div>

        {/* STEP 1: Deceased & Heirs Information */}
        {activeStep === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            
            {/* Section 1: Deceased Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Users className="w-5 h-5 text-emerald-600" />
                <h2 className="font-display font-bold text-base text-slate-900">
                  1. Deceased Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Deceased Full Name (Marhum)
                  </label>
                  <input
                    type="text"
                    value={deceasedName}
                    onChange={(e) => setDeceasedName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. Late Mohammed Ali"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Gender of Deceased
                  </label>
                  <select
                    value={deceasedGender}
                    onChange={(e) => setDeceasedGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="MALE">Male (Deceased Husband / Father)</option>
                    <option value="FEMALE">Female (Deceased Wife / Mother)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Marital Status at Death
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="MARRIED">Married (Leaves Surviving Spouse)</option>
                    <option value="WIDOWED">Widowed (No Surviving Spouse)</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="UNMARRIED">Unmarried / Single</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Legal Heirs Information */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-display font-bold text-base text-slate-900">
                    2. Legal Heirs (Ashab al-Furud & Asabah)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">Select living relatives at the time of death</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                
                {/* Spouse count */}
                {maritalStatus === 'MARRIED' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-bold text-slate-900 block">
                      {deceasedGender === 'MALE' ? 'Surviving Wife (Wives)' : 'Surviving Husband'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={deceasedGender === 'MALE' ? 4 : 1}
                      value={spouseCount}
                      onChange={(e) => setSpouseCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block">
                      {deceasedGender === 'MALE' ? 'Share: 1/8 if children exist, 1/4 if no children' : 'Share: 1/4 if children exist, 1/2 if no children'}
                    </span>
                  </div>
                )}

                {/* Sons count */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Living Sons Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={sonsCount}
                    onChange={(e) => setSonsCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Primary residuary (Asabah bil ghayr - 2 parts per son)
                  </span>
                </div>

                {/* Daughters count */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Living Daughters Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={daughtersCount}
                    onChange={(e) => setDaughtersCount(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    1 part per daughter with brothers, or 1/2 (single) / 2/3 (multiple) alone
                  </span>
                </div>

                {/* Mother */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Mother
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hasMother}
                      onChange={(e) => setHasMother(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm"
                    />
                    <span className="text-xs font-medium text-slate-700">Mother is alive</span>
                  </label>
                  <span className="text-[10px] text-slate-500 block">
                    Share: 1/6 (if children or multiple siblings exist), else 1/3
                  </span>
                </div>

                {/* Father */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Father
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hasFather}
                      onChange={(e) => setHasFather(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-sm"
                    />
                    <span className="text-xs font-medium text-slate-700">Father is alive</span>
                  </label>
                  <span className="text-[10px] text-slate-500 block">
                    Share: 1/6 with male offspring, 1/6 + Asabah with daughters, or full Asabah alone
                  </span>
                </div>

                {/* Extended Heirs Toggles */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">
                    Grandparents (if parents deceased)
                  </label>
                  <div className="space-y-1 text-xs text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={hasFather}
                        checked={hasPaternalGrandfather && !hasFather}
                        onChange={(e) => setHasPaternalGrandfather(e.target.checked)}
                      />
                      <span>Paternal Grandfather</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={hasMother}
                        checked={hasMaternalGrandmother && !hasMother}
                        onChange={(e) => setHasMaternalGrandmother(e.target.checked)}
                      />
                      <span>Maternal Grandmother</span>
                    </label>
                  </div>
                </div>

                {/* Siblings */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 sm:col-span-2 md:col-span-3">
                  <label className="text-xs font-bold text-slate-900 block">
                    Siblings (Full Brothers & Sisters)
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Full Brothers</span>
                      <input
                        type="number"
                        min="0"
                        value={fullBrothersCount}
                        onChange={(e) => setFullBrothersCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Full Sisters</span>
                      <input
                        type="number"
                        min="0"
                        value={fullSistersCount}
                        onChange={(e) => setFullSistersCount(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Note: Siblings are blocked (Hajb) when sons or father are alive.
                  </span>
                </div>

              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              >
                <span>Next: Estate Assets & Deductions</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: Estate Assets & Deductions Before Distribution */}
        {activeStep === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
            
            {/* Section 3: Estate Assets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-display font-bold text-base text-slate-900">
                    3. Estate Assets (Gross Estate Inventory)
                  </h2>
                </div>
                <span className="text-xs font-bold text-slate-700">
                  Gross Sum: ₹{calculateGrossEstate().toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">💵 Cash in Hand (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={cashInHand}
                    onChange={(e) => setCashInHand(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">🏦 Bank Balances (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={bankBalance}
                    onChange={(e) => setBankBalance(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">🟡 Gold & Jewelry Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={goldValue}
                    onChange={(e) => setGoldValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">🏡 Land & Real Estate Property (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={landPropertyValue}
                    onChange={(e) => setLandPropertyValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">🏢 Business Holdings & Stock (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={businessValue}
                    onChange={(e) => setBusinessValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <label className="text-xs font-bold text-slate-800">📦 Other Assets & Vehicles (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={otherAssetsValue}
                    onChange={(e) => setOtherAssetsValue(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Deductions Before Distribution */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <CreditCard className="w-5 h-5 text-rose-600" />
                <div>
                  <h2 className="font-display font-bold text-base text-slate-900">
                    4. Obligatory Deductions Before Distribution
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Islamic law strictly requires clearing funeral costs, verified debts, and valid bequests before distributing inheritance.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <label className="text-xs font-bold text-rose-950 block">
                    1. Funeral & Burial Expenses (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={funeralExpenses}
                    onChange={(e) => setFuneralExpenses(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-rose-700 block">
                    Tajheez & Takfeen: Reasonable burial and grave shroud costs.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <label className="text-xs font-bold text-rose-950 block">
                    2. Debts Owed by Deceased (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={debts}
                    onChange={(e) => setDebts(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-rose-700 block">
                    Debts to people, unpaid mahr, unpaid zakat, or bank dues.
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
                  <label className="text-xs font-bold text-rose-950 block">
                    3. Valid Bequests / Wasiyyah (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={bequests}
                    onChange={(e) => setBequests(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-xs font-mono"
                    placeholder="0"
                  />
                  <span className="text-[10px] text-rose-700 block">
                    Wasiyyah is legally capped at maximum 1/3 of net remaining estate.
                  </span>
                </div>

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
                onClick={handleCalculate}
                disabled={isCalculating}
                className="px-8 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
              >
                <Scale className="w-4 h-4" />
                <span>{isCalculating ? 'Computing Fara\'id...' : 'Calculate Fara\'id Distribution'}</span>
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: Results, Islamic Shares Table & Detailed Explanations */}
        {activeStep === 3 && result && (
          <div className="space-y-6">
            
            {/* Action Feedback alert */}
            {actionSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}

            {/* Print Header */}
            <div className="hidden print:block text-center border-b pb-4 mb-4">
              <h1 className="text-2xl font-bold">MANOOR MAHALLU ISLAMIC JURISPRUDENCE COUNCIL</h1>
              <p className="text-sm text-gray-600">Official Fara'id (Islamic Inheritance) Computation Statement</p>
              <p className="text-xs text-gray-500 mt-1">Deceased: {deceasedName} ({deceasedGender}) • Date: {new Date().toLocaleDateString('en-IN')}</p>
            </div>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Gross Estate Value
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-1 block">
                  ₹{result.grossEstate.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">All properties and assets</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                  Total Deductions (Burial + Debts + Bequest)
                </span>
                <span className="text-xl font-extrabold text-rose-700 font-mono mt-1 block">
                  -₹{result.deductions.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">Obligations settled first</span>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-5 rounded-2xl text-white shadow-md shadow-emerald-700/20">
                <span className="text-[11px] font-bold text-emerald-100 uppercase tracking-wider block">
                  Net Distributable Estate (Tirka)
                </span>
                <span className="text-2xl font-extrabold text-white font-mono mt-1 block">
                  ₹{result.netEstate.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-200 mt-1 block">
                  {result.adjustmentApplied ? `Adjusted by ${result.adjustmentApplied}` : 'Distributed across legal heirs'}
                </span>
              </div>
            </div>

            {/* Shares Breakdown Table */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    Canonical Fara'id Distribution Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">
                    Shares calculated per Quranic mandates (Ashab al-Furud) and authentic Hadith (Asabah).
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Fara'id Compliant
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4">Legal Heir Category</th>
                      <th className="pb-3 px-4 text-center">Count</th>
                      <th className="pb-3 px-4 text-center">Quranic Share Fraction</th>
                      <th className="pb-3 px-4 text-right">Share %</th>
                      <th className="pb-3 pl-4 text-right">Allocated Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {result.heirs.map((heir, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 pr-4">
                          <span className="font-bold text-slate-900 block">{heir.relation}</span>
                          <span className="text-[11px] text-slate-500 mt-0.5 block max-w-md">
                            {heir.justification}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-700">
                          {heir.count}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-800">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100">
                            {heir.shareFraction}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                          {heir.sharePercentage}%
                        </td>
                        <td className="py-3.5 pl-4 text-right font-mono font-extrabold text-emerald-700 text-sm">
                          ₹{heir.allocatedAmount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 font-bold">
                      <td colSpan={4} className="pt-3 text-right text-slate-700">
                        Total Estate Distributed:
                      </td>
                      <td className="pt-3 text-right font-mono text-emerald-800 text-sm">
                        ₹{result.heirs.reduce((sum, h) => sum + h.allocatedAmount, 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Step-by-Step Legal Explanation */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Calculation Methodology & Fiqh Jurisprudence Explanation</span>
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                  {result.explanation.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
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
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCase}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Case</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit for Scholar Review</span>
                  </button>

                  {isScholarOrAdmin && (
                    <button
                      type="button"
                      onClick={() => setShowScholarCertModal(true)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Certify as Scholar</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* SAVED CASES DRAWER */}
        {showHistory && currentUser && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-600" />
                <h3 className="font-display font-bold text-base text-slate-900">
                  My Saved Warasath Cases ({savedCases.length})
                </h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            {savedCases.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">
                You have not saved any inheritance cases yet. Use the calculator above and click "Save Case".
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedCases.map((c) => (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{c.deceasedName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {c.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'CERTIFIED' ? 'bg-emerald-100 text-emerald-800' :
                          c.status === 'SUBMITTED_FOR_REVIEW' ? 'bg-blue-100 text-blue-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-3">
                        <span>Net Estate: ₹{c.netEstate.toLocaleString('en-IN')}</span>
                        <span>Heirs Count: {c.heirs.length}</span>
                        <span>Date: {new Date(c.date).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => {
                          setResult({
                            grossEstate: c.grossEstate,
                            deductions: c.funeralExpenses + c.debts + c.bequests,
                            netEstate: c.netEstate,
                            heirs: c.heirs,
                            explanation: [
                              `Deceased: ${c.deceasedName} (${c.deceasedGender})`,
                              `Gross estate: ₹${c.grossEstate.toLocaleString('en-IN')}`,
                              `Net estate distributed: ₹${c.netEstate.toLocaleString('en-IN')}`,
                            ],
                            status: c.status,
                            disclaimer: 'PRELIMINARY — SCHOLAR VERIFICATION REQUIRED.',
                          });
                          setCurrentCaseId(c.id);
                          setDeceasedName(c.deceasedName);
                          setActiveStep(3);
                          setShowHistory(false);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                      >
                        Load Case
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBMIT FOR SCHOLAR REVIEW MODAL */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Submit to Mahallu Scholars Council
                  </h3>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Your inheritance case will be securely queued for verification by the Manoor Mahall Chief Qazi and Shariah Fara'id committee.
              </p>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Additional Notes / Specific Questions for Scholar:
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="e.g. Please verify grandfather share when paternal uncles are also present..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitForReview}
                  disabled={isSubmittingReview}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingReview ? 'Submitting...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SCHOLAR CERTIFICATION MODAL (Admins/Scholars only) */}
        {showScholarCertModal && isScholarOrAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Official Scholar Fara'id Certification
                  </h3>
                </div>
                <button
                  onClick={() => setShowScholarCertModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScholarCertify} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Certification Verdict
                  </label>
                  <select
                    value={certStatus}
                    onChange={(e) => setCertStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  >
                    <option value="CERTIFIED_ACCURATE">Certify as Accurate & Approved</option>
                    <option value="REVISIONS_REQUIRED">Revisions / Clarifications Required</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Fatwa / Mahallu Register Reference
                  </label>
                  <input
                    type="text"
                    required
                    value={scholarFatwaRef}
                    onChange={(e) => setScholarFatwaRef(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    placeholder="e.g. Mahallu Fatwa Book Vol 12, Page 44"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Scholar Comments & Sign-off Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={scholarComments}
                    onChange={(e) => setScholarComments(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowScholarCertModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    Issue Official Certification
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
