"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ApiResponse {
  message: string;
  notice?: string;
  error?: string;
}

export default function ScriptChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI script assistant. I can help you create engaging YouTube video scripts. What type of video would you like to make?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = (behavior: "auto" | "smooth" = "smooth") => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        const isAtBottom =
          scrollContainer.scrollHeight -
            scrollContainer.scrollTop -
            scrollContainer.clientHeight <
          100;

        if (isAtBottom || behavior === "auto") {
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({
              behavior,
              block: "end",
            });
          }, 0);
        }
      }
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(
        messages[messages.length - 1].role === "assistant" ? "smooth" : "auto"
      );
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: userMessage }],
        }),
      });

      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      if (data.notice) {
        toast({
          title: "Notice",
          description: data.notice,
          variant: "default",
        });
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description:
          "The service is temporarily unavailable. Please try again in a few minutes.",
        variant: "destructive",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm experiencing high demand right now. Please try again in a few minutes.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="relative flex flex-col h-[calc(100vh-4rem)]">
        <ScrollArea
          ref={scrollAreaRef}
          className="flex-1 h-[calc(100vh-4rem-64px-80px)]"
        >
          <div className="max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-6",
                  message.role === "assistant" ? "" : ""
                )}
              >
                <div className="max-w-3xl mx-auto flex gap-4">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium",
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" ? "AI" : "You"}
                  </div>
                  <div
                    className={cn(
                      "flex-1 space-y-2 p-4 rounded-2xl",
                      message.role === "assistant"
                        ? "border border-primary/20"
                        : "border border-muted-foreground/20"
                    )}
                  >
                    <p className="leading-7 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-4" ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[60px] max-h-[200px] flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-[60px] w-[60px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Send className="h-6 w-6" />
                )}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
