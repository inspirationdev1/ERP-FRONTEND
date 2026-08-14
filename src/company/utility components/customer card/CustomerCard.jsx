/* eslint-disable react/prop-types */

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import { Button, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "transparent",
  color: "#fff",
  boxShadow: "none",
  textTransform: "uppercase",
}));
export default function CustomerCardAdmin({
  handleEdit,
  customer,
  handleDelete,
}) {
  const convertDate = (dateData) => {
    const date = new Date(dateData);
    const dateNu = date.getDate();
    const month = +date.getMonth() + 1;
    const year = date.getFullYear();

    return dateNu + "/" + month + "/" + year;
  };

  useEffect(() => {
    console.log("Customer", customer);
  }, []);
  return (
    <>
      <Card sx={{ maxWidth: 545, margin: "5px" }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="360"
          image={`${customer.customer_image}`}
        />
        <CardContent>
          <Typography
            component={"div"}
            sx={{ typography: "text.secondary" }}
            variant="h5"
          >
            <b>Name :</b>
            <span>{customer.name}</span>
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Customer Class :</b>
            {customer.customer_class && customer.customer_class.class_name}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Age :</b>
            {customer.age}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Gender :</b>
            {customer.gender}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Guardian :</b>
            {customer.guardian}
          </Typography>
          <Typography component={"div"} variant="h5">
            <b>Guardian Phone :</b>
            {customer.guardian_phone}
          </Typography>
          <Typography component={"div"} variant="p">
            <b>Date of Admission:</b>
            <span>{convertDate(customer.joinDate)}</span>{" "}
          </Typography>
        </CardContent>
        <CardActions>
          {/* <Button size="small">Share</Button>
        <Button size="small">Learn More</Button> */}
          {/* <Box component={'div'} sx={{position:"absolute",width:"100%", bottom:0, display:'flex',justifyContent:"end"}} > */}
          <Button
            size="small"
            variant="contained"
            sx={{ background: "red", color: "#fff" }}
            onClick={() => {
              handleDelete(customer._id);
            }}
          >
            Delete
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{ background: "gold", color: "#222222" }}
            onClick={() => {
              handleEdit(customer._id);
            }}
          >
            Edit
          </Button>
          {/* </Box> */}
        </CardActions>
      </Card>
    </>
  );
}
