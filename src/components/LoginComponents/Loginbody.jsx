import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Container, Paper, Grid } from '@mui/material';

const LoginBody = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
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