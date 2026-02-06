"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { X, Calendar, Clock } from "lucide-react"

const TIME_SLOTS = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

const DATES = Array.from({ length: 14 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() + i + 1)
  return date
})

interface ConsultationModalProps {
  doctor: { id: string; name: string; specialty: string }
  onClose: () => void
  onConfirm: (date: string, time: string) => void
}

export default function ConsultationModal({ doctor, onClose, onConfirm }: ConsultationModalProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-border relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors">
          <X className="w-5 h-5" />
        </button>

        <CardHeader>
          <CardTitle>Book Consultation</CardTitle>
          <CardDescription>
            {doctor.name} - {doctor.specialty}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Select Date</Label>
            <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {DATES.map((date) => {
                const dateStr = date.toISOString().split("T")[0]
                const isSelected = selectedDate === dateStr
                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <div className="text-xs">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label className="text-foreground font-semibold">Select Time</Label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {TIME_SLOTS.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-secondary/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(selectedDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Clock className="w-4 h-4" />
                {selectedTime}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-border text-foreground hover:bg-secondary bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
            >
              Confirm Booking
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
