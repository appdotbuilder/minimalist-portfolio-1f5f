
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactTable } from '../db/schema';
import { getContact } from '../handlers/get_contact';

describe('getContact', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no contact exists', async () => {
    const result = await getContact();
    expect(result).toBeNull();
  });

  it('should return contact when one exists', async () => {
    // Create test contact
    const contactData = {
      email: 'test@example.com',
      phone: '+1234567890',
      linkedin_url: 'https://linkedin.com/in/test',
      github_url: 'https://github.com/test',
      twitter_url: 'https://twitter.com/test',
      location: 'Test City, Test Country'
    };

    await db.insert(contactTable)
      .values(contactData)
      .execute();

    const result = await getContact();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('test@example.com');
    expect(result!.phone).toEqual('+1234567890');
    expect(result!.linkedin_url).toEqual('https://linkedin.com/in/test');
    expect(result!.github_url).toEqual('https://github.com/test');
    expect(result!.twitter_url).toEqual('https://twitter.com/test');
    expect(result!.location).toEqual('Test City, Test Country');
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return first contact when multiple exist', async () => {
    // Create first contact
    const firstContact = {
      email: 'first@example.com',
      phone: '+1111111111',
      location: 'First City'
    };

    const firstResult = await db.insert(contactTable)
      .values(firstContact)
      .returning()
      .execute();

    // Create second contact
    const secondContact = {
      email: 'second@example.com',
      phone: '+2222222222',
      location: 'Second City'
    };

    await db.insert(contactTable)
      .values(secondContact)
      .execute();

    const result = await getContact();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('first@example.com');
    expect(result!.id).toEqual(firstResult[0].id);
  });

  it('should handle contacts with null fields', async () => {
    // Create contact with minimal required fields
    const contactData = {
      email: 'minimal@example.com',
      phone: null,
      linkedin_url: null,
      github_url: null,
      twitter_url: null,
      location: null
    };

    await db.insert(contactTable)
      .values(contactData)
      .execute();

    const result = await getContact();

    expect(result).not.toBeNull();
    expect(result!.email).toEqual('minimal@example.com');
    expect(result!.phone).toBeNull();
    expect(result!.linkedin_url).toBeNull();
    expect(result!.github_url).toBeNull();
    expect(result!.twitter_url).toBeNull();
    expect(result!.location).toBeNull();
    expect(result!.id).toBeDefined();
    expect(result!.updated_at).toBeInstanceOf(Date);
  });
});
