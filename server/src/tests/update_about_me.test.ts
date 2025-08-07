
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { type UpdateAboutMeInput } from '../schema';
import { updateAboutMe } from '../handlers/update_about_me';
import { eq } from 'drizzle-orm';

// Test input
const testInput: UpdateAboutMeInput = {
  title: 'John Doe - Full Stack Developer',
  description: 'Passionate full stack developer with 5+ years of experience building web applications.',
  profile_image_url: 'https://example.com/profile.jpg'
};

describe('updateAboutMe', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create new about me record when none exists', async () => {
    const result = await updateAboutMe(testInput);

    // Basic field validation
    expect(result.title).toEqual('John Doe - Full Stack Developer');
    expect(result.description).toEqual(testInput.description);
    expect(result.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save new record to database correctly', async () => {
    const result = await updateAboutMe(testInput);

    // Query database to verify record was saved
    const records = await db.select()
      .from(aboutMeTable)
      .where(eq(aboutMeTable.id, result.id))
      .execute();

    expect(records).toHaveLength(1);
    expect(records[0].title).toEqual('John Doe - Full Stack Developer');
    expect(records[0].description).toEqual(testInput.description);
    expect(records[0].profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(records[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update existing record when one exists', async () => {
    // Create initial record
    await updateAboutMe(testInput);

    // Update with new data
    const updatedInput: UpdateAboutMeInput = {
      title: 'Jane Smith - Senior Developer',
      description: 'Senior developer specializing in React and Node.js.',
      profile_image_url: 'https://example.com/jane.jpg'
    };

    const result = await updateAboutMe(updatedInput);

    // Verify updated fields
    expect(result.title).toEqual('Jane Smith - Senior Developer');
    expect(result.description).toEqual('Senior developer specializing in React and Node.js.');
    expect(result.profile_image_url).toEqual('https://example.com/jane.jpg');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should maintain only one record in database', async () => {
    // Create initial record
    await updateAboutMe(testInput);

    // Update record
    const updatedInput: UpdateAboutMeInput = {
      title: 'Updated Title',
      description: 'Updated description.',
      profile_image_url: null
    };

    await updateAboutMe(updatedInput);

    // Verify only one record exists
    const allRecords = await db.select()
      .from(aboutMeTable)
      .execute();

    expect(allRecords).toHaveLength(1);
    expect(allRecords[0].title).toEqual('Updated Title');
    expect(allRecords[0].description).toEqual('Updated description.');
    expect(allRecords[0].profile_image_url).toBeNull();
  });

  it('should handle null profile_image_url correctly', async () => {
    const inputWithNullImage: UpdateAboutMeInput = {
      title: 'Test Title',
      description: 'Test description.',
      profile_image_url: null
    };

    const result = await updateAboutMe(inputWithNullImage);

    expect(result.profile_image_url).toBeNull();

    // Verify in database
    const records = await db.select()
      .from(aboutMeTable)
      .where(eq(aboutMeTable.id, result.id))
      .execute();

    expect(records[0].profile_image_url).toBeNull();
  });

  it('should handle undefined profile_image_url correctly', async () => {
    const inputWithUndefinedImage: UpdateAboutMeInput = {
      title: 'Test Title',
      description: 'Test description.'
      // profile_image_url is optional and undefined
    };

    const result = await updateAboutMe(inputWithUndefinedImage);

    expect(result.profile_image_url).toBeNull();

    // Verify in database
    const records = await db.select()
      .from(aboutMeTable)
      .where(eq(aboutMeTable.id, result.id))
      .execute();

    expect(records[0].profile_image_url).toBeNull();
  });

  it('should update updated_at timestamp when updating existing record', async () => {
    // Create initial record
    const initialResult = await updateAboutMe(testInput);
    const initialTimestamp = initialResult.updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update record
    const updatedInput: UpdateAboutMeInput = {
      title: 'Updated Title',
      description: 'Updated description.',
      profile_image_url: 'https://example.com/updated.jpg'
    };

    const updatedResult = await updateAboutMe(updatedInput);

    // Verify timestamp was updated
    expect(updatedResult.updated_at.getTime()).toBeGreaterThan(initialTimestamp.getTime());
  });
});
