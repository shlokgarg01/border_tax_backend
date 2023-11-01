require("dotenv").config();
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// service charge logic
// road_tax
// m & q - 100
// y - 200

// border_tax
// daily - 30 but if >= 5 days =>  50rs
// monthly & q - service charge 50
// y - 100

// all_india_permit - yearly 200

const calculate_price = (start_date, end_date, seating, tax_type, tax_mode = null) => {
  const charges = JSON.parse(process.env.CHARGES);
  const key = `CAP${seating}_CHARGE`;

  const days = number_of_days(start_date, end_date);
  
  // calculating service charge
  let service_charge = charges.SERVICE_CHARGE * days;
  if (tax_type === "road_tax") {
    service_charge = 200; // in case of yearly
    if (tax_mode === "Monthly" || tax_mode === "Quaterly") {
      service_charge = 100;
    }
  } else if (tax_type === "border_tax") {
    if (tax_mode === "Daily") {
      service_charge = 30;
      if (days >= 5) {
        service_charge = 50;
      }
    } else if (tax_mode === "Monthly" || tax_mode === "Quaterly") {
      service_charge = 50;
    } else if (tax_mode === "Yearly") {
      service_charge = 100;
    }
  } else if (tax_type === "all_india_permit") {
    service_charge = 200;
  }

  const tax = charges[`${key}`] * days;
  return {
    service_charge,
    tax,
    total_amount: service_charge + tax,
  };
};

const send_whatsapp_message = (contact_number, data) => {
  client.messages
    .create({
      body: client_whatsapp_message(contact_number, data),
      from: `whatsapp:${process.env.TWILIO_CONTACT_NUMBER}`,
      to: `whatsapp:+91${contact_number}`,
    })
    .then((message) =>
      console.log(
        `Message sent successfully to client. Message SId ${message.sid}`
      )
    )
    .catch((error) =>
      console.log(`Cannot send message to Client. Error - ${error}`)
    );

  client.messages
    .create({
      body: admin_whatsapp_message(contact_number, data),
      from: `whatsapp:${process.env.TWILIO_CONTACT_NUMBER}`,
      to: `whatsapp:+91${process.env.ADMIN_CONTACT_NUMBER}`,
    })
    .then((message) =>
      console.log(
        `Message sent successfully to admin. Message SId ${message.sid}`
      )
    )
    .catch((error) =>
      console.log(`Cannot send message to Admin. Error - ${error}`)
    );
};

const client_whatsapp_message = (contact_number, params) => {
  let msg;
  if (params.tax_type === "road_tax") {
    msg = `Your order is confirmed. The details are mentioned below.\n*Vehicle Number*: ${params.vehicle_number}\n*Seating Capacity*: ${params.seating}\n*Chasis Number*: ${params.chasis_number}\n*Tax Mode*: ${params.tax_mode}\n*Contact Number*: ${contact_number}`;
  } else {
    msg = `Your order is confirmed. The details are mentioned below.\n*State*: ${
      params.state
    }\n*City*: ${params.city}\n*Vehicle Number*: ${
      params.vehicle_number
    }\n*Seating Capacity*: ${
      params.seating
    }\n*Start Date*: ${params.start_date.getDate()}-${
      params.start_date.getMonth() + 1
    }-${params.start_date.getFullYear()}\n*End Date*: ${params.end_date.getDate()}-${
      params.end_date.getMonth() + 1
    }-${params.end_date.getFullYear()}\n*Amount*: ${
      params.amount.total_amount
    }\n*Contact Number*: ${contact_number}`;
  }

  return msg;
};

const admin_whatsapp_message = (contact_number, params) => {
  let msg;
  if (params.tax_type === "road_tax") {
    msg = `New Order Received. The details are mentioned below.\n*Type*: ${params.tax_type}\n*Vehicle Number*: ${params.vehicle_number}\n*Seating Capacity*: ${params.seating}\n*Chasis Number*: ${params.chasis_number}\n*Tax Mode*: ${params.tax_mode}\n*Contact Number*: ${contact_number}`;
  } else {
    msg = `New Order Received. The details are mentioned below.\n*State*: ${
      params.state
    }\n*City*: ${params.city}\n*Vehicle Number*: ${
      params.vehicle_number
    }\n*Seating Capacity*: ${
      params.seating
    }\n*Start Date*: ${params.start_date.getDate()}-${
      params.start_date.getMonth() + 1
    }-${params.start_date.getFullYear()}\n*End Date*: ${params.end_date.getDate()}-${
      params.end_date.getMonth() + 1
    }-${params.end_date.getFullYear()}\n*Amount*: ${
      params.amount.total_amount
    }\n*Contact Number*: ${contact_number}`;
  }

  return msg;
};

const number_of_days = (start_date, end_date) => {
  return (end_date.getTime() - start_date.getTime()) / (1000 * 3600 * 24) + 1;
};

module.exports = { calculate_price, send_whatsapp_message };
