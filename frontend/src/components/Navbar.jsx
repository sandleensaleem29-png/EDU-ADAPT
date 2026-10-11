import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>

              <span className="text-xl font-bold text-primary-600">
                EduAdapt
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-5">
            {user ? (
              <>
                {/* Home */}
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-primary-600 transition"
                >
                  Home
                </Link>

                {/* Dashboard */}
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  className="text-sm text-primary-600 hover:text-primary-700 transition"
                >
                  Dashboard
                </Link>

                {/* Profile */}
                <Link
                  to="/profile"
                  className="text-sm text-gray-600 hover:text-primary-600 transition"
                >
                  Profile
                </Link>

                {/* Greeting */}
                <span className="hidden sm:block text-sm text-gray-600">
                  Hi, {user.name}
                </span>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Home */}
                <Link
                  to="/"
                  className="text-sm text-gray-600 hover:text-primary-600 transition"
                >
                  Home
                </Link>

                {/* Login */}
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-primary-600 transition"
                >
                  Login
                </Link>

                {/* Register */}
                <Link to="/register" className="btn-primary text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
