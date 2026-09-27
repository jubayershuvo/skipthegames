// Temporary end-to-end check of the wrong-credentials data path, using the REAL
// model file:  node st-route.mts <userId> <email>
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import User from "./models/userModel.ts";

const env = fs.readFileSync(path.join(process.cwd(), ".env"), "utf8");
const readVar = (name: string) => {
  const line = env.split(/\r?\n/).find((l) => l.trim().startsWith(name + "="));
  if (!line) return "";
  return line
    .slice(line.indexOf("=") + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
};

const id = process.argv[2];
const email = process.argv[3];

await mongoose.connect(`${readVar("MONGO_DB_URL")}/${readVar("DB_NAME")}`);
console.log("db:", mongoose.connection.name, "| model fields:", Object.keys(User.schema.paths).join(","));

// POST /api/admin/user-status
const written = await User.findByIdAndUpdate(
  id,
  { $set: { status: "email-wrong" } },
  { new: true }
);
console.log("1. admin write            ->", JSON.stringify(written?.status));

// GET /api/user-status?id=...
const byId = await User.findById(id).select("status");
console.log("2. client read (id)       ->", JSON.stringify(byId?.status));

// GET /api/user-status?email=...  (fallback path)
const byEmail = await User.findOne({ email })
  .sort({ createdAt: -1 })
  .select("status");
console.log("3. client read (fallback) ->", JSON.stringify(byEmail?.status));

// password-wrong + redirect target the hook would push to
const second = await User.findByIdAndUpdate(
  id,
  { $set: { status: "password-wrong" } },
  { new: true }
);
console.log("4. admin write            ->", JSON.stringify(second?.status));

// cleanup (back to the default state)
const reset = await User.findByIdAndUpdate(
  id,
  { $set: { status: "" } },
  { new: true }
);
console.log("5. cleanup                ->", JSON.stringify(reset?.status));

await mongoose.disconnect();
