import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Trophy, Target, Flame, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClassInfo {
  id: string;
  name: string;
  school_name: string;
  description: string;
  join_code: string;
  member_count: number;
}

interface StudentStats {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  current_streak: number;
  total_games: number;
  total_wins: number;
}

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<StudentStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && role !== 'teacher') {
      navigate('/');
      toast.error('Access denied. Teachers only.');
    }
  }, [role, roleLoading, navigate]);

  useEffect(() => {
    if (role === 'teacher' && classId) {
      fetchClassDetails();
    }
  }, [role, classId]);

  const fetchClassDetails = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch class info
    const { data: classData, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('id', classId)
      .eq('teacher_id', user.id)
      .single();

    if (classError || !classData) {
      toast.error('Class not found or access denied');
      navigate('/teacher-dashboard');
      return;
    }

    // Get member count
    const { count } = await supabase
      .from('class_members')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId);

    setClassInfo({ ...classData, member_count: count || 0 });

    // Fetch students in this class with their stats
    const { data: membersData, error: membersError } = await supabase
      .from('class_members')
      .select(`
        user_id,
        profiles!inner (
          user_id,
          username,
          avatar_url,
          total_xp,
          current_level,
          current_streak,
          total_games,
          total_wins
        )
      `)
      .eq('class_id', classId);

    if (membersError) {
      console.error('Error fetching students:', membersError);
      toast.error('Failed to load students');
    } else {
      const studentsWithStats = (membersData || []).map((member: any) => ({
        user_id: member.user_id,
        username: member.profiles.username || 'Unknown',
        avatar_url: member.profiles.avatar_url,
        total_xp: member.profiles.total_xp || 0,
        current_level: member.profiles.current_level || 1,
        current_streak: member.profiles.current_streak || 0,
        total_games: member.profiles.total_games || 0,
        total_wins: member.profiles.total_wins || 0,
      }));

      // Sort by XP
      studentsWithStats.sort((a, b) => b.total_xp - a.total_xp);
      setStudents(studentsWithStats);
    }

    setLoading(false);
  };

  const copyJoinCode = () => {
    if (classInfo) {
      navigator.clipboard.writeText(classInfo.join_code);
      toast.success('Join code copied!');
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!classInfo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Class Header with Join Code */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="text-3xl">{classInfo.name}</CardTitle>
            {classInfo.school_name && (
              <CardDescription className="text-lg">{classInfo.school_name}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {classInfo.description && (
              <p className="text-muted-foreground">{classInfo.description}</p>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-5 w-5" />
              <span className="font-semibold">{classInfo.member_count} student{classInfo.member_count !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Student Join Code</Label>
              <div className="flex gap-2 max-w-md">
                <Input
                  value={classInfo.join_code}
                  readOnly
                  className="font-mono text-2xl font-bold text-center bg-background"
                />
                <Button
                  size="icon"
                  variant="outline"
                  onClick={copyJoinCode}
                  className="h-14 w-14"
                >
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Students use this code to join your class</p>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
            <CardDescription>Track your students' performance and progress</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No students have joined yet. Share the join code with your students!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Level</TableHead>
                      <TableHead className="text-center">Total XP</TableHead>
                      <TableHead className="text-center">Streak</TableHead>
                      <TableHead className="text-center">Games</TableHead>
                      <TableHead className="text-center">Win Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student, index) => {
                      const winRate = student.total_games > 0
                        ? Math.round((student.total_wins / student.total_games) * 100)
                        : 0;
                      
                      return (
                        <TableRow key={student.user_id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                              {index === 1 && <Trophy className="h-5 w-5 text-gray-400" />}
                              {index === 2 && <Trophy className="h-5 w-5 text-amber-600" />}
                              <span className="font-semibold">#{index + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {student.avatar_url ? (
                                <img 
                                  src={student.avatar_url} 
                                  alt={student.username}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-xs font-semibold">
                                    {student.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <span className="font-medium">{student.username}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="gap-1">
                              <Target className="h-3 w-3" />
                              {student.current_level}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center font-semibold">
                            {student.total_xp.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="gap-1">
                              <Flame className="h-3 w-3 text-orange-500" />
                              {student.current_streak}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {student.total_games}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge 
                              variant={winRate >= 70 ? "default" : winRate >= 50 ? "secondary" : "outline"}
                            >
                              {winRate}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
