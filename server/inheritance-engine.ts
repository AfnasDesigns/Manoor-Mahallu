import { InheritanceHeir, InheritanceAsset, InheritanceDeduction } from '../src/types/index.ts';

export interface InheritanceCalculationInput {
  deceasedName?: string;
  deceasedGender: 'MALE' | 'FEMALE';
  maritalStatus?: 'MARRIED' | 'SINGLE' | 'WIDOWED' | 'DIVORCED';
  grossEstate?: number;
  assets?: InheritanceAsset[];
  deductionsList?: InheritanceDeduction[];
  funeralExpenses?: number;
  debts?: number;
  bequests?: number;
  otherDeductions?: number;
  
  // Heirs
  spouseCount?: number; // Wives if deceased is male (1-4), or 1 Husband if deceased is female
  hasFather?: boolean;
  hasMother?: boolean;
  hasPaternalGrandfather?: boolean;
  hasPaternalGrandmother?: boolean;
  hasMaternalGrandmother?: boolean;
  sonsCount?: number;
  daughtersCount?: number;
  fullBrothersCount?: number;
  fullSistersCount?: number;
  paternalBrothersCount?: number;
  paternalSistersCount?: number;
  maternalBrothersCount?: number;
  maternalSistersCount?: number;
}

export interface InheritanceCalculationResult {
  grossEstate: number;
  funeralExpenses: number;
  debts: number;
  bequests: number;
  otherDeductions: number;
  totalDeductions: number;
  netEstate: number;
  heirs: InheritanceHeir[];
  explanation: string[];
  status: 'PRELIMINARY — SCHOLAR VERIFICATION REQUIRED';
  disclaimer: string;
}

