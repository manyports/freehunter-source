"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const positions = [
  "Senior Full-Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "DevOps Engineer",
  "QA Engineer",
  "Project Manager",
];

const questions = [
  {
    id: "fullName",
    question: "как вас зовут?",
    placeholder: "например: Тимур Турлов",
  },
  {
    id: "email",
    question: "ваш email адрес?",
    placeholder: "example@mail.com",
  },
  {
    id: "phone",
    question: "ваш номер телефона?",
    type: "phone",
  },
  {
    id: "position",
    question: "на какую должность вы претендуете?",
    type: "position",
  },
  {
    id: "experience",
    question: "какой у вас опыт работы?",
    placeholder: "5 лет в Freedom Bank...",
  },
  {
    id: "education",
    question: "какое у вас образование?",
    placeholder: "например: Назарбаев Университет",
  },
  {
    id: "skills",
    question: "какие навыки и компетенции у вас есть?",
    placeholder: "Например: создание уникальных концепций для проектов",
  },
  {
    id: "motivation",
    question: "почему вы хотите работать в freedom bank?",
    placeholder: "Меня привлекает...",
  },
  {
    id: "availability",
    question: "когда вы сможете начать работать?",
    placeholder: "например: через 2 недели...",
  },
  {
    id: "salaryExpectations",
    question: "какие у вас ожидания по заработной плате?",
    placeholder: "от 450,000 тенге",
  },
];

export default function Form() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answers[questions[currentQuestion].id]) {
      handleNext();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestion]);

  const isLastQuestion = currentQuestion === questions.length - 1;
  const currentQ = questions[currentQuestion];

  const renderInput = () => {
    if (currentQ.type === "phone") {
      return (
        <PhoneInput
          country="kz"
          value={answers[currentQ.id] || ""}
          onChange={(phone) =>
            setAnswers((prev) => ({ ...prev, [currentQ.id]: phone }))
          }
          containerClass="w-full"
          inputClass="!w-full !bg-transparent !border-t-0 !border-x-0 !border-b-2 !border-gray-200 focus:!border-[#4fb84f] !outline-none !p-0 !py-3 !pl-12 !text-xl !transition-all !rounded-none"
          buttonClass="!border-0 !bg-transparent !p-0 !pr-1"
        />
      );
    }

    if (currentQ.type === "position") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {positions.map((position) => (
            <div
              key={position}
              className={`px-1 py-3 cursor-pointer transition-all border-b-2 ${
                answers[currentQ.id] === position
                  ? "border-[#4fb84f] text-[#4fb84f]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() =>
                setAnswers((prev) => ({ ...prev, [currentQ.id]: position }))
              }
            >
              <h3 className="font-medium">{position}</h3>
            </div>
          ))}
        </div>
      );
    }

    return (
      <input
        ref={inputRef}
        type="text"
        value={answers[currentQ.id] || ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
        }
        className="w-full bg-transparent border-b-2 border-gray-200 focus:border-[#4fb84f] outline-none px-1 py-3 text-xl transition-all"
        placeholder={currentQ.placeholder}
      />
    );
  };

  const generateResume = async () => {
    try {
      const response = await fetch("/api/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error("Failed to generate DOCX");
      }

      const docxBlob = await response.blob();

      const url = window.URL.createObjectURL(docxBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${answers.fullName}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating DOCX:", error);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
          >
            <Check className="w-10 h-10 text-green-500" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight">
              Ваше резюме готово!
            </h1>
            <p className="text-gray-600">
              Спасибо за заполнение формы. Ваше резюме сгенерировано и готово к
              скачиванию.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <Button
              onClick={generateResume}
              className="w-full bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/50 transition-all hover:shadow-green-500/80"
            >
              Скачать резюме
            </Button>
            <Link href="/dash">
              <Button variant="outline" className="w-full mt-8">
                Вернуться на главную
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 font-sans">
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                className="text-[#4fb84f]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="font-mono">
                  {String(currentQuestion + 1).padStart(2, "0")} /{" "}
                  {String(questions.length).padStart(2, "0")}
                </span>
              </motion.div>
              <motion.h1
                className="text-4xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {currentQ.question}
              </motion.h1>
            </div>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {renderInput()}
            </motion.form>
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        className="fixed bottom-6 right-6 flex items-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
          size="icon"
          className="rounded-md text-[#4fb84f] hover:bg-[#4fb84f] hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {isLastQuestion ? (
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            variant="outline"
            className="rounded-md text-[#4fb84f] hover:bg-[#4fb84f] hover:text-white transition-colors px-4 py-2"
          >
            Отправить!
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!answers[questions[currentQuestion].id]}
            variant="outline"
            size="icon"
            className="rounded-md text-[#4fb84f] hover:bg-[#4fb84f] hover:text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <div className="font-mono text-sm text-gray-400">Freedom Bank</div>
      </motion.div>
    </div>
  );
}
