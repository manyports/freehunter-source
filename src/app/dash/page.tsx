"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Building2,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const JobDetailView = ({ job }) => (
  <div className="flex flex-col h-full">
    <div className="h-1 w-full bg-green-500 rounded-t-lg" />
    <ScrollArea className="flex-grow">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-4 h-4" />
            <span>{job.company}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{job.employmentType}</span>
          </div>
          <div className="flex items-center gap-2 text-green-600 font-medium">
            <DollarSign className="w-4 h-4" />
            <span>{job.salary}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Обязанности</h3>
          <ul className="space-y-2 text-gray-600">
            {job.responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Требования</h3>
          <ul className="space-y-2 text-gray-600">
            {job.requirements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Преимущества</h3>
          <ul className="space-y-2 text-gray-600">
            {job.benefits.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollArea>
  </div>
);

const FeatureCard = ({ feature, isMobile = false }) => (
  <Card className={`h-full ${isMobile ? "shadow-none border-none" : ""}`}>
    <CardHeader>
      <CardTitle className="flex items-center text-lg">
        {feature.icon}
        {feature.title}
      </CardTitle>
      <CardDescription className="text-gray-600">
        {feature.description}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button
        className="w-full bg-green-500 hover:bg-green-600 text-white"
        onClick={() => (window.location.href = feature.link)}
      >
        {feature.buttonText}
      </Button>
    </CardContent>
  </Card>
);

const JobCardSkeleton = () => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
    <div className="space-y-2">
      <Skeleton className="h-5 w-[200px]" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </div>
    <Skeleton className="h-10 w-[100px]" />
  </div>
);

export default function UserDashboard() {
  const [chatMessages, setChatMessages] = useState([
    {
      role: "bot",
      content:
        "Здравствуйте! Я ИИ-ассистент Freedom. Как я могу помочь вам сегодня?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const features = [
    {
      title: "Генерация резюме",
      description: "Создайте профессиональное резюме с помощью нашего ИИ",
      icon: <FileText className="mr-2 h-5 w-5 text-green-500" />,
      buttonText: "Создать резюме",
      link: "/dash/form",
    },
    {
      title: "Ревью резюме",
      description: "Получите профессиональный анализ вашего резюме",
      icon: <FileText className="mr-2 h-5 w-5 text-green-500" />,
      buttonText: "Отправить на проверку",
      link: "/dash/feedback",
    },
    {
      title: "AI Собеседование",
      description: "Пройдите пробное собеседование с ИИ",
      icon: <MessageSquare className="mr-2 h-5 w-5 text-green-500" />,
      buttonText: "Начать собеседование",
      link: "dash/interview",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + features.length) % features.length);
  };

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        role: "user",
        content: inputMessage,
        timestamp: new Date().toISOString(),
      };

      setChatMessages((prev) => [...prev, userMessage]);
      setChatHistory((prev) => [
        ...prev,
        { role: "user", content: inputMessage },
      ]);

      setInputMessage("");
      setIsTyping(true);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputMessage,
            history: chatHistory,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          const botMessage = {
            role: "bot",
            content: data.content,
            timestamp: new Date().toISOString(),
          };

          setChatMessages((prev) => [...prev, botMessage]);
          setChatHistory((prev) => [
            ...prev,
            { role: "assistant", content: data.content },
          ]);
        } else {
          throw new Error(data.error || "Failed to get response");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          role: "bot",
          content: "Извините, произошла ошибка. Попробуйте позже.",
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const JobCard = ({ job }) => (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Building2 className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <Button variant="outline">Подробнее</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 max-h-[80vh] overflow-auto flex flex-col">
        <JobDetailView job={job} />
      </DialogContent>
    </Dialog>
  );

  const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-4">
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
      <div className="typing-dot"></div>
    </div>
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/jobs/random', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setJobs(data.jobs);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-green-500">Личный кабинет</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ключевые функции</h2>
          <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
          <div className="sm:hidden">
            <FeatureCard feature={features[currentSlide]} isMobile={true} />
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={prevSlide}
                className="w-8 h-8 flex items-center justify-center text-gray-600"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              {features.map((_, index) => (
                <div
                  key={index}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${
                      currentSlide === index
                        ? "w-8 bg-green-500"
                        : "bg-gray-300"
                    }
                  `}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
              <button
                onClick={nextSlide}
                className="w-8 h-8 flex items-center justify-center text-gray-600"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Рекомендуемые вакансии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                  <JobCardSkeleton />
                </>
              ) : (
                jobs.map((job, index) => (
                  <JobCard key={index} job={job} />
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="border-b">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">ИИ-ассистент</CardTitle>
                <CardDescription>Онлайн</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col p-0">
            <ScrollArea className="flex-grow px-4 py-6">
              <div className="space-y-6">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`
                          rounded-2xl p-4 
                          ${
                            message.role === "user"
                              ? "bg-green-500 text-white rounded-br-none"
                              : "bg-gray-100 text-black rounded-bl-none"
                          }
                        `}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-gray-500 mt-1 block">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Напишите сообщение..."
                  className="border-0 bg-transparent placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button
                  onClick={sendMessage}
                  className="bg-green-500 hover:bg-green-600 rounded-xl h-10 w-10 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
