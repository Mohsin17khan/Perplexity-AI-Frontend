import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import "../styles/Dashboard.css";
import { Sidebar } from "../components/Sidebar";
import { AiTypingLoader } from "../components/AiTypingLoader";
import { AiMessage } from "../components/AiMessage";
import { UserMessage } from "../components/UserMessage";
import Header from "../components/Header";
import BlurCircle from "../components/BlurCircle";

const SUGGESTED = [
  "How does Perplexity differ from ChatGPT?",
  "Who are the founders of Perplexity AI?",
  "What is Perplexity Pro?",
];

const SOURCES = [
  {
    id: 1, favicon: "🌐", title: "Perplexity AI",
    url: "https://www.perplexity.ai/",
    snippet: "Perplexity is the world's first answer engine.",
  },
  {
    id: 2, favicon: "🦁", title: "Sheryians coding school",
    url: "https://sheryians.com/",
    snippet: "Built skills with Sheryians Coding School",
  },
  {
    id: 3, favicon: "📖", title: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Wikimedia_Foundation",
    snippet: "Perplexity AI is an AI-powered search engine.",
  },
  {
    id: 4, favicon: "🐦", title: "Latest Tweets",
    url: "https://x.com/",
    snippet: "Thread on how we built the answer engine.",
  },
];

