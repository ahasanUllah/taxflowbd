// করদাতার ক্যাটাগরি — করমুক্ত সীমা নির্ধারণ করে
export type TaxpayerCategory =
  | "general"
  | "womenAndSenior"
  | "disabledAndThirdGender"

// করদাতার বাসস্থান — ন্যূনতম কর নির্ধারণ করে
export type TaxpayerResidence =
  | "dhakaChattogram"
  | "otherCityCorp"
  | "otherAreas"

// আয়ের উৎস বিভাজন
export interface IncomeBreakdown {
  salary: number
  businessOrProfession: number
  houseProperty: number
  agriculturalIncome: number
  capitalGains: number
  otherSources: number
}

// বিনিয়োগ রেয়াতযোগ্য বিনিয়োগের বিবরণ
export interface InvestmentDetails {
  lifeInsurancePremium: number
  providentFund: number
  depositPensionScheme: number
  savingsCertificates: number
  stockMarket: number
  otherQualifyingInvestments: number
}

// কর গণনা ইঞ্জিনের ইনপুট
export interface TaxCalculationInput {
  category: TaxpayerCategory
  residence: TaxpayerResidence
  income: IncomeBreakdown
  investments: InvestmentDetails
  assessmentYear?: string
}

// কর গণনা ইঞ্জিনের আউটপুট
export interface TaxCalculationResult {
  grossIncome: number
  consolidatedAllowance: number
  taxableIncome: number
  grossTax: number
  investmentRebate: number
  netTaxBeforeMinimum: number
  minimumTax: number
  finalTaxLiability: number
  effectiveRate: number
  assessmentYear: string
}

// রেয়াত অপ্টিমাইজারের আউটপুট
export interface RebateOptimizationResult {
  currentRebate: number
  maxPossibleRebate: number
  additionalInvestmentNeeded: number
  recommendation: string
}

// Better Auth থেকে সেশন ইউজার শেপ
export interface AuthUser {
  id: string
  email: string
  name?: string
  createdAt: Date
}

// আমাদের কাস্টম UserProfile ডেটা (Better Auth-এর বাইরে)
export interface UserProfileData {
  betterAuthUserId: string
  tin?: string
  nid?: string
  phone?: string
  dateOfBirth?: Date
  gender?: "male" | "female" | "other"
  district?: string
  taxpayerType: "SALARIED" | "FREELANCER" | "BUSINESS" | "MIXED"
  subscription: "FREE" | "SMART" | "PRO"
  subscriptionExpiresAt?: Date
  profileCompleteness: number
  createdAt: Date
  updatedAt: Date
}

// TaxReturn ডকুমেন্টের শেপ
export interface TaxReturnData {
  userId: string
  assessmentYear: string
  status: "DRAFT" | "COMPLETE" | "SUBMITTED"
  input: TaxCalculationInput
  result: TaxCalculationResult
  submittedAt?: Date
  acknowledgmentNumber?: string
  createdAt: Date
  updatedAt: Date
}

// API রেসপন্সের স্ট্যান্ডার্ড ফরম্যাট
export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message: string
}

export interface ApiError {
  success: false
  error: string
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError
