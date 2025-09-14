import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContributionData {
  date: string;
  games_played: number;
  words_correct: number;
  xp_earned: number;
}

interface ContributionCalendarProps {
  userId: string;
}

const ContributionCalendar = ({ userId }: ContributionCalendarProps) => {
  const [contributions, setContributions] = useState<ContributionData[]>([]);

  useEffect(() => {
    fetchContributions();
  }, [userId]);

  const fetchContributions = async () => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const { data, error } = await supabase
      .from('daily_contributions')
      .select('date, games_played, words_correct, xp_earned')
      .eq('user_id', userId)
      .gte('date', oneYearAgo.toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching contributions:', error);
      return;
    }

    setContributions(data || []);
  };

  const getContributionLevel = (gamesPlayed: number) => {
    if (gamesPlayed === 0) return 0;
    if (gamesPlayed <= 2) return 1;
    if (gamesPlayed <= 5) return 2;
    if (gamesPlayed <= 10) return 3;
    return 4;
  };

  const getColorClass = (level: number) => {
    const colors = [
      'bg-gray-200', // 0 contributions
      'bg-green-200', // 1-2 contributions
      'bg-green-400', // 3-5 contributions
      'bg-green-600', // 6-10 contributions
      'bg-green-800', // 10+ contributions
    ];
    return colors[level];
  };

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    const contributionMap = new Map(
      contributions.map(c => [c.date, c])
    );

    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const contribution = contributionMap.get(dateStr);
      const gamesPlayed = contribution?.games_played || 0;
      
      days.push({
        date: dateStr,
        level: getContributionLevel(gamesPlayed),
        gamesPlayed,
        wordsCorrect: contribution?.words_correct || 0,
        xpEarned: contribution?.xp_earned || 0,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  
  // Group days by week
  const weeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-53 gap-1 text-xs">
            {weeks.map((week, weekIndex) => (
              week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm ${getColorClass(day.level)} cursor-pointer hover:ring-2 hover:ring-purple-300`}
                  title={`${day.date}: ${day.gamesPlayed} games, ${day.wordsCorrect} words correct, ${day.xpEarned} XP`}
                />
              ))
            ))}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
            <span>Less</span>
            <div className="flex space-x-1">
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContributionCalendar;