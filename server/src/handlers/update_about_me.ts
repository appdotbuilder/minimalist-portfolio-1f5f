
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { type UpdateAboutMeInput, type AboutMe } from '../schema';
import { eq } from 'drizzle-orm';

export const updateAboutMe = async (input: UpdateAboutMeInput): Promise<AboutMe> => {
  try {
    // Check if a record exists
    const existing = await db.select()
      .from(aboutMeTable)
      .limit(1)
      .execute();

    if (existing.length === 0) {
      // No record exists, create one
      const result = await db.insert(aboutMeTable)
        .values({
          title: input.title,
          description: input.description,
          profile_image_url: input.profile_image_url ?? null
        })
        .returning()
        .execute();

      return result[0];
    } else {
      // Record exists, update it
      const result = await db.update(aboutMeTable)
        .set({
          title: input.title,
          description: input.description,
          profile_image_url: input.profile_image_url ?? null,
          updated_at: new Date()
        })
        .where(eq(aboutMeTable.id, existing[0].id))
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('About me update failed:', error);
    throw error;
  }
};
