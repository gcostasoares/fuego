import React from "react";
import { Button } from "react-bootstrap";
import { Logo } from "../Layouts/Header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "./ui/form";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onLoginClick: () => void;
}

export const RegisterPopupForm: React.FC<IProps> = ({
  show,
  setShow,
  onLoginClick,
}) => {
  const methods = useForm({
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
  const password = watch("password");

  const onSubmit = async (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await fetch(
        "https://fuego-ombm.onrender.com/api/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: data.username,
            email: data.email,
            password: data.password,
          }),
        }
      );
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
      <DialogTitle className="text-center">Konto erstellen</DialogTitle>
      <DialogContent className="!gap-2">
        <div className="py-2 text-center">
          <Logo />
        </div>
        <DialogDescription className="text-center mb-3">
          Bitte füllen Sie das Formular aus, um ein neues Konto zu erstellen.
        </DialogDescription>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* ... same form fields as before ... */}
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
            {/* email, password, confirmPassword fields... */}
            <Button
              type="submit"
              className="w-full my-2"
              disabled={isSubmitting}
            >
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
