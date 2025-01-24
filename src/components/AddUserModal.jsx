import { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Paper,
    IconButton,
    Stack,
    Divider,
    FormControlLabel,
    Switch,
    FormHelperText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const AddUserModal = ({ open, onClose, onSave }) => {
    const [newUser, setNewUser] = useState({
        username: '',
        name: '',
        password: '',
        isSuperAdmin: false
    });

    const [errors, setErrors] = useState({
        username: '',
        name: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear errors when the user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }

        setNewUser({
            ...newUser,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const validateForm = () => {
        const newErrors = { username: '', name: '', password: '' };
        let isValid = true;

        // Validate username
        if (!newUser.username.trim()) {
            newErrors.username = 'اسم المستخدم مطلوب';
            isValid = false;
        }

        // Validate name
        if (!newUser.name.trim()) {
            newErrors.name = 'الاسم مطلوب';
            isValid = false;
        }

        // Validate password
        if (!newUser.password.trim()) {
            newErrors.password = 'كلمة المرور مطلوبة';
            isValid = false;
        } else if (newUser.password.length < 6) {
            newErrors.password = 'كلمة المرور يجب أن تكون على الأقل 6 أحرف';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) return;


        await onSave(newUser);
        onClose();

    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '95%',
        maxHeight: '90vh',
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 24,
        p: 2,
        direction: 'rtl',
        overflow: 'auto'
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Paper
                    elevation={0}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        position: 'sticky',
                        top: 0,
                        bgcolor: 'background.paper',
                        zIndex: 1,
                        py: 1
                    }}>
                        <Typography variant="subtitle1">
                            إضافة مستخدم جديد
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            <IconButton
                                color="primary"
                                onClick={handleSave}
                                size="small"
                            >
                                <SaveIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                                onClick={onClose}
                                size="small"
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Stack
                        spacing={1.5}
                        sx={{
                            overflowY: 'auto',
                            flex: 1,
                            pb: 2
                        }}
                    >
                        <TextField
                            label="اسم المستخدم"
                            name="username"
                            value={newUser.username}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={!!errors.username}
                            helperText={errors.username}
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="الاسم"
                            name="name"
                            value={newUser.name}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="كلمة المرور"
                            name="password"
                            type="password"
                            value={newUser.password}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                sx: { textAlign: 'right' },
                                inputProps: {
                                    minLength: 6 // Minimum length constraint
                                }
                            }}
                        />
                        {/* Switch for Super Admin */}
                        <FormControlLabel
                            control={
                                <Switch
                                    name="isSuperAdmin"
                                    checked={newUser.isSuperAdmin}
                                    onChange={handleChange}
                                    color="primary"
                                />
                            }
                            label="مشرف عام"
                            sx={{ textAlign: 'right' }}
                        />
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
};

export default AddUserModal;