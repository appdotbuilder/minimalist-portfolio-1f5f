
import { db } from '../db';
import { contactTable } from '../db/schema';
import { type UpdateContactInput, type Contact } from '../schema';
import { eq } from 'drizzle-orm';

export const updateContact = async (input: UpdateContactInput): Promise<Contact> => {
  try {
    // Check if a contact record already exists
    const existingContact = await db.select()
      .from(contactTable)
      .limit(1)
      .execute();

    if (existingContact.length > 0) {
      // Update existing record
      const result = await db.update(contactTable)
        .set({
          email: input.email,
          phone: input.phone ?? null,
          linkedin_url: input.linkedin_url ?? null,
          github_url: input.github_url ?? null,
          twitter_url: input.twitter_url ?? null,
          location: input.location ?? null,
          updated_at: new Date()
        })
        .where(eq(contactTable.id, existingContact[0].id))
        .returning()
        .execute();

      return result[0];
    } else {
      // Create new record
      const result = await db.insert(contactTable)
        .values({
          email: input.email,
          phone: input.phone ?? null,
          linkedin_url: input.linkedin_url ?? null,
          github_url: input.github_url ?? null,
          twitter_url: input.twitter_url ?? null,
          location: input.location ?? null
        })
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Contact update failed:', error);
    throw error;
  }
};
