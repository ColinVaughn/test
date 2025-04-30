
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type UserData = {
  id: string;
  email: string;
  created_at: string;
  is_admin: boolean;
};

export default function AdminUserManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch users from the user_profiles table which is more accessible
      // than directly accessing auth.users through admin API
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get admin status for each user
      const { data: admins, error: adminError } = await supabase
        .from('admins')
        .select('user_id');

      if (adminError) throw adminError;

      const adminIds = new Set(admins?.map(admin => admin.user_id));

      // Format user data for display
      const formattedUsers = profiles.map(profile => ({
        id: profile.user_id,
        email: profile.email || 'No email',
        created_at: new Date(profile.created_at).toLocaleDateString(),
        is_admin: adminIds.has(profile.user_id)
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gaming-dark/30 rounded-lg p-6">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="bg-gaming-dark/30 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell>
                <Badge variant={user.is_admin ? "default" : "secondary"}>
                  {user.is_admin ? 'Admin' : 'User'}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
