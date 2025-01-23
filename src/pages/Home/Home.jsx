import { useState } from 'react';
import { Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import Navbar from '../../components/Navbar';
import CustomersTable from '../../components/CustomersTable';
import UsersTable from '../../components/UsersTables';
import CustomerDetailModal from '../../components/CustomersDetailModal';
import UserDetailModal from '../../components/UserDetailModal';
import AddUserModal from '../../components/AddUserModal';
import AddCustomerModal from '../../components/AddCustomerModal';
import { createCustomer, deleteCustomer, updateCustomer } from '../../api/customers.api';
import { createAccount, deleteAccount, updateAccount } from '../../api/users.api';

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
    const [message, setMessage] = useState({ type: '', text: '' }); // For success/error messages

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

    const handleUserSave = async (updatedUser) => {
        try {
            setLoading(true);
            await updateAccount(updatedUser);
            setMessage({ type: 'success', text: 'تم تحديث المستخدم بنجاح' });
            setIsUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            setMessage({ type: 'error', text: 'فشل تحديث المستخدم' });
            setLoading(false);
        }
    };

    const handleCustomerSave = async (updatedCustomer) => {
        try {
            setLoading(true);
            await updateCustomer(updatedCustomer);
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
            setMessage({ type: 'error', text: 'فشل إضافة المستخدم' });
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
        <Box sx={{ flexGrow: 1 }}>
            <Navbar />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="العملاء" />
                    <Tab label="المستخدمين" />
                </Tabs>
            </Box>
            <Box sx={{ mt: 2 }}>
                {activeTab === 0 ? (
                    <CustomersTable
                        onViewDetails={handleCustomerDetails}
                        onAddNew={handleCustomerAddNew}
                        setLoading={setLoading}
                        setMessage={setMessage}
                        refreshTrigger={refreshTrigger}
                    />
                ) : (
                    <UsersTable
                        onViewDetails={handleUserDetails}
                        onAddNew={handleUserAddNew}
                        setLoading={setLoading}
                        setMessage={setMessage}
                        refreshTrigger={refreshTrigger}
                    />
                )}
            </Box>
            {selectedUser && (
                <UserDetailModal
                    open={isUserModalOpen}
                    onClose={() => setIsUserModalOpen(false)}
                    user={selectedUser}
                    onSave={handleUserSave}
                    onDelete={handleUserDelete}
                    loading={loading}
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
                />
            )}

            <AddUserModal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}
                onSave={handleAddUserSave}
                loading={loading}
            />

            <AddCustomerModal
                open={isAddCustomerModalOpen}
                onClose={() => setIsAddCustomerModalOpen(false)}
                onSave={handleAddCustomerSave}
                loading={loading}
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