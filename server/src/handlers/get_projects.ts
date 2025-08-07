
import { type Project } from '../schema';

export const getProjects = async (): Promise<Project[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all projects from the database.
    // Projects should be ordered by featured status and then by creation date (newest first).
    return Promise.resolve([
        {
            id: 1,
            title: "E-commerce Platform",
            description: "Full-stack e-commerce solution with React and Node.js",
            technologies: "React, Node.js, PostgreSQL, TypeScript",
            project_url: "https://example.com",
            github_url: "https://github.com/user/project",
            image_url: null,
            is_featured: true,
            created_at: new Date()
        }
    ] as Project[]);
}
