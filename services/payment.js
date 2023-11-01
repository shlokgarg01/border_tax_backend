const sdk = require("api")("@phonepe-docs/v5#dbit19llb9u6m7");
var crypto = require("crypto");

const make_payment = async (req, res) => {
  const data = {
    merchantId: "merchantId",
    transactionId: "transactionId1",
    merchantOrderId: "merchantOrderId1",
    quantity: 1,
    amount: 5000,
    validFor: 600,
    merchantOrderContext: {
      trackingUrl: "",
      supportUrl: "",
    },
    fareDetails: {
      category: "SHOPPING",
      fareBreakup: [],
    },
    cartDetails: {},
  };

  const x = JSON.stringify(data);
  const y = Buffer.from(x).toString("base64");

  const salt_key = "jknjkvnfjkvnjkfnvjkd234978";
  const salt_index = 1;
  var hash = crypto.createHash("sha256");
  // originalValue = hash.update(y + "/v3/service/initiate" + salt_key, 'utf-8');
  // hashValue= originalValue.digest('hex');
  // const header = SHA256(base64 encoded payload + "/v3/service/initiate" + salt key) + ### + salt index
  const k = hash.update(y + "/v3/service/initiate" + salt_key).digest("hex");
  // const k = "eyJtZXJjaGFudElkIjoibWVyY2hhbnRJZCIsInRyYW5zYWN0aW9uSWQiOiJ0cmFuc2FjdGlvbklkMSIsIm1lcmNoYW50T3JkZXJJZCI6Im1lcmNoYW50T3JkZXJJZDEiLCJxdWFudGl0eSI6MSwiYW1vdW50Ijo1MDAwLCJ2YWxpZEZvciI6NjAwLCJtZXJjaGFudE9yZGVyQ29udGV4dCI6eyJ0cmFja2luZ1VybCI6IiIsInN1cHBvcnRVcmwiOiIifSwiZmFyZURldGFpbHMiOnsiY2F0ZWdvcnkiOiJTSE9QUElORyIsImZhcmVCcmVha3VwIjpbXX0sImNhcnREZXRhaWxzIjp7fX0=/v3/service/initatejknjkvnfjkvnjkfnvjkd234978"

  const z = k + "###" + salt_index;

  const sdk = require("api")("@phonepe-docs/v5#dbit19llb9u6m7");

  sdk
    .initiateServiceRequest(
      {
        request: y,
      },
      {
        "x-verify": z,
        "x-callback-url": "https://google.com",
        "Content-Type": "application/json",
      }
    )
    .then(({ data }) =>
      res.json({
        message: data,
      })
    )
    .catch((err) =>
      res.json({
        error: err,
      })
    );

  // res.json({
  //   message: 'success'
  // })
};

module.exports = {
  make_payment,
};
