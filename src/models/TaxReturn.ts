import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface ITaxReturn extends Document {
  userId: string
  assessmentYear: string
  status: "DRAFT" | "COMPLETE" | "SUBMITTED"
  income: {
    basicSalary: number
    houseRent: number
    medical: number
    conveyance: number
    bonus: number
    otherAllowances: number
    freelanceIncome: number
    businessIncome: number
    otherIncome: number
  }
  exemptions: {
    consolidatedAllowance: number
    totalExempt: number
  }
  investments: {
    sanchayapatra: number
    dps: number
    lifeInsurance: number
    stock: number
    providentFund: number
    other: number
  }
  calculation: {
    grossIncome: number
    taxableIncome: number
    taxBeforeRebate: number
    investmentRebate: number
    taxAfterRebate: number
    minimumTax: number
    finalTax: number
    taxConfigVersion: string
  }
  submittedAt?: Date
  acknowledgmentNumber?: string
  createdAt: Date
  updatedAt: Date
}

const IncomeSchema = new Schema(
  {
    basicSalary: { type: Number, default: 0 },
    houseRent: { type: Number, default: 0 },
    medical: { type: Number, default: 0 },
    conveyance: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },
    freelanceIncome: { type: Number, default: 0 },
    businessIncome: { type: Number, default: 0 },
    otherIncome: { type: Number, default: 0 },
  },
  { _id: false }
)

const ExemptionsSchema = new Schema(
  {
    consolidatedAllowance: { type: Number, default: 0 },
    totalExempt: { type: Number, default: 0 },
  },
  { _id: false }
)

const InvestmentsSchema = new Schema(
  {
    sanchayapatra: { type: Number, default: 0 },
    dps: { type: Number, default: 0 },
    lifeInsurance: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    providentFund: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
  },
  { _id: false }
)

const CalculationSchema = new Schema(
  {
    grossIncome: { type: Number, default: 0 },
    taxableIncome: { type: Number, default: 0 },
    taxBeforeRebate: { type: Number, default: 0 },
    investmentRebate: { type: Number, default: 0 },
    taxAfterRebate: { type: Number, default: 0 },
    minimumTax: { type: Number, default: 0 },
    finalTax: { type: Number, default: 0 },
    taxConfigVersion: { type: String, default: "AY2025-26-v1" },
  },
  { _id: false }
)

const TaxReturnSchema = new Schema<ITaxReturn>(
  {
    userId: { type: String, required: true, index: true },
    assessmentYear: { type: String, required: true },
    status: {
      type: String,
      enum: ["DRAFT", "COMPLETE", "SUBMITTED"],
      default: "DRAFT",
      required: true,
    },
    income: { type: IncomeSchema, default: () => ({}) },
    exemptions: { type: ExemptionsSchema, default: () => ({}) },
    investments: { type: InvestmentsSchema, default: () => ({}) },
    calculation: { type: CalculationSchema, default: () => ({}) },
    submittedAt: { type: Date },
    acknowledgmentNumber: { type: String },
  },
  {
    timestamps: true,
    collection: "taxreturns",
  }
)

// এক ব্যবহারকারীর একটি অ্যাসেসমেন্ট বছরে একটিই রিটার্ন
TaxReturnSchema.index({ userId: 1, assessmentYear: 1 })

const TaxReturn: Model<ITaxReturn> =
  mongoose.models.TaxReturn ??
  mongoose.model<ITaxReturn>("TaxReturn", TaxReturnSchema)

export default TaxReturn
