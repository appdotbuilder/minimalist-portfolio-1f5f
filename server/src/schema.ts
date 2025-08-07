
import { z } from 'zod';

// About Me schema
export const aboutMeSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  profile_image_url: z.string().nullable(),
  updated_at: z.coerce.date()
});

export type AboutMe = z.infer<typeof aboutMeSchema>;

export const updateAboutMeInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  profile_image_url: z.string().nullable().optional()
});

export type UpdateAboutMeInput = z.infer<typeof updateAboutMeInputSchema>;

// Skills schema
export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  level: z.string(), // e.g., "Beginner", "Intermediate", "Advanced", "Expert"
  category: z.string(), // e.g., "Programming", "Design", "Languages"
  created_at: z.coerce.date()
});

export type Skill = z.infer<typeof skillSchema>;

export const createSkillInputSchema = z.object({
  name: z.string(),
  level: z.string(),
  category: z.string()
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

export const updateSkillInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional()
});

export type UpdateSkillInput = z.infer<typeof updateSkillInputSchema>;

// Projects schema
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  technologies: z.string(), // Comma-separated list of technologies used
  project_url: z.string().nullable(),
  github_url: z.string().nullable(),
  image_url: z.string().nullable(),
  is_featured: z.boolean(),
  created_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

export const createProjectInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  technologies: z.string(),
  project_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_featured: z.boolean().optional()
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().optional(),
  description: z.string().optional(),
  technologies: z.string().optional(),
  project_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_featured: z.boolean().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Contact schema
export const contactSchema = z.object({
  id: z.number(),
  email: z.string(),
  phone: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  github_url: z.string().nullable(),
  twitter_url: z.string().nullable(),
  location: z.string().nullable(),
  updated_at: z.coerce.date()
});

export type Contact = z.infer<typeof contactSchema>;

export const updateContactInputSchema = z.object({
  email: z.string(),
  phone: z.string().nullable().optional(),
  linkedin_url: z.string().nullable().optional(),
  github_url: z.string().nullable().optional(),
  twitter_url: z.string().nullable().optional(),
  location: z.string().nullable().optional()
});

export type UpdateContactInput = z.infer<typeof updateContactInputSchema>;
