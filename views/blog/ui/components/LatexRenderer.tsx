"use client";

import React, { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface LatexRendererProps {
  content: string;
  className?: string;
}

type BlockType =
  | { type: "math-display"; tex: string }
  | { type: "heading"; level: 1 | 2 | 3 | 4; text: string }
  | { type: "itemize"; items: string[] }
  | { type: "enumerate"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "verbatim"; text: string }
  | { type: "paragraph"; text: string };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderKaTeX(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      output: "htmlAndMathml",
    });
  } catch {
    return `<span class="text-red-500 font-mono">${escapeHtml(tex)}</span>`;
  }
}

/**
 * Renders inline LaTeX elements:
 * - $math$ or \(math\)
 * - \textbf{...}
 * - \textit{...} or \emph{...}
 * - \texttt{...}
 * - \underline{...}
 * - \href{url}{text}
 * - \url{url}
 * - \\ (line break)
 */
function renderInlineLatex(text: string): string {
  const mathTokens: string[] = [];
  let processed = text.replace(
    /\\\\\(([\s\S]*?)\\\\\)|\$([^\$\n]+?)\$/g,
    (_, m1, m2) => {
      const tex = m1 || m2;
      const html = renderKaTeX(tex, false);
      const token = `__MATH_INLINE_${mathTokens.length}__`;
      mathTokens.push(html);
      return token;
    }
  );

  processed = processed.replace(
    /\\href\{([^}]+)\}\{([^}]+)\}/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#008080] underline hover:text-[#006666]">$2</a>'
  );

  processed = processed.replace(
    /\\url\{([^}]+)\}/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-[#008080] underline hover:text-[#006666]">$1</a>'
  );

  processed = processed.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>");

  processed = processed.replace(
    /\\(?:textit|emph)\{([^}]+)\}/g,
    "<em>$1</em>"
  );

  processed = processed.replace(
    /\\texttt\{([^}]+)\}/g,
    '<code class="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono">$1</code>'
  );

  processed = processed.replace(/\\underline\{([^}]+)\}/g, "<u>$1</u>");

  processed = processed.replace(/\\\\(?:\s*)/g, "<br />");

  mathTokens.forEach((rendered, i) => {
    processed = processed.replace(`__MATH_INLINE_${i}__`, rendered);
  });

  return processed;
}

function isPureMath(input: string): boolean {
  const trimmed = input.trim();
  if (!trimmed) return false;

  if (
    (trimmed.startsWith("$$") && trimmed.endsWith("$$")) ||
    (trimmed.startsWith("\\[") && trimmed.endsWith("\\]"))
  ) {
    return true;
  }

  if (
    /^\\begin\{(equation\*?|align\*?|aligned|gather\*?|matrix|pmatrix|bmatrix|cases)\}/.test(
      trimmed
    )
  ) {
    return true;
  }

  const hasDocumentStructure = /\\(?:section|subsection|subsubsection|begin\{(?:document|itemize|enumerate|quote)\})/.test(
    trimmed
  );
  if (hasDocumentStructure) return false;

  const lines = trimmed.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const mathSymbolsRegex = /^(\\frac|\\int|\\sum|\\prod|\\sqrt|\\alpha|\\beta|\\gamma|\\lim|\\partial|[a-zA-Z0-9_\^\+\-\*\/\=\(\)\s\\]+)$/;
  if (lines.length <= 4 && lines.every((l) => mathSymbolsRegex.test(l))) {
    return true;
  }

  return false;
}

