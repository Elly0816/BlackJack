import { Request, Response } from "express";

export function getHomeRouteHandler(req: Request, res: Response): void {
  console.log(`Path: ${req.path}`);
  res.send(`Home Route was hit successfully`);
}
