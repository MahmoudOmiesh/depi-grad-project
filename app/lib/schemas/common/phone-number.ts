import z from "zod";
import { parsePhoneNumberWithError } from "libphonenumber-js";

export const PhoneNumberSchema = z.string("Phone number is required").refine(
  (val) => {
    try {
      return parsePhoneNumberWithError(val, {
        defaultCountry: "EG",
      }).isValid();
    } catch {
      return false;
    }
  },
  { message: "Phone number is invalid" },
);
