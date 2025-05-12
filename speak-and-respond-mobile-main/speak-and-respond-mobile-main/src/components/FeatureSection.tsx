
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Briefcase, Users, Sparkles, Cpu } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="flex flex-col items-start gap-2 rounded-lg bg-black/30 p-4 hover:bg-black/40 transition-colors border border-white/5">
    <div className="rounded-full bg-blue-500/10 p-2 text-blue-400">
      {icon}
    </div>
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

const FeatureSection = () => {
  const features = [
    {
      icon: <Briefcase className="h-5 w-5" />,
      title: "Interview Preparation",
      description: "Practice answers to common interview questions across various industries"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Group Discussion Analysis",
      description: "Record group discussions and receive detailed analysis of perspectives"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Personalized Feedback",
      description: "Get tailored feedback to improve your communication skills"
    },
    {
      icon: <Cpu className="h-5 w-5" />,
      title: "Multiple AI Models",
      description: "Choose between different AI models for varied response styles"
    }
  ];

  return (
    <Card className="border-0 glass-card h-auto">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3 bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Features</h2>
        <ScrollArea className="h-[200px] custom-scrollbar pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                icon={feature.icon} 
                title={feature.title} 
                description={feature.description} 
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FeatureSection;
