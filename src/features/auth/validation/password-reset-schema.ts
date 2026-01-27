import { z } from 'zod';

export const passwordResetFormSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Lozinka mora imati najmanje 8 karaktera')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Lozinka mora sadržavati najmanje jedno malo slovo, veliko slovo i broj'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  });

export type PasswordResetFormInput = z.infer<typeof passwordResetFormSchema>;
