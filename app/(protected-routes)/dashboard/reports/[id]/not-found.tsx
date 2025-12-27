"use client";
import React from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Files } from 'lucide-react'
import { useHasAnyRole } from "@/hooks/use-user-role";
import { Button } from '@/components/ui/button'
import Link from 'next/link'
const NotFound = () => {
    const hasAnyRole = useHasAnyRole();
    const isAuthorizedForEdit = () => {
    if(hasAnyRole(['ADMIN', 'SUPERADMIN', 'STAFF'])) return true;
    return false;
  };
  return (
    <div className='mt-12'>
    <Empty className="border mt-12 border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Files />
        </EmptyMedia>
        <EmptyTitle>Reports Not Found</EmptyTitle>
        <EmptyDescription>
          Please ensure you are accessing a valid report. If the problem persists, contact support.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
    </div>
  )
}

export default NotFound