import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, User, Bot } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Animal {
  name: string;
  species: string;
  location: string;
  battery: number;
  status: "active" | "inactive" | "warning";
  lastUpdate: string;
}

const AIChatSection = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant for telemetry tracking. I can help you monitor your animals, check device status, analyze tracking data, and answer questions about your tracking systems. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Mock animal data
  const animals: Animal[] = [
    { name: "Leo", species: "Lion", location: "Savanna Zone A", battery: 85, status: "active", lastUpdate: "2 min ago" },
    { name: "Ellie", species: "Elephant", location: "Watering Hole B", battery: 92, status: "active", lastUpdate: "5 min ago" },
    { name: "Max", species: "Tiger", location: "Forest Zone C", battery: 23, status: "warning", lastUpdate: "1 hour ago" },
    { name: "Ruby", species: "Rhinoceros", location: "Plains Area D", battery: 67, status: "active", lastUpdate: "15 min ago" }
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputMessage("");
    setIsTyping(true);

    getAIResponse(inputMessage).then(response => {
      const aiMessage: Message = {
        id: String(messages.length + 2),
        text: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setIsTyping(false);
    });
  };

  const getAIResponse = async (message: string): Promise<string> => {
    // Simulate AI response delay
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`AI Response: ${message}`);
      }, 1500);
    });
  };

  useEffect(() => {
    const chatSection = document.getElementById('ai-chat');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <section id="ai-chat" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <img 
              src="/lovable-uploads/d17df9e2-0294-4cf1-a08e-c4da8338096f.png" 
              alt="AI Assistant" 
              className="w-12 h-12"
            />
            <h2 className="text-3xl font-bold text-gray-900">AI Assistant</h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get instant insights about your tracked animals, device status, and telemetry data through our intelligent assistant.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  Chat with AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about your tracking data, device status, or get analytics insights
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.isUser ? 'bg-blue-600' : 'bg-gray-200'
                        }`}>
                          {message.isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-gray-600" />}
                        </div>
                        <div className={`rounded-lg p-3 ${
                          message.isUser 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.isUser ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about your animals, devices, or get insights..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats & Suggestions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Animals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {animals.slice(0, 4).map((animal) => (
                  <div key={animal.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-sm">{animal.name}</p>
                      <p className="text-xs text-gray-600">{animal.species}</p>
                    </div>
                    <Badge variant={animal.status === 'active' ? 'default' : 'destructive'}>
                      {animal.battery}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  "Show me animals with low battery",
                  "Which animals are in Savanna Zone A?",
                  "Generate a weekly movement report",
                  "Alert me about inactive devices"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(suggestion)}
                    className="w-full text-left p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIChatSection;
