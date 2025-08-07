
import { db } from '../db';
import { contactTable } from '../db/schema';
import { type Contact } from '../schema';

export const getContact = async (): Promise<Contact | null> => {
  try {
    const result = await db.select()
      .from(contactTable)
      .limit(1)
      .execute();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error('Contact fetch failed:', error);
    throw error;
  }
};
