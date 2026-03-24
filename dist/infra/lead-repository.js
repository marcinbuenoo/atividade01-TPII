"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadRepository = void 0;
const lead_1 = require("../domain/lead");
const lead_origin_factory_1 = require("../domain/factory/lead-origin-factory");
const lead_model_1 = require("./mongo/lead-model");
class LeadRepository {
    async save(lead) {
        const snapshot = lead.toSnapshot();
        await lead_model_1.LeadModel.findByIdAndUpdate(lead.id, {
            _id: lead.id,
            name: snapshot.name,
            phone: snapshot.phone,
            origin: snapshot.origin,
            vehicle: snapshot.vehicle,
            stage: snapshot.stage,
            status: snapshot.status,
        }, { upsert: true });
    }
    async findAll() {
        const rows = await lead_model_1.LeadModel.find().lean();
        return rows.map((row) => {
            const id = row._id;
            return lead_1.Lead.rehydrate({
                id,
                name: row.name,
                phone: row.phone,
                vehicle: row.vehicle,
                origin: lead_origin_factory_1.LeadOriginFactory.create(row.origin),
                stage: row.stage,
                status: row.status,
            });
        });
    }
    async findById(id) {
        const row = await lead_model_1.LeadModel.findById(id).lean();
        if (!row) {
            return undefined;
        }
        return lead_1.Lead.rehydrate({
            id: row._id,
            name: row.name,
            phone: row.phone,
            vehicle: row.vehicle,
            origin: lead_origin_factory_1.LeadOriginFactory.create(row.origin),
            stage: row.stage,
            status: row.status,
        });
    }
}
exports.LeadRepository = LeadRepository;
