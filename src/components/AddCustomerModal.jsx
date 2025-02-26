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
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AddCustomerModal = ({ open, onClose, onSave }) => {
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        residence: '',
        measurements: {
            jalabya: {
                length: '',
                shouldersWidth: '',
                sleeveLength: '',
                upperSleeveWidth: '',
                lowerSleeveWidth: '',
                upperSides: '',
                lowerSides: '',
                notes: '',
            },
            aragi: {
                length: '',
                shouldersWidth: '',
                sleeveLength: '',
                upperSleeveWidth: '',
                lowerSleeveWidth: '',
                upperSides: '',
                lowerSides: '',
                notes: '',
            },
            pants: { pantsLength: '', pantsWidth: '', notes: '' },
            alalla: {
                length: '',
                shouldersWidth: '',
                sleeveLength: '',
                upperSleeveWidth: '',
                lowerSleeveWidth: '',
                upperSides: '',
                lowerSides: '',
                pantsLength: '',
                pantsWidth: '',
                notes: '',
            },
        },
        notes: '',
    });

    const [errors, setErrors] = useState({
        name: false,
        phone: false,
        residence: false,
        measurements: {},
    });

    const [expanded, setExpanded] = useState(false);

    const handleChange = (e, category, field) => {
        const { name, value } = e.target;
        setNewCustomer((prev) => {
            if (category) {
                return {
                    ...prev,
                    measurements: {
                        ...prev.measurements,
                        [category]: {
                            ...prev.measurements[category],
                            [field]: value,
                        },
                    },
                };
            }
            return { ...prev, [name]: value };
        });

        if (name === 'name' || name === 'phone' || name === 'residence') {
            setErrors((prev) => ({ ...prev, [name]: false }));
        }
    };

    const validateMeasurements = () => {
        const measurementErrors = {};
        let isValid = true;

        Object.entries(newCustomer.measurements).forEach(([category, fields]) => {
            Object.entries(fields).forEach(([field, value]) => {
                if (field !== 'notes' && value && !/^\d*\.?\d+$/.test(value)) {
                    if (!measurementErrors[category]) measurementErrors[category] = {};
                    measurementErrors[category][field] = true;
                    isValid = false;
                }
            });
        });

        setErrors((prev) => ({ ...prev, measurements: measurementErrors }));
        return isValid;
    };

    const handleSave = () => {
        const requiredFields = { name: newCustomer.name, phone: newCustomer.phone, residence: newCustomer.residence };
        const hasEmptyFields = Object.entries(requiredFields).some(([key, value]) => !value.trim());

        if (hasEmptyFields) {
            setErrors((prev) => ({
                ...prev,
                name: !newCustomer.name.trim(),
                phone: !newCustomer.phone.trim(),
                residence: !newCustomer.residence.trim(),
            }));
            return;
        }

        if (!validateMeasurements()) return;

        const formattedPhoneNumbers = newCustomer.phone.split(',').map((num) => num.trim());

        onSave({
            ...newCustomer,
            phone: formattedPhoneNumbers,
        });
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%', // Adjusted for mobile
                    maxHeight: '85vh', // Adjusted for mobile
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 24,
                    p: 2, // Reduced padding
                    direction: 'rtl',
                    overflow: 'auto',
                }}
            >
                <Paper elevation={2} sx={{ display: 'flex', flexDirection: 'column', p: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                            إضافة عميل جديد
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto', pb: 1 }}>
                        <TextField
                            label="الاسم"
                            name="name"
                            value={newCustomer.name}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={errors.name}
                            helperText={errors.name ? 'هذا الحقل مطلوب' : ''}
                            required
                        />
                        <TextField
                            label="رقم الهاتف"
                            name="phone"
                            value={newCustomer.phone}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={errors.phone}
                            helperText={
                                errors.phone
                                    ? 'هذا الحقل مطلوب'
                                    : 'أدخل أرقام الهواتف مفصولة بفواصل (،)'
                            }
                            required
                        />
                        <TextField
                            label="مكان الإقامة"
                            name="residence"
                            value={newCustomer.residence}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            error={errors.residence}
                            helperText={errors.residence ? 'هذا الحقل مطلوب' : ''}
                            required
                        />

                        {Object.entries(newCustomer.measurements).map(([category, fields]) => (
                            <Accordion
                                expanded={expanded === category}
                                onChange={() => setExpanded(expanded === category ? false : category)}
                                key={category}
                                sx={{ border: '1px solid #ddd', borderRadius: 1 }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {category === 'jalabya'
                                            ? 'جلابية'
                                            : category === 'aragi'
                                                ? 'عراقي'
                                                : category === 'pants'
                                                    ? 'سروال'
                                                    : 'على الله'}
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 1.5 }}>
                                    <Stack spacing={1}>
                                        {Object.entries(fields).map(([field, value]) => (
                                            <TextField
                                                key={field}
                                                label={
                                                    field === 'length'
                                                        ? 'الطول'
                                                        : field === 'shouldersWidth'
                                                            ? 'عرض الكتفين'
                                                            : field === 'sleeveLength'
                                                                ? 'طول الكم'
                                                                : field === 'upperSleeveWidth'
                                                                    ? 'عرض الكم العلوي'
                                                                    : field === 'lowerSleeveWidth'
                                                                        ? 'عرض الكم السفلي'
                                                                        : field === 'upperSides'
                                                                            ? 'الجوانب العلوية'
                                                                            : field === 'lowerSides'
                                                                                ? 'الجوانب السفلية'
                                                                                : field === 'pantsLength'
                                                                                    ? 'طول السروال'
                                                                                    : field === 'pantsWidth'
                                                                                        ? 'عرض السروال'
                                                                                        : field === 'notes'
                                                                                            ? 'ملاحظات'
                                                                                            : field
                                                }
                                                value={value}
                                                onChange={(e) => handleChange(e, category, field)}
                                                fullWidth
                                                size="small"
                                                error={errors.measurements[category]?.[field]}
                                                helperText={
                                                    errors.measurements[category]?.[field] && field !== 'notes'
                                                        ? 'يجب أن يحتوي الحقل على أرقام فقط'
                                                        : ''
                                                }
                                                type={field === 'notes' ? 'text' : 'number'}
                                            />
                                        ))}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Stack>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        fullWidth
                        sx={{ mt: 1.5 }} // Reduced from mt: 2
                        startIcon={<SaveIcon fontSize="small" />}
                        size="small" // Changed from medium
                    >
                        حفظ العميل
                    </Button>
                </Paper>
            </Box>
        </Modal>
    );
};

export default AddCustomerModal;