"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Pause, Play, Volume2, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import Speech from "speak-tts";

const RecordButton = ({
  isListening,
  onClick,
  disabled,
}: {
  isListening: boolean;
  onClick: () => void;
  disabled: boolean;
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-full w-16 h-16 flex items-center justify-center transition-all ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${
      isListening
        ? "bg-red-500 hover:bg-red-600"
        : "bg-white/10 hover:bg-white/20"
    }`}
  >
    <Mic
      className={`w-6 h-6 ${isListening ? "text-white" : "text-gray-300"}`}
    />
  </Button>
);

type RecognitionStatus = "inactive" | "listening" | "processing";

const isSpeechRecognitionSupported = () => {
  return "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
};

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    mozSpeechRecognition: any;
    msSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const initializeSpeechRecognition = () => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;

  if (SpeechRecognition) {
    return new SpeechRecognition();
  }
  return null;
};

export default function InterviewPlatform() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const speechRef = useRef<Speech | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [recognitionStatus, setRecognitionStatus] =
    useState<RecognitionStatus>("inactive");
  const [isRecognitionSupported, setIsRecognitionSupported] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  const getNextQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          previousQuestions: questions,
          previousAnswers: answers,
        }),
      });

      if (!response.ok) throw new Error("Failed to get next question");

      const data = await response.json();
      setQuestions((prev) => [...prev, data.question]);
      return data.question;
    } catch (error) {
      console.error("Error getting next question:", error);
      return "Расскажите о вашем профессиональном опыте"; 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const speech = new Speech();
    speech
      .init({
        volume: 1,
        lang: "ru-RU",
        rate: 1,
        pitch: 1,
        splitSentences: true,
      })
      .then((data) => {
        speechRef.current = speech;
      })
      .catch((e) => {
        console.error("An error occurred while initializing speech:", e);
      });

    return () => {
      if (speechRef.current) {
        speechRef.current.cancel();
      }
    };
  }, []);

  const addLog = (message: string) => {
    console.log(message);
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const recognition = initializeSpeechRecognition();

      if (!recognition) {
        throw new Error("No speech recognition available");
      }

      recognition.lang = "ru-RU";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        addLog("🎤 Recognition started");
      };

      recognition.onend = () => {
        setIsListening(false);
        addLog("⏹️ Recognition ended");
        if (isListening) {
          try {
            recognition.start();
          } catch (e) {
            addLog("⚠️ Failed to restart recognition");
          }
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentAnswer(transcript);
        addLog(`📝 Recorded: "${transcript}"`);
      };

      recognition.onerror = (event: any) => {
        addLog(`⚠️ Recognition error: ${event.error}`);
        if (
          event.error === "not-allowed" ||
          event.error === "service-not-allowed"
        ) {
          setShowManualInput(true);
        } else {
          setTimeout(() => {
            if (isListening) {
              try {
                recognition.start();
              } catch (e) {
                addLog("⚠️ Failed to restart after error");
              }
            }
          }, 1000);
        }
      };

      recognitionRef.current = recognition;
      addLog("✅ Recognition system initialized");
    } catch (error) {
      addLog(`❌ Recognition setup failed: ${error}`);
      setShowManualInput(true);
    }
  }, []);

  const toggleRecording = () => {
    if (isSpeaking) return;
    
    if (!isListening) {
      startRealtimeTranscription();
    } else {
      stopRealtimeTranscription();
    }
  };

  useEffect(() => {
    return () => {
      if (isListening) {
        stopRealtimeTranscription();
      }
    };
  }, []);

  const startInterview = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      audioContextRef.current = new AudioContext();
      const source =
        audioContextRef.current.createMediaStreamSource(audioStream);

      setIsStarted(true);
      const firstQuestion = await getNextQuestion();
      speakQuestion(0, firstQuestion);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const speakQuestion = async (index: number, questionText?: string) => {
    setCurrentQuestion(index);
    setIsSpeaking(true);
    const textToSpeak = questionText || questions[index];

    if (speechRef.current) {
      speechRef.current.speak({
        text: textToSpeak,
        queue: false,
        listeners: {
          onstart: () => {
            setIsSpeaking(true);
          },
          onend: () => {
            setIsSpeaking(false);
          },
          onerror: () => {
            setIsSpeaking(false);
          },
        },
      });
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (speechRef.current) {
      if (!isPaused) {
        speechRef.current.pause();
      } else {
        speechRef.current.resume();
      }
    }
  };

  const cleanup = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    if (speechRef.current) {
      speechRef.current.cancel();
    }

    setIsStarted(false);
    setCurrentQuestion(0);
    setIsSpeaking(false);
    setIsPaused(false);
    setQuestions([]);
    setAnswers([]);
    setCurrentAnswer("");
    setLogs([]);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const startRealtimeTranscription = async () => {
    try {
      addLog("🎤 Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addLog("✅ Microphone access granted");

      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        addLog("🎯 Processing recorded audio...");
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });

        try {
          if (audioBlob.size < 1000) {
            addLog("⚠️ Audio recording too short or silent");
            return;
          }

          addLog("🚀 Sending to transcription service...");
          addLog(`📦 Audio blob size: ${audioBlob.size} bytes`);

          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.wav');

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          addLog(`📢 Raw API response: ${JSON.stringify(data)}`);

          if (!response.ok) {
            throw new Error(`Transcription failed: ${data.error || response.statusText}`);
          }

          if (data.text) {
            addLog(`✨ Got transcription: "${data.text}"`);
            
            if (questions.length >= 5) {
              setAnswers(prev => [...prev, data.text]);
              addLog("🎬 Interview completed");
              setTimeout(() => {
                cleanup();
              }, 5000);
              return;
            }

            addLog("🤖 Sending to AI...");
            const aiResponse = await fetch("/api/interview", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                previousQuestions: questions,
                previousAnswers: [...answers, data.text],
              }),
            });

            if (!aiResponse.ok) {
              throw new Error('Failed to get AI response');
            }

            const aiData = await aiResponse.json();
            addLog(`📢 AI responded with: "${aiData.question}"`);

            setAnswers((prev) => [...prev, data.text]);
            setQuestions((prev) => [...prev, aiData.question]);
            setCurrentQuestion((prev) => prev + 1);

            if (speechRef.current) {
              speechRef.current.speak({
                text: aiData.question,
                queue: false,
                listeners: {
                  onend: () => setIsSpeaking(false),
                },
              });
            }
          } else {
            throw new Error('No transcription text in response');
          }
        } catch (error: any) {
          addLog(`❌ Error during transcription: ${error.message}`);
          console.error("Full error:", error);
          setNetworkError(true);
        }
      };
      streamRef.current = stream;
      mediaRecorder.start();
      setIsListening(true);
      addLog("✅ Recording started");
      setTimeout(() => {
        mediaRecorder.stop();
        setIsListening(false);
        addLog("⏹️ Recording stopped");
      }, 5000);
    } catch (error) {
      addLog(`❌ Setup failed: ${error.message}`);
      setShowManualInput(true);
    }
  };

  const stopRealtimeTranscription = () => {
    setIsListening(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    addLog("⏹️ Recording stopped and cleaned up");
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="relative h-screen flex flex-col">
        <div className="p-4 flex justify-between items-center">
          <div className="text-sm opacity-60">Freedom AI Interview</div>
          <motion.div
            animate={{ opacity: isStarted ? 1 : 0.6 }}
            className="flex items-center space-x-2"
          >
            {isLoading ? (
              <div className="text-sm">Generating question...</div>
            ) : (
              <>
                <div
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-[#4fb84f]" : "bg-red-500"
                  }`}
                />
                <span className="text-sm">
                  {isOnline ? "Connected" : "Offline"}
                </span>
              </>
            )}
          </motion.div>
        </div>

        {!isStarted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col items-center justify-center px-4"
          >
            <h1 className="text-4xl font-bold mb-12 text-center">
              Начните ваше
              <br />
              AI интервью
            </h1>

            <div className="max-w-md w-full space-y-6 mb-12">
              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-[#4fb84f]/20 flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-[#4fb84f]" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Естественный диалог</h3>
                  <p className="text-sm text-gray-400">
                    AI адаптируется к вашим ответам и ведет естественную беседу
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-2xl bg-white/5">
                <div className="w-10 h-10 rounded-full bg-[#4fb84f]/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-[#4fb84f]" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Голосовое взаимодействие</h3>
                  <p className="text-sm text-gray-400">
                    Отвечайте на вопросы естественным голосом
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={startInterview}
              className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg font-medium"
            >
              Начать интервью
            </Button>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1">
              <Webcam
                audio={false}
                mirrored
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                  width: 1280,
                  height: 720,
                  facingMode: "user",
                }}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                <div className="max-w-2xl mx-auto">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <h2 className="text-2xl font-medium text-white">
                      {questions[currentQuestion]}
                    </h2>
                  </motion.div>
                  {showManualInput && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4"
                    >
                      <textarea
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        placeholder="Введите ваш ответ здесь..."
                        className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 resize-none"
                        rows={3}
                      />
                      <Button
                        onClick={async () => {
                          if (currentAnswer.trim()) {
                            setAnswers((prev) => [...prev, currentAnswer]);
                            if (currentQuestion < 4) {
                              const nextQuestion = await getNextQuestion();
                              speakQuestion(currentQuestion + 1, nextQuestion);
                            }
                            setCurrentAnswer("");
                          }
                        }}
                        className="mt-2 bg-white/20 hover:bg-white/30 text-white"
                      >
                        Отправить ответ
                      </Button>
                    </motion.div>
                  )}
                  {networkError && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 text-red-400 text-sm"
                    >
                      Проблема с подключением к сети. Пожалуйста, используйте
                      ручной ввод или попробуйте позже.
                    </motion.div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={togglePause}
                        className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20"
                      >
                        {isPaused ? (
                          <Play className="w-5 h-5" />
                        ) : (
                          <Pause className="w-5 h-5" />
                        )}
                      </Button>
                      <span className="text-sm text-white opacity-60">
                        Вопрос {currentQuestion + 1} из 5
                        {currentQuestion === 4 && " (последний)"}
                      </span>
                    </div>

                    {!showManualInput && (
                      <div className="relative">
                        <RecordButton
                          isListening={isListening}
                          onClick={toggleRecording}
                          disabled={isSpeaking}
                        />
                        {isSpeaking && (
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-sm text-white/70">
                            Дождитесь окончания речи ИИ
                          </div>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={cleanup}
                      className="rounded-full w-12 h-12 bg-white/10 hover:bg-white/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isStarted && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-4 left-4"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogs(prev => !prev)}
            className="text-xs text-white/50 hover:text-white/70"
          >
            {showLogs ? 'Hide Logs' : 'Show Logs'}
          </Button>
          
          {showLogs && (
            <div className="mt-2 max-w-xs bg-black/80 rounded-lg p-4 text-xs text-white/70 font-mono">
              <div className="max-h-48 overflow-y-auto space-y-1">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
