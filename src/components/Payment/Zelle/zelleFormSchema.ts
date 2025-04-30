
import * as z from "zod";

export const zelleFormSchema = z.object({
  customer_name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  customer_email: z.string().email({
    message: "Please enter a valid email.",
  }),
  address: z.object({
    street: z.string().min(3, {
      message: "Street must be at least 3 characters.",
    }),
    city: z.string().min(2, {
      message: "City must be at least 2 characters.",
    }),
    state: z.string().min(2, {
      message: "State must be at least 2 characters.",
    }),
    zip: z.string().min(5, {
      message: "ZIP code must be at least 5 characters.",
    }),
  }),
});

export type ZelleFormValues = z.infer<typeof zelleFormSchema>;
