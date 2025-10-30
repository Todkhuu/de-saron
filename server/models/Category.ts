import { CategoryType } from "@/app/utils/types";
import { Model, Schema, model, models } from "mongoose";

const CategorySchema: Schema = new Schema<CategoryType>(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

export const CategoryModel: Model<CategoryType> =
  models["Category"] || model<CategoryType>("Category", CategorySchema);
