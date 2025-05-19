import { Project } from '@prisma/client';

export type ProjectWithCount = Project & {
  _count: {
    userProjects: number;
  };
};
