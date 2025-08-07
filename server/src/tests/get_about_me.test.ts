
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { aboutMeTable } from '../db/schema';
import { getAboutMe } from '../handlers/get_about_me';

describe('getAboutMe', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no about me record exists', async () => {
    const result = await getAboutMe();
    expect(result).toBeNull();
  });

  it('should return about me record when one exists', async () => {
    // Create test about me record
    await db.insert(aboutMeTable)
      .values({
        title: 'Full Stack Developer',
        description: 'Passionate developer with experience in modern web technologies',
        profile_image_url: 'https://example.com/profile.jpg'
      })
      .execute();

    const result = await getAboutMe();

    expect(result).not.toBeNull();
    expect(result?.title).toEqual('Full Stack Developer');
    expect(result?.description).toEqual('Passionate developer with experience in modern web technologies');
    expect(result?.profile_image_url).toEqual('https://example.com/profile.jpg');
    expect(result?.id).toBeDefined();
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return only the first record when multiple exist', async () => {
    // Create multiple about me records (edge case)
    await db.insert(aboutMeTable)
      .values([
        {
          title: 'First Developer',
          description: 'First description',
          profile_image_url: null
        },
        {
          title: 'Second Developer',
          description: 'Second description',
          profile_image_url: 'https://example.com/second.jpg'
        }
      ])
      .execute();

    const result = await getAboutMe();

    expect(result).not.toBeNull();
    expect(result?.title).toEqual('First Developer');
    expect(result?.description).toEqual('First description');
    expect(result?.profile_image_url).toBeNull();
  });

  it('should handle null profile image url correctly', async () => {
    // Create about me record with null profile image
    await db.insert(aboutMeTable)
      .values({
        title: 'Developer',
        description: 'A developer without profile image',
        profile_image_url: null
      })
      .execute();

    const result = await getAboutMe();

    expect(result).not.toBeNull();
    expect(result?.profile_image_url).toBeNull();
    expect(result?.title).toEqual('Developer');
    expect(result?.description).toEqual('A developer without profile image');
  });
});
