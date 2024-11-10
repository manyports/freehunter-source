"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle, FileText, Info, XCircle } from "lucide-react";
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import mammoth from 'mammoth';

pdfjs.GlobalWorkerOptions.workerSrc =
  "//unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs";

interface FeedbackSection {
  title: string;
  points: string[];
}

interface Characteristic {
  label: string;
  value: string;
}

interface Section {
  title: string;
  characteristics: Characteristic[];
}

interface AnalysisResult {
  score: number;
  sections: {
    title: string;
    status: "good" | "warning" | "info";
    points: string[];
  }[];
  recommendations: string[];
}

const AnalysisDisplay = ({ analysis }: { analysis: AnalysisResult }) => {
  return (
    <div className="space-y-6">
      <Card className="mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-2">
          <CardTitle className="text-sm font-medium">Общая оценка</CardTitle>
          <Badge
            variant={
              analysis.score >= 7
                ? "success"
                : analysis.score >= 4
                ? "warning"
                : "destructive"
            }
          >
            {analysis.score}/10
          </Badge>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Анализ резюме</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {analysis.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {section.status === "good" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : section.status === "warning" ? (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Info className="h-5 w-5 text-blue-500" />
                  )}
                  <h3 className="font-medium">{section.title}</h3>
                </div>
                <div className="pl-7">
                  {section.points.map((point, pointIndex) => (
                    <div
                      key={pointIndex}
                      className="text-sm text-muted-foreground mb-2"
                    >
                      • {point}
                    </div>
                  ))}
                </div>
                {index < analysis.sections.length - 1 && (
                  <Separator className="my-4" />
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Рекомендации по улучшению</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="min-w-[6px] h-6 rounded bg-primary mt-1" />
                <p className="text-sm text-muted-foreground">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default function ResumeEvaluation() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!validTypes.includes(file.type)) {
      setError('Пожалуйста, загрузите файл в формате PDF или DOCX');
      return;
    }

    setFile(file);
    setError(null);
  };

  const extractTextFromPdf = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n";
          }

          resolve(fullText.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const docxToText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value.trim();
    } catch (error) {
      console.error('Error converting DOCX:', error);
      throw new Error('Не удалось прочитать DOCX файл');
    }
  };

  const pdfToText = async (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
          const pdf = await pdfjs.getDocument(typedarray).promise;
          let fullText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item: any) => item.str)
              .join(" ");
            fullText += pageText + "\n";
          }

          resolve(fullText.trim());
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    try {
      setUploading(true);
      setUploadProgress(0);
      setError(null);
      
      let text;
      if (file.type === 'application/pdf') {
        text = await pdfToText(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        text = await docxToText(file);
      } else {
        throw new Error('Пожалуйста, загрузите файл в формате PDF или DOCX');
      }
      
      setUploadProgress(100);
      setUploading(false);
      setAnalyzing(true);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при анализе резюме");
      }

      const analysisResult: AnalysisResult = await response.json();
      setAnalysis(analysisResult);
    } catch (error) {
      console.error("Error processing file:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Произошла ошибка при обработке файла"
      );
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto p-4 min-h-screen">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Оценка резюме ИИ
          </CardTitle>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">
                        Нажмите для загрузки
                      </span>{" "}
                      или перетащите файл
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOCX (макс. 10MB)</p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  />
                </label>
              </div>
              {file && (
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-[#4fb84f]" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
              )}
              {error && (
                <div className="flex items-center space-x-2 text-red-500">
                  <XCircle className="w-5 h-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#4fb84f] hover:bg-[#45a045] text-white"
                disabled={!file || uploading || analyzing}
              >
                {uploading
                  ? "Загрузка..."
                  : analyzing
                  ? "Анализ..."
                  : "Отправить на оценку"}
              </Button>
            </form>

            {(uploading || analyzing) && (
              <div className="mt-6 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center">
                  {uploading ? "Загрузка файла..." : "Анализ резюме..."}
                </p>
              </div>
            )}

            {analysis && <AnalysisDisplay analysis={analysis} />}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
