/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Schema, Document, Types } from "mongoose";
import slugify from "slugify";
import validator from "validator";
import { ValidationError } from "../utils/appError";

interface MenuItem {
  itemName: string;
  price: number;
}

interface Employee {
  employeeName: string;
  position: string;
}

interface Order {
  orderNumber: number;
  tableNumber: number;
  items: string[];
  totalAmount: number;
}

interface Customer {
  customerName: string;
  phoneNumber: string;
}

interface NaturantsData extends Document {
  restaurantName: string;
  address: string;
  phone: string;
  menuItems: MenuItem[];
  employees: Employee[];
  orders: Types.DocumentArray<Order & Document>;
  customers: Customer[];
  slug?: string;
  updatedAt?: Date;
  isActive?: boolean;
}

const menuItemSchema = new Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
});

const employeeSchema = new Schema({
  employeeName: { type: String, required: true },
  position: { type: String, required: true },
});

const orderSchema = new Schema<Order>({
  orderNumber: { type: Number, required: true },
  tableNumber: { type: Number, required: true },
  items: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
});

const customerSchema = new Schema({
  customerName: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        validator.isMobilePhone(value, "any", { strictMode: false }),
      message: "Invalid phone number format. Use a valid phone number.",
    },
  },
});

const naturantsSchema = new Schema<NaturantsData>({
  restaurantName: { type: String, required: true },
  address: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) =>
        validator.isMobilePhone(value, "any", { strictMode: false }),
      message: "Invalid phone number format. Use a valid phone number.",
    },
  },
  menuItems: [menuItemSchema],
  employees: [employeeSchema],
  orders: [orderSchema],
  customers: [customerSchema],
  slug: { type: String, unique: true },
  updatedAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

// Pre-save middleware
naturantsSchema.pre<NaturantsData>("save", function (next) {
  this.updatedAt = new Date();
  this.slug = slugify(this.restaurantName, { lower: true });
  next();
});

// Aggregation middleware
naturantsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isActive: { $ne: false } } });
  next();
});

// Virtual Populate
naturantsSchema.virtual("ordersData", {
  ref: "Naturants",
  localField: "_id",
  foreignField: "orders",
  justOne: false,
});

// Query middleware to handle validation errors
naturantsSchema.post(
  "find",
  function (error: any, res: any, next: (arg0: any) => void) {
    if (error.name === "ValidationError") {
      next(new ValidationError(error.message));
    } else {
      next(error);
    }
  }
);

// Custom error handling middleware
naturantsSchema.post(
  "save",
  function (error: any, doc: NaturantsData, next: (arg0: any) => void) {
    if (error.name === "ValidationError") {
      next(new ValidationError(error.message));
    } else {
      next(error);
    }
  }
);

const NaturantsModel = mongoose.model<NaturantsData>(
  "Naturants",
  naturantsSchema
);

export default NaturantsModel;
