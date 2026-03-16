"use client";

import {
  BarChart3,
  Briefcase,
  Camera,
  ChevronRight,
  Code2,
  Globe,
  Music,
  Palette,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { label: "Development", icon: Code2, color: "bg-indigo-100 text-indigo-600" },
  { label: "Design", icon: Palette, color: "bg-pink-100 text-pink-600" },
  { label: "Data Science", icon: BarChart3, color: "bg-emerald-100 text-emerald-600" },
  { label: "Business", icon: Briefcase, color: "bg-amber-100 text-amber-600" },
  { label: "Language", icon: Globe, color: "bg-sky-100 text-sky-600" },
  { label: "Music", icon: Music, color: "bg-purple-100 text-purple-600" },
  { label: "Photography", icon: Camera, color: "bg-rose-100 text-rose-600" },
  { label: "Marketing", icon: TrendingUp, color: "bg-orange-100 text-orange-600" },
];

export function Categories() {
  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Browse Categories</h2>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          All categories <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {categories.map(({ label, icon: Icon, color }) => (
          <button
            key={label}
            className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-xs transition-all hover:border-primary/30 hover:shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-xs font-medium leading-tight">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
