"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Database, Loader2 } from "lucide-react";
import type { Subject } from "@/types";
import { formatYear } from "@/lib/utils";

export default function SubjectGrid({
  initialSubjects,
}: {
  initialSubjects: Subject[];
}) {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubjectsByYear = async (year: number) => {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/subjects?year=${year}`;
      try {
        const res = await fetch(url, { cache: "no-store" });
        const data = await res.json();
        setSubjects(data);
      } catch (error) {
        console.error(error);
        setSubjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedYear === "all") {
      setSubjects(initialSubjects);
    } else {
      fetchSubjectsByYear(selectedYear);
    }
  }, [selectedYear, initialSubjects]);

  const years = [1, 2, 3, 4, 5];

  return (
    <section
      id="subjects"
      className="container mx-auto px-4 py-12 scroll-mt-20 md:px-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Subjects
        </h1>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear(
                e.target.value === "all" ? "all" : parseInt(e.target.value)
              )
            }
            className="appearance-none pl-4 pr-10 py-2 bg-card-bg border border-border rounded-md text-sm text-muted-accent"
          >
            <option value="all">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {formatYear(year)}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-accent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-12 w-12 animate-spin text-accent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.length > 0 ? (
            subjects.map((subject: Subject) => (
              <Link
                key={subject.id}
                href={`/subjects/${subject.id}`}
                className="group block p-6 bg-card-bg border border-border rounded-lg ..."
              >
                <div className="mb-4">
                  <Database
                    className="text-muted-accent group-hover:text-accent ..."
                    size={32}
                  />
                </div>
                <h2 className="text-lg font-semibold ...">{subject.name}</h2>
                <div className="flex items-center gap-2">
                  {/* Year Tag */}
                  <span className="text-xs px-2 py-1 bg-primary text-muted-accent rounded-full border border-border">
                    {formatYear(subject.year)}
                  </span>

                  {/* Specialization Tag */}
                  {subject.specialization &&
                    subject.specialization.toLowerCase() !== "common" && (
                      <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded-full border border-accent/30">
                        {subject.specialization}
                      </span>
                    )}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-muted-accent col-span-full text-center">
              No subjects found for this year.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
