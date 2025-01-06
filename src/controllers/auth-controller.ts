import { NextFunction, Request, Response } from "express";

const signinController = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: `Sign In Successful!`,
    token: `jwtTokensdakdskaj`,
  });
};

const signupController = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: `User Created Successfully!`,
    token: `jwtTokensdakdskaj`,
  });
};

export { signinController, signupController };
