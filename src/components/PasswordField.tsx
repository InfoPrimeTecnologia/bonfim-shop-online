import { useState } from "react";
import { Check, Circle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { passwordRequirements } from "@/lib/password";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showRequirements?: boolean;
  autoComplete: "current-password" | "new-password";
};

export function PasswordField({ id, label, value, onChange, showRequirements = false, autoComplete }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative mt-1">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
          className="pr-11"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-1 top-1/2 -translate-y-1/2"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          title={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </Button>
      </div>
      {showRequirements && (
        <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2" aria-label="Requisitos da senha">
          {passwordRequirements.map((requirement) => {
            const met = requirement.test(value);
            return (
              <li key={requirement.label} className={met ? "flex items-center gap-1.5 text-foreground" : "flex items-center gap-1.5 text-muted-foreground"}>
                {met ? <Check className="h-3.5 w-3.5 text-gold" /> : <Circle className="h-3.5 w-3.5" />}
                {requirement.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}