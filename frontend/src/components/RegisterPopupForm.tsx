// src/RegisterPopupForm.tsx
import React from "react";
import { Button } from "react-bootstrap";
import { Logo } from "../Layouts/Header";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "./ui/form";

const API_URL = "https://fuego-ombm.onrender.com";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onLoginClick: () => void;
}

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPopupForm: React.FC<IProps> = ({
  show,
  setShow,
  onLoginClick,
}) => {
  const methods = useForm<RegisterFormValues>({
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const password = watch("password", "");

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const result = await res.json();

      if (!res.ok) {
        const msg = result.details
          ? `${result.error}: ${result.details}`
          : result.error || "Registrierung fehlgeschlagen";
        throw new Error(msg);
      }

      alert("Registrierung erfolgreich! Bitte melden Sie sich an.");
      methods.reset();
      setShow(false);
      onLoginClick();
    } catch (err: any) {
      alert("Registrierungsfehler: " + err.message);
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={() => setShow(false)} modal>
      {/* 1) Title (for accessibility) */}
      <DialogTitle className="text-center">Konto erstellen</DialogTitle>

      {/* 2) Description */}
      <DialogDescription className="text-center mb-3">
        Bitte füllen Sie das Formular aus, um ein neues Konto zu erstellen.
      </DialogDescription>

      {/* 3) Content */}
      <DialogContent className="!gap-2">
        {/* Logo */}
        <div className="py-2 text-center">
          <Logo />
        </div>

        {/* Form */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <FormItem>
              <FormLabel>Benutzername</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Geben Sie Ihren Benutzernamen ein"
                  {...register("username", {
                    required: "Benutzername ist erforderlich",
                  })}
                />
              </FormControl>
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </FormItem>

            {/* Email */}
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
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

            {/* Password */}
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
                        "Passwort muss mindestens 6 Zeichen lang sein",
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

            {/* Confirm Password */}
            <FormItem>
              <FormLabel>Passwort bestätigen</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Passwort bestätigen"
                  {...register("confirmPassword", {
                    required: "Bitte bestätigen Sie Ihr Passwort",
                    validate: (val) =>
                      val === password || "Passwörter stimmen nicht überein",
                  })}
                />
              </FormControl>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </FormItem>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full my-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registriere…" : "Registrieren"}
            </Button>
          </form>
        </FormProvider>

        {/* Switch to Login */}
        <p className="text-center text-black small mt-3">
          Sie haben bereits ein Konto?{" "}
          <span
            onClick={onLoginClick}
            className="underline cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Anmelden
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
};
