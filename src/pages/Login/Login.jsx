import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { login } from '../../api/users.api';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext'

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { user, setRefreshTrigger } = useUser()

    useEffect(() => {
        // If user is already logged in, redirect immediately
        if (user) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [user, navigate, location]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await login(data);
            setRefreshTrigger(prev => prev + 1)
            navigate('/', { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setMessage({ type: 'error', text: 'فشل تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة' });
            setLoading(false);
        }
    };

    // Rest of the component remains the same...
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ direction: 'rtl', textAlign: 'right' }}
        >
            <Typography variant="h4" mb={3}>تسجيل الدخول</Typography>
            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '300px' }}>
                <TextField
                    fullWidth
                    label="اسم المستخدم"
                    {...register('username', { required: 'اسم المستخدم مطلوب' })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="كلمة المرور"
                    type="password"
                    {...register('password', { required: 'كلمة المرور مطلوبة' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    margin="normal"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'تسجيل الدخول'}
                </Button>
            </Box>

            {/* Snackbar for Messages */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={() => setMessage({ type: '', text: '' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setMessage({ type: '', text: '' })}
                    severity={message.type}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;