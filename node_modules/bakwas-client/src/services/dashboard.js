import api from "../api.js";

export async function getHostOverview() {
  const response = await api.get("/host/overview");
  return response.data;
}

export async function getHostListings() {
  const response = await api.get("/host/listings");
  return response.data;
}

export async function getHostBookings() {
  const response = await api.get("/host/bookings");
  return response.data;
}

export async function getAdminOverview() {
  const response = await api.get("/admin/overview");
  return response.data;
}

export async function getAdminApprovals() {
  const response = await api.get("/admin/approvals");
  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get("/admin/users");
  return response.data;
}
