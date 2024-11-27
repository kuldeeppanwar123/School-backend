import Joi from "joi";

const registerStudentSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  parentName: Joi.string().required().messages({
    "any.required": "Parent name is required.",
  }),
  gender: Joi.string().required().messages({"any.required": "Gender is required.", }),
  phone: Joi.string().pattern(/^[1-5][0-9]{9}$/).length(10).required()  .messages({
    "string.pattern.base": "Invalid phone number.",
    "string.length": "Phone number must be 10 chars.",
    "any.required": "Phone number is required.",
  }),
  sectionId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Invalid section ID.", 
    "any.required": "section ID is required."
  }),
});

const registerStudentFromExcelSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  gender: Joi.string().required().messages({"any.required": "Gender is required.", }),
  bloodGroup: Joi.string().optional(),
  dob: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  district: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  pincode: Joi.string().optional(),

  parentName: Joi.string().required().messages({
    "any.required": "Parent name is required.",
  }),
  phone: Joi.number().integer().min(1000000000).max(5999999999).required().messages({
    "number.base": "Phone number must be a valid number.",
    "number.min": "Phone number must have exactly 10 digits.",
    "number.max": "Phone number must have exactly 10 digits.",
    "any.required": "Phone number is required.",
  }),
  email: Joi.string().optional(),
  qualification: Joi.string().optional(),
  occupation: Joi.string().optional(),
});

const deleteStudentSchema = Joi.object({
  studentId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
      "string.pattern.base": "Invalid student ID.",
      "any.required": "Student ID is required.",
    }),
});

const getStudentsSchema = Joi.object({
    admin: Joi.string().optional().messages({
        'string.base': 'Admin must be a string.',
    }),

    classId: Joi.string().optional().messages({
        'string.base': 'Class ID must be a string.',
    }),

    section: Joi.string().optional().messages({
        'string.base': 'Section must be a string.',
    }),

    parent: Joi.string().optional().messages({
        'string.base': 'Parent must be a string.',
    }),

    student: Joi.string().optional().messages({
        'string.base': 'Student must be a string.',
    }),

    firstname: Joi.string().optional().messages({
        'string.base': 'First name must be a string.',
    }),

    lastname: Joi.string().optional().messages({
        'string.base': 'Last name must be a string.',
    }),

    gender: Joi.string().valid('male', 'female', 'other').optional().messages({
        'string.base': 'Gender must be a string.',
        'any.only': 'Gender can be male, female, or other.',
    }),

    page: Joi.number().integer().min(1).default(1).optional().messages({
        'number.base': 'Page must be a number.',
        'number.integer': 'Page must be an integer.',
        'number.min': 'Page must be at least 1.',
    }),

    startTime: Joi.number().integer().optional().messages({
      'number.integer': 'StartTime must be an integer.',
    }),

    endTime: Joi.number().integer().optional().messages({
      'number.integer': 'EndTime must be an integer.',
    }),

    include: Joi.string().optional().messages({
        'number.base': 'Include must be string.',
    }),

    limit: Joi.number().integer().min(1).max(100).default(10).optional().messages({
        'number.base': 'Limit must be a number.',
        'number.integer': 'Limit must be an integer.',
        'number.min': 'Limit must be at least 1.',
        'number.max': 'Limit must not exceed 100.',
    }),
});

const updateStudentByTeacherSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  parentName: Joi.string().required().messages({
    "any.required": "Parent name is required.",
  }),
  gender: Joi.string().required().messages({
    "any.required": "Gender is required.", 
  }),
  phone: Joi.string().pattern(/^[1-5][0-9]{9}$/).length(10).required().messages({
    "string.pattern.base": "Invalid phone number.",
    "string.length": "Phone number must be 10 chars.",
    "any.required": "Phone number is required.",
  }),
  photo: Joi.string().required().messages({ 
    "any.required": "Photo is required"
  }),
});

