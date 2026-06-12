import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangleIcon,
  BoxesIcon,
  DoorOpenIcon,
  RadioTowerIcon,
  ShieldAlertIcon,
} from "lucide-react";

import { SummaryCard } from "@/components/SummaryCard";
import {
  DeviceStatusBadge,
  LockerStatusBadge,
} from "@/components/lockers/locker-badges";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { mockLockers } from "@/data/mock-lockers";
import { mockUsers } from "@/data/mock-users";

const overviewDate = "2026-06-11";

const hourlyAccessData = [
  { hour: "07h", authorized: 4, denied: 0 },
  { hour: "08h", authorized: 12, denied: 1 },
  { hour: "09h", authorized: 18, denied: 2 },
  { hour: "10h", authorized: 9, denied: 0 },
  { hour: "11h", authorized: 14, denied: 1 },
  { hour: "12h", authorized: 7, denied: 0 },
];

function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatTime(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeStyle: "short",
  }).format(new Date(value));
}

function getPercent(value: number, max: number) {
  return max === 0 ? 0 : Math.round((value / max) * 100);
}

function OverviewPage() {
  const accessEvents = mockUsers.flatMap((user) =>
    user.recentEvents.map((event) => ({
      ...event,
      userName: user.name,
      rfidCardNumber: user.rfidCardNumber,
    })),
  );

  const todayEvents = accessEvents.filter((event) =>
    event.occurredAt.startsWith(overviewDate),
  );

  const authorizedToday = todayEvents.filter(
    (event) => event.status === "authorized",
  ).length;
  const deniedToday = todayEvents.filter(
    (event) => event.status === "denied",
  ).length;
  const availableLockers = mockLockers.filter(
    (locker) => locker.status === "available",
  ).length;
  const onlineDevices = mockLockers.filter(
    (locker) => locker.deviceStatus === "online",
  ).length;
  const activeAlerts = mockLockers.reduce(
    (total, locker) => total + locker.alertsCount,
    0,
  );

  const lockerStatusItems = [
    {
      label: "Disponiveis",
      value: availableLockers,
      className: "bg-emerald-400",
    },
    {
      label: "Ocupados",
      value: mockLockers.filter((locker) => locker.status === "occupied")
        .length,
      className: "bg-sky-400",
    },
    {
      label: "Manutencao",
      value: mockLockers.filter((locker) => locker.status === "maintenance")
        .length,
      className: "bg-amber-400",
    },
    {
      label: "Offline",
      value: mockLockers.filter((locker) => locker.status === "offline").length,
      className: "bg-red-400",
    },
  ];

  const maxHourlyAccess = Math.max(
    ...hourlyAccessData.map((item) => item.authorized + item.denied),
  );

  const recentEvents = [...accessEvents]
    .sort(
      (firstEvent, secondEvent) =>
        new Date(secondEvent.occurredAt).getTime() -
        new Date(firstEvent.occurredAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Acompanhe a operacao dos lockers, acessos RFID e dispositivos ESP32.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={DoorOpenIcon}
          label="Lockers disponiveis"
          value={availableLockers}
        />
        <SummaryCard
          icon={BoxesIcon}
          label="Acessos hoje"
          value={authorizedToday}
        />
        <SummaryCard
          icon={ShieldAlertIcon}
          label="Tentativas negadas"
          value={deniedToday}
        />
        <SummaryCard
          icon={RadioTowerIcon}
          label="ESP32 online"
          value={onlineDevices}
        />
        <SummaryCard
          icon={AlertTriangleIcon}
          label="Alertas ativos"
          value={activeAlerts}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <Card className="bg-neutral-950/60">
          <CardHeader>
            <CardTitle>Acessos por hora</CardTitle>
            <CardDescription>
              Aberturas autorizadas e tentativas negadas no dia.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {hourlyAccessData.map((item) => {
              return (
                <div key={item.hour} className="grid gap-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">{item.hour}</span>
                    <span className="text-muted-foreground">
                      {item.authorized} autorizados / {item.denied} negados
                    </span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-neutral-900">
                    <div
                      className="bg-emerald-400"
                      style={{
                        width: `${getPercent(item.authorized, maxHourlyAccess)}%`,
                      }}
                    />
                    <div
                      className="bg-red-400"
                      style={{
                        width: `${getPercent(item.denied, maxHourlyAccess)}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="bg-neutral-950/60">
          <CardHeader>
            <CardTitle>Status dos lockers</CardTitle>
            <CardDescription>
              Distribuicao atual por disponibilidade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lockerStatusItems.map((item) => (
              <div key={item.label} className="grid gap-2">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-900">
                  <div
                    className={`h-full ${item.className}`}
                    style={{
                      width: `${getPercent(item.value, mockLockers.length)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <Card className="bg-neutral-950/60">
          <CardHeader>
            <CardTitle>Eventos recentes</CardTitle>
            <CardDescription>
              Ultimas leituras RFID registradas nos lockers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{event.description}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.userName} - {event.locker} -{" "}
                      {formatTime(event.occurredAt)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      event.status === "authorized"
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
                        : "border-red-500/40 bg-red-500/15 text-red-300"
                    }
                  >
                    {event.status === "authorized" ? "Autorizado" : "Negado"}
                  </Badge>
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  RFID {event.rfidCardNumber}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-neutral-950/60">
          <CardHeader>
            <CardTitle>Saude dos ESP32</CardTitle>
            <CardDescription>
              Ultimo heartbeat recebido por dispositivo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockLockers.map((locker) => (
              <div
                key={locker.esp32Id}
                className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{locker.esp32Name}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {locker.esp32Id}
                    </p>
                  </div>
                  <DeviceStatusBadge status={locker.deviceStatus} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <LockerStatusBadge status={locker.status} />
                  <span>{locker.name}</span>
                  <span>Heartbeat {formatDateTime(locker.lastHeartbeatAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  component: OverviewPage,
});
