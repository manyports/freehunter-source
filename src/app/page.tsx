"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TypeAnimation } from "react-type-animation";

const typingPhrases = ["Быстро", "Просто", "Эффективно"];

const features = [
  {
    title: "СТРАНИЦА ОБЗОРА КАНДИДАТОВ",
    description:
      "Получите полное представление о кандидатах на одной удобной странице. Сравнивайте, оценивайте и легко выбирайте лучших.",
    theme: "white",
    image: "https://utfs.io/f/V8CztowAHZRpfjW1CsNFDYkRBmVSCzEO5luKdt01Lw8qnMos",
  },
  {
    title: "ПУБЛИКАЦИЯ ВАКАНСИИ С AI",
    description:
      "Создавайте идеальное описание вакансии за секунды! Искусственный интеллект предложит формулировки, которые привлекут лучших кандидатов.",
    theme: "green",
    image: "https://utfs.io/f/V8CztowAHZRpYqsNhnWAzDlwbE3ZmaY89XnP71JOjSyR0td6",
  },
  {
    title: "AI-КОНСУЛЬТАНТ",
    description:
      "Ищете идеального кандидата? Наш AI-консультант всегда готов помочь с советами и рекомендациями по подбору.",
    theme: "dark",
    image: "https://utfs.io/f/V8CztowAHZRpNdZvuK9jO4ih8RLFgPqT2YsXGZzx6mfuypKw",
  },
  {
    title: "ИНТЕРВЬЮ-ПЛАТФОРМА",
    description:
      "Проведите онлайн-интервью видеофиксацией. Умные алгоритмы помогут выявить сильные стороны кандидата.",
    theme: "white",
    image: "https://utfs.io/f/V8CztowAHZRpoV1NNhIZPByW43VH6FxnwuJGq7DAXchIZtrl",
  },
  {
    title: "АНАЛИЗ CV",
    description:
      "Мгновенно узнайте, какие кандидаты подходят вашей вакансии луче всего. Интерактивный анализ выделит ключевые навыки и достижения каждого.",
    theme: "green",
    image: "https://utfs.io/f/V8CztowAHZRpz4MGUkBZcsR9eQIML5Dw4VjFTHEzlbU278ra",
  },
  {
    title: "ОТКЛИК НА ВАКАНСИЮ",
    description:
      "Найдите идеальную работу и отправьте отклик одним кликом. Легче, чем когда-либо!",
    theme: "dark",
    image: "https://utfs.io/f/V8CztowAHZRp5wmo1DuNEG7kUPh8FmL9zQug1MSwID3flXqT",
  },
];

