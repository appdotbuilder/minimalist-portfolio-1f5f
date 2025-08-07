
import { db } from '../db';
import { skillsTable } from '../db/schema';
import { type UpdateSkillInput, type Skill } from '../schema';
import { eq } from 'drizzle-orm';

export const updateSkill = async (input: UpdateSkillInput): Promise<Skill> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {};
    
    if (input.name !== undefined) {
      updateData['name'] = input.name;
    }
    
    if (input.level !== undefined) {
      updateData['level'] = input.level;
    }
    
    if (input.category !== undefined) {
      updateData['category'] = input.category;
    }

    // If no fields to update, just return the existing skill
    if (Object.keys(updateData).length === 0) {
      const existing = await db.select()
        .from(skillsTable)
        .where(eq(skillsTable.id, input.id))
        .execute();

      if (existing.length === 0) {
        throw new Error(`Skill with id ${input.id} not found`);
      }

      return existing[0];
    }

    // Update skill record
    const result = await db.update(skillsTable)
      .set(updateData)
      .where(eq(skillsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Skill with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Skill update failed:', error);
    throw error;
  }
};
