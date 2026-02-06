"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle, Phone, Mail, MessageCircle, ChevronDown } from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    id: "1",
    question: "How do I book a consultation?",
    answer:
      "Go to your Dashboard, find a doctor, and click 'Book Consultation'. Select your preferred date and time from the available slots.",
  },
  {
    id: "2",
    question: "How do I join a video consultation?",
    answer:
      "When your consultation is confirmed, click the 'Join Consultation' button on your appointment. This will open Google Meet.",
  },
  {
    id: "3",
    question: "Can I cancel an appointment?",
    answer:
      "Yes, you can cancel pending or confirmed appointments from 'My Consultations'. Please cancel at least 24 hours in advance.",
  },
  {
    id: "4",
    question: "How do I access my medical records?",
    answer: "Go to Medical Records and select from Lab Reports, Medical History, or Documents tabs.",
  },
  {
    id: "5",
    question: "What should I do if I forget my password?",
    answer: "Click 'Forgot Password' on the login page and follow the instructions to reset it.",
  },
]

export default function PatientHelp() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Help & Support</h2>
        <p className="text-muted-foreground">Find answers and get support</p>
      </div>

      {/* Contact Options */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Call Us</h3>
              <p className="text-sm text-muted-foreground">Available 24/7</p>
            </div>
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Phone className="w-4 h-4 mr-2" />
              +1 (800) 123-4567
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Email Us</h3>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <Mail className="w-4 h-4 mr-2" />
              support@health.com
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Live Chat</h3>
              <p className="text-sm text-muted-foreground">Chat with our team</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-secondary bg-transparent"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <Card
              key={faq.id}
              className="border-border bg-card cursor-pointer transition-all hover:shadow-md"
              onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" />
                    {faq.question}
                  </CardTitle>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      expandedFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CardHeader>
              {expandedFaq === faq.id && (
                <CardContent className="pt-0">
                  <p className="text-sm text-foreground">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