const featureTabs = [
  {
    title: "ГЕНЕРАТОР РЕЗЮМЕ",
    description:
      "Создайте профессиональное резюме за пару минут! Просто внесите данные, а остальное сделает наш сайт.",
    icon: (
      <svg
        className="w-full h-full text-[#00B944]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
        <path d="M13 2v7h7" />
      </svg>
    ),
  },
  {
    title: "ПРОФИЛЬ",
    description:
      "Подчеркните свои сильные стороны в персональном профиле. Сделайте его привлекательным и готовым для работодатее.",
    icon: (
      <svg
        className="w-full h-full text-[#00B944]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    title: "ЛИЧНЫЙ ДНЕВНИК",
    description:
      "Фиксируйте достижения, мысли и цели. Отслеживайте свой карьерный рост и находите мотивацию для новых побед!",
    icon: (
      <svg
        className="w-full h-full text-[#00B944]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    title: "ОЦЕНКА РЕЗЮМЕ",
    description:
      "Узнайте, как работодатели видят ваше резюме — получите оценку от AI и советы по улучшению. Стремитесь к 100 баллам!",
    icon: (
      <svg
        className="w-full h-full text-[#00B944]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="M22 4 12 14.01l-3-3" />
      </svg>
    ),
  },
];

const slides = [
  {
    text: "Укажите, кого или что вы ищете — будь то вакансии, которые соответствуют вашим навыкам, или кандидаты, отвечающие требованиям вашей компании.",
  },
  {
    text: "Выходите на контакт с интересующими вас специалистами или работодателями и получайте выгодные предложения.",
  },
  {
    text: "Система предложит вам подходящие варианты на основе ваших данных и предпочтений.",
  },
];

export default function Component() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchType, setSearchType] = useState("job");

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === features.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? features.length - 1 : prevIndex - 1
    );
  };

  const nextCarouselSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevCarouselSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNDAgMCBMIDAgMCAwIDQwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMCwgMjU1LCAwLCAwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]">
      <main className="flex flex-col items-center justify-center space-y-8 mt-10 px-4 md:mt-20">
        <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center md:text-left">
            FreeHunter:
          </h1>
          {mounted && (
            <TypeAnimation
              sequence={typingPhrases.flatMap((phrase) => [phrase, 2000])}
              wrapper="span"
              speed={50}
              className="text-3xl md:text-6xl font-bold text-[#00B944] text-center md:text-left"
              repeat={Infinity}
            />
          )}
        </div>
        <p className="text-lg md:text-xl text-center max-w-2xl">
          Быстрый, удобный и эффективный способ поиска кандидатов и
          работодателей.
        </p>
        <div className="flex flex-col w-full max-w-md items-center space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Введите вакансию..."
              className="pl-8 shadow-lg shadow-[#00B944]/20 focus:shadow-[#00B944]/30 transition-all duration-300 border-[#00B944]/20 focus:border-[#00B944]/30 w-full"
            />
          </div>
          <Button
            type="submit"
            className="bg-[#00B944] text-white hover:bg-[#00A33D] w-full md:w-auto"
          >
            Найти
          </Button>
        </div>
      </main>
      <div className="w-full p-4 md:px-28 py-16 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <h1 className="text-[40px] leading-tight font-bold text-center mb-16">
            <span className="text-[#00B944]">FREEHUNTER</span> ДЛЯ ТЕХ, <br />
            КТО ЦЕНИТ: <span className="text-[#333333]">ВРЕМЯ - КАЧЕСТВО</span>
          </h1>

          <div className="hidden md:grid grid-cols-2 gap-8 relative">
            <div className="absolute inset-0 bg-[#00B944]/10 blur-3xl rounded-[40px]" />
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-[20px] p-10 flex items-start gap-8 min-h-[200px] relative ${
                  feature.theme === "white"
                    ? "bg-white text-black border border-gray-200"
                    : feature.theme === "green"
                    ? "bg-[#00B944] text-white"
                    : "bg-[#1A1A1A] text-white"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-[18px] font-bold mb-3 leading-tight">
                    {feature.title}
                  </h3>
                  <p
                    className={`text-[14px] leading-relaxed ${
                      feature.theme === "white"
                        ? "text-[#666666]"
                        : "text-gray-200"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
                <div className="w-[140px] h-[140px] flex-shrink-0">
                  <img
                    src={feature.image}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="md:hidden relative h-[450px]">
            <div className="h-[400px] overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragDirectionLock
                  dragSnapToOrigin
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      nextSlide();
                    } else if (swipe > swipeConfidenceThreshold) {
                      prevSlide();
                    }
                  }}
                  className="absolute w-full h-full"
                >
                  <div
                    className={`rounded-[20px] p-6 flex flex-col items-start gap-4 h-full ${
                      features[currentIndex].theme === "white"
                        ? "bg-white text-black border border-gray-200"
                        : features[currentIndex].theme === "green"
                        ? "bg-[#00B944] text-white"
                        : "bg-[#1A1A1A] text-white"
                    }`}
                  >
                    <h3 className="text-[18px] font-bold leading-tight">
                      {features[currentIndex].title}
                    </h3>
                    <p
                      className={`text-[14px] leading-relaxed ${
                        features[currentIndex].theme === "white"
                          ? "text-[#666666]"
                          : "text-gray-200"
                      }`}
                    >
                      {features[currentIndex].description}
                    </p>
                    <div className="w-full h-[140px] mt-auto">
                      <img
                        src={features[currentIndex].image}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center space-x-2 z-10">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? "bg-[#00B944]" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="min-h-screen">
        <div className="relative w-full min-h-screen p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="md:w-1/2">
                <img
                  src="https://utfs.io/f/V8CztowAHZRp3Bd3hvZaysQe32abwR96mziC14voc8jFhkK7"
                  alt="Person with headphones"
                  className="w-full max-w-[400px] mx-auto"
                />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                  <span className="text-[#00B944]">FREEHUNTER</span> ПРЕДЛАГАЕТ
                  УНИКАЛЬНЫЕ ФУНКЦИИ ДЛЯ КОМПАНИЙ, СТРЕЯЩИХСЯ ПРИВЛЕКАТЬ ЛУЧШИХ
                  СПЕЦИАЛИСТОВ.
                </h1>
                <p className="text-lg leading-relaxed">
                  НАШИ ИНСТРУМЕНТЫ ПОМОГУТ ВАМ УСКОРИТЬ ПРОЦЕСС ПОДБОРА,
                  МИНИМИЗИРОВАТЬ ЗАТРАТЫ И СОСРЕДОТОЧИТЬСЯ НА ДЕЙСТВИТЕЛЬНО
                  ПЕРСПЕКТИВНЫХ КАНДИДАТАХ.
                </p>
              </div>
            </div>
            <div className="md:hidden">
              <Tabs
                defaultValue="0"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="grid w-full grid-cols-4">
                  {featureTabs.map((_, index) => (
                    <TabsTrigger
                      key={index}
                      value={index.toString()}
                      className="px-2 py-1"
                    >
                      <div className="w-6 h-6">{featureTabs[index].icon}</div>
                    </TabsTrigger>
                  ))}
                </TabsList>
                {featureTabs.map((feature, index) => (
                  <TabsContent
                    key={index}
                    value={index.toString()}
                    className="mt-4"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-xl font-bold mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-gray-600">
                              {feature.description}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureTabs.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="w-12 h-12 mb-4">
                        {featureTabs[index].icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        {featureTabs[index].title}
                      </h3>
                      <p className="text-gray-600 flex-grow">
                        {featureTabs[index].description}
                      </p>
                      <motion.div
                        className="mt-4 text-[#00B944] font-semibold"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        Узнать больше →
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 lg:px-28 lg:py-16">
        <div className="mb-6 rounded-3xl bg-white/80 p-6 sm:p-8 backdrop-blur-sm shadow-[0_0_0_1px_rgba(0,255,0,0.1),0_0_20px_rgba(0,255,0,0.2)]">
          <div className="relative flex flex-col lg:flex-row items-start justify-between max-w-6xl mx-auto">
            <div className="max-w-xl space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                УЗНАЙ СВОИ СИЛЬНЫЕ СТОРОНЫ
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                🤖 Пройди видео-опрос с ИИ и узнай свои сильные качества.
              </p>
              <button className="w-full sm:w-auto rounded-lg bg-[#1c1b1f] px-6 py-2.5 text-white hover:bg-[#1c1b1f]/90">
                Опрос с ИИ
              </button>
            </div>
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 h-48 w-48">
              <img
                src="https://utfs.io/f/V8CztowAHZRptOukPVb1HNJASszxvRtgVyeWKTQfu4L9Y6pM"
                alt="Abstract illustration"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-[#1c1b1f] p-6 sm:p-8 text-white">
          <div className="lg:hidden">
            <div className="relative px-4">
              <div className="min-h-[200px] flex items-center">
                <p className="text-lg text-center">
                  {slides[currentSlide].text}
                </p>
              </div>
              <button
                onClick={prevCarouselSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-emerald-400 hover:text-emerald-300"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextCarouselSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-emerald-400 hover:text-emerald-300"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="flex justify-center gap-2 mt-4">
                {slides.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      currentSlide === index ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <Link
                href="#"
                className="flex items-center justify-center text-emerald-400 hover:text-emerald-300 mt-6"
              >
                Подробнее
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="hidden lg:grid gap-8 grid-cols-3">
            {slides.map((slide, index) => (
              <div key={index} className="flex flex-col justify-between h-full">
                <p className="text-lg">{slide.text}</p>
                <Link
                  href="#"
                  className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mt-4"
                >
                  Подробнее
                  <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className=" p-4 sm:p-6 lg:px-28 lg:py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white/80 p-8 lg:p-12 shadow-lg backdrop-blur-sm border border-gray-100">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                НАЧНИТЕ ПОИСК
              </h2>
              <p className="mt-2 text-gray-600">
                Найдите идеальную работу или сотрудника
              </p>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="searchType"
                  value="job"
                  checked={searchType === "job"}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-4 h-4 text-[#00B944] border-gray-300 focus:ring-[#00B944] accent-[#00B944]"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  Ищу работу
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="searchType"
                  value="employee"
                  checked={searchType === "employee"}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-4 h-4 text-[#00B944] border-gray-300 focus:ring-[#00B944] accent-[#00B944]"
                />
                <span className="text-gray-700 group-hover:text-gray-900">
                  Ищу сотрудника
                </span>
              </label>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Имя
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Введите ваше имя"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B944]/20 focus:border-[#00B944] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Почта*
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B944]/20 focus:border-[#00B944] transition-colors"
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Коротко о вас*
                </label>
                <textarea
                  id="about"
                  placeholder="Расскажите о своих навыках и опыте..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00B944]/20 focus:border-[#00B944] transition-colors resize-none"
                />
              </div>
            </div>
            <button className="w-full lg:w-auto lg:px-12 py-3 bg-[#00B944] text-white rounded-lg hover:bg-[#00B944]/90 transition-colors font-medium">
              Продолжить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
