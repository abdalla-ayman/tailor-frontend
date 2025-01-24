import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Modal,
    TextField,
    Paper,
    IconButton,
    Avatar,
    Divider,
    Container,
    Snackbar,
    Alert,
    CircularProgress,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Logout as LogoutIcon, // Import the Logout icon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Navbar from '../../components/Navbar';
import { updateAccount, deleteAccount } from '../../api/users.api';
import { useUser } from '../../contexts/UserContext';

const Profile = () => {
    const { user, logout } = useUser(); // Destructure the logout function
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages
    const [formData, setFormData] = useState({
        name: user ? user.name : '',
        username: user ? user.username : '',
        id: user ? user._id : '',
        isSuperAdmin: user ? user.isSuperAdmin : false,
    });
    const navigate = useNavigate();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const { id, isSuperAdmin, ...accountDataWithoutId } = formData
            await updateAccount(id, accountDataWithoutId);
            setMessage({ type: 'success', text: 'تم تحديث البيانات بنجاح' });
            setLoading(false);
            handleClose();
        } catch (error) {
            console.error("Error updating account:", error);
            setMessage({ type: 'error', text: 'فشل تحديث البيانات' });
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteAccount(formData.id);
            setMessage({ type: 'success', text: 'تم حذف الحساب بنجاح' });
            setLoading(false);
            navigate('/login');
        } catch (error) {
            console.error("Error deleting account:", error);
            setMessage({ type: 'error', text: 'فشل حذف الحساب' });
            setLoading(false);
        }
    };

    const handleCloseMessage = () => {
        setMessage({ type: '', text: '' }); // Clear the message
    };

    const handleLogout = () => {
        logout(); // Call the logout function
        navigate('/login'); // Redirect to the login page
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Navbar />

            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 3,
                        direction: 'rtl'
                    }}>
                        <IconButton
                            onClick={() => navigate(-1)}
                            sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'action.selected' }
                            }}
                        >
                            <ArrowForwardIcon /> {/* Using forward arrow for RTL */}
                        </IconButton>
                        <Typography variant="h6" component="h1">
                            الرئيسية
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right', direction: 'rtl' }}>
                        {/* Profile Header */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h4" gutterBottom fontWeight="bold">
                                    الملف الشخصي
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    إدارة معلومات حسابك الشخصي
                                </Typography>
                            </Box>
                            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
                                <PersonIcon sx={{ fontSize: 40 }} />
                            </Avatar>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Profile Info */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    المعرف
                                </Typography>
                                <Typography variant="body1">{formData.id}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    الاسم
                                </Typography>
                                <Typography variant="body1">{formData.name}</Typography>
                            </Box>

                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    اسم المستخدم
                                </Typography>
                                <Typography variant="body1">{formData.username}</Typography>
                            </Box>


                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    صلاحية المشرف العام
                                </Typography>
                                <Typography variant="subtitle2">
                                    {formData.isSuperAdmin ? 'نعم' : 'لا'}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Action Buttons */}
                        <Box sx={{ display: 'flex', flexWrap: "wrap", gap: 2, justifyContent: 'flex-start' }}>
                            <Button
                                variant="contained"
                                startIcon={<EditIcon />}
                                onClick={handleOpen}
                                sx={{ minWidth: 135 }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'تعديل البيانات'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleDelete}
                                sx={{ minWidth: 135 }}
                                disabled={loading} // Disable button while loading
                            >
                                {loading ? <CircularProgress size={24} /> : 'حذف الحساب'}
                            </Button>
                            {/* Logout Button */}
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<LogoutIcon />}
                                onClick={handleLogout}
                                sx={{ minWidth: 135 }}
                                disabled={loading} // Disable button while loading
                            >
                                تسجيل الخروج
                            </Button>
                        </Box>

                        {/* Edit Modal */}
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="edit-profile-modal"
                        >
                            <Paper
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width: 400,
                                    p: 4,
                                    outline: 'none',
                                    borderRadius: 2,
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                                    تعديل البيانات
                                </Typography>
                                <Box
                                    component="form"
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <TextField
                                        fullWidth
                                        label="الاسم"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { textAlign: 'right' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="اسم المستخدم"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        variant="outlined"
                                        InputProps={{
                                            sx: { textAlign: 'right' }
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="كلمة المرور الجديدة"
                                        name="password"
                                        type="password"
                                        variant="outlined"
                                        InputProps={{
                                            sx: { textAlign: 'right' }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start', mt: 2 }}>
                                        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                                            {loading ? <CircularProgress size={24} /> : 'حفظ التغييرات'}
                                        </Button>
                                        <Button variant="text" onClick={handleClose} disabled={loading}>
                                            إلغاء
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        </Modal>
                    </Box>
                </Paper>
            </Container>

            {/* Snackbar for Success/Error Messages */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseMessage}
                    severity={message.type}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Profile;