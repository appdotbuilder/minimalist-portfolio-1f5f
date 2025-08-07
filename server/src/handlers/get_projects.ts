
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { desc } from 'drizzle-orm';
import { type Project } from '../schema';

export const getProjects = async (): Promise<Project[]> => {
  try {
    // Fetch all projects ordered by featured status first, then by creation date (newest first)
    const results = await db.select()
      .from(projectsTable)
      .orderBy(desc(projectsTable.is_featured), desc(projectsTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};
