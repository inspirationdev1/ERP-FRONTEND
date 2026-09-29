import * as yup from "yup";

export const rolepermissionSchema = yup.object({
  user: yup
    .string()
    .required("User  is  required."),
  role: yup
    .string()
    .required("Role  is  required."),
 
});
