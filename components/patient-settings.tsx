"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PatientSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input defaultValue="John Patient" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  defaultValue="john@example.com"
                  className="mt-1 bg-input border-border text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input defaultValue="+1 (555) 123-4567" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <Input type="date" defaultValue="1990-01-15" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>Update your password regularly for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input type="password" placeholder="••••••••" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="••••••••" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input type="password" placeholder="••••••••" className="mt-1 bg-input border-border text-foreground" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Appointment Reminders", desc: "Get notified about upcoming appointments" },
                { label: "Prescription Updates", desc: "Updates about your prescriptions" },
                { label: "Test Results", desc: "Notifications when your test results are ready" },
                { label: "Doctor Messages", desc: "Messages from your doctors" },
              ].map((notif) => (
                <div
                  key={notif.label}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{notif.label}</p>
                    <p className="text-sm text-muted-foreground">{notif.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </div>
              ))}
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
