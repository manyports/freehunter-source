"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Building2,
  Check,
  Plus,
  Search,
  Users,
  X,
  MapPin,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const mockCandidates = [
  {
    id: 1,
    name: "Иван Петров",
    position: "Frontend Developer",
    aiFeedback: 8,
    interviewResult: 7,
    decision: null
  },
  {
    id: 2,
    name: "Мария Иванова",
    position: "UX Designer",
    aiFeedback: 9,
    interviewResult: 8,
    decision: null
  },
  {
    id: 3,
    name: "Алексей Смирнов",
    position: "Backend Developer",
    aiFeedback: 7,
    interviewResult: 9,
    decision: null
  }
];

const JobCard = ({ job, onEdit }) => (
  <Card>
    <CardHeader>
      <CardTitle>{job.title}</CardTitle>
      <CardDescription>{job.company}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className={`px-2 py-1 rounded-full text-xs ${
            job.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {job.status === "active" ? "Активна" : "Закрыта"}
          </span>
          <span className="text-sm text-gray-500">{job.applicants} кандидатов</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onEdit(job)} className="w-full">
        Редактировать
      </Button>
    </CardFooter>
  </Card>
);

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
          if (data.success && Array.isArray(data.jobs)) {
            const formattedJobs = data.jobs.map(job => ({
              ...job,
              applicants: job.applicants || 0,
              status: job.status || "Открыта",
              title: job.title || "Без названия",
            }));
            setJobs(formattedJobs);
          } else {
            console.error('Invalid format received from jobs endpoint');
          }
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

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDecision = (candidateId, decision) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, decision } : candidate
      )
    );
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
  };

  const handleSaveJob = async (updatedJob) => {
    try {
      const response = await fetch(`/api/jobs/${updatedJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedJob),
      });

      if (response.ok) {
        setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
        setEditingJob(null);
      } else {
        console.error('Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Панель администратора
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="jobs" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jobs">
              <Briefcase className="mr-2 h-4 w-4" />
              Вакансии
            </TabsTrigger>
            <TabsTrigger value="candidates">
              <Users className="mr-2 h-4 w-4" />
              Кандидаты
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Building2 className="mr-2 h-4 w-4" />
              Статистика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Доступные вакансии</CardTitle>
                <Button
                  onClick={() => router.push("/admin/create")}
                  className="bg-green-500 hover:bg-green-600"
                >
                  <Plus className="mr-2 h-4 w-4" /> Добавить вакансию
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Поиск вакансий..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <ScrollArea className="h-[400px]">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <Card key={i}>
                          <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-4 w-full" />
                          </CardContent>
                          <CardFooter>
                            <Skeleton className="h-10 w-full" />
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} onEdit={handleEditJob} />
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Таблица кандидатов</CardTitle>
                <CardDescription>
                  Управление кандидатами и принятие решений
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Имя</TableHead>
                      <TableHead>Позиция</TableHead>
                      <TableHead>Фидбек AI</TableHead>
                      <TableHead>Результат интервью</TableHead>
                      <TableHead>Решение</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.name}
                        </TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>{candidate.aiFeedback}/10</TableCell>
                        <TableCell>{candidate.interviewResult}/10</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant={
                                candidate.decision === "Принят"
                                  ? "default"
                                  : "outline"
                              }
                              className="bg-green-500 hover:bg-green-600 text-white"
                              onClick={() =>
                                handleDecision(candidate.id, "Принят")
                              }
                            >
                              <Check className="mr-1 h-4 w-4" /> Принять
                            </Button>
                            <Button
                              size="sm"
                              variant={
                                candidate.decision === "Отказано"
                                  ? "default"
                                  : "outline"
                              }
                              className="bg-red-500 hover:bg-red-600 text-white"
                              onClick={() =>
                                handleDecision(candidate.id, "Отказано")
                              }
                            >
                              <X className="mr-1 h-4 w-4" /> Отказать
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Статистика</CardTitle>
                <CardDescription>Обзор ключевых показателей</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Всего вакансий
                      </CardTitle>
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{jobs.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Активные вакансии
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {jobs.filter((job) => job.status === "Открыта").length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Всего кандидатов
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {candidates.length}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Средний рейтинг AI
                      </CardTitle>
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {(
                          candidates.reduce(
                            (sum, candidate) => sum + candidate.aiFeedback,
                            0
                          ) / candidates.length
                        ).toFixed(1)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog
        open={editingJob !== null}
        onOpenChange={() => setEditingJob(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать вакансию</DialogTitle>
            <DialogDescription>
              Внесите изменения в детали вакансии.
            </DialogDescription>
          </DialogHeader>
          {editingJob && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Название
                </Label>
                <Input
                  id="title"
                  value={editingJob.title}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, title: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Компания
                </Label>
                <Input
                  id="company"
                  value={editingJob.company}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, company: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Статус
                </Label>
                <select
                  id="status"
                  value={editingJob.status}
                  onChange={(e) =>
                    setEditingJob({ ...editingJob, status: e.target.value })
                  }
                  className="col-span-3"
                >
                  <option value="Открыта">Открыта</option>
                  <option value="Закрыта">Закрыта</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setEditingJob(null)} variant="outline">
              Отмена
            </Button>
            <Button
              onClick={() => handleSaveJob(editingJob)}
              className="bg-green-500 hover:bg-green-600"
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
