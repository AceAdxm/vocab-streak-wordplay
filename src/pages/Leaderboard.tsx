import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

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
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_xp, current_level, current_streak, best_streak, total_games, total_wins')
        .order('total_xp', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching leaderboard:', error);
        return;
      }

      setUsers(data || []);
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
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Game</span>
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏆 Global Leaderboard
            </CardTitle>
            <CardDescription>
              Top players by total XP earned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No players yet. Be the first to sign up and start playing!
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user, index) => {
                  const rank = index + 1;
                  const winRate = getWinRate(user.total_wins, user.total_games);
                  
                  return (
                    <div 
                      key={user.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${
                        rank <= 3 
                          ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/20' 
                          : 'bg-white/5 border-white/10'
                      } hover:bg-white/10 transition-colors`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700">
                        <div className="flex flex-col items-center">
                          {getRankIcon(rank)}
                          <span className="text-xs font-bold text-white mt-1">#{rank}</span>
                        </div>
                      </div>
                      
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar_url || ''} />
                        <AvatarFallback>{user.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-white truncate">
                            {user.username || 'Anonymous Player'}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            Level {user.current_level}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-300 mt-1">
                          <span>{user.total_xp} XP</span>
                          <span>🔥 {user.current_streak}</span>
                          <span>🎯 {winRate}% win rate</span>
                          <span>🎮 {user.total_games} games</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-400">
                          {user.total_xp.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          Best: {user.best_streak} streak
                        </div>
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