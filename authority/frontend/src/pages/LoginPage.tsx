import { ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate } from "react-router-dom";
import { ApiClientError } from "../services/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { isAuthorityAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthorityAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login(email, password);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiClientError
          ? caughtError.message
          : "Unable to sign in with the provided credentials.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-grid-overlay bg-[size:36px_36px] p-6">
      <div className="w-full max-w-md rounded-xl border border-borderline bg-panel p-8 shadow-panel">
        <div className="mb-5 h-1 w-20 rounded-full bg-state-gold/80" />
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg border border-state-gold/20 bg-state-navy p-3 text-state-gold">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-state-slate">Digital Vault</p>
            <h1 className="text-2xl font-semibold text-state-ivory">Authority Sign In</h1>
          </div>
        </div>

        <p className="mb-6 text-sm leading-6 text-slate-600">
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-borderline bg-white px-4 py-3 text-state-ivory outline-none placeholder:text-state-slate focus:border-state-navy"
              placeholder="authority@agency.gov"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-borderline bg-white px-4 py-3 text-state-ivory outline-none placeholder:text-state-slate focus:border-state-navy"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg border border-state-navy bg-state-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#123159] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300 disabled:text-slate-500"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
