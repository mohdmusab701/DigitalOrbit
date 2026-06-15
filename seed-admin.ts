import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./src/backend/models/Admin";
import dbConnect from "./src/backend/database/mongodb";

// Require dotenv to load .env.local
require("dotenv").config({ path: ".env.local" });

async function seed() {
  try {
    await dbConnect();
    
    const email = "admin@digitalorbit.com";
    const existing = await Admin.findOne({ email });
    
    if (existing) {
      await Admin.deleteOne({ email });
      console.log("Deleted existing admin to recreate.");
    }
    
    await Admin.create({
      email,
      passwordHash: "password123", // The pre-save hook will hash this
      role: "superadmin"
    });
    
    console.log("Admin created successfully!");
    console.log("Email: admin@digitalorbit.com");
    console.log("Password: password123");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    process.exit(0);
  }
}

seed();
