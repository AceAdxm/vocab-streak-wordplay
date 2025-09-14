import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import ContributionCalendar from '@/components/ContributionCalendar';
import FriendsLeaderboard from '@/components/FriendsLeaderboard';

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  current_streak: number;
  best_streak: number;
  total_xp: number;
  current_level: number;
  xp_in_current_level: number;
  total_games: number;
  total_wins: number;
}

const Profile = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setProfile(data);
    setUsername(data.username || '');
  };

  const updateProfile = async () => {
    if (!user || !profile) return;

    const { error } = await supabase
      .from('profiles')
      .update({ username })
      .eq('user_id', user.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Profile updated!",
      description: "Your username has been updated successfully.",
    });
    fetchProfile();
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }

    setUploading(true);
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) {
      toast({
        variant: "destructive",
        title: "Error uploading avatar",
        description: uploadError.message,
      });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('user_id', user.id);

    if (updateError) {
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: updateError.message,
      });
    } else {
      toast({
        title: "Avatar updated!",
        description: "Your profile picture has been updated.",
      });
      fetchProfile();
    }

    setUploading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  const xpForNextLevel = 100;
  const progressPercentage = (profile.xp_in_current_level / xpForNextLevel) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <CardDescription>Manage your account and view your progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback>{username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={uploadAvatar}
                  disabled={uploading}
                  className="w-auto"
                />
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Username</label>
                <div className="flex space-x-2">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                  <Button onClick={updateProfile}>Update</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400">{profile.current_streak}</div>
                  <div className="text-sm text-muted-foreground">Current Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-400">{profile.best_streak}</div>
                  <div className="text-sm text-muted-foreground">Best Streak</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{profile.total_xp}</div>
                  <div className="text-sm text-muted-foreground">Total XP</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{profile.current_level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Level {profile.current_level} Progress</span>
                    <span>{profile.xp_in_current_level}/{xpForNextLevel} XP</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <ContributionCalendar userId={user.id} />
        <FriendsLeaderboard userId={user.id} />
      </div>
    </div>
  );
};

export default Profile;