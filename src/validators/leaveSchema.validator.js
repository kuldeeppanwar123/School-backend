import Joi from "joi";

const registerLeaveSchema = Joi.object({
  reason: Joi.string().required().messages({
    'any.required': 'Reason is required.',
  }),

  description: Joi.string().required().messages({
    'any.required': 'Description is required.'
  }),

  startTime: Joi.number().integer().min(0).required().messages({
    'number.base': 'Start time must be a number',
    'number.integer': 'Start time must be an integer',
    'number.min': 'Start time must be a positive number',
    'any.required': 'Start time is required'
  }),

  endTime: Joi.number().integer().min(0).required().messages({
    'number.base': 'End time must be a number',
    'number.integer': 'End time must be an integer',
    'number.min': 'End time must be a positive number',
    'any.required': 'End time is required'
  }),

});

const updateTeacherLeaveSchema = Joi.object({
  leaveRequestId: Joi.string().required().messages({
    'string.base': 'Leave Request ID must be a string.',
    'any.required': 'Leave Request ID is required.',
  }),
  status: Joi.string().valid('accept', 'reject').required().messages({
    'string.base': 'Status must be a string',
    'any.only': 'Status must be either \'accept\', or \'reject\'',
    'any.required': 'Status is a mandatory field',
  }),
  username: Joi.when('status', {
    is: 'accept',
    then: Joi.string().required().messages({
      'string.base': 'Username must be a string',
      'any.required': 'Username is required',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Username is forbidden"
    }),
  }),
  password: Joi.when('status', {
    is: 'accept',
    then: Joi.string().required().messages({
      'string.base': 'Password must be a string',
      'any.required': 'Password is required',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Password is forbidden"
    }),
  }),
  tagline: Joi.when('status', {
    is: 'accept',
    then: Joi.string().required().messages({
      'string.base': 'Tagline must be a string',
      'any.required': 'Tagline is required',
    }),
    otherwise: Joi.forbidden().messages({
      'any.unknown': "Tagline is forbidden"
    }),
  })
})


// sender: Joi.object({
//   id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
//     "string.pattern.base": "Invalid sender Id.", 
//     "any.required": "sender id is required."
//   }),
//   model: Joi.string().valid('parent','teacher').required().messages({
//     'any.required': 'Model is required.',
//     'string.valid': 'Model can be parent, teacher.'
//   })
// }).required().messages({
//   'any.required': 'Sender information is required.'
// }),

// receiver: Joi.object({
//   id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
//     "string.pattern.base": "Invalid receiver Id.", 
//     "any.required": "Receiver id is required."
//   }),
//   model: Joi.string().valid('teacher','admin').required().messages({
//     'any.required': 'Model is required.',
//     'string.valid': 'Model can be admin, teacher.'
//   })
// }).required().messages({
//   'any.required': 'Sender information is required.'
// }),


export { registerLeaveSchema, updateTeacherLeaveSchema }