
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { deleteSkill } from '../handlers/delete_skill';
import { eq } from 'drizzle-orm';

// Test skill input
const testSkill: CreateSkillInput = {
  name: 'JavaScript',
  level: 'Advanced',
  category: 'Programming'
};

describe('deleteSkill', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a skill', async () => {
    // Create a test skill first
    const result = await db.insert(skillsTable)
      .values(testSkill)
      .returning()
      .execute();
    
    const skillId = result[0].id;

    // Delete the skill
    await deleteSkill(skillId);

    // Verify skill no longer exists
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, skillId))
      .execute();

    expect(skills).toHaveLength(0);
  });

  it('should not throw error when deleting non-existent skill', async () => {
    // Try to delete a skill that doesn't exist
    const nonExistentId = 999;

    // Should not throw an error - delete operations are idempotent
    expect(async () => {
      await deleteSkill(nonExistentId);
    }).not.toThrow();
  });

  it('should only delete the specified skill', async () => {
    // Create multiple test skills
    const skill1 = await db.insert(skillsTable)
      .values({ ...testSkill, name: 'JavaScript' })
      .returning()
      .execute();

    const skill2 = await db.insert(skillsTable)
      .values({ ...testSkill, name: 'TypeScript' })
      .returning()
      .execute();

    const skill3 = await db.insert(skillsTable)
      .values({ ...testSkill, name: 'Python' })
      .returning()
      .execute();

    // Delete only the middle skill
    await deleteSkill(skill2[0].id);

    // Verify only the specified skill was deleted
    const remainingSkills = await db.select()
      .from(skillsTable)
      .execute();

    expect(remainingSkills).toHaveLength(2);
    expect(remainingSkills.find(s => s.id === skill1[0].id)).toBeDefined();
    expect(remainingSkills.find(s => s.id === skill2[0].id)).toBeUndefined();
    expect(remainingSkills.find(s => s.id === skill3[0].id)).toBeDefined();
  });
});