function parseLatex(raw: string): BlockType[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];

  if (isPureMath(trimmed)) {
    let cleanTex = trimmed;
    if (cleanTex.startsWith("$$") && cleanTex.endsWith("$$")) {
      cleanTex = cleanTex.slice(2, -2).trim();
    } else if (cleanTex.startsWith("\\[") && cleanTex.endsWith("\\]")) {
      cleanTex = cleanTex.slice(2, -2).trim();
    }
    return [{ type: "math-display", tex: cleanTex }];
  }

  const blocks: BlockType[] = [];
  const lines = trimmed.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line || (line.startsWith("%") && !line.startsWith("\\%"))) {
      i++;
      continue;
    }

    if (line.startsWith("$$")) {
      if (line.endsWith("$$") && line.length > 2) {
        blocks.push({
          type: "math-display",
          tex: line.slice(2, -2).trim(),
        });
        i++;
        continue;
      } else {
        const mathLines: string[] = [line.slice(2)];
        i++;
        while (i < lines.length && !lines[i].includes("$$")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const endIdx = lines[i].indexOf("$$");
          mathLines.push(lines[i].slice(0, endIdx));
          i++;
        }
        blocks.push({
          type: "math-display",
          tex: mathLines.join("\n").trim(),
        });
        continue;
      }
    }

    if (line.startsWith("\\[")) {
      if (line.endsWith("\\]") && line.length > 2) {
        blocks.push({
          type: "math-display",
          tex: line.slice(2, -2).trim(),
        });
        i++;
        continue;
      } else {
        const mathLines: string[] = [line.slice(2)];
        i++;
        while (i < lines.length && !lines[i].includes("\\]")) {
          mathLines.push(lines[i]);
          i++;
        }
        if (i < lines.length) {
          const endIdx = lines[i].indexOf("\\]");
          mathLines.push(lines[i].slice(0, endIdx));
          i++;
        }
        blocks.push({
          type: "math-display",
          tex: mathLines.join("\n").trim(),
        });
        continue;
      }
    }

    const mathEnvMatch = line.match(
      /^\\begin\{(equation\*?|align\*?|aligned|gather\*?|matrix|pmatrix|bmatrix|cases)\}/
    );
    if (mathEnvMatch) {
      const env = mathEnvMatch[1];
      const endTag = `\\end{${env}}`;
      const envLines: string[] = [line];
      i++;
      while (i < lines.length && !lines[i].includes(endTag)) {
        envLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) {
        envLines.push(lines[i]);
        i++;
      }
      blocks.push({
        type: "math-display",
        tex: envLines.join("\n").trim(),
      });
      continue;
    }

    if (line.startsWith("\\begin{verbatim}") || line.startsWith("\\begin{lstlisting}")) {
      const verbLines: string[] = [];
      i++;
      while (
        i < lines.length &&
        !lines[i].includes("\\end{verbatim}") &&
        !lines[i].includes("\\end{lstlisting}")
      ) {
        verbLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({
        type: "verbatim",
        text: verbLines.join("\n"),
      });
      continue;
    }

    if (line.startsWith("\\begin{itemize}")) {
      const items: string[] = [];
      i++;
      let currentItem = "";
      while (i < lines.length && !lines[i].includes("\\end{itemize}")) {
        const itemLine = lines[i].trim();
        if (itemLine.startsWith("\\item")) {
          if (currentItem) items.push(currentItem);
          currentItem = itemLine.slice(5).trim();
        } else if (currentItem) {
          currentItem += " " + itemLine;
        }
        i++;
      }
      if (currentItem) items.push(currentItem);
      if (i < lines.length) i++;
      blocks.push({ type: "itemize", items });
      continue;
    }

    if (line.startsWith("\\begin{enumerate}")) {
      const items: string[] = [];
      i++;
      let currentItem = "";
      while (i < lines.length && !lines[i].includes("\\end{enumerate}")) {
        const itemLine = lines[i].trim();
        if (itemLine.startsWith("\\item")) {
          if (currentItem) items.push(currentItem);
          currentItem = itemLine.slice(5).trim();
        } else if (currentItem) {
          currentItem += " " + itemLine;
        }
        i++;
      }
      if (currentItem) items.push(currentItem);
      if (i < lines.length) i++;
      blocks.push({ type: "enumerate", items });
      continue;
    }

    if (line.startsWith("\\begin{quote}")) {
      const quoteLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].includes("\\end{quote}")) {
        quoteLines.push(lines[i].trim());
        i++;
      }
      if (i < lines.length) i++;
      blocks.push({ type: "quote", text: quoteLines.join(" ") });
      continue;
    }

    const titleMatch = line.match(/^\\title\{([^}]+)\}/);
    if (titleMatch) {
      blocks.push({ type: "heading", level: 1, text: titleMatch[1] });
      i++;
      continue;
    }

    const secMatch = line.match(/^\\section\*?\{([^}]+)\}/);
    if (secMatch) {
      blocks.push({ type: "heading", level: 2, text: secMatch[1] });
      i++;
      continue;
    }

    const subsecMatch = line.match(/^\\subsection\*?\{([^}]+)\}/);
    if (subsecMatch) {
      blocks.push({ type: "heading", level: 3, text: subsecMatch[1] });
      i++;
      continue;
    }

    const subsubsecMatch = line.match(/^\\subsubsection\*?\{([^}]+)\}/);
    if (subsubsecMatch) {
      blocks.push({ type: "heading", level: 4, text: subsubsecMatch[1] });
      i++;
      continue;
    }

    const pLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine) {
        i++;
        break;
      }
      if (
        nextLine.startsWith("\\section") ||
        nextLine.startsWith("\\subsection") ||
        nextLine.startsWith("\\subsubsection") ||
        nextLine.startsWith("\\begin{") ||
        nextLine.startsWith("$$") ||
        nextLine.startsWith("\\[")
      ) {
        break;
      }
      pLines.push(nextLine);
      i++;
    }

    blocks.push({
      type: "paragraph",
      text: pLines.join(" "),
    });
  }

  return blocks;
}

export function LatexRenderer({ content, className = "" }: LatexRendererProps) {
  const blocks = useMemo(() => parseLatex(content), [content]);

  if (!content || !content.trim()) {
    return <p className="italic text-gray-400 dark:text-gray-500">*Sin contenido LaTeX*</p>;
  }

  return (
    <div className={`latex-document space-y-4 font-serif text-gray-800 dark:text-gray-200 ${className}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "math-display": {
            const rendered = renderKaTeX(block.tex, true);
            return (
              <div
                key={idx}
                className="my-6 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 overflow-x-auto text-center"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            );
          }
          case "heading": {
            const inlineHtml = renderInlineLatex(block.text);
            if (block.level === 1) {
              return (
                <h1
                  key={idx}
                  className="text-3xl font-bold font-serif pt-4 pb-2 border-b border-gray-200 dark:border-white/10 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: inlineHtml }}
                />
              );
            }
            if (block.level === 2) {
              return (
                <h2
                  key={idx}
                  className="text-2xl font-bold font-serif pt-4 pb-1 text-[#008080] dark:text-[#20b2aa]"
                  dangerouslySetInnerHTML={{ __html: inlineHtml }}
                />
              );
            }
            if (block.level === 3) {
              return (
                <h3
                  key={idx}
                  className="text-xl font-bold font-serif pt-2 dark:text-white"
                  dangerouslySetInnerHTML={{ __html: inlineHtml }}
                />
              );
            }
            return (
              <h4
                key={idx}
                className="text-lg font-semibold font-serif pt-1 text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: inlineHtml }}
              />
            );
          }
          case "itemize":
            return (
              <ul key={idx} className="list-disc pl-6 space-y-2 my-3 font-sans text-sm md:text-base">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    dangerouslySetInnerHTML={{ __html: renderInlineLatex(item) }}
                  />
                ))}
              </ul>
            );
          case "enumerate":
            return (
              <ol key={idx} className="list-decimal pl-6 space-y-2 my-3 font-sans text-sm md:text-base">
                {block.items.map((item, itemIdx) => (
                  <li
                    key={itemIdx}
                    dangerouslySetInnerHTML={{ __html: renderInlineLatex(item) }}
                  />
                ))}
              </ol>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className="border-l-4 border-[#008080] pl-4 py-2 my-4 bg-gray-50 dark:bg-white/5 rounded-r-xl italic font-serif"
                dangerouslySetInnerHTML={{ __html: renderInlineLatex(block.text) }}
              />
            );
          case "verbatim":
            return (
              <pre
                key={idx}
                className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-xs md:text-sm overflow-x-auto border border-white/10"
              >
                <code>{block.text}</code>
              </pre>
            );
          case "paragraph":
            return (
              <p
                key={idx}
                className="leading-relaxed font-sans text-sm md:text-base text-gray-700 dark:text-gray-300 my-3"
                dangerouslySetInnerHTML={{ __html: renderInlineLatex(block.text) }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
