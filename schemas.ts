// File for the validation schemas and other JavaScript
// or TypeScript schemas, not mongoose or MongoDB schemas

const Joi = require("joi")

module.exports.streetartSchema = Joi.object({
    streetart: Joi.object({
        title: Joi.string().required(),
        author: Joi.string(),
        location: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});