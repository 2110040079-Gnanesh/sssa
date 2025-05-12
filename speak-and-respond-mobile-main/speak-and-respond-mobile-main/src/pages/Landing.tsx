
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle, ChevronRight, Mic, Sparkles, Brain } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background/95 to-black">
      <header className="w-full py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              MeigdAI Interview Assistant
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="bg-black/20 border-white/5">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <section className="py-12 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    Ace Your Interviews
                  </span>{" "}
                  with AI-Powered Practice
                </h1>
                <p className="text-muted-foreground text-lg">
                  Practice interviews with our AI assistant that provides real-time feedback,
                  personalized responses, and professional guidance to help you land your dream job.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link to="/auth?signup=true">
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700">
                      Get Started Free
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="lg" variant="outline" className="bg-black/20 border-white/5">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="glass-card p-8 rounded-2xl animate-fade-in delay-200">
                <div className="aspect-video relative overflow-hidden rounded-xl border border-white/10 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <Mic className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Practice Out Loud</h3>
                    <p className="text-muted-foreground">
                      Speak your answers and get instant AI feedback to improve your interviewing skills
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-transparent to-black/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Your Ultimate Interview Preparation Partner
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive features designed to help you prepare and excel in any interview scenario
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in delay-100">
              {[
                {
                  title: "Voice-Based Practice",
                  description:
                    "Practice answering interview questions out loud to build confidence and verbal fluency",
                  icon: Mic,
                },
                {
                  title: "Expert AI Feedback",
                  description:
                    "Receive personalized feedback and suggestions to improve your answers",
                  icon: Sparkles,
                },
                {
                  title: "Knowledge Base",
                  description:
                    "Store your resume, experiences, and project details for contextually relevant responses",
                  icon: Brain,
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-xl flex flex-col h-full border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="h-12 w-12 rounded-full bg-blue-950/50 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Why Practice with MeigdAI?
                </h2>
                <ul className="space-y-4">
                  {[
                    "Build confidence through realistic interview practice",
                    "Get instant feedback on your responses",
                    "Practice anytime, anywhere at your convenience",
                    "Store your resume details for personalized responses",
                    "Prepare for different interview types and scenarios",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link to="/auth?signup=true">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-700">
                      Sign Up Now
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl animate-fade-in delay-200">
                <div className="aspect-video bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-transparent p-6 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-3">Ready to ace your next interview?</h3>
                    <p className="text-muted-foreground mb-6">
                      Join thousands of job seekers who have improved their interview performance
                    </p>
                    <Link to="/auth?signup=true">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-700">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 bg-black/40 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-xs text-muted-foreground">
          <p>© 2025 MeigdAI Interview Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
