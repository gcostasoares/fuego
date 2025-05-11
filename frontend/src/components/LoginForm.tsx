// src/LoginForm.tsx
import React from "react";
import { Logo } from "../Layouts/Header";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "./ui/form";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onRegisterClick: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm: React.FC<IProps> = ({
  show,
  setShow,
  onRegisterClick,
}) => {
  const methods = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch(
        "https://fuego-ombm.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Anmeldung fehlgeschlagen");

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: result.username,
          email: result.email,
          isAdmin: result.isAdmin,
        })
      );
      localStorage.setItem("token", result.token);

      alert("Anmeldung erfolgreich!");
      setShow(false);
      window.location.reload();
    } catch (err: any) {
      alert("Anmeldefehler: " + err.message);
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={() => setShow(false)} modal>
      {/* HAVE A DialogTitle */}
      <DialogTitle className="text-center">Willkommen zurück</DialogTitle>

      <DialogContent className="!gap-2">
        <div className="py-2 text-center">
          <Logo />
        </div>

        <DialogDescription className="text-center mb-3">
          Bitte geben Sie Ihre Anmeldedaten ein.
        </DialogDescription>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Ihre E-Mail"
                  {...register("email", {
                    required: "E-Mail ist erforderlich",
                  })}
                />
              </FormControl>
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </FormItem>

            {/* Passwort */}
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Passwort ist erforderlich",
                    minLength: {
                      value: 6,
                      message: "Muss mindestens 6 Zeichen lang sein",
                    },
                  })}
                />
              </FormControl>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </FormItem>

            {/* Submit */}
            <button
              type="submit"
              className="w-full my-2 bg-blue-600 text-white py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Anmelden…" : "Anmelden"}
            </button>

            {/* Switch to register */}
            <p className="text-center text-black small mt-3">
              Kein Konto?{" "}
              <span
                onClick={onRegisterClick}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Konto erstellen
              </span>
            </p>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
