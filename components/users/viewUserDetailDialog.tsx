'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mail, Phone, Hash, Building2, Briefcase, GraduationCap, Calendar, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { getInitials, getDepartmentColor } from '@/lib/utils/badge-helpers';

interface ViewUserDetailDialogProps {
  accountId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserDetail {
  ACCOUNT_ID: string;
  NAME: string;
  EMAIL: string;
  CONTACT_NUMBER: string;
  ACCOUNT_TYPE: 'STUDENT' | 'STAFF';
  CREATED_AT: string;
  UPDATED_AT: string;
  // Student fields
  STUDENT_ID?: string;
  PROGRAM?: string;
  SEMESTER?: number;
  YEAR_OF_STUDY?: number;
  // Staff fields
  STAFF_ID?: string;
  SUPERVISOR_ID?: string;
  ROLE?: string;
  DEPARTMENT?: string;
  POSITION?: string;
  AVATAR_URL?: string;
}

export function ViewUserDetailDialog({ accountId, open, onOpenChange }: ViewUserDetailDialogProps) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserDetail | null>(null);

  useEffect(() => {
    if (open && accountId) {
      fetchUserDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, accountId]);

  const fetchUserDetails = async () => {
    if (!accountId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/accounts/${accountId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View complete information about this user account
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.AVATAR_URL} alt={user.NAME} />
                <AvatarFallback className="text-lg">
                  {getInitials(user.NAME)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{user.NAME}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    {user.ACCOUNT_TYPE}
                  </Badge>
                  {user.ROLE && (
                    <Badge variant="outline" className="text-purple-500 border-purple-500/50">
                      <Shield className="h-3 w-3 mr-1" />
                      {user.ROLE}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase">Contact Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{user.EMAIL}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm font-medium">{user.CONTACT_NUMBER || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Student Information */}
            {user.ACCOUNT_TYPE === 'STUDENT' && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Student Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Student ID</p>
                        <p className="text-sm font-mono font-medium">{user.STUDENT_ID}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Program</p>
                        <p className="text-sm font-medium">{user.PROGRAM}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Semester</p>
                        <p className="text-sm font-medium">{user.SEMESTER}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Year of Study</p>
                        <p className="text-sm font-medium">Year {user.YEAR_OF_STUDY}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Staff Information */}
            {user.ACCOUNT_TYPE === 'STAFF' && (
              <>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase">Staff Information</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Staff ID</p>
                        <p className="text-sm font-mono font-medium">{user.STAFF_ID}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Department</p>
                        <Badge className={getDepartmentColor(user.DEPARTMENT || '')}>
                          {user.DEPARTMENT}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Position</p>
                        <p className="text-sm font-medium">{user.POSITION}</p>
                      </div>
                    </div>
                    {user.SUPERVISOR_ID !== null && (<div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Supervisor ID</p>
                        <p className="text-sm font-medium">{user.SUPERVISOR_ID}</p>
                      </div>
                    </div>)}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Account Metadata */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase">Account Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Account ID</p>
                  <p className="text-sm font-mono">{user.ACCOUNT_ID}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created At</p>
                  <p className="text-sm">{formatDate(user.CREATED_AT)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{formatDate(user.UPDATED_AT)}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No user details available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
