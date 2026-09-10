import Joi from "joi";

const partySchema = Joi.object({
  fullName: Joi.string().trim().min(3).max(120).required(),
  nationality: Joi.string().trim().min(2).max(60).required(),
  nationalId: Joi.string().trim().pattern(/^[0-9A-Za-z\-]{5,30}$/).required(),
  address: Joi.string().trim().min(5).max(300).required(),
});

export const poaSchema = Joi.object({
  date: Joi.string().isoDate().required(),
  place: Joi.string().trim().min(2).max(120).required(),

  principal: partySchema.required(),
  agent: partySchema.required(),

  poa: Joi.object({
    type: Joi.string().valid("general", "special").required(),
    scope: Joi.string().trim().min(5).max(300).required(),
    matter: Joi.string().trim().min(5).max(500).required(),
    powers: Joi.string().trim().min(5).max(2000).required(),
    limitations: Joi.string().trim().max(1000).allow(""),
    duration: Joi.string().trim().min(2).max(200).required(),
  }).required(),
});

export type PoaSchemaType = typeof poaSchema;
