import React, { useRef, useState } from 'react';
import { TextField, Button, Typography, Box, Container, Grid, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Signup } from '../../Redux/features/Authenticate';

const SignupCard = () => {
    const formref = useRef()
    const message = useSelector((state) => state.Authreducer.Message)
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
        setFormData({
            Username: '',
            Email: '',
            Password: '',
            confirmPassword: '',
        });
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <form onSubmit={handleSubmit} ref={formref}>
                    <h1 className='uppercase font-black text-yellow-400'>{message}</h1>
                    <Box sx={{ marginBottom: 2 }}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="Username"
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