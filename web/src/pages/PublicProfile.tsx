import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface PublicProfileProps {
  currentUsername: string;
  profileUsername: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PublicProfile({ currentUsername, profileUsername, onNavigate, onLogout }: PublicProfileProps) {
  // Mock data - in a real app this would come from the backend based on profileUsername
  const goals: NutritionGoal[] = [
    { name: "Calories", current: 1800, target: 2200, unit: "kcal" },
    { name: "Protein", current: 95, target: 140, unit: "g" },
    { name: "Carbs", current: 200, target: 270, unit: "g" },
    { name: "Fats", current: 55, target: 75, unit: "g" },
    { name: "Fiber", current: 22, target: 35, unit: "g" },
    { name: "Sugar", current: 40, target: 55, unit: "g" },
    { name: "Satiety Index", current: 78, target: 90, unit: "%" },
  ];

  // Mock stats
  const stats = {
    streak: 8,
    totalDays: 32,
    avgAdherence: 82,
    totalMeals: 96,
    favoriteFood: "Protein Pancakes",
  };

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
            <span className="text-sm text-gray-600">Welcome, {currentUsername}</span>
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

      <div className="container mx-auto p-6 space-y-6">
        {/* Back Button */}
        <a
          href="#/leaderboards"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          ← Back to Leaderboards
        </a>

        {/* User Header */}
        <Card className="bg-gradient-to-r from-green-100 to-blue-100">
          <CardHeader>
            <CardTitle className="text-3xl">{profileUsername}'s Profile</CardTitle>
            <CardDescription className="text-base">Public stats and achievements</CardDescription>
          </CardHeader>
        </Card>

        {/* User Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Stats & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.streak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalDays}</div>
                <div className="text-sm text-gray-600">Total Days</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.avgAdherence}%</div>
                <div className="text-sm text-gray-600">Avg Adherence</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stats.totalMeals}</div>
                <div className="text-sm text-gray-600">Meals Logged</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-sm font-medium text-pink-600 truncate">{stats.favoriteFood}</div>
                <div className="text-sm text-gray-600">Favorite Food</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nutritional Goals Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Current Goals</CardTitle>
            <CardDescription>Daily nutritional targets</CardDescription>
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

        {/* Recent Meals Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Meals</CardTitle>
            <CardDescription>Foods logged this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock recent meals */}
              {[
                { date: "Today", meal: "Protein Pancakes", calories: 380 },
                { date: "Today", meal: "Turkey Sandwich", calories: 420 },
                { date: "Yesterday", meal: "Chicken Stir Fry", calories: 510 },
                { date: "Yesterday", meal: "Fruit Smoothie", calories: 260 },
                { date: "2 days ago", meal: "Tuna Salad", calories: 340 },
                { date: "2 days ago", meal: "Oatmeal with Nuts", calories: 310 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium">{item.meal}</div>
                    <div className="text-sm text-gray-500">{item.date}</div>
                  </div>
                  <div className="text-sm font-medium text-green-600">{item.calories} kcal</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
