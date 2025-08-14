import axiosBase from "axios";

const axios = axiosBase.create({
  baseURL: "/", 
  withCredentials: true,
});

// User types
interface CreateUserPayload {
  email: string;
  password: string;
  name?: string | null;
  role?: string;
  companyId?: string | null;
};

interface CreatedUser {
  id: string;
  email: string;
  name: string | null;
  role: "COMPANY_USER" | "COMPANY_ADMIN" | "EMS_USER";
  isGlobalAdmin: boolean;
  companyId: string | null;
  createdAt: string; // serialized from Date
  updatedAt: string; // serialized from Date
};

// Event types
interface EventListItem {
  id: string;
  title: string;
  startTime: string; // ISO string
};

interface EventDetail {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string; // ISO
  endTime: string;   // ISO
};

interface UpdateEventPayload {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string | Date;
  endTime: string | Date;
};

interface CreateEventPayload {
  title: string;
  description?: string | null;
  location?: string | null;
  startTime: string | Date;
  endTime: string | Date;
};


// Users
async function deleteUser(id: string) {
  const { data } = await axios.delete("/api/admin/users/", { data: { id } });
  return data;
};

async function getUsers() {
  const { data } = await axios.get("/api/admin/users/");
  return data;
};

async function createUser(formData: CreateUserPayload): Promise<CreatedUser> {
  const { data } = await axios.post<CreatedUser>('/api/admin/users', formData);
  return data;
}

async function promoteUser(id: string) {
  const { data } = await axios.patch("/api/admin/users/", { id });
  return data;
};

// Events
async function getEvents(): Promise<EventListItem[]> {
  const { data } = await axios.get<EventListItem[]>("/api/events");
  return data;
};

async function getEvent(id: string): Promise<EventDetail> {
  const { data } = await axios.get<EventDetail>("/api/events", { params: { id } });
  return data;
};

async function removeEvent(id: string): Promise<void> {
  const { data } = await axios.delete("/api/events", { params: { id } });
  return data;
};

async function updateEvent(payload: UpdateEventPayload): Promise<EventDetail> {
  const body = {
    ...payload,
    startTime: new Date(payload.startTime).toISOString(),
    endTime: new Date(payload.endTime).toISOString(),
  };

  const { data } = await axios.patch<EventDetail>("/api/events", body);
  return data;
};

async function createEvent(formData: CreateEventPayload): Promise<{ success: true }> {
  const body = {
    ...formData,
    startTime: new Date(formData.startTime).toISOString(),
    endTime: new Date(formData.endTime).toISOString(),
  };

  const { data } = await axios.post<{ success: true }>("/api/events", body);
  return data;
};

const api = {
// ESM admin
  deleteUser,
  getUsers,
  createUser,
  promoteUser,
// events
  getEvents,
  getEvent,
  removeEvent,
  updateEvent,
  createEvent,
};

export default api;
export type { EventListItem, EventDetail, UpdateEventPayload, CreateEventPayload, CreateUserPayload };