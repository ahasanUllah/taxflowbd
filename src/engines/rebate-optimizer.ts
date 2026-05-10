import { TAX_CONFIG } from "@/config/tax-config"
import type {
  TaxCalculationInput,
  TaxCalculationResult,
  RebateOptimizationResult,
} from "@/types"

// কত বিনিয়োগ করলে সর্বোচ্চ কর রেয়াত পাওয়া যাবে তা হিসাব করে
export function optimizeRebate(
  input: TaxCalculationInput,
  result: TaxCalculationResult
): RebateOptimizationResult {
  const { taxableIncome, investmentRebate } = result

  // বর্তমান রেয়াত
  const currentRebate = investmentRebate

  // সর্বোচ্চ রেয়াতযোগ্য বিনিয়োগের ভিত্তি
  const maxInvestmentBase = Math.min(
    taxableIncome * TAX_CONFIG.investmentRebate.maxFraction,
    TAX_CONFIG.investmentRebate.maxAmount
  )

  // সর্বোচ্চ সম্ভাব্য রেয়াত
  const maxPossibleRebate =
    maxInvestmentBase * TAX_CONFIG.investmentRebate.rebateRate

  // বর্তমান মোট বিনিয়োগ
  const currentInvestments =
    input.investments.lifeInsurancePremium +
    input.investments.providentFund +
    input.investments.depositPensionScheme +
    input.investments.savingsCertificates +
    input.investments.stockMarket +
    input.investments.otherQualifyingInvestments

  // আরও কত বিনিয়োগ দরকার
  const additionalInvestmentNeeded = Math.max(
    0,
    maxInvestmentBase - currentInvestments
  )

  let recommendation: string

  if (additionalInvestmentNeeded === 0) {
    recommendation =
      "আপনি সর্বোচ্চ বিনিয়োগ রেয়াত অর্জন করেছেন। আর বিনিয়োগের প্রয়োজন নেই।"
  } else {
    const formattedAmount = additionalInvestmentNeeded.toLocaleString("bn-BD")
    recommendation = `সর্বোচ্চ ছাড়ের জন্য আরও ৳${formattedAmount} বিনিয়োগ করুন।`
  }

  return {
    currentRebate,
    maxPossibleRebate,
    additionalInvestmentNeeded,
    recommendation,
  }
}
