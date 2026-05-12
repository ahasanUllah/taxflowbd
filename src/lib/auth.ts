// server-only — never import this file in client components
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { MongoClient } from "mongodb"
import { connectToDatabase } from "./mongodb"
import UserProfile from "@/models/User"

// Fallback URI prevents module-level crash during `next build` when env var is absent.
// MongoClient does not connect until the first actual request.
const client = new MongoClient(process.env.MONGODB_URI ?? "mongodb://localhost:27017")

export const auth = betterAuth({
  database: mongodbAdapter(client.db("taxflowbd")),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  plugins: [nextCookies()],
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await connectToDatabase()
            await UserProfile.create({ betterAuthUserId: user.id })
          } catch (err) {
            console.error("UserProfile creation failed for user:", user.id, err)
          }
        },
      },
    },
  },
})
