// src/pages/changePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function ChangePassword() {
  const { authFetch, markPasswordChanged, user } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (newPassword !== confirm) {
      setMsg("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await authFetch("http://localhost:5000/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de mise à jour.");

      // OK → on marque comme changé
      markPasswordChanged();
      setMsg("Mot de passe mis à jour !");
      // Rediriger selon le rôle
      setTimeout(() => {
        if (user?.role === "admin") navigate("/admin");
        else navigate("/");
      }, 500);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border rounded-xl p-6 mt-8">
      <h1 className="text-xl font-semibold mb-4">Changer votre mot de passe</h1>
      {msg && <div className="mb-3 text-sm">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm">Ancien mot de passe</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm">Confirmer le mot de passe</label>
          <input
            type="password"
            className="w-full border rounded p-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-[#094363] text-white"
        >
          {loading ? "Mise à jour..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
}
