// src/RegisterPopupForm.tsx
import React from "react";
import { Button  } from "react-bootstrap";
import { Logo } from "../Layouts/Header";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "./ui/form";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onLoginClick: () => void;
}

export const RegisterPopupForm: React.FC<IProps> = ({ show, setShow, onLoginClick }) => {
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = methods;
  const password = watch("password");

  const onSubmit = async (data: { username: string; email: string; password: string; confirmPassword: string }) => {
    try {
      const response = await fetch("https://fuego-ombm.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password
        })
      });
      const result = await response.json();
      if (!response.ok) {
        const errorMessage = result.details 
          ? `${result.error}: ${result.details}`
          : result.error || "Registrierung fehlgeschlagen";
        throw new Error(errorMessage);
      }
      alert("Registrierung erfolgreich! Bitte melden Sie sich an.");
      methods.reset();
      setShow(false);
      onLoginClick();
    } catch (error: any) {
      alert("Registrierungsfehler: " + error.message);
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={() => setShow(false)} modal>
      <DialogContent className="!gap-2">
        <div className="py-2 text-center">
          <Logo />
        </div>
        <DialogTitle className="text-center">Konto erstellen</DialogTitle>
        <DialogDescription className="text-center mb-3">
          Bitte füllen Sie das Formular aus, um ein neues Konto zu erstellen.
        </DialogDescription>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>Benutzername</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Geben Sie Ihren Benutzernamen ein"
                  {...register("username", { required: "Benutzername ist erforderlich" })}
                />
              </FormControl>
              {errors.username && (
                <p className="text-red-500 text-sm">{errors.username.message}</p>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  {...register("email", {
                    required: "E-Mail ist erforderlich",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Ungültige E-Mail-Adresse"
                    }
                  })}
                />
              </FormControl>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </FormItem>
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
                      message: "Das Passwort muss mindestens 6 Zeichen lang sein"
                    }
                  })}
                />
              </FormControl>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </FormItem>
            <FormItem>
              <FormLabel>Passwort bestätigen</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Passwort bestätigen"
                  {...register("confirmPassword", {
                    required: "Bitte bestätigen Sie Ihr Passwort",
                    validate: value => value === password || "Passwörter stimmen nicht überein"
                  })}
                />
              </FormControl>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
              )}
            </FormItem>
            <Button type="submit" className="w-full my-2" disabled={isSubmitting}>
              {isSubmitting ? "Registriere..." : "Registrieren"}
            </Button>
          </form>
        </FormProvider>
        <p className="text-center text-black small mt-3">
          Sie haben bereits ein Konto?{" "}
          <span
            onClick={onLoginClick}
            className="text-decoration-underline cursor-pointer text-blue-600 hover:text-blue-800"
          >
            Anmelden
          </span>
        </p>
      </DialogContent>
    </Dialog>
  );
};
