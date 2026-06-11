import type { User } from "@/types/user";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Badge } from "../ui/badge";
import { MetricCard } from "./metric-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { DetailRow } from "./detail-row";
import { Button } from "../ui/button";
import { CalendarClockIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { StatusBadge } from "./status-badge";

export function UserDetailsSheet({
  user,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}) {
  function formatDateTime(value: string | Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(value));
  }

  function getAccessStatusLabel(status: string) {
    return status === "authorized" ? "Autorizado" : "Negado";
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100 sm:max-w-xl">
        {user ? (
          <>
            <SheetHeader>
              <SheetTitle>{user.name}</SheetTitle>
              <SheetDescription>
                Informacoes do usuario, RFID e historico recente de acessos.
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4">
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={user.status} />
                <Badge variant="outline">{user.role}</Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricCard label="Acessos" value={user.accessCount} />
                <MetricCard label="Negados" value={user.deniedAccessCount} />
              </div>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Dados pessoais</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm">
                  <DetailRow label="Email" value={user.email} />
                  <DetailRow
                    label="Telefone"
                    value={user.phone || "Nao informado"}
                  />
                  <DetailRow
                    label="Departamento"
                    value={user.department || "Nao informado"}
                  />
                  <DetailRow
                    label="Cartao RFID"
                    value={user.rfidCardNumber}
                    mono
                  />
                  <DetailRow label="Locker vinculado" value={user.locker} />
                  <DetailRow
                    label="Criado em"
                    value={formatDateTime(user.createdAt)}
                  />
                  <DetailRow
                    label="Atualizado em"
                    value={formatDateTime(user.updatedAt)}
                  />
                  {user.deletedAt ? (
                    <DetailRow
                      label="Excluido em"
                      value={formatDateTime(user.deletedAt)}
                    />
                  ) : null}
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Ultimo acesso ao locker</CardTitle>
                  <CardDescription>
                    {formatDateTime(user.lastLockerAccess)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClockIcon className="size-4" />
                  <span>
                    {user.locker} -{" "}
                    {getAccessStatusLabel(user.lastAccessStatus)}
                  </span>
                </CardContent>
              </Card>

              <Card className="bg-neutral-900/40">
                <CardHeader>
                  <CardTitle>Eventos recentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.recentEvents.length > 0 ? (
                    user.recentEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-lg border border-neutral-800 bg-neutral-950/70 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium">{event.description}</p>
                          <Badge
                            variant={
                              event.status === "authorized"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {getAccessStatusLabel(event.status)}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {event.locker} - {formatDateTime(event.occurredAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum evento recente registrado para este usuario.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={() => onEdit(user)}>
                <PencilIcon />
                Editar
              </Button>
              <Button variant="destructive" onClick={() => onDelete(user)}>
                <Trash2Icon />
                Excluir
              </Button>
            </SheetFooter>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
