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
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const AddCustomerModal = ({ open, onClose, onSave }) => {
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: [],
        residence: '',
        sizes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            // Allow only numbers and commas
            const sanitizedValue = value.replace(/[^0-9,]/g, '');
            setNewCustomer(prev => ({ ...prev, [name]: sanitizedValue }));
        } else if ([
            'length', 'shouldersWidth', 'sleeveLength', 'upperSleeveWidth',
            'lowerSleeveWidth', 'upperSides', 'lowerSides', 'pantsLength',
            'pantsWidth'
        ].includes(name)) {
            // Allow only numbers and decimals
            const sanitizedValue = value.replace(/[^0-9.]/g, '');
            setNewCustomer(prev => ({ ...prev, [name]: sanitizedValue }));
        } else {
            setNewCustomer(prev => ({ ...prev, [name]: value }));
        }
    };


    const handleSave = () => {
        // Split the phone numbers by comma, trim any spaces, and join them back as a comma-separated string
        const formattedPhoneNumbers = newCustomer.phone
            .split(',')
            .map(num => num.trim())


        onSave({
            ...newCustomer,
            phone: formattedPhoneNumbers
        });
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
                            إضافة عميل جديد
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
                            label="الاسم"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="رقم الهاتف (أرقام مفصولة بفواصل)"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                            inputProps={{
                                inputMode: 'numeric',
                                pattern: '[0-9,]*'
                            }}
                            helperText="أدخل أرقام الهواتف مفصولة بفواصل (،)"
                        />
                        <TextField
                            label="مكان الإقامة"
                            name="residence"
                            value={newCustomer.residence}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="الطول"
                            name="length"
                            value={newCustomer.length}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكتفين"
                            name="shouldersWidth"
                            value={newCustomer.shouldersWidth}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="طول الكم"
                            name="sleeveLength"
                            value={newCustomer.sleeveLength}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكم العلوي"
                            name="upperSleeveWidth"
                            value={newCustomer.upperSleeveWidth}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الكم السفلي"
                            name="lowerSleeveWidth"
                            value={newCustomer.lowerSleeveWidth}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الجوانب العلوية"
                            name="upperSides"
                            value={newCustomer.upperSides}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض الجوانب السفلية"
                            name="lowerSides"
                            value={newCustomer.lowerSides}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="طول البنطلون"
                            name="pantsLength"
                            value={newCustomer.pantsLength}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="عرض البنطلون"
                            name="pantsWidth"
                            value={newCustomer.pantsWidth}
                            onChange={handleChange}

                            fullWidth
                            size="small"
                            InputProps={{
                                sx: { textAlign: 'right' }
                            }}
                        />
                        <TextField
                            label="ملاحظات"
                            name="notes"
                            value={newCustomer.notes}
                            onChange={handleChange}

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

export default AddCustomerModal;