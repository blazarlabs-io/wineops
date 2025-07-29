import Joi from "joi";
import { Note, TeamMember } from "../types/db";
import { Timestamp } from "firebase/firestore";

const TimestampOrString = Joi.alternatives().try(
  Joi.string().isoDate(),
  Joi.object().custom((value, helpers) => {
    if (value instanceof Timestamp) return value;
    return helpers.error("any.invalid");
  }, "Timestamp validation"),
);

export const createNoteSchema = Joi.object<Note>({
  id: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  date: TimestampOrString.required(),
  author: Joi.object<TeamMember>({
    id: Joi.string().required(),
    name: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    role: Joi.string().required(),
    avatar: Joi.string().optional().allow(""),
    department: Joi.string().optional().allow(""),
    contactPhone: Joi.string().optional().allow(""),
  }).required(),
});
