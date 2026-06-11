import {
  CalendarClockIcon,
  DoorOpenIcon,
  RadioTowerIcon,
  WrenchIcon,
} from "lucide-react";

import type { Locker } from "@/types/locker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  DeviceStatusBadge,
  DoorStateBadge,
  LockerStatusBadge,
} from "./locker-badges";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1 border-b border-neutral-800 pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={
          mono
            ? "text-muted-foreground font-mono text-xs"
            : "text-muted-foreground"
        }
      >
        {value}
      </span>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export function LockerDetailSheet({
  locker,
  open,
  onOpenChange,
  onOpenLocker,
  onToggleMaintenance,
}: {
  locker: Locker | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenLocker: (locker: Locker) => void;
  onToggleMaintenance: (locker: Locker) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100 sm:max-w-xl">
        {locker ? (
          <>
            <SheetHeader>
              <SheetTitle>{locker.name}</SheetTitle>
              <SheetDescription>
                Detalhes da porta, dispositivo ESP32 e ultimos acessos.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4">
              <div className="flex flex-wrap items-center gap-2">
                <LockerStatusBadge status={locker.status} />
                <DoorStateBadge doorState={locker.doorState} />
                <DeviceStatusBadge status={locker.deviceStatus} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <MetricCard label="Acessos" value={locker.accessCount} />
                <MetricCard label="Negados" value={locker.deniedAccessCount} />
                <MetricCard label="Alertas" value={locker.alertsCount} />
              </div>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Dados do locker</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <DetailRow label="Identificador" value={locker.id} mono />
                  <DetailRow label="Zona" value={locker.zone} />
                  <DetailRow
                    label="Usuario vinculado"
                    value={locker.assignedUser ?? "Sem usuario vinculado"}
                  />
                  <DetailRow
                    label="Ultimo RFID lido"
                    value={locker.lastRfidRead ?? "Nao informado"}
                    mono
                  />
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Dispositivo ESP32</CardTitle>
                  <CardDescription>
                    Ultima comunicacao em{" "}
                    {formatDateTime(locker.lastHeartbeatAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <DetailRow label="Nome" value={locker.esp32Name} />
                  <DetailRow label="ID do dispositivo" value={locker.esp32Id} mono />
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <RadioTowerIcon className="size-4" />
                    <span>Status do dispositivo monitorado pelo heartbeat.</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Ultimo acesso</CardTitle>
                  <CardDescription>
                    {formatDateTime(locker.lastAccessAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClockIcon className="size-4" />
                  <span>
                    {locker.assignedUser ?? "Sem usuario"} - {locker.name}
                  </span>
                </CardContent>
              </Card>
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={() => onOpenLocker(locker)}>
                <DoorOpenIcon />
                Abertura remota
              </Button>
              <Button variant="outline" onClick={() => onToggleMaintenance(locker)}>
                <WrenchIcon />
                {locker.status === "maintenance"
                  ? "Liberar manutencao"
                  : "Colocar em manutencao"}
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
