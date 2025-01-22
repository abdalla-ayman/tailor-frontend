import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import { login } from '../../api/customers.api';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            console.log("Form Data:", data);
            await login(data);
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            sx={{ direction: 'rtl', textAlign: 'right' }} // RTL support
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
                >
                    تسجيل الدخول
                </Button>
            </Box>
        </Box>
    );
};

export default Login;
