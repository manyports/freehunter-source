"use client";

import type { JobCardProps, JobData, Preview3DProps } from "@/types/job";
import { Center, Float, OrbitControls, Text } from "@react-three/drei";
import { Canvas, RootState } from "@react-three/fiber";
import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Briefcase,
  Building2,
  Clock,
  Edit,
  MapPin,
  Send,
  Sparkles,
} from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation';

const translateEmploymentType = (type: string): string => {
  const translations: { [key: string]: string } = {
    "full-time": "Полная занятость",
    "part-time": "Частичная занятость",
    contract: "Контракт",
    temporary: "Временная работа",
    internship: "Стажировка",
  };
  return translations[type] || type;
};

const translateExperience = (exp: string): string => {
  const translations: { [key: string]: string } = {
    "no-experience": "Без опыта",
    "1-3": "1-3 года",
    "3-5": "3-5 лет",
    "5-plus": "Более 5 лет",
  };
  return translations[exp] || exp;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Preview Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-red-500">
          Something went wrong with the 3D preview.
        </div>
      );
    }

    return this.props.children;
  }
}

function JobCard({ jobData }: JobCardProps) {
  const [textError, setTextError] = useState(false);

  if (textError) {
    return (
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 6, 0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    );
  }

  return (
    <Center>
      <group>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 6, 0.1]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <Suspense fallback={null}>
          <Text
            position={[-1.8, 2, 0.1]}
            fontSize={0.3}
            color="black"
            anchorX="left"
            maxWidth={3.5}
            font="/fonts/Inter-Bold.woff"
          >
            {jobData.title || "Название должности"}
          </Text>

          <Text
            position={[-1.8, 1.4, 0.1]}
            fontSize={0.25}
            color="#4b5563"
            anchorX="left"
            maxWidth={3.5}
            font="/fonts/Inter-Medium.woff"
          >
            {jobData.company || "Компания"}
          </Text>

          <Text
            position={[-1.8, 0.8, 0.1]}
            fontSize={0.2}
            color="#6b7280"
            anchorX="left"
            maxWidth={3.5}
            font="/fonts/Inter-Regular.woff"
          >
            {jobData.location || "Местоположение"}
          </Text>

          <Text
            position={[-1.8, 0.3, 0.1]}
            fontSize={0.2}
            color="#10b981"
            anchorX="left"
            maxWidth={3.5}
            font="/fonts/Inter-Medium.woff"
          >
            {jobData.salary || "Зарплата"}
          </Text>

          <Text
            position={[-1.8, -0.5, 0.1]}
            fontSize={0.18}
            color="#6b7280"
            anchorX="left"
            maxWidth={3.5}
            font="/fonts/Inter-Regular.woff"
          >
            {jobData.description || "Описание вакансии"}
          </Text>
        </Suspense>
      </group>
    </Center>
  );
}

