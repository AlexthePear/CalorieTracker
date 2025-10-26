import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NutritionGoal {
  name: string;
  current: number;
  target: number;
  unit: string;
}

interface UserProfileProps {
  username: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function UserProfile({ username, onNavigate, onLogout }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data - in a real app this would come from the backend
  const [goals, setGoals] = useState<NutritionGoal[]>([
    { name: "Calories", current: 1650, target: 2000, unit: "kcal" },
    { name: "Protein", current: 85, target: 120, unit: "g" },
    { name: "Carbs", current: 180, target: 250, unit: "g" },
    { name: "Fats", current: 45, target: 65, unit: "g" },
    { name: "Fiber", current: 18, target: 30, unit: "g" },
    { name: "Sugar", current: 35, target: 50, unit: "g" },
    { name: "Satiety Index", current: 72, target: 85, unit: "%" },
  ]);

  const [editedGoals, setEditedGoals] = useState<NutritionGoal[]>([...goals]);

  // Mock stats
  const stats = {
    streak: 12,
    totalDays: 45,
    avgAdherence: 87,
    totalMeals: 135,
    favoriteFood: "Grilled Chicken Salad",
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleSaveGoals = () => {
    // In a real app, this would make an API call to save the goals
    setGoals([...editedGoals]);
    setIsEditing(false);
    alert("Goals updated successfully!");
  };

  const handleCancelEdit = () => {
    setEditedGoals([...goals]);
    setIsEditing(false);
  };

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...editedGoals];
    newGoals[index].target = parseInt(value) || 0;
    setEditedGoals(newGoals);
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

      <div className="container mx-auto p-6 space-y-6">
        {/* User Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Your Profile</CardTitle>
            <CardDescription>Track your progress and achievements</CardDescription>
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
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Nutritional Goals</CardTitle>
                <CardDescription>Customize your daily targets</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Goals</Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSaveGoals}>Save</Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              // Display mode
              goals.map((goal) => {
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
              })
            ) : (
              // Edit mode
              <div className="grid md:grid-cols-2 gap-4">
                {editedGoals.map((goal, index) => (
                  <div key={goal.name} className="space-y-2">
                    <Label htmlFor={`goal-${index}`}>{goal.name} Target</Label>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={`goal-${index}`}
                        type="number"
                        value={goal.target}
                        onChange={(e) => handleGoalChange(index, e.target.value)}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-12">{goal.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your food log from the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Mock recent meals */}
              {[
                { date: "Today", meal: "Grilled Chicken Salad", calories: 450 },
                { date: "Today", meal: "Greek Yogurt with Berries", calories: 220 },
                { date: "Yesterday", meal: "Quinoa Bowl", calories: 380 },
                { date: "Yesterday", meal: "Protein Smoothie", calories: 290 },
                { date: "2 days ago", meal: "Salmon with Vegetables", calories: 520 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
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
