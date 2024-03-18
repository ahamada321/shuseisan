const { normalizeErrors } = require("./helpers/mongoose");
const Payment = require("./models/payment");
const Prompt = require("./models/prompt");
const User = require("./models/user");

const config = require("../../config");

// Return all teachers revenues data
exports.getPayments = function (req, res) {};

// Return selected month revenues of login teacher
exports.getUserPayments = function (req, res) {
  const user = res.locals.user;
};
