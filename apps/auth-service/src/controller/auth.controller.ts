// register a new user

import { NextFunction, Request, Response } from "express";
import {
  checkOtpRestrictions,
  sendOtp,
  trackOtpRequests,
  validateRegistrationData,
} from "../utils/auth.helper";
import { ValidationError } from "../../../../packages/error-handler";
import { PrismaClient } from "@prisma/client";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prisma = new PrismaClient()
    validateRegistrationData(req.body, "user");
    const { name, email } = req.body;
    const existingUser = await prisma.users.findUnique({
      where: email,
    });
    if (existingUser) {
      return next(new ValidationError("User already exist with this email"));
    }
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(name, email, "user-activation-mail");
    res.status(200).json({
      message: "OTP sent to email. Please verify your Account",
    });
  } catch (error) {
    return next(error);
  }
};
