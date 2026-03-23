import { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function AiMessage({ content }) {
  const [liked, setLiked] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "response.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mb-10 animate-fade-in">
      <div className="space-y-3 mb-5 text-[14px] text-left">   {/* ← text-left fixes centering */}
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Paragraphs
            p: ({ children }) => (
              <p className="mb-3 leading-7 text-[var(--text-primary)] text-left">{children}</p>
            ),
            // Headings
            h1: ({ children }) => (
              <h1 className="text-xl font-bold mb-3 mt-5 text-[var(--text-primary)]">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-lg font-bold mb-2 mt-4 text-[var(--text-primary)]">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-base font-semibold mb-2 mt-3 text-[var(--text-primary)]">{children}</h3>
            ),
            // Bullet list
            ul: ({ children }) => (
              <ul className="list-disc list-outside pl-5 mb-3 space-y-1 text-[var(--text-primary)]">{children}</ul>
            ),
            // Numbered list
            ol: ({ children }) => (
              <ol className="list-decimal list-outside pl-5 mb-3 space-y-1 text-[var(--text-primary)]">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="leading-7 text-left">{children}</li>
            ),
            // Bold
            strong: ({ children }) => (
              <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
            ),
            // Horizontal rule
            hr: () => (
              <hr className="my-4 border-[var(--border-subtle)]" />
            ),
            // Inline code
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              return isBlock ? (
                <pre className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg p-4 overflow-x-auto my-3">
                  <code className="text-[13px] text-[var(--accent-teal)] font-mono">{children}</code>
                </pre>
              ) : (
                <code className="bg-[var(--bg-elevated)] text-[var(--accent-teal)] px-1.5 py-0.5 rounded text-[13px] font-mono">{children}</code>
              );
            },
            // Blockquote
            blockquote: ({ children }) => (
              <blockquote className="border-l-2 border-[var(--accent-teal)] pl-4 my-3 text-[var(--text-muted)] italic">{children}</blockquote>
            ),
          }}
        >
          {content}
        </Markdown>

        {/* Action buttons — unchanged */}
        <div className="flex items-center gap-2 px-2 mt-2">
          <button onClick={handleCopy} title="Copy" className="action-btn w-7 h-7">
            {copied ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>

          <button onClick={handleDownload} title="Download" className="action-btn w-7 h-7">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
            </svg>
          </button>

          <button title="Regenerate" className="action-btn w-7 h-7">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <button className={`vote-btn up ${liked === "up" ? "text-[var(--accent-teal)]" : ""}`} onClick={() => setLiked(liked === "up" ? null : "up")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={liked === "up" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
              </svg>
            </button>
            <button className={`vote-btn down ${liked === "down" ? "text-red-400" : ""}`} onClick={() => setLiked(liked === "down" ? null : "down")}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={liked === "down" ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
              </svg>
            </button>
            <button className="action-btn ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}