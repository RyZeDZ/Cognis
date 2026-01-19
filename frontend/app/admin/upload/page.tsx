"use client";

import { useState, useEffect, useMemo } from "react";
import type { Subject } from "@/types";
import { Book, PlusCircle, FileText } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import AddChapterForm from "./components/AddChapterForm";
import CreateSubjectForm from "./components/CreateSubjectForm";

export default function AdminUploadPage() {
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [activeMode, setActiveMode] = useState("addChapter");

  const [filterYear, setFilterYear] = useState<string>("1");

  useEffect(() => {
    const fetchAllSubjects = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}/api/subjects`);
      setAllSubjects(await res.json());
    };
    fetchAllSubjects();
  }, []);

  const filteredSubjects = useMemo(() => {
    return allSubjects.filter(
      (subject) => subject.year.toString() === filterYear
    );
  }, [allSubjects, filterYear]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Upload Content</h1>
        <p className="text-muted-accent mt-2">
          Contribute to the Cognis platform by creating new content.
        </p>
      </div>

      <Tabs.Root
        value={activeMode}
        onValueChange={setActiveMode}
        className="w-full"
      >
        <Tabs.List className="flex flex-wrap border-b border-border mb-8">
          <Tabs.Trigger
            value="addChapter"
            className="data-[state=active]:border-accent data-[state=active]:text-accent text-muted-accent border-b-2 border-transparent px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <PlusCircle size={16} /> Add Chapter to Subject
          </Tabs.Trigger>
          <Tabs.Trigger
            value="newSubject"
            className="data-[state=active]:border-accent data-[state=active]:text-accent text-muted-accent border-b-2 border-transparent px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Book size={16} /> Create New Subject
          </Tabs.Trigger>
          <Tabs.Trigger
            value="newGuide"
            className="data-[state=active]:border-accent data-[state=active]:text-accent text-muted-accent border-b-2 border-transparent px-4 py-2 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <FileText size={16} /> Create New Guide
          </Tabs.Trigger>
        </Tabs.List>

        <div className="bg-card-bg p-6 md:p-8 rounded-lg border-2 border-border">
          <Tabs.Content value="addChapter">
            <div className="mb-6">
              <label
                htmlFor="yearFilter"
                className="block text-sm font-medium text-muted-accent mb-2"
              >
                Filter by Year
              </label>
              <select
                id="yearFilter"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full mt-1 bg-primary border-2 border-border rounded-md px-3 py-2 text-text"
              >
                <option value="1">L1</option>
                <option value="2">L2</option>
                <option value="3">L3</option>
                <option value="4">M1</option>
                <option value="5">M2</option>
              </select>
            </div>
            {/* We pass the filtered list down to the form component */}
            <AddChapterForm subjectsForYear={filteredSubjects} />
          </Tabs.Content>

          <Tabs.Content value="newSubject">
            <CreateSubjectForm />
          </Tabs.Content>

          <Tabs.Content value="newGuide">
            <div className="text-center text-muted-accent p-8">
              <p>Guide creation form coming soon!</p>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
