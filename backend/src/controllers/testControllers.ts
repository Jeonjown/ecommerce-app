import { Request, Response } from "express";

export const printTest = (req: Request, res: Response) => {
  res.json({ message: "hello world" });
};
