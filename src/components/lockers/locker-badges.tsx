import type { DoorState, DeviceStatus, LockerStatus } from "@/types/locker";
import { Badge } from "@/components/ui/badge";

const statusLabels: Record<LockerStatus, string> = {
  available: "Disponivel",
  occupied: "Ocupado",
  maintenance: "Manutencao",
  offline: "Offline",
};

const doorStateLabels: Record<DoorState, string> = {
  open: "Aberta",
  closed: "Fechada",
};

const deviceStatusLabels: Record<DeviceStatus, string> = {
  online: "Online",
  offline: "Offline",
  warning: "Atencao",
};

const statusBadgeClassNames: Record<LockerStatus, string> = {
  available: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  occupied: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  maintenance: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  offline: "border-red-500/40 bg-red-500/15 text-red-300",
};

const doorStateBadgeClassNames: Record<DoorState, string> = {
  open: "border-red-500/40 bg-red-500/15 text-red-300",
  closed: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
};

const deviceStatusBadgeClassNames: Record<DeviceStatus, string> = {
  online: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  offline: "border-red-500/40 bg-red-500/15 text-red-300",
  warning: "border-amber-500/40 bg-amber-500/15 text-amber-300",
};

export function LockerStatusBadge({ status }: { status: LockerStatus }) {
  return (
    <Badge variant="outline" className={statusBadgeClassNames[status]}>
      {statusLabels[status]}
    </Badge>
  );
}

export function DoorStateBadge({ doorState }: { doorState: DoorState }) {
  return (
    <Badge variant="outline" className={doorStateBadgeClassNames[doorState]}>
      {doorStateLabels[doorState]}
    </Badge>
  );
}

export function DeviceStatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <Badge variant="outline" className={deviceStatusBadgeClassNames[status]}>
      {deviceStatusLabels[status]}
    </Badge>
  );
}
