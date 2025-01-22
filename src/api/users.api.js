// src/api/accounts.api.js
import apiClient from "../services/apiClient";

export const getAccounts = async (params) => {
  try {
    const response = await apiClient.get("/accounts", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching accounts:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await apiClient.get("/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createAccount = async (accountData) => {
  try {
    const response = await apiClient.post("/accounts", accountData);
    return response.data;
  } catch (error) {
    console.error("Error creating account:", error);
    throw error;
  }
};

export const updateAccount = async (id, accountData) => {
  try {
    const response = await apiClient.patch(`/accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    console.error("Error updating account:", error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await apiClient.delete(`/accounts/${id}`);
    localStorage.removeItem("auth");
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    localStorage.setItem("auth", response.data.token);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
