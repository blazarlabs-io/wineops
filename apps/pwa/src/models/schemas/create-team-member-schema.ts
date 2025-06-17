import Joi from "joi";
import { TeamMember } from "../types/db";

export const createTeamMemberSchema = Joi.object<TeamMember>({
  id: Joi.string().required(),
  name: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().required(),
  role: Joi.string().required().allow(""),
  avatar: Joi.string().optional().allow(""),
  department: Joi.string().optional().allow(""),
  contactPhone: Joi.string().optional().allow(""),
});
