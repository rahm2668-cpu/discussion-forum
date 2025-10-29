import { Loader2, Trophy, Medal, Award } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { LeaderboardUser } from "../../services/api";

interface LeaderboardsProps {
  users: LeaderboardUser[];
  isLoading: boolean;
}

export function Leaderboards({ users, isLoading }: LeaderboardsProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      const colors = ["bg-yellow-500", "bg-gray-400", "bg-amber-600"];
      return (
        <Badge className={`${colors[rank - 1]} text-white`}>#{rank}</Badge>
      );
    }
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const getDisplayName = (user: LeaderboardUser): string =>
    user.name || user.email || "Unknown";

  const getInitial = (user: LeaderboardUser): string => {
    const name = user.name || user.email || "Unknown";
    return name.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">Leaderboards</h2>
        <p className="text-muted-foreground">
          Top contributors in the Dicoding community
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="divide-y">
          {users.map((user, index) => (
            <div
              key={`${user.id}-${index}`}
              className={`p-6 flex items-center gap-4 hover:bg-muted/50 transition-colors ${
                index < 3 ? "bg-muted/20" : ""
              }`}
            >
              <div className="flex items-center justify-center w-12">
                {getRankIcon(index + 1) || (
                  <span className="text-xl text-muted-foreground">
                    #{index + 1}
                  </span>
                )}
              </div>

              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    user.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                  }
                  alt={getDisplayName(user)}
                />
                <AvatarFallback>{getInitial(user)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-lg">
                    {getDisplayName(user)}
                  </span>
                  {getRankBadge(index + 1)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {user.email || "Community Member"}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-semibold text-primary">
                  {user.score}
                </div>
                <p className="text-sm text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {users.length === 0 && !isLoading && (
        <Card className="p-12 text-center text-muted-foreground">
          No leaderboard data available at the moment.
        </Card>
      )}
    </div>
  );
}
