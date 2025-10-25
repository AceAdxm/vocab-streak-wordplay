import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, ArrowLeft, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { BadgeIcon } from '@/components/BadgeIcon';

interface LeaderboardUser {
  id: string;
  username: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  current_streak: number;
  best_streak: number;
  total_games: number;
  total_wins: number;
  monthly_badge?: {
    rank: number;
  };
}

const Leaderboard = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Set up real-time subscription for profile changes
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('Profile updated:', payload);
          // Refetch leaderboard when any profile changes
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_xp, current_level, current_streak, best_streak, total_games, total_wins')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      // Fetch badges for current month
      const { data: badgesData } = await supabase
        .from('badges')
        .select('user_id, rank')
        .eq('month', currentMonth)
        .eq('year', currentYear);

      const badgeMap = new Map(badgesData?.map(b => [b.user_id, { rank: b.rank }]) || []);

      const usersWithBadges = (data || []).map(user => ({
        ...user,
        monthly_badge: badgeMap.get(user.id)
      }));

      setUsers(usersWithBadges);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  const getWinRate = (wins: number, games: number) => {
    if (games === 0) return 0;
    return Math.round((wins / games) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-white text-xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Header />
      <div className="max-w-4xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Game</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏆 Global Leaderboard
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Top players by total XP earned
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm sm:text-base">
                No players yet. Be the first to sign up and start playing!
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const winRate = getWinRate(user.total_wins, user.total_games);
                  
                  return (
                    <div 
                      key={user.id}
                      className={`flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 rounded-lg border ${
                        rank <= 3 
                          ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20' 
                          : 'bg-white/5 border-white/10'
                      } hover:bg-white/10 transition-colors`}
                    >
                      {/* Mobile: Horizontal layout for rank, avatar, and main info */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-700 shrink-0">
                          <div className="flex flex-col items-center">
                            <div className="scale-75 sm:scale-100">
                              {getRankIcon(rank)}
                            </div>
                            <span className="text-xs font-bold text-white">#{rank}</span>
                          </div>
                        </div>
                        
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 shrink-0">
                          <AvatarImage src={user.avatar_url || ''} />
                          <AvatarFallback>{user.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                                {user.username || 'Anonymous Player'}
                              </h3>
                              {user.monthly_badge && <BadgeIcon rank={user.monthly_badge.rank} size={14} />}
                            </div>
                            <Badge variant="secondary" className="text-xs w-fit mt-1 sm:mt-0">
                              Level {user.current_level}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* XP - Always visible on the right */}
                        <div className="text-right shrink-0">
                          <div className="text-lg sm:text-2xl font-bold text-purple-400">
                            {user.total_xp.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">XP</div>
                        </div>
                      </div>
                      
                      {/* Mobile: Stats row below, Desktop: inline */}
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300 sm:ml-auto">
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">🔥 {user.current_streak}</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">🎯 {winRate}%</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">🎮 {user.total_games}</span>
                        <span className="bg-white/10 px-2 py-1 rounded text-xs">Best: {user.best_streak}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;