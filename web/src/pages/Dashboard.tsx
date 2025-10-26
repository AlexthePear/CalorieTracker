import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface DashboardProps {
  username: string;
  onNavigate: (page: string, profileUsername?: string) => void;
  onLogout: () => void;
}

export function Dashboard({ username, onNavigate, onLogout }: DashboardProps) {
  // Mock data for MVP
  const goals: NutritionGoal[] = [
    { name: "Calories", current: 1650, target: 2000, unit: "kcal" },
    { name: "Protein", current: 85, target: 120, unit: "g" },
    { name: "Carbs", current: 180, target: 250, unit: "g" },
    { name: "Fats", current: 45, target: 65, unit: "g" },
    { name: "Fiber", current: 18, target: 30, unit: "g" },
    { name: "Sugar", current: 35, target: 50, unit: "g" },
    { name: "Satiety Index", current: 72, target: 85, unit: "%" },
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">NutriTrack</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {username}</span>
            <a
              href="#/dashboard"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Dashboard
            </a>
            <a
              href="#/leaderboards"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Leaderboards
            </a>
            <a
              href="#/profile"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              Profile
            </a>
            <Button variant="ghost" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Today's Progress</CardTitle>
            <CardDescription>Track your nutritional goals for the day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {goals.map((goal) => {
              const percentage = getProgressPercentage(goal.current, goal.target);
              return (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{goal.name}</span>
                    <span className="text-sm text-gray-600">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full ${getProgressColor(percentage)} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500">{percentage.toFixed(0)}% of daily goal</div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
