
import { type Skill } from '../schema';

export const getSkills = async (): Promise<Skill[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all skills from the database.
    // Skills should be ordered by category and then by name for better organization.
    return Promise.resolve([
        {
            id: 1,
            name: "TypeScript",
            level: "Advanced",
            category: "Programming",
            created_at: new Date()
        },
        {
            id: 2,
            name: "React",
            level: "Advanced",
            category: "Frontend",
            created_at: new Date()
        }
    ] as Skill[]);
}
