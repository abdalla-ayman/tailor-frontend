import { useState, useEffect } from 'react';
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
    Chip,
    InputAdornment,
    Stack,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAccounts } from '../api/users.api';

const UsersTable = ({ onViewDetails, onAddNew, refreshTrigger, setLoading, setMessage }) => {
    const [searchField, setSearchField] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        try {
            setLoading(true);
            getAccounts({ page: page + 1, rowsPerPage, searchField, searchQuery }).then((data) => {
                setUsers(data.users);
                setTotalUsers(data.totalUsers);
            });
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
            setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب البيانات' });
        }
    }, [page, rowsPerPage, searchField, searchQuery, refreshTrigger, setLoading]);


    const searchFields = [
        { value: 'name', label: 'الاسم' },
        { value: 'isSuperAdmin', label: 'مشرف رئيسي' },
    ];

    const filterUsers = () => {
        return users.filter(user =>
            String(user[searchField])
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredUsers = filterUsers();
    const paginatedUsers = filteredUsers.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ width: '100%', direction: 'rtl' }}>
            {/* Add User Button */}
            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={onAddNew}
                    size="small"
                >
                    إضافة مستخدم جديد
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
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>الرقم التعريفي</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>الاسم</TableCell>
                            <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>مشرف رئيسي</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell align="right">{user.id}</TableCell>
                                <TableCell align="right">{user.name}</TableCell>
                                <TableCell align="right">
                                    <Chip
                                        label={user.isSuperAdmin ? 'نعم' : 'لا'}
                                        color={user.isSuperAdmin ? 'primary' : 'default'}
                                        size="small"
                                        sx={{ minWidth: '50px' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => onViewDetails(user)}
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
                    count={totalUsers}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage="عدد المستخدمين:"
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

export default UsersTable;