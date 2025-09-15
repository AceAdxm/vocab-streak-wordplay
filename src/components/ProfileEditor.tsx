import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Camera } from 'lucide-react';

interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
}

interface ProfileEditorProps {
  onClose: () => void;
  onProfileUpdate?: () => void;
}

const ProfileEditor = ({ onClose, onProfileUpdate }: ProfileEditorProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [username, setUsername] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
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
    setLoading(false);
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
      title: "Username updated!",
      description: "Your username has been updated successfully.",
    });
    fetchProfile();
    onProfileUpdate?.(); // Notify parent to refresh
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
      onProfileUpdate?.(); // Notify parent to refresh
    }

    setUploading(false);
  };

  if (loading) {
    return (
      <div className="w-80 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
        <div className="text-center text-white">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-80 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
        <div className="text-center text-white">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="w-80 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Avatar Section */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback>{username?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition-colors">
              <Camera className="w-3 h-3 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
          {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
        </div>

        {/* Username Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Username</label>
          <div className="flex space-x-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="flex-1"
            />
            <Button onClick={updateProfile} size="sm">
              Save
            </Button>
          </div>
        </div>

        {/* User Info */}
        <div className="pt-2 border-t border-gray-700">
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;