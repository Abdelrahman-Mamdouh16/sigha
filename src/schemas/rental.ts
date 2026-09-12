import Joi from "joi";
const arabicText = /^[\u0621-\u064A\s]+$/;
const arabicTextWithNumbers = /^[\u0621-\u064A\u064B-\u065F0-9\s\-،؛؟.,/()]+$/;

const arabicFullName = /^(?:[\u0621-\u064A]+(?:\s+|$)){3,}$/;
const partySchema = Joi.object({
  fullName: Joi.string()
    .trim()
    .pattern(arabicFullName)
    .min(5)
    .max(120)
    .required()
    .messages({
      "string.empty": "الاسم بالكامل مطلوب",
      "any.required": "الاسم بالكامل مطلوب",
      "string.pattern.base":
        "الاسم يجب أن يكون باللغة العربية ومكونًا من ثلاثة أسماء على الأقل",
      "string.min": "الاسم قصير جدًا",
      "string.max": "الاسم يجب ألا يتجاوز 120 حرفًا",
    }),

  nationality: Joi.string()
    .trim()
    .pattern(arabicText)
    .min(2)
    .max(60)
    .required()
    .messages({
      "string.empty": "الجنسية مطلوبة",
      "any.required": "الجنسية مطلوبة",
      "string.pattern.base": "الجنسية يجب أن تكون باللغة العربية فقط",
      "string.min": "الجنسية قصيرة جدًا",
      "string.max": "الجنسية يجب ألا تتجاوز 60 حرفًا",
    }),

  nationalId: Joi.string()
    .trim()
    .pattern(/^[0-9]+$/)
    .length(14)
    .required()
    .messages({
      "string.empty": "الرقم القومي مطلوب",
      "any.required": "الرقم القومي مطلوب",
      "string.pattern.base": "الرقم القومي يجب أن يحتوي على أرقام فقط",
      "string.length": "الرقم القومي يجب أن يتكون من 14 رقمًا",
    }),

  address: Joi.string()
    .trim()
    .pattern(arabicTextWithNumbers)
    .min(5)
    .max(300)
    .required()
    .messages({
      "string.empty": "العنوان مطلوب",
      "any.required": "العنوان مطلوب",
      "string.pattern.base":
        "العنوان يجب أن يكون باللغة العربية ويمكن أن يحتوي على أرقام",
      "string.min": "العنوان يجب ألا يقل عن 5 أحرف",
      "string.max": "العنوان يجب ألا يتجاوز 300 حرف",
    }),
});

