const prisma = require("../config/db.prisma");
const { encryptPassword, decryptPassword } = require("../utils/encryption");
const { createToken } = require("../utils/jwt");
const sendEmail = require("../utils/sendEmail");
const { userRegisterSchema, userLoginSchema, verifyOTPSchema } = require("./auth.schema");

// utils functions
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

async function sendOTPEmail(email, otp) {
  const option = {
    email: email,
    subject: "Verification email from car learner's",
    message: `Congratulations on taking the first step towards obtaining your car learner's permit! To proceed with the verification process, please use the following code:
  
  Verification Code: ${otp}

  Please enter this code on the verification page to complete your application.

  If you did not request this verification or have any questions, please contact our support team immediately.

  Safe driving!`,
  };

  await sendEmail(option);

  return otp;
}

// =================================================================
// controller functions
async function register(req, res, next) {
  try {
    const validatedData = userRegisterSchema.parse(req.body);
    console.log(validatedData);
    // get account type
    const { type } = req.params;
    // get user details
    let { name, email, number, password } = validatedData;

    // hash password
    password = encryptPassword(password);

    // generate and send otp for verification
    const otp = generateOTP();

    let createUser;
    if (otp && password) {
      if (type === "learner") {
        createUser = await prisma.learner.create({
          data: {
            name,
            email,
            number,
            password,
            otp,
          },
        });
      } else if (type === "owner") {
        createUser = await prisma.owner.create({
          data: {
            name,
            email,
            number,
            password,
            otp,
          },
        });
      }
    }

    if (createUser) {
      await sendOTPEmail(createUser.email, createUser.otp);
      return res.json({ message: "done!", user: createUser });
    }

    return next();
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const validatedData = userLoginSchema.parse(req.body);
    // get account type
    const { type } = req.params;
    const { email, password } = validatedData;

    // get user using email
    let user;
    if (type === "learner") {
      user = await prisma.learner.findUnique({
        where: {
          email,
        },
      });
    } else if (type === "owner") {
      user = await prisma.owner.findUnique({
        where: {
          email,
        },
      });
    }

    if (!user) {
      return res.status(400).json({
        message: "User is not register.",
      });
    }

    const comparePassword = decryptPassword(password, user.password);

    if (comparePassword) {
      delete user.otp;
      delete user.password;
      if (!user.isVerifyed) {
        const otp = await sendOTPEmail(user.email);
        let updateOTP;
        if (type === "learner") {
          updateOTP = await prisma.learner.update({
            data: {
              otp,
            },
            where: {
              email,
            },
          });
        } else if (type === "owner") {
          updateOTP = await prisma.owner.update({
            data: {
              otp,
            },
            where: {
              email,
            },
          });
        }
        return res.json(403).json({ message: "First verify account OTP is sended on register email." });
      }
      user.type = type;
      const token = createToken(user);
      return res.status(200).json({ message: "Login successfully.", user, token });
    } else {
      return res.status(400).json({ message: "Incorrect password!" });
    }
  } catch (error) {
    return next(error);
  }
}

async function verifyOTP(req, res, next) {
  try {
    const validatedData = verifyOTPSchema.parse(req.body);
    // get account type
    const { type } = req.params;
    // req body data
    const { email, otp } = validatedData;

    // get user using email
    let user;
    if (type === "learner") {
      user = await prisma.learner.findUnique({
        where: {
          email,
        },
      });
    } else if (type === "owner") {
      user = await prisma.owner.findUnique({
        where: {
          email,
        },
      });
    }

    const compareOTP = user.otp === Number(otp);
    if (compareOTP) {
      let updateVerifyStatus;
      if (type === "learner") {
        updateVerifyStatus = await prisma.learner.update({
          data: {
            isVerifyed: true,
            otp: 0,
          },
          where: {
            email,
          },
        });
      } else if (type === "owner") {
        updateVerifyStatus = await prisma.owner.update({
          data: {
            isVerifyed: true,
            otp: 0,
          },
          where: {
            email,
          },
        });
      }

      if (updateVerifyStatus) {
        delete updateVerifyStatus.otp;
        delete updateVerifyStatus.password;
        updateVerifyStatus.type = type;
        const token = createToken(updateVerifyStatus);
        return res.status(200).json({ message: "Verify successfully", user: updateVerifyStatus, token });
      }

      return next();
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login,
  verifyOTP,
};
