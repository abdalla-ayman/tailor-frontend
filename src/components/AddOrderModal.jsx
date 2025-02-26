import { useState, useEffect, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Alert,
    FormHelperText,
    CircularProgress,
    Autocomplete,
    ToggleButton,
    ToggleButtonGroup,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { getCustomers } from '../api/customers.api';

const DRESS_TYPES = {
    jalabya: 'جلابية',
    aragi: 'عراقي',
    pants: 'سروال',
    alalla: 'على الله',
};

const initialState = {
    customerId: '',
    amountDue: '',
    items: [{ type: '', count: 1, notes: '', fabric: '' }],
    customerData: null,
};

const AddOrderModal = ({ open, onClose, onSave, loading = false, onError }) => {
    const [order, setOrder] = useState(initialState);
    const [validationErrors, setValidationErrors] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [searchField, setSearchField] = useState('_id');
    const [searchQuery, setSearchQuery] = useState('');
    const [formErrors, setFormErrors] = useState({
        customerId: false,
        amountDue: false,
        items: [],
    });
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setOrder(initialState);
            setValidationErrors([]);
            setFormErrors({ customerId: false, amountDue: false, items: [] });
            setSearchQuery('');
            setCustomers([]);
        }
    }, [open]);

    // Fetch customers when searchQuery or searchField changes
    useEffect(() => {
        if (searchOpen && searchQuery) {
            const fetchCustomers = async () => {
                setSearchLoading(true);
                try {
                    const data = await getCustomers({ rowsPerPage: 2, searchField, searchQuery });
                    setCustomers(data.customers || []);
                } catch (error) {
                    console.error('Error fetching customers:', error);
                    onError('حدث خطأ أثناء جلب البيانات');
                } finally {
                    setSearchLoading(false);
                }
            };
            fetchCustomers();
        }
    }, [searchQuery, searchField, searchOpen, onError]);

    // Restore modal state after navigation
    useEffect(() => {
        const modalState = location.state?.modalState;
        if (modalState && open) {
            setOrder(modalState.order);
            setValidationErrors(modalState.validationErrors);
            setFormErrors(modalState.formErrors);
            setSearchField(modalState.searchField);
            setSearchQuery(modalState.searchQuery);
            navigate(location.pathname, { replace: true, state: {} }); // Clear navigation state
        }
    }, [location, navigate, open]);

    const handleViewDetails = () => {
        const currentPath = location.pathname;
        const modalState = { order, validationErrors, formErrors, searchField, searchQuery };
        navigate(`/customers/${order.customerData._id}`, {
            state: { returnTo: currentPath, modalState },
        });
    };

    const handleSearchOpen = () => setSearchOpen(true);
    const handleSearchClose = () => setSearchOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((prev) => ({
            ...prev,
            [name]: name === 'amountDue' ? Number(value) : value,
        }));
        setFormErrors((prev) => ({ ...prev, [name]: false }));
    };

    const handleItemChange = (index, field, value) => {
        setOrder((prev) => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: field === 'count' ? Number(value) : value } : item
            ),
        }));
        setFormErrors((prev) => ({
            ...prev,
            items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: false } : item
            ) || [],
        }));
    };

    const handleCustomerSelect = (customer) => {
        const customerId = customer ? customer._id : '';
        setOrder((prev) => ({
            ...prev,
            customerId,
            customerData: customer,
        }));
        setFormErrors((prev) => ({ ...prev, customerId: false }));
        setSearchOpen(false);
    };

    const validateMeasurements = (items, customerMeasurements) =>
        items.every(
            (item) =>
                customerMeasurements &&
                customerMeasurements[item.type] &&
                Object.keys(customerMeasurements[item.type]).length > 0
        );

    const validateOrder = () => {
        const errors = [];
        const formErrorsTemp = { customerId: false, amountDue: false, items: [] };

        if (!order.customerId) {
            errors.push('يجب اختيار العميل');
            formErrorsTemp.customerId = true;
        }

        if (!order.amountDue || order.amountDue < 0) {
            errors.push('يجب إدخال مبلغ صحيح');
            formErrorsTemp.amountDue = true;
        }

        order.items.forEach((item, index) => {
            formErrorsTemp.items[index] = {};
            if (!item.type) {
                errors.push(`يجب اختيار نوع القطعة ${index + 1}`);
                formErrorsTemp.items[index].type = true;
            }
            if (!item.count || item.count < 1) {
                errors.push(`يجب إدخال كمية صحيحة للقطعة ${index + 1}`);
                formErrorsTemp.items[index].count = true;
            }
        });

        if (order.customerData && !validateMeasurements(order.items, order.customerData.measurements)) {
            errors.push('العميل المختار لا يملك المقاسات المطلوبة لبعض القطع');
        }

        setFormErrors(formErrorsTemp);
        setValidationErrors(errors);
        return errors.length === 0;
    };

    const handleSave = async () => {
        if (!validateOrder()) return;
        try {
            await onSave(order);
            onClose();
        } catch (error) {
            onError?.(error.message || 'حدث خطأ أثناء حفظ الطلب');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxHeight: '85vh',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2,
                    direction: 'rtl',
                    overflow: 'auto',
                }}
            >
                <Paper elevation={2} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                            إضافة طلب جديد
                        </Typography>
                        <IconButton onClick={onClose} disabled={loading} size="small">
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                    <Divider sx={{ mb: 1 }} />

                    {validationErrors.length > 0 && (
                        <Alert severity="error" sx={{ mb: 1 }}>
                            {validationErrors.map((error, index) => (
                                <Typography key={index} variant="body2" component="div">
                                    {error}
                                </Typography>
                            ))}
                        </Alert>
                    )}

                    <Stack spacing={1.5} sx={{ overflowY: 'auto' }}>
                        <TextField
                            label="المبلغ المستحق"
                            name="amountDue"
                            value={order.amountDue}
                            onChange={handleChange}
                            type="number"
                            fullWidth
                            size="small"
                            error={formErrors.amountDue}
                            helperText={formErrors.amountDue ? 'يجب إدخال مبلغ صحيح' : ''}
                            required
                            disabled={loading}
                            InputProps={{ inputProps: { min: 0 } }}
                        />

                        <Accordion defaultExpanded sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                            <AccordionSummary expandIcon={<ExpandMore fontSize="small" />}>
                                <Typography variant="body2" fontWeight="bold">
                                    معلومات العميل
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                {!order.customerData || Object.keys(order.customerData).length === 0 ? (
                                    <FormControl fullWidth size="small" error={formErrors.customerId}>
                                        <Typography variant="caption" sx={{ mb: 0.5 }}>
                                            بحث بواسطة
                                        </Typography>
                                        <ToggleButtonGroup
                                            color="primary"
                                            value={searchField}
                                            exclusive
                                            onChange={(e, field) => field && setSearchField(field)}
                                            sx={{ mb: 1, display: 'flex', gap: 1 }}
                                        >
                                            <ToggleButton value="_id" size="small">
                                                الرقم المعرف
                                            </ToggleButton>
                                            <ToggleButton value="name" size="small">
                                                اسم المستخدم
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                        <Autocomplete
                                            open={searchOpen}
                                            onOpen={handleSearchOpen}
                                            onClose={handleSearchClose}
                                            isOptionEqualToValue={(option, value) => option[searchField] === value[searchField]}
                                            getOptionLabel={(option) => option.name || ''}
                                            options={customers}
                                            loading={searchLoading}
                                            onChange={(e, value) => handleCustomerSelect(value)}
                                            onInputChange={(e, query) => setSearchQuery(query)}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="البحث عن عميل"
                                                    size="small"
                                                    slotProps={{
                                                        input: {
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <Fragment>
                                                                    {searchLoading ? (
                                                                        <CircularProgress color="inherit" size={16} />
                                                                    ) : null}
                                                                    {params.InputProps.endAdornment}
                                                                </Fragment>
                                                            ),
                                                        },
                                                    }}
                                                />
                                            )}
                                        />
                                        {formErrors.customerId && (
                                            <FormHelperText>يجب اختيار العميل</FormHelperText>
                                        )}
                                    </FormControl>
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            p: 1,
                                            bgcolor: '#f5f5f5',
                                            borderRadius: 1,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccountCircleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                                            <Box>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {order.customerData.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    رقم العميل: {order.customerData._id}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={handleViewDetails}
                                                disabled={loading}
                                            >
                                                عرض التفاصيل
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                size="small"
                                                onClick={() => handleCustomerSelect(null)}
                                                disabled={loading}
                                            >
                                                إلغاء الاختيار
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>

                        {order.items.map((item, index) => (
                            <Accordion key={index} sx={{ border: '1px solid #ddd', borderRadius: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMore fontSize="small" />}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            pr: 1,
                                        }}
                                    >
                                        <Typography variant="body2" fontWeight="bold">
                                            {`القطعة ${index + 1}`} {item.type && `- ${DRESS_TYPES[item.type]}`}
                                        </Typography>
                                        {index > 0 && (
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOrder((prev) => ({
                                                        ...prev,
                                                        items: prev.items.filter((_, i) => i !== index),
                                                    }));
                                                }}
                                                disabled={loading}
                                                sx={{ color: 'error.main' }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        )}
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 2 }}>
                                    <Stack spacing={1.5}>
                                        <FormControl fullWidth size="small" error={formErrors.items[index]?.type}>
                                            <InputLabel>نوع القطعة</InputLabel>
                                            <Select
                                                value={item.type}
                                                label="نوع القطعة"
                                                onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                                disabled={loading}
                                            >
                                                {Object.entries(DRESS_TYPES).map(([value, label]) => (
                                                    <MenuItem key={value} value={value}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {formErrors.items[index]?.type && (
                                                <FormHelperText>يجب اختيار نوع القطعة</FormHelperText>
                                            )}
                                        </FormControl>
                                        <TextField
                                            label="تفاصيل القماش"
                                            value={item.fabric}
                                            onChange={(e) => handleItemChange(index, 'fabric', e.target.value)}
                                            fullWidth
                                            size="small"
                                            disabled={loading}
                                        />
                                        <TextField
                                            label="الكمية"
                                            value={item.count}
                                            onChange={(e) => handleItemChange(index, 'count', e.target.value)}
                                            type="number"
                                            fullWidth
                                            size="small"
                                            error={formErrors.items[index]?.count}
                                            helperText={
                                                formErrors.items[index]?.count ? 'يجب إدخال كمية صحيحة' : ''
                                            }
                                            disabled={loading}
                                            InputProps={{ inputProps: { min: 1 } }}
                                        />
                                        <TextField
                                            label="ملاحظات"
                                            value={item.notes}
                                            onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                            fullWidth
                                            size="small"
                                            multiline
                                            rows={2}
                                            disabled={loading}
                                        />
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        ))}

                        <Button
                            variant="outlined"
                            onClick={() =>
                                setOrder((prev) => ({
                                    ...prev,
                                    items: [...prev.items, { type: '', count: 1, notes: '', fabric: '' }],
                                }))
                            }
                            startIcon={<AddCircleOutlineIcon />}
                            fullWidth
                            disabled={loading}
                            size="small"
                        >
                            إضافة قطعة
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            fullWidth
                            sx={{ mt: 1 }}
                            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                            disabled={loading}
                            size="small"
                        >
                            حفظ الطلب
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
};

export default AddOrderModal;