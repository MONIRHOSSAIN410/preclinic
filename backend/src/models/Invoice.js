import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    unitCost: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
    issuedOn: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    items: [invoiceItemSchema],
    taxPercent: { type: Number, default: 9 },
    discountPercent: { type: Number, default: 0 },
    bankName: { type: String, default: "ABC Bank" },
    accountNumber: { type: String, default: "" },
    ifscCode: { type: String, default: "" },
    recurring: { type: String, enum: ["None", "Monthly", "Quarterly", "Yearly"], default: "None" },
    status: { type: String, enum: ["Paid", "Due", "Overdue", "Cancelled"], default: "Due" },
  },
  { timestamps: true }
);

invoiceSchema.pre("validate", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = "INV" + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

invoiceSchema.virtual("subtotal").get(function () {
  return this.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
});

invoiceSchema.virtual("total").get(function () {
  const subtotal = this.subtotal;
  const tax = (subtotal * this.taxPercent) / 100;
  const discount = (subtotal * this.discountPercent) / 100;
  return Math.round((subtotal + tax - discount) * 100) / 100;
});

invoiceSchema.set("toJSON", { virtuals: true });
invoiceSchema.set("toObject", { virtuals: true });

export default mongoose.model("Invoice", invoiceSchema);
