import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";
import validator from "validator";

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
  slug: string;
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
      validator: (value: string) =>
        validator.isMobilePhone(value, "any", { strictMode: false }),
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
      validator: (value: string) =>
        validator.isMobilePhone(value, "any", { strictMode: false }),
      message: "Invalid phone number format",
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

  // Generate a slug from the restaurant name using 'slugify'
  this.slug = slugify(this.restaurantName, { lower: true });

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
