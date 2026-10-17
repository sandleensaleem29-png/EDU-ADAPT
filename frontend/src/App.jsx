import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import StudentDashboard from "./pages/StudentDashboard";
import QuizSelect from "./pages/QuizSelect";
import QuizPage from "./pages/QuizPage";
import QuizResult from "./pages/QuizResult";
import Performance from "./pages/Performance";
import Recommendations from "./pages/Recommendations";
import Resources from "./pages/Resources";
import QuizHistory from "./pages/QuizHistory";
import Profile from "./pages/Profile";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminStudents from "./pages/AdminStudents";
import AdminQuestions from "./pages/AdminQuestions";
import AdminTopics from "./pages/AdminTopics";
import AdminResources from "./pages/AdminResources";
import AdminAttempts from "./pages/AdminAttempts";

// Layout for student pages
const StudentLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar role="student" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

// Layout for admin pages
const AdminLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Navbar />
    <div className="flex">
      <Sidebar role="admin" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </div>
);

// Public layout (login/register)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">{children}</div>
);

// Landing page redirect
const Landing = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user) {
    return (
      <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />
    );
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/"
            element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/register"
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            }
          />

          {/* Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <StudentDashboard />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/select"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <QuizSelect />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/start/:topicId"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <QuizPage />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/result/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <QuizResult />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/performance"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <Performance />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <Recommendations />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/resources"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <Resources />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentLayout>
                  <QuizHistory />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <Profile />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminStudents />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminQuestions />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/topics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminTopics />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/resources"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminResources />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/attempts"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout>
                  <AdminAttempts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
