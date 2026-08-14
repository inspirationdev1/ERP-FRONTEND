// import * as React from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../environment";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const drawerWidth = 240;

export default function Company() {
  const { user } = React.useContext(AuthContext);
  const [appsettings, setAppsettings] = useState([]);
  const [selectedAppsetting, setSelectedAppsetting] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = React.useState(false);
  const [openMenu, setOpenMenu] = React.useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = (label) => {
    setOpenMenu((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleNavigation = (link) => {
    navigate(link);
    if (isMobile) setOpen(false);
  };

  const navArr = [
    {
      label: "Dashboard",
      icon: DashboardIcon,
      link: "/company",
    },
    {
      label: "Masters",
      icon: MenuBookIcon,
      children: [
        // { label: "Class", link: "/company/class" },
        // { label: "Section", link: "/company/section" },
        // { label: "Subjects", link: "/company/subject" },
        // { label: "Class Subject", link: "/company/classsubject" },
        { label: "Departments", link: "/company/department" },
        { label: "Item Types", link: "/company/itemtype" },
        { label: "Items", link: "/company/item" },
        { label: "Geo Locations", link: "/company/geolocation" },
        // { label: "Periods", link: "/company/period" },
        // { label: "Schedule", link: "/company/periods" },
        // { label: "Attendee", link: "/company/attendee" },
        // { label: "Notice", link: "/company/notice" },
      ],
    },
    {
      label: "Sales",
      icon: GroupIcon,
      children: [
        { label: "Customers", link: "/company/customers" },
        { label: "Sales Invoice", link: "/company/salesinvoice" },
        { label: "Receipts", link: "/company/receipt" },
        { label: "Reports", link: "/company/studentreports" },
      ],
    },
    {
      label: "Purchase",
      icon: FormatListNumberedIcon,
      children: [
        { label: "Suppliers", link: "/company/suppliers" },
        { label: "Purchase Invoice", link: "/company/purchaseinvoice" },
        { label: "Payments", link: "/company/payement" },
        { label: "Reports", link: "/company/studentreports" },
      ],
    },
    // {
    //   label: "Exam",
    //   icon: MenuBookIcon,
    //   children: [
    //     { label: "Examinations", link: "/company/examinations" },
    //     { label: "Questionpapers", link: "/company/questionpapers" },
    //     { label: "Marksheets", link: "/company/marksheet" },
    //     { label: "Grades", link: "/company/grades" },
    //     { label: "Reports", link: "/company/companyreports" },
    //   ],
    // },
    {
      label: "Staffs",
      icon: GroupIcon,
      children: [
        // { label: "Teachers", link: "/company/teachers" },
        { label: "Employees", link: "/company/employees" },
        { label: "Reports", link: "/company/staffreports" },
      ],
    },
    {
      label: "Finance",
      icon: MenuBookIcon,
      children: [
        { label: "Tax Rates", link: "/company/taxrates" },
        { label: "Expense Type", link: "/company/expensetype" },
        { label: "Expenses", link: "/company/expense" },
        { label: "Payments", link: "/company/payment" },
        { label: "Journal Voucher", link: "/company/journalvoucher" },
        { label: "Reports", link: "/company/financereports" },
        { label: "Account Level", link: "/company/accountlevel" },
        { label: "Account Ledger", link: "/company/accountledger" },
        { label: "Account Setup", link: "/company/accountsetup" },
      ],
    },
    {
      label: "Permissions",
      icon: GroupIcon,
      children: [
        { label: "Menu", link: "/company/menu" },
        { label: "Role", link: "/company/role" },
        { label: "Screen", link: "/company/screen" },
        { label: "Users", link: "/company/users" },
      ],
    },
    {
      label: "Settings",
      icon: GroupIcon,
      children: [
        { label: "Number Seq", link: "/company/numberseq" },
        { label: "App Settings", link: "/company/appsetting" },
        { label: "General Master", link: "/company/generalmaster" },
        { label: "Upload Data", link: "/company/uploaddata" },
        { label: "Send Whatsapp", link: "/company/sendwhatsapp" },
        { label: "Working Days", link: "/company/workingdays" },
      ],
    },

    {
      label: "Logout",
      icon: LogoutIcon,
      link: "/logout",
    },
  ];

  useEffect(() => {
    fetchAppsettings();
  }, []);

  const fetchAppsettings = () => {
    axios
      .get(`${baseUrl}/appsetting/fetch-all`)
      .then((resp) => {
        console.log("Fetching data in  Casting Calls  admin.", resp);
        setAppsettings(resp.data.data);
        const id = resp.data.data[0]._id;
        setSelectedAppsetting(resp.data.data[0]);
        console.log("selectedAppseting", selectedAppsetting);
      })
      .catch((e) => {
        console.log("Error in fetching casting calls admin data", e);
      });
  };

  // ✅ Drawer Content
  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />

      <List>
        {navArr.map((item, index) => {
          const Icon = item.icon;
          const hasChildren = !!item.children;
          const isActive = location.pathname === item.link;

          return (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    hasChildren
                      ? toggleMenu(item.label)
                      : handleNavigation(item.link)
                  }
                  sx={{
                    backgroundColor: isActive
                      ? "rgba(0,0,0,0.08)"
                      : "transparent",
                  }}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>

                  <ListItemText primary={item.label} />

                  {hasChildren &&
                    (openMenu[item.label] ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>

              {/* Children */}
              {hasChildren && (
                <Collapse
                  in={openMenu[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List disablePadding>
                    {item.children.map((child, i) => {
                      const isChildActive = location.pathname === child.link;

                      return (
                        <ListItemButton
                          key={i}
                          sx={{
                            pl: 6,
                            backgroundColor: isChildActive
                              ? "rgba(0,0,0,0.08)"
                              : "transparent",
                          }}
                          onClick={() => handleNavigation(child.link)}
                        >
                          <ListItemText primary={child.label} />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* ✅ AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            position: "relative",
            minHeight: { xs: 60, md: 70 }, // Increase toolbar height
            px: { xs: 1, md: 2 },
          }}
        >
          {/* LEFT */}
          <IconButton color="inherit" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </IconButton>

          {/* CENTER LOGO + TITLE */}
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              gap: { xs: 1, md: 2 },

              maxWidth: { xs: "65%", md: "80%" },
              height: "100%",
            }}
          >
            {/* Title */}
            <Typography
              variant="h6"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",

                fontSize: { xs: 16, md: 22 },
                fontWeight: 600,
              }}
            >
              {isMobile ? "BMS" : "Business Management System"}
            </Typography>

            {/* Logo */}
            <Box
              component="img"
              src={selectedAppsetting?.toolbar_image || "/logo.png"}
              alt="Company Logo"
              sx={{
                width: { xs: 80, md: 250 },
                height: { xs: 60, md: 70 },
                objectFit: "contain",
              }}
            />
          </Box>

          {/* RIGHT */}
          <Box
            sx={{
              ml: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <AccountCircleIcon />

            <Typography
              sx={{
                maxWidth: { xs: 80, sm: 120, md: 180 },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.owner_name}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ✅ Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={() => setOpen(false)}
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ✅ Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
