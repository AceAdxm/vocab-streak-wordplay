import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'student' | 'teacher' | 'admin';

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setRole('student'); // Default to student
      } else {
        setRole(data?.role as UserRole || 'student');
      }
      
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { role, loading, isTeacher: role === 'teacher', isAdmin: role === 'admin' };
};
