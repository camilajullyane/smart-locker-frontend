export type LockerStatus = "available" | "occupied" | "maintenance" | "offline";

export type DoorState = "open" | "closed";

export type DeviceStatus = "online" | "offline" | "warning";

export interface Locker {
  id: string;
  name: string;
  zone: string;
  status: LockerStatus;
  doorState: DoorState;
  assignedUser?: string;
  esp32Id: string;
  esp32Name: string;
  deviceStatus: DeviceStatus;
  lastHeartbeatAt: string;
  lastAccessAt: string;
  lastRfidRead?: string;
  accessCount: number;
  deniedAccessCount: number;
  alertsCount: number;
}
