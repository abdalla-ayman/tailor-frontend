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
    Switch
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const AddUserModal = ({ open, onClose, onSave }) => {
    const [newUser, setNewUser] = useState({
        username: '',
        name: '',
        password: '',
        isSuperAdmin: false // Added isSuperAdmin flag
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Handle switch (checkbox) differently from text inputs
        setNewUser({
            ...newUser,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSave = () => {
        onSave(newUser);
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
                            InputProps={{
                                sx: { textAlign: 'right' }
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