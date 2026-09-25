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
  Alert,
  Table,
  TableContainer,
  Tabs,
  Tab,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { userpermissionSchema } from "../../../yupSchema/userpermissionSchema";

const Userpermission = () => {
  const [isDataValid, setIsDataValid] = useState(true);
  const [dataError, setDataError] = useState("");
  const [expensetypes, setExpensetypes] = useState([]);

  const [expenseAmountTotal, setExpenseAmountTotal] = useState(0);

  const [params, setParams] = useState({});
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isAdd, setAdd] = useState(false);
  const [screenNames, setScreenNames] = useState(false);

  const [tab, setTab] = useState(0);
  const [taxtypes, setTaxtypes] = useState([]);
  const [selectedTaxtype, setSelectedTaxtype] = useState(null);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userpermissions, setUserpermissions] = useState([]);
  const [userpermissionsDetails, setUserpermissionsDetails] = useState([
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

  const fetchRoles = async () => {
    try {
      const rolesData = await axios.get(`${baseUrl}/role/fetch-all`);

      setRoles(rolesData.data.data);
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await axios.get(`${baseUrl}/user/fetch-all`);

      setUsers(usersData.data.data);
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete?")) {
      axios
        .delete(`${baseUrl}/userpermission/delete/${id}`)
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
  const handleEdit = (value) => {
    console.log("Handle  Edit is called", value.id);
    console.log("user", value?.user);
    console.log("role", value?.user?.role);
    setSelectedUser(value?.user);
    setSelectedRole(value?.user?.role);
    const id = value.id;
    setEditId(id);
    axios
      .get(`${baseUrl}/userpermission/fetch-single/${id}`)
      .then((resp) => {
        // Formik.setFieldValue("expenseCode", resp.data.data.expenseCode);

        const editUserpermissionDetails = resp.data.data.map((row) => ({
          ...row,
          isEdit: true,
        }));

        setUserpermissionsDetails(editUserpermissionDetails);
        setEdit(true);
        setTab(0); // open Edit Userpermission tab
      })
      .catch((e) => {
        console.log("Error  in fetching edit data.");
      });
  };

  const handleAdd = (value) => {
    console.log("Handle  Add is called", value.id);
    console.log("user", value?.user);
    console.log("role", value?.user?.role);
    setSelectedUser(value?.user);
    setSelectedRole(value?.user?.role);
    Formik.setFieldValue("user", value?.user?.id);

    Formik.setFieldValue("user_name", value?.user?.name);

    Formik.setFieldValue("role", value?.user?.role?._id);
    Formik.setFieldValue("role_name", value?.user?.role?.role_name);
    clearUserPermissionsDetails();
    setAdd(true);

    setTab(0); // open Create Userpermission tab
  };

  const cancelEdit = () => {
    setEdit(false);
    setSelectedUser(null);
    setSelectedRole(null);
    clearUserPermissionsDetails();
    Formik.resetForm();
    setTab(1);
  };

  //   MESSAGE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const resetMessage = () => {
    setMessage("");
  };

  const initialValues = {
    user: "",
    user_name: "",
    role: "",
    role_name: "",
  };

  const Formik = useFormik({
    initialValues: initialValues,
    // validationSchema: userpermissionSchema,
    onSubmit: (values) => {
      values.user = selectedUser?._id;
      values.role = selectedRole?._id;

      // if (!selectedUser) {
      //   setMessage("Select the User");
      // }
      // setType("error");

      if (!selectedUser) {
        setDataError("Select the user");
        setIsDataValid(false);
        return;
      }
      if (!selectedRole) {
        setDataError("Select the Role");
        setIsDataValid(false);
        return;
      }

      const hasDuplicate =
        new Set(userpermissionsDetails.map((d) => d?.screenId.toString()))
          .size !== userpermissionsDetails.length;
      console.log(hasDuplicate); // true
      if (hasDuplicate) {
        setIsDataValid(false);
        setDataError("Screen Name selection is duplicated");
        return;
      }
      const payload = {
        ...values,
        userpermissionsDetails: userpermissionsDetails.map((row) => ({
          user: selectedUser?._id,
          role: selectedRole?._id,
          screenId: row?.screenId,
          screenName: row.screenName,
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
          .patch(`${baseUrl}/userpermission/update/${editId}`, payload)
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
          .post(`${baseUrl}/userpermission/create`, payload)
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

  const [noofuserpermissions, setNoofuserpermissions] = useState(0);
  const fetchUserpermissions = () => {
    axios
      .get(`${baseUrl}/userpermission/fetch-with-query`, { params })
      .then((resp) => {
        setUserpermissions(resp.data.data);
        setNoofuserpermissions(resp.data.data.length);
      })
      .catch(() => console.log("Error in fetching userpermissions data"));
  };

  const handleChange = (index, field, value) => {
    const updated = [...userpermissionsDetails];
    updated[index][field] = value;

    if (field === "screenId") {
      updated[index].viewflag = false;
      updated[index].addflag = false;
      updated[index].editflag = false;
      updated[index].deleteflag = false;
      updated[index].printflag = false;
      // updated[index].screenId = value?.screenId;
      updated[index].screenName = value?.screenName;
    }

    setUserpermissionsDetails(updated);
  };

  const calculateTotals = () => {
    let expAmountTotal = 0;

    for (const item of userpermissionsDetails) {
      expAmountTotal += item?.expenseAmount || 0;
    }
    return expAmountTotal;
  };

  const addRow = () => {
    setUserpermissionsDetails([
      ...userpermissionsDetails,
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

  const removeRow = (index) => {
    setUserpermissionsDetails(
      userpermissionsDetails.filter((_, i) => i !== index),
    );
    console.log(userpermissionsDetails);
  };

  const clearUserPermissionsDetails = () => {
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

    console.log(itemArray);
    setUserpermissionsDetails(itemArray);
  };
  const fetchScreenNames = async () => {
    try {
      const screensData = [
        { screenId: "customer", screenName: "Customer" },
        { screenId: "supplier", screenName: "Supplier" },
        { screenId: "employee", screenName: "Employee" },
      ];
      setScreenNames(screensData);
    } catch (error) {
      console.error("Error fetching Screen Names:", error);
    }
  };

  useEffect(() => {
    fetchScreenNames();
    fetchUsers();
    fetchRoles();
    fetchUserpermissions();
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
              <Tab
                label={isEdit ? "Edit Userpermission" : "Add New Userpermission"}
              />
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
                    gap: 2, //  equal spacing between all items
                  }}
                >
                  <Box>
                    <Autocomplete
                      disabled
                      options={users}
                      getOptionLabel={(option) => option.name}
                      value={selectedUser}
                      onChange={(event, newValue) => {
                        setSelectedUser(newValue);
  
                        Formik.setFieldValue(
                          "user",
                          newValue ? newValue._id : "",
                        );
                        Formik.setFieldValue(
                          "user_name",
                          newValue ? newValue.name : "",
                        );
                      }}
                      onBlur={() => Formik.setFieldTouched("user", true)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select user"
                          placeholder="Search user..."
                          fullWidth
                          error={
                            Formik.touched.user && Boolean(Formik.errors.user)
                          }
                          helperText={Formik.touched.user && Formik.errors.user}
                        />
                      )}
                    />
                  </Box>
  
                  <Box>
                    <Autocomplete
                      disabled
                      options={roles}
                      getOptionLabel={(option) => option.role_name}
                      value={selectedRole}
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
                      }}
                      onBlur={() => Formik.setFieldTouched("role", true)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select role"
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
  
                  {/* ExpenseDetail */}
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
                    {userpermissionsDetails.map((row, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "3fr 1fr 1fr 1fr 0.5fr",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        {/* ScreenId */}
  
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
                            // handleChange(
                            //   index,
                            //   "screenId",
                            //   newValue?.screenId || "",
                            // );
                            handleChange(
                              index,
                              "screenId",
                              newValue?.screenId || "",
                            );
                            handleChange(
                              index,
                              "screenName",
                              newValue?.screenName || "",
                            );
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
  
                        {/* Checkbox */}
  
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.viewflag || false}
                              onChange={(e) => {
                                handleChange(index, "viewflag", e.target.checked);
                              }}
                            />
                          }
                          label="View"
                        />
  
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.addflag || false}
                              onChange={(e) => {
                                handleChange(index, "addflag", e.target.checked);
                              }}
                            />
                          }
                          label="Add"
                        />
  
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.editflag || false}
                              onChange={(e) => {
                                handleChange(index, "editflag", e.target.checked);
                              }}
                            />
                          }
                          label="Edit"
                        />
  
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.deleteflag || false}
                              onChange={(e) => {
                                handleChange(
                                  index,
                                  "deleteflag",
                                  e.target.checked,
                                );
                              }}
                            />
                          }
                          label="Delete"
                        />
  
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={row.printflag || false}
                              onChange={(e) => {
                                handleChange(
                                  index,
                                  "printflag",
                                  e.target.checked,
                                );
                              }}
                            />
                          }
                          label="Print"
                        />
                        <Box>
                          <Button color="error" onClick={() => removeRow(index)}>
                            ✕
                          </Button>
                        </Box>
                      </Box>
                    ))}
  
                    {/* Add Row */}
                    <Button variant="outlined" onClick={addRow}>
                      + Add Screen
                    </Button>
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
                  label="Search User "
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
  
                {/* No of Userpermissions */}
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
                  Users Count : {noofuserpermissions}
                </Box>
              </Box>
  
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">User name</TableCell>
                      <TableCell align="right">Role Name</TableCell>
                      <TableCell align="right">permissionCount</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {userpermissions &&
                      userpermissions.map((value, i) => (
                        <TableRow
                          key={i}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell align="right">{value?.name}</TableCell>
                          <TableCell align="right">
                            {value?.role?.role_name}
                          </TableCell>
                          <TableCell align="right">
                            {value?.permissionCount}
                          </TableCell>
  
                          <TableCell align="right">
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1.5, // 👈 space between buttons
                              }}
                            >
                              {value?.permissionCount === 0 && (
                                <Button
                                  variant="contained"
                                  sx={{
                                    backgroundColor: "#2e7d32",
                                    color: "#fff",
                                  }}
                                  onClick={() =>
                                    handleAdd({
                                      id: value._id,
                                      user: value,
                                      role: value.roles,
                                    })
                                  }
                                >
                                  Add
                                </Button>
                              )}
  
                              {value?.permissionCount > 0 && (
                                <Button
                                  variant="contained"
                                  sx={{ background: "gold", color: "#222222" }}
                                  onClick={() =>
                                    handleEdit({
                                      id: value._id,
                                      user: value,
                                      role: value.roles,
                                    })
                                  }
                                >
                                  Edit
                                </Button>
                              )}
  
                              <Button
                                variant="contained"
                                sx={{ background: "red", color: "#fff" }}
                                onClick={() => handleDelete(value._id)}
                              >
                                Delete
                              </Button>
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

export default Userpermission;
