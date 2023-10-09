/* eslint-disable @typescript-eslint/no-explicit-any */
// naturantsModel.ts
import mongoose, { Document, Schema } from "mongoose";

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

const phoneNumberValidator = (value: string) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(value);
};

interface NaturantsData extends Document {
  restaurantName: string;
  address: string;
  phone: string;
  menuItems: MenuItem[];
  employees: Employee[];
  orders: Order[];
  customers: Customer[];
  updatedAt?: Date;
}

const menuItemSchema = new Schema({
  itemName: { type: String, required: true },
  price: { type: Number, required: true },
});

const employeeSchema = new Schema({
  employeeName: { type: String, required: true },
  position: { type: String, required: true },
});

const orderSchema = new Schema({
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
      validator: phoneNumberValidator,
      message: "Invalid phone number format",
    },
  },
});

const naturantsSchema = new Schema({
  restaurantName: { type: String, required: true },
  address: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: phoneNumberValidator,
      message: "Invalid phone number format",
    },
  },
  menuItems: [menuItemSchema],
  employees: [employeeSchema],
  orders: [orderSchema],
  customers: [customerSchema],
  updatedAt: { type: Date },
});

// Pre-save middleware
naturantsSchema.pre<NaturantsData>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Aggregation middleware
naturantsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isActive: { $ne: false } } });
  next();
});

const NaturantsModel = mongoose.model<NaturantsData>(
  "Naturants",
  naturantsSchema
);

export default NaturantsModel;
