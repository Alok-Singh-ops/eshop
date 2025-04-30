import crypto from "crypto"
import { ValidationError } from "../../../../packages/error-handler"
import { NextFunction } from "express"
import { sendEmail } from "./sendMail"
import redis from "../../../../packages/libs/redis"


const emailRegex=/^[^@]+@[^@]+\.[^@]+$/


export const validateRegistrationData = (data:any,userType: "user"| 'seller')=>{
  const {name,email,password,phone_number,country} = data
  if (!name || !email || !password || (userType === "seller" && (!phone_number || !country))) {
    throw new ValidationError("Missing required field")
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email id")
  }
}

export const checkOtpRestrictions = async (email:string,next:NextFunction)=>{
  if (await redis.get(`otp_lock:${email}`)) {
    return next(new ValidationError("Account locked due to multiple failed attempts!. Try again after 30min"));
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(new ValidationError("Too many otp requests!. Please wait 1 hour before requesting for otp"))
  }
  if (await redis.get(`otp:cooldown:${email}`)) {
    return next(new ValidationError("Please wait 1min before requesting a new OTP!"))
  }
}

export const trackOtpRequests = async (email:string,next:NextFunction)=>{
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || '0')
  if (otpRequests>= 2) {
    await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600) // 1hour
    return next(new ValidationError("Too many OTP request. Please wait i hour before requesting again"))
  }
  await redis.set(otpRequestKey,otpRequestKey+1,"EX",3600)
}

export const sendOtp = async (name:string,email:string,template:string)=>{
  const otp = crypto.randomInt(1000,9999).toString()
  await sendEmail(email,"Verify your email",template,{otp})
  await redis.set(`otp:${email}`,otp,"EX",300)
  await redis.set(`otp_cooldown:${email}`,"true","EX",60)

}