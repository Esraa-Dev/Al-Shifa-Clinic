import User from "../models/UserSchema.js";
import { UserRole } from "../constants.js";

export const runAdminSeed = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const adminExists = await User.findOne({ email: adminEmail });

  if (!adminExists) {
    const admin = new User({
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD,
      phone: process.env.ADMIN_PHONE,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      profileStatus: "complete",
    });

    await admin.save();
  }
};
