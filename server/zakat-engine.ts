import { ZakatConfiguration, ZakatAssetBreakdown, ZakatDeductions } from '../src/types/index.ts';

export interface ZakatCalculationInput {
  nisabStandard?: 'GOLD' | 'SILVER';
  goldGrams?: number;
  goldValue?: number;
  silverGrams?: number;
  silverValue?: number;
  cashInHand?: number;
  bankBalance?: number;
  businessStock?: number;
  agriculturalHarvestValue?: number;
  agriculturalIrrigationType?: 'RAINFED' | 'IRRIGATED';
  livestockValue?: number;
  loansReceivable?: number;
  otherEligibleAssets?: number;

  // Deductions
  immediateDebts?: number;
  pendingBillsTaxes?: number;
  dueWages?: number;
  otherLiabilities?: number;

  customConfig?: Partial<ZakatConfiguration>;
}

export interface ZakatCalculationResult {
  nisabStandard: 'GOLD' | 'SILVER';
  goldPricePerGram: number;
  silverPricePerGram: number;
  goldNisabGrams: number;
  silverNisabGrams: number;
  nisabValue: number;
  totalAssets: number;
  deductibleLiabilities: number;
  netZakatableWealth: number;
  meetsNisab: boolean;
  monetaryZakatDue: number;
  agriculturalZakatDue: number;
  livestockZakatDue: number;
  zakatDue: number;
  breakdown: Record<string, number>;
  assets: ZakatAssetBreakdown;
  deductions: ZakatDeductions;
  methodologyVersion: string;
  status: string;
  disclaimer: string;
}

export function calculateZakat(
  input: ZakatCalculationInput,
  config: ZakatConfiguration
): ZakatCalculationResult {
  const goldPrice = input.customConfig?.goldPricePerGram ?? config.goldPricePerGram;
  const silverPrice = input.customConfig?.silverPricePerGram ?? config.silverPricePerGram;
  const goldNisabGrams = input.customConfig?.goldNisabGrams ?? config.goldNisabGrams;
  const silverNisabGrams = input.customConfig?.silverNisabGrams ?? config.silverNisabGrams;
  const stdRate = input.customConfig?.standardZakatRate ?? config.standardZakatRate; // 0.025
  const ushrRainfed = input.customConfig?.ushrRainfedRate ?? config.ushrRainfedRate; // 0.10
  const ushrIrrigated = input.customConfig?.ushrIrrigatedRate ?? config.ushrIrrigatedRate; // 0.05

  const nisabStandard = input.nisabStandard || config.defaultNisabStandard || 'GOLD';
  const nisabValue = nisabStandard === 'GOLD' ? goldNisabGrams * goldPrice : silverNisabGrams * silverPrice;

  // Asset values
  const goldGrams = Number(input.goldGrams) || 0;
  const goldVal = input.goldValue !== undefined && input.goldValue > 0 ? Number(input.goldValue) : Math.round(goldGrams * goldPrice);

  const silverGrams = Number(input.silverGrams) || 0;
  const silverVal = input.silverValue !== undefined && input.silverValue > 0 ? Number(input.silverValue) : Math.round(silverGrams * silverPrice);

  const cashInHand = Number(input.cashInHand) || 0;
  const bankBalance = Number(input.bankBalance) || 0;
  const businessStock = Number(input.businessStock) || 0;
  const agriculturalHarvestValue = Number(input.agriculturalHarvestValue) || 0;
  const livestockValue = Number(input.livestockValue) || 0;
  const loansReceivable = Number(input.loansReceivable) || 0;
  const otherEligibleAssets = Number(input.otherEligibleAssets) || 0;

  // Agricultural Ushr calculation
  const isRainfed = input.agriculturalIrrigationType === 'RAINFED';
  const agRate = isRainfed ? ushrRainfed : ushrIrrigated;
  const agriculturalZakatDue = agriculturalHarvestValue > 0 ? Math.round(agriculturalHarvestValue * agRate) : 0;

  // Livestock Zakat calculation (approximate market rate or per Nisab)
  const livestockZakatDue = livestockValue > 0 ? Math.round(livestockValue * stdRate) : 0;

  // Monetary & Business wealth
  const monetaryAndBusinessWealth = goldVal + silverVal + cashInHand + bankBalance + businessStock + loansReceivable + otherEligibleAssets;
  const totalAssets = monetaryAndBusinessWealth + agriculturalHarvestValue + livestockValue;

  // Deductions
  const immediateDebts = Number(input.immediateDebts) || 0;
  const pendingBillsTaxes = Number(input.pendingBillsTaxes) || 0;
  const dueWages = Number(input.dueWages) || 0;
  const otherLiabilities = Number(input.otherLiabilities) || 0;
  const deductibleLiabilities = immediateDebts + pendingBillsTaxes + dueWages + otherLiabilities;

  const netMonetaryWealth = Math.max(0, monetaryAndBusinessWealth - deductibleLiabilities);
  const netZakatableWealth = Math.max(0, totalAssets - deductibleLiabilities);

  // Check Nisab against monetary wealth
  const meetsNisab = netZakatableWealth >= nisabValue;

  const monetaryZakatDue = meetsNisab ? Math.round(netMonetaryWealth * stdRate) : 0;
  const zakatDue = monetaryZakatDue + agriculturalZakatDue + livestockZakatDue;

  const breakdown: Record<string, number> = {
    'Gold Wealth': goldVal,
    'Silver Wealth': silverVal,
    'Cash in Hand': cashInHand,
    'Bank Balance': bankBalance,
    'Business Assets/Stock': businessStock,
    'Agricultural Produce': agriculturalHarvestValue,
    'Livestock Wealth': livestockValue,
    'Receivables / Good Debts': loansReceivable,
    'Other Investments/Assets': otherEligibleAssets,
    'Total Deductions': -deductibleLiabilities,
  };

  const assets: ZakatAssetBreakdown = {
    goldGrams,
    goldValue: goldVal,
    silverGrams,
    silverValue: silverVal,
    cashInHand,
    bankBalance,
    businessStock,
    agriculturalHarvestValue,
    agriculturalZakatDue,
    livestockValue,
    livestockZakatDue,
    loansReceivable,
    otherEligibleAssets,
  };

  const deductions: ZakatDeductions = {
    immediateDebts,
    pendingBillsTaxes,
    dueWages,
    totalDeductions: deductibleLiabilities,
  };

  return {
    nisabStandard,
    goldPricePerGram: goldPrice,
    silverPricePerGram: silverPrice,
    goldNisabGrams,
    silverNisabGrams,
    nisabValue,
    totalAssets,
    deductibleLiabilities,
    netZakatableWealth,
    meetsNisab,
    monetaryZakatDue,
    agriculturalZakatDue,
    livestockZakatDue,
    zakatDue,
    breakdown,
    assets,
    deductions,
    methodologyVersion: `Manoor Mahall Standard Fiqh (${nisabStandard === 'GOLD' ? `${goldNisabGrams}g Gold` : `${silverNisabGrams}g Silver`} Nisab @ ${(stdRate * 100).toFixed(1)}%)`,
    status: 'PRELIMINARY CALCULATION — REVIEW WITH A QUALIFIED SCHOLAR WHERE APPROPRIATE',
    disclaimer: 'PRELIMINARY CALCULATION — REVIEW WITH A QUALIFIED SCHOLAR WHERE APPROPRIATE. This computation reflects standard Islamic jurisprudence approved by the Mahallu Council. Complex assets, dispute debts, and long-term liabilities should be clarified with the Mahallu Qazi.',
  };
}
