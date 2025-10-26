import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/useUserRole';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ClassInfo {
  id: string;
  name: string;
  school_name: string;
  description: string;
  join_code: string;
}

interface StudentProgress {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_xp: number;
  current_level: number;
  total_games: number;
  total_wins: number;
  current_streak: number;
}

export default function ClassDetail() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const { role, loading: roleLoading } = useUserRole();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roleLoading && role !== 'teacher') {
      navigate('/');
      toast.error('Access denied. Teachers only.');
    }
  }, [role, roleLoading, navigate]);

  useEffect(() => {
    if (role === 'teacher' && classId) {
      fetchClassData();
    }
  }, [role, classId]);

  const fetchClassData = async () => {
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

    setClassInfo(classData);

    // Fetch students in the class
    const { data: members, error: membersError } = await supabase
      .from('class_members')
      .select('user_id')
      .eq('class_id', classId);

    if (membersError) {
      console.error('Error fetching class members:', membersError);
      setLoading(false);
      return;
    }

    if (members && members.length > 0) {
      const userIds = members.map(m => m.user_id);
      
      // Fetch profiles for all members
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      } else {
        setStudents(profiles || []);
      }
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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/teacher-dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Class Header with Join Code */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{classInfo.name}</CardTitle>
            {classInfo.school_name && (
              <CardDescription className="text-lg">{classInfo.school_name}</CardDescription>
            )}
            {classInfo.description && (
              <p className="text-muted-foreground mt-2">{classInfo.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Student Join Code</p>
              <div className="flex gap-2 items-center">
                <code className="text-3xl font-bold font-mono tracking-wider bg-background px-4 py-2 rounded">
                  {classInfo.join_code}
                </code>
                <Button size="icon" variant="outline" onClick={copyJoinCode}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Share this code with students to join your class
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Students ({students.length})</h2>
        </div>

        {students.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No students have joined yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {students.map((student) => (
              <Card key={student.user_id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        {student.avatar_url ? (
                          <img 
                            src={student.avatar_url} 
                            alt={student.username} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold">
                            {student.username?.charAt(0).toUpperCase() || '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{student.username || 'Anonymous'}</h3>
                        <p className="text-sm text-muted-foreground">Level {student.current_level}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div>
                        <p className="text-sm text-muted-foreground">Total XP</p>
                        <p className="text-lg font-bold">{student.total_xp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Games Played</p>
                        <p className="text-lg font-bold">{student.total_games}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Win Rate</p>
                        <p className="text-lg font-bold">
                          {student.total_games > 0 
                            ? Math.round((student.total_wins / student.total_games) * 100) 
                            : 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Streak</p>
                        <p className="text-lg font-bold">{student.current_streak} 🔥</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
