
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';

export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        title: input.title,
        description: input.description,
        technologies: input.technologies,
        project_url: input.project_url || null,
        github_url: input.github_url || null,
        image_url: input.image_url || null,
        is_featured: input.is_featured || false
      })
      .returning()
      .execute();

    const project = result[0];
    return project;
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};
