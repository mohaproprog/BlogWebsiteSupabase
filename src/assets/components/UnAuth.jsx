import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./UseAuth";
import Loading from "./Loading";

function UnAuth({ children }) {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/blogs", { replace: true }); // redirect if logged in
    }
  }, [user, loading, navigate]);

  // show loading while checking auth
  if (loading || user) return <Loading/>;

  return <>{children}</>;
}

export default UnAuth;
