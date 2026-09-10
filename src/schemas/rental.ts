import Joi from "joi";

const partySchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).required(),
  nationality: Joi.string().trim().min(2).max(60).required(),
  nationalId: Joi.string().trim().pattern(/^[0-9A-Za-z\-]{5,30}$/).required(),
  address: Joi.string().trim().min(5).max(300).required(),
});

export const rentalSchema = Joi.object({
  contractDate: Joi.string().isoDate().required(),
  placeOfContract: Joi.string().trim().min(2).max(120).required(),

  landlord: partySchema.required(),
  tenant: partySchema.required(),

  property: Joi.object({
    type: Joi.string().valid("residential", "commercial", "other").required(),
    description: Joi.string().trim().min(5).max(500).required(),
    governorate: Joi.string().trim().min(2).max(80).required(),
    city: Joi.string().trim().min(2).max(80).required(),
    district: Joi.string().trim().min(2).max(80).required(),
    street: Joi.string().trim().min(2).max(120).required(),
    buildingNumber: Joi.string().trim().min(1).max(30).required(),
    floor: Joi.string().trim().max(30).allow(""),
    unitNumber: Joi.string().trim().max(30).allow(""),
    intendedUse: Joi.string().trim().min(2).max(120).required(),
  }).required(),

  lease: Joi.object({
    startDate: Joi.string().isoDate().required(),
    endDate: Joi.string().isoDate().required(),
    rentAmount: Joi.number().positive().max(10_000_000).required(),
    rentFrequency: Joi.string().valid("monthly", "quarterly", "yearly").required(),
    paymentMethod: Joi.string().trim().min(2).max(120).required(),
    paymentDueDay: Joi.number().integer().min(1).max(28).required(),
    securityDeposit: Joi.number().min(0).max(10_000_000).allow(null),
  })
    .required()
    .custom((value, helpers) => {
      if (new Date(value.endDate).getTime() <= new Date(value.startDate).getTime()) {
        return helpers.error("lease.dateOrder");
      }
      return value;
    })
    .messages({ "lease.dateOrder": "end date must be after start date" }),

  additional: Joi.object({
    subleaseAllowed: Joi.boolean().required(),
    assignmentAllowed: Joi.boolean().required(),
    alterationsAllowed: Joi.boolean().required(),
    maintenanceResponsibilities: Joi.string().trim().min(5).max(500).required(),
    utilitiesResponsibilities: Joi.string().trim().min(5).max(500).required(),
    earlyTerminationTerms: Joi.string().trim().max(500).allow(""),
    additionalClauses: Joi.string().trim().max(1000).allow(""),
  }).required(),

  signatures: Joi.object({
    witness1: Joi.string().trim().max(120).allow(""),
    witness2: Joi.string().trim().max(120).allow(""),
  }).required(),
});

export type RentalSchemaType = typeof rentalSchema;
