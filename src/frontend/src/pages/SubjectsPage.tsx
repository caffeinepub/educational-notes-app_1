import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useGetNotesByClass } from '../hooks/useQueries';
import { BookOpen, Home, ChevronRight, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const subjectIcons: Record<string, string> = {
  Mathematics: '🔢',
  Science: '🔬',
  English: '📖',
  'Social Studies': '🌍',
  Hindi: '📝',
};

export default function SubjectsPage() {
  const { classLevel } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: notes, isLoading, error } = useGetNotesByClass(Number(classLevel));

  // Extract unique subjects
  const subjects = notes
    ? Array.from(new Set(notes.map((note) => note.subject))).sort()
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load subjects. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => navigate({ to: '/' })}
              className="flex items-center gap-1 cursor-pointer hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>कक्षा {classLevel}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">कक्षा {classLevel} - विषय</h1>
        <p className="text-muted-foreground">Select a subject to view notes and topics</p>
      </div>

      {/* Subjects Grid */}
      {subjects.length === 0 ? (
        <Alert>
          <AlertDescription>No subjects available for this class yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => {
            const subjectNotes = notes?.filter((note) => note.subject === subject) || [];
            return (
              <Card
                key={subject}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 hover:scale-105"
                onClick={() =>
                  navigate({
                    to: '/class/$classLevel/subject/$subject',
                    params: { classLevel: String(classLevel), subject },
                  })
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="text-4xl">{subjectIcons[subject] || '📚'}</div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2">{subject}</CardTitle>
                  <CardDescription>
                    {subjectNotes.length} {subjectNotes.length === 1 ? 'topic' : 'topics'} available
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <Button variant="outline" onClick={() => navigate({ to: '/' })}>
          ← Back to Classes
        </Button>
      </div>
    </div>
  );
}
