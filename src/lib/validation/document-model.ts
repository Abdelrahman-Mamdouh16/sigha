import Joi from "joi";

const clauseSchema = Joi.object({
  heading: Joi.string().max(200).allow(""),
  body: Joi.string().max(2000).required(),
});

const sectionSchema = Joi.object({
  heading: Joi.string().max(200).required(),
  clauses: Joi.array().items(clauseSchema).min(1).required(),
});

const partySchema = Joi.object({
  role: Joi.string().max(120).required(),
  name: Joi.string().max(200).required(),
  details: Joi.string().max(400).allow(""),
});

const signatureSchema = Joi.object({
  role: Joi.string().max(120).required(),
  name: Joi.string().max(200).required(),
});

export const documentModelSchema = Joi.object({
  id: Joi.string().max(100).required(),
  type: Joi.string().valid("rental", "power-of-attorney").required(),
  title: Joi.string().max(200).required(),
  place: Joi.string().max(200).required(),
  date: Joi.string().max(60).required(),
  introduction: Joi.string().max(3000).required(),
  parties: Joi.array().items(partySchema).min(1).max(10).required(),
  sections: Joi.array().items(sectionSchema).min(1).max(30).required(),
  closing: Joi.string().max(1000).required(),
  signatures: Joi.array().items(signatureSchema).min(1).max(10).required(),
  witnesses: Joi.array().items(signatureSchema).max(10).required(),
  notices: Joi.array().items(Joi.string().max(500)).max(10).required(),
  generatedAt: Joi.string().max(60).required(),
});
