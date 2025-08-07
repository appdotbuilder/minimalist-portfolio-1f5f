
import { serial, text, pgTable, timestamp, boolean } from 'drizzle-orm/pg-core';

export const aboutMeTable = pgTable('about_me', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  profile_image_url: text('profile_image_url'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const skillsTable = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  level: text('level').notNull(),
  category: text('category').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: text('technologies').notNull(),
  project_url: text('project_url'),
  github_url: text('github_url'),
  image_url: text('image_url'),
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const contactTable = pgTable('contact', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  phone: text('phone'),
  linkedin_url: text('linkedin_url'),
  github_url: text('github_url'),
  twitter_url: text('twitter_url'),
  location: text('location'),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Export all tables for relation queries
export const tables = {
  aboutMe: aboutMeTable,
  skills: skillsTable,
  projects: projectsTable,
  contact: contactTable
};
