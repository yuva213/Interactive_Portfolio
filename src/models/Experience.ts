import mongoose, { Schema, Document } from "mongoose";

export interface IExperience extends Document {
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: string[];
  category: "work" | "education";
  order: number;
}

const ExperienceSchema: Schema = new Schema(
  {
    startDate: { type: String, required: true },
    endDate: { type: String, default: "Present" },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: [{ type: String }],
    skills: [{ type: String }],
    category: { type: String, enum: ["work", "education"], default: "work" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);
