"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/dash/form", label: "Создать CV" },
  { href: "/dash/feedback", label: "Ревью CV" },
  { href: "/dash/interview", label: "Интервью AI" },
  { href: "/notes", label: "Заметки" },
  { href: "/dash/mbti", label: "MBTI" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="https://utfs.io/f/Z2tqbNAyFDTSt6JkwRHBoNUd35ksxAmv7c8n6QWDjfuJFTGr"
            alt="FreeHunter"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-xl font-bold">FreeHunter</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border bg-white px-2 shadow-sm">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button variant="ghost">{label}</Button>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/dash">
            <Button className="hidden md:inline-flex bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/50 transition-all hover:shadow-green-500/80">
              Личный кабинет
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white p-6 shadow-lg transform transition-transform duration-200 ease-in-out md:hidden z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end mb-8">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-4">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href}>
              <Button variant="ghost" className="w-full justify-start">
                {label}
              </Button>
            </Link>
          ))}
          <Link href="/dash">
            <Button className="w-full bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/50 transition-all hover:shadow-green-500/80">
              Личный кабинет
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
