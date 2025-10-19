import z from "zod";
import { isValidNumber, parsePhoneNumberWithError } from "libphonenumber-js";

export const PhoneNumberSchema = z
  .string("Phone number is required")
  .min(1, "Phone number is too short")
  .refine(
    (val) =>
      parsePhoneNumberWithError(val, {
        defaultCountry: "EG",
      }).isValid(),
    {
      message: "Phone number is invalid",
    }
  );