export function calculateIslamicInheritance(input: InheritanceCalculationInput): InheritanceCalculationResult {
  const {
    deceasedGender,
    assets = [],
    deductionsList = [],
    spouseCount = 0,
    hasFather = false,
    hasMother = false,
    hasPaternalGrandfather = false,
    hasPaternalGrandmother = false,
    hasMaternalGrandmother = false,
    sonsCount = 0,
    daughtersCount = 0,
    fullBrothersCount = 0,
    fullSistersCount = 0,
    paternalBrothersCount = 0,
    paternalSistersCount = 0,
    maternalBrothersCount = 0,
    maternalSistersCount = 0,
  } = input;

  // Compute gross estate from asset items if provided, or fallback to grossEstate
  let grossEstate = input.grossEstate || 0;
  if (assets.length > 0) {
    grossEstate = assets.reduce((sum, a) => sum + (Number(a.estimatedValue) || 0), 0);
  }

  // Deductions from deduction items or fields
  let funeralExpenses = Number(input.funeralExpenses) || 0;
  let debts = Number(input.debts) || 0;
  let bequests = Number(input.bequests) || 0;
  let otherDeductions = Number(input.otherDeductions) || 0;

  if (deductionsList.length > 0) {
    funeralExpenses = deductionsList.filter(d => d.category === 'FUNERAL').reduce((s, d) => s + (Number(d.amount) || 0), 0);
    debts = deductionsList.filter(d => d.category === 'DEBT').reduce((s, d) => s + (Number(d.amount) || 0), 0);
    bequests = deductionsList.filter(d => d.category === 'BEQUEST').reduce((s, d) => s + (Number(d.amount) || 0), 0);
    otherDeductions = deductionsList.filter(d => d.category === 'OTHER').reduce((s, d) => s + (Number(d.amount) || 0), 0);
  }

  const estateAfterDebtAndFuneral = Math.max(0, grossEstate - funeralExpenses - debts - otherDeductions);
  // Valid bequests can not exceed 1/3 of remainder according to Hadith (Al-Thuluth wa al-thuluthu katheer)
  const maxValidBequest = estateAfterDebtAndFuneral / 3;
  const actualBequest = Math.min(bequests, maxValidBequest);

  const totalDeductions = funeralExpenses + debts + actualBequest + otherDeductions;
  const netEstate = Math.max(0, grossEstate - totalDeductions);

  const explanation: string[] = [
    `1. Gross Estate: ₹${grossEstate.toLocaleString('en-IN')}.`,
    `2. Settled Deductions (Funeral: ₹${funeralExpenses.toLocaleString('en-IN')}, Debts: ₹${debts.toLocaleString('en-IN')}, Bequest/Wasiyyah: ₹${actualBequest.toLocaleString('en-IN')}${otherDeductions > 0 ? `, Other: ₹${otherDeductions.toLocaleString('en-IN')}` : ''}) = Total ₹${totalDeductions.toLocaleString('en-IN')}.`,
    `3. Net Distributable Estate: ₹${netEstate.toLocaleString('en-IN')}.`
  ];

  if (bequests > maxValidBequest) {
    explanation.push(`* Note on Wasiyyah: The entered bequest was ₹${bequests.toLocaleString('en-IN')}, but under Shariah rules, bequests cannot exceed 1/3 of the net estate (₹${Math.round(maxValidBequest).toLocaleString('en-IN')}) without the unanimous consent of all mature heirs.`);
  }

  const heirs: InheritanceHeir[] = [];
  if (netEstate <= 0) {
    return {
      grossEstate,
      funeralExpenses,
      debts,
      bequests: actualBequest,
      otherDeductions,
      totalDeductions,
      netEstate: 0,
      heirs: [],
      explanation: [...explanation, 'No distributable estate remaining after clearing funeral costs and obligatory debts.'],
      status: 'PRELIMINARY — SCHOLAR VERIFICATION REQUIRED',
      disclaimer: 'This inheritance calculation is prepared for initial assessment in accordance with Islamic jurisprudence. It does NOT replace official certification by the Mahallu Qazi, Shariah Board, or competent court of law.',
    };
  }

  const hasChildren = sonsCount > 0 || daughtersCount > 0;
  const hasMaleChildren = sonsCount > 0;
  const totalSiblings = fullBrothersCount + fullSistersCount + paternalBrothersCount + paternalSistersCount + maternalBrothersCount + maternalSistersCount;

  // Blocking / Hajb rules:
  // - Father blocks Grandfather, and blocks all brothers and sisters (Full, Paternal, Maternal)
  // - Mother blocks Grandmothers
  // - Sons block Grandchildren, and block all brothers and sisters
  const siblingsBlocked = hasFather || hasMaleChildren;
  const grandfatherBlocked = hasFather;
  const grandmotherBlocked = hasMother;

  // Track initial theoretical Quranic shares (Ashab al-Furud)
  interface FixedShare {
    relation: string;
    count: number;
    fraction: string;
    num: number; // numerator
    den: number; // denominator
    reference: string;
    notes: string;
  }
  const fixedShares: FixedShare[] = [];

  // 1. Spouse Share
  if (spouseCount > 0) {
    if (deceasedGender === 'MALE') {
      // Wife / Wives: 1/8 with children, 1/4 without children
      const frac = hasChildren ? '1/8' : '1/4';
      const [num, den] = hasChildren ? [1, 8] : [1, 4];
      fixedShares.push({
        relation: spouseCount === 1 ? 'Wife (Spouse)' : `Wives (${spouseCount} Spouses)`,
        count: spouseCount,
        fraction: frac,
        num,
        den,
        reference: 'Surah An-Nisa 4:12',
        notes: hasChildren
          ? `Wife/wives receive 1/8 collectively due to existence of children (${spouseCount > 1 ? 'divided equally among ' + spouseCount + ' wives' : ''}).`
          : `Wife/wives receive 1/4 collectively in the absence of children.`,
      });
      explanation.push(
        hasChildren
          ? `4. Wife share: 1/8 (${(12.5).toFixed(1)}%) collective share because the deceased has children (Surah An-Nisa 4:12).`
          : `4. Wife share: 1/4 (${(25).toFixed(1)}%) collective share because there are no children (Surah An-Nisa 4:12).`
      );
    } else {
      // Husband: 1/4 with children, 1/2 without children
      const frac = hasChildren ? '1/4' : '1/2';
      const [num, den] = hasChildren ? [1, 4] : [1, 2];
      fixedShares.push({
        relation: 'Husband (Spouse)',
        count: 1,
        fraction: frac,
        num,
        den,
        reference: 'Surah An-Nisa 4:12',
        notes: hasChildren ? 'Husband receives 1/4 due to existence of children.' : 'Husband receives 1/2 in the absence of children.',
      });
      explanation.push(
        hasChildren
          ? `4. Husband share: 1/4 (${(25).toFixed(1)}%) because the deceased wife has surviving children (Surah An-Nisa 4:12).`
          : `4. Husband share: 1/2 (${(50).toFixed(1)}%) because the deceased wife left no surviving children (Surah An-Nisa 4:12).`
      );
    }
  }

  // 2. Mother Share
  if (hasMother) {
    const hasMultipleSiblings = totalSiblings > 1;
    const motherGetsSixth = hasChildren || hasMultipleSiblings;
    const frac = motherGetsSixth ? '1/6' : '1/3';
    const [num, den] = motherGetsSixth ? [1, 6] : [1, 3];
    fixedShares.push({
      relation: 'Mother',
      count: 1,
      fraction: frac,
      num,
      den,
      reference: 'Surah An-Nisa 4:11',
      notes: motherGetsSixth
        ? 'Mother receives 1/6 due to presence of children or multiple siblings.'
        : 'Mother receives 1/3 as there are no children and at most one sibling.',
    });
    explanation.push(
      motherGetsSixth
        ? `5. Mother share: 1/6 (${(16.67).toFixed(2)}%) due to surviving children or multiple siblings (Surah An-Nisa 4:11).`
        : `5. Mother share: 1/3 (${(33.33).toFixed(2)}%) because there are no children and fewer than two siblings (Surah An-Nisa 4:11).`
    );
  } else if (!grandmotherBlocked && (hasPaternalGrandmother || hasMaternalGrandmother)) {
    const gCount = (hasPaternalGrandmother ? 1 : 0) + (hasMaternalGrandmother ? 1 : 0);
    fixedShares.push({
      relation: gCount === 1 ? 'Grandmother' : 'Grandmothers (Paternal & Maternal)',
      count: gCount,
      fraction: '1/6',
      num: 1,
      den: 6,
      reference: 'Sunnah / Ijma of Sahaba',
      notes: 'Grandmother(s) receive 1/6 in absence of the mother.',
    });
    explanation.push(`5. Grandmother(s) share: 1/6 collectively in absence of the mother.`);
  }

  // 3. Father Share (Ashab al-Furud portion)
  if (hasFather) {
    if (hasMaleChildren) {
      // Father gets 1/6 fixed when sons exist
      fixedShares.push({
        relation: 'Father',
        count: 1,
        fraction: '1/6',
        num: 1,
        den: 6,
        reference: 'Surah An-Nisa 4:11',
        notes: 'Father receives 1/6 fixed share due to presence of male children (sons).',
      });
      explanation.push(`6. Father share: 1/6 fixed share due to presence of son(s) (Surah An-Nisa 4:11).`);
    } else if (daughtersCount > 0 && sonsCount === 0) {
      // Father gets 1/6 fixed + Asabah (residuary)
      fixedShares.push({
        relation: 'Father (Fixed Portion)',
        count: 1,
        fraction: '1/6 + Asabah',
        num: 1,
        den: 6,
        reference: 'Surah An-Nisa 4:11',
        notes: 'Father receives 1/6 fixed share plus any remaining residuary (Asabah) after daughters and spouse.',
      });
      explanation.push(`6. Father share: 1/6 fixed Quranic share plus remaining Asabah after daughter(s).`);
    } else if (!hasChildren) {
      // Father is purely Asabah (takes remainder after spouse & mother)
      explanation.push(`6. Father: Pure Residuary (Asabah bi-Nafs). Inherits the entire remaining estate after spouse and mother (Surah An-Nisa 4:11).`);
    }
  } else if (!grandfatherBlocked && hasPaternalGrandfather) {
    if (hasMaleChildren) {
      fixedShares.push({
        relation: 'Paternal Grandfather',
        count: 1,
        fraction: '1/6',
        num: 1,
        den: 6,
        reference: 'Ijma of Sahaba',
        notes: 'Paternal Grandfather receives 1/6 in place of father when sons exist.',
      });
      explanation.push(`6. Paternal Grandfather: 1/6 in place of deceased father.`);
    }
  }

  // 4. Daughters ONLY (without sons)
  if (daughtersCount > 0 && sonsCount === 0) {
    const dFrac = daughtersCount === 1 ? '1/2' : '2/3';
    const [num, den] = daughtersCount === 1 ? [1, 2] : [2, 3];
    fixedShares.push({
      relation: daughtersCount === 1 ? 'Daughter' : `Daughters (${daughtersCount})`,
      count: daughtersCount,
      fraction: dFrac,
      num,
      den,
      reference: 'Surah An-Nisa 4:11',
      notes: daughtersCount === 1 ? 'Single daughter receives 1/2 of estate.' : `${daughtersCount} daughters share 2/3 equally.`,
    });
    explanation.push(
      daughtersCount === 1
        ? `7. Daughter share: 1/2 (${(50).toFixed(1)}%) for single daughter without brothers (Surah An-Nisa 4:11).`
        : `7. Daughters share: 2/3 (${(66.67).toFixed(2)}%) divided equally among ${daughtersCount} daughters without brothers (Surah An-Nisa 4:11).`
    );
  }

  // 5. Uterine Siblings (Maternal brothers/sisters) if no children and no father/grandfather
  if (!siblingsBlocked && (maternalBrothersCount > 0 || maternalSistersCount > 0)) {
    const uCount = maternalBrothersCount + maternalSistersCount;
    const uFrac = uCount === 1 ? '1/6' : '1/3';
    const [num, den] = uCount === 1 ? [1, 6] : [1, 3];
    fixedShares.push({
      relation: uCount === 1 ? 'Uterine Sibling' : `Uterine Siblings (${uCount})`,
      count: uCount,
      fraction: uFrac,
      num,
      den,
      reference: 'Surah An-Nisa 4:12',
      notes: 'Uterine siblings share equally regardless of gender when Kalalah applies.',
    });
    explanation.push(`8. Uterine Siblings: ${uFrac} collective share (Surah An-Nisa 4:12).`);
  }

  // Compute common denominator and sum of fixed shares
  let sumFixedFraction = 0;
  for (const s of fixedShares) {
    sumFixedFraction += s.num / s.den;
  }

  // Check Awl (Deficit: sumFixedFraction > 1)
  const isAwl = sumFixedFraction > 1.0001;

  if (isAwl) {
    // Proportional reduction (Awl) across all Ashab al-Furud
    explanation.push(`* Awl Adjustment Applied: The total Quranic fixed shares (${(sumFixedFraction * 100).toFixed(1)}%) exceed 100%. Under Islamic law established by Sayyiduna Umar ibn al-Khattab (R.A.), all shares are proportionally reduced to fit 100% of the estate.`);
    for (const s of fixedShares) {
      const normalizedPct = (s.num / s.den) / sumFixedFraction;
      const allocated = Math.round(netEstate * normalizedPct);
      heirs.push({
        relation: s.relation,
        count: s.count,
        shareFraction: `${s.fraction} (Awl adjusted)`,
        sharePercentage: Number((normalizedPct * 100).toFixed(2)),
        allocatedAmount: allocated,
        quranicReference: s.reference,
        notes: `${s.notes} Adjusted via Awl.`,
      });
    }
  } else {
    // Allocate fixed shares
    let allocatedTotal = 0;
    for (const s of fixedShares) {
      const sharePct = s.num / s.den;
      const allocated = Math.round(netEstate * sharePct);
      allocatedTotal += allocated;
      heirs.push({
        relation: s.relation,
        count: s.count,
        shareFraction: s.fraction,
        sharePercentage: Number((sharePct * 100).toFixed(2)),
        allocatedAmount: allocated,
        quranicReference: s.reference,
        notes: s.notes,
      });
    }

    let remainingEstate = Math.max(0, netEstate - allocatedTotal);

    // 6. Residuary (Asabah) Distribution
    if (sonsCount > 0) {
      // Sons alone or Sons + Daughters -> Asabah bil-Ghayr (2:1 ratio)
      const parts = (sonsCount * 2) + (daughtersCount * 1);
      const perPart = remainingEstate / parts;

      const sonsTotal = Math.round(perPart * 2 * sonsCount);
      heirs.push({
        relation: sonsCount === 1 ? 'Son' : `Sons (${sonsCount})`,
        count: sonsCount,
        shareFraction: daughtersCount > 0 ? 'Residuary (Asabah 2:1 with daughters)' : 'Residuary (Asabah)',
        sharePercentage: Number(((sonsTotal / netEstate) * 100).toFixed(2)),
        allocatedAmount: sonsTotal,
        quranicReference: 'Surah An-Nisa 4:11',
        notes: daughtersCount > 0
          ? `${sonsCount} son(s) inherit 2 parts each for every 1 part of daughter (${sonsCount > 1 ? `₹${Math.round(sonsTotal / sonsCount).toLocaleString('en-IN')} each` : ''}).`
          : `${sonsCount} son(s) inherit the entire residuary estate (${sonsCount > 1 ? `₹${Math.round(sonsTotal / sonsCount).toLocaleString('en-IN')} each` : ''}).`,
      });

      if (daughtersCount > 0) {
        const daughtersTotal = Math.max(0, remainingEstate - sonsTotal);
        heirs.push({
          relation: daughtersCount === 1 ? 'Daughter' : `Daughters (${daughtersCount})`,
          count: daughtersCount,
          shareFraction: 'Residuary (Asabah 2:1 with sons)',
          sharePercentage: Number(((daughtersTotal / netEstate) * 100).toFixed(2)),
          allocatedAmount: daughtersTotal,
          quranicReference: 'Surah An-Nisa 4:11',
          notes: `${daughtersCount} daughter(s) made residuary (Asabah bil-Ghayr) by their brother(s) (${daughtersCount > 1 ? `₹${Math.round(daughtersTotal / daughtersCount).toLocaleString('en-IN')} each` : ''}).`,
        });
      }

      explanation.push(
        `9. Residuary (Asabah): Remaining estate of ₹${remainingEstate.toLocaleString('en-IN')} is inherited by the children. Male receives twice the female share (Surah An-Nisa 4:11). Divided into ${parts} parts (${sonsCount * 2} for sons, ${daughtersCount} for daughters).`
      );
      remainingEstate = 0;
    } else if (remainingEstate > 0 && hasFather) {
      // Father takes remaining estate as Asabah bi-Nafs
      const fatherIdx = heirs.findIndex(h => h.relation.startsWith('Father'));
      if (fatherIdx !== -1) {
        heirs[fatherIdx].allocatedAmount += remainingEstate;
        heirs[fatherIdx].sharePercentage = Number(((heirs[fatherIdx].allocatedAmount / netEstate) * 100).toFixed(2));
        heirs[fatherIdx].notes += ` Plus ₹${remainingEstate.toLocaleString('en-IN')} as Residuary (Asabah).`;
      } else {
        heirs.push({
          relation: 'Father',
          count: 1,
          shareFraction: 'Residuary (Asabah)',
          sharePercentage: Number(((remainingEstate / netEstate) * 100).toFixed(2)),
          allocatedAmount: remainingEstate,
          quranicReference: 'Surah An-Nisa 4:11',
          notes: 'Father inherits remaining estate as Asabah bi-Nafs.',
        });
      }
      explanation.push(`9. Father inherits the remaining surplus of ₹${remainingEstate.toLocaleString('en-IN')} as primary residuary heir (Asabah bi-Nafs).`);
      remainingEstate = 0;
    } else if (remainingEstate > 0 && !hasChildren && !hasFather && (fullBrothersCount > 0 || fullSistersCount > 0)) {
      // Full Siblings inherit remaining as Asabah
      const parts = (fullBrothersCount * 2) + (fullSistersCount * 1);
      const perPart = remainingEstate / parts;

      if (fullBrothersCount > 0) {
        const bTotal = Math.round(perPart * 2 * fullBrothersCount);
        heirs.push({
          relation: fullBrothersCount === 1 ? 'Full Brother' : `Full Brothers (${fullBrothersCount})`,
          count: fullBrothersCount,
          shareFraction: fullSistersCount > 0 ? 'Residuary (Asabah 2:1)' : 'Residuary (Asabah)',
          sharePercentage: Number(((bTotal / netEstate) * 100).toFixed(2)),
          allocatedAmount: bTotal,
          quranicReference: 'Surah An-Nisa 4:176',
          notes: 'Full brother(s) inherit residuary in the absence of children and father.',
        });
      }
      if (fullSistersCount > 0) {
        const sTotal = Math.round(perPart * 1 * fullSistersCount);
        heirs.push({
          relation: fullSistersCount === 1 ? 'Full Sister' : `Full Sisters (${fullSistersCount})`,
          count: fullSistersCount,
          shareFraction: fullBrothersCount > 0 ? 'Residuary (Asabah 2:1)' : 'Fixed 1/2 or 2/3 (or Asabah)',
          sharePercentage: Number(((sTotal / netEstate) * 100).toFixed(2)),
          allocatedAmount: sTotal,
          quranicReference: 'Surah An-Nisa 4:176',
          notes: 'Full sister(s) inherit residuary with brother(s).',
        });
      }
      explanation.push(`9. Full siblings inherit the remaining ₹${remainingEstate.toLocaleString('en-IN')} under Kalalah rules (Surah An-Nisa 4:176).`);
      remainingEstate = 0;
    } else if (remainingEstate > 0 && heirs.length > 0) {
      // Radd (Return): surplus returned proportionally to non-spouse heirs
      const nonSpouseHeirs = heirs.filter(h => !h.relation.includes('Spouse') && !h.relation.includes('Wife') && !h.relation.includes('Husband'));
      const targetHeirs = nonSpouseHeirs.length > 0 ? nonSpouseHeirs : heirs;
      const currentSum = targetHeirs.reduce((s, h) => s + h.allocatedAmount, 0);

      if (currentSum > 0) {
        explanation.push(`* Radd (Surplus Return): A residual amount of ₹${remainingEstate.toLocaleString('en-IN')} remained with no male residuary heir. Under Radd principles, this surplus is distributed proportionally among the Quranic sharers.`);
        for (const h of targetHeirs) {
          const add = Math.round(remainingEstate * (h.allocatedAmount / currentSum));
          h.allocatedAmount += add;
          h.sharePercentage = Number(((h.allocatedAmount / netEstate) * 100).toFixed(2));
          h.notes += ' (Includes Radd surplus allocation).';
        }
      }
    }
  }

  // Adjust any rounding discrepancies on allocated amounts
  const totalAllocated = heirs.reduce((sum, h) => sum + h.allocatedAmount, 0);
  const diff = netEstate - totalAllocated;
  if (diff !== 0 && heirs.length > 0) {
    heirs[0].allocatedAmount += diff;
  }

  return {
    grossEstate,
    funeralExpenses,
    debts,
    bequests: actualBequest,
    otherDeductions,
    totalDeductions,
    netEstate,
    heirs,
    explanation,
    status: 'PRELIMINARY — SCHOLAR VERIFICATION REQUIRED',
    disclaimer: 'This inheritance calculation is prepared for initial assessment in accordance with Islamic jurisprudence. It does NOT replace official certification by the Mahallu Qazi, Shariah Board, or competent court of law.',
  };
}
