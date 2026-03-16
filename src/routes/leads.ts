import { Router } from "express";
import { LeadController } from "./lead-controller";
import { LeadFacade } from "../application/lead-facade";
import { LeadRepository } from "../infra/lead-repository";

const repository = new LeadRepository();
const facade = new LeadFacade(repository);
const controller = new LeadController(facade);

export const leadRoutes = Router();

leadRoutes.post("/leads", controller.create);
leadRoutes.get("/leads", controller.list);
leadRoutes.get("/leads/:id", controller.getById);
leadRoutes.patch("/leads/:id/advance", controller.advance);
leadRoutes.patch("/leads/:id/finalize", controller.finalize);
