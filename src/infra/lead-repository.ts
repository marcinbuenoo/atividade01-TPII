import { Lead } from "../domain/lead";
import { LeadOriginFactory } from "../domain/factory/lead-origin-factory";
import { LeadModel, LeadDocument } from "./mongo/lead-model";

export class LeadRepository {
  async save(lead: Lead): Promise<void> {
    const snapshot = lead.toSnapshot();
    await LeadModel.findByIdAndUpdate(
      lead.id,
      {
        _id: lead.id,
        name: snapshot.name,
        phone: snapshot.phone,
        origin: snapshot.origin,
        vehicle: snapshot.vehicle,
        stage: snapshot.stage,
        status: snapshot.status,
      },
      { upsert: true }
    );
  }

  async findAll(): Promise<Lead[]> {
    const rows = await LeadModel.find().lean<LeadDocument[]>();
    return rows.map((row) => {
      const id = (row as unknown as { _id: string })._id;
      return Lead.rehydrate({
        id,
        name: row.name,
        phone: row.phone,
        vehicle: row.vehicle,
        origin: LeadOriginFactory.create(row.origin),
        stage: row.stage,
        status: row.status,
      });
    });
  }

  async findById(id: string): Promise<Lead | undefined> {
    const row = await LeadModel.findById(id).lean<LeadDocument | null>();
    if (!row) {
      return undefined;
    }
    return Lead.rehydrate({
      id: (row as unknown as { _id: string })._id,
      name: row.name,
      phone: row.phone,
      vehicle: row.vehicle,
      origin: LeadOriginFactory.create(row.origin),
      stage: row.stage,
      status: row.status,
    });
  }
}
