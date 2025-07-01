"use client";

import Script from "next/script";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { slugify } from "@/lib/utils";

type Props = {
  content: string;
};

export default function MarkdownRenderer({ content }: Props) {
  return (
    <>
      <Script id="mathjax-config">
        {`
          if (window.MathJax) {
            window.MathJax.typesetClear();
            window.MathJax.typeset();
          } else {
            window.MathJax = {
              tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
              }
            };
          }
        `}
      </Script>
      <Script
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
        strategy="lazyOnload"
      />

      <article className="prose prose-invert max-w-none">
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            h2: ({ node, ...props }) => (
              <h2
                id={slugify(props.children?.toString() || "")}
                {...props}
              ></h2>
            ),
          }}
        >
          {content}
        </Markdown>
      </article>
    </>
  );
}
