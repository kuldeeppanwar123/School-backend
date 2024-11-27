import Joi from "joi";

const guestTeacherLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "username is required." 
  }),
  password: Joi.string().required().messages({ 
    "any.required": "Password is required.",
  }),
  platform: Joi.string().required().valid("app").messages({ 
    "any.required": "Platform is required.",
    'any.only': 'Only supports for \'app\''
  })
});

export { guestTeacherLoginSchema }