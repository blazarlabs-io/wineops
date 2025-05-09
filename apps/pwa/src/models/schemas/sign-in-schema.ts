import { SignIn } from '@/models/types/auth';
import Joi from 'joi';

export const signInSchema = Joi.object<SignIn>({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .message('Invalid email')
    .required()
    .label('Email'),
  password: Joi.string()
    .min(6)
    .max(128)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .message(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
    )
    .required()
    .label('Password'),
});
