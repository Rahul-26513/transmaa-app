const { body, validationResult } = require("express-validator");

function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  next();
}

const phoneRule = body("phone")
  .trim()
  .matches(/^\d{10}$/)
  .withMessage("Phone must be a 10-digit number");

const passwordRule = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long");

const loginRules = [
  phoneRule,
  body("password").notEmpty().withMessage("Password is required"),
  validate
];

const bootstrapAdminRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  phoneRule,
  passwordRule,
  validate
];

const registerStaffRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  phoneRule,
  passwordRule,
  body("role")
    .optional()
    .isIn(["staff", "admin"])
    .withMessage("Role must be staff or admin"),
  validate
];

const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
  validate
];

module.exports = {
  loginRules,
  bootstrapAdminRules,
  registerStaffRules,
  changePasswordRules
};
