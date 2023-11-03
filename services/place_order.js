const Order = require("../Model/order");
const {
  calculate_price,
  send_whatsapp_message,
} = require("../utils/place_order");

const place_order = async (req, res) => {
  let {
    state,
    city,
    seating,
    contact_number,
    tax_mode,
    tax_type,
    start_date,
    end_date,
    vehicle_number,
    chasis_number,
  } = req.body;

  if (!tax_type || tax_type === "") {
    return res.status(400).json({
      is_success: false,
      message: "Tax Type is required",
    });
  }

  let params;

  if (tax_type === "road_tax" || tax_type === "all_india_permit") {
    if (!seating || seating === "") {
      return res.status(400).json({
        is_success: false,
        message: "Seating Capacity is required",
      });
    } else if (contact_number.toString().length != 10 || !contact_number) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid Contact Number",
      });
    } else if (chasis_number === "" || !chasis_number) {
      return res.status(400).json({
        is_success: false,
        message: "Chasis Number is required",
      });
    } else if (vehicle_number === "" || !vehicle_number) {
      return res.status(400).json({
        is_success: false,
        message: "Vehicle Number is required",
      });
    }

    if (tax_type === "all_india_permit") tax_mode = "all_india_permit";

    console.log("before order create params")
    params = {
      contact_number,
      seating,
      tax_mode,
      tax_type,
      vehicle_number,
      chasis_number,
      amount: calculate_price("", "", seating, tax_type, tax_mode),
    };
  } else {
    start_date = new Date(start_date);
    start_date.setHours(0, 0, 0, 0);
    end_date = new Date(end_date);
    end_date.setHours(0, 0, 0, 0);
    current_date = new Date();
    current_date.setHours(0, 0, 0, 0);

    if (!state || state === "") {
      return res.status(400).json({
        is_success: false,
        message: "State is required",
      });
    } else if (!city || city === "") {
      return res.status(400).json({
        is_success: false,
        message: "City is required",
      });
    } else if (!seating || seating === "") {
      return res.status(400).json({
        is_success: false,
        message: "Seating Capacity is required",
      });
    } else if (!tax_mode || tax_mode === "") {
      return res.status(400).json({
        is_success: false,
        message: "Tax Mode is required",
      });
    } else if (contact_number.toString().length != 10 || !contact_number) {
      return res.status(400).json({
        is_success: false,
        message: "Invalid Contact Number",
      });
    } else if (!start_date) {
      return res.status(400).json({
        is_success: false,
        message: "Start Date is required",
      });
    } else if (start_date < current_date) {
      return res.status(400).json({
        is_success: false,
        message: "Start Date cannot be less than today",
      });
    } else if (!end_date) {
      return res.status(400).json({
        is_success: false,
        message: "End Date is required",
      });
    } else if (end_date < start_date) {
      return res.status(400).json({
        is_success: false,
        message: "Start Date cannot be more than End Date",
      });
    }

    params = {
      state,
      city,
      contact_number,
      seating,
      tax_mode,
      tax_type,
      start_date,
      end_date,
      vehicle_number,
      amount: calculate_price(
        start_date,
        end_date,
        seating,
        tax_type,
        tax_mode
      ),
    };
  }

  // TODO:SHLOK - make API call for gateway here

  const order = await Order.create(params);
  send_whatsapp_message(contact_number, params);
  return res.status(200).json({
    is_success: true,
    message: "Order created successfully",
    data: order,
  });
};

const charges = (req, res) => {
  let { start_date, end_date, seating, tax_type, tax_mode } = req.query;
  console.log('params------------ ', start_date, end_date, typeof(start_date), typeof(end_date), seating, tax_mode, tax_type)

  if (start_date !== "" && end_date !== "") {
    console.log("INSIDE IF CONDITION")
    start_date = new Date(start_date);
    start_date.setHours(0, 0, 0, 0);
    end_date = new Date(end_date);
    end_date.setHours(0, 0, 0, 0);
    current_date = new Date();
    current_date.setHours(0, 0, 0, 0);
  }
  console.log('params 2 ------------ ', start_date, end_date, seating, tax_mode, tax_type)

  // if (!start_date) {
  //   return res.status(400).json({
  //     is_success: false,
  //     message: "Start Date is required",
  //   });
  // } else if (start_date < current_date) {
  //   return res.status(400).json({
  //     is_success: false,
  //     message: "Start Date cannot be less than today",
  //   });
  // } else if (!end_date) {
  //   return res.status(400).json({
  //     is_success: false,
  //     message: "End Date is required",
  //   });
  // } else if (end_date < start_date) {
  //   return res.status(400).json({
  //     is_success: false,
  //     message: "Start Date cannot be more than End Date",
  //   });
  // } else if (!seating || seating === "") {
  //   return res.status(400).json({
  //     is_success: false,
  //     message: "Seating Capacity is required",
  //   });
  // }

  let charges = calculate_price(
    start_date,
    end_date,
    seating,
    tax_type,
    tax_mode
  );

  console.log('response of charges - ', charges)
  res.status(200).json({
    is_success: true,
    message: "Charges calculated",
    data: charges,
  });
};

module.exports = { place_order, charges };
