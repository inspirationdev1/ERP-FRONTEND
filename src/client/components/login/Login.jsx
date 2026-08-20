import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Form, useFormik } from "formik";
import { loginSchema } from "../../../yupSchema/loginSchema";
import axios from "axios";
import { baseUrl } from "../../../environment";
import CustomizedSnackbars from "../../../basic utility components/CustomizedSnackbars";
import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./Login.css";
import { AuthContext } from "../../../context/AuthContext";

export default function Login() {
  let { role } = useParams();
  const [loginType, setLoginType] = useState("company_owner");
  const [isloginType, setIsloginType] = useState(false);

  const { authenticated, login } = useContext(AuthContext);

  useEffect(() => {
    console.log("role:", role);
    if (role) {
      role = role.toLowerCase();
      if (role !== "company") {
        setIsloginType(true);
        setLoginType(role);
      } else {
        setLoginType("company_owner");
      }
    } else {
      setLoginType("company_owner");
      setIsloginType(false);
    }
  }, [role]);

  const [message, setMessage] = useState("");
  const [type, setType] = useState("succeess");

  const navigate = useNavigate();

  const resetMessage = () => {
    setMessage("");
  };

  const handleSelection = (e) => {
    setLoginType(e.target.value);
    resetInitialValue();
  };

  const resetInitialValue = () => {
    Formik.setFieldValue("email", "");
    Formik.setFieldValue("password", "");
  };

  const initialValues = {
    email: "",
    password: "",
  };
  const Formik = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,

    onSubmit: async (values) => {
      if (loginType === null || loginType === "") {
        setMessage("Select user type");
        setType("error");
        return;
      }

      console.log("Login Formik values", values);

      let url;
      let navUrl;

      if (loginType === "company_owner") {
        url = `${baseUrl}/company/login`;
        navUrl = "/company";
      } else if (loginType === "user") {
        url = `${baseUrl}/user/login`;
        navUrl = "/user";
      }

      try {
        const resp = await axios.post(url, { ...values });

        setMessage(resp.data.message);
        setType("success");

        let token = resp.headers.get("Authorization");

        if (resp.data.success) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(resp.data.user));

          login(resp.data.user);

          navigate(navUrl);
        }

        Formik.resetForm();
      } catch (e) {
        console.log("Error in login:", e.response?.data?.message);

        setMessage(
          e.response?.data?.message || "Login failed. Please try again.",
        );

        setType("error");
      } finally {
        // Formik automatically changes isSubmitting to false
        // after onSubmit completes.
      }
    },
  });

  // return (<Box component={'div'} sx={{ width: "100%", height: "80vh", background: "url(https://cdn.pixabay.com/photo/2017/08/12/21/42/back2school-2635456_1280.png)", backgroundSize: "cover" }}>
  return (
    <Box
      component={"div"}
      sx={{
        width: "100%",
        height: "80vh",
        background:
          "url(https://res.cloudinary.com/da3dxqer8/image/upload/v1786092945/BMS-Background_q9lcny.png)",
        backgroundSize: "cover",
      }}
    >
      {message && (
        <CustomizedSnackbars
          reset={resetMessage}
          type={type}
          message={message}
        />
      )}

      <Box
        component={"div"}
        sx={{ padding: "40px", maxWidth: "700px", margin: "auto" }}
      >
        <Paper sx={{ p: 4, mt: 2, maxWidth: 300, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            component={"div"}
          >
            <Typography variant="h2">Log In</Typography>
          </Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={Formik.handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2, // 🔥 consistent spacing
            }}
          >
            {/* User Type */}
            <FormControl fullWidth size="small">
              <InputLabel id="user-type-label">User Type</InputLabel>
              <Select
                disabled={isloginType}
                labelId="user-type-label"
                label="User Type"
                value={loginType}
                onChange={handleSelection}
              >
                <MenuItem value="company_owner">Admin/Owner</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>

            {/* Email */}
            <TextField
              fullWidth
              size="small"
              label="Email"
              name="email"
              value={Formik.values.email}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.email && Formik.errors.email && (
              <Typography color="error" fontSize={13}>
                {Formik.errors.email}
              </Typography>
            )}

            {/* Password */}
            <TextField
              fullWidth
              size="small"
              label="Password"
              type="password"
              name="password"
              value={Formik.values.password}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
            />
            {Formik.touched.password && Formik.errors.password && (
              <Typography color="error" fontSize={13}>
                {Formik.errors.password}
              </Typography>
            )}

            {/* Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={Formik.isSubmitting}
              sx={{
                height: "40px",
              }}
            >
              {Formik.isSubmitting ? (
                <>
                  <CircularProgress size={22} color="inherit" sx={{ mr: 1 }} />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
