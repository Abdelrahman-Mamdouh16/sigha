import Joi from "joi";
import { rentalSchema } from "@/schemas/rental";
import { poaSchema } from "@/schemas/power-of-attorney";

export const generateRequestSchema = Joi.object({
  documentType: Joi.string().valid("rental", "power-of-attorney").required(),
  data: Joi.object().required(),
}).custom((value, helpers) => {
  const schema = value.documentType === "rental" ? rentalSchema : poaSchema;
  const { error, value: validatedData } = schema.validate(value.data, { abortEarly: false, stripUnknown: true });
  if (error) {
    return helpers.error("data.invalid", { details: error.details.map((d) => d.message).join("; ") });
  }
  return { documentType: value.documentType, data: validatedData };
}, "per-document-type data validation")
  .messages({ "data.invalid": "{{#details}}" });
