import Joi from "joi";

/** Builds a schema that only accepts exactly the clause ids we asked for, each a short non-empty string. */
export function buildClausesResponseSchema(clauseIds: string[]) {
  const clauseShape: Record<string, Joi.StringSchema> = {};
  for (const id of clauseIds) {
    clauseShape[id] = Joi.string().trim().min(3).max(1200).required();
  }
  return Joi.object({
    clauses: Joi.object(clauseShape).required(),
  });
}
