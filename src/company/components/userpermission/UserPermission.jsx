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
import { userpermissionSchema } from "../../../yupSchema/userpermissionSchema";

export default function Userpermission() {
  const [params, setParams] = useState({});
  const [userpermissions, setUserpermissions] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [tab, setTab] = useState(0);
  const [taxtypes, setTaxtypes] = useState([]);
  const [selectedTaxtype, setSelectedTaxtype] = useState(null);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

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
  const handleEdit = (id) => {
    console.log("Handle  Edit is called", id);
    setEdit(true);
    axios
      .get(`${baseUrl}/userpermission/fetch-single/${id}`)
      .then((resp) => {
        Formik.setFieldValue("user", resp.data.data?.user?._id);
         Formik.setFieldValue("user_name", resp.data.data?.user_name);

         setSelectedUser(resp.data.data?.user)
        Formik.setFieldValue("role", resp.data.data?.role?._id);
        Formik.setFieldValue("role_name", resp.data.data?.role_name);
         setSelectedRole( resp.data.data?.role)

        setEditId(resp.data.data._id);
        setTab(0); // open Create Userpermission tab
      })
      .catch((e) => {
        console.log("Error  in fetching edit data.");
      });
  };

  const cancelEdit = () => {
    setEdit(false);
    setSelectedUser(null);
    setSelectedRole(null)
    Formik.resetForm();
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
    role_name:"",
  };
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: userpermissionSchema,
    onSubmit: (values) => {
      values.user = selectedUser?._id;
      values.role = selectedRole?._id;
      if (isEdit) {
        console.log("edit id", editId);
        axios
          .patch(`${baseUrl}/userpermission/update/${editId}`, {
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
          .post(`${baseUrl}/userpermission/create`, { ...values })
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

  useEffect(() => {
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
                    disabled={isEdit}
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
                    disabled={isEdit}
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
                label="Search Userpermission .."
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
                Userpermissions Count : {noofuserpermissions}
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">User name</TableCell>
                    <TableCell align="right">Role Name</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userpermissions.map((value, i) => (
                    <TableRow
                      key={i}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align="right">
                        {value?.user_name}
                      </TableCell>
                      <TableCell align="right">
                        {value?.role_name}
                      </TableCell>

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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </>
  );
}
