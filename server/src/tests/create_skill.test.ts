
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateSkillInput = {
  name: 'JavaScript',
  level: 'Advanced',
  category: 'Programming'
};

describe('createSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a skill', async () => {
    const result = await createSkill(testInput);

    // Basic field validation
    expect(result.name).toEqual('JavaScript');
    expect(result.level).toEqual('Advanced');
    expect(result.category).toEqual('Programming');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save skill to database', async () => {
    const result = await createSkill(testInput);

    // Query using proper drizzle syntax
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('JavaScript');
    expect(skills[0].level).toEqual('Advanced');
    expect(skills[0].category).toEqual('Programming');
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different skill levels', async () => {
    const beginnerInput: CreateSkillInput = {
      name: 'Python',
      level: 'Beginner',
      category: 'Programming'
    };

    const expertInput: CreateSkillInput = {
      name: 'TypeScript',
      level: 'Expert',
      category: 'Programming'
    };

    const beginnerSkill = await createSkill(beginnerInput);
    const expertSkill = await createSkill(expertInput);

    expect(beginnerSkill.level).toEqual('Beginner');
    expect(expertSkill.level).toEqual('Expert');
    expect(beginnerSkill.id).not.toEqual(expertSkill.id);
  });

  it('should handle different skill categories', async () => {
    const designInput: CreateSkillInput = {
      name: 'Figma',
      level: 'Intermediate',
      category: 'Design'
    };

    const languageInput: CreateSkillInput = {
      name: 'Spanish',
      level: 'Advanced',
      category: 'Languages'
    };

    const designSkill = await createSkill(designInput);
    const languageSkill = await createSkill(languageInput);

    expect(designSkill.category).toEqual('Design');
    expect(languageSkill.category).toEqual('Languages');
  });
});
