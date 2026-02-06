"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import VideoMeeting from "@/components/video-meeting";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Phone } from "lucide-react";

function MeetingContent({ params }: { params: Promise<{ roomId: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<"doctor" | "patient">("patient");
  const [otherUserName, setOtherUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const asyncParams = async () => {
      const p = await params;
      setRoomId(p.roomId);

      // Get parameters from URL
      const name = searchParams.get("name") || "Guest User";
      const role =
        (searchParams.get("role") as "doctor" | "patient") || "patient";
      const otherName = searchParams.get("otherName") || "Healthcare Provider";

      setUserName(name);
      setUserRole(role);
      setOtherUserName(otherName);
    };

    asyncParams();
  }, [params, searchParams]);

  const handleJoinMeeting = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, establish WebRTC connection here
      setIsConnected(true);
    } catch (err) {
      setError("Failed to connect to meeting. Please try again.");
      setIsConnecting(false);
    }
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setIsConnecting(false);
    router.push("/");
  };

  if (!userName || !roomId) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="animate-spin">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="w-full h-screen">
        <VideoMeeting
          meetingId={roomId}
          userName={userName}
          userRole={userRole}
          otherUserName={otherUserName}
          onEnd={handleEndCall}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Join Video Consultation</CardTitle>
          <CardDescription>Connect with {otherUserName}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Meeting Info */}
          <div className="space-y-4 bg-secondary/30 p-4 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Meeting ID
              </p>
              <p className="font-mono text-sm font-semibold text-foreground break-all">
                {roomId}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Your Name
              </p>
              <p className="font-semibold text-foreground">{userName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                Connecting to
              </p>
              <p className="font-semibold text-foreground">{otherUserName}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnecting ? "bg-yellow-500 animate-pulse" : "bg-green-500"
              }`}
            />
            <p className="text-sm text-muted-foreground">
              {isConnecting ? "Connecting to meeting..." : "Ready to connect"}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="flex-1 border-border"
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinMeeting}
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Join Meeting
                </>
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="• Ensure your camera and microphone are enabled" />
            <p>• Use a stable internet connection</p>
            <p>• Allow browser permissions for camera and microphone</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MeetingPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MeetingContent params={params} />
    </Suspense>
  );
}
