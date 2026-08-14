// Home.js
import React from "react";
import {
  Container,
  Typography,
  Grid2,
  Card,
  CardContent,
  Box,
  Paper,
} from "@mui/material";
import Carousel from "./carousel/Carousel";
import Gallery from "./gallery/Gallery";

import CodeIcon from "@mui/icons-material/Code";
import LanguageIcon from "@mui/icons-material/Language";
import CloudIcon from "@mui/icons-material/Cloud";
import SchoolIcon from "@mui/icons-material/School";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DevicesIcon from "@mui/icons-material/Devices";

const Home = () => {
  const programs = [
    {
      title: "Software Development",
      icon: <CodeIcon fontSize="large" color="primary" />,
    },
    {
      title: "Web Applications",
      icon: <LanguageIcon fontSize="large" color="primary" />,
    },
    {
      title: "Cloud Solutions",
      icon: <CloudIcon fontSize="large" color="primary" />,
    },
    {
      title: "Corporate Training",
      icon: <SchoolIcon fontSize="large" color="primary" />,
    },
    {
      title: "IT Consulting",
      icon: <BusinessCenterIcon fontSize="large" color="primary" />,
    },
    {
      title: "Mobile Applications",
      icon: <DevicesIcon fontSize="large" color="primary" />,
    },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      {/* Carousel Section */}
      <Carousel />

      {/* Programs Section */}
      <Box sx={{ py: 5, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Our Programs
        </Typography>

        <Grid2 container spacing={3} justifyContent="center">
          {programs.map((program) => (
            <Grid2 item xs={12} sm={6} md={4} key={program.title}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 3,
                  height: "100%",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent>
                  {program.icon}
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {program.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>

      {/* Gallery Section */}

      {/* <Box sx={{ py: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
           Registerd Schools
        </Typography>
        <Gallery />
      </Box> */}

      {/* Testimonials Section */}
      {/* <Box sx={{ py: 5, textAlign: 'center', bgcolor: '#f9f9f9' }}>
        <Typography variant="h4" gutterBottom>
          What Parents Say
        </Typography>
        <Box maxWidth="600px" mx="auto" mt={2}>
          <Typography variant="body1" color="text.secondary">
            "This school has been a fantastic experience for my children. The faculty is supportive, and the programs are enriching!"
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            - Parent of Grade 3 Student
          </Typography>
        </Box>
      </Box> */}
    </Box>
  );
};

export default Home;
