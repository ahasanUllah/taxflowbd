import { TAX_CONFIG } from "@/config/tax-config"
import type { TaxCalculationInput, TaxCalculationResult } from "@/types"

// ১. সকল আয়ের উৎস যোগ করে মোট আয় বের করে
function sumIncome(income: TaxCalculationInput["income"]): number {
  return (
    income.salary +
    income.businessOrProfession +
    income.houseProperty +
    income.agriculturalIncome +
    income.capitalGains +
    income.otherSources
  )
}

// ২. কনসোলিডেটেড ভাতা ছাড় হিসাব — মোট আয়ের এক তৃতীয়াংশ, সর্বোচ্চ ৪,৫০,০০০ টাকা
function computeConsolidatedAllowance(grossIncome: number): number {
  const fraction = grossIncome * TAX_CONFIG.consolidatedAllowanceFraction
  return Math.min(fraction, TAX_CONFIG.consolidatedAllowanceMax)
}

// ৩. স্ল্যাব অনুযায়ী প্রগতিশীল পদ্ধতিতে কর হিসাব
function computeGrossTax(taxableIncome: number): number {
  let remaining = taxableIncome
  let tax = 0

  for (const slab of TAX_CONFIG.slabs) {
    if (remaining <= 0) break

    if ("upTo" in slab) {
      // নির্দিষ্ট সীমার মধ্যে করযোগ্য আয়
      const taxed = Math.min(remaining, slab.upTo)
      tax += taxed * slab.rate
      remaining -= taxed
    } else {
      // সর্বোচ্চ স্ল্যাব — বাকি সব আয়ের উপর কর
      tax += remaining * slab.rate
      remaining = 0
    }
  }

  return tax
}

// ৪. বিনিয়োগ রেয়াত হিসাব — আয়কর অধ্যাদেশ ধারা ৭৮ অনুযায়ী
function computeInvestmentRebate(
  taxableIncome: number,
  investments: TaxCalculationInput["investments"]
): number {
  const totalInvestments =
    investments.lifeInsurancePremium +
    investments.providentFund +
    investments.depositPensionScheme +
    investments.savingsCertificates +
    investments.stockMarket +
    investments.otherQualifyingInvestments

  // রেয়াতযোগ্য বিনিয়োগ = min(প্রকৃত বিনিয়োগ, করযোগ্য আয়ের ৩০%, ১,৫০,০০,০০০ টাকা)
  const cap = taxableIncome * TAX_CONFIG.investmentRebate.maxFraction
  const eligible = Math.min(
    totalInvestments,
    cap,
    TAX_CONFIG.investmentRebate.maxAmount
  )

  return eligible * TAX_CONFIG.investmentRebate.rebateRate
}

// প্রধান রপ্তানিযোগ্য ফাংশন — সম্পূর্ণ কর দায় গণনা করে
export function calculateTax(input: TaxCalculationInput): TaxCalculationResult {
  // ১. করমুক্ত সীমা নির্ধারণ
  const threshold = TAX_CONFIG.taxFreeThreshold[input.category]

  // ২. মোট আয় হিসাব
  const grossIncome = sumIncome(input.income)

  // ৩. কনসোলিডেটেড ভাতা ছাড়
  const consolidatedAllowance = computeConsolidatedAllowance(grossIncome)

  // ৪. করযোগ্য আয় = মোট আয় − ভাতা ছাড় − করমুক্ত সীমা
  const taxableIncome = Math.max(
    0,
    grossIncome - consolidatedAllowance - threshold
  )

  // ৫. স্ল্যাব অনুযায়ী কর
  const grossTax = computeGrossTax(taxableIncome)

  // ৬. বিনিয়োগ রেয়াত
  const investmentRebate = computeInvestmentRebate(taxableIncome, input.investments)

  // ৭. রেয়াতের পর কর
  const netTaxBeforeMinimum = Math.max(0, grossTax - investmentRebate)

  // ৮. ন্যূনতম কর
  const minimumTax = TAX_CONFIG.minimumTax[input.residence]

  // ৯. চূড়ান্ত কর — করযোগ্য আয় থাকলে ন্যূনতম করের সাথে তুলনা করা হয়
  const finalTaxLiability =
    taxableIncome > 0
      ? Math.max(netTaxBeforeMinimum, minimumTax)
      : 0

  // ১০. কার্যকর করের হার
  const effectiveRate = grossIncome > 0 ? finalTaxLiability / grossIncome : 0

  return {
    grossIncome,
    consolidatedAllowance,
    taxableIncome,
    grossTax,
    investmentRebate,
    netTaxBeforeMinimum,
    minimumTax,
    finalTaxLiability,
    effectiveRate,
    assessmentYear: input.assessmentYear ?? TAX_CONFIG.version,
  }
}
