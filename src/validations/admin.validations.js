const Joi = require("joi");

const createDoctor = {
    body: Joi.object().keys({
        email: Joi.string().custom((value, helpers) => {
            if (!/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(value)) {
                return helpers.message(`${value} is not a valid email address!`);
            }
            return value;
        }).required(),

        fullname: Joi.string().required(),

        mobile: Joi.string().required(),
        speciality: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
        profileImage: Joi.string().required(),
        coverImage: Joi.string().required(),

    })
}


module.exports = {
    createDoctor
}