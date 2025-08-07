
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { contactTable } from '../db/schema';
import { type UpdateContactInput } from '../schema';
import { updateContact } from '../handlers/update_contact';
import { eq } from 'drizzle-orm';

// Test input with all fields
const testInput: UpdateContactInput = {
  email: 'test@example.com',
  phone: '+1234567890',
  linkedin_url: 'https://linkedin.com/in/testuser',
  github_url: 'https://github.com/testuser',
  twitter_url: 'https://twitter.com/testuser',
  location: 'San Francisco, CA'
};

// Minimal test input
const minimalInput: UpdateContactInput = {
  email: 'minimal@example.com'
};

describe('updateContact', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a new contact when none exists', async () => {
    const result = await updateContact(testInput);

    // Verify basic fields
    expect(result.email).toEqual('test@example.com');
    expect(result.phone).toEqual('+1234567890');
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/testuser');
    expect(result.github_url).toEqual('https://github.com/testuser');
    expect(result.twitter_url).toEqual('https://twitter.com/testuser');
    expect(result.location).toEqual('San Francisco, CA');
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create contact with minimal input', async () => {
    const result = await updateContact(minimalInput);

    expect(result.email).toEqual('minimal@example.com');
    expect(result.phone).toBeNull();
    expect(result.linkedin_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.twitter_url).toBeNull();
    expect(result.location).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save new contact to database', async () => {
    const result = await updateContact(testInput);

    const contacts = await db.select()
      .from(contactTable)
      .where(eq(contactTable.id, result.id))
      .execute();

    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toEqual('test@example.com');
    expect(contacts[0].phone).toEqual('+1234567890');
    expect(contacts[0].linkedin_url).toEqual('https://linkedin.com/in/testuser');
    expect(contacts[0].updated_at).toBeInstanceOf(Date);
  });

  it('should update existing contact when one exists', async () => {
    // Create initial contact
    await updateContact(testInput);

    // Update with different data
    const updateInput: UpdateContactInput = {
      email: 'updated@example.com',
      phone: '+9876543210',
      linkedin_url: 'https://linkedin.com/in/updated',
      location: 'New York, NY'
    };

    const result = await updateContact(updateInput);

    // Verify updated fields
    expect(result.email).toEqual('updated@example.com');
    expect(result.phone).toEqual('+9876543210');
    expect(result.linkedin_url).toEqual('https://linkedin.com/in/updated');
    expect(result.location).toEqual('New York, NY');
    expect(result.github_url).toBeNull(); // Should be null since not provided
    expect(result.twitter_url).toBeNull(); // Should be null since not provided
  });

  it('should maintain single contact record', async () => {
    // Create first contact
    await updateContact(testInput);

    // Update contact
    await updateContact(minimalInput);

    // Verify only one record exists
    const contacts = await db.select()
      .from(contactTable)
      .execute();

    expect(contacts).toHaveLength(1);
    expect(contacts[0].email).toEqual('minimal@example.com');
  });

  it('should update timestamp when modifying existing contact', async () => {
    // Create initial contact
    const first = await updateContact(testInput);
    const firstTimestamp = first.updated_at;

    // Wait a bit to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update the contact
    const second = await updateContact(minimalInput);
    const secondTimestamp = second.updated_at;

    expect(second.id).toEqual(first.id); // Same record
    expect(secondTimestamp).not.toEqual(firstTimestamp); // Different timestamp
    expect(secondTimestamp > firstTimestamp).toBe(true); // Later timestamp
  });
});
