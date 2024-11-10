"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Brain, MessageSquare } from "lucide-react"

const mbtiQuestions = [
  {
    id: 1,
    question: "Как вы предпочитаете восстанавливать энергию?",
    options: [
      { value: "E", text: "Общаясь с людьми и участвуя в активных мероприятиях" },
      { value: "I", text: "Проводя время в одиночестве или с близкими друзьями" }
    ]
  },
  {
    id: 2,
    question: "Какой подход вы обычно используете при решении проблем?",
    options: [
      { value: "S", text: "Опираюсь на проверенные методы и конкретные факты" },
      { value: "N", text: "Ищу новые, нестандартные решения и возможности" }
    ]
  },
  {
    id: 3,
    question: "Как вы принимаете важные решения?",
    options: [
      { value: "T", text: "Анализирую ситуацию логически, взвешивая все за и против" },
      { value: "F", text: "Полагаюсь на свои чувства и учитываю влияние на других людей" }
    ]
  },
  {
    id: 4,
    question: "Как вы предпочитаете организовывать свою жизнь?",
    options: [
      { value: "J", text: "Планирую заранее и следую установленному графику" },
      { value: "P", text: "Действую спонтанно и адаптируюсь к ситуации" }
    ]
  },
  {
    id: 5,
    question: "Как вы обычно обрабатываете новую информацию?",
    options: [
      { value: "S", text: "Фокусируюсь на деталях и практическом применении" },
      { value: "N", text: "Ищу общие закономерности и думаю о будущих возможностях" }
    ]
  },
  {
    id: 6,
    question: "Как вы предпочитаете проводить свободное время?",
    options: [
      { value: "E", text: "В компании друзей и на общественных мероприятиях" },
      { value: "I", text: "В тишине, занимаясь личными хобби" }
    ]
  },
  {
    id: 7,
    question: "Как вы относитесь к изменениям?",
    options: [
      { value: "J", text: "Предпочитаю стабильность и предсказуемость" },
      { value: "P", text: "Люблю перемены и новые вызовы" }
    ]
  },
  {
    id: 8,
    question: "Как вы предпочитаете учиться?",
    options: [
      { value: "S", text: "Через практический опыт и примеры" },
      { value: "N", text: "Через теорию и концептуальное понимание" }
    ]
  },
  {
    id: 9,
    question: "Как вы справляетесь с конфликтами?",
    options: [
      { value: "T", text: "Стараюсь решить их логически и рационально" },
      { value: "F", text: "Стараюсь понять чувства всех участников" }
    ]
  },
  {
    id: 10,
    question: "Как вы предпочитаете работать в команде?",
    options: [
      { value: "E", text: "Активно взаимодействую и делюсь идеями" },
      { value: "I", text: "Предпочитаю работать самостоятельно и в своем темпе" }
    ]
  },
  {
    id: 11,
    question: "Как вы относитесь к планированию?",
    options: [
      { value: "J", text: "Люблю планировать и следовать расписанию" },
      { value: "P", text: "Предпочитаю гибкость и спонтанность" }
    ]
  },
  {
    id: 12,
    question: "Как вы воспринимаете критику?",
    options: [
      { value: "T", text: "Принимаю ее как возможность для улучшения" },
      { value: "F", text: "Иногда воспринимаю ее лично" }
    ]
  },
  {
    id: 13,
    question: "Как вы предпочитаете решать задачи?",
    options: [
      { value: "S", text: "Следую проверенным методам и инструкциям" },
      { value: "N", text: "Ищу новые и креативные подходы" }
    ]
  },
  {
    id: 14,
    question: "Как вы относитесь к риску?",
    options: [
      { value: "J", text: "Предпочитаю избегать риска и действовать осторожно" },
      { value: "P", text: "Готов рисковать ради новых возможностей" }
    ]
  },
  {
    id: 15,
    question: "Как вы предпочитаете выражать свои мысли?",
    options: [
      { value: "E", text: "Открыто и прямо" },
      { value: "I", text: "Обдуманно и сдержанно" }
    ]
  },
  {
    id: 16,
    question: "Как вы относитесь к деталям?",
    options: [
      { value: "S", text: "Обращаю внимание на каждую деталь" },
      { value: "N", text: "Смотрю на общую картину" }
    ]
  },
  {
    id: 17,
    question: "Как вы предпочитаете проводить выходные?",
    options: [
      { value: "E", text: "Активно, с друзьями и на мероприятиях" },
      { value: "I", text: "Спокойно, дома или на природе" }
    ]
  },
  {
    id: 18,
    question: "Как вы относитесь к новым идеям?",
    options: [
      { value: "T", text: "Анализирую их с точки зрения логики" },
      { value: "F", text: "Оцениваю их с точки зрения чувств и эмоций" }
    ]
  },
  {
    id: 19,
    question: "Как вы предпочитаете решать конфликты?",
    options: [
      { value: "J", text: "Стараюсь быстро найти решение и двигаться дальше" },
      { value: "P", text: "Даю ситуации развиваться естественным образом" }
    ]
  },
  {
    id: 20,
    question: "Как вы относитесь к работе в условиях неопределенности?",
    options: [
      { value: "S", text: "Предпочитаю четкие инструкции и стабильность" },
      { value: "N", text: "Готов адаптироваться и искать новые решения" }
    ]
  }
]

