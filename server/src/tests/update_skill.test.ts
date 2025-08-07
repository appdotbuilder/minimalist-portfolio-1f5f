
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput, type UpdateSkillInput } from '../schema';
import { updateSkill } from '../handlers/update_skill';
import { eq } from 'drizzle-orm';

// Test input for creating a skill
const createSkillInput: CreateSkillInput = {
  name: 'JavaScript',
  level: 'Intermediate',
  category: 'Programming'
};

describe('updateSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of a skill', async () => {
    // Create a skill first
    const createdSkill = await db.insert(skillsTable)
      .values(createSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    // Update all fields
    const updateInput: UpdateSkillInput = {
      id: skillId,
      name: 'TypeScript',
      level: 'Advanced',
      category: 'Programming Languages'
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(skillId);
    expect(result.name).toEqual('TypeScript');
    expect(result.level).toEqual('Advanced');
    expect(result.category).toEqual('Programming Languages');
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only provided fields', async () => {
    // Create a skill first
    const createdSkill = await db.insert(skillsTable)
      .values(createSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    // Update only the level
    const updateInput: UpdateSkillInput = {
      id: skillId,
      level: 'Expert'
    };

    const result = await updateSkill(updateInput);

    expect(result.id).toEqual(skillId);
    expect(result.name).toEqual('JavaScript'); // Should remain unchanged
    expect(result.level).toEqual('Expert'); // Should be updated
    expect(result.category).toEqual('Programming'); // Should remain unchanged
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save updated skill to database', async () => {
    // Create a skill first
    const createdSkill = await db.insert(skillsTable)
      .values(createSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    // Update the skill
    const updateInput: UpdateSkillInput = {
      id: skillId,
      name: 'React',
      category: 'Frontend Framework'
    };

    await updateSkill(updateInput);

    // Verify the changes were persisted
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillId))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('React');
    expect(skills[0].level).toEqual('Intermediate'); // Should remain unchanged
    expect(skills[0].category).toEqual('Frontend Framework');
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should throw error when skill does not exist', async () => {
    const updateInput: UpdateSkillInput = {
      id: 999, // Non-existent ID
      name: 'Non-existent Skill'
    };

    expect(updateSkill(updateInput)).rejects.toThrow(/skill with id 999 not found/i);
  });

  it('should handle empty update gracefully', async () => {
    // Create a skill first
    const createdSkill = await db.insert(skillsTable)
      .values(createSkillInput)
      .returning()
      .execute();

    const skillId = createdSkill[0].id;

    // Update with only ID (no fields to update)
    const updateInput: UpdateSkillInput = {
      id: skillId
    };

    const result = await updateSkill(updateInput);

    // Should return the skill unchanged
    expect(result.id).toEqual(skillId);
    expect(result.name).toEqual('JavaScript');
    expect(result.level).toEqual('Intermediate');
    expect(result.category).toEqual('Programming');
    expect(result.created_at).toBeInstanceOf(Date);
  });
});
