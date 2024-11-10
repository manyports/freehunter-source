"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold,
  ChevronDown,
  Italic,
  List,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Type,
  X,
  Image,
  Link,
  Code,
  Quote,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type Block = {
  id: string;
  type: "text" | "heading" | "list" | "quote" | "link";
  content: string;
};

type Page = {
  id: string;
  title: string;
  blocks: Block[];
};

export default function Notes() {
  const [pages, setPages] = useState<Page[]>([
    { id: "1", title: "Моя первая страница", blocks: [] },
  ]);
  const [currentPage, setCurrentPage] = useState("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [filteredPages, setFilteredPages] = useState(pages);
  const [inPageSearchTerm, setInPageSearchTerm] = useState("");

  useEffect(() => {
    const filtered = pages.filter((page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPages(filtered);
  }, [searchTerm, pages]);

  const addBlock = (type: Block["type"]) => {
    const newBlock: Block = { id: Date.now().toString(), type, content: "" };
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === currentPage
          ? { ...page, blocks: [...page.blocks, newBlock] }
          : page
      )
    );
  };

  const updateBlock = (pageId: string, blockId: string, content: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId
          ? {
              ...page,
              blocks: page.blocks.map((block) =>
                block.id === blockId ? { ...block, content } : block
              ),
            }
          : page
      )
    );
  };

  const addNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: "Новая страница",
      blocks: [],
    };
    setPages((prevPages) => [...prevPages, newPage]);
    setCurrentPage(newPage.id);
  };

  const updatePageTitle = (pageId: string, newTitle: string) => {
    setPages((prevPages) =>
      prevPages.map((page) =>
        page.id === pageId ? { ...page, title: newTitle } : page
      )
    );
  };

  const currentPageData =
    pages.find((page) => page.id === currentPage) || pages[0];

  const highlightSearchTerms = (text: string) => {
    if (!inPageSearchTerm) return text;
    const parts = text.split(new RegExp(`(${inPageSearchTerm})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === inPageSearchTerm.toLowerCase() ? (
        <span key={i} className="bg-green-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white text-black">
      <div
        className={`${
          isSidebarOpen ? "w-full md:w-64" : "w-0"
        } bg-green-50 p-4 flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold">Мое рабочее пространство</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="relative mb-4">
          <Input
            className="pl-8 bg-white"
            placeholder="Поиск страниц"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        {filteredPages.map((page) => (
          <Button
            key={page.id}
            variant="ghost"
            className={`justify-start ${
              currentPage === page.id ? "bg-green-200" : ""
            } text-black hover:bg-green-100`}
            onClick={() => setCurrentPage(page.id)}
          >
            {page.title}
          </Button>
        ))}
        <Button
          variant="ghost"
          className="justify-start mt-2 text-black hover:bg-green-100"
          onClick={addNewPage}
        >
          <Plus className="w-4 h-4 mr-2" />
          Добавить страницу
        </Button>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-green-200">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
              <Input
                className="ml-4 font-semibold bg-transparent border-none max-w-[150px] md:max-w-none"
                value={currentPageData.title}
                onChange={(e) => updatePageTitle(currentPage, e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <div className="relative hidden md:block">
                <Input
                  className="pl-8"
                  placeholder="Поиск в заметке"
                  value={inPageSearchTerm}
                  onChange={(e) => setInPageSearchTerm(e.target.value)}
                />
                <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center py-2">
            <div className="flex space-x-1 md:space-x-2 bg-green-50 rounded-full px-2 md:px-4 py-1 md:py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addBlock("text")}
                className="text-black hover:bg-green-100 rounded-full min-w-8 h-8 md:min-w-10 md:h-10"
              >
                <Type className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addBlock("heading")}
                className="text-black hover:bg-green-100 rounded-full min-w-8 h-8 md:min-w-10 md:h-10"
              >
                <span className="font-bold text-base md:text-lg">H</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addBlock("list")}
                className="text-black hover:bg-green-100 rounded-full min-w-8 h-8 md:min-w-10 md:h-10"
              >
                <List className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addBlock("quote")}
                className="text-black hover:bg-green-100 rounded-full min-w-8 h-8 md:min-w-10 md:h-10"
              >
                <Quote className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => addBlock("link")}
                className="text-black hover:bg-green-100 rounded-full min-w-8 h-8 md:min-w-10 md:h-10"
              >
                <Link className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-auto">
          {currentPageData.blocks.map((block) => (
            <div key={block.id} className="mb-4">
              {block.type === "heading" ? (
                <Input
                  className="text-3xl font-bold border-none p-0 bg-transparent"
                  value={block.content}
                  onChange={(e) => updateBlock(currentPage, block.id, e.target.value)}
                  placeholder="Заголовок"
                  dangerouslySetInnerHTML={
                    inPageSearchTerm
                      ? { __html: highlightSearchTerms(block.content) }
                      : undefined
                  }
                />
              ) : block.type === "list" ? (
                <div className="flex items-center">
                  <span className="mr-2">•</span>
                  <Input
                    className="border-none p-0 bg-transparent"
                    value={block.content}
                    onChange={(e) => updateBlock(currentPage, block.id, e.target.value)}
                    placeholder="Элемент списка"
                    dangerouslySetInnerHTML={
                      inPageSearchTerm
                        ? { __html: highlightSearchTerms(block.content) }
                        : undefined
                    }
                  />
                </div>
              ) : block.type === "quote" ? (
                <div className="flex">
                  <div className="w-1 bg-green-200 rounded mr-4"></div>
                  <Input
                    className="border-none p-0 bg-transparent italic"
                    value={block.content}
                    onChange={(e) => updateBlock(currentPage, block.id, e.target.value)}
                    placeholder="Введите цитату..."
                  />
                </div>
              ) : block.type === "link" ? (
                <div className="flex items-center">
                  <Link className="w-4 h-4 mr-2 text-green-600" />
                  <Input
                    className="border-none p-0 bg-transparent text-green-600 underline"
                    value={block.content}
                    onChange={(e) => updateBlock(currentPage, block.id, e.target.value)}
                    placeholder="Вставьте ссылку..."
                  />
                </div>
              ) : (
                <Input
                  className="border-none p-0 bg-transparent"
                  value={block.content}
                  onChange={(e) => updateBlock(currentPage, block.id, e.target.value)}
                  placeholder="Начните печатать..."
                  dangerouslySetInnerHTML={
                    inPageSearchTerm
                      ? { __html: highlightSearchTerms(block.content) }
                      : undefined
                  }
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
