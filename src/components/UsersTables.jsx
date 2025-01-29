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
    TablePagination,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { getAccounts } from '../api/users.api';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const UsersTable = ({ onViewDetails, onAddNew, refreshTrigger, setLoading, setMessage }) => {
    const [searchField, setSearchField] = useState('name');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSuperAdminFilter, setIsSuperAdminFilter] = useState('all'); // 'all', 'true', 'false'
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getAccounts({
                    page: page + 1, // API expects page to start from 1
                    rowsPerPage,
                    searchField,
                    searchQuery,
                    isSuperAdmin: isSuperAdminFilter === 'all' ? undefined : isSuperAdminFilter === 'true' // Send `true` or `false` or `undefined`
                });
                setUsers(data.accounts);
                setTotalUsers(data.totalAccounts);
            } catch (error) {
                console.error("Error fetching users:", error);
                setMessage({ type: 'error', text: 'حدث خطأ أثناء جلب البيانات' });
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, rowsPerPage, searchField, searchQuery, isSuperAdminFilter, refreshTrigger, setLoading, setMessage]);

    useEffect(() => {
        if (!user?.isSuperAdmin) {
            navigate('/home');
        }
    }, [user])


    const searchFields = [
        { value: '_id', label: 'الرقم المعرف' },
        { value: 'name', label: 'الاسم' },
        { value: 'username', label: 'اسم المستخدم' },
    ];

    const superAdminFilterOptions = [
        { value: 'all', label: 'عرض الكل' },
        { value: 'true', label: ' المشرفين الرئيسيين فقط' },
        { value: 'false', label: 'استبعاد المشرفين الرئيسيين' },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    return (
        <Box sx={{ width: '100%', direction: 'rtl' }}>
            {/* Add User Button */}
            {user?.isSuperAdmin && (
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
            )}


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
                <TextField
                    select
                    label="فلتر المشرفين الرئيسيين"
                    value={isSuperAdminFilter}
                    onChange={(e) => setIsSuperAdminFilter(e.target.value)}
                    size="small"
                    fullWidth
                >
                    {superAdminFilterOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
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
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell align="right">{user._id}</TableCell>
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
                    count={totalUsers}
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

export default UsersTable;