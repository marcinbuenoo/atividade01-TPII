import { NextFunction, Request, Response } from "express";
import { LeadFacade } from "../application/lead-facade";

export class LeadController {
  constructor(private facade: LeadFacade) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, phone, origin, vehicle } = req.body;
      const lead = await this.facade.createLead({ name, phone, origin, vehicle });
      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json(await this.facade.listLeads());
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.facade.getLead(req.params.id);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  advance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const lead = await this.facade.advanceLead(req.params.id);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };

  finalize = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { outcome } = req.body;
      const lead = await this.facade.finalizeLead(req.params.id, outcome);
      res.json(lead);
    } catch (error) {
      next(error);
    }
  };
}
