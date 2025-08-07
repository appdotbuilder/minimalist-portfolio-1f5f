
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProjects } from '../handlers/get_projects';

const testProject1: CreateProjectInput = {
  title: 'Featured Project',
  description: 'A featured project for testing',
  technologies: 'React, TypeScript, Node.js',
  project_url: 'https://example.com',
  github_url: 'https://github.com/user/project1',
  image_url: 'https://example.com/image1.jpg',
  is_featured: true
};

const testProject2: CreateProjectInput = {
  title: 'Regular Project',
  description: 'A regular project for testing',
  technologies: 'Vue.js, JavaScript, Express',
  project_url: null,
  github_url: 'https://github.com/user/project2',
  image_url: null,
  is_featured: false
};

const testProject3: CreateProjectInput = {
  title: 'Another Featured Project',
  description: 'Another featured project for testing',
  technologies: 'Angular, TypeScript, PostgreSQL',
  project_url: 'https://example2.com',
  github_url: null,
  image_url: null,
  is_featured: true
};

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getProjects();
    expect(result).toEqual([]);
  });

  it('should return all projects', async () => {
    // Insert test projects
    await db.insert(projectsTable).values([
      { ...testProject1 },
      { ...testProject2 }
    ]).execute();

    const result = await getProjects();
    
    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('Featured Project');
    expect(result[1].title).toEqual('Regular Project');
  });

  it('should order projects by featured status first, then by creation date', async () => {
    // Insert projects with slight delay to ensure different timestamps
    await db.insert(projectsTable).values({ ...testProject2 }).execute();
    
    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values({ ...testProject1 }).execute();
    
    // Small delay to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    await db.insert(projectsTable).values({ ...testProject3 }).execute();

    const result = await getProjects();
    
    expect(result).toHaveLength(3);
    
    // Featured projects should come first
    expect(result[0].is_featured).toBe(true);
    expect(result[1].is_featured).toBe(true);
    expect(result[2].is_featured).toBe(false);
    
    // Among featured projects, newer should come first
    expect(result[0].title).toEqual('Another Featured Project'); // Created last
    expect(result[1].title).toEqual('Featured Project'); // Created second
    expect(result[2].title).toEqual('Regular Project'); // Not featured
  });

  it('should return projects with all expected fields', async () => {
    await db.insert(projectsTable).values({ ...testProject1 }).execute();
    
    const result = await getProjects();
    const project = result[0];
    
    expect(project.id).toBeDefined();
    expect(project.title).toEqual('Featured Project');
    expect(project.description).toEqual('A featured project for testing');
    expect(project.technologies).toEqual('React, TypeScript, Node.js');
    expect(project.project_url).toEqual('https://example.com');
    expect(project.github_url).toEqual('https://github.com/user/project1');
    expect(project.image_url).toEqual('https://example.com/image1.jpg');
    expect(project.is_featured).toBe(true);
    expect(project.created_at).toBeInstanceOf(Date);
  });

  it('should handle nullable fields correctly', async () => {
    await db.insert(projectsTable).values({ ...testProject2 }).execute();
    
    const result = await getProjects();
    const project = result[0];
    
    expect(project.project_url).toBeNull();
    expect(project.image_url).toBeNull();
    expect(project.github_url).toEqual('https://github.com/user/project2');
    expect(project.is_featured).toBe(false);
  });
});
