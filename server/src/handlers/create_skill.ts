
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type CreateSkillInput, type Skill } from '../schema';

export const createSkill = async (input: CreateSkillInput): Promise<Skill> => {
  try {
    // Insert skill record
    const result = await db.insert(skillsTable)
      .values({
        name: input.name,
        level: input.level,
        category: input.category
      })
      .returning()
      .execute();

    // Return the created skill
    const skill = result[0];
    return skill;
  } catch (error) {
    console.error('Skill creation failed:', error);
    throw error;
  }
};
