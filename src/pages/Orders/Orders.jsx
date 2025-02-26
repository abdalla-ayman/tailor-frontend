import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    IconButton,
    Stack,
    Paper,
    Button,
    Grid,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Divider,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getOrder, updateOrder, deleteOrder } from '../../api/orders.api';

const getStatusColor = (status) => {
    const statusColors = {
        pending: '#ffa726',
        in_progress: '#2196f3',
        completed: '#4caf50',
        delivered: '#9c27b0',
    };
    return statusColors[status] || '#757575';
};

const typesTranslate = {
    jalabya: "جلابية",
    aragi: "عراقي",
    alalla: "على الله",
    pants: "سروال"
};

const getStatusLabel = (status) => {
    const statusLabels = {
        pending: 'قيد الانتظار',
        in_progress: 'قيد التنفيذ',
        completed: 'مكتمل',
        delivered: 'تم التسليم',
    };
    return statusLabels[status] || status;
};

const Order = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isEditing, setIsEditing] = useState(false);
    const [orderData, setOrderData] = useState({
        orderId: '',
        amountDue: 0,
        status: 'pending',
        items: [],
    });
    const [customerData, setCustomerData] = useState({
        id: '',
        name: '',
        phone: '',
        email: '',
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const order = await getOrder(id);
                setOrderData({
                    orderId: order._id,
                    amountDue: order.amountDue,
                    status: order.status,
                    items: order.items,
                });
                setCustomerData({
                    id: order.customer._id,
                    name: order.customer.name,
                    measurements: order.customer.measurements
                });
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };
        fetchOrder();
    }, [id, refreshTrigger]);

    const handleOrderChange = (e) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...orderData.items];
        updatedItems[index][field] = value;
        setOrderData((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const handleSave = async () => {
        try {
            const updatedOrder = {
                ...orderData,
                _id: orderData.orderId,
                customer: {
                    _id: customerData.id,
                    name: customerData.name,
                },
            };
            await updateOrder(id, updatedOrder);
            setRefreshTrigger(prev => prev + 1)
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrder(id);
            navigate('/');
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleAddItem = () => {
        setOrderData((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    type: 'jalabya',
                    count: 1,
                    fabric: '',
                    notes: '',
                    status: 'pending',
                },
            ],
        }));
    };

    const handleRemoveItem = (index) => {
        const updatedItems = orderData.items.filter((_, i) => i !== index);
        setOrderData((prev) => ({
            ...prev,
            items: updatedItems,
        }));
    };

    const renderMeasurements = (itemType) => {
        const measurements = customerData.measurements[itemType];
        if (!measurements) return null;

        switch (itemType) {
            case 'jalabya':
            case 'aragi':
                return (
                    <Grid container spacing={1}>
                        <Grid item xs={6}><Typography variant="body2">الطول: {measurements.length || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الأكتاف: {measurements.shouldersWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">طول الكم: {measurements.sleeveLength || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الكم العلوي: {measurements.upperSleeveWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الكم السفلي: {measurements.lowerSleeveWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">الجوانب العلوية: {measurements.upperSides || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">الجوانب السفلية: {measurements.lowerSides || '-'}</Typography></Grid>
                        <Grid item xs={12}><Typography variant="body2">ملاحظات: {measurements.notes || '-'}</Typography></Grid>
                    </Grid>
                );
            case 'pants':
                return (
                    <Grid container spacing={1}>
                        <Grid item xs={6}><Typography variant="body2">طول السروال: {measurements.pantsLength || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض السروال: {measurements.pantsWidth || '-'}</Typography></Grid>
                        <Grid item xs={12}><Typography variant="body2">ملاحظات: {measurements.notes || '-'}</Typography></Grid>
                    </Grid>
                );
            case 'alalla':
                return (
                    <Grid container spacing={1}>
                        <Grid item xs={6}><Typography variant="body2">الطول: {measurements.length || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الأكتاف: {measurements.shouldersWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">طول الكم: {measurements.sleeveLength || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الكم العلوي: {measurements.upperSleeveWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض الكم السفلي: {measurements.lowerSleeveWidth || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">الجوانب العلوية: {measurements.upperSides || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">الجوانب السفلية: {measurements.lowerSides || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">طول السروال: {measurements.pantsLength || '-'}</Typography></Grid>
                        <Grid item xs={6}><Typography variant="body2">عرض السروال: {measurements.pantsWidth || '-'}</Typography></Grid>
                        <Grid item xs={12}><Typography variant="body2">ملاحظات: {measurements.notes || '-'}</Typography></Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box sx={{ p: 2, direction: 'rtl' }}>
            {/* Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <IconButton
                    onClick={() => navigate(location.state?.returnTo || -1, {
                        state: { modalState: location.state?.modalState, openModal: true }
                    })}
                    sx={{
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' },
                        p: 0.5
                    }}
                >
                    <ArrowForwardIcon fontSize="small" />
                </IconButton>
                <Typography variant="body1" fontWeight="bold">
                    الرجوع
                </Typography>
            </Box>

            <Paper elevation={2} sx={{ p: 2, borderRadius: 1 }}>
                <Stack spacing={2}>
                    {/* Customer Information Section as Accordion */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                معلومات العميل
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1, alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">رقم العميل:</Typography>
                                <Typography variant="body2" fontWeight="medium">{customerData.id}</Typography>
                                <Typography variant="body2" color="text.secondary">اسم العميل:</Typography>
                                <Typography variant="body2" fontWeight="medium">{customerData.name}</Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                onClick={() => navigate(`/customers/${customerData.id}`)}
                                sx={{ mt: 1, fontSize: '0.75rem', py: 0.5 }}
                            >
                                عرض بيانات العميل
                            </Button>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{ my: 1 }} />

                    {/* Order Information Section as Accordion */}
                    <Accordion defaultExpanded>
                        <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                            <Typography variant="body1" fontWeight="bold" color="primary">
                                معلومات الطلب
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 1, alignItems: 'center' }}>
                                <Typography variant="body2" color="text.secondary">رقم الطلب:</Typography>
                                <Typography variant="body2" fontWeight="medium">{orderData.orderId}</Typography>
                                <Typography variant="body2" color="text.secondary">المبلغ المستحق:</Typography>
                                {isEditing ? (
                                    <TextField
                                        name="amountDue"
                                        value={orderData.amountDue}
                                        onChange={handleOrderChange}
                                        type="number"
                                        size="small"
                                        fullWidth
                                    />
                                ) : (
                                    <Typography variant="body2" fontWeight="medium">{orderData.amountDue}</Typography>
                                )}
                                <Typography variant="body2" color="text.secondary">حالة الطلب:</Typography>
                                {isEditing ? (
                                    <FormControl fullWidth size="small">
                                        <Select
                                            name="status"
                                            value={orderData.status}
                                            onChange={handleOrderChange}
                                        >
                                            <MenuItem value="pending">قيد الانتظار</MenuItem>
                                            <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                                            <MenuItem value="completed">مكتمل</MenuItem>
                                            <MenuItem value="delivered">تم التسليم</MenuItem>
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <Chip
                                        label={getStatusLabel(orderData.status)}
                                        sx={{
                                            bgcolor: getStatusColor(orderData.status),
                                            color: 'white',
                                            fontSize: '0.75rem',
                                            height: 24,
                                        }}
                                    />
                                )}
                            </Box>
                        </AccordionDetails>
                    </Accordion>

                    <Divider sx={{ my: 1 }} />

                    <Typography variant="body1" fontWeight="bold" color="primary">
                        العناصر
                    </Typography>
                    {orderData.items.map((item, index) => (
                        <Accordion key={index}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                                <Typography variant="body2" fontWeight="medium">
                                    العنصر {index + 1}: {typesTranslate[item.type]}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Paper elevation={1} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                                    <Stack spacing={1}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                {isEditing ? (
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>نوع العنصر</InputLabel>
                                                        <Select
                                                            value={item.type}
                                                            onChange={(e) => handleItemChange(index, 'type', e.target.value)}
                                                            label="نوع العنصر"
                                                        >
                                                            <MenuItem value="jalabya">جلابية</MenuItem>
                                                            <MenuItem value="aragi">عراقي</MenuItem>
                                                            <MenuItem value="alalla">على الله</MenuItem>
                                                            <MenuItem value="pants">سروال</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <TextField
                                                        label="نوع العنصر"
                                                        value={typesTranslate[item.type]}
                                                        fullWidth
                                                        size="small"
                                                        InputProps={{ readOnly: true }}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="الكمية"
                                                    value={item.count}
                                                    onChange={(e) => handleItemChange(index, 'count', e.target.value)}
                                                    disabled={!isEditing}
                                                    fullWidth
                                                    type="number"
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="القماش"
                                                    value={item.fabric}
                                                    onChange={(e) => handleItemChange(index, 'fabric', e.target.value)}
                                                    disabled={!isEditing}
                                                    fullWidth
                                                    size="small"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    label="ملاحظات"
                                                    value={item.notes}
                                                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                                                    disabled={!isEditing}
                                                    fullWidth
                                                    size="small"
                                                    multiline
                                                    rows={2}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                {isEditing ? (
                                                    <FormControl fullWidth size="small">
                                                        <InputLabel>حالة العنصر</InputLabel>
                                                        <Select
                                                            value={item.status}
                                                            onChange={(e) => handleItemChange(index, 'status', e.target.value)}
                                                            label="حالة العنصر"
                                                        >
                                                            <MenuItem value="pending">قيد الانتظار</MenuItem>
                                                            <MenuItem value="in_progress">قيد التنفيذ</MenuItem>
                                                            <MenuItem value="completed">مكتمل</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                ) : (
                                                    <Chip
                                                        label={getStatusLabel(item.status)}
                                                        sx={{
                                                            bgcolor: getStatusColor(item.status),
                                                            color: 'white',
                                                            fontSize: '0.75rem',
                                                            height: 24,
                                                        }}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>

                                        {/* Measurements Accordion */}
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="small" />}>
                                                <Typography variant="body2" fontWeight="medium">
                                                    قياسات العميل
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {renderMeasurements(item.type)}
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    onClick={() => navigate(`/customers/${customerData.id}`)}
                                                    sx={{ mt: 1, fontSize: '0.75rem', py: 0.5 }}
                                                >
                                                    تعديل
                                                </Button>
                                            </AccordionDetails>
                                        </Accordion>

                                        {isEditing && (
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleRemoveItem(index)}
                                                startIcon={<DeleteIcon fontSize="small" />}
                                                size="small"
                                            >
                                                حذف العنصر
                                            </Button>
                                        )}
                                    </Stack>
                                </Paper>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                    {isEditing && (
                        <Button
                            variant="contained"
                            onClick={handleAddItem}
                            size="small"
                            sx={{ mt: 1 }}
                        >
                            إضافة عنصر
                        </Button>
                    )}

                    {/* Action Buttons */}
                    <Grid container spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
                        {!isEditing ? (
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon fontSize="small" />}
                                        onClick={() => setIsEditing(true)}
                                        size="small"
                                    >
                                        تعديل
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon fontSize="small" />}
                                        onClick={handleDelete}
                                        size="small"
                                    >
                                        حذف
                                    </Button>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<SaveIcon fontSize="small" />}
                                        onClick={handleSave}
                                        size="small"
                                    >
                                        حفظ
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                        size="small"
                                    >
                                        إلغاء
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Order;