import Joi from "joi";
import { Note, Priority, Task, TeamMember } from "../types/db";

export const createTaskSchema = Joi.object<Task>({
  id: Joi.string().required(),
  title: Joi.string().optional().allow(""),
  description: Joi.string().optional().allow(""),
  duration: Joi.number().optional().empty(""),
  status: Joi.string().optional().allow(""),
  assignedTo: Joi.object<TeamMember>({
    id: Joi.string().optional().allow(""),
    name: Joi.string().optional().allow(""),
    lastName: Joi.string().optional(),
    email: Joi.string().optional(),
    role: Joi.string().optional(),
    avatar: Joi.string().optional().allow(""),
    department: Joi.string().optional().allow(""),
    contactPhone: Joi.string().optional().allow(""),
  }).optional(),
  subjectOfAction: Joi.object({
    dashboard: Joi.string().optional().allow(""),
    object: Joi.string().optional().allow(""),
  }).optional(),
  startDate: Joi.date().optional(),
  dueDate: Joi.date().optional(),
  notes: Joi.array().items(Joi.object<Note>()).optional(),
  priority: Joi.string().optional().allow(""),
});
