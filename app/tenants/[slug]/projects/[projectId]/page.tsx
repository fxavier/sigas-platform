// app/tenants/[slug]/projects/[projectId]/page.tsx
import { db } from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ProjectPageProps {
  params: {
    slug: string;
    projectId: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Get project details with user count
  const project = await db.project.findUnique({
    where: {
      id: params.projectId,
    },
    include: {
      _count: {
        select: {
          userProjects: true,
        },
      },
    },
  });

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
          <CardDescription>Key details about this project</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Created</h3>
              <p>{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>
                Last Updated
              </h3>
              <p>{new Date(project.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className='text-sm font-medium text-gray-500'>Team Size</h3>
              <p>{project._count.userProjects} members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional project cards can be added here */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-gray-500'>No recent activity to display.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for this project</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='space-y-2'>
            <li className='text-blue-600 hover:underline cursor-pointer'>
              View project details
            </li>
            <li className='text-blue-600 hover:underline cursor-pointer'>
              Manage team members
            </li>
            <li className='text-blue-600 hover:underline cursor-pointer'>
              View project settings
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
