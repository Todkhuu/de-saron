import { connectMongoDb } from "@/server/database/mongodb";
import { ServiceModel } from "@/server/models/Service";
// Ensure referenced models are registered for populate
import "@/server/models/Subcategory";
import "@/server/models/Category";
import { NextRequest, NextResponse } from "next/server";

connectMongoDb();

export async function GET(_request: NextRequest) {
  try {
    const services = await ServiceModel.find({})
      .populate("category")
      .populate("subcategory");

    return NextResponse.json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const serviceData = await request.json();

    const newService = new ServiceModel(serviceData);
    const savedService = await newService.save();

    return NextResponse.json({
      success: true,
      service: savedService,
    });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { _id, ...updates } = body || {};
    if (!_id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }

    const updated = await ServiceModel.findByIdAndUpdate(_id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("category")
      .populate("subcategory");

    if (!updated) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      service: updated,
    });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
