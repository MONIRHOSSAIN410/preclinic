import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5010/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("preclinic_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      localStorage.removeItem("preclinic_token");
      localStorage.removeItem("preclinic_admin");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ---- Endpoint helpers -----------------------------------------------------

export const authApi = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  me: () => api.get("/auth/me"),
  updateMe: (data) => api.put("/auth/me", data),
};

export const dashboardApi = {
  summary: () => api.get("/dashboard/summary"),
  reports: () => api.get("/dashboard/reports"),
};

export const doctorsApi = {
  list: (params) => api.get("/doctors", { params }),
  get: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post("/doctors", data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  remove: (id) => api.delete(`/doctors/${id}`),
};

export const patientsApi = {
  list: (params) => api.get("/patients", { params }),
  get: (id) => api.get(`/patients/${id}`),
  getFull: (id) => api.get(`/patients/${id}/full`),
  create: (data) => api.post("/patients", data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  remove: (id) => api.delete(`/patients/${id}`),
};

export const appointmentsApi = {
  list: (params) => api.get("/appointments", { params }),
  get: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post("/appointments", data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  remove: (id) => api.delete(`/appointments/${id}`),
};

export const servicesApi = {
  list: (params) => api.get("/services", { params }),
  get: (id) => api.get(`/services/${id}`),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.put(`/services/${id}`, data),
  remove: (id) => api.delete(`/services/${id}`),
};

export const invoicesApi = {
  list: (params) => api.get("/invoices", { params }),
  get: (id) => api.get(`/invoices/${id}`),
  create: (data) => api.post("/invoices", data),
  update: (id, data) => api.put(`/invoices/${id}`, data),
  remove: (id) => api.delete(`/invoices/${id}`),
};

export const activitiesApi = {
  list: (params) => api.get("/activities", { params }),
};

export const locationsApi = {
  list: (params) => api.get("/locations", { params }),
  create: (data) => api.post("/locations", data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  remove: (id) => api.delete(`/locations/${id}`),
};

export const departmentsApi = {
  list: (params) => api.get("/departments", { params }),
  create: (data) => api.post("/departments", data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  remove: (id) => api.delete(`/departments/${id}`),
};

export const specializationsApi = {
  list: (params) => api.get("/specializations", { params }),
  create: (data) => api.post("/specializations", data),
  update: (id, data) => api.put(`/specializations/${id}`, data),
  remove: (id) => api.delete(`/specializations/${id}`),
};