const mbtiTypes = [
  { 
    type: "ISTJ", 
    color: "#4A90E2", 
    description: "Ответственный исполнитель: Надежный, организованный и методичный. В Freedom Kazakhstan может эффективно управлять проектами и обеспечивать соблюдение процессов."
  },
  { 
    type: "ISFJ", 
    color: "#50E3C2", 
    description: "Преданный защитник: Внимательный, заботливый и ориентированный на детали. Может создавать позитивную рабочую атмосферу и поддерживать командный дух в Freedom Kazakhstan."
  },
  { 
    type: "INFJ", 
    color: "#9013FE", 
    description: "Вдохновляющий идеалист: Творческий, целеустремленный и эмпатичный. Может разрабатывать инновационные стратегии и мотивировать команду Freedom Kazakhstan."
  },
  { 
    type: "INTJ", 
    color: "#417505", 
    description: "Стратегический мыслитель: Аналитический, независимый и ориентированный на результат. Идеально подходит для разработки долгосрочных стратегий развития Freedom Kazakhstan."
  },
  { 
    type: "ISTP", 
    color: "#F5A623", 
    description: "Виртуозный мастер: Гибкий, рациональный и практичный. Может эффективно решать технические проблемы и оптимизировать процессы в Freedom Kazakhstan."
  },
  { 
    type: "ISFP", 
    color: "#7ED321", 
    description: "Творческий экспериментатор: Чуткий, артистичный и адаптивный. Может внести креативность в дизайн продуктов и маркетинговые кампании Freedom Kazakhstan."
  },
  { 
    type: "INFP", 
    color: "#BD10E0", 
    description: "Гармоничный идеалист: Творческий, эмпатичный и принципиальный. Может помочь в создании позитивной корпоративной культуры и социальных инициатив Freedom Kazakhstan."
  },
  { 
    type: "INTP", 
    color: "#4A4A4A", 
    description: "Логичный новатор: Аналитический, оригинальный и адаптивный. Идеально подходит для решения сложных технических задач и инноваций в Freedom Kazakhstan."
  },
  { 
    type: "ESTP", 
    color: "#D0021B", 
    description: "Предприимчивый искатель: Энергичный, практичный и спонтанный. Может эффективно вести переговоры и заключать сделки для Freedom Kazakhstan."
  },
  { 
    type: "ESFP", 
    color: "#F8E71C", 
    description: "Энергичный импровизатор: Общительный, веселый и практичный. Может улучшить корпоративные мероприятия и поднять моральный дух команды Freedom Kazakhstan."
  },
  { 
    type: "ENFP", 
    color: "#FF9500", 
    description: "Вдохновляющий новатор: Энтузиастичный, креативный и общительный. Может генерировать инновационные идеи и вдохновлять команду Freedom Kazakhstan."
  },
  { 
    type: "ENTP", 
    color: "#FF5E3A", 
    description: "Находчивый визионер: Изобретательный, предприимчивый и адаптивный. Идеально подходит для разработки новых продуктов и стратегий роста Freedom Kazakhstan."
  },
  { 
    type: "ESTJ", 
    color: "#0F9D58", 
    description: "Эффективный администратор: Организованный, логичный и решительный. Может эффективно управлять операциями и обеспечивать достижение целей Freedom Kazakhstan."
  },
  { 
    type: "ESFJ", 
    color: "#00BFFF", 
    description: "Гармоничный помощник: Дружелюбный, ответственный и кооперативный. Может улучшить отношения с клиентами и создать позитивную рабочую среду в Freedom Kazakhstan."
  },
  { 
    type: "ENFJ", 
    color: "#FF69B4", 
    description: "Харизматичный наставник: Вдохновляющий, эмпатичный и ответственный. Может эффективно руководить командами и развивать таланты в Freedom Kazakhstan."
  },
  { 
    type: "ENTJ", 
    color: "#8B4513", 
    description: "Решительный руководитель: Уверенный, стратегический и амбициозный. Идеально подходит для руководящих позиций и принятия ключевых решений в Freedom Kazakhstan."
  }
]

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
}

const optionVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98 },
}

export default function MBTITest() {
  const [currentQuestion, setCurrentQuestion] = useState(-1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<typeof mbtiTypes[0] | null>(null)

  const startTest = () => {
    setCurrentQuestion(0)
  }

  const handleAnswer = (value: string) => {
    if (!value) return;
    
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        Object.values(newAnswers).forEach(answer => {
          counts[answer as keyof typeof counts]++;
        });
        
        const type = (counts.E > counts.I ? 'E' : 'I') +
                     (counts.S > counts.N ? 'S' : 'N') +
                     (counts.T > counts.F ? 'T' : 'F') +
                     (counts.J > counts.P ? 'J' : 'P');
                   
        const matchingType = mbtiTypes.find(t => t.type === type);
        if (matchingType) {
          setResult(matchingType);
        }
      }
    }, 10);
  };

  const resetTest = () => {
    setCurrentQuestion(-1)
    setAnswers({})
    setResult(null)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white">
      <Card className="w-full max-w-xl shadow-lg border-green-500 border">
        <CardHeader className="border-b border-green-500">
          <CardTitle className="text-2xl font-medium text-green-600">MBTI Тест</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            {currentQuestion === -1 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-xl font-medium">Узнайте свой тип личности</h2>
                  <p className="text-gray-600">Ответьте на несколько вопросов, чтобы определить ваш MBTI тип</p>
                </div>
                <Button 
                  onClick={startTest} 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Начать тест
                </Button>
              </motion.div>
            )}

            {currentQuestion >= 0 && currentQuestion < mbtiQuestions.length && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <Progress 
                  value={(currentQuestion + 1) / mbtiQuestions.length * 100} 
                  className="h-1 bg-gray-200"
                  indicatorClassName="bg-green-600"
                />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">{mbtiQuestions[currentQuestion].question}</h3>
                  <RadioGroup 
                    onValueChange={handleAnswer} 
                    className="space-y-3"
                    defaultValue={answers[currentQuestion]}
                  >
                    {mbtiQuestions[currentQuestion].options.map((option, index) => (
                      <Label
                        key={index}
                        htmlFor={`option-${index}`}
                        className="cursor-pointer w-full"
                      >
                        <motion.div 
                          variants={optionVariants}
                          whileHover="hover"
                          whileTap="tap"
                          className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
                        >
                          <RadioGroupItem 
                            value={option.value} 
                            id={`option-${index}`} 
                            className="text-green-600"
                          />
                          <span className="flex-1">{option.text}</span>
                        </motion.div>
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {result && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                <div className="text-center space-y-4">
                  <motion.div 
                    className="w-20 h-20 mx-auto rounded-full bg-green-600"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  />
                  <h3 className="text-2xl font-medium">Ваш тип: {result.type}</h3>
                </div>
                <motion.div 
                  className="rounded-lg bg-gray-50 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-gray-700">{result.description}</p>
                </motion.div>
                <Button 
                  onClick={resetTest} 
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Пройти заново
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  )
}