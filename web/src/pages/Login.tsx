import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const handleLogin = async () => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("YOUR_API_ENDPOINT_HERE", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Add your request payload here
        }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();

      // Handle successful login
      // onLogin(data.username);
      console.log("Login successful:", data);
    } catch (error) {
      console.error("Login error:", error);
      // Handle error (show message to user, etc.)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">NutriTrack</CardTitle>
        </CardHeader>
        <div className="p-6 pt-0">
          <Button onClick={handleLogin} className="w-full">
            Log In
          </Button>
        </div>
      </Card>
    </div>
  );
}
