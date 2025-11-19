import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function PublicRoute({ children }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/chat", { replace: true });
    }
  }, [token, navigate]);

  if (token) return null;

  return children;
}
