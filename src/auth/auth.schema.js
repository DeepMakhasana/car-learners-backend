const z = require("zod");

const userRegisterSchema = z.object({
  name: z
    .string()
    .min(5, "Username must be at least 5 characters long")
    .max(30, "Username must be at most 30 characters long")
    .refine(
      (value) => {
        // Ensure password contains at least one alphanumeric character and any symbol
        return /^[a-zA-Z\s]+$/.test(value);
      },
      {
        message: "Username must contain only alphabetic characters",
      }
    ),
  email: z.string().email("Email is not valid"),
  number: z
    .string()
    .min(10, "Mobile number must contain 10 number")
    .max(10, "Mobile number must contain 10 number")
    .refine(
      (value) => {
        // Ensure password contains at least one alphanumeric character and any symbol
        return /^[6-9]\d{9}$/.test(value);
      },
      {
        message: "Mobile number must be a valid Indian mobile number",
      }
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password must be at most 30 characters long")
    .refine(
      (value) => {
        return /^(?=.*[a-zA-Z0-9])[\s\S]{8,30}$/.test(value);
      },
      {
        message:
          "Password must be between 8 and 30 characters and contain at least one alphanumeric character and any symbols",
      }
    ),
});

const userLoginSchema = z.object({
  email: z.string().email("Email is not valid"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, "Password must be at most 30 characters long")
    .refine(
      (value) => {
        return /^(?=.*[a-zA-Z0-9])[\s\S]{8,30}$/.test(value);
      },
      {
        message:
          "Password must be between 8 and 30 characters and contain at least one alphanumeric character and any symbols",
      }
    ),
});

const verifyOTPSchema = z.object({
  email: z.string().email("Email is not valid"),
  otp: z
    .string()
    .min(6, "OTP must be 6 digit")
    .max(6, "OTP must be 6 digit")
    .refine(
      (value) => {
        return /^\d{6}$/.test(value);
      },
      {
        message: "OTP contain 6 digit.",
      }
    ),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  verifyOTPSchema,
};
