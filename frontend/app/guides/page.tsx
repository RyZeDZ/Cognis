"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Guide } from "@/types";
import { Search } from "lucide-react";

const allGuides: Guide[] = [
  {
    id: 1,
    title: "Mastering Binary Search Trees",
    author: "Alex Johnson",
    date: "May 15, 2023",
    tag: "Data Structures",
  },
  {
    id: 2,
    title: "Understanding Big O Notation",
    author: "Sarah Miller",
    date: "April 22, 2023",
    tag: "Algorithms",
  },
  {
    id: 3,
    title: "Introduction to Neural Networks",
    author: "Michael Chen",
    date: "June 3, 2023",
    tag: "Machine Learning",
  },
  {
    id: 4,
    title: "A Practical Guide to Git and GitHub",
    author: "Jane Doe",
    date: "July 1, 2023",
    tag: "Tools",
  },
  {
    id: 5,
    title: "Preparing for Technical Interviews",
    author: "John Smith",
    date: "August 5, 2023",
    tag: "Career",
  },
  {
    id: 6,
    title: "Setting up your VS Code for C++",
    author: "Emily White",
    date: "March 10, 2023",
    tag: "Tools",
  },
  {
    id: 7,
    title: "The OSI Model Explained",
    author: "David Green",
    date: "September 12, 2023",
    tag: "Networking",
  },
  {
    id: 8,
    title: "Linear Algebra for Machine Learning",
    author: "Sophia Black",
    date: "October 20, 2023",
    tag: "Machine Learning",
  },
];

export default function GuidesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredGuides = useMemo(() => {
    return allGuides
      .filter((guide) => {
        return !activeTag || guide.tag === activeTag;
      })
      .filter((guide) => {
        return guide.title.toLowerCase().includes(searchTerm.toLowerCase());
      });
  }, [searchTerm, activeTag]);

  const allTags = [...new Set(allGuides.map((guide) => guide.tag))];

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Guides
        </h1>
        <p className="mt-2 text-lg text-muted-accent">
          Browse all community-written guides and resources.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-accent" />
          <input
            type="text"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card-bg border border-border rounded-md focus:ring-2 focus:ring-accent focus:border-accent outline-none"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              !activeTag
                ? "bg-accent text-primary font-semibold"
                : "bg-card-bg text-muted-accent hover:bg-border"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-accent text-primary font-semibold"
                  : "bg-card-bg text-muted-accent hover:bg-border"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGuides.map((guide) => (
          <Link
            key={guide.id}
            href={`/guides/${guide.id}`}
            className="flex flex-col h-full p-6 bg-card-bg border border-border rounded-lg hover:border-accent/50 transition-colors"
          >
            <p className="text-xs text-accent mb-2 font-medium">
              {guide.tag.toUpperCase()}
            </p>
            <h2 className="text-xl font-semibold text-text flex-grow">
              {guide.title}
            </h2>
            <div className="flex justify-between items-center text-xs text-muted-accent mt-4">
              <span>By {guide.author}</span>
              <span>{guide.date}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* No Results Message */}
      {filteredGuides.length === 0 && (
        <div className="text-center py-16 text-muted-accent">
          <p className="text-lg">No guides found.</p>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
