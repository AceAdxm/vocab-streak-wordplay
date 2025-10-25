import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JoinClassModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinClassModal = ({ open, onOpenChange }: JoinClassModalProps) => {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to join a class');
      setLoading(false);
      return;
    }

    // Find the class with this join code
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('id, name')
      .eq('join_code', joinCode.toUpperCase())
      .single();

    if (classError || !classData) {
      toast.error('Invalid join code');
      setLoading(false);
      return;
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('class_members')
      .select('id')
      .eq('class_id', classData.id)
      .eq('user_id', user.id)
      .single();

    if (existingMember) {
      toast.info('You are already a member of this class');
      setLoading(false);
      onOpenChange(false);
      return;
    }

    // Join the class
    const { error: joinError } = await supabase
      .from('class_members')
      .insert({
        class_id: classData.id,
        user_id: user.id
      });

    if (joinError) {
      console.error('Error joining class:', joinError);
      toast.error('Failed to join class');
    } else {
      toast.success(`Successfully joined ${classData.name}!`);
      setJoinCode('');
      onOpenChange(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Class</DialogTitle>
          <DialogDescription>
            Enter the join code provided by your teacher
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoinClass} className="space-y-4">
          <div>
            <Label htmlFor="joinCode">Join Code</Label>
            <Input
              id="joinCode"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              className="font-mono text-lg uppercase"
              maxLength={6}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || joinCode.length !== 6}>
              {loading ? 'Joining...' : 'Join Class'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
