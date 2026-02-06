"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, User, Calendar, Clock, DollarSign, Save, Copy, Check } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

interface DoctorSettings {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    specialty: string
    license: string
  }
  availability: {
    startTime: string
    endTime: string
    breakTime: string
    daysOff: string[]
  }
  consultation: {
    duration: number
    videoEnabled: boolean
    audioEnabled: boolean
    chatEnabled: boolean
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    appointmentReminders: boolean
    reviewNotifications: boolean
  }
  rates: {
    consultationRate: number
    followUpRate: number
    currency: string
  }
}

export default function DoctorSettings() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const [settings, setSettings] = useState<DoctorSettings>({
    personalInfo: {
      fullName: "Dr. Michael Johnson",
      email: "dr.michael@example.com",
      phone: "+1-555-0123",
      specialty: "General Medicine",
      license: "MD-2023-12345",
    },
    availability: {
      startTime: "09:00",
      endTime: "17:00",
      breakTime: "12:00-13:00",
      daysOff: ["Saturday", "Sunday"],
    },
    consultation: {
      duration: 30,
      videoEnabled: true,
      audioEnabled: true,
      chatEnabled: true,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      appointmentReminders: true,
      reviewNotifications: true,
    },
    rates: {
      consultationRate: 50,
      followUpRate: 30,
      currency: "USD",
    },
  })

  const handleSaveSettings = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText("DOC-2024-12345")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-slate-400 text-sm">Manage your profile, availability, and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 bg-white/10 text-xs sm:text-sm">
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
          >
            <User className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Personal</span>
            <span className="sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="availability"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
          >
            <Calendar className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Availability</span>
            <span className="sm:hidden">Avail</span>
          </TabsTrigger>
          <TabsTrigger
            value="consultation"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
          >
            <Clock className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Consultation</span>
            <span className="sm:hidden">Consult</span>
          </TabsTrigger>
          <TabsTrigger
            value="rates"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
          >
            <DollarSign className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Rates</span>
            <span className="sm:hidden">$</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
          >
            <Bell className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
            <span className="sm:hidden">Alerts</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription className="text-slate-400">Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Full Name</label>
                <Input
                  value={settings.personalInfo.fullName}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Email</label>
                  <Input
                    type="email"
                    value={settings.personalInfo.email}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, email: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Phone</label>
                  <Input
                    value={settings.personalInfo.phone}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, phone: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Specialty</label>
                  <Input
                    value={settings.personalInfo.specialty}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, specialty: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">License Number</label>
                  <Input
                    value={settings.personalInfo.license}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, license: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Settings Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Availability Schedule</CardTitle>
              <CardDescription className="text-slate-400">Set your working hours and days off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={settings.availability.startTime}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, startTime: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">End Time</label>
                  <Input
                    type="time"
                    value={settings.availability.endTime}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        availability: { ...prev.availability, endTime: e.target.value },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">Break Time</label>
                <Input
                  value={settings.availability.breakTime}
                  placeholder="HH:MM-HH:MM"
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, breakTime: e.target.value },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Settings Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Consultation Tab */}
        <TabsContent value="consultation" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Consultation Settings</CardTitle>
              <CardDescription className="text-slate-400">Configure consultation options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Default Duration (minutes)</label>
                <Input
                  type="number"
                  value={settings.consultation.duration}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      consultation: { ...prev.consultation, duration: Number.parseInt(e.target.value) },
                    }))
                  }
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.consultation.videoEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        consultation: { ...prev.consultation, videoEnabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Enable Video Consultations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.consultation.audioEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        consultation: { ...prev.consultation, audioEnabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Enable Audio Consultations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.consultation.chatEnabled}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        consultation: { ...prev.consultation, chatEnabled: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Enable Chat Consultations</span>
                </label>
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Settings Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rates Tab */}
        <TabsContent value="rates" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Consultation Rates</CardTitle>
              <CardDescription className="text-slate-400">Set your consultation fees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Initial Consultation</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={settings.rates.consultationRate}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          rates: { ...prev.rates, consultationRate: Number.parseInt(e.target.value) },
                        }))
                      }
                      className="bg-white/10 border-white/20 text-white"
                    />
                    <Input
                      value={settings.rates.currency}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          rates: { ...prev.rates, currency: e.target.value },
                        }))
                      }
                      className="w-20 bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Follow-up Consultation</label>
                  <Input
                    type="number"
                    value={settings.rates.followUpRate}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        rates: { ...prev.rates, followUpRate: Number.parseInt(e.target.value) },
                      }))
                    }
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Settings Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4 sm:space-y-6 mt-6">
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription className="text-slate-400">Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailNotifications}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, emailNotifications: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Email Notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsNotifications}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, smsNotifications: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">SMS Notifications</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.appointmentReminders}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, appointmentReminders: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Appointment Reminders</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.reviewNotifications}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, reviewNotifications: e.target.checked },
                      }))
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-white">Review Notifications</span>
                </label>
              </div>
              <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                {saved ? "Settings Saved!" : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Referral Code Section */}
          <Card className="border-white/20 bg-white/5">
            <CardHeader>
              <CardTitle className="text-white">Referral Code</CardTitle>
              <CardDescription className="text-slate-400">Share your unique referral code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input value="DOC-2024-12345" readOnly className="bg-white/10 border-white/20 text-white font-mono" />
                <Button onClick={handleCopyReferralCode} className="bg-blue-600 hover:bg-blue-700 text-white px-4">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
