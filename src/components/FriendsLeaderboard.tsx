import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  username: string | null;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  current_streak: number;
}

interface FriendsLeaderboardProps {
  userId: string;
}

const FriendsLeaderboard = ({ userId }: FriendsLeaderboardProps) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFriends();
  }, [userId]);

  const fetchFriends = async () => {
    // Get friends list
    const { data: friendsList, error: friendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .eq('user_id', userId)
      .eq('status', 'accepted');

    if (friendsError) {
      console.error('Error fetching friends:', friendsError);
      return;
    }

    if (!friendsList || friendsList.length === 0) {
      setFriends([]);
      return;
    }

    const friendIds = friendsList.map(f => f.friend_id);

    // Get profiles for all friends
    const { data: friendProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, user_id, username, avatar_url, total_xp, current_level, current_streak')
      .in('user_id', friendIds);

    if (profilesError) {
      console.error('Error fetching friend profiles:', profilesError);
      return;
    }

    const friendsData = friendProfiles?.map(profile => ({
      id: profile.id,
      username: profile.username,
      avatar_url: profile.avatar_url,
      total_xp: profile.total_xp,
      current_level: profile.current_level,
      current_streak: profile.current_streak,
    })) || [];

    // Sort by total XP descending
    friendsData.sort((a, b) => b.total_xp - a.total_xp);
    setFriends(friendsData);
  };

  const addFriend = async () => {
    if (!searchUsername.trim()) return;
    
    setLoading(true);

    // First, find the user by username
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('user_id, username')
      .eq('username', searchUsername.trim())
      .single();

    if (searchError || !profiles) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "No user with that username exists.",
      });
      setLoading(false);
      return;
    }

    if (profiles.user_id === userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You cannot add yourself as a friend.",
      });
      setLoading(false);
      return;
    }

    // Check if friend request already exists
    const { data: existingFriend } = await supabase
      .from('friends')
      .select('*')
      .eq('user_id', userId)
      .eq('friend_id', profiles.user_id)
      .single();

    if (existingFriend) {
      toast({
        variant: "destructive",
        title: "Already friends",
        description: "You are already friends with this user.",
      });
      setLoading(false);
      return;
    }

    // Send friend request
    const { error: insertError } = await supabase
      .from('friends')
      .insert([
        { user_id: userId, friend_id: profiles.user_id, status: 'accepted' },
        { user_id: profiles.user_id, friend_id: userId, status: 'accepted' }
      ]);

    if (insertError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add friend.",
      });
    } else {
      toast({
        title: "Friend added!",
        description: `You are now friends with ${profiles.username}.`,
      });
      setSearchUsername('');
      fetchFriends();
    }

    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Friends Leaderboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter username to add friend"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addFriend()}
          />
          <Button onClick={addFriend} disabled={loading}>
            {loading ? 'Adding...' : 'Add Friend'}
          </Button>
        </div>

        {friends.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No friends yet. Add some friends to see the leaderboard!
          </p>
        ) : (
          <div className="space-y-3">
            {friends.map((friend, index) => (
              <div key={friend.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-mono w-6">#{index + 1}</div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={friend.avatar_url || ''} />
                    <AvatarFallback>{friend.username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{friend.username || 'Anonymous'}</div>
                    <div className="text-xs text-muted-foreground">Level {friend.current_level}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-400">{friend.total_xp} XP</div>
                  <div className="text-xs text-orange-400">🔥 {friend.current_streak} streak</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendsLeaderboard;