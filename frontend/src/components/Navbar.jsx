import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        RateSpace
      </Link>

      <div className="nav-links">
        <Link to="/">Stores</Link>

        {token && user?.role === "SYSTEM_ADMIN" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {token && user?.role === "STORE_OWNER" && (
          <Link to="/owner">Owner Dashboard</Link>
        )}

        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="register-link">
              Sign up
            </Link>
          </>
        ) : (
          <>
            <span>{user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;