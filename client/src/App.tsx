
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/utils/trpc';
import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink } from 'lucide-react';
import type { AboutMe, Skill, Project, Contact } from '../../server/src/schema';

function App() {
  const [aboutMe, setAboutMe] = useState<AboutMe | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contact, setContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [aboutMeData, skillsData, projectsData, contactData] = await Promise.all([
        trpc.getAboutMe.query(),
        trpc.getSkills.query(),
        trpc.getProjects.query(),
        trpc.getContact.query()
      ]);

      setAboutMe(aboutMeData);
      setSkills(skillsData);
      setProjects(projectsData);
      setContact(contactData);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'advanced':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex justify-center space-x-8">
            <a href="#about" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              About
            </a>
            <a href="#skills" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Skills
            </a>
            <a href="#projects" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Projects
            </a>
            <a href="#contact" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 space-y-16">
        {/* About Me Section */}
        <section id="about" className="text-center">
          <div className="mb-8">
            {aboutMe?.profile_image_url ? (
              <img 
                src={aboutMe.profile_image_url} 
                alt="Profile" 
                className="w-32 h-32 rounded-full mx-auto mb-6 shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <span className="text-white text-4xl font-bold">
                  {aboutMe?.title?.charAt(0) || 'P'}
                </span>
              </div>
            )}
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {aboutMe?.title || 'Portfolio'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {aboutMe?.description || 'Welcome to my portfolio'}
            </p>
          </div>
        </section>

        <Separator className="my-16" />

        {/* Skills Section */}
        <section id="skills">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Skills & Expertise
          </h2>
          <div className="grid gap-6">
            {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
              <Card key={category} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {categorySkills.map((skill: Skill) => (
                      <div key={skill.id} className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-sm">
                          {skill.name}
                        </Badge>
                        <Badge 
                          className={`text-xs ${getLevelColor(skill.level)}`}
                        >
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Projects Section */}
        <section id="projects">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((project: Project) => (
              <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
                {project.image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl text-gray-900 dark:text-white">
                      {project.title}
                      {project.is_featured && (
                        <Badge className="ml-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                          Featured
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Technologies:</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      {project.project_url && (
                        <Button asChild size="sm" className="flex items-center gap-2">
                          <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            View Project
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button asChild size="sm" variant="outline" className="flex items-center gap-2">
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                            Source Code
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator className="my-16" />

        {/* Contact Section */}
        <section id="contact">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Get In Touch
          </h2>
          <Card className="max-w-2xl mx-auto shadow-sm">
            <CardContent className="p-8">
              <div className="space-y-6">
                {contact?.email && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a 
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                )}
                
                {contact?.phone && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Phone</p>
                      <a 
                        href={`tel:${contact.phone}`}
                        className="text-green-600 dark:text-green-400 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                )}

                {contact?.location && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-300">{contact.location}</p>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex justify-center gap-4">
                  {contact?.linkedin_url && (
                    <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                      <a href={contact.linkedin_url} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                  
                  {contact?.github_url && (
                    <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                      <a href={contact.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  
                  {contact?.twitter_url && (
                    <Button asChild variant="outline" size="sm" className="flex items-center gap-2">
                      <a href={contact.twitter_url} target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Portfolio. Built with React and TypeScript.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
