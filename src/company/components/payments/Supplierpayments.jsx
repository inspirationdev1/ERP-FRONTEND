/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Table,
  TableContainer,
  Select,
  MenuItem,
  Alert,
  FormControl,
  InputLabel,
  Autocomplete,
  Tabs,
  Tab,
} from "@mui/material";
// import { Container, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Select, MenuItem, Alert, FormControl, InputLabel, Autocomplete, TextField, Box } from '@mui/material';
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { supplierpaymentSchema } from "../../../yupSchema/supplierpaymentSchema";
import PaymentPrint from "./PaymentPrint";

export default function Supplierpayments() {
  const [isDataValid, setIsDataValid] = useState(true);
  const [dataError, setDataError] = useState("");
  const [supplierPayment, setSupplierPayment] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [date, setDate] = useState(new Date());

  const [isPrint, setPrint] = useState(false);
  const [printId, setPrintId] = useState(null);

  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [loading, setLoading] = useState(true);

  const [purchaseinvoices, setPurchaseinvoices] = useState([]);
  const [selectedPurchaseinvoice, setSelectedPurchaseinvoice] = useState(null);
  const [tab, setTab] = useState(0);
  const [selectedYear, setSelectedYear] = useState(null);

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: `${year}-${year + 1}`, value: year };
  });

  const [paymentDetails, setPaymentDetails] = useState([
    {
      supplier: null,
      piId: null,
      invAmount: 0,
      paidAmount: 0,
      remarks: "",
      year: "",
      isEdit: false,
    },
  ]);

  const clearPaymentDetails = () => {
    setPaymentDetails([
      {
        supplier: null,
        piId: null,
        invAmount: 0,
        paidAmount: 0,
        remarks: "",
        year: "",
        isEdit: false,
      },
    ]);
    console.log("paymentDetails", paymentDetails);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/supplierpayment/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(e.response.data.message);
          setType("error");
          console.log("Error, deleting", e);
        });
    }
  };
  const handleEdit = async (id) => {
    console.log("Handle  Edit is called", id);
    setEdit(true);
    axios
      .get(`${baseUrl}/supplierpayment/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("paymentCode", resp.data.data.paymentCode);
        Formik.setFieldValue(
          "paymentDate",
          resp.data.data.paymentDate
            ? dayjs(resp.data.data.paymentDate).format("YYYY-MM-DD")
            : "",
        );
        Formik.setFieldValue(
          "paymentTime",
          dayjs().format("YYYY-MM-DD HH:mm:ss"),
        );
        Formik.setFieldValue("paymentCode", resp.data.data.paymentCode);
        Formik.setFieldValue("paymentMethod", resp.data.data.paymentMethod);
        Formik.setFieldValue("status", resp.data.data.status);

        Formik.setFieldValue("remarks", resp.data.data.remarks);
        Formik.setFieldValue("year", resp.data.data.year);

        const matchedYear = years.find((s) => s.value === resp.data.data.year);
        setSelectedYear(matchedYear || null);

        setEditId(resp.data.data._id);

        const editPaymentDetails = resp.data.data.paymentDetails.map((row) => ({
          ...row,
          isEdit: true,
        }));

        setPaymentDetails(editPaymentDetails);
        setTab(0); // open Create Payment tab
      })
      .catch((e) => {
        console.log("Error  in fetching edit data.");
      });
  };

  const handlePrint = (id) => {
    setPrint(true);
    const url = `${window.location.origin}/school/PaymentPrint?id=${id}`;
    window.open(url, "_blank");
    setPrint(false);
  };

  const cancelEdit = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
    // 🔥 reset Autocomplete values
    setSelectedSupplier(null);
    setSelectedPurchaseinvoice(null);
    setSelectedYear(null);
    setIsDataValid(true);
    // 🔥 reset Autocomplete values
    clearPaymentDetails();
  };

  const clearForm = () => {
    setEdit(false);
    setEditId(null);
    Formik.resetForm();
    // 🔥 reset Autocomplete values
    clearPaymentDetails();
  };

  //   MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    paymentCode: "",
    paymentDate: "",
    paymentTime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    paymentMethod: "",
    status: "valid",
    remarks: "",
    year: "",
  };

  const hasDuplicateInvoice = (paymentDetails) => {
    const seen = new Set();

    for (const row of paymentDetails) {
      if (!row.piId?._id) continue; // skip empty rows

      if (seen.has(row.piId._id)) {
        return true; // duplicate found
      }

      seen.add(row.piId._id);
    }

    return false;
  };

  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: supplierpaymentSchema,
    onSubmit: (values) => {
      if (paymentDetails.length == 0) {
        setDataError("Payment Details is missing");
        setIsDataValid(false);
        return;
      }

      if (hasDuplicateInvoice(paymentDetails)) {
        setDataError(
          "Duplicate Purchaseinvoice selected. Please remove duplicates.",
        );
        setIsDataValid(false);
        return;
      }

      let hasInvalidRow = false;

      for (const item of paymentDetails) {
        if (item.invAmount === 0 || item.paidAmount === 0) {
          setDataError("invAmount & paidAmount must be greater than 0");
          hasInvalidRow = true;
          break; // exit loop when condition met
        }

        console.log(item);
      }
      if (hasInvalidRow) {
        setIsDataValid(false);
        return;
      }

      setIsDataValid(true);

      const payload = {
        ...values,
        paymentDetails: paymentDetails.map((row) => ({
          supplier: row.supplier._id,
          piId: row.piId._id,
          piCode: row.piId.piCode,
          invAmount: row.invAmount,
          paidAmount: row.paidAmount,
          remarks: "",
          year: values.year,
        })),
      };
      if (isEdit) {
        console.log("edit id", editId);

        axios
          .patch(`${baseUrl}/supplierpayment/update/${editId}`, payload)
          .then((resp) => {
            console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            // clearForm();
            cancelEdit();
            setTab(1); // go to View List
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, edit casting submit", e);
          });
      } else {
        axios
          .post(`${baseUrl}/supplierpayment/create`, payload)
          .then((resp) => {
            console.log("Response after submitting admin casting", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, response admin casting calls", e);
          });
        // Formik.resetForm();
        clearForm();
        setTab(1); // go to View List
      }
    },
  });

  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);

  const fetchsupplierspayment = () => {
    axios
      .get(`${baseUrl}/supplierpayment/fetch-all`)
      .then((resp) => {
        console.log("Fetching data in  Casting Calls  admin.", resp);
        setSupplierPayment(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching casting calls admin data", e);
      });
  };

  const fetchSuppliers = async () => {
    try {
      const suppliersResponse = await axios.get(
        `${baseUrl}/supplier/fetch-with-query`,
      ); // Fetch All Suppliers
      setSuppliers(suppliersResponse.data.data);
    } catch (error) {
      console.error("Error fetching suppliers or checking attendance:", error);
    }
  };

  const fetchPurchaseinvoices = async () => {
    try {
      if (!selectedSupplier?._id) return;

      const purchaseinvoicesResponse = await axios.get(
        `${baseUrl}/purchaseinvoice/fetch-supplier-invoice`,
        {
          params: {
            supplier: selectedSupplier?._id,
          },
        },
      ); // Fetch based on Supplier
      setPurchaseinvoices(purchaseinvoicesResponse.data.data);
    } catch (error) {
      setPurchaseinvoices([]);
      console.error("Error fetching suppliers or checking attendance:", error);
    }
  };

  useEffect(() => {
    fetchsupplierspayment();

    fetchSuppliers();
  }, [message]);

  useEffect(() => {
    console.log("paymentDetails:", paymentDetails);
  }, [paymentDetails]);

  useEffect(() => {
    console.log("isDataValid:", isDataValid);
  }, [isDataValid]);

  useEffect(() => {
    fetchPurchaseinvoices();
  }, [selectedSupplier]);

  const handleChange = (index, field, value) => {
    const updated = [...paymentDetails];
    updated[index][field] = value;

    if (field === "supplier") {
      updated[index].piId = null; // 👈 clears invoice
      updated[index].invAmount = 0;
      updated[index].paidAmount = 0;
      setPurchaseinvoices([]); // 👈 clear old purchaseinvoices
      setSelectedPurchaseinvoice(null); // 👈 clear Autocomplete text
      setSelectedSupplier(value);
    }

    if (field === "piId") {
      const invBal =
        (updated[index].piId.totalNetAmount || 0) -
        (updated[index].piId.totalPaidAmount || 0);
      updated[index].invAmount = invBal;
      updated[index].paidAmount = 0;
    }

    if (field === "paidAmount") {
      if (updated[index].paidAmount > updated[index].invAmount) {
        updated[index].paidAmount = 0;
      }
    }
    setPaymentDetails(updated);
  };

  const addRow = () => {
    setSelectedSupplier(null);
    setPaymentDetails([
      ...paymentDetails,
      {
        supplier: null,
        piId: null,
        invAmount: 0,
        paidAmount: 0,
        remarks: "",
        year: "",
      },
    ]);
  };

  const removeRow = (index) => {
    setPaymentDetails(paymentDetails.filter((_, i) => i !== index));
    console.log(paymentDetails);
  };

  return (
    <>
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}
      <Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label={isEdit ? "Edit Payment" : "Create Payment"} />
            <Tab label="View List" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box>
            {/* Create Payment */}

            <Box component={"div"} sx={{}}>
              <Paper sx={{ padding: "20px", margin: "10px" }}>
                {isEdit ? (
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "800", textAlign: "center" }}
                  >
                    Edit payment
                  </Typography>
                ) : (
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: "800", textAlign: "center" }}
                  >
                    Add New payment
                  </Typography>
                )}{" "}
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={Formik.handleSubmit}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr", // mobile
                        md: "1fr 1fr", // desktop → 2 columns
                      },
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {/* Payment Code */}
                    <Box>
                      <TextField
                        fullWidth
                        label="Payment Code"
                        variant="outlined"
                        name="paymentCode"
                        value={Formik.values.paymentCode}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        disabled
                      />
                      {Formik.touched.paymentCode &&
                        Formik.errors.paymentCode && (
                          <Typography color="error" variant="caption">
                            {Formik.errors.paymentCode}
                          </Typography>
                        )}
                    </Box>

                    {/* Payment Date */}
                    <Box>
                      <TextField
                        name="paymentDate"
                        label="Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={Formik.values.paymentDate}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        disabled={isEdit}
                      />
                      {Formik.touched.paymentDate &&
                        Formik.errors.paymentDate && (
                          <Typography color="error" variant="caption">
                            {Formik.errors.paymentDate}
                          </Typography>
                        )}
                    </Box>

                    {/* Academic Year */}
                    <Box>
                      <Autocomplete
                        disabled={isEdit}
                        options={years}
                        getOptionLabel={(option) => option.label}
                        value={selectedYear}
                        onChange={(event, newValue) => {
                          setSelectedYear(newValue);

                          Formik.setFieldValue(
                            "year",
                            newValue ? newValue.value : "",
                          );
                        }}
                        onBlur={() => Formik.setFieldTouched("year", true)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Academic Year"
                            placeholder="Search year..."
                            fullWidth
                            error={
                              Formik.touched.year && Boolean(Formik.errors.year)
                            }
                            helperText={
                              Formik.touched.year && Formik.errors.year
                            }
                          />
                        )}
                      />
                    </Box>

                    <Box>
                      <TextField
                        select
                        fullWidth
                        required
                        label="Payment Method"
                        name="paymentMethod"
                        value={Formik.values.paymentMethod}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        disabled={isEdit}
                      >
                        <MenuItem value="">Select Payment Method</MenuItem>
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="bank">Bank</MenuItem>
                        <MenuItem value="upi">UPI</MenuItem>
                      </TextField>
                      {Formik.touched.paymentMethod &&
                        Formik.errors.paymentMethod && (
                          <p
                            style={{
                              color: "red",
                              textTransform: "capitalize",
                            }}
                          >
                            {Formik.errors.paymentMethod}
                          </p>
                        )}
                    </Box>

                    <Box>
                      <TextField
                        select
                        fullWidth
                        required
                        label="Status"
                        name="status"
                        value={Formik.values.status}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        disabled
                      >
                        <MenuItem value="">Select Status</MenuItem>
                        <MenuItem value="valid">Valid</MenuItem>
                        <MenuItem value="cancel">Cancel</MenuItem>
                      </TextField>
                      {Formik.touched.status && Formik.errors.status && (
                        <p
                          style={{ color: "red", textTransform: "capitalize" }}
                        >
                          {Formik.errors.status}
                        </p>
                      )}
                    </Box>

                    {/* Remarks → full width */}
                    <Box sx={{ gridColumn: "1 / -1" }}>
                      <TextField
                        fullWidth
                        label="Remarks"
                        variant="outlined"
                        name="remarks"
                        value={Formik.values.remarks}
                        onChange={Formik.handleChange}
                        onBlur={Formik.handleBlur}
                        multiline
                        rows={3}
                      />
                      {Formik.touched.remarks && Formik.errors.remarks && (
                        <Typography color="error" variant="caption">
                          {Formik.errors.remarks}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {/* PaymentDetail */}
                  <Box sx={{ mt: 3 }}>
                    {!isDataValid && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {dataError}
                      </Alert>
                    )}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "3fr 1fr 1fr 1fr 0.5fr",
                        gap: 1,
                        fontWeight: "bold",
                        mb: 1,
                      }}
                    ></Box>

                    {/* Rows */}
                    {paymentDetails.map((row, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "3fr 1fr 1fr 1fr 0.5fr",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {/* Supplier */}
                        <Box>
                          <Autocomplete
                            disabled={row.isEdit}
                            options={suppliers}
                            getOptionLabel={(option) => option.name}
                            value={row.supplier}
                            onChange={(event, newValue) => {
                              // setSelectedSupplier(newValue);
                              handleChange(index, "supplier", newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Select Supplier"
                                placeholder="Search supplier..."
                                fullWidth
                              />
                            )}
                          />
                        </Box>

                        {/* Purchaseinvoices */}

                        <Autocomplete
                          disabled={row.isEdit}
                          options={
                            Array.isArray(purchaseinvoices)
                              ? purchaseinvoices
                              : []
                          }
                          getOptionLabel={(option) => option?.piCode || ""}
                          value={row.piId}
                          isOptionEqualToValue={(option, value) =>
                            option?._id === value?._id
                          }
                          onChange={(event, newValue) => {
                            setSelectedPurchaseinvoice(newValue);
                            handleChange(index, "piId", newValue);
                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Purchaseinvoice"
                              placeholder="Search Purchaseinvoice..."
                              fullWidth
                            />
                          )}
                        />

                        {/* invAmount */}
                        <Box>
                          <TextField
                            fullWidth
                            label="invAmount"
                            variant="outlined"
                            name="invAmount"
                            type="number"
                            value={row.invAmount}
                            onChange={(e) =>
                              handleChange(index, "invAmount", e.target.value)
                            }
                            disabled
                          />
                        </Box>

                        {/* paidAmount */}

                        <TextField
                          fullWidth
                          label="paidAmount"
                          variant="outlined"
                          name="paidAmount"
                          type="number"
                          value={row.paidAmount}
                          inputProps={{ min: 0 }} // 👈 prevents negative via arrows
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Number(e.target.value || 0),
                            );
                            handleChange(index, "paidAmount", value);
                          }}
                          disabled={row.isEdit}
                        />

                        <Box>
                          <Button
                            color="error"
                            onClick={() => removeRow(index)}
                          >
                            ✕
                          </Button>
                        </Box>
                      </Box>
                    ))}

                    {/* Add Row */}
                    <Button variant="outlined" onClick={addRow}>
                      + Add Purchaseinvoice
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 4,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button type="submit" variant="contained">
                      {isEdit ? "Update" : "Submit"}
                    </Button>

                    {isEdit && (
                      <Button variant="outlined" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    )}
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            {/* View List             */}
            <Box>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell component="th" scope="row"> payment</TableCell> */}
                      <TableCell align="right">paymentCode</TableCell>
                      <TableCell align="right">Payment Date</TableCell>
                      <TableCell align="right">Remarks</TableCell>
                      <TableCell align="right">Status</TableCell>
                      <TableCell align="right">Payment Method</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {supplierPayment.map((value, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {value.paymentCode}
                        </TableCell>
                        <TableCell align="right">
                          {dayjs(value.paymentDate).format("DD-MM-YYYY")}
                        </TableCell>
                        <TableCell align="right">{value.remarks}</TableCell>
                        <TableCell align="right">{value.status}</TableCell>
                        <TableCell align="right">
                          {value.paymentMethod}
                        </TableCell>
                        <TableCell align="right">
                          {" "}
                          <Box
                            component={"div"}
                            sx={{
                              bottom: 0,
                              display: "flex",
                              justifyContent: "end",
                            }}
                          >
                            <Box
                              component="div"
                              sx={{
                                display: "flex",
                                justifyContent: "end",
                                gap: 1.5, // 👈 adds space between buttons
                              }}
                            >
                              {value.status === "valid" && (
                                <>
                                  <Button
                                    variant="contained"
                                    sx={{ background: "red", color: "#fff" }}
                                    onClick={() => handleDelete(value._id)}
                                  >
                                    Delete
                                  </Button>

                                  <Button
                                    variant="contained"
                                    sx={{
                                      background: "gold",
                                      color: "#222222",
                                    }}
                                    onClick={() => handleEdit(value._id)}
                                  >
                                    Edit
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="contained"
                                sx={{ background: "green", color: "#fff" }}
                                onClick={() => handlePrint(value._id)}
                              >
                                Print
                              </Button>
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
