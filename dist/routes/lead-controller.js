"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
class LeadController {
    facade;
    constructor(facade) {
        this.facade = facade;
    }
    create = async (req, res, next) => {
        try {
            const { name, phone, origin, vehicle } = req.body;
            const lead = await this.facade.createLead({ name, phone, origin, vehicle });
            res.status(201).json(lead);
        }
        catch (error) {
            next(error);
        }
    };
    list = async (_req, res, next) => {
        try {
            res.json(await this.facade.listLeads());
        }
        catch (error) {
            next(error);
        }
    };
    getById = async (req, res, next) => {
        try {
            const lead = await this.facade.getLead(req.params.id);
            res.json(lead);
        }
        catch (error) {
            next(error);
        }
    };
    advance = async (req, res, next) => {
        try {
            const lead = await this.facade.advanceLead(req.params.id);
            res.json(lead);
        }
        catch (error) {
            next(error);
        }
    };
    finalize = async (req, res, next) => {
        try {
            const { outcome } = req.body;
            const lead = await this.facade.finalizeLead(req.params.id, outcome);
            res.json(lead);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LeadController = LeadController;
