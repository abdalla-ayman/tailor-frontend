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
        if (open) {
            setCustomerData(customer);
        } else {
            setIsEditing(false);
        }
    }, [open, customer]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        if (name === "_id") return;
        if (name === 'phone') {
            // Allow only numbers and commas
            const sanitizedValue = value.replace(/[^0-9,]/g, '');
            setCustomerData({ ...customerData, [name]: sanitizedValue })
        } else if ([
            'length', 'shouldersWidth', 'sleeveLength', 'upperSleeveWidth',
            'lowerSleeveWidth', 'upperSides', 'lowerSides', 'pantsLength',
            'pantsWidth'
        ].includes(name)) {
            // Allow only numbers and decimals
            const sanitizedValue = value.replace(/[^0-9.]/g, '');
            setCustomerData({ ...customerData, [name]: sanitizedValue })
        } else {
            setCustomerData({ ...customerData, [name]: value });
        }
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
                                        onClick={() => {
                                            setIsEditing(false)
                                            setCustomerData(customer)
                                        }}
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
                            type="tel"
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
                            label="الطول"
                            name="length"
                            value={customerData.length}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            type='number'
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكتفين"
                            name="shouldersWidth"
                            value={customerData.shouldersWidth}
                            onChange={handleChange}
                            disabled={!isEditing}
                            type='number'
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="طول الكم"
                            name="sleeveLength"
                            value={customerData.sleeveLength}
                            onChange={handleChange}
                            disabled={!isEditing}
                            type='number'
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكم العلوي"
                            name="upperSleeveWidth"
                            value={customerData.upperSleeveWidth}
                            onChange={handleChange}
                            disabled={!isEditing}
                            fullWidth
                            type='number'
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكم السفلي"
                            name="lowerSleeveWidth"
                            value={customerData.lowerSleeveWidth}
                            onChange={handleChange}
                            type='number'
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الجوانب العلوية"
                            name="upperSides"
                            value={customerData.upperSides}
                            onChange={handleChange}
                            disabled={!isEditing}
                            type='number'
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الجوانب السفلية"
                            name="lowerSides"
                            value={customerData.lowerSides}
                            onChange={handleChange}
                            disabled={!isEditing}
                            type='number'
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="طول البنطلون"
                            name="pantsLength"
                            value={customerData.pantsLength}
                            onChange={handleChange}
                            type='number'
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض البنطلون"
                            name="pantsWidth"
                            value={customerData.pantsWidth}
                            onChange={handleChange}
                            type='number'
                            disabled={!isEditing}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="ملاحظات"
                            name="notes"
                            value={customerData.notes}
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