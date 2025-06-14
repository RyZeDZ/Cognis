const yearMap: { [key: number]: string } = {
  1: "L1",
  2: "L2",
  3: "L3",
  4: "M1",
  5: "M2",
};

export function formatYear(year: number): string {
  return yearMap[year] || `Year ${year}`;
}

export function getHeadingsFromMarkdown(markdown: string): string[] {
  if (!markdown) return [];

  const headingRegex = /^##\s+(.*)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push(match[1].trim());
  }

  return headings;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
