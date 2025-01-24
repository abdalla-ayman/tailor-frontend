import { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Divider,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';


const CustomerDetailModal = ({ open, onClose, customer, onDelete, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [customerData, setCustomerData] = useState(customer);

    useEffect(() => {
        if (!open) {
            setIsEditing(false);
        }
    }, [open]);

    const handleChange = (e) => {
        console.log(customer, customerData)
        setCustomerData({
            ...customerData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        const { _id, ...customerDataWithoutId } = customerData;
        onSave(customer._id, customerDataWithoutId);
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
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
        >
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
                            تفاصيل العميل
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
                                        onClick={() => onDelete(customer._id)}
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
                            value={customer._id}
                            disabled
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="الاسم"
                            name="name"
                            value={customerData.name}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="رقم الهاتف"
                            name="phone"
                            value={customerData.phone}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9]*'
                            }}
                        />
                        <TextField
                            label="مكان الإقامة"
                            name="residence"
                            value={customerData.residence}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="المقاسات"
                            name="sizes"
                            value={customerData.sizes}
                            onChange={handleChange}
                            disabled={!isEditing}
                            multiline
                            rows={3}
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

export default CustomerDetailModal;