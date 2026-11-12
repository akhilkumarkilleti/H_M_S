import api from "./axiosConfig";

export const getMyBillingInvoices = async () =>
  (await api.get("/billing/invoices/my")).data;

export const getBillingCatalog = async () =>
  (await api.get("/billing/invoices/catalog")).data;

export const getHospitalPaymentInvoices = async () =>
  (await api.get("/billing/invoices/hospital-payments")).data;

export const markHospitalInvoicePaid = async (invoiceId) =>
  (await api.post(`/billing/invoices/${invoiceId}/mark-hospital-paid`, {})).data;

export const createRazorpayOrder = async (invoiceId) =>
  (await api.post(`/billing/invoices/${invoiceId}/razorpay-order`, {})).data;

export const verifyRazorpayPayment = async (invoiceId, payment) =>
  (await api.post(`/billing/invoices/${invoiceId}/verify`, {
    orderId: payment.razorpay_order_id,
    paymentId: payment.razorpay_payment_id,
    signature: payment.razorpay_signature,
  })).data;

export const selectPayAtHospital = async (invoiceId) =>
  (await api.post(`/billing/invoices/${invoiceId}/pay-at-hospital`, {})).data;
