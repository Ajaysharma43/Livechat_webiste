import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Grid, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import { Signup } from '../../Redux/features/Authenticate';

const SignupCard = () => {
    const [formData, setFormData] = useState({
        Username: '',
        Email: '',
        Password: '',
        confirmPassword: '',
    });
    const dispatch = useDispatch()

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.Password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        else
        {
            dispatch(Signup({formData}))
        }
        console.log("Form Data Submitted:", formData);
        // Add your signup logic here
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={formData.Username}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
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
                            name="password"
                            type="password"
                            value={formData.Password}
                            onChange={handleChange}
                            variant="outlined"
                            required
                        />
                    </Box>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            fullWidth
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
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
                        Sign Up
                    </Button>
                </form>
                <Grid container justifyContent="flex-end" sx={{ marginTop: 2 }}>
                    <Grid item>
                        <Typography variant="body2">
                            Already have an account? <a href="/login">Log in</a>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default SignupCard;