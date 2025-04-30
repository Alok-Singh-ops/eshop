export class AppError extends Error {
  public readonly statusCode:number;
  public readonly isOperational: boolean
  public readonly details?: any

  constructor(message:string,statusCode:number,isOperational = true,details?:any){
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.isOperational = isOperational
    Error.captureStackTrace(this)
  }

}


// not found error
export class NotFoundError extends AppError{
  constructor(message = "Resources not found"){
    super(message,404,true)
  }
}


// validation error
export class ValidationError extends AppError{
  constructor(message = "Invalid request data",details?:any){
    super(message,400,true,details)
  }
}

export class AuthError extends AppError{
  constructor(message = "Unauthorized"){
    super(message,401,true)
  }
}


export class ForbiddenError extends AppError{
  constructor(message = "Forbidden access"){
    super(message,403)
  }
}