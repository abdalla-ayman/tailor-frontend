import { useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Paper,
    IconButton,
    Stack,
    Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const UserDetailModal = ({ open, onClose, user, onDelete, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(user);

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        onSave(userData);
        setIsEditing(false);
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
                            تفاصيل المستخدم
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                            {!isEditing ? (
                                <>
                                    <IconButton
                                        color="primary"
                                        onClick={() => setIsEditing(true)}
                                        size="small"
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(userData.id)}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </>
                            ) : (
                                <>
                                    <IconButton
                                        color="primary"
                                        onClick={handleSave}
                                        size="small"
                                    >
                                        <SaveIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => setIsEditing(false)}
                                        size="small"
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
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
                            label="المعرف"
                            name="id"
                            value={userData.id}
                            disabled
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="اسم المستخدم"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="الاسم"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
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
                            value={userData.password}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="حالة المشرف"
                            value={userData.isSuperAdmin ? 'مشرف رئيسي' : 'مستخدم عادي'}
                            disabled
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
};

export default UserDetailModal;