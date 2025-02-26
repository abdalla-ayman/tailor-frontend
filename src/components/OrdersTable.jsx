import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Button,
    InputAdornment,
    Stack,
    TablePagination,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getOrders } from '../api/orders.api';

const statusOptions = [
    { value: '', label: 'الكل' },
    { value: 'pending', label: 'قيد الانتظار' },
    { value: 'in_progress', label: 'قيد التنفيذ' },
    { value: 'completed', label: 'مكتمل' },
    { value: 'delivered', label: 'تم التوصيل' }
];

const statusTranslate = {
    'pending': 'قيد الانتظار',
    'in_progress': 'قيد التنفيذ',
    'completed': 'مكتمل',
    'delivered': 'تم التوصيل'
}

const OrdersTable = ({ onAddNew, refreshTrigger, setLoading, onError, onSuccess }) => {
    const [searchField, setSearchField] = useState('_id');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [orders, setOrders] = useState([]);
    const [totalOrders, setTotalOrders] = useState(0);

    const navigate = useNavigate()

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const filters = {
                    page: page + 1,
                    rowsPerPage,
                    searchField,

                    searchQuery
                };
                if (statusFilter) {
                    filters.status = statusFilter;
                }
                const data = await getOrders(filters);
                setOrders(data.orders);
                setTotalOrders(data.totalOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                onError('حدث خطأ أثناء جلب البيانات');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page, rowsPerPage, searchField, searchQuery, statusFilter, refreshTrigger, setLoading, onError]);

    const searchFields = [
        { value: '_id', label: 'رقم الطلب' },
        { value: 'customerName', label: 'اسم العميل' }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box sx={{ width: '100%', direction: 'rtl' }}>
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                    size="small"
                >
                    إضافة طلب جديد
                </Button>
            </Box>

            <Stack spacing={1.5} sx={{ mb: 2 }}>
                <TextField
                    select
                    label="حقل البحث"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                    size="small"
                    fullWidth
                >
                    {searchFields.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="بحث"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    size="small"
                    fullWidth
                />
                <TextField
                    select
                    label="حالة الطلب"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    fullWidth
                >
                    {statusOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">رقم الطلب</TableCell>
                            <TableCell align="right">اسم العميل</TableCell>
                            <TableCell align="right">حالة الطلب</TableCell>
                            <TableCell align="center">الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order._id}>
                                    <TableCell align="right">{order._id}</TableCell>
                                    <TableCell align="right">{order.customer?.name}</TableCell>
                                    <TableCell align="right">{statusTranslate[order.status]}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                        >
                                            التفاصيل
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="textSecondary">
                                        لا توجد بيانات
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalOrders}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="عدد الصفوف:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
                    sx={{ direction: 'ltr' }}
                />
            </TableContainer>
        </Box >
    );
};

export default OrdersTable;
