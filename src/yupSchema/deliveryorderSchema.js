import * as yup from "yup";

export const deliveryorderSchema = yup.object({
  orderDate: yup
    .string()
    .min(3, "Must Contain 3 Character.")
    .required("Order Date is  required."),
  customer: yup
    .string()
    .min(3, "Must Contain 3 Character.")
    .required("Customer is  required."),
  status: yup
    .string()
    .min(1, "Must Contain 3 Character.")
    .required("status is  required."),
});
