
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await db.delete(projectsTable)
      .where(eq(projectsTable.id, id))
      .execute();
  } catch (error) {
    console.error('Project deletion failed:', error);
    throw error;
  }
};
