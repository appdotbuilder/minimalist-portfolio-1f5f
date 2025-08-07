
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Simple test input with all fields
const testInput: CreateProjectInput = {
  title: 'Test Project',
  description: 'A project for testing purposes',
  technologies: 'React, TypeScript, Node.js',
  project_url: 'https://example.com',
  github_url: 'https://github.com/test/project',
  image_url: 'https://example.com/image.jpg',
  is_featured: true
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Project');
    expect(result.description).toEqual(testInput.description);
    expect(result.technologies).toEqual('React, TypeScript, Node.js');
    expect(result.project_url).toEqual('https://example.com');
    expect(result.github_url).toEqual('https://github.com/test/project');
    expect(result.image_url).toEqual('https://example.com/image.jpg');
    expect(result.is_featured).toBe(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a project with optional fields as null', async () => {
    const minimalInput: CreateProjectInput = {
      title: 'Minimal Project',
      description: 'A minimal project for testing',
      technologies: 'JavaScript'
    };

    const result = await createProject(minimalInput);

    expect(result.title).toEqual('Minimal Project');
    expect(result.description).toEqual('A minimal project for testing');
    expect(result.technologies).toEqual('JavaScript');
    expect(result.project_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.is_featured).toBe(false);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save project to database', async () => {
    const result = await createProject(testInput);

    // Query using proper drizzle syntax
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Test Project');
    expect(projects[0].description).toEqual(testInput.description);
    expect(projects[0].technologies).toEqual('React, TypeScript, Node.js');
    expect(projects[0].project_url).toEqual('https://example.com');
    expect(projects[0].github_url).toEqual('https://github.com/test/project');
    expect(projects[0].image_url).toEqual('https://example.com/image.jpg');
    expect(projects[0].is_featured).toBe(true);
    expect(projects[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle featured project correctly', async () => {
    const featuredInput: CreateProjectInput = {
      title: 'Featured Project',
      description: 'A featured project',
      technologies: 'Vue.js',
      is_featured: true
    };

    const result = await createProject(featuredInput);

    expect(result.is_featured).toBe(true);

    // Verify in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects[0].is_featured).toBe(true);
  });
});
