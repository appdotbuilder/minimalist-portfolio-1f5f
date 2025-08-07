
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { type AboutMe } from '../schema';

export const getAboutMe = async (): Promise<AboutMe | null> => {
  try {
    // Get the first (and should be only) about me record
    const results = await db.select()
      .from(aboutMeTable)
      .limit(1)
      .execute();

    // Return null if no record exists
    if (results.length === 0) {
      return null;
    }

    // Return the first record
    return results[0];
  } catch (error) {
    console.error('Failed to get about me information:', error);
    throw error;
  }
};
