import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { useGetAllNotes } from '../hooks/useQueries';
import { Home, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import NoteCard from '../components/NoteCard';

export default function NotesPage() {
  const { classLevel, subject } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: allNotes, isLoading, error } = useGetAllNotes();

  // Filter notes by class and subject
  const notes = allNotes
    ? allNotes.filter(
        (note) => note.classLevel === BigInt(classLevel || 0) && note.subject === subject
      )
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
          <AlertDescription>Failed to load notes. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <BreadcrumbLink
              onClick={() => navigate({ to: '/class/$classLevel', params: { classLevel: String(classLevel) } })}
              className="cursor-pointer hover:text-primary"
            >
              कक्षा {classLevel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{subject}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {subject} - कक्षा {classLevel}
        </h1>
        <p className="text-muted-foreground">
          {notes.length} {notes.length === 1 ? 'topic' : 'topics'} available
        </p>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Alert>
          <AlertDescription>No notes available for this subject yet.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {notes.map((note, index) => (
            <NoteCard key={index} note={note} />
          ))}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/class/$classLevel', params: { classLevel: String(classLevel) } })}
        >
          ← Back to Subjects
        </Button>
      </div>
    </div>
  );
}
