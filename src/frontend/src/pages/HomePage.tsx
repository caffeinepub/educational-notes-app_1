import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, ChevronRight } from 'lucide-react';

const classes = [
  { level: 6, label: 'कक्षा 6', description: 'Class 6' },
  { level: 7, label: 'कक्षा 7', description: 'Class 7' },
  { level: 8, label: 'कक्षा 8', description: 'Class 8' },
  { level: 9, label: 'कक्षा 9', description: 'Class 9' },
  { level: 10, label: 'कक्षा 10', description: 'Class 10' },
  { level: 11, label: 'कक्षा 11', description: 'Class 11' },
  { level: 12, label: 'कक्षा 12', description: 'Class 12' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative mb-12 rounded-2xl overflow-hidden shadow-lg">
        <img
          src="/assets/generated/books-hero.dim_1200x600.png"
          alt="Educational Books"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 flex items-center">
          <div className="container mx-auto px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
              स्वागत है EduNotes में
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              कक्षा 6 से 12 तक के सभी विषयों के नोट्स एक जगह। अपनी कक्षा चुनें और पढ़ाई शुरू करें।
            </p>
          </div>
        </div>
      </div>

      {/* Class Selection */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">अपनी कक्षा चुनें</h2>
        </div>
        <p className="text-muted-foreground mb-8">
          Select your class to access comprehensive study notes for all subjects
        </p>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {classes.map((classItem) => (
          <Card
            key={classItem.level}
            className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 hover:scale-105"
            onClick={() => navigate({ to: '/class/$classLevel', params: { classLevel: String(classItem.level) } })}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap className="h-8 w-8 text-primary" />
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-2xl mb-1">{classItem.label}</CardTitle>
              <CardDescription className="text-base">{classItem.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="mt-16 p-8 rounded-xl bg-accent/30 border border-border">
        <h3 className="text-xl font-semibold text-foreground mb-3">📚 सभी विषयों के नोट्स उपलब्ध</h3>
        <p className="text-muted-foreground leading-relaxed">
          Mathematics, Science, English, Social Studies, Hindi और अन्य विषयों के विस्तृत नोट्स। प्रत्येक टॉपिक को
          सरल भाषा में समझाया गया है।
        </p>
      </div>
    </div>
  );
}
