import asyncHandler from "express-async-handler";
import { buildQuery } from "../utils/apiFeatures.js";

// Generic CRUD factory to keep controllers DRY across simple resources
export const getAll = (Model, searchFields = [], populate = "") =>
  asyncHandler(async (req, res) => {
    const { query, filter, page, limit } = buildQuery(Model, req.query, searchFields);
    if (populate) query.populate(populate);

    const [docs, total] = await Promise.all([query, Model.countDocuments(filter)]);

    res.json({
      success: true,
      count: docs.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: docs,
    });
  });

export const getOne = (Model, populate = "") =>
  asyncHandler(async (req, res) => {
    let query = Model.findById(req.params.id);
    if (populate) query = query.populate(populate);
    const doc = await query;
    if (!doc) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: doc });
  });

export const createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ success: true, data: doc });
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: doc });
  });

export const deleteOne = (Model) =>
  asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      res.status(404);
      throw new Error("Resource not found");
    }
    res.json({ success: true, data: {} });
  });
