
import { useState, useEffect } from "react";
import { MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

interface ChatbotButtonProps {
  initialState?: boolean;
}

export function ChatbotButton({ initialState = false }: ChatbotButtonProps) {
  const [isOpen, setIsOpen] = useState(initialState);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([
    { role: 'bot', content: 'Hello! I\'m your university assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Effect to update isOpen when initialState changes
  useEffect(() => {
    setIsOpen(initialState);
  }, [initialState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    // Simple response patterns for demo
    setTimeout(() => {
      let response = "I'm sorry, I don't understand. Can you rephrase your question?";
      
      const query = userMessage.content.toLowerCase();
      
      if (query.includes('course') && query.includes('enroll')) {
        response = "To enroll in a course, go to the Courses section and click the 'Enroll' button next to the course you want to join.";
      } else if (query.includes('fee') || query.includes('payment')) {
        response = "You can view your fee details and make payments in the Fees section. We accept credit cards and bank transfers.";
      } else if (query.includes('grade') || query.includes('result')) {
        response = "Your grades are available in the Grades section. You can view them by course or by semester.";
      } else if (query.includes('exam') && query.includes('schedule')) {
        response = "Exam schedules are available in the Schedule section. You can filter by course or date.";
      } else if (query.includes('attendance')) {
        response = "You can check your attendance records in the Attendance section. It shows your attendance percentage for each course.";
      } else if (query.includes('hello') || query.includes('hi')) {
        response = "Hello there! How can I assist you with your university portal today?";
      } else if (query.includes('thank')) {
        response = "You're welcome! Is there anything else I can help you with?";
      } else if (query.includes('ai') && query.includes('study')) {
        response = "Our AI Study Helper can summarize texts, explain concepts, and analyze your performance. Check it out in the AI Study Helper section.";
      }
      
      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Chatbot button - only shown when chat is not open */}
      {!isOpen && (
        <Button
          className="fixed right-6 bottom-6 rounded-full h-12 w-12 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}

      {/* Chat dialog */}
      {isOpen && (
        <Card className="fixed right-6 bottom-20 w-[350px] sm:w-[400px] h-[500px] shadow-xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-medium">University Assistant</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg p-3 ${
                    msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3">
                  <Spinner size="sm" />
                </div>
              </div>
            )}
          </div>
          
          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="sm">Send</Button>
          </form>
        </Card>
      )}
    </>
  );
}
