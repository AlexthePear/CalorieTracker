import { useState } from "react";
import "./index.css";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Leaderboards } from "./pages/Leaderboards";
import { Button } from "./components/ui/button";

type Page = "login" | "dashboard" | "leaderboards";

// Set to true for easy page navigation during development
const DEV_MODE = true;

export function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [username, setUsername] = useState<string>("demo_user");

  const handleLogin = (user: string) => {
    setUsername(user);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    setUsername("");
    setCurrentPage("login");
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  // Dev mode navigation panel
  const DevNav = () => {
    if (!DEV_MODE) return null;

    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="text-xs font-bold mb-2">DEV MODE - Quick Navigation</div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={currentPage === "login" ? "default" : "outline"}
            onClick={() => setCurrentPage("login")}
            className={currentPage === "login" ? "" : "bg-white text-black hover:bg-gray-200"}
          >
            Login
          </Button>
          <Button
            size="sm"
            variant={currentPage === "dashboard" ? "default" : "outline"}
            onClick={() => setCurrentPage("dashboard")}
            className={currentPage === "dashboard" ? "" : "bg-white text-black hover:bg-gray-200"}
          >
            Dashboard
          </Button>
          <Button
            size="sm"
            variant={currentPage === "leaderboards" ? "default" : "outline"}
            onClick={() => setCurrentPage("leaderboards")}
            className={currentPage === "leaderboards" ? "" : "bg-white text-black hover:bg-gray-200"}
          >
            Leaderboards
          </Button>
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

  return null;
}

export default App;
