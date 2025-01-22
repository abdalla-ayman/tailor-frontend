import { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import { Tabs, Tab } from '@mui/material';
import CustomersTable from '../../components/CustomersTable';
import UsersTable from '../../components/UsersTables';
import CustomerDetailModal from '../../components/CustomersDetailModal';
import UserDetailModal from '../../components/UserDetailModal';
import { addCustomer, deleteCustomer, updateCustomer } from '../../api/customers.api';
import { addUser, deleteUser, updateUser } from '../../api/users.api';

const Home = () => {
    const [activeTab, setActiveTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

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
            await updateUser(updatedUser);
            setIsUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error updating user:", error);
            setLoading(false);
        }
    };

    const handleCustomerSave = async (updatedCustomer) => {
        try {
            setLoading(true);
            await updateCustomer(updatedCustomer);
            setIsCustomerModalOpen(false);
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error updating customer:", error);
            setLoading(false);
        }
    };

    const handleUserDelete = async (userId) => {
        try {
            setLoading(true);
            await deleteUser(userId);
            setIsUserModalOpen(false);
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error deleting user:", error);
            setLoading(false);
        }
    };

    const handleCustomerDelete = async (customerId) => {
        try {
            setLoading(true);
            await deleteCustomer(customerId);
            setIsCustomerModalOpen(false);
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error deleting customer:", error);
            setLoading(false);
        }
    };

    const handleCustomerAddNew = async () => {
        try {
            setLoading(true);
            await addCustomer();
            setLoading(false);
            refreshCustomers();
        } catch (error) {
            console.error("Error adding customer:", error);
            setLoading(false);
        }
    };

    const handleUserAddNew = async () => {
        try {
            setLoading(true);
            await addUser();
            setLoading(false);
            refreshUsers();
        } catch (error) {
            console.error("Error adding user:", error);
            setLoading(false);
        }
    };

    const refreshCustomers = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const refreshUsers = () => {
        setRefreshTrigger(prev => prev + 1);
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
                        loading={loading}
                        refreshTrigger={refreshTrigger}
                    />
                ) : (
                    <UsersTable
                        onViewDetails={handleUserDetails}
                        onAddNew={handleUserAddNew}
                        loading={loading}
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
                />
            )}

            {selectedCustomer && (
                <CustomerDetailModal
                    open={isCustomerModalOpen}
                    onClose={() => setIsCustomerModalOpen(false)}
                    customer={selectedCustomer}
                    onSave={handleCustomerSave}
                    onDelete={handleCustomerDelete}
                />
            )}
        </Box>
    );
};

export default Home;