const updateStudentByAdminSchema = Joi.object({
  firstname: Joi.string().required().messages({
    "any.required": "First name is required.",
  }),
  lastname: Joi.string().required().messages({
    "any.required": "Last name is required.",
  }),
  parentName: Joi.string().required().messages({
    "any.required": "Parent name is required.",
  }),
  gender: Joi.string().required().messages({
    "any.required": "Gender is required.", 
  }),
  phone: Joi.string().pattern(/^[1-5][0-9]{9}$/).length(10).required().messages({
    "string.pattern.base": "Invalid phone number.",
    "string.length": "Phone number must be 10 chars.",
    "any.required": "Phone number is required.",
  }),
});

const updateStudentByParentSchema = Joi.object({
  bloodGroup: Joi.string().required().messages({
    "any.required": "Blood Group is required.",
  }),

  address: Joi.string().required().messages({
    "any.required": "Address is required.",
  }),

 dob: Joi.string().required().pattern(/^(00|[0-2][0-9]|(3[0-1]))\/(0[0-9]|1[0-2])\/\d{4}$/).messages({
    "string.pattern.base": "Invalid date format, use DD/MM/YYYY.",
    "any.required":"DOB is required.",
  }).custom((value, helpers) => {
    const [day, month, year] = value.split('/').map(Number);
    if (month === 2 && day > 29){ return helpers.message('February cannot have more than 29 days.'); }
    if ([4, 6, 9, 11].includes(month) && day > 30){ return helpers.message(`Month ${month} cannot have more than 30 days.`); }
    if(String(day)==='0'|| String(month)==='0'){return helpers.message('invalid day or month')};

    return value; 
  })
})

const updateStudentParentByAdminSchema = Joi.object({
  firstname:Joi.string().required().messages({
    "any.required":"first name is required"
  }),
  lastname:Joi.string().required().messages({
    "any.required":"last name is required"
  }),
  gender:Joi.string().required().messages({
    "any.required":"gender is required"
  }),
  
  dob: Joi.string().optional().pattern(/^(00|[0-2][0-9]|(3[0-1]))\/(0[0-9]|1[0-2])\/\d{4}$/).messages({
    "string.pattern.base": "Invalid date format, use DD/MM/YYYY.",
  }).custom((value, helpers) => {
    const [day, month, year] = value.split('/').map(Number);
    if (month === 2 && day > 29){ return helpers.message('February cannot have more than 29 days.'); }
    if ([4, 6, 9, 11].includes(month) && day > 30){ return helpers.message(`Month ${month} cannot have more than 30 days.`); }
    if(String(day)==='0'|| String(month)==='0'){return helpers.message('invalid day or month')};

    return value; 
  }),

  address:Joi.string().optional(),

  bloodGroup:Joi.string().optional(),

  parentName: Joi.string().required().messages({
    "any.required": "parent name is required.",
  }),
  parentGender: Joi.string().optional(),
  
  parentAge: Joi.number().optional(),

  parentEmail: Joi.string().optional(),

  phone: Joi.string().required().messages({
    "any.required": "parent phone number is required.",
  }),
  parentQualification: Joi.string().optional(),

  parentOccupation: Joi.string().optional(),

  parentAddress: Joi.string().optional()
})

const uploadStudentPhotoSchema = Joi.object({
  photo: Joi.string().optional(),
  method: Joi.string().valid('POST', 'DELETE').required().messages({
    'any.required': 'method is required.',
    'string.empty': 'method can not be an empty string.',
    'string.base': 'method must be a string.',
    'any.only': 'method must be either "POST" or "DELETE".'
  })
})

export {
  getStudentsSchema,
  registerStudentSchema,
  registerStudentFromExcelSchema,
  deleteStudentSchema,
  updateStudentByTeacherSchema,
  updateStudentByAdminSchema,
  updateStudentByParentSchema,
  updateStudentParentByAdminSchema,
  uploadStudentPhotoSchema
};