import { useState } from "react";
import "./index.css";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Leaderboards } from "./pages/Leaderboards";
import { UserProfile } from "./pages/UserProfile";
import { PublicProfile } from "./pages/PublicProfile";
import { Button } from "./components/ui/button";

type Page = "login" | "dashboard" | "leaderboards" | "profile" | "public-profile";

// Set to true for easy page navigation during development
const DEV_MODE = true;

export function App() {
  const [username, setUsername] = useState<string>("");
  const [viewingProfileUsername, setViewingProfileUsername] = useState<string>("");

  const handleLogin = (user: string) => {
    setUsername(user);
    window.location.hash = "/dashboard";
  };

  const handleLogout = () => {
    setUsername("");
    window.location.hash = "/login";
  };

  const handleNavigate = (page: string, profileUsername?: string) => {
    if (page === "public-profile" && profileUsername) {
      window.location.hash = `/profile/${profileUsername}`;
    } else {
      window.location.hash = `/${page}`;
    }
  };

  // Dev mode navigation panel
  const DevNav = () => {
    if (!DEV_MODE) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="text-xs font-bold mb-2">DEV MODE - Quick Navigation</div>
        <div className="flex gap-2 flex-wrap max-w-sm">
          <a
            href="#/login"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3 ${
              currentPage === "login"
                ? "bg-white text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Login
          </a>
          <a
            href="#/dashboard"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3 ${
              currentPage === "dashboard"
                ? "bg-white text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Dashboard
          </a>
          <a
            href="#/leaderboards"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3 ${
              currentPage === "leaderboards"
                ? "bg-white text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Leaderboards
          </a>
          <a
            href="#/profile"
            className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3 ${
              currentPage === "profile"
                ? "bg-white text-black"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            Profile
          </a>
        </div>
      </div>
    );
  };

  if (currentPage === "login") {
    return (
      <>
        <Login onLogin={handleLogin} />
        <DevNav />
      </>
    );
  }

  if (currentPage === "dashboard") {
    return (
      <>
        <Dashboard
          username={username}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <DevNav />
      </>
    );
  }

  if (currentPage === "leaderboards") {
    return (
      <>
        <Leaderboards
          username={username}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <DevNav />
      </>
    );
  }

  if (currentPage === "profile") {
    return (
      <>
        <UserProfile
          username={username}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <DevNav />
      </>
    );
  }

  if (currentPage === "public-profile") {
    return (
      <>
        <PublicProfile
          currentUsername={username}
          profileUsername={viewingProfileUsername}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
        <DevNav />
      </>
    );
  }

  return null;
}

export default App;
