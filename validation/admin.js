import Joi from "joi";

exports.createAdminSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name should be at least 2 characters long",
      "string.max": "Name should not exceed 50 characters",
    }),

  email: Joi.string()
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.pattern.base": "Email must be a valid email address (like example@domain.com)",
    }),

  age: Joi.number()
    .required()
    .messages({
      "number.base": "Age must be a number",
      "any.required": "Age is required",
    }),

  phoneNumber: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be exactly 10 digits",
    }),

  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters long",
      "string.pattern.base": "Password must include at least one uppercase letter and one special character",
    }),

  isSuperAdmin: Joi.boolean().optional(),
});
