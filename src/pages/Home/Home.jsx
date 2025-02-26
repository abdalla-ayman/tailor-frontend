import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    Container,
    Paper,
    useMediaQuery,
} from '@mui/material';
import Navbar from '../../components/Navbar';
import OrdersTable from '../../components/OrdersTable';
import CustomersTable from '../../components/CustomersTable';
import UsersTable from '../../components/UsersTables';
import UserDetailModal from '../../components/UserDetailModal';
import AddUserModal from '../../components/AddUserModal';
import AddCustomerModal from '../../components/AddCustomerModal';
import AddOrderModal from '../../components/AddOrderModal';
import { useUser } from '../../contexts/UserContext';
import { createCustomer } from '../../api/customers.api';
import { updateAccount, deleteAccount, createAccount } from '../../api/users.api';
import { createOrder } from '../../api/orders.api';

const Home = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });

    const location = useLocation();
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const { user } = useUser();

    useEffect(() => {
        if (location.state?.openModal) {
            setIsAddOrderModalOpen(true);
        }
    }, [location]);

    const refreshData = useCallback(() => {
        setRefreshTrigger((prev) => prev + 1);
    }, []);

    const handleCloseMessage = useCallback(() => {
        setMessage({ type: '', text: '' });
    }, []);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleUserSave = async (id, updatedUser) => {
        try {
            setLoading(true);
            await updateAccount(id, updatedUser);
            setMessage({ type: 'success', text: 'تم تحديث المستخدم بنجاح' });
            setIsUserModalOpen(false);
            refreshData();
        } catch (error) {
            if (error.response?.data?.error?.code === 11000) {
                setMessage({ type: 'error', text: 'اسم المستخدم موجود مسبقاً' });
            } else {
                setMessage({ type: 'error', text: 'فشل تحديث المستخدم' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUserDelete = async (userId) => {
        try {
            setLoading(true);
            await deleteAccount(userId);
            setMessage({ type: 'success', text: 'تم حذف المستخدم بنجاح' });
            setIsUserModalOpen(false);
            refreshData();
        } catch (error) {
            console.error('Error deleting user:', error);
            setMessage({ type: 'error', text: 'فشل حذف المستخدم' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddUserSave = async (newUser) => {
        try {
            setLoading(true);
            await createAccount(newUser);
            setMessage({ type: 'success', text: 'تم إضافة المستخدم بنجاح' });
            setIsAddUserModalOpen(false);
            refreshData();
        } catch (error) {
            console.error('Error adding user:', error);
            if (error.response?.data?.error?.code === 11000) {
                setMessage({ type: 'error', text: 'اسم المستخدم موجود مسبقاً' });
            } else {
                setMessage({ type: 'error', text: 'فشل إضافة المستخدم' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddOrderSave = async (order) => {
        try {
            setLoading(true);
            await createOrder(order);
            setMessage({ type: 'success', text: 'تم إضافة الطلب بنجاح' });
            setIsAddOrderModalOpen(false);
            refreshData();
        } catch (error) {
            console.error('Error adding order:', error);
            setMessage({ type: 'error', text: 'فشل إضافة الطلب' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddCustomerSave = async (newCustomer) => {
        try {
            setLoading(true);
            await createCustomer(newCustomer);
            setMessage({ type: 'success', text: 'تم إضافة العميل بنجاح' });
            setIsAddCustomerModalOpen(false);
            refreshData();
        } catch (error) {
            console.error('Error adding customer:', error);
            setMessage({ type: 'error', text: 'فشل إضافة العميل' });
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = useCallback(
        (modalSetter) => {
            modalSetter(false);
            refreshData();
        },
        [refreshData]
    );

    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
    }, []);

    const openAddNewModal = () => {
        switch (activeTab) {
            case 0:
                setIsAddOrderModalOpen(true);
                break;
            case 1:
                setIsAddCustomerModalOpen(true);
                break;
            case 2:
                setIsAddUserModalOpen(true);
                break;
            default:
                break;
        }
    };

    const renderActiveTab = () => {
        switch (activeTab) {
            case 0:
                return (
                    <OrdersTable
                        refreshTrigger={refreshTrigger}
                        isMobile={isMobile}
                        onError={(error) => showMessage('error', error)}
                        onSuccess={(message) => showMessage('success', message)}
                        setLoading={setLoading}
                        onAddNew={openAddNewModal}
                    />
                );
            case 1:
                return (
                    <CustomersTable
                        refreshTrigger={refreshTrigger}
                        isMobile={isMobile}
                        onError={(error) => showMessage('error', error)}
                        onSuccess={(message) => showMessage('success', message)}
                        setLoading={setLoading}
                        onAddNew={openAddNewModal}
                    />
                );
            case 2:
                return user.isSuperAdmin ? (
                    <UsersTable
                        onViewDetails={(user) => {
                            setSelectedUser(user);
                            setIsUserModalOpen(true);
                        }}
                        refreshTrigger={refreshTrigger}
                        isMobile={isMobile}
                        onError={(error) => showMessage('error', error)}
                        onSuccess={(message) => showMessage('success', message)}
                        setLoading={setLoading}
                        onAddNew={openAddNewModal}
                    />
                ) : null;
            default:
                return null;
        }
    };

    const renderedTab = useMemo(() => renderActiveTab(), [activeTab, refreshTrigger, isMobile, user.isSuperAdmin]);

    return (
        <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Navbar />
            <Container
                maxWidth={isMobile ? 'xs' : 'lg'} // Smaller container on mobile
                sx={{ mt: isMobile ? 1 : 2, p: isMobile ? 1 : 2 }}
            >
                <Paper elevation={2} sx={{ p: isMobile ? 1 : 2, borderRadius: 1 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                            value={activeTab}
                            onChange={handleTabChange}
                            variant={isMobile ? 'scrollable' : 'fullWidth'}
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            aria-label="navigation tabs"
                            sx={{
                                '& .MuiTab-root': {
                                    fontSize: isMobile ? '0.8rem' : '1rem', // Smaller font on mobile
                                    minHeight: isMobile ? 40 : 48, // Reduced height on mobile
                                    padding: isMobile ? '6px 12px' : '12px 16px', // Adjusted padding
                                },
                            }}
                        >
                            <Tab label="الطلبات" />
                            <Tab label="العملاء" />
                            {user.isSuperAdmin && <Tab label="المستخدمين" />}
                        </Tabs>
                    </Box>

                    <Box sx={{ mt: isMobile ? 1 : 2 }}>{renderedTab}</Box>
                </Paper>
            </Container>

            {selectedUser && (
                <UserDetailModal
                    open={isUserModalOpen}
                    onClose={() => handleModalClose(setIsUserModalOpen)}
                    user={selectedUser}
                    loading={loading}
                    isMobile={isMobile}
                    onError={(error) => showMessage('error', error)}
                    onSuccess={(message) => showMessage('success', message)}
                    onSave={handleUserSave}
                    onDelete={handleUserDelete}
                />
            )}

            <AddOrderModal
                open={isAddOrderModalOpen}
                onClose={() => handleModalClose(setIsAddOrderModalOpen)}
                loading={loading}
                isMobile={isMobile}
                onError={(error) => showMessage('error', error)}
                onSuccess={(message) => showMessage('success', message)}
                onSave={handleAddOrderSave}
            />

            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => handleModalClose(setIsAddUserModalOpen)}
                loading={loading}
                isMobile={isMobile}
                onError={(error) => showMessage('error', error)}
                onSuccess={(message) => showMessage('success', message)}
                onSave={handleAddUserSave}
            />

            <AddCustomerModal
                open={isAddCustomerModalOpen}
                onClose={() => handleModalClose(setIsAddCustomerModalOpen)}
                loading={loading}
                isMobile={isMobile}
                onError={(error) => showMessage('error', error)}
                onSuccess={(message) => showMessage('success', message)}
                onSave={handleAddCustomerSave}
            />

            <Snackbar
                open={!!message.text}
                autoHideDuration={6000}
                onClose={handleCloseMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseMessage}
                    severity={message.type || 'info'}
                    sx={{ width: isMobile ? '90%' : '100%' }} // Wider on mobile for readability
                    elevation={6}
                >
                    {message.text}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Home;