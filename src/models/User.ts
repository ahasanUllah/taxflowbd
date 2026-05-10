import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUserProfile extends Document {
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

const UserProfileSchema = new Schema<IUserProfile>(
  {
    betterAuthUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tin: {
      type: String,
      sparse: true,
      unique: true,
      validate: {
        validator: (v: string) => !v || /^\d{12}$/.test(v),
        message: "TIN অবশ্যই ১২ সংখ্যার হতে হবে",
      },
    },
    nid: {
      type: String,
      sparse: true,
      unique: true,
    },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    district: { type: String },
    taxpayerType: {
      type: String,
      enum: ["SALARIED", "FREELANCER", "BUSINESS", "MIXED"],
      default: "SALARIED",
      required: true,
    },
    subscription: {
      type: String,
      enum: ["FREE", "SMART", "PRO"],
      default: "FREE",
      required: true,
    },
    subscriptionExpiresAt: { type: Date },
    profileCompleteness: { type: Number, default: 20 },
  },
  {
    timestamps: true,
    collection: "userprofiles",
  }
)

// প্রোফাইল সম্পূর্ণতার স্কোর স্বয়ংক্রিয়ভাবে হিসাব করে
UserProfileSchema.pre("save", async function () {
  let score = 20
  if (this.tin) score += 25
  if (this.phone) score += 15
  if (this.dateOfBirth) score += 10
  if (this.district) score += 10
  if (this.gender) score += 10
  if (this.taxpayerType !== "SALARIED") score += 10
  this.profileCompleteness = Math.min(score, 100)
})

// হট-রিলোডে মডেল পুনরায় নিবন্ধন প্রতিরোধ
const UserProfile: Model<IUserProfile> =
  mongoose.models.UserProfile ??
  mongoose.model<IUserProfile>("UserProfile", UserProfileSchema)

export default UserProfile