function Preview3D({ jobData }: Preview3DProps) {
  return (
    <ErrorBoundary>
      <div className="h-[600px] w-full rounded-lg border border-gray-200 bg-gray-50">
        <Canvas
          camera={{ position: [0, 0, 10] }}
          onCreated={(state: RootState) => {
            console.log("Canvas created:", state);
          }}
        >
          <color attach="background" args={["#f9fafb"]} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />

          <Suspense fallback={null}>
            <JobCard jobData={jobData} />
          </Suspense>

          <OrbitControls
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
}

function Preview2D({ jobData }: { jobData: JobData }) {
  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-2 bg-gradient-to-r from-green-400 to-green-500" />

      <div className="p-8">
        <motion.h2
          className="text-2xl font-bold text-gray-900 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {jobData.title || "Название должности"}
        </motion.h2>
        <motion.div
          className="flex items-center mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-gray-600" />
          </div>
          <div className="ml-3">
            <p className="text-lg font-medium text-gray-900">
              {jobData.company || "Компания"}
            </p>
          </div>
        </motion.div>
        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">
              {jobData.location || "Местоположение"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">
              {jobData.employmentType
                ? translateEmploymentType(jobData.employmentType)
                : "Тип занятости"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">
              {jobData.experience
                ? translateExperience(jobData.experience)
                : "Опыт работы"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-green-500" />
            <span className="text-green-600 font-medium">
              {jobData.salary || "Зарплата"}
            </span>
          </div>
        </motion.div>
        <div className="description-content">
          {jobData.description.split('\n').map((line, index) => {
            if (line.startsWith('### ')) {
              return (
                <h1 key={index} className="text-2xl font-bold text-gray-900 mb-6">
                  {line.replace('### ', '')}
                </h1>
              );
            }
            else if (line.startsWith('#### ')) {
              return (
                <h2 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-4">
                  {line.replace('#### ', '')}
                </h2>
              );
            }
            else if (line.startsWith('•')) {
              return (
                <div key={index} className="flex items-start space-x-2 ml-4 my-1">
                  <span className="text-green-500 flex-shrink-0">•</span>
                  <span className="text-gray-600">{line.substring(1).trim()}</span>
                </div>
              );
            }
            else if (line.trim() !== '') {
              return (
                <p key={index} className="text-gray-600 mb-2">
                  {line}
                </p>
              );
            }
            return null;
          })}
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        ></motion.div>
      </div>
    </motion.div>
  );
}

function LoadingModal() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full mx-4"
      >
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <svg className="w-16 h-16 text-green-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </motion.div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            Генерация описания вакансии
          </h3>
          <p className="text-gray-500">
            Пожалуйста, подождите. Искусственный интеллект создает оптимальное описание вакансии на основе введенных данных...
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Component() {
  const router = useRouter();
  const [step, setStep] = useState<"choice" | "form" | "preview">("choice");
  const [isAIWriting, setIsAIWriting] = useState(false);
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    company: "",
    location: "",
    salary: "",
    employmentType: "",
    experience: "",
    description: "",
  });
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [aiError, setAIError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const companies = [
    "Freedom Bank",
    "Freedom Insurance",
    "Freedom Telecom",
    "Five Mobile",
    "Freedom Sapagat",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setJobData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    console.log("Job data submitted:", jobData);
    setStep("preview");
  };

  const renderChoice = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 text-center"
    >
      <h2 className="text-3xl font-bold mb-4">
        Как вы хотите создать вакансию?
      </h2>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsAIWriting(true);
          setStep("form");
        }}
        className="w-full flex items-center justify-center gap-3 rounded-lg bg-green-500 px-6 py-4 text-white text-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out shadow-lg"
      >
        <Sparkles className="h-6 w-6" />
        Написать с помощью ИИ
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setIsAIWriting(false);
          setStep("form");
        }}
        className="w-full flex items-center justify-center gap-3 rounded-lg bg-white px-6 py-4 text-green-500 text-lg font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out shadow-lg border border-green-500"
      >
        <Edit className="h-6 w-6" />
        Написать самостоятельно
      </motion.button>
    </motion.div>
  );

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Название должности
        </label>
        <input
          type="text"
          id="title"
          value={jobData.title}
          onChange={handleInputChange}
          placeholder="Например: Senior Java Developer"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="company">Компания</Label>
        <Select onValueChange={(value) => handleInputChange({ target: { id: 'company', value } })}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите компанию" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((company) => (
              <SelectItem key={company} value={company}>
                {company}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Мстоположение
        </label>
        <input
          type="text"
          id="location"
          value={jobData.location}
          onChange={handleInputChange}
          placeholder="Например: Алматы, Казахстан"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
      </div>

      <div>
        <label
          htmlFor="salary"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Зарплата
        </label>
        <input
          type="text"
          id="salary"
          value={jobData.salary}
          onChange={handleInputChange}
          placeholder="Например: 500 000 - 800 000 тг"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="employmentType">Тип занятости</Label>
        <Select 
          onValueChange={(value) => handleInputChange({ target: { id: 'employmentType', value } })}
          defaultValue={jobData.employmentType}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите тип занятости" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full-time">Полная занятость</SelectItem>
            <SelectItem value="part-time">Частичная занятость</SelectItem>
            <SelectItem value="contract">Контракт</SelectItem>
            <SelectItem value="temporary">Временная работа</SelectItem>
            <SelectItem value="internship">Стажировка</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="experience">Требуемый опыт работы</Label>
        <Select 
          onValueChange={(value) => handleInputChange({ target: { id: 'experience', value } })}
          defaultValue={jobData.experience}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Выберите требуемый опыт" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-experience">Без опыта</SelectItem>
            <SelectItem value="1-3">1-3 года</SelectItem>
            <SelectItem value="3-5">3-5 лет</SelectItem>
            <SelectItem value="5-plus">Более 5 лет</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Описание вакансии
        </label>
        <textarea
          id="description"
          value={jobData.description}
          onChange={handleInputChange}
          rows={6}
          placeholder="Опишите требовани, обязанности и условия работы..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
        />
      </div>

      {isAIWriting && (
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateWithAI}
            disabled={showLoadingModal}
            className="w-full rounded-lg bg-purple-500 px-6 py-3 text-white font-semibold hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="inline-block w-5 h-5 mr-2" />
            Сгенерировать описание
          </motion.button>
          
          {aiError && (
            <div className="text-red-500 text-sm text-center">
              {aiError}
            </div>
          )}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSubmit}
        className="w-full rounded-lg bg-green-500 px-6 py-3 text-white font-semibold hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-lg"
      >
        Предпросмотр вакансии
      </motion.button>
    </motion.div>
  );

  const handlePublishJob = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/publicjob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to publish job');
      }

      router.push('/admin');
    } catch (error) {
      console.error('Error publishing job:', error);
      setSubmitError('Failed to publish job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Preview2D jobData={jobData} />
      <Button 
        className="w-full" 
        onClick={handlePublishJob}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Отправка...
          </span>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Отправить
          </>
        )}
      </Button>
      {submitError && (
        <div className="text-red-500 text-sm text-center mt-2">
          {submitError}
        </div>
      )}
    </motion.div>
  );

  const generateWithAI = async () => {
    setShowLoadingModal(true);
    setAIError(null);

    try {
      const response = await fetch('/api/generatejob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: jobData.title,
          company: jobData.company,
          location: jobData.location,
          employmentType: jobData.employmentType,
          experience: jobData.experience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate description');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setJobData(prev => ({
        ...prev,
        description: data.description
      }));
      setStep('preview');
    } catch (error) {
      console.error('AI Generation Error:', error);
      setAIError('Произошла ошибка при генерации описания. Пожалуйста, попробуйте еще раз.');
    } finally {
      setShowLoadingModal(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">
          {showLoadingModal && <LoadingModal />}
          {step === "choice" && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <div className="mb-12 text-center">
                <motion.div
                  className="mb-6 text-green-500 inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className="h-16 w-16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0L14.645 9.355L24 12L14.645 14.645L12 24L9.355 14.645L0 12L9.355 9.355L12 0Z" />
                  </svg>
                </motion.div>
                <h1 className="text-4xl font-bold mb-4">
                  Создать вакансию за минуту
                </h1>
                <p className="text-xl text-gray-600">
                  Найдите идеального канддата для вашей команды
                </p>
              </div>
              {renderChoice()}
            </motion.div>
          )}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Заполните детали вакансии
              </h2>
              {renderForm()}
            </motion.div>
          )}
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                Предпросмотр вакансии
              </h2>
              {renderPreview()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
