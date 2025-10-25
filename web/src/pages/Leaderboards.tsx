import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  adherence: number;
}

interface Group {
  id: string;
  name: string;
  members: number;
}

interface LeaderboardsProps {
  username: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Leaderboards({ username, onNavigate, onLogout }: LeaderboardsProps) {
  const [selectedGroup, setSelectedGroup] = useState<string>("fitness-warriors");
  const [newGroupName, setNewGroupName] = useState("");
  const [showJoinGroup, setShowJoinGroup] = useState(false);

  // Mock data for MVP
  const groups: Group[] = [
    { id: "fitness-warriors", name: "Fitness Warriors", members: 12 },
    { id: "health-heroes", name: "Health Heroes", members: 8 },
    { id: "macro-masters", name: "Macro Masters", members: 15 },
  ];

  const leaderboardData: Record<string, LeaderboardEntry[]> = {
    "fitness-warriors": [
      { rank: 1, username: "john_doe", score: 95, adherence: 98 },
      { rank: 2, username: "jane_smith", score: 92, adherence: 94 },
      { rank: 3, username: username, score: 87, adherence: 89 },
      { rank: 4, username: "mike_wilson", score: 84, adherence: 86 },
      { rank: 5, username: "sarah_jones", score: 81, adherence: 83 },
    ],
    "health-heroes": [
      { rank: 1, username: "alex_brown", score: 97, adherence: 99 },
      { rank: 2, username: username, score: 90, adherence: 92 },
      { rank: 3, username: "chris_lee", score: 88, adherence: 90 },
    ],
    "macro-masters": [
      { rank: 1, username: "pat_garcia", score: 96, adherence: 97 },
      { rank: 2, username: "sam_davis", score: 93, adherence: 95 },
      { rank: 3, username: username, score: 91, adherence: 93 },
    ],
  };

  const currentLeaderboard = leaderboardData[selectedGroup] || [];

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      // In a real app, this would make an API call
      alert(`Joined group: ${newGroupName}`);
      setNewGroupName("");
      setShowJoinGroup(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600 font-bold";
    if (rank === 2) return "text-gray-500 font-bold";
    if (rank === 3) return "text-orange-600 font-bold";
    return "text-gray-700";
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">NutriTrack</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {username}</span>
            <Button variant="outline" onClick={() => onNavigate("dashboard")}>
              Dashboard
            </Button>
            <Button variant="outline" onClick={() => onNavigate("leaderboards")}>
              Leaderboards
            </Button>
            <Button variant="ghost" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-6 space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Your Groups</CardTitle>
              <CardDescription>Select a group to view leaderboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {groups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedGroup === group.id
                      ? "bg-green-100 border-green-500"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-gray-500">{group.members} members</div>
                </button>
              ))}

              <div className="pt-4 border-t">
                {!showJoinGroup ? (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowJoinGroup(true)}
                  >
                    Join New Group
                  </Button>
                ) : (
                  <form onSubmit={handleJoinGroup} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="groupName">Group Code</Label>
                      <Input
                        id="groupName"
                        type="text"
                        placeholder="Enter group code"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Join
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJoinGroup(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>
                Rankings based on nutrition goal adherence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-4 pb-3 border-b font-medium text-sm text-gray-600">
                  <div>Rank</div>
                  <div>Username</div>
                  <div className="text-right">Score</div>
                  <div className="text-right">Adherence</div>
                </div>
                {currentLeaderboard.map((entry) => (
                  <div
                    key={entry.username}
                    className={`grid grid-cols-4 gap-4 p-3 rounded-lg transition-all ${
                      entry.username === username ? "bg-green-100" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className={getRankColor(entry.rank)}>
                      {getRankBadge(entry.rank)}
                    </div>
                    <div className={entry.username === username ? "font-bold" : ""}>
                      {entry.username}
                      {entry.username === username && (
                        <span className="ml-2 text-xs text-green-600">(You)</span>
                      )}
                    </div>
                    <div className="text-right font-medium">{entry.score}</div>
                    <div className="text-right text-green-600">{entry.adherence}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
