// src/LoginForm.jsx
import React from "react";
import { Col,  Row  } from "react-bootstrap";
import { Logo } from "../Layouts/Header";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { useForm, FormProvider } from "react-hook-form";
import { FormItem, FormControl, FormLabel } from "./ui/form";

interface IProps {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onRegisterClick: () => void;
}

export const LoginForm: React.FC<IProps> = ({ show, setShow, onRegisterClick }) => {
  const methods = useForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods;

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:8081/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Anmeldung fehlgeschlagen");
      }
      // Store token and user info in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: result.username,
          email:    result.email,
          isAdmin:  result.isAdmin
        })
      );
      localStorage.setItem("token", result.token);

      alert("Anmeldung erfolgreich!");
      setShow(false);
      // Reload the page so the header re-reads localStorage.
      window.location.reload();
    } catch (error: any) {
      alert("Anmeldefehler: " + error.message);
    }
  };

  if (!show) return null;

  return (
    <Dialog open={show} onOpenChange={() => setShow(false)} modal>
      <DialogContent>
        <div className="py-2 text-center">
          <Logo />
        </div>
        <Label className="text-center font-bold text-4xl">Willkommen zurück</Label>
        <DialogDescription className="text-center mb-3">
          Bitte geben Sie Ihre Anmeldedaten ein.
        </DialogDescription>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormItem>
              <FormLabel>E-Mail-Adresse</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Geben Sie Ihre E-Mail-Adresse ein"
                  {...register("email", { required: "E-Mail ist erforderlich" })}
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
                  {...register("password", { required: "Passwort ist erforderlich" })}
                />
              </FormControl>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </FormItem>

            <Row className="mb-3">
              <Col sm={6} xs={12}>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Angemeldet bleiben
                  </label>
                </div>
              </Col>
              <Col sm={6} xs={12}>
                <p className="text-end text-decoration-underline small cursor-pointer">
                  Passwort vergessen?
                </p>
              </Col>
            </Row>

            <Button type="submit" className="w-full my-2" disabled={isSubmitting}>
              {isSubmitting ? "Anmelden..." : "Anmelden"}
            </Button>

            <p className="text-center text-black small mt-3">
              Kein Konto?{" "}
              <span
                className="text-decoration-underline cursor-pointer"
                onClick={onRegisterClick}
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
