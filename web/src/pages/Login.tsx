import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const API = "https://calorie-tracker-backend-puce.vercel.app"; // pick one host; use it everywhere


interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login() {
  const handleLogin = () => {
    const returnTo = window.location.origin + "/"; // http://localhost:3000/
    window.location.assign(`${API}/oauth?state=${encodeURIComponent(returnTo)}`);
  };
  //   try {

  //       export function Login() {
  //         const handleLogin = () => {
            
  //         };
        
  //       const API = "http://localhost:8000";
  //       const r = await fetch(`${API}/me`, { credentials: "include" });
  //       if (!r.ok) throw new Error("not authenticated");
  //       const me = await r.json();
  //     // TODO: Replace with your actual API endpoint
  //   //   const response = await fetch("http://127.0.0.1:8000/oauth?state=http://localhost:3000/", {
  //   //     method: "GET",
  //   //     headers: {
  //   //       "Content-Type": "application/json",
  //   //     },
  //   //   });

  //   //   if (!response.ok) {
  //   //     throw new Error("Login failed");
  //   //   }

  //   //   const data = await response.json();

  //   //   // Handle successful login
  //   //   // onLogin(data.username);
  //   //   console.log("Login successful:", data);
  //   // } catch (error) {
  //   //   console.error("Login error:", error);
  //     // Handle error (show message to user, etc.)
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center min-w-screen/2 justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-screen max-w-md">
        <CardTitle className="text-3xl font-bold text-center">NutriTrack</CardTitle>
        <div className="p-6 pt-0">
          <Button onClick={handleLogin} className="w-full">Log In</Button>
        </div>
      </Card>
    </div>
  );
}
