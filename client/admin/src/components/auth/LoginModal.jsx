import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

export function LoginModal() {
  const { login, isLoading, user } = useAuth();
  const [open, setOpen] = React.useState(!user);
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setOpen(!user);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(form);
      setOpen(false);
      setForm({ email: "", password: "" });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  if (user) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="w-[350px] bg-white p-6 rounded-xl shadow-xl border border-gray-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <Lock size={20} className="text-blue-600" />
            Iniciar Sesión
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded px-2 py-1 bg-gray-50 focus-within:ring-2 ring-blue-200">
              <Mail size={18} className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-sm"
                autoFocus
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-600">Contraseña</label>
            <div className="flex items-center border rounded px-2 py-1 bg-gray-50 focus-within:ring-2 ring-blue-200">
              <Lock size={18} className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-xs text-center">{error}</div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Lock size={16} className="animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock size={16} />
                  Entrar
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}