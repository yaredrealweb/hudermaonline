"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Monitor, MonitorOff, Phone, Maximize2, Users } from "lucide-react"

interface VideoMeetingProps {
  meetingId: string
  userName: string
  userRole: "doctor" | "patient"
  otherUserName: string
  onEnd?: () => void
}

export default function VideoMeeting({ meetingId, userName, userRole, otherUserName, onEnd }: VideoMeetingProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [participants, setParticipants] = useState([
    { id: "local", name: userName, isSpeaking: false },
    { id: "remote", name: otherUserName, isSpeaking: false },
  ])

  const localVideoRef = useRef<HTMLDivElement>(null)
  const remoteVideoRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Simulate call timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate speaking indicator (random participants)
  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: Math.random() > 0.7,
        })),
      )
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const toggleMute = () => setIsMuted(!isMuted)
  const toggleVideo = () => setIsVideoOn(!isVideoOn)
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        // In a real app, this would capture screen using getDisplayMedia
        setIsScreenSharing(true)
      } catch (error) {
        console.error("Error sharing screen:", error)
      }
    } else {
      setIsScreenSharing(false)
    }
  }

  const toggleFullscreen = async () => {
    if (containerRef.current) {
      if (!isFullscreen) {
        try {
          await containerRef.current.requestFullscreen?.()
          setIsFullscreen(true)
        } catch (error) {
          console.error("Fullscreen error:", error)
        }
      } else {
        document.exitFullscreen?.()
        setIsFullscreen(false)
      }
    }
  }

  const endCall = () => {
    if (onEnd) {
      onEnd()
    }
  }

  return (
    <div ref={containerRef} className="w-full h-full bg-black flex flex-col">
      {/* Main Video Area */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        {/* Remote Video (Main) */}
        <div
          ref={remoteVideoRef}
          className="w-full h-full bg-gradient-to-br from-blue-900 to-blue-950 flex items-center justify-center relative"
        >
          <div className="text-center">
            <div
              className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white transition-all ${
                participants[1]?.isSpeaking ? "bg-green-500 scale-110" : "bg-blue-600"
              }`}
            >
              {otherUserName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <p className="text-white text-lg font-semibold">{otherUserName}</p>
            <p className="text-gray-300 text-sm">{participants[1]?.isSpeaking ? "Speaking..." : "Connected"}</p>
          </div>

          {/* Local Video (Picture in Picture) */}
          <div className="absolute bottom-4 right-4 w-32 h-32 bg-gradient-to-br from-purple-900 to-purple-950 rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-lg font-bold text-white transition-all ${
                    participants[0]?.isSpeaking ? "bg-green-500 scale-110" : "bg-purple-600"
                  }`}
                >
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="text-white text-xs font-semibold">{userName}</p>
              </div>
            </div>
          </div>

          {/* Call Timer */}
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg font-mono text-sm">
            {formatTime(callDuration)}
          </div>

          {/* Screen Share Indicator */}
          {isScreenSharing && (
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold">
              <Monitor className="w-4 h-4" />
              Sharing Screen
            </div>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-950 border-t border-gray-800 px-4 py-4 flex items-center justify-center gap-4">
        {/* Mute Button */}
        <Button
          onClick={toggleMute}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-colors ${
            isMuted ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
        </Button>

        {/* Video Toggle */}
        <Button
          onClick={toggleVideo}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-colors ${
            !isVideoOn ? "bg-red-600 hover:bg-red-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
          title={!isVideoOn ? "Turn on video" : "Turn off video"}
        >
          {!isVideoOn ? <VideoOff className="w-5 h-5 text-white" /> : <Video className="w-5 h-5 text-white" />}
        </Button>

        {/* Screen Share Button */}
        <Button
          onClick={toggleScreenShare}
          className={`rounded-full w-12 h-12 p-0 flex items-center justify-center transition-colors ${
            isScreenSharing ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-600"
          }`}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? <MonitorOff className="w-5 h-5 text-white" /> : <Monitor className="w-5 h-5 text-white" />}
        </Button>

        {/* Fullscreen Button */}
        <Button
          onClick={toggleFullscreen}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Toggle fullscreen"
        >
          <Maximize2 className="w-5 h-5 text-white" />
        </Button>

        {/* Participants Button */}
        <Button
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-gray-700 hover:bg-gray-600 transition-colors"
          title="Participants"
        >
          <Users className="w-5 h-5 text-white" />
          <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            2
          </span>
        </Button>

        {/* End Call Button */}
        <Button
          onClick={endCall}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-red-600 hover:bg-red-700 transition-colors"
          title="End call"
        >
          <Phone className="w-5 h-5 text-white rotate-[135deg]" />
        </Button>
      </div>
    </div>
  )
}
