// src/api/customers.api.js
import apiClient from "../services/apiClient";

export const getCustomers = async (params) => {
  try {
    const response = await apiClient.get("/customers", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const createCustomer = async (customerData) => {
  try {
    const response = await apiClient.post("/customers", customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id, customerData) => {
  try {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await apiClient.delete(`/customers/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

// Export Customers to Excel
export const exportCustomersToExcel = async () => {
  try {
    const response = await apiClient.get("/customers/export", {
      responseType: "blob", // Important for handling binary data (Excel file)
    });
    return response;
  } catch (error) {
    console.error("Error exporting customers:", error);
    throw error;
  }
};

// Import Customers from Excel
export const importCustomersFromExcel = async (formData) => {
  try {
    const response = await apiClient.post("/customers/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    });
    return response;
  } catch (error) {
    console.error("Error importing customers:", error);
    throw error;
  }
};
