import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { getCustomers, exportCustomersToExcel } from '../api/customers.api';
import { useUser } from '../contexts/UserContext';

const CustomersTable = ({ onAddNew, refreshTrigger, setLoading, onError, onSuccess }) => {
    const [searchField, setSearchField] = useState('_id');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [customers, setCustomers] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        try {
            setLoading(true);
            getCustomers({
                page: page + 1,
                rowsPerPage,
                searchField,
                searchQuery
            }).then((data) => {
                setCustomers(data.customers);
                setTotalCustomers(data.totalCustomers);
            });
        } catch (error) {
            console.error("Error fetching customers:", error);
            onError('حدث خطأ أثناء جلب البيانات');
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchField, searchQuery, refreshTrigger, setLoading]);

    const searchFields = [
        { value: '_id', label: 'الرقم المعرف' },
        { value: 'name', label: 'الاسم' },
        { value: 'phone', label: 'رقم الهاتف' },
        { value: 'residence', label: 'مكان الإقامة' },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Format phone numbers with each number on a new line
    const formatPhoneNumbersWithNewLine = (phones) => {
        return phones.map((phone, index) => (
            <div key={index}>{phone}</div>
        ));
    };

    // Handle Export to Excel
    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await exportCustomersToExcel();
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `customers_${new Date().toISOString()}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            onSuccess('تم تصدير البيانات بنجاح');
        } catch (error) {
            console.error("Error exporting customers:", error);
            onError('فشل تصدير البيانات');
        } finally {
            setIsExporting(false);
        }
    };

    // Replace the "More" button with a link to the details page
    const handleViewDetails = (customerId) => {
        navigate(`/customers/${customerId}`);
    };

    return (
        <Box sx={{ width: '100%', direction: 'rtl' }}>
            {/* Action Buttons */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                    size="small"
                >
                    إضافة عميل جديد
                </Button>
                {
                    user.isSuperAdmin && (
                        <>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<ImportExportIcon />}
                                onClick={handleExport}
                                size="small"
                                disabled={isExporting}
                            >
                                {isExporting ? <CircularProgress size={20} /> : 'تصدير إلى Excel'}
                            </Button>

                        </>)
                }

            </Box>

            {/* Search Controls */}
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
            </Stack>

            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    maxWidth: '100%',
                    overflow: 'auto'
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>المعرف</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>الاسم</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>رقم الهاتف</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>مكان الإقامة</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.map((customer) => (
                            <TableRow key={customer._id}>
                                <TableCell align="right">{customer._id}</TableCell>
                                <TableCell align="right">{customer.name}</TableCell>
                                <TableCell align="right">
                                    {formatPhoneNumbersWithNewLine(customer.phone)}
                                </TableCell>
                                <TableCell align="right">{customer.residence}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => handleViewDetails(customer._id)}
                                        sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                                    >
                                        المزيد
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalCustomers}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="عدد الصفوف:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
                    sx={{
                        direction: 'ltr',
                        '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                            direction: 'rtl'
                        }
                    }}
                />
            </TableContainer>
        </Box>
    );
};

export default CustomersTable;