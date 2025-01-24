import { useState } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    Container,
    Paper,
    CircularProgress,
    useMediaQuery,
    IconButton,
    Typography,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material'; // Icon for mobile menu
import Navbar from '../../components/Navbar';
import CustomersTable from '../../components/CustomersTable';
import UsersTable from '../../components/UsersTables';
import CustomerDetailModal from '../../components/CustomersDetailModal';
import UserDetailModal from '../../components/UserDetailModal';
import AddUserModal from '../../components/AddUserModal';
import AddCustomerModal from '../../components/AddCustomerModal';
import { createCustomer, deleteCustomer, updateCustomer } from '../../api/customers.api';
import { createAccount, deleteAccount, updateAccount } from '../../api/users.api';
import { useUser } from '../../contexts/UserContext';

const Home = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });
    const isMobile = useMediaQuery('(max-width:600px)'); // Check for mobile screen size
    const { user } = useUser();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUserDetails = (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
    };

    const handleCustomerDetails = (customer) => {
        setSelectedCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    const handleUserSave = async (id, updatedUser) => {
        try {
            setLoading(true);
            await updateAccount(id, updatedUser);
            setMessage({ type: 'success', text: 'تم تحديث المستخدم بنجاح' });
            setIsUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            if (error.response?.data?.error?.code === 11000) {
                setMessage({ type: 'error', text: 'اسم المستخدم موجود مسبقاً' });
            } else {
                setMessage({ type: 'error', text: 'فشل تحديث المستخدم' });
            }
        }
        setLoading(false);
    };

    const handleCustomerSave = async (id, updatedCustomer) => {
        try {
            setLoading(true);
            await updateCustomer(id, updatedCustomer);
            setMessage({ type: 'success', text: 'تم تحديث العميل بنجاح' });
            setIsCustomerModalOpen(false);
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error updating customer:", error);
            setMessage({ type: 'error', text: 'فشل تحديث العميل' });
            setLoading(false);
        }
    };

    const handleUserDelete = async (userId) => {
        try {
            setLoading(true);
            await deleteAccount(userId);
            setMessage({ type: 'success', text: 'تم حذف المستخدم بنجاح' });
            setIsUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            setMessage({ type: 'error', text: 'فشل حذف المستخدم' });
            setLoading(false);
        }
    };

    const handleCustomerDelete = async (customerId) => {
        try {
            setLoading(true);
            await deleteCustomer(customerId);
            setMessage({ type: 'success', text: 'تم حذف العميل بنجاح' });
            setIsCustomerModalOpen(false);
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            setMessage({ type: 'error', text: 'فشل حذف العميل' });
            setLoading(false);
        }
    };

    const handleUserAddNew = () => {
        setIsAddUserModalOpen(true);
    };

    const handleCustomerAddNew = () => {
        setIsAddCustomerModalOpen(true);
    };

    const handleAddUserSave = async (newUser) => {
        try {
            setLoading(true);
            await createAccount(newUser);
            setMessage({ type: 'success', text: 'تم إضافة المستخدم بنجاح' });
            setIsAddUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            if (error.response?.data?.error?.code === 11000) {
                setMessage({ type: 'error', text: 'اسم المستخدم موجود مسبقاً' });
            } else {
                setMessage({ type: 'error', text: 'فشل إضافة المستخدم' });
            }
            setLoading(false);
        }
    };

    const handleAddCustomerSave = async (newCustomer) => {
        try {
            setLoading(true);
            await createCustomer(newCustomer);
            setMessage({ type: 'success', text: 'تم إضافة العميل بنجاح' });
            setIsAddCustomerModalOpen(false);
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error adding customer:", error);
            setMessage({ type: 'error', text: 'فشل إضافة العميل' });
            setLoading(false);
        }
    };

    const refreshCustomers = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const refreshUsers = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleCloseMessage = () => {
        setMessage({ type: '', text: '' });
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 2, p: isMobile ? 1 : 3 }}>
                <Paper elevation={3} sx={{ p: isMobile ? 1 : 3, borderRadius: 2 }}>
                    {/* Tabs Section */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant={isMobile ? 'scrollable' : 'standard'}
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                        >
                            <Tab label="العملاء" />
                            {user.isSuperAdmin && <Tab label="المستخدمين" />}
                        </Tabs>
                    </Box>

                    {/* Content Section */}
                    <Box sx={{ mt: 2 }}>
                        {activeTab === 0 ? (
                            <CustomersTable
                                onViewDetails={handleCustomerDetails}
                                onAddNew={handleCustomerAddNew}
                                setLoading={setLoading}
                                setMessage={setMessage}
                                refreshTrigger={refreshTrigger}
                                isMobile={isMobile}
                            />
                        ) : (
                            <UsersTable
                                onViewDetails={handleUserDetails}
                                onAddNew={handleUserAddNew}
                                setLoading={setLoading}
                                setMessage={setMessage}
                                refreshTrigger={refreshTrigger}
                                isMobile={isMobile}
                            />
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* Modals */}
            {selectedUser && (
                <UserDetailModal
                    open={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    user={selectedUser}
                    onSave={handleUserSave}
                    onDelete={handleUserDelete}
                    loading={loading}
                    isMobile={isMobile}
                />
            )}

            {selectedCustomer && (
                <CustomerDetailModal
                    open={isCustomerModalOpen}
                    onClose={() => setIsCustomerModalOpen(false)}
                    customer={selectedCustomer}
                    onSave={handleCustomerSave}
                    onDelete={handleCustomerDelete}
                    loading={loading}
                    isMobile={isMobile}
                />
            )}

            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSave={handleAddUserSave}
                loading={loading}
                isMobile={isMobile}
            />

            <AddCustomerModal
                open={isAddCustomerModalOpen}
                onClose={() => setIsAddCustomerModalOpen(false)}
                onSave={handleAddCustomerSave}
                loading={loading}
                isMobile={isMobile}
            />

            {/* Snackbar for Messages */}
            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseMessage}
                    severity={message.type}
                    sx={{ width: '100%' }}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;