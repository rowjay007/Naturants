/* eslint-disable @typescript-eslint/no-explicit-any */
// naturantsModel.ts
import mongoose, { Document, Query, Schema } from "mongoose";

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
  phoneNumber: { type: String, required: true },
});

const naturantsSchema = new Schema({
  restaurantName: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  menuItems: [menuItemSchema],
  employees: [employeeSchema],
  orders: [orderSchema],
  customers: [customerSchema],
  updatedAt: { type: Date },
});

// Pre-save middleware
naturantsSchema.pre<NaturantsData>("save", function (next: any) {
  this.updatedAt = new Date();
  next();
});

// Query middleware
naturantsSchema.pre<Query<any, NaturantsData>>(/^find/, function (next: any) {
  console.log("Executing query:", this.getFilter());
  next();
});

const NaturantsModel = mongoose.model<NaturantsData>(
  "Naturants",
  naturantsSchema
);

export default NaturantsModel;
