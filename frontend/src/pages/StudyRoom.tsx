import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Video, Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChatSection } from "@/components/study-room/ChatSection";
import { ProgressSection } from "@/components/study-room/ProgressSection";
import { RatingSection } from "@/components/study-room/RatingSection";

const StudyRoom = () => {
  const { roomId } = useParams();
  const { toast } = useToast();
  const [room, setRoom] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const studyRooms = JSON.parse(localStorage.getItem("studyRooms") || "[]");
    const currentRoom = studyRooms.find((r: any) => r.id === Number(roomId));
    setRoom(currentRoom || {
      id: Number(roomId),
      participants: [userEmail],
      progress: 0,
      messages: [],
      meetings: [],
    });
  }, [roomId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const studyRooms = JSON.parse(localStorage.getItem("studyRooms") || "[]");
    const updatedRooms = studyRooms.map((r: any) => {
      if (r.id === Number(roomId)) {
        return {
          ...r,
          messages: [
            ...r.messages,
            {
              id: Date.now(),
              from: userEmail,
              content: message,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return r;
    });

    localStorage.setItem("studyRooms", JSON.stringify(updatedRooms));
    setMessage("");
    setRoom(updatedRooms.find((r: any) => r.id === Number(roomId)));
  };

  const updateProgress = (newProgress: number) => {
    const studyRooms = JSON.parse(localStorage.getItem("studyRooms") || "[]");
    const updatedRooms = studyRooms.map((r: any) => {
      if (r.id === Number(roomId)) {
        return { ...r, progress: newProgress };
      }
      return r;
    });

    localStorage.setItem("studyRooms", JSON.stringify(updatedRooms));
    setRoom({ ...room, progress: newProgress });
    toast({
      title: "Progress Updated",
      description: `Study progress is now at ${newProgress}%`,
    });
  };

  const submitRating = (value: number) => {
    setRating(value);
    toast({
      title: "Rating Submitted",
      description: "Thank you for your feedback!",
    });
  };

  const scheduleSession = (date: Date | undefined) => {
    if (!date) return;
    
    const studyRooms = JSON.parse(localStorage.getItem("studyRooms") || "[]");
    const updatedRooms = studyRooms.map((r: any) => {
      if (r.id === Number(roomId)) {
        return {
          ...r,
          meetings: [
            ...r.meetings,
            {
              date: date.toISOString(),
              scheduled: new Date().toISOString(),
            },
          ],
        };
      }
      return r;
    });

    localStorage.setItem("studyRooms", JSON.stringify(updatedRooms));
    setRoom(updatedRooms.find((r: any) => r.id === Number(roomId)));
    setShowCalendar(false);
    setSelectedDate(date);
    
    toast({
      title: "Session Scheduled",
      description: `Study session scheduled for ${date.toLocaleDateString()}`,
    });
  };

  if (!room) return null;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Study Room</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => window.open("https://meet.google.com", "_blank")}
              className="flex items-center gap-2"
            >
              <Video className="h-4 w-4" />
              Start Meeting
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Schedule
            </Button>
          </div>
        </div>

        <ProgressSection progress={room.progress} updateProgress={updateProgress} />

        {showCalendar && (
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={scheduleSession}
              className="rounded-md border"
            />
          </Card>
        )}

        <RatingSection rating={rating} submitRating={submitRating} />

        <ChatSection
          messages={room.messages}
          message={message}
          userEmail={userEmail}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </DashboardLayout>
  );
};

export default StudyRoom;