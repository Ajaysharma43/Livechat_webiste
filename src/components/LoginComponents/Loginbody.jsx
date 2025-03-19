import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Login } from "../../Redux/features/Authenticate";

const LoginBody = () => {
  const dispatch = useDispatch();
  const success = useSelector((state) => state.Authreducer.Success);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: "",
    Password: "",
  });

  const HandleNavigate = () => {
    navigate("/Images");
  };

  useEffect(() => {
    if (success == true) {
      HandleNavigate();
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(Login({formData}))
    console.log("Login Data Submitted:", formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log In
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>
          <Box sx={{ marginBottom: 2 }}>
            <TextField
              fullWidth
              label="Password"
              name="Password"
              type="password"
              value={formData.Password}
              onChange={handleChange}
              variant="outlined"
              required
            />
          </Box>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Log In
          </Button>
        </form>
        <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
          <Grid item>
            <Typography variant="body2">
              Don't have an account? <a href="/signup">Sign Up</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default LoginBody;
