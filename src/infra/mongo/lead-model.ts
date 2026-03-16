import mongoose, { Schema } from "mongoose";
import { LeadOriginName, LeadStageName, LeadStatusName } from "../../domain/types";

export interface LeadDocument {
  _id: string;
  name: string;
  phone: string;
  origin: LeadOriginName;
  vehicle: string;
  stage: LeadStageName;
  status: LeadStatusName;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<LeadDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    origin: { type: String, required: true },
    vehicle: { type: String, required: true },
    stage: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

export const LeadModel =
  mongoose.models.Lead || mongoose.model<LeadDocument>("Lead", LeadSchema);

