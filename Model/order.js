const mongoose = require("mongoose");

const order_schema = new mongoose.Schema(
  {
    city: {
      type: String
    },
    state: {
      type: String
    },
    seating: {
      type: Number,
      required: [true, "Seating Capacity is required"],
    },
    contact_number: {
      type: Number,
      required: [true, "Contact Number is required"],
    },
    // border: {
    //   type: String,
    //   required: [true, "Border is required"],
    // },
    tax_mode: {
      type: String,
      required: [true, "Tax Mode is required"],
    },
    tax_type: {
      type: String,
      required: [true, "Tax Type is Required"],
    },
    vehicle_number: {
      type: String
    },
    chasis_number: {
      type: String
    },
    amount: {
      service_charge: {
        type: Number,
      },
      tax:{
        type: Number,
      },
      total_amount: {
        type: Number,
      }
    },
    start_date: {
      type: String
    },
    end_date: {
      type: String
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("order", order_schema);
