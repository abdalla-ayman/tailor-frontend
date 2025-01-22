import { useEffect, useState } from 'react';
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
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getCustomers } from '../api/customers.api';


const CustomersTable = ({ onViewDetails, onAddNew, refreshTrigger }) => {
    const [searchField, setSearchField] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [customers, setCustomers] = useState([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [loading, setLoading] = useState(false);
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
        } finally {
            setLoading(false);
        }
    }, [page, rowsPerPage, searchField, searchQuery, refreshTrigger]);

    const searchFields = [
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

    return (
        <Box sx={{ width: '100%', direction: 'rtl' }}>
            {/* Add Customer Button */}
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                    size="small"
                >
                    إضافة عميل جديد
                </Button>
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
                            <TableRow key={customer.id}>
                                <TableCell align="right">{customer.id}</TableCell>
                                <TableCell align="right">{customer.name}</TableCell>
                                <TableCell align="right">{customer.phone}</TableCell>
                                <TableCell align="right">{customer.residence}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => onViewDetails(customer)}
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