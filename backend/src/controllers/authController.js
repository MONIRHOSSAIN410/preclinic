import asyncHandler from "express-async-handler";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Public
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, clinicName } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email and password");
  }

  const existing = await Admin.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("An admin with this email already exists");
  }

  const isFirstAdmin = (await Admin.countDocuments()) === 0;

  const admin = await Admin.create({
    name,
    email,
    password,
    clinicName: clinicName || "Trustcare Clinic",
    role: isFirstAdmin ? "superadmin" : "admin",
  });

  const token = generateToken(admin._id);

  res.status(201).json({
    success: true,
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      clinicName: admin.clinicName,
      avatar: admin.avatar,
    },
  });
});

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const admin = await Admin.findOne({ email }).select("+password");

  if (!admin || !(await admin.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  admin.lastLogin = new Date();
  await admin.save();

  const token = generateToken(admin._id);

  res.json({
    success: true,
    token,
    admin: {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      clinicName: admin.clinicName,
      avatar: admin.avatar,
    },
  });
});

// @desc    Get current admin profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

// @desc    Update admin profile
// @route   PUT /api/auth/me
// @access  Private
export const updateMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id);
  if (!admin) {
    res.status(404);
    throw new Error("Admin not found");
  }

  admin.name = req.body.name || admin.name;
  admin.clinicName = req.body.clinicName || admin.clinicName;
  admin.avatar = req.body.avatar || admin.avatar;
  if (req.body.password) admin.password = req.body.password;

  const updated = await admin.save();

  res.json({
    success: true,
    admin: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      clinicName: updated.clinicName,
      avatar: updated.avatar,
    },
  });
});
