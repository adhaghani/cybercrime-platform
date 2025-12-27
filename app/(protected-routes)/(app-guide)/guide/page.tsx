import { BookOpen, Info, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

export default function GuidePage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="container py-8 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
              <p className="text-muted-foreground">Complete manual for CyberSafe Platform</p>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Welcome to the CyberSafe Platform</AlertTitle>
            <AlertDescription>
              This guide will help you navigate and use all features of the platform effectively. 
              Use the table of contents on the right to jump to specific sections.
            </AlertDescription>
          </Alert>
        </div>

        {/* Getting Started Section */}
        <section id="introduction" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Introduction</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              CyberSafe Platform is a comprehensive incident reporting and management system designed 
              for educational institutions. It enables students and staff to report crimes, facility issues, 
              and access emergency services quickly and efficiently.
            </p>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="account-setup" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Account Setup</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Creating Your Account</CardTitle>
                <CardDescription>Step-by-step instructions for new users</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to the sign-up page</li>
                  <li>Fill in your personal information (Name, Email, Contact Number)</li>
                  <li>Enter your Student ID or Staff ID</li>
                  <li>Create a secure password</li>
                  <li>Verify your email address</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="first-login" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">First Login</h2>
          <p className="text-muted-foreground mb-4">
            After creating your account, you can log in using your registered email and password. 
            You&apos;ll be redirected to your personalized dashboard based on your role.
          </p>
        </section>

        <Separator className="my-8" />

        <section id="dashboard-overview" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p className="text-muted-foreground mb-4">
            Your dashboard provides quick access to all platform features and displays important 
            information relevant to your role.
          </p>
        </section>

        <Separator className="my-8" />

        {/* Reporting Section */}
        <section id="crime-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Crime Reports</h2>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              For emergencies requiring immediate attention, always contact campus security or 
              emergency services directly before filing a report.
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground">
            Content about crime reporting will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="facility-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Facility Reports</h2>
          <p className="text-muted-foreground">
            Content about facility reporting will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="submitting-report" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Submitting a Report</h2>
          <p className="text-muted-foreground">
            Content about submitting reports will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="tracking-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Tracking Your Reports</h2>
          <p className="text-muted-foreground">
            Content about tracking reports will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="report-status" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Report Status</h2>
          <p className="text-muted-foreground">
            Content about report statuses will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        {/* Emergency Services Section */}
        <section id="uitm-police" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">UiTM Auxiliary Police</h2>
          <p className="text-muted-foreground">
            Content about UiTM Police will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="emergency-contacts" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
          <p className="text-muted-foreground">
            Content about emergency contacts will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="when-to-report" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">When to Report</h2>
          <p className="text-muted-foreground">
            Content about when to report will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        {/* Staff Features Section */}
        <section id="managing-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Managing Reports</h2>
          <p className="text-muted-foreground">
            Content for staff about managing reports will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="assigning-cases" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Assigning Cases</h2>
          <p className="text-muted-foreground">
            Content about assigning cases will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="announcements" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Creating Announcements</h2>
          <p className="text-muted-foreground">
            Content about creating announcements will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="team-management" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Team Management</h2>
          <p className="text-muted-foreground">
            Content about team management will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        {/* Admin Features Section */}
        <section id="user-management" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <p className="text-muted-foreground">
            Content for admins about user management will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="system-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">System Reports</h2>
          <p className="text-muted-foreground">
            Content about system reports will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="ai-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">AI Report Generation</h2>
          <p className="text-muted-foreground">
            Content about AI report generation will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="access-control" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Access Control</h2>
          <p className="text-muted-foreground">
            Content about access control will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        {/* FAQ Section */}
        <section id="faq" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
          <p className="text-muted-foreground">
            FAQ content will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="troubleshooting" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
          <p className="text-muted-foreground">
            Troubleshooting content will be added here...
          </p>
        </section>

        <Separator className="my-8" />

        <section id="support" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Contact Support</h2>
          <Card>
            <CardHeader>
              <CardTitle>Need Additional Help?</CardTitle>
              <CardDescription>Our support team is here to assist you</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Support contact information will be added here...
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}