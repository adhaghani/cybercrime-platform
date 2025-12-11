import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, FileText, ShieldAlert } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      category: "Reporting Crimes",
      items: [
        {
          question: "How do I report a crime anonymously?",
          answer: "You can report a crime anonymously by selecting the 'Anonymous Report' option on the reporting form. We will not collect any personal identifying information unless you choose to provide it."
        },
        {
          question: "What happens after I submit a report?",
          answer: "After submission, your report is reviewed by our security team. If you provided contact information, you may be contacted for further details. The incident will be investigated and appropriate action taken."
        },
        {
          question: "Can I track the status of my report?",
          answer: "Yes, if you submitted the report while logged in, you can track its status in your dashboard. Anonymous reports cannot be tracked to ensure privacy."
        }
      ]
    },
    {
      category: "Account & Privacy",
      items: [
        {
          question: "Who can see my personal information?",
          answer: "Your personal information is only accessible to authorized security personnel and administrators. We adhere to strict privacy policies and data protection regulations."
        },
        {
          question: "How do I reset my password?",
          answer: "Go to the login page and click on 'Forgot Password'. Follow the instructions sent to your email to reset your password."
        }
      ]
    },
    {
      category: "Campus Safety",
      items: [
        {
          question: "What should I do in an active emergency?",
          answer: "In an active emergency, immediately call 911 or the Campus Emergency Hotline at 555-9111. Do not use the online reporting system for immediate threats."
        },
        {
          question: "Are there safety escorts available at night?",
          answer: "Yes, the Campus Safety Escort Service operates from 6 PM to 6 AM. You can request an escort by calling 555-0102 or through the mobile app."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions about reporting, safety, and account management.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for answers..." 
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto grid gap-8">
        {faqs.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                {section.category === "Reporting Crimes" && <FileText className="h-5 w-5 text-primary" />}
                {section.category === "Account & Privacy" && <ShieldAlert className="h-5 w-5 text-primary" />}
                {section.category === "Campus Safety" && <MessageCircle className="h-5 w-5 text-primary" />}
                {section.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, i) => (
                  <AccordionItem key={i} value={`item-${index}-${i}`}>
                    <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-12 text-center p-8 bg-muted/30 rounded-lg border border-dashed">
        <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-6">
          Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
        </p>
        <Button asChild>
          <a href="/contact">Contact Support</a>
        </Button>
      </div>
    </div>
  );
}
