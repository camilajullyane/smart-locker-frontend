export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  rfidCardNumber: string;
  lastLockerAccess: string;
  createdAt: Date;
  updatedAt: Date;
  locker: string;
  phone?: string;
  department?: string;
  accessCount: number;
  deniedAccessCount: number;
  lastAccessStatus: string;
  deletedAt?: Date;
  recentEvents: UserAccessEvent[];
}

export interface UserAccessEvent {
  id: string;
  locker: string;
  occurredAt: string;
  status: string;
  description: string;
}

export type UserFormValues = Pick<
  User,
  | "name"
  | "email"
  | "role"
  | "status"
  | "rfidCardNumber"
  | "locker"
  | "phone"
  | "department"
>;
