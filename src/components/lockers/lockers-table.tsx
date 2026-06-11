import {
  DoorOpenIcon,
  EyeIcon,
  MoreHorizontalIcon,
  RadioTowerIcon,
  WrenchIcon,
} from "lucide-react";

import type { Locker } from "@/types/locker";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DoorStateBadge, LockerStatusBadge } from "./locker-badges";

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LockersTable({
  lockers,
  onView,
  onOpenLocker,
  onToggleMaintenance,
}: {
  lockers: Locker[];
  onView: (locker: Locker) => void;
  onOpenLocker: (locker: Locker) => void;
  onToggleMaintenance: (locker: Locker) => void;
}) {
  if (lockers.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <RadioTowerIcon className="mb-3 size-8 text-muted-foreground" />
        <p className="font-medium">Nenhum locker encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste a busca ou os filtros para ver outras unidades.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Locker</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Porta</TableHead>
          <TableHead>Usuario vinculado</TableHead>
          <TableHead>ESP32</TableHead>
          <TableHead>Ultimo acesso</TableHead>
          <TableHead className="text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lockers.map((locker) => (
          <TableRow
            key={locker.id}
            className="cursor-pointer"
            onClick={() => onView(locker)}
          >
            <TableCell>
              <div className="font-medium">{locker.name}</div>
              <div className="text-sm text-muted-foreground">{locker.zone}</div>
            </TableCell>
            <TableCell>
              <LockerStatusBadge status={locker.status} />
            </TableCell>
            <TableCell>
              <DoorStateBadge doorState={locker.doorState} />
            </TableCell>
            <TableCell>{locker.assignedUser ?? "Sem usuario"}</TableCell>
            <TableCell>
              <div className="font-medium">{locker.esp32Name}</div>
              <div className="font-mono text-xs text-muted-foreground">
                {locker.esp32Id}
              </div>
            </TableCell>
            <TableCell>{formatDateTime(locker.lastAccessAt)}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Abrir acoes</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onView(locker);
                    }}
                  >
                    <EyeIcon />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onOpenLocker(locker);
                    }}
                  >
                    <DoorOpenIcon />
                    Abertura remota
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleMaintenance(locker);
                    }}
                  >
                    <WrenchIcon />
                    {locker.status === "maintenance"
                      ? "Liberar manutencao"
                      : "Colocar em manutencao"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
