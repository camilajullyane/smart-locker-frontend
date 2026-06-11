import {
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";

import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
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

const statusLabels: Record<string, string> = {
  active: "Ativo",
  blocked: "Bloqueado",
  deleted: "Excluido",
};

function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function getStatusBadgeVariant(status: string) {
  if (status === "active") {
    return "default";
  }

  if (status === "blocked") {
    return "destructive";
  }

  return "secondary";
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {statusLabels[status] ?? status}
    </Badge>
  );
}

export function UsersTable({
  users,
  onView,
  onEdit,
  onDelete,
}: {
  users: User[];
  onView: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
        <UsersIcon className="mb-3 size-8 text-muted-foreground" />
        <p className="font-medium">Nenhum usuario encontrado</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste a busca ou o filtro para ver outros cadastros.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuario</TableHead>
          <TableHead>RFID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Ultimo acesso</TableHead>
          <TableHead>Locker</TableHead>
          <TableHead className="text-right">Acoes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer"
            onClick={() => onView(user)}
          >
            <TableCell>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
            </TableCell>
            <TableCell className="font-mono text-xs">
              {user.rfidCardNumber}
            </TableCell>
            <TableCell>
              <StatusBadge status={user.status} />
            </TableCell>
            <TableCell>{formatDateTime(user.lastLockerAccess)}</TableCell>
            <TableCell>{user.locker}</TableCell>
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
                      onView(user);
                    }}
                  >
                    <EyeIcon />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(user);
                    }}
                  >
                    <PencilIcon />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(user);
                    }}
                  >
                    <Trash2Icon />
                    Excluir
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
