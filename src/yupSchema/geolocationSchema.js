import * as yup from "yup";

export const geolocationSchema = yup.object({
  geolocation_name: yup
    .string()
    .min(3, "Must contain 3 character.")
    .required("Accountlevel Name is  required."),
  geolocation_code: yup.string().required("Geo Code is  required."),
});
