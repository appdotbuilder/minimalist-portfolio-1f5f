
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { deleteProject } from '../handlers/delete_project';
import { eq } from 'drizzle-orm';

// Test project data
const testProject: CreateProjectInput = {
  title: 'Test Project',
  description: 'A test project for deletion',
  technologies: 'JavaScript, React, Node.js',
  project_url: 'https://test-project.com',
  github_url: 'https://github.com/test/project',
  image_url: 'https://test-image.com/project.jpg',
  is_featured: false
};

describe('deleteProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a project by id', async () => {
    // Create a test project first
    const result = await db.insert(projectsTable)
      .values({
        title: testProject.title,
        description: testProject.description,
        technologies: testProject.technologies,
        project_url: testProject.project_url,
        github_url: testProject.github_url,
        image_url: testProject.image_url,
        is_featured: testProject.is_featured ?? false
      })
      .returning()
      .execute();

    const projectId = result[0].id;

    // Verify project exists before deletion
    const beforeDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();
    
    expect(beforeDelete).toHaveLength(1);

    // Delete the project
    await deleteProject(projectId);

    // Verify project no longer exists
    const afterDelete = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(afterDelete).toHaveLength(0);
  });

  it('should not throw error when deleting non-existent project', async () => {
    // Try to delete a project with non-existent ID - should complete without throwing
    await deleteProject(999);
    
    // If we reach this line, the function didn't throw
    expect(true).toBe(true);
  });

  it('should only delete the specified project', async () => {
    // Create multiple test projects
    const project1 = await db.insert(projectsTable)
      .values({
        title: 'Project 1',
        description: 'First project',
        technologies: 'React',
        is_featured: false
      })
      .returning()
      .execute();

    const project2 = await db.insert(projectsTable)
      .values({
        title: 'Project 2',
        description: 'Second project',
        technologies: 'Vue',
        is_featured: false
      })
      .returning()
      .execute();

    // Delete only the first project
    await deleteProject(project1[0].id);

    // Verify first project is deleted
    const deletedProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project1[0].id))
      .execute();

    expect(deletedProject).toHaveLength(0);

    // Verify second project still exists
    const remainingProject = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, project2[0].id))
      .execute();

    expect(remainingProject).toHaveLength(1);
    expect(remainingProject[0].title).toBe('Project 2');
  });
});
