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
  // Initialize react-hook-form
  const methods = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // Submission handler
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

      if (!res.ok) {
        // Show server‐side error message
        throw new Error(result.error || "Anmeldung fehlgeschlagen");
      }

      // Store in localStorage
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

  // Don't render if `show` is false
  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={() => setShow(false)} modal>
      {/* 1) Title for accessibility */}
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
            {/* — Email Field — */}
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Ihre E-Mail"
                  {...register("email", {
                    required: "E-Mail ist erforderlich",
                    pattern: {
                      value:
                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ungültige E-Mail-Adresse",
                    },
                  })}
                />
              </FormControl>
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email.message}
                </p>
              )}
            </FormItem>

            {/* — Password Field — */}
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
                      message:
                        "Das Passwort muss mindestens 6 Zeichen lang sein",
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

            {/* — Submit Button — */}
            <button
              type="submit"
              className="w-full my-2 bg-blue-600 text-white py-2 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Anmelden…" : "Anmelden"}
            </button>

            {/* — Switch to Register — */}
            <p className="text-center text-black small mt-3">
              Kein Konto?{" "}
              <span
                onClick={onRegisterClick}
                className="text-decoration-underline cursor-pointer text-blue-600 hover:text-blue-800"
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
