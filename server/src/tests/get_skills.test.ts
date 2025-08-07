
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { getSkills } from '../handlers/get_skills';

// Test skills data
const testSkills: CreateSkillInput[] = [
  {
    name: 'JavaScript',
    level: 'Advanced',
    category: 'Programming'
  },
  {
    name: 'TypeScript',
    level: 'Advanced',
    category: 'Programming'
  },
  {
    name: 'Photoshop',
    level: 'Intermediate',
    category: 'Design'
  },
  {
    name: 'React',
    level: 'Expert',
    category: 'Frontend'
  }
];

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no skills exist', async () => {
    const result = await getSkills();

    expect(result).toEqual([]);
  });

  it('should return all skills', async () => {
    // Create test skills
    await db.insert(skillsTable)
      .values(testSkills)
      .execute();

    const result = await getSkills();

    expect(result).toHaveLength(4);
    expect(result[0].name).toBeDefined();
    expect(result[0].level).toBeDefined();
    expect(result[0].category).toBeDefined();
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should order skills by category then by name', async () => {
    // Create test skills
    await db.insert(skillsTable)
      .values(testSkills)
      .execute();

    const result = await getSkills();

    // Verify ordering: Design < Frontend < Programming
    expect(result[0].category).toEqual('Design');
    expect(result[0].name).toEqual('Photoshop');

    expect(result[1].category).toEqual('Frontend');
    expect(result[1].name).toEqual('React');

    expect(result[2].category).toEqual('Programming');
    expect(result[2].name).toEqual('JavaScript'); // JavaScript comes before TypeScript alphabetically

    expect(result[3].category).toEqual('Programming');
    expect(result[3].name).toEqual('TypeScript');
  });

  it('should return skills with correct data types', async () => {
    await db.insert(skillsTable)
      .values([testSkills[0]])
      .execute();

    const result = await getSkills();

    expect(result).toHaveLength(1);
    const skill = result[0];
    expect(typeof skill.id).toBe('number');
    expect(typeof skill.name).toBe('string');
    expect(typeof skill.level).toBe('string');
    expect(typeof skill.category).toBe('string');
    expect(skill.created_at).toBeInstanceOf(Date);
  });
});
