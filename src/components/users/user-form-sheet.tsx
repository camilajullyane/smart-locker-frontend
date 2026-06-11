import type { FormEvent } from "react";

import type { UserFormValues } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "blocked", label: "Bloqueado" },
  { value: "deleted", label: "Excluido" },
] as const;

const roleOptions = ["Administrador", "Operador", "Usuario"] as const;

const fieldLabelClassName = "text-neutral-200";
const fieldClassName =
  "border-neutral-700 bg-neutral-900/70 text-neutral-100 placeholder:text-neutral-500";
const selectContentClassName =
  "border-neutral-800 bg-neutral-950 text-neutral-100";

export function UserFormSheet({
  mode,
  values,
  open,
  onOpenChange,
  onValuesChange,
  onSubmit,
}: {
  mode: "create" | "edit" | null;
  values: UserFormValues;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValuesChange: (values: UserFormValues) => void;
  onSubmit: (values: UserFormValues) => void;
}) {
  function updateField(field: keyof UserFormValues, value: string) {
    onValuesChange({ ...values, [field]: value });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(values);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-neutral-800 bg-neutral-950 text-neutral-100 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-neutral-50">
            {mode === "edit" ? "Editar usuario" : "Novo usuario"}
          </SheetTitle>
          <SheetDescription className="text-neutral-400">
            Preencha os dados cadastrais e o identificador RFID do cartao.
          </SheetDescription>
        </SheetHeader>

        <form id="user-form" className="space-y-4 px-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name" className={fieldLabelClassName}>
              Nome
            </Label>
            <Input
              id="name"
              value={values.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className={fieldLabelClassName}>
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="role" className={fieldLabelClassName}>
                Perfil
              </Label>
              <Select
                value={values.role}
                onValueChange={(value) => updateField("role", value)}
              >
                <SelectTrigger id="role" className={`w-full ${fieldClassName}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClassName}>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status" className={fieldLabelClassName}>
                Status
              </Label>
              <Select
                value={values.status}
                onValueChange={(value) => updateField("status", value)}
              >
                <SelectTrigger id="status" className={`w-full ${fieldClassName}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContentClassName}>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rfid" className={fieldLabelClassName}>
              Numero do cartao RFID
            </Label>
            <Input
              id="rfid"
              value={values.rfidCardNumber}
              onChange={(event) =>
                updateField("rfidCardNumber", event.target.value)
              }
              placeholder="04:A3:9F:22:10:6B"
              className={fieldClassName}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="locker" className={fieldLabelClassName}>
                Locker vinculado
              </Label>
              <Input
                id="locker"
                value={values.locker}
                onChange={(event) => updateField("locker", event.target.value)}
                placeholder="Locker A-12"
                className={fieldClassName}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone" className={fieldLabelClassName}>
                Telefone
              </Label>
              <Input
                id="phone"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+55 81 99999-0000"
                className={fieldClassName}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="department" className={fieldLabelClassName}>
              Departamento ou grupo
            </Label>
            <Textarea
              id="department"
              value={values.department}
              onChange={(event) =>
                updateField("department", event.target.value)
              }
              placeholder="Operacao, Logistica, Visitantes..."
              className={fieldClassName}
              rows={3}
            />
          </div>
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="user-form">
            {mode === "edit" ? "Salvar alteracoes" : "Cadastrar usuario"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
