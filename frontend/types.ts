export type Chapter = {
  id: number;
  title: string;
  content: string;
};

export type Subject = {
  id: number;
  name: string;
  year: number;
  specialization: string | null;
  chapters: Chapter[];
};

export type Guide = {
  id: number;
  title: string;
  author: string;
  date: string;
  tag: string;
};
