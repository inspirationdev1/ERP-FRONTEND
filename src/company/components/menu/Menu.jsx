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
  Tabs,
  Tab,
  Autocomplete,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { menuSchema } from "../../../yupSchema/menuSchema";

export default function Menu() {
  const [params, setParams] = useState({});
  // const [roles, setRoles] = useState([]); ///////
  const [menus, setMenus] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState(0);
  const [taxtypes, setTaxtypes] = useState([]);
  const [selectedTaxtype, setSelectedTaxtype] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/menu/delete/${id}`)
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
  const handleEdit = (id) => {
    console.log("Handle  Edit is called", id);
    setEdit(true);
    axios
      .get(`${baseUrl}/menu/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("menu_code", resp.data.data?.menu_code);
        Formik.setFieldValue("menu_name", resp.data.data?.menu_name);

        setEditId(resp.data.data._id);
        setTab(0); // open Create Menu tab
      })
      .catch((e) => {
        console.log("Error  in fetching edit data.");
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    setSelectedTaxtype(null);
    Formik.resetForm();
  };

  //   MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    menu_code: "",
    menu_name: "",
  };
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: menuSchema,
    onSubmit: (values) => {
      if (isEdit) {
        console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/menu/update/${editId}`, {
            ...values,
          })
          .then((resp) => {
            console.log("Edit submit", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
            setParams({});
            setTab(1); // go to View List
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, edit casting submit", e);
          });
      } else {
        axios
          .post(`${baseUrl}/menu/create`, { ...values })
          .then((resp) => {
            console.log("Response after submitting admin casting", resp);
            setMessage(resp.data.message);
            setType("success");
            cancelEdit();
            setParams({});
            setTab(1); // go to View List
          })
          .catch((e) => {
            setMessage(e.response.data.message);
            setType("error");
            console.log("Error, response admin casting calls", e);
          });
        Formik.resetForm();
      }
    },
  });

  const [month, setMonth] = useState([]);
  const [year, setYear] = useState([]);

  const [noofmenus, setNoofmenus] = useState(0); /////
  // const fetchRoles = () => {
  //   ///////
  //   axios
  //     .get(`${baseUrl}/menu/fetch-with-query`, { params })
  //     .then((resp) => {
  //       setRoles(resp.data.data);
  //       setNoofmenus(resp.data.data.length); ////////
  //     })
  //     .catch(() => console.log("Error in fetching menus data"));
  // };

  const fetchMenus = () => {
    axios
      .get(`${baseUrl}/menu/fetch-with-query`, { params })
      .then((resp) => {
        setMenus(resp.data.data);
        setNoofmenus(resp.data.data.length);
      })
      .catch(() => console.log("Error in fetching menus data"));
  };

  useEffect(() => {
    // fetchRoles();
    fetchMenus();
  }, [message, params]);

  const handleSearch = (e) => {
    let newParam;
    if (e.target.value !== "") {
      newParam = { ...params, search: e.target.value };
    } else {
      newParam = { ...params };
      delete newParam["search"];
    }

    setParams(newParam);
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
            {/* <Tab label="Create Receipt" /> */}
            <Tab label={isEdit ? "Edit Menu" : "Add New Menu"} />
            <Tab label="View List" />
          </Tabs>
        </Box>

        {tab === 0 && (
          <Box>
            <Paper sx={{ p: 3, m: 1 }}>
              <Box
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={Formik.handleSubmit}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2, // ✅ equal spacing between all items
                }}
              >
                <Box>
                  <TextField
                    disabled={isEdit}
                    fullWidth
                    label="Menu Code"
                    variant="outlined"
                    name="menu_code"
                    value={Formik.values.menu_code}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  />

                  {Formik.touched.menu_code && Formik.errors.menu_code && (
                    <p style={{ color: "red", textTransform: "capitalize" }}>
                      {Formik.errors.menu_code}
                    </p>
                  )}
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Menu Name"
                    variant="outlined"
                    name="menu_name"
                    value={Formik.values.menu_name}
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  />

                  {Formik.touched.menu_name && Formik.errors.menu_name && (
                    <p style={{ color: "red", textTransform: "capitalize" }}>
                      {Formik.errors.menu_name}
                    </p>
                  )}
                </Box>

                <Box>
                  <Button type="submit" sx={{ mr: 1 }} variant="contained">
                    Submit
                  </Button>

                  {isEdit && (
                    <Button variant="outlined" onClick={cancelEdit}>
                      Cancel Edit
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {tab === 1 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                mb: 2,
              }}
            >
              {/* Search */}
              <TextField
                label="Search Menu .."
                size="small"
                onChange={handleSearch}
                fullWidth
                sx={{
                  flex: 2,
                  "& .MuiInputBase-root": {
                    height: 42,
                    fontSize: "14px",
                  },
                }}
              />

              {/* No of Menus */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: { xs: "100%", sm: 160 },
                  height: 42,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: 600,
                  fontSize: "14px",
                  boxShadow: 2,
                }}
              >
                Menus Count : {noofmenus}
                {/*   */}
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Menu Code</TableCell>
                    <TableCell align="right">Menu Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menus.map(
                    (
                      value,
                      i, //////
                    ) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="right">{value?.menu_code}</TableCell>
                        <TableCell align="right">{value?.menu_name}</TableCell>

                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1.5, // 👈 space between buttons
                            }}
                          >
                            <Button
                              variant="contained"
                              sx={{ background: "red", color: "#fff" }}
                              onClick={() => handleDelete(value._id)}
                            >
                              Delete
                            </Button>

                            <Button
                              variant="contained"
                              sx={{ background: "gold", color: "#222222" }}
                              onClick={() => handleEdit(value._id)}
                            >
                              Edit
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
}
