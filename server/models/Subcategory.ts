import { Schema, model, models } from "mongoose";

const SubcategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    services: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
SubcategorySchema.index({ category: 1 });
SubcategorySchema.index({ name: 1 });

export const Subcategory =
  models.Subcategory || model("Subcategory", SubcategorySchema);
