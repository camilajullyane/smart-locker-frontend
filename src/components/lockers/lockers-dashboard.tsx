import { useMemo, useState } from "react";
import {
  AlertTriangleIcon,
  BoxesIcon,
  DoorClosedIcon,
  DoorOpenIcon,
  SearchIcon,
  WrenchIcon,
} from "lucide-react";

import { mockLockers } from "@/data/mock-lockers";
import type { DoorState, Locker, LockerStatus } from "@/types/locker";
import { SummaryCard } from "@/components/SummaryCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LockerDetailSheet } from "./locker-detail-sheet";
import { LockersTable } from "./lockers-table";

function matchesSearch(locker: Locker, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    locker.name,
    locker.zone,
    locker.assignedUser ?? "",
    locker.esp32Id,
    locker.esp32Name,
    locker.lastRfidRead ?? "",
  ]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch);
}

export function LockersDashboard() {
  const [lockers, setLockers] = useState<Locker[]>(mockLockers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LockerStatus | "all">("all");
  const [doorStateFilter, setDoorStateFilter] = useState<DoorState | "all">(
    "all",
  );
  const [selectedLockerId, setSelectedLockerId] = useState<string | null>(null);

  const selectedLocker =
    lockers.find((locker) => locker.id === selectedLockerId) ?? null;

  const filteredLockers = useMemo(() => {
    return lockers.filter((locker) => {
      const statusMatches =
        statusFilter === "all" || locker.status === statusFilter;
      const doorStateMatches =
        doorStateFilter === "all" || locker.doorState === doorStateFilter;

      return (
        statusMatches && doorStateMatches && matchesSearch(locker, search)
      );
    });
  }, [doorStateFilter, lockers, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: lockers.length,
      available: lockers.filter((locker) => locker.status === "available")
        .length,
      occupied: lockers.filter((locker) => locker.status === "occupied").length,
      maintenance: lockers.filter((locker) => locker.status === "maintenance")
        .length,
      alerts: lockers.reduce((total, locker) => total + locker.alertsCount, 0),
    };
  }, [lockers]);

  function handleOpenLocker(locker: Locker) {
    setLockers((currentLockers) =>
      currentLockers.map((currentLocker) =>
        currentLocker.id === locker.id
          ? {
              ...currentLocker,
              doorState: "open",
              lastAccessAt: new Date().toISOString(),
            }
          : currentLocker,
      ),
    );
  }

  function handleToggleMaintenance(locker: Locker) {
    setLockers((currentLockers) =>
      currentLockers.map((currentLocker) =>
        currentLocker.id === locker.id
          ? {
              ...currentLocker,
              status:
                currentLocker.status === "maintenance"
                  ? "available"
                  : "maintenance",
            }
          : currentLocker,
      ),
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Lockers</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitore unidades, portas, disponibilidade e manutencoes conectadas ao
          ESP32.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          icon={BoxesIcon}
          label="Total de lockers"
          value={stats.total}
        />
        <SummaryCard
          icon={DoorOpenIcon}
          label="Disponiveis"
          value={stats.available}
        />
        <SummaryCard
          icon={DoorClosedIcon}
          label="Ocupados"
          value={stats.occupied}
        />
        <SummaryCard
          icon={WrenchIcon}
          label="Manutencao"
          value={stats.maintenance}
        />
        <SummaryCard
          icon={AlertTriangleIcon}
          label="Alertas"
          value={stats.alerts}
        />
      </div>

      <Card className="bg-neutral-950/60">
        <CardHeader className="gap-4 border-b border-border pb-4 md:flex md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Lockers cadastrados</CardTitle>
            <CardDescription>
              Consulte o status das portas, usuarios vinculados e dispositivos
              ESP32.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="relative sm:w-80">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por locker, usuario, RFID ou ESP32"
                className="pl-8"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as LockerStatus | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="available">Disponiveis</SelectItem>
                <SelectItem value="occupied">Ocupados</SelectItem>
                <SelectItem value="maintenance">Manutencao</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={doorStateFilter}
              onValueChange={(value) =>
                setDoorStateFilter(value as DoorState | "all")
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Porta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as portas</SelectItem>
                <SelectItem value="open">Abertas</SelectItem>
                <SelectItem value="closed">Fechadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <LockersTable
            lockers={filteredLockers}
            onView={(locker) => setSelectedLockerId(locker.id)}
            onOpenLocker={handleOpenLocker}
            onToggleMaintenance={handleToggleMaintenance}
          />
        </CardContent>
      </Card>

      <LockerDetailSheet
        locker={selectedLocker}
        open={Boolean(selectedLocker)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLockerId(null);
          }
        }}
        onOpenLocker={handleOpenLocker}
        onToggleMaintenance={handleToggleMaintenance}
      />
    </section>
  );
}
