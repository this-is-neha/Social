const Joi = require('joi');

const postValidationSchema = Joi.object({
    user: Joi.string().hex().length(24).required(),
    title: Joi.string().max(200).required(),
    content: Joi.string().allow('').optional(),
    media: Joi.array().items(Joi.string().pattern(/\.(jpg|jpeg|png|webp|gif)$/i)).optional(),
    tags: Joi.array().items(Joi.string().max(50)).optional(),
    visibility: Joi.string().valid('public', 'private', 'friends').default('public'),
    location: Joi.string().max(255).optional(),

});

module.exports = {
    postValidationSchema,
};
