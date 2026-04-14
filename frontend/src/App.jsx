import { useState, useEffect } from "react";
import "./App.css";
import { createBrowserRouter, Outlet, RouterProvider, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/admin/Dashboard";
import ScholarshipDetails from "./pages/user/ScholarshipDetails";
import ScholarshipForm from "./pages/user/ScholarshipForm";
import Scheme from "./pages/user/Scheme";
import UserDashboard from "./pages/user/Dashboard";

const sliderImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599596564619-75f8541e4dcb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=2070&auto=format&fit=crop"
];

const AppShell = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const showSlider = location.pathname.startsWith("/user") || location.pathname.startsWith("/admin") || location.pathname === "/login";

  return (
    <>
      {/* Global Live Blurred Background Image */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[var(--bg)]">
        {showSlider ? (
          sliderImages.map((src, index) => {
            const isActive = index === currentImageIndex;
            const isPrevious = index === (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
            let visibilityClasses = 'opacity-0 -z-10';
            
            if (isActive) {
              visibilityClasses = 'opacity-100 z-10';
            } else if (isPrevious) {
              visibilityClasses = 'opacity-100 z-0';
            }

            return (
              <div
                key={src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${visibilityClasses}`}
              >
                <img src={src} alt="Global background" className="w-full h-full object-cover blur-[5px] opacity-40" />
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 bg-[#f8fafc]" />
        )}
      </div>
      
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/login", element: <Login /> },
      { path: "/reset-password/:id/:token", element: <ResetPassword /> },
      { path: "/user/scheme", element: <Scheme /> },
      { path: "/user/scheme/:id", element: <ScholarshipDetails /> },
      {
        path: "/user/dashboard",
        element: <ProtectedRoute element={<UserDashboard />} allowedRole="user" />,
      },
      {
        path: "/user/scholarships/check-eligibility",
        element: <ProtectedRoute element={<ScholarshipForm />} allowedRole="user" />,
      },
      {
        path: "/admin/dashboard",
        element: <ProtectedRoute element={<AdminDashboard />} allowedRole="admin" />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
