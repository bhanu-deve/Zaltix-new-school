import { Navigate } from "react-router-dom";

type Props = {
  children: JSX.Element;
  role: "teacher" | "principal";
};

const RequireAuth = ({ children, role }: Props) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ logged in but wrong role
  if (user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  // ✅ allowed
  return children;
};

export default RequireAuth;