export default function Dashboard() {
  const chat = useChat();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const isLoading = useSelector((state) => state.chat.isLoading);

  const [activeNav, setActiveNav] = useState("search");
  const [userInput, setUserInput] = useState("");
  const [about, setAbout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // ← mobile sidebar toggle

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  const messages = chats[currentChatId]?.messages ?? [];

  const handleSend = () => {
    const msg = userInput.trim();
    if (!msg || isLoading) return;
    chat.handleSendMsg({ message: msg, chatId: currentChatId });
    setUserInput("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSend();
  };

  return (
    <div className="flex overflow-hidden bg-[var(--bg-base)] relative" 
     style={{ height: '100dvh'  ,
       overflow: "hidden", // ye
       paddingTop: "env(safe-area-inset-top)",}}>

      {/* ── Mobile overlay backdrop ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      {/* On mobile: slides in as drawer. On md+: always visible */}
      <div className={`
        fixed md:relative z-30 md:z-auto h-full
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}>
        <Sidebar
          setAbout={setAbout}
          active={activeNav}
          onSelect={(id) => {
            setActiveNav(id);
            setSidebarOpen(false); // close on mobile after selection
          }}
        />
      </div>

      {/* ── Main panel ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Header — pass toggle for mobile hamburger */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* ── Scrollable body ─────────────────────────────────────────── */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden relative">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <BlurCircle top="-100px" left="-170px" color="59, 130, 246" />

            {/* ── About page ── */}
            {about ? (
              <div className="p-4 sm:p-6 text-[var(--text-primary)]">
                <h1 className="text-xl sm:text-2xl font-bold mb-4">About This Project</h1>
                <p className="text-sm leading-relaxed">
                  <p className="text-sm leading-relaxed space-y-3">
  This project is a modern, interactive web application designed to simulate a real-world operating system experience inside the browser. It allows users to open, close, resize, and manage multiple application windows just like a desktop environment, providing a highly engaging and dynamic UI.

  <br /><br />

  The core features of this project include window management functionality such as drag, resize, minimize, and close actions. Each window behaves independently, giving users a realistic multitasking experience. The UI is fully responsive and optimized for different screen sizes, ensuring smooth performance across devices.

  <br /><br />

  The project also focuses on clean design and smooth user interactions. Animations and transitions are implemented to enhance the overall user experience, making the interface feel alive and intuitive. The structure of the code is modular and scalable, making it easy to maintain and extend with additional features in the future.

  <br /><br />

  This project demonstrates practical implementation of advanced frontend concepts including state management, component reusability, and dynamic rendering. It reflects a strong understanding of how real-world applications handle multiple UI elements simultaneously.

  <br /><br />

  <span className="block font-semibold text-blue-600">
    This project was built under the guidance of <span className="text-[17px] text-blue-300">Ankur Prajapati</span>  , and I would like to express my sincere thanks to <span className="text-[17px] text-blue-300 ">Sheryians Coding School</span>  for their valuable learning resources and support throughout the journey.
  </span>
</p>
          
                </p>
                <button
                  onClick={() => setAbout(false)}
                  className="mt-4 px-4 py-2 bg-blue-500 rounded-lg cursor-pointer text-sm"
                >
                  Back
                </button>
              </div>

            ) : (
              /* ── Empty state ── */
              !currentChatId && !isLoading && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] lg:mt-30 gap-3 px-4">
                  {/* Logo */}
                  <div
                    style={{
                      width: 33, height: 33, borderRadius: "50%",
                      background: "url(public/logo.png)",
                      backgroundSize: "cover", backgroundPosition: "center",
                    }}
                  />
                  <p className="text-[var(--text-muted)] text-sm text-center">
                    Ask anything to start a conversation
                  </p>

                  {/* Sources + Suggested grid */}
                  <div className="w-full mt-6  flex flex-col  lg:flex-col  gap-4">

                    {/* Sources — 2-col grid on all sizes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                      <BlurCircle bottom="70px" left="150px" color="59, 130, 246" />
                      {SOURCES.map((s) => (
                        <div
                          key={s.id}
                          onClick={() => window.open(s.url, "_blank")}
                          className="flex bg-amber-300 items-start gap-3 p-3 sm:p-4 rounded-xl overflow-hidden cursor-pointer"
                          style={{ background: "var(--bg-surface)", border: "1px solid var(--border-subtle)" }}
                        >
                          <span className="text-xl mt-0.5 flex-shrink-0">{s.favicon}</span>
                          <div  className="min-w-0 ">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{s.title}</p>
                            <p className="text-xs text-[var(--accent-teal)] font-mono mt-0.5 truncate">{s.url}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2">{s.snippet}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Suggested questions */}
                    <div className="flex flex-col gap-2 lg:w-56 xl:w-100">
                      {SUGGESTED.map((q, i) => (
                        <button
                          key={i}
                          className="w-full text-left px-3 sm:px-4 py-3 rounded-xl text-sm text-[var(--text-secondary)] flex items-center gap-3 animate-slide-up group"
                          style={{
                            background: "var(--bg-surface)",
                            border: "1px solid var(--border-subtle)",
                            animationDelay: `${0.05 * i}s`,
                            opacity: 0,
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg-surface)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0 text-[var(--accent-teal)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                          </svg>
                          <span className="line-clamp-2 text-left">{q}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      ))}
                    </div>

                  </div>
                </div>
              )
            )}

            {/* ── Messages ── */}
            {messages.map((message, idx) => {
              if (message.role === "user")
                return <UserMessage key={idx} content={message.content} />;
              if (message.role === "assistant" || message.role === "ai")
                return <AiMessage key={idx} messaageIndex={idx} content={message.content} />;
              return null;
            })}

            {isLoading && <AiTypingLoader />}

            <div className="h-24" />
          </div>
        </div>

        {/* ── Follow-up bar ────────────────────────────────────────────── */}
        <div
          className="flex-shrink-0 px-3 sm:px-6 pb-4 sm:pb-5 pt-3"
          style={{ background: "linear-gradient(to top, var(--bg-base) 80%, transparent)" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="follow-up-bar flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3">

              {/* Mobile hamburger — only shows on small screens */}
              <button
                className="action-btn flex-shrink-0 w-7 h-7 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>

              {/* Attach button — hidden on very small screens */}
              <button className="action-btn flex-shrink-0 w-7 h-7 hidden sm:flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

              <input
                style={{
                  background: "transparent", border: "none", outline: "none",
                  flex: 1, fontSize: "14px", color: "var(--text-primary)",
                  minWidth: 0,
                }}
                placeholder="Ask a follow-up…"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleEnter}
              />

              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Model chip — hidden on mobile */}
                <div className="model-chip hidden sm:flex">
                  <span>Model</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>

                {/* Mic button — hidden on mobile */}
                <button className="action-btn w-7 h-7 hidden sm:flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </button>

                {/* Send button */}
                <button
                  onClick={handleSend}
                  className="bg-blue-400 rounded-full p-1.5 sm:p-1 cursor-pointer hover:bg-blue-700 active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}