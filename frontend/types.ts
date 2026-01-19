// frontend/types.ts

export type Chapter = {
  id: number;
  title: string;
  content: string;
  subject_id: number;
};

export type Exam = {
  id: number;
  title: string;
  file_url: string;
  user: { username: string };
};

export type Resource = {
  id: number;
  title: string;
  link_url: string;
  user: { username: string };
};

export type Subject = {
  id: number;
  name: string;
  year: number;
  specialization: string | null;
  chapters: Chapter[];
  exams: Exam[]; // <-- ADDED THIS
  resources: Resource[]; // <-- ADDED THIS
};

export type Guide = {
  id: number;
  title: string;
  author: string;
  date: string;
  tag: string;
};

export type User = {
  id: number;
  google_id: string | null;
  email: string;
  username: string;
  profile_image_url: string | null;
  is_admin: boolean;
};

// This now uses the full Chapter type, not ChapterSimple
export type ModificationRequest = {
  id: number;
  status: "pending" | "approved" | "rejected";
  proposed_title: string;
  proposed_content: string;
  user: {
    id: number;
    username: string;
  };
  chapter: Chapter; // <-- This is the important fix
};

export type FastAPIValidationError = {
  loc: (string | number)[]; // e.g., ["body", "username"]
  msg: string;
  type: string;
};

export type Notification = {
  id: number;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string; // Dates will be strings in JSON
};

type SubmissionBase = {
  title: string;
};

// Shape for suggesting a new Exam
export type ExamSubmission = SubmissionBase & {
  type: "exam"; // The "discriminator"
  file_url: string;
};

// Shape for suggesting a new Resource
export type ResourceSubmission = SubmissionBase & {
  type: "resource"; // The "discriminator"
  link_url: string;
};

// A union type: a Submission can be EITHER an ExamSubmission OR a ResourceSubmission
export type SubmissionPayload = ExamSubmission | ResourceSubmission;

// --- THIS IS THE NEW TYPE FOR THE UNIFIED QUEUE ---
export type PendingItem = {
  item_type: "edit" | "new_chapter" | "new_exam" | "new_resource";
  item_id: number;
  title: string;
  subject_name: string;
  user: {
    id: number;
    username: string;
  };
  created_at: string;
};

export type UserContribution = {
  type: string; // e.g., 'Edit Suggestion', 'New Chapter'
  title: string;
  status: string; // e.g., 'pending', 'approved', 'Published'
  item_id: number;
  content_type: "edit" | "chapter" | "exam" | "resource";
  subject_id?: number; // Optional because an edit's subject is nested deeper
  chapter_id?: number;
};
