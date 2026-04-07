import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  title: string;
  category: string;
  description: string;
  src: string; // main thumbnail
  screenshots: string[];
  skills: {
    frontend: string[];
    backend: string[];
  };
  github?: string;
  live: string;
  order: number;
}

const ProjectSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    src: { type: String, required: true },
    screenshots: [{ type: String }],
    skills: {
      frontend: [{ type: String }],
      backend: [{ type: String }],
    },
    github: { type: String },
    live: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model<IProject>("Project", ProjectSchema);
