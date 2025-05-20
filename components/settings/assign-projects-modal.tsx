// components/settings/assign-projects-modal.tsx
'use client';

import { useState, useEffect } from 'react';
import { User, Project } from '@prisma/client';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Search, Loader2 } from 'lucide-react';

interface AssignProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  tenantId: string;
  projects: Project[];
}

interface ProjectWithAssignment extends Project {
  isAssigned: boolean;
}

export function AssignProjectsModal({
  isOpen,
  onClose,
  user,
  tenantId,
  projects,
}: AssignProjectsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [userProjects, setUserProjects] = useState<ProjectWithAssignment[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch user's current project assignments
  const {
    data,
    isLoading: isLoadingAssignments,
    refetch,
  } = useQuery({
    queryKey: ['userProjectAssignments', user.id],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${user.id}/projects`);
      return response.data;
    },
    enabled: isOpen,
  });

  // Process projects and assignments when data is loaded
  useEffect(() => {
    if (data && projects) {
      const assignedProjectIds = new Set(
        data.map((p: Project) => p.id)
      ) as Set<string>;

      // Mark projects as assigned and build initial selection
      const projectsWithAssignment = projects.map((project) => ({
        ...project,
        isAssigned: assignedProjectIds.has(project.id),
      }));

      setUserProjects(projectsWithAssignment);
      setSelectedProjects(assignedProjectIds);
    }
  }, [data, projects]);

  // Filter projects based on search
  const filteredProjects = searchQuery
    ? userProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : userProjects;

  // Toggle project selection
  const toggleProject = (projectId: string) => {
    const newSelected = new Set(selectedProjects);

    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }

    setSelectedProjects(newSelected);
  };

  // Save project assignments
  const handleSave = async () => {
    try {
      setIsSaving(true);

      await axios.put(`/api/users/${user.id}/projects`, {
        projectIds: Array.from(selectedProjects),
      });

      toast.success('Projects updated', {
        description: `Project assignments have been updated for ${
          user.name || user.email
        }.`,
      });

      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data || 'Failed to update project assignments.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Assign Projects</DialogTitle>
          <DialogDescription>
            Manage project assignments for {user.name || user.email}.
          </DialogDescription>
        </DialogHeader>

        <div className='py-4'>
          <div className='relative mb-4'>
            <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='Search projects...'
              className='pl-8'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoadingAssignments ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className='text-center py-8'>
              <p className='text-muted-foreground'>No projects found</p>
            </div>
          ) : (
            <ScrollArea className='h-72 rounded-md border'>
              <div className='p-4 space-y-2'>
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className='flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100'
                  >
                    <Checkbox
                      id={`project-${project.id}`}
                      checked={selectedProjects.has(project.id)}
                      onCheckedChange={() => toggleProject(project.id)}
                    />
                    <label
                      htmlFor={`project-${project.id}`}
                      className='flex-1 text-sm cursor-pointer'
                    >
                      <div className='font-medium'>{project.name}</div>
                      <div className='text-xs text-gray-500'>
                        {project.description}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className='sm:justify-between'>
          <div className='text-sm text-muted-foreground'>
            {selectedProjects.size} projects selected
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isLoadingAssignments}
            >
              {isSaving ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save Assignments'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
