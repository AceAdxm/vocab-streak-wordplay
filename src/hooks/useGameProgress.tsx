import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useGameProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const updateXPAndLevel = async (wordsCorrect: number) => {
    if (!user) return;

    const xpGained = wordsCorrect * 50;
    const xpForNextLevel = 100;

    try {
      // Get current profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const currentXPInLevel = profile.xp_in_current_level + xpGained;
      const levelsGained = Math.floor(currentXPInLevel / xpForNextLevel);
      const newLevel = profile.current_level + levelsGained;
      const newXPInLevel = currentXPInLevel % xpForNextLevel;
      const newTotalXP = profile.total_xp + xpGained;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          total_xp: newTotalXP,
          current_level: newLevel,
          xp_in_current_level: newXPInLevel,
          total_games: profile.total_games + 1,
          total_wins: profile.total_wins + (wordsCorrect > 0 ? 1 : 0),
          current_streak: wordsCorrect > 0 ? profile.current_streak + 1 : 0,
          best_streak: wordsCorrect > 0 
            ? Math.max(profile.best_streak, profile.current_streak + 1)
            : profile.best_streak
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return;
      }

      // Update daily contributions
      const today = new Date().toISOString().split('T')[0];
      const { data: contribution, error: contributionFetchError } = await supabase
        .from('daily_contributions')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (contributionFetchError) {
        console.error('Error fetching contribution:', contributionFetchError);
        return;
      }

      if (contribution) {
        // Update existing contribution
        const { error: contributionUpdateError } = await supabase
          .from('daily_contributions')
          .update({
            games_played: contribution.games_played + 1,
            words_correct: contribution.words_correct + wordsCorrect,
            xp_earned: contribution.xp_earned + xpGained
          })
          .eq('id', contribution.id);

        if (contributionUpdateError) {
          console.error('Error updating contribution:', contributionUpdateError);
        }
      } else {
        // Create new contribution
        const { error: contributionCreateError } = await supabase
          .from('daily_contributions')
          .insert({
            user_id: user.id,
            date: today,
            games_played: 1,
            words_correct: wordsCorrect,
            xp_earned: xpGained
          });

        if (contributionCreateError) {
          console.error('Error creating contribution:', contributionCreateError);
        }
      }

      // Show level up notification
      if (levelsGained > 0) {
        toast({
          title: "Level Up! 🎉",
          description: `You reached level ${newLevel}! Gained ${xpGained} XP.`,
        });
      } else if (xpGained > 0) {
        toast({
          title: "XP Gained! ✨",
          description: `+${xpGained} XP! Keep going!`,
        });
      }

    } catch (error) {
      console.error('Error updating game progress:', error);
    }
  };

  return { updateXPAndLevel };
};