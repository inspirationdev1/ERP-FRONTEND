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
  Autocomplete,
  Alert,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { schoolreportsSchema } from "../../../yupSchema/schoolreportsSchema";
import { AuthContext } from "../../../context/AuthContext";

export default function SalesReports() {
  const { authenticated, user } = useContext(AuthContext);
  console.log("user", user);

  const [loading, setLoading] = useState(true);

  const [reportNames, setReportNames] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [sections, setSection] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [teachers, setTeacher] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjects, setSubject] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [examinations, setExamination] = useState([]);
  const [selectedExamination, setSelectedExamination] = useState(null);
  const [questionpapers, setQuestionpaper] = useState([]);
  const [selectedQuestionpaper, setSelectedQuestionpaper] = useState(null);
  const [isPrint, setPrint] = useState(false);
  const [isDataValid, setIsDataValid] = useState(true);
  const [dataError, setDataError] = useState("");
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { label: `${year}-${year + 1}`, value: year };
  });

  const cancelEdit = () => {
    setEdit(false);
    Formik.resetForm();
  };

  const handlePrint = async () => {
    setPrint(true);

    let data = {};

    if (selectedCustomer) {
      data.customer = selectedCustomer._id;
    }

    if (fromDate) {
      data.fromDate = fromDate;
    }
    if (toDate) {
      data.toDate = toDate;
    }

    if (selectedYear) {
      data.year = selectedYear.value;
    }

    if (selectedReport.reportId === "sales-summary-customer-report") {
      window.open(
        `/company/SalesSummaryCustomerPrint?data=${encodeURIComponent(JSON.stringify(data))}`,
        "_blank",
      );
    } else if (selectedReport.reportId === "sales-summary-item-report") {
      window.open(
        `/company/SchoolReportsPrint?data=${encodeURIComponent(JSON.stringify(data))}`,
        "_blank",
      );
    } else if (selectedReport.reportId === "customer-list-report") {
      window.open(
        `/company/CustomerListReportPrint?data=${encodeURIComponent(JSON.stringify(data))}`,
        "_blank",
      );
    }

    setPrint(false);
  };

  //   MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    reportId: "",
    class: "",
    section: "",
    teacher: "",
    subject: "",
    examination: "",
    questionpaper: "",
    customer: "",
    fromDate: "",
    toDate: "",
    year: "",
  };
  const Formik = useFormik({
    initialValues: initialValues,
    // validationSchema: schoolreportsSchema,
    onSubmit: (values) => {
      if (!values.reportId) {
        setDataError("Select the Report Name");
        setIsDataValid(false);
        return;
      }

      if (
        values.reportId == "sales-summary-customer-report" ||
        values.reportId == "sales-summary-item-report"
      ) {
        if (!values.fromDate || !values.toDate) {
          setDataError("Select From Date and To Date");
          setIsDataValid(false);
          return;
        }

        if (dayjs(values.fromDate).isAfter(dayjs(values.toDate))) {
          setDataError("From Date cannot be after To Date");
          setIsDataValid(false);
          return;
        }
      }

      if (values.reportId == "other-report") {
        if (!values.customer) {
          setDataError("Select the Customer");
          setIsDataValid(false);
          return;
        }
      }

      if (values.reportId == "other-report") {
        if (!values.year) {
          setDataError("Select the Year");
          setIsDataValid(false);
          return;
        }
      }

      setIsDataValid(true);

      handlePrint();
    },
  });

  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);

  const fetchReportNames = async () => {
    try {
      const reportsData = [
        {
          reportId: "customer-list-report",
          reportName: "Customer-List Report",
        },
        {
          reportId: "sales-summary-customer-report",
          reportName: "Sales-Summary-Customer Report",
        },
        {
          reportId: "sales-summary-item-report",
          reportName: "Sales-Summary-Item Report",
        },
      ];
      console.log("Report Names", reportsData);
      setReportNames(reportsData);
    } catch (error) {
      console.error("Error fetching Report Names:", error);
    }
  };

  const fetchClass = async () => {
    try {
      const classData = await axios.get(`${baseUrl}/class/fetch-all`);
      console.log("class", classData);
      setClasses(classData.data.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };
  const fetchSection = async () => {
    try {
      const sectionsData = await axios.get(`${baseUrl}/section/fetch-all`);
      console.log("sections", sectionsData);
      setSection(sectionsData.data.data);
    } catch (error) {
      console.error("Error fetching section:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const customersResponse = await axios.get(
        `${baseUrl}/customer/fetch-with-query`,
        {
          params: {},
        },
      ); // Fetch based on class
      setCustomers(customersResponse.data.data);
    } catch (error) {
      console.error("Error fetching customers or checking attendance:", error);
    }
  };

  useEffect(() => {
    fetchReportNames();
    fetchClass();
    fetchSection();
  }, [message]);

  useEffect(() => {
    fetchCustomers();
  }, []);

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
        <Box component={"div"} sx={{}}>
          <Paper sx={{ padding: "20px", margin: "10px" }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "800", textAlign: "center" }}
            >
              Reports
            </Typography>
            <Box
              component="form"
              noValidate
              autoComplete="off"
              onSubmit={Formik.handleSubmit}
            >
              {!isDataValid && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {dataError}
                </Alert>
              )}

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
                {/* ReportNames */}
                <Box>
                  <Autocomplete
                    options={reportNames}
                    getOptionLabel={(option) => option.reportName}
                    value={selectedReport}
                    onChange={(event, newValue) => {
                      setSelectedReport(newValue);

                      Formik.setFieldValue(
                        "reportId",
                        newValue ? newValue.reportId : "",
                      );
                    }}
                    onBlur={() => Formik.setFieldTouched("reportId", true)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Report Name"
                        placeholder="Search report name..."
                        fullWidth
                        error={
                          Formik.touched.reportId &&
                          Boolean(Formik.errors.reportId)
                        }
                        helperText={
                          Formik.touched.reportId && Formik.errors.reportId
                        }
                      />
                    )}
                  />
                </Box>

                {/* Customers */}
                {selectedReport &&
                  (selectedReport.reportId ===
                    "sales-summary-customer-report" ||
                    selectedReport.reportId ===
                      "sales-summary-item-report") && (
                    <Box>
                      <Autocomplete
                        options={customers}
                        getOptionLabel={(option) => option.name}
                        value={selectedCustomer}
                        onChange={(event, newValue) => {
                          setSelectedCustomer(newValue);

                          Formik.setFieldValue(
                            "customer",
                            newValue ? newValue._id : "",
                          );
                        }}
                        onBlur={() => Formik.setFieldTouched("customer", true)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Customer"
                            placeholder="Search customer..."
                            fullWidth
                            error={
                              Formik.touched.customer &&
                              Boolean(Formik.errors.customer)
                            }
                            helperText={
                              Formik.touched.customer && Formik.errors.customer
                            }
                          />
                        )}
                      />
                    </Box>
                  )}

                {/* Academic Year */}
                {selectedReport &&
                  selectedReport.reportId === "other-report" && (
                    <Box>
                      <Autocomplete
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
                  )}

                {/* From Date */}
                {selectedReport &&
                  (selectedReport.reportId ===
                    "sales-summary-customer-report" ||
                    selectedReport.reportId ===
                      "sales-summary-item-report") && (
                    <Box>
                      <TextField
                        label="From Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={Formik.values.fromDate}
                        onChange={(e) => {
                          Formik.setFieldValue("fromDate", e.target.value);
                          setFromDate(e.target.value);
                        }}
                        error={
                          Formik.touched.fromDate &&
                          Boolean(Formik.errors.fromDate)
                        }
                        helperText={
                          Formik.touched.fromDate && Formik.errors.fromDate
                        }
                      />
                    </Box>
                  )}

                {/* To Date */}
                {selectedReport &&
                  (selectedReport.reportId ===
                    "sales-summary-customer-report" ||
                    selectedReport.reportId ===
                      "sales-summary-item-report") && (
                    <Box>
                      <TextField
                        label="To Date"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={Formik.values.toDate}
                        onChange={(e) => {
                          Formik.setFieldValue("toDate", e.target.value);
                          setToDate(e.target.value);
                        }}
                        error={
                          Formik.touched.toDate && Boolean(Formik.errors.toDate)
                        }
                        helperText={
                          Formik.touched.toDate && Formik.errors.toDate
                        }
                      />
                    </Box>
                  )}
              </Box>

              <Box sx={{ marginTop: "10px" }} component={"div"}>
                <Button
                  type="submit"
                  sx={{ marginRight: "10px" }}
                  variant="contained"
                >
                  Submit
                </Button>
                {isEdit && (
                  <Button
                    sx={{ marginRight: "10px" }}
                    variant="outlined"
                    onClick={cancelEdit}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