export const rentalSchema = Joi.object({
  contractDate: Joi.string().isoDate().required().messages({
    "string.empty": "تاريخ تحرير العقد مطلوب",
    "any.required": "تاريخ تحرير العقد مطلوب",
    "string.isoDate": "من فضلك أدخل تاريخًا صحيحًا",
  }),

  placeOfContract: Joi.string()
    .trim()
    .min(2)
    .max(120)
    .pattern(arabicText)
    .required()
    .messages({
      "string.empty": "مكان تحرير العقد مطلوب",
      "any.required": "مكان تحرير العقد مطلوب",
      "string.min": "مكان تحرير العقد يجب ألا يقل عن حرفين",
      "string.max": "مكان تحرير العقد يجب ألا يتجاوز 120 حرفًا",
      "string.pattern.base": "مكان تحرير العقد يجب أن يكون باللغة العربية فقط",
    }),

  landlord: partySchema.required().messages({
    "any.required": "بيانات المؤجر مطلوبة",
  }),

  tenant: partySchema.required().messages({
    "any.required": "بيانات المستأجر مطلوبة",
  }),

  property: Joi.object({
    type: Joi.string()
      .valid("residential", "commercial", "other")
      .required()
      .messages({
        "any.required": "نوع العقار مطلوب",
        "any.only": "نوع العقار غير صالح",
      }),

    description: Joi.string()
      .trim()
      .min(5)
      .max(500)
      .pattern(arabicTextWithNumbers)
      .required()
      .messages({
        "string.empty": "وصف العقار مطلوب",
        "any.required": "وصف العقار مطلوب",
        "string.min": "وصف العقار يجب ألا يقل عن 5 أحرف",
        "string.max": "وصف العقار يجب ألا يتجاوز 500 حرف",
        "string.pattern.base":
          "وصف العقار يجب أن يكون باللغة العربية ويمكن أن يحتوي على أرقام",
      }),

    governorate: Joi.string()
      .trim()
      .min(2)
      .max(80)
      .pattern(arabicText)
      .required()
      .messages({
        "string.empty": "المحافظة مطلوبة",
        "any.required": "المحافظة مطلوبة",
        "string.min": "اسم المحافظة قصير جدًا",
        "string.max": "اسم المحافظة يجب ألا يتجاوز 80 حرفًا",
        "string.pattern.base": "اسم المحافظة يجب أن يكون باللغة العربية فقط",
      }),

    city: Joi.string()
      .trim()
      .min(2)
      .max(80)
      .pattern(arabicText)
      .required()
      .messages({
        "string.empty": "المدينة مطلوبة",
        "any.required": "المدينة مطلوبة",
        "string.min": "اسم المدينة قصير جدًا",
        "string.max": "اسم المدينة يجب ألا يتجاوز 80 حرفًا",
        "string.pattern.base": "اسم المدينة يجب أن يكون باللغة العربية فقط",
      }),

    district: Joi.string()
      .trim()
      .min(2)
      .max(80)
      .pattern(arabicText)
      .required()
      .messages({
        "string.empty": "الحي مطلوب",
        "any.required": "الحي مطلوب",
        "string.min": "اسم الحي قصير جدًا",
        "string.max": "اسم الحي يجب ألا يتجاوز 80 حرفًا",
        "string.pattern.base": "اسم الحي يجب أن يكون باللغة العربية فقط",
      }),

    street: Joi.string()
      .trim()
      .min(2)
      .max(120)
      .pattern(arabicText)
      .required()
      .messages({
        "string.empty": "اسم الشارع مطلوب",
        "any.required": "اسم الشارع مطلوب",
        "string.min": "اسم الشارع قصير جدًا",
        "string.max": "اسم الشارع يجب ألا يتجاوز 120 حرفًا",
        "string.pattern.base": "اسم الشارع يجب أن يكون باللغة العربية فقط",
      }),

    buildingNumber: Joi.string()
      .trim()
      .min(1)
      .max(30)
      .pattern(/^[0-9٠-٩]+$/)
      .required()
      .messages({
        "string.empty": "رقم المبنى مطلوب",
        "any.required": "رقم المبنى مطلوب",
        "string.min": "رقم المبنى مطلوب",
        "string.max": "رقم المبنى يجب ألا يتجاوز 30 حرفًا",
        "string.pattern.base": "رقم المبنى يجب أن يحتوي على أرقام فقط",
      }),

    floor: Joi.string()
      .trim()
      .max(30)
      .pattern(/^[0-9٠-٩]*$/)
      .allow("")
      .messages({
        "string.max": "رقم الطابق يجب ألا يتجاوز 30 حرفًا",
        "string.pattern.base": "رقم الطابق يجب أن يحتوي على أرقام فقط",
      }),

    unitNumber: Joi.string()
      .trim()
      .max(30)
      .pattern(/^[0-9٠-٩]*$/)
      .allow("")
      .messages({
        "string.max": "رقم الوحدة يجب ألا يتجاوز 30 حرفًا",
        "string.pattern.base": "رقم الوحدة يجب أن يحتوي على أرقام فقط",
      }),

    intendedUse: Joi.string()
      .trim()
      .min(2)
      .max(120)
      .pattern(arabicText)
      .required()
      .messages({
        "string.empty": "الغرض من استخدام العقار مطلوب",
        "any.required": "الغرض من استخدام العقار مطلوب",
        "string.min": "الغرض من الاستخدام يجب ألا يقل عن حرفين",
        "string.max": "الغرض من الاستخدام يجب ألا يتجاوز 120 حرفًا",
        "string.pattern.base":
          "الغرض من استخدام العقار يجب أن يكون باللغة العربية فقط",
      }),
  })
    .required()
    .messages({
      "any.required": "بيانات العقار مطلوبة",
    }),

  lease: Joi.object({
    startDate: Joi.string().isoDate().required().messages({
      "string.empty": "تاريخ بداية العقد مطلوب",
      "any.required": "تاريخ بداية العقد مطلوب",
      "string.isoDate": "تاريخ بداية العقد غير صالح",
    }),

    endDate: Joi.string().isoDate().required().messages({
      "string.empty": "تاريخ نهاية العقد مطلوب",
      "any.required": "تاريخ نهاية العقد مطلوب",
      "string.isoDate": "تاريخ نهاية العقد غير صالح",
    }),

    rentAmount: Joi.number().positive().max(10_000_000).required().messages({
      "number.base": "قيمة الإيجار يجب أن تكون رقمًا",
      "number.positive": "قيمة الإيجار يجب أن تكون أكبر من صفر",
      "number.max": "قيمة الإيجار تتجاوز الحد المسموح",
      "any.required": "قيمة الإيجار مطلوبة",
    }),

    rentFrequency: Joi.string()
      .valid("monthly", "quarterly", "yearly")
      .required()
      .messages({
        "any.required": "دورية السداد مطلوبة",
        "any.only": "دورية السداد غير صالحة",
      }),

    paymentMethod: Joi.string()
      .trim()
      .min(2)
      .max(120)
      .pattern(arabicText)
      .valid("cash", "bank_transfer", "credit_card")
      .required()
      .messages({
        "string.empty": "طريقة السداد مطلوبة",
        "any.required": "طريقة السداد مطلوبة",
        "string.min": "طريقة السداد يجب ألا تقل عن حرفين",
        "string.max": "طريقة السداد يجب ألا تتجاوز 120 حرفًا",
        "string.pattern.base": "طريقة السداد يجب أن تكون باللغة العربية فقط",
      }),

    paymentDueDay: Joi.number().integer().min(1).max(28).required().messages({
      "number.base": "يوم الاستحقاق يجب أن يكون رقمًا",
      "number.integer": "يوم الاستحقاق يجب أن يكون رقمًا صحيحًا",
      "number.min": "يوم الاستحقاق يجب أن يكون بين 1 و28",
      "number.max": "يوم الاستحقاق يجب أن يكون بين 1 و28",
      "any.required": "يوم الاستحقاق مطلوب",
    }),

    securityDeposit: Joi.number().min(0).max(10_000_000).allow(null).messages({
      "number.base": "مبلغ التأمين يجب أن يكون رقمًا",
      "number.min": "مبلغ التأمين لا يمكن أن يكون سالبًا",
      "number.max": "مبلغ التأمين يتجاوز الحد المسموح",
    }),
  })
    .required()
    .custom((value, helpers) => {
      if (
        new Date(value.endDate).getTime() <= new Date(value.startDate).getTime()
      ) {
        return helpers.error("lease.dateOrder");
      }

      return value;
    })
    .messages({
      "any.required": "بيانات مدة العقد والإيجار مطلوبة",
      "lease.dateOrder": "تاريخ نهاية العقد يجب أن يكون بعد تاريخ البداية",
    }),

  additional: Joi.object({
    subleaseAllowed: Joi.boolean().required().messages({
      "boolean.base": "قيمة التأجير من الباطن غير صالحة",
      "any.required": "يرجى تحديد إمكانية التأجير من الباطن",
    }),

    assignmentAllowed: Joi.boolean().required().messages({
      "boolean.base": "قيمة التنازل عن العقد غير صالحة",
      "any.required": "يرجى تحديد إمكانية التنازل عن العقد",
    }),

    alterationsAllowed: Joi.boolean().required().messages({
      "boolean.base": "قيمة التعديلات على العقار غير صالحة",
      "any.required": "يرجى تحديد إمكانية تعديل العقار",
    }),

    maintenanceResponsibilities: Joi.string()
      .trim()
      .min(5)
      .max(500)
      .pattern(arabicTextWithNumbers)
      .required()
      .messages({
        "string.empty": "مسؤوليات الصيانة مطلوبة",
        "any.required": "مسؤوليات الصيانة مطلوبة",
        "string.min": "مسؤوليات الصيانة يجب ألا تقل عن 5 أحرف",
        "string.max": "مسؤوليات الصيانة يجب ألا تتجاوز 500 حرف",
        "string.pattern.base":
          "مسؤوليات الصيانة يجب أن تكون باللغة العربية ويمكن أن تحتوي على أرقام",
      }),

    utilitiesResponsibilities: Joi.string()
      .trim()
      .min(5)
      .max(500)
      .pattern(arabicTextWithNumbers)
      .required()
      .messages({
        "string.empty": "مسؤوليات المرافق مطلوبة",
        "any.required": "مسؤوليات المرافق مطلوبة",
        "string.min": "مسؤوليات المرافق يجب ألا تقل عن 5 أحرف",
        "string.max": "مسؤوليات المرافق يجب ألا تتجاوز 500 حرف",
        "string.pattern.base":
          "مسؤوليات المرافق يجب أن تكون باللغة العربية ويمكن أن تحتوي على أرقام",
      }),

    earlyTerminationTerms: Joi.string()
      .trim()
      .max(500)
      .pattern(arabicTextWithNumbers)
      .allow("")
      .messages({
        "string.max": "شروط الإنهاء المبكر يجب ألا تتجاوز 500 حرف",
        "string.pattern.base":
          "شروط الإنهاء المبكر يجب أن تكون باللغة العربية ويمكن أن تحتوي على أرقام",
      }),

    additionalClauses: Joi.string()
      .trim()
      .max(1000)
      .pattern(arabicTextWithNumbers)
      .allow("")
      .messages({
        "string.max": "البنود الإضافية يجب ألا تتجاوز 1000 حرف",
        "string.pattern.base":
          "البنود الإضافية يجب أن تكون باللغة العربية ويمكن أن تحتوي على أرقام",
      }),
  })
    .required()
    .messages({
      "any.required": "الشروط والتفاصيل الإضافية مطلوبة",
    }),

  signatures: Joi.object({
    witness1: Joi.string()
      .trim()
      .pattern(arabicFullName)
      .min(5)
      .max(120)
      .allow("")
      .messages({
        "string.pattern.base":
          "اسم الشاهد الأول يجب أن يكون باللغة العربية ومكونًا من ثلاثة أسماء على الأقل",
        "string.min": "اسم الشاهد الأول قصير جدًا",
        "string.max": "اسم الشاهد الأول يجب ألا يتجاوز 120 حرفًا",
      }),

    witness2: Joi.string()
      .trim()
      .pattern(arabicFullName)
      .min(5)
      .max(120)
      .allow("")
      .custom((value, helpers) => {
        const witness1 = helpers.state.ancestors[0].witness1;

        if (value && !witness1?.trim()) {
          return helpers.error("signatures.witness1Required");
        }

        return value;
      })
      .messages({
        "string.pattern.base":
          "اسم الشاهد الثاني يجب أن يكون باللغة العربية ومكونًا من ثلاثة أسماء على الأقل",
        "string.min": "اسم الشاهد الثاني قصير جدًا",
        "string.max": "اسم الشاهد الثاني يجب ألا يتجاوز 120 حرفًا",
        "signatures.witness1Required": "يرجى إدخال اسم الشاهد الأول أولًا",
      }),
  })
    .required()
    .messages({
      "any.required": "بيانات الشهود مطلوبة",
    }),
});

export type RentalSchemaType = typeof rentalSchema;
