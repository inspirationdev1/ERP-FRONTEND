import {
  Box,
  Button,
  Paper,
  TextField,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Alert,
  Table,
  TableContainer,
  Tabs,
  Tab,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";

const Rolepermission = () => {
  const [isDataValid, setIsDataValid] = useState(true);
  const [dataError, setDataError] = useState("");

  const [params, setParams] = useState({});
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isAdd, setAdd] = useState(false);

  const [screenNames, setScreenNames] = useState([]);
  const [tab, setTab] = useState(0);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [rolepermissions, setRolepermissions] = useState([]);

  const [rolepermissionsDetails, setRolepermissionsDetails] = useState([
    {
      screenId: null,
      screenName: null,
      addflag: false,
      isEdit: false,
      viewflag: false,
      editflag: false,
      deleteflag: false,
      printflag: false,
    },
  ]);

  const [screenSearch, setScreenSearch] = useState("");

  const rowRefs = useRef([]);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const [noofrolepermissions, setNoofrolepermissions] = useState(0);

  const resetMessage = () => {
    setMessage("");
  };

  // Fetch Roles
  const fetchRoles = async () => {
    try {
      const rolesData = await axios.get(`${baseUrl}/role/fetch-all`);

      setRoles(rolesData.data.data);
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  // Delete Role Permissions
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/rolepermission/delete/${id}`)
        .then((resp) => {
          setMessage(resp.data.message);
          setType("success");
        })
        .catch((e) => {
          setMessage(
            e.response?.data?.message || "Error deleting role permissions",
          );
          setType("error");
          console.log("Error, deleting", e);
        });
    }
  };

  // Edit Role Permissions
  const handleEdit = (value) => {
    console.log("Handle Edit is called", value?._id);
    console.log("role", value);

    const id = value?._id;

    setSelectedRole(value);
    setEditId(id);

    Formik.setFieldValue("role", value?._id || "");
    Formik.setFieldValue("role_name", value?.role_name || "");

    axios
      .get(`${baseUrl}/rolepermission/fetch-single/${id}`)
      .then((resp) => {
        const editRolepermissionDetails = resp.data.data.map((row) => ({
          ...row,
          isEdit: true,
        }));

        setRolepermissionsDetails(editRolepermissionDetails);
        setEdit(true);
        setAdd(false);
        setTab(0);
        setIsDataValid(true);
        setDataError("");
      })
      .catch((e) => {
        console.log("Error in fetching edit data.", e);
        setMessage(
          e.response?.data?.message || "Error in fetching role permissions",
        );
        setType("error");
      });
  };

  // Add Role Permissions
  const handleAdd = (value) => {
    console.log("Handle Add is called", value?._id);
    console.log("role", value);

    setSelectedRole(value);

    Formik.setFieldValue("role", value?._id || "");
    Formik.setFieldValue("role_name", value?.role_name || "");

    clearRolepermissionsDetails();

    setEdit(false);
    setEditId(null);
    setAdd(true);
    setIsDataValid(true);
    setDataError("");
    setTab(0);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEdit(false);
    setAdd(false);
    setSelectedRole(null);
    setEditId(null);

    clearRolepermissionsDetails();

    Formik.resetForm();

    setIsDataValid(true);
    setDataError("");
    setFocusedRowIndex(null);
    setScreenSearch("");

    setTab(1);
  };

  const initialValues = {
    role: "",
    role_name: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,

    onSubmit: (values) => {
      setIsDataValid(true);
      setDataError("");

      if (!selectedRole) {
        setMessage("Please select role");
        setType("error");
        return;
      }

      const selectedScreens = rolepermissionsDetails
        .map((row) => row?.screenId)
        .filter(Boolean);

      const hasDuplicate =
        new Set(selectedScreens).size !== selectedScreens.length;

      if (hasDuplicate) {
        setMessage("Screen Name selection is duplicated");
        setType("error");
        return;
      }

      const hasEmptyScreen = rolepermissionsDetails.some(
        (row) => !row?.screenId,
      );

      if (hasEmptyScreen) {
        setMessage("Please select screen for every row");
        setType("error");
        return;
      }

      const payload = {
        ...values,
        role: selectedRole?._id,
        role_name: selectedRole?.role_name,

        rolepermissionsDetails: rolepermissionsDetails.map((row) => ({
          role: selectedRole?._id,
          role_name: selectedRole?.role_name,
          screenId: row?.screenId,
          screenName: row?.screenName,
          viewflag: row?.viewflag,
          addflag: row?.addflag,
          editflag: row?.editflag,
          deleteflag: row?.deleteflag,
          printflag: row?.printflag,
        })),
      };

      console.log("payload", payload);

      if (isEdit) {
        console.log("edit id", editId);

        axios
          .patch(`${baseUrl}/rolepermission/update/${editId}`, payload)
          .then((resp) => {
            console.log("Edit submit", resp);

            setMessage(resp.data.message);
            setType("success");

            setEdit(false);
            setAdd(false);
            setSelectedRole(null);
            setEditId(null);

            Formik.resetForm();

            setParams({});
            setTab(1);
          })
          .catch((e) => {
            setMessage(
              e.response?.data?.message ||
                "Error while updating role permissions",
            );
            setType("error");

            console.log("Error, edit submit", e);
          });
      } else {
        axios
          .post(`${baseUrl}/rolepermission/create`, payload)
          .then((resp) => {
            console.log("Response after submitting Rolepermission", resp);

            setMessage(resp.data.message);
            setType("success");

            setEdit(false);
            setAdd(false);
            setSelectedRole(null);
            setEditId(null);

            Formik.resetForm();

            setParams({});
            setTab(1);
          })
          .catch((e) => {
            setMessage(
              e.response?.data?.message ||
                "Error while creating role permissions",
            );
            setType("error");

            console.log("Error, response Rolepermission", e);
          });
      }

      setFocusedRowIndex(null);
      setScreenSearch("");
    },
  });

  // Fetch Rolepermissions
  const fetchRolepermissions = () => {
    axios
      .get(`${baseUrl}/rolepermission/fetch-with-query`, { params })
      .then((resp) => {
        setRolepermissions(resp.data.data);
        setNoofrolepermissions(resp.data.data.length);
      })
      .catch((error) => {
        console.log("Error in fetching rolepermissions data", error);
      });
  };

  // Handle screen search
  const handleScreenSearch = () => {
    const value = screenSearch;

    if (!value.trim()) {
      setFocusedRowIndex(null);
      return;
    }

    const searchText = value.trim().toLowerCase();

    const index = rolepermissionsDetails.findIndex((row) =>
      row?.screenName?.toLowerCase().includes(searchText),
    );

    if (index !== -1) {
      setFocusedRowIndex(index);

      setTimeout(() => {
        rowRefs.current[index]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        rowRefs.current[index]?.focus();
      }, 50);
    } else {
      setFocusedRowIndex(null);
    }
  };

  // Handle screen change
  const handleScreenChange = (index, newValue) => {
    const screenId = newValue?.screenId || "";

    const duplicate = rolepermissionsDetails.some(
      (row, i) => i !== index && screenId && row?.screenId === screenId,
    );

    if (duplicate) {
      setMessage(
        `${newValue?.screenName || "This screen"} screen is already selected.`,
      );
      setType("error");
      return;
    }

    const updated = [...rolepermissionsDetails];

    updated[index] = {
      ...updated[index],
      screenId,
      screenName: newValue?.screenName || "",
      viewflag: false,
      addflag: false,
      editflag: false,
      deleteflag: false,
      printflag: false,
    };

    setRolepermissionsDetails(updated);
  };

  // Handle permission checkbox and other changes
  const handleChange = (index, field, value) => {
    const updated = [...rolepermissionsDetails];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setRolepermissionsDetails(updated);
  };

  // Add new screen row
  const addRow = () => {
    setRolepermissionsDetails([
      ...rolepermissionsDetails,
      {
        screenId: null,
        screenName: null,
        addflag: false,
        viewflag: false,
        editflag: false,
        deleteflag: false,
        printflag: false,
        isEdit: false,
      },
    ]);
  };

  // Remove screen row
  const removeRow = (index) => {
    setRolepermissionsDetails(
      rolepermissionsDetails.filter((_, i) => i !== index),
    );
  };

  // Clear and load all available screens
  const clearRolepermissionsDetails = () => {
    if (!Array.isArray(screenNames) || screenNames.length === 0) {
      setRolepermissionsDetails([
        {
          screenId: null,
          screenName: null,
          viewflag: false,
          addflag: false,
          editflag: false,
          deleteflag: false,
          printflag: false,
          isEdit: false,
        },
      ]);

      return;
    }

    let itemArray = [];

    for (let item of screenNames) {
      const itemData = {
        screenId: item.screenId,
        screenName: item.screenName,
        viewflag: false,
        addflag: false,
        editflag: false,
        deleteflag: false,
        printflag: false,
        isEdit: false,
      };

      itemArray = [...itemArray, itemData];
    }

    setRolepermissionsDetails(itemArray);
  };

  // Screen names
  const fetchScreenNames = async () => {
    try {
      const screensData = [
        {
          screenId: "customer",
          screenName: "Customer",
        },
        {
          screenId: "supplier",
          screenName: "Supplier",
        },
        {
          screenId: "employee",
          screenName: "Employee",
        },
      ];

      setScreenNames(screensData);
    } catch (error) {
      console.error("Error fetching Screen Names:", error);
    }
  };

  useEffect(() => {
    fetchScreenNames();
    fetchRoles();
    fetchRolepermissions();
  }, [message, params]);

  // Search roles
  const handleSearch = (e) => {
    let newParam;

    if (e.target.value !== "") {
      newParam = {
        ...params,
        search: e.target.value,
      };
    } else {
      newParam = {
        ...params,
      };

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
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 2,
          }}
        >
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab
              label={isEdit ? "Edit Rolepermission" : "Add New Rolepermission"}
            />

            <Tab label="View List" />
          </Tabs>
        </Box>

        {/* ADD / EDIT */}
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
                  gap: 2,
                }}
              >
                {/* Select Role */}
                <Box>
                  <Autocomplete
                    disabled={isEdit}
                    options={Array.isArray(roles) ? roles : []}
                    getOptionLabel={(option) => option?.role_name || ""}
                    value={selectedRole}
                    isOptionEqualToValue={(option, value) =>
                      option?._id === value?._id
                    }
                    onChange={(event, newValue) => {
                      setSelectedRole(newValue);

                      Formik.setFieldValue(
                        "role",
                        newValue ? newValue._id : "",
                      );

                      Formik.setFieldValue(
                        "role_name",
                        newValue ? newValue.role_name : "",
                      );

                      if (!newValue) {
                        setIsDataValid(false);
                        setDataError("Please select role");
                      } else {
                        setIsDataValid(true);
                        setDataError("");
                      }
                    }}
                    onBlur={() => Formik.setFieldTouched("role", true)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Role"
                        placeholder="Search role..."
                        fullWidth
                        error={
                          Formik.touched.role && Boolean(Formik.errors.role)
                        }
                        helperText={Formik.touched.role && Formik.errors.role}
                      />
                    )}
                  />
                </Box>

                {/* Screen Permissions */}
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <TextField
                      label="Search Screen Name"
                      placeholder="Search screen name..."
                      size="small"
                      value={screenSearch}
                      onChange={(e) => setScreenSearch(e.target.value)}
                      sx={{
                        flex: 1,
                      }}
                    />

                    <Button
                      variant="contained"
                      onClick={handleScreenSearch}
                      sx={{ ml: 1 }}
                    >
                      Search
                    </Button>
                  </Box>

                  {!isDataValid && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {dataError}
                    </Alert>
                  )}

                  {/* Header */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "3fr 1fr 1fr 1fr 0.5fr",
                      gap: 1,
                      fontWeight: "bold",
                      mb: 1,
                    }}
                  />

                  {/* Rows */}
                  {rolepermissionsDetails.map((row, index) => (
                    <Box
                      key={index}
                      ref={(el) => {
                        rowRefs.current[index] = el;
                      }}
                      tabIndex={-1}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "3fr 1fr 1fr 1fr 0.5fr",
                        gap: 1,
                        mb: 1,
                        borderRadius: 1,
                        backgroundColor:
                          focusedRowIndex === index
                            ? "rgba(255, 193, 7, 0.25)"
                            : "transparent",
                        border:
                          focusedRowIndex === index
                            ? "2px solid #ffb300"
                            : "2px solid transparent",
                        transition: "all 0.3s",
                      }}
                    >
                      {/* Screen */}
                      <Autocomplete
                        disabled={row.isEdit}
                        options={Array.isArray(screenNames) ? screenNames : []}
                        getOptionLabel={(option) => option?.screenName || ""}
                        value={
                          (screenNames &&
                            screenNames.find(
                              (screen) => screen.screenId === row.screenId,
                            )) ||
                          null
                        }
                        isOptionEqualToValue={(option, value) =>
                          option?.screenId === value?.screenId
                        }
                        onChange={(event, newValue) => {
                          handleScreenChange(index, newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Screenname"
                            placeholder="Search screenname..."
                            fullWidth
                          />
                        )}
                      />

                      {/* View */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.viewflag || false}
                            onChange={(e) =>
                              handleChange(index, "viewflag", e.target.checked)
                            }
                          />
                        }
                        label="View"
                      />

                      {/* Add */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.addflag || false}
                            onChange={(e) =>
                              handleChange(index, "addflag", e.target.checked)
                            }
                          />
                        }
                        label="Add"
                      />

                      {/* Edit */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.editflag || false}
                            onChange={(e) =>
                              handleChange(index, "editflag", e.target.checked)
                            }
                          />
                        }
                        label="Edit"
                      />

                      {/* Delete */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.deleteflag || false}
                            onChange={(e) =>
                              handleChange(
                                index,
                                "deleteflag",
                                e.target.checked,
                              )
                            }
                          />
                        }
                        label="Delete"
                      />

                      {/* Print */}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={row.printflag || false}
                            onChange={(e) =>
                              handleChange(index, "printflag", e.target.checked)
                            }
                          />
                        }
                        label="Print"
                      />

                      {/* Remove */}
                      <Box>
                        <Button color="error" onClick={() => removeRow(index)}>
                          ✕
                        </Button>
                      </Box>
                    </Box>
                  ))}

                  {/* Add Screen */}
                  <Button variant="outlined" onClick={addRow}>
                    + Add Screen
                  </Button>
                </Box>

                {/* Buttons */}
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

        {/* VIEW LIST */}
        {tab === 1 && (
          <Box>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                alignItems: "center",
                mb: 2,
              }}
            >
              {/* Search */}
              <TextField
                label="Search Role"
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

              {/* Role Count */}
              <Box
                sx={{
                  flex: 1,
                  minWidth: {
                    xs: "100%",
                    sm: 160,
                  },
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
                Roles Count : {noofrolepermissions}
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Role Name</TableCell>

                    <TableCell align="right">Permission Count</TableCell>

                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rolepermissions &&
                    rolepermissions.map((value, i) => (
                      <TableRow
                        key={i}
                        sx={{
                          "&:last-child td, &:last-child th": {
                            border: 0,
                          },
                        }}
                      >
                        {/* Role Name */}
                        <TableCell align="right">{value?.role_name}</TableCell>

                        {/* Permission Count */}
                        <TableCell align="right">
                          {value?.permissionCount}
                        </TableCell>

                        {/* Action */}
                        <TableCell align="right">
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: 1.5,
                            }}
                          >
                            {/* Add */}
                            {value?.permissionCount === 0 && (
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "#2e7d32",
                                  color: "#fff",
                                }}
                                onClick={() => handleAdd(value)}
                              >
                                Add
                              </Button>
                            )}

                            {/* Edit */}
                            {value?.permissionCount > 0 && (
                              <Button
                                variant="contained"
                                sx={{
                                  background: "gold",
                                  color: "#222222",
                                }}
                                onClick={() => handleEdit(value)}
                              >
                                Edit
                              </Button>
                            )}

                            {/* Delete */}
                            {value?.permissionCount === 0 && (
                              <Button
                                variant="contained"
                                sx={{
                                  background: "red",
                                  color: "#fff",
                                }}
                                onClick={() => handleDelete(value?._id)}
                              >
                                Delete
                              </Button>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Rolepermission;
