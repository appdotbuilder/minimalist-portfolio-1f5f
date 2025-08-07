
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type CreateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

// Test data
const testProject: CreateProjectInput = {
  title: 'Original Project',
  description: 'Original description',
  technologies: 'React, TypeScript',
  project_url: 'https://original.com',
  github_url: 'https://github.com/original',
  image_url: 'https://original-image.com',
  is_featured: false
};

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update a project with all fields', async () => {
    // Create test project first
    const created = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = created[0].id;

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Updated Project',
      description: 'Updated description',
      technologies: 'Vue, JavaScript',
      project_url: 'https://updated.com',
      github_url: 'https://github.com/updated',
      image_url: 'https://updated-image.com',
      is_featured: true
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title).toEqual('Updated Project');
    expect(result.description).toEqual('Updated description');
    expect(result.technologies).toEqual('Vue, JavaScript');
    expect(result.project_url).toEqual('https://updated.com');
    expect(result.github_url).toEqual('https://github.com/updated');
    expect(result.image_url).toEqual('https://updated-image.com');
    expect(result.is_featured).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    // Create test project first
    const created = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = created[0].id;

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Updated Title Only',
      is_featured: true
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.title).toEqual('Updated Title Only');
    expect(result.description).toEqual('Original description'); // Should remain unchanged
    expect(result.technologies).toEqual('React, TypeScript'); // Should remain unchanged
    expect(result.project_url).toEqual('https://original.com'); // Should remain unchanged
    expect(result.github_url).toEqual('https://github.com/original'); // Should remain unchanged
    expect(result.image_url).toEqual('https://original-image.com'); // Should remain unchanged
    expect(result.is_featured).toEqual(true); // Should be updated
  });

  it('should save updated project to database', async () => {
    // Create test project first
    const created = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = created[0].id;

    const updateInput: UpdateProjectInput = {
      id: projectId,
      title: 'Database Test Update'
    };

    await updateProject(updateInput);

    // Verify in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, projectId))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Database Test Update');
    expect(projects[0].description).toEqual('Original description');
  });

  it('should handle null values correctly', async () => {
    // Create test project first
    const created = await db.insert(projectsTable)
      .values(testProject)
      .returning()
      .execute();

    const projectId = created[0].id;

    const updateInput: UpdateProjectInput = {
      id: projectId,
      project_url: null,
      github_url: null,
      image_url: null
    };

    const result = await updateProject(updateInput);

    expect(result.id).toEqual(projectId);
    expect(result.project_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.title).toEqual('Original Project'); // Should remain unchanged
  });

  it('should throw error for non-existent project', async () => {
    const updateInput: UpdateProjectInput = {
      id: 999999,
      title: 'This should fail'
    };

    expect(updateProject(updateInput)).rejects.toThrow(/not found/i);
  });
});
