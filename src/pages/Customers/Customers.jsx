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
    Tabs,
    Tab,
    Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getCustomerById, updateCustomer, deleteCustomer } from '../../api/customers.api';

const Customer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation()
    const [isEditing, setIsEditing] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [customerData, setCustomerData] = useState({
        name: '',
        phone: [],
        residence: '',
        measurements: {
            jalabya: {},
            aragi: {},
            pants: {},
            alalla: {},
        },
    });

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const customer = await getCustomerById(id);
                setCustomerData(customer);
            } catch (error) {
                console.error('خطأ في جلب بيانات العميل:', error);
            }
        };
        fetchCustomer();
    }, [id]);

    useEffect(() => {
        console.log("Location state on second page:", location.state);
    }, [location]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        const phoneNumbers = value.split(',').map(number => number.trim());
        setCustomerData((prev) => ({
            ...prev,
            phone: phoneNumbers,
        }));
    };

    const handleMeasurementChange = (dressType, field, value) => {
        setCustomerData((prev) => ({
            ...prev,
            measurements: {
                ...prev.measurements,
                [dressType]: {
                    ...prev.measurements[dressType],
                    [field]: value,
                },
            },
        }));
    };

    const handleSave = async () => {
        try {
            await updateCustomer(id, customerData);
            setIsEditing(false);
        } catch (error) {
            console.error('خطأ في تحديث بيانات العميل:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCustomer(id);
            navigate('/');
        } catch (error) {
            console.error('خطأ في حذف العميل:', error);
        }
    };

    const measurementFields = {
        jalabya: [
            'length',
            'shouldersWidth',
            'upperSleeveWidth',
            'lowerSleeveWidth',
            'sleeveLength',
            'upperSides',
            'lowerSides',
            'notes',
        ],
        aragi: [
            'length',
            'shouldersWidth',
            'upperSleeveWidth',
            'lowerSleeveWidth',
            'sleeveLength',
            'upperSides',
            'lowerSides',
            'notes',
        ],
        pants: [
            'pantsLength',
            'pantsWidth',
            'notes',
        ],
        alalla: [
            'length',
            'shouldersWidth',
            'upperSleeveWidth',
            'lowerSleeveWidth',
            'sleeveLength',
            'upperSides',
            'lowerSides',
            'pantsLength',
            'pantsWidth',
            'notes',
        ],
    }

    const measurementLabels = {
        length: 'الطول',
        shouldersWidth: 'عرض الكتف',
        upperSleeveWidth: 'عرض الكم العلوي',
        lowerSleeveWidth: 'عرض الكم السفلي',
        sleeveLength: 'طول الكم',
        pantsLength: 'طول السروال',
        pantsWidth: 'عرض السروال',
        upperSides: 'الجنبات العلوية',
        lowerSides: 'الحنبات السفلية',
        notes: 'ملاحظات',
    };

    const typesLabels = {
        jalabya: 'الجلابية',
        aragi: 'العراقي',
        pants: 'السروال',
        alalla: 'العلى الله'
    };

    return (
        <Box sx={{ p: 4, direction: 'rtl' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <IconButton
                    onClick={() => {
                        if (location.state) {
                            navigate(location.state?.returnTo || -1, {
                                state: { modalState: location.state?.modalState, openModal: true }
                            })
                        }
                        else navigate(-1)
                    }}
                    sx={{
                        bgcolor: 'action.hover',
                        '&:hover': { bgcolor: 'action.selected' }
                    }}
                >
                    <ArrowForwardIcon />
                </IconButton>
                <Typography variant="h5" fontWeight="bold">
                    الرجوع
                </Typography>
            </Box>

            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Stack spacing={3}>
                    <TextField
                        label="الاسم"
                        name="name"
                        value={customerData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                    />
                    <TextField
                        label="رقم الهاتف"
                        name="phone"
                        value={customerData.phone.join(', ')}
                        onChange={handlePhoneChange}
                        disabled={!isEditing}
                        fullWidth
                    />
                    <TextField
                        label="مكان الإقامة"
                        name="residence"
                        value={customerData.residence}
                        onChange={handleChange}
                        disabled={!isEditing}
                        fullWidth
                    />

                    <Tabs
                        value={tabIndex}
                        onChange={(e, newIndex) => setTabIndex(newIndex)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{ mb: 2 }}
                    >
                        {Object.keys(typesLabels).map((key) => (
                            <Tab key={key} label={typesLabels[key]} />
                        ))}
                    </Tabs>

                    {Object.keys(customerData.measurements).map((dressType, index) => (
                        tabIndex === index && (
                            <Box key={dressType} sx={{ mt: 2 }}>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                    قياسات {typesLabels[dressType]}
                                </Typography>
                                <Stack spacing={2}>
                                    {measurementFields[dressType].map((field) => (
                                        <TextField
                                            key={field}
                                            label={measurementLabels[field] || field}
                                            value={customerData.measurements[dressType][field]}
                                            onChange={(e) => handleMeasurementChange(dressType, field, e.target.value)}
                                            disabled={!isEditing}
                                            fullWidth
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )
                    ))}

                    <Grid container spacing={2} sx={{ mt: 3, justifyContent: 'center' }}>
                        {!isEditing ? (
                            <>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditing(true)}
                                        size='medium'
                                    >
                                        تعديل
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleDelete}
                                        size='medium'
                                    >
                                        حذف
                                    </Button>
                                </Grid>
                            </>
                        ) : (
                            <>
                                <Grid item>
                                    <Button
                                        size='medium'
                                        variant="contained"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSave}
                                    >
                                        حفظ
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        size='medium'

                                        variant="outlined"
                                        onClick={() => setIsEditing(false)}
                                    >
                                        إلغاء
                                    </Button>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Stack>
            </Paper>
        </Box >
    );
};

export default Customer;