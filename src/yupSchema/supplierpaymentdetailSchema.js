import * as yup from "yup";

export const supplierpaymentdetailSchema = yup.object({
  invAmount: yup
    .number()
    .typeError("Inv amount must be a number")
    .moreThan(0, "Inv amount must be greater than zero")
    .required("Inv amount is required"),
  paidAmount: yup
    .number()
    .typeError("Paid amount must be a number")
    .moreThan(0, "Paid amount must be greater than zero")
    .required("Paid amount is required"),
  remarks: yup.string().min(3, "Must Contain 3 Character."),
});
