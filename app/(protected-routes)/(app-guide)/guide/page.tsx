/* eslint-disable react/no-unescaped-entities */
import { BookOpen, Info, AlertCircle, Lock, Shield,Mail, Users,UserPlus, Bell, Download, BarChart3, FileText, Search, CheckCircle,Eye, Clock, XCircle, Phone, Building2, AlertTriangle, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
            
            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardHeader>
                  <Shield className="size-8 text-primary mb-2" />
                  <CardTitle className="text-base">For Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Report incidents, track your submissions, and access emergency contacts anytime.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Users className="size-8 text-primary mb-2" />
                  <CardTitle className="text-base">For Staff</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manage reports, coordinate responses, and create announcements for the community.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Settings className="size-8 text-primary mb-2" />
                  <CardTitle className="text-base">For Administrators</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Full system control, user management, and advanced analytics capabilities.
                  </p>
                </CardContent>
              </Card>
            </div>
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
              <CardContent className="space-y-4">
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Navigate to the sign-up page from the homepage</li>
                  <li>Fill in your personal information (Name, Email, Contact Number)</li>
                  <li>Enter your Student ID or Staff ID</li>
                  <li>Create a secure password (minimum 8 characters, including letters and numbers)</li>
                  <li>Verify your email address by clicking the link sent to your inbox</li>
                </ol>
                
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Password Requirements:</strong> Use at least 8 characters with a mix of uppercase, 
                    lowercase, numbers, and special characters for better security.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Student</Badge>
                    <p className="text-sm text-muted-foreground">
                      Use your student email (@student.uitm.edu.my) and student ID to register.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">Staff</Badge>
                    <p className="text-sm text-muted-foreground">
                      Use your staff email (@uitm.edu.my) and staff ID for registration.
                    </p>
                  </div>
                </div>
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
          <Card>
              <CardHeader>
                <CardTitle className="text-lg">First Time Login Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-500" />
                    Complete your profile information
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-500" />
                    Review emergency contact numbers
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-500" />
                    Familiarize yourself with the dashboard layout
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="size-4 text-green-500" />
                    Read through recent campus announcements
                  </li>
                </ul>
              </CardContent>
            </Card>
        </section>

        <Separator className="my-8" />

        <section id="dashboard-overview" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
          <p className="text-muted-foreground mb-6">
            Your dashboard provides quick access to all platform features and displays important 
            information relevant to your role.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <FileText className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Submit new crime or facility report</li>
                  <li>• View all your submitted reports</li>
                  <li>• Access emergency contacts directory</li>
                  <li>• Check recent campus announcements</li>
                  <li>• Update your profile information</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Search className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Statistics & Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Campus-wide incident trends</li>
                  <li>• Your report Statistics</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Profile Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Update personal information</li>
                </ul>
              </CardContent>
            </Card>
          </div>
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
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is a Crime Report?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Crime reports document security incidents on campus including theft, assault, harassment, 
                  vandalism, suspicious activities, and other safety concerns. These reports help campus security 
                  track patterns, respond appropriately, and improve overall campus safety.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Types of Incidents to Report:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Theft:</strong> Stolen belongings, vehicles, or equipment</li>
                    <li>• <strong>Assault:</strong> Physical confrontations or violence</li>
                    <li>• <strong>Harassment:</strong> Verbal, physical, or cyber harassment</li>
                    <li>• <strong>Vandalism:</strong> Damage to property or facilities</li>
                    <li>• <strong>Suspicious Activity:</strong> Unusual behavior or unauthorized persons</li>
                    <li>• <strong>Trespassing:</strong> Unauthorized access to restricted areas</li>
                    <li>• <strong>Drug-related incidents:</strong> Substance abuse or distribution</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="facility-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Facility Reports</h2>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              The Facility Reporting module allows users to notify the university about infrastructure issues that could impact safety. This includes broken lighting in parking lots, faulty door locks in hostels, or damaged perimeter fencing. Timely reporting helps prevent crimes of opportunity.
            </AlertDescription>
          </Alert>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Facility Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Lighting & Visibility</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Broken or dim streetlights</li>
                      <li>• Non-functioning parking lot lights</li>
                      <li>• Dark walkways or corridors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Security Hardware</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Broken door locks or handles</li>
                      <li>• Damaged windows or screens</li>
                      <li>• Faulty alarm systems</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Perimeter Security</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Damaged fences or gates</li>
                      <li>• Broken access control systems</li>
                      <li>• Unauthorized entry points</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Surveillance</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Non-functioning CCTV cameras</li>
                      <li>• Obstructed camera views</li>
                      <li>• Blind spots in coverage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="submitting-report" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Submitting a Report</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step-by-Step Submission Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">1</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Choose Report Type</h4>
                      <p className="text-sm text-muted-foreground">
                        Select whether you're reporting a crime incident or a facility issue from your dashboard.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">2</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Fill Required Information</h4>
                      <p className="text-sm text-muted-foreground">
                        Complete all mandatory fields including:
                      </p>
                      <ul className="mt-1 text-sm text-muted-foreground space-y-1">
                        <li>• Incident type/category</li>
                        <li>• Date and time of incident</li>
                        <li>• Location (building, floor, specific area)</li>
                        <li>• Detailed description of the incident</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">3</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Add Supporting Evidence</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload photos, videos, or documents that support your report (optional but recommended).
                        Accepted formats: JPG, PNG, PDF, MP4 (max 10MB per file).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">4</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">Review and Submit</h4>
                      <p className="text-sm text-muted-foreground">
                        Double-check all information for accuracy. Once submitted, you'll receive a unique 
                        Case ID for tracking purposes.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tip:</strong> Provide as much detail as possible. Include specific locations, 
                    times, and any witness information. This helps security personnel respond more effectively.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anonymous Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  CyberSafe supports anonymous reporting for sensitive situations. When you choose to report 
                  anonymously:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Your personal information is hidden from the report</li>
                  <li>• You still receive a Case ID to track the report status</li>
                  <li>• Security can still take action based on the information provided</li>
                  <li>• Your identity is protected throughout the process</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="tracking-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Tracking Your Reports</h2>
          <p className="text-muted-foreground">
            Transparency is a core feature of CyberSafe. Once submitted, your report is assigned a unique 
            Case ID. You can track progress by visiting the 'All Crime Reports' or 'All Facility Reports' 
            section. Here, you can see real-time updates as security personnel move your case from 'Pending' 
            to 'In Progress' to 'Resolved'.
          </p>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Track Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Navigate to "My Reports" or "All Reports" from your dashboard</li>
                  <li>2. Find your report using the Case ID or search by date/type</li>
                  <li>3. Click on the report to view detailed status and updates</li>
                  <li>4. Check the timeline to see all actions taken on your report</li>
                  <li>5. View any comments or updates from security personnel</li>
                </ol>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Eye className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Report Details View</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  When viewing a report, you can see:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Current status and status history</li>
                  <li>• Assigned personnel</li>
                  <li>• Timestamps for all status changes</li>
                  <li>• Any updates or comments from staff</li>
                  <li>• Your original submission details</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="report-status" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Report Status</h2>
          <p className="text-muted-foreground mb-4">
            Every report goes through different status stages. Understanding these statuses helps you know 
            what's happening with your report at any given time.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <Clock className="size-6 text-yellow-500 mb-2" />
                <CardTitle className="text-base">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your report has been received and is awaiting review by UiTM staff. 
                  This is the initial status for all new reports. Average waiting time: 1-24 hours.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <AlertCircle className="size-6 text-blue-500 mb-2" />
                <CardTitle className="text-base">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  UiTM staff or UiTM auxiliary police are actively investigating or addressing your report. 
                  You may see updates or requests for additional information during this phase.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CheckCircle className="size-6 text-green-500 mb-2" />
                <CardTitle className="text-base">Resolved</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The incident has been addressed and closed. You can view the resolution details 
                  and any actions taken by UiTM staff or UiTM auxiliary police.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <XCircle className="size-6 text-red-500 mb-2" />
                <CardTitle className="text-base">Rejected/Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  The report was closed without action due to insufficient information, duplication, 
                  or other reasons. Check the comments for explanation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Emergency Services Section */}
        <section id="uitm-police" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">UiTM Auxiliary Police</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Shield className="size-8 text-primary mb-2" />
                <CardTitle className="text-lg">About UiTM Auxiliary Police</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  The UiTM Auxiliary Police is the primary security force on campus, responsible for 
                  maintaining safety, preventing crime, and responding to emergencies. They work 24/7 
                  to ensure a secure learning environment for all students and staff.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Services Provided:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 24/7 campus patrol and surveillance</li>
                    <li>• Emergency response and first aid</li>
                    <li>• Crime prevention and investigation</li>
                    <li>• Safety escorts (upon request)</li>
                    <li>• Traffic management on campus</li>
                    <li>• Lost and found services</li>
                    <li>• Security awareness programs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Phone className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="size-5 text-red-600" />
                      <span className="font-semibold text-red-600">Emergency Hotline</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">999</p>
                    <p className="text-sm text-muted-foreground">Available 24/7 for urgent situations</p>
                  </div>
                  
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="font-semibold mb-1">Campus Security Office</p>
                    <p className="text-sm text-muted-foreground">Operating Hours: 24/7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="emergency-contacts" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Emergency Contacts</h2>
          <p className="text-muted-foreground mb-4">
            Quick access to essential emergency numbers. Save these contacts on your phone for immediate access.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">National Emergency Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Police (PDRM)</span>
                    <span className="font-bold">999</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Ambulance</span>
                    <span className="font-bold">999</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Fire & Rescue</span>
                    <span className="font-bold">994</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campus-Specific Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Campus Security</span>
                    <span className="font-bold">999</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Student Affairs</span>
                    <span className="font-bold text-muted-foreground text-xs">Check dashboard</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Counseling Services</span>
                    <span className="font-bold text-muted-foreground text-xs">Check dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medical Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Campus Clinic</span>
                    <span className="font-bold text-muted-foreground text-xs">Check dashboard</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Nearest Hospital</span>
                    <span className="font-bold text-muted-foreground text-xs">Check dashboard</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Mental Health Helpline</span>
                    <span className="font-bold">15999</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">Women's Crisis Line</span>
                    <span className="font-bold">15999</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="when-to-report" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">When to Report</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <AlertTriangle className="size-6 text-red-600 mb-2" />
                <CardTitle className="text-lg text-red-600">Call Emergency (999) Immediately</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Life-threatening situations</li>
                  <li>• Medical emergencies</li>
                  <li>• Ongoing crimes in progress</li>
                  <li>• Fire or explosion</li>
                  <li>• Active threats to safety</li>
                  <li>• Sexual assault or violence</li>
                  <li>• Suspicious packages or threats</li>
                  <li>• Natural disasters</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <FileText className="size-6 text-blue-600 mb-2" />
                <CardTitle className="text-lg text-blue-600">Use CyberSafe Reporting System</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Past incidents (documentation)</li>
                  <li>• Non-urgent facility issues</li>
                  <li>• Property theft (after the fact)</li>
                  <li>• Vandalism discovered</li>
                  <li>• Maintenance concerns</li>
                  <li>• Suspicious activity (not immediate threat)</li>
                  <li>• Minor safety hazards</li>
                  <li>• Follow-up on previous incidents</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Remember:</strong> When in doubt about severity, always call emergency services first. 
              You can file a report later for documentation purposes.
            </AlertDescription>
          </Alert>
        </section>

        <Separator className="my-8" />

        {/* Staff Features Section */}
        <section id="managing-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Managing Reports</h2>
          <p className="text-muted-foreground mb-4">
            Staff members have additional capabilities to manage incoming reports, update statuses, 
            and coordinate responses with security personnel.
          </p>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Staff Dashboard Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• View all submitted reports across campus</li>
                  <li>• Filter reports by status, type, date, or location</li>
                  <li>• Access detailed report information and evidence</li>
                  <li>• Update report status as cases progress</li>
                  <li>• Add comments and updates to reports</li>
                  <li>• Generate reports for management</li>
                  <li>• View analytics and trends</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Processing a Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Review incoming reports from the "Pending" queue</li>
                  <li>2. Assess severity and required response</li>
                  <li>3. Update status to "In Progress" when investigation begins</li>
                  <li>4. Add detailed notes about actions taken</li>
                  <li>5. Document resolution and close the case</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="assigning-cases" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Assigning Cases</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <UserPlus className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">How to Assign Cases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Staff members can assign reports to specific security personnel or departments based on 
                  the nature of the incident:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Open the report you want to assign</li>
                  <li>2. Click the "Assign" button in the report details</li>
                  <li>3. Select the appropriate staff member or team</li>
                  <li>4. Add any special instructions or notes</li>
                  <li>5. Confirm the assignment</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-3">
                  The assigned personnel will be notified and can begin working on the case immediately.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment Best Practices</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Assign cases based on expertise and jurisdiction</li>
                  <li>• Consider current workload of team members</li>
                  <li>• Prioritize urgent or high-severity cases</li>
                  <li>• Provide clear context and expectations</li>
                  <li>• Monitor progress and follow up as needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="announcements" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Creating Announcements</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Bell className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Announcement System</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Staff members can create campus-wide or targeted announcements to keep the community 
                  informed about safety issues, security updates, or important notices.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Creating an Announcement:</h4>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li>1. Navigate to the "Announcements" section in your staff dashboard</li>
                    <li>2. Click "Create New Announcement"</li>
                    <li>3. Fill in the announcement details:
                      <ul className="ml-4 mt-1 space-y-1">
                        <li>• Title (clear and concise)</li>
                        <li>• Content (detailed information)</li>
                        <li>• Priority level (Low, Medium, High, Urgent)</li>
                        <li>• Target audience (All users, Students, Staff, Specific groups)</li>
                        <li>• Expiry date (optional)</li>
                      </ul>
                    </li>
                    <li>4. Preview the announcement</li>
                    <li>5. Publish to make it visible to users</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Types of Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive">Urgent</Badge>
                    <p className="text-sm text-muted-foreground">
                      Immediate safety threats, emergency situations, or critical updates requiring immediate attention
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="default">High Priority</Badge>
                    <p className="text-sm text-muted-foreground">
                      Important security updates, campus-wide alerts, or significant policy changes
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="secondary">Medium Priority</Badge>
                    <p className="text-sm text-muted-foreground">
                      General safety reminders, upcoming maintenance, or routine updates
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline">Low Priority</Badge>
                    <p className="text-sm text-muted-foreground">
                      Informational notices, tips, or non-urgent communications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="team-management" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Team Management</h2>
          <Card>
            <CardHeader>
              <Users className="size-6 text-primary mb-2" />
              <CardTitle className="text-lg">Managing Your Security Team</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Staff supervisors can manage team members, monitor performance, and coordinate responses:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• View team member availability and assignments</li>
                <li>• Monitor case resolution times and performance metrics</li>
                <li>• Distribute workload evenly across team</li>
                <li>• Schedule shifts and coverage areas</li>
                <li>• Track response times and efficiency</li>
                <li>• Provide feedback and training recommendations</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Admin Features Section */}
        <section id="user-management" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">User Management</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <Settings className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Administrator Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Administrators have full control over the platform including user management, 
                  system configuration, and access control.
                </p>
                
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">User Management Features:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Create, edit, and delete user accounts</li>
                    <li>• Assign roles and permissions (Student, Staff, Admin)</li>
                    <li>• Reset passwords and manage authentication</li>
                    <li>• View user activity logs and history</li>
                    <li>• Suspend or activate accounts</li>
                    <li>• Bulk import users from spreadsheets</li>
                    <li>• Export user data for reporting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Managing User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  To manage user accounts:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Access the "User Management" section from admin dashboard</li>
                  <li>2. Use filters to find specific users or groups</li>
                  <li>3. Click on a user to view/edit their profile</li>
                  <li>4. Modify permissions, roles, or account status</li>
                  <li>5. Save changes and notify the user if needed</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="system-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">System Reports</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <BarChart3 className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Access comprehensive analytics and insights about campus safety:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Incident trends over time (daily, weekly, monthly, yearly)</li>
                  <li>• Crime hotspots and location-based analysis</li>
                  <li>• Response time metrics and performance indicators</li>
                  <li>• Report resolution rates and efficiency statistics</li>
                  <li>• User engagement and platform usage metrics</li>
                  <li>• Comparative analysis between time periods</li>
                  <li>• Custom report generation and exports</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="ai-reports" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">AI Report Generation</h2>
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>AI-Powered Insights</AlertTitle>
              <AlertDescription>
                CyberSafe uses artificial intelligence to analyze patterns, generate insights, 
                and provide recommendations for improving campus safety.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Automated pattern recognition in incident data</li>
                  <li>• Predictive analytics for potential security risks</li>
                  <li>• Natural language processing of report descriptions</li>
                  <li>• Automated categorization and tagging of incidents</li>
                  <li>• Trend identification and forecasting</li>
                  <li>• Intelligent report summarization</li>
                  <li>• Recommendation engine for security improvements</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Using AI Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  To generate AI-powered reports:
                </p>
                <ol className="space-y-2 text-sm text-muted-foreground">
                  <li>1. Go to "AI Report Summary" in admin dashboard</li>
                  <li>2. Select the type of analysis needed</li>
                  <li>3. Configure parameters and time periods</li>
                  <li>4. Let the AI process the data</li>
                  <li>5. Review generated insights and recommendations</li>
                  <li>6. Export or share the analysis</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="access-control" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Access Control</h2>
         <div className="space-y-4">
            <Card>
              <CardHeader>
                <Lock className="size-6 text-primary mb-2" />
                <CardTitle className="text-lg">Role-Based Access Control</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  CyberSafe implements role-based access control to ensure users only have access 
                  to features appropriate for their role:
                </p>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge>Student</Badge>
                      Permissions
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Submit crime and facility reports</li>
                      <li>• View own reports and status</li>
                      <li>• Access emergency contacts</li>
                      <li>• View public announcements</li>
                      <li>• View campus statistics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="secondary">Staff</Badge>
                      Permissions
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• All student permissions, plus:</li>
                      <li>• View all submitted reports</li>
                      <li>• Update report status</li>
                      <li>• Assign cases to team members</li>
                      <li>• Create announcements</li>
                      <li>• Add comments to reports</li>
                      <li>• View team performance metrics</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Badge variant="destructive">Administrator</Badge>
                      Permissions
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• All staff permissions, plus:</li>
                      <li>• Manage user accounts and roles</li>
                      <li>• System configuration and settings</li>
                      <li>• Access analytics and AI reports</li>
                      <li>• Export data and generate reports</li>
                      <li>• Manage emergency contacts</li>
                      <li>• System maintenance and updates</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* FAQ Section */}
        <section id="faq" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Common Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How do I reset my password?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Click "Forgot Password" on the login page, enter your registered email, and follow 
                  the instructions sent to your inbox. If you don't receive the email, check your spam 
                  folder or contact support.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Can I edit or delete a report after submitting?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once submitted, reports cannot be deleted to maintain data integrity. Contact staff if you need to 
                  make significant changes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">How long does it take for a report to be reviewed?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Most reports are reviewed within 24 hours. High-priority incidents are addressed 
                  immediately. You'll receive notifications when your report status changes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Will my identity be revealed if I report anonymously?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  No. Anonymous reports protect your identity completely. Only system administrators 
                  can see basic metadata for security purposes, but your name is never disclosed.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">What if I need to report something urgent?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  For immediate emergencies, always call 999 or campus security directly. The reporting 
                  system is for documentation and non-urgent situations.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Can I access the platform from my mobile phone?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Yes! CyberSafe is fully responsive and works on all devices including smartphones 
                  and tablets. Access it through your mobile browser at the same URL.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="troubleshooting" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Troubleshooting</h2>
         <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Issues and Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-1">I can't log in to my account</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Verify you're using the correct email and password</li>
                      <li>• Try resetting your password</li>
                      <li>• Clear your browser cache and cookies</li>
                      <li>• Try a different browser</li>
                      <li>• Contact support if the issue persists</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">My report submission failed</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Check your internet connection</li>
                      <li>• Ensure all required fields are filled</li>
                      <li>• Verify file uploads are under 10MB</li>
                      <li>• Try submitting again</li>
                      <li>• Take a screenshot of the error and contact support</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">I'm not receiving notifications</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Check your email spam/junk folder</li>
                      <li>• Verify your email address in profile settings</li>
                      <li>• Check notification preferences</li>
                      <li>• Whitelist CyberSafe emails in your email provider</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">The page won't load properly</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Refresh the page (Ctrl+R or Cmd+R)</li>
                      <li>• Clear browser cache</li>
                      <li>• Update your browser to the latest version</li>
                      <li>• Disable browser extensions temporarily</li>
                      <li>• Try accessing from a different device</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">File upload is not working</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                      <li>• Ensure file size is under 10MB</li>
                      <li>• Check file format (JPG, PNG, PDF, MP4 only)</li>
                      <li>• Try compressing large files</li>
                      <li>• Upload files one at a time</li>
                      <li>• Try a different file if one consistently fails</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browser Compatibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  CyberSafe works best on modern browsers. Recommended browsers:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Google Chrome (version 90+)</li>
                  <li>• Mozilla Firefox (version 88+)</li>
                  <li>• Safari (version 14+)</li>
                  <li>• Microsoft Edge (version 90+)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
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
              <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <Mail className="size-6 text-primary mb-2" />
                <CardTitle>Technical Support</CardTitle>
                <CardDescription>For technical issues and platform bugs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Email:</strong> support@cybersafe.uitm.edu.my</p>
                  <p><strong>Response Time:</strong> Within 24-48 hours</p>
                  <p><strong>Available:</strong> Monday - Friday, 9 AM - 5 PM</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Phone className="size-6 text-primary mb-2" />
                <CardTitle>Security Support</CardTitle>
                <CardDescription>For security-related inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><strong>Hotline:</strong> 999 (24/7)</p>
                  <p><strong>Non-Emergency:</strong> Check dashboard for contact</p>
                  <p><strong>Available:</strong> 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Before Contacting Support</AlertTitle>
            <AlertDescription>
              Please have your Case ID, account email, and a detailed description of your issue ready. 
              Include screenshots if applicable. This helps us resolve your issue faster.
            </AlertDescription>
          </Alert>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Additional Sections */}
        <section id="best-practices" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Best Practices for Campus Safety</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <Shield className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Personal Safety Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Always be aware of your surroundings</li>
                  <li>• Keep emergency contacts easily accessible</li>
                  <li>• Travel in groups during late hours</li>
                  <li>• Use well-lit pathways</li>
                  <li>• Report suspicious activities immediately</li>
                  <li>• Keep valuables secure and out of sight</li>
                  <li>• Trust your instincts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Lock className="size-6 text-primary mb-2" />
                <CardTitle className="text-base">Digital Security</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use strong, unique passwords</li>
                  <li>• Never share your account credentials</li>
                  <li>• Log out after using shared devices</li>
                  <li>• Be cautious of phishing attempts</li>
                  <li>• Report suspicious emails or messages</li>
                  <li>• Keep your contact information updated</li>
                  <li>• Enable two-factor authentication if available</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        <section id="data-privacy" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold mb-4">Data Privacy & Security</h2>
          
          <Card>
            <CardHeader>
              <Shield className="size-6 text-primary mb-2" />
              <CardTitle>Your Privacy Matters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                CyberSafe takes data privacy seriously. Here's how we protect your information:
              </p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">Data Encryption</h4>
                  <p className="text-sm text-muted-foreground">
                    All data transmitted between your device and our servers is encrypted using 
                    industry-standard SSL/TLS protocols.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Access Control</h4>
                  <p className="text-sm text-muted-foreground">
                    Only authorized personnel can access sensitive information. All access is logged 
                    and monitored for security purposes.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Data Retention</h4>
                  <p className="text-sm text-muted-foreground">
                    Reports and user data are retained according to university policy and legal requirements. 
                    You can request data deletion by contacting support.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">Anonymous Reporting</h4>
                  <p className="text-sm text-muted-foreground">
                    When you submit an anonymous report, your identity is completely protected. 
                    No personally identifiable information is attached to the report.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <Separator className="my-8" />
        
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">
            Thank you for using CyberSafe Platform
          </p>
          <p className="text-sm text-muted-foreground">
            Together, we can create a safer campus for everyone
          </p>
        </div>
      </div>
    </div>

    
  );
}