import { API } from "../config/index.";

export const GetPlans = async () => {
  const response = await API.get("/plans");
  return response?.data?.data;
};

export const GetTransactions = async () => {
  const response = await API.get("/transactions/user");
  return response?.data?.data;
};
export const GetUserWallet = async () => {
  const response = await API.get("/wallets/user");
  return response?.data?.data;
};
export const GetWalletsByUserId = async (id) => {
  const response = await API.get(`wallets/user/${id}`);
  return response?.data?.data;
};
export const SubmitPaymentApi = async (data) => {
  const response = await API.post(`/wallets/fund`, data);
  return response?.data;
};
export const overviewAnalyticsApi = async () => {
  const response = await API.get(`/users/overview`);
  return response?.data?.data;
};
export const GetPaymentMethods = async () => {
  const response = await API.get(`/transactions/payment-methods`);
  return response?.data?.data;
};
export const WithdrawalApi = async (data) => {
  const response = await API.post(`/wallets/withdraw`, data);
  return response?.data;
};

export const InvestmentApi = async (data) => {
  const response = await API.post("/investments/user/create", data);
  return response?.data;
};
export const GetInvestmentApi = async () => {
  const response = await API.get("/investments/user");
  return response?.data?.data;
};
