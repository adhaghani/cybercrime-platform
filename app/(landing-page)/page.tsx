import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert, FileText, Bell, ArrowRight, Lock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-b from-background to-muted/50">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
              New: Enhanced Reporting Features
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
              Secure Campus, <span className="text-primary">Safer Community</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem]">
              A comprehensive platform for reporting and tracking safety incidents within UiTM. 
              Empowering students and staff to create a secure learning environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/auth/login">
                  Report an Incident <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8">
                <Link href="/crime">View Public Reports</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
          <ShieldAlert className="w-full h-full text-primary" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Key Features</h2>
            <p className="mt-4 text-lg text-muted-foreground">Everything you need to stay safe and informed.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
              <p className="text-muted-foreground">
                Submit crime and facility reports quickly with our intuitive interface. Track status updates in real-time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Alerts</h3>
              <p className="text-muted-foreground">
                Receive immediate notifications about safety announcements, emergencies, and important campus updates.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Confidential</h3>
              <p className="text-muted-foreground">
                Your data is protected. We prioritize privacy and ensure that sensitive information is handled securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground font-medium">Support Available</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-primary">100%</h3>
              <p className="text-muted-foreground font-medium">Confidentiality</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">
            Ready to make a difference?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join the community in making our campus safer for everyone. Report incidents, stay informed, and help us improve.
          </p>
          <Button asChild size="lg" variant="secondary" className="h-12 px-8">
            <Link href="/auth/sign-up">
              Get Started Now
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}