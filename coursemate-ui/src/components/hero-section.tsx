"use client";

import { BookOpen, Clock, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-indigo-50 py-16">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-pink-200/30 blur-2xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-medium text-primary">Welcome back 👋</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Hello, Nguyen Han!
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            You have <span className="font-semibold text-foreground">3 courses</span> in progress. Keep up the great work!
          </p>

          {/* Search */}
          <div className="mt-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for courses, topics, instructors…"
                className="pl-9 h-11 rounded-full shadow-sm"
              />
            </div>
            <Button className="h-11 rounded-full px-6 shadow-sm">Search</Button>
          </div>

          {/* Quick stat pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { icon: BookOpen, label: "7 Courses enrolled" },
              { icon: Clock, label: "42h total learned" },
              { icon: Star, label: "4 Certificates earned" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium shadow-xs"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
