import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./UseAuth";
import Loading from "./Loading";

function ProtectedPage({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signIn", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) return <Loading/>;

  return <>{children}</>;
}

export default ProtectedPage;
