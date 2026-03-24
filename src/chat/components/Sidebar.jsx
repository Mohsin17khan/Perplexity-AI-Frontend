import { useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { useSelector } from "react-redux";
import { authSlice } from "../../auth/auth.slice";

const SIDEBAR_NAV = [{ icon: "", label: "Search", id: "search" }];

const SIDEBAR_TOOLS = [
  { icon: "✦", label: "New Chat", id: "new", isNew: true },
  { icon: "🧭", label: "Discover", id: "discover" },
  { icon: "…", label: "About", id: "About" },
];

export function Sidebar({ active, onSelect, setAbout }) {
  const chat = useChat();
  const chats = useSelector((state) => state.chat.chats);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    chat.handleGetChats();
    console.log(chats);
  }, []);

  const handleGetMsg = (chatId) => {
    console.log(chatId);
    chat.handleOpenChat(chatId);
  };
  const OpenAbout = () => {
    setAbout(true);
  };

  return (
    <aside
    style={{
        paddingTop: "max(12px, env(safe-area-inset-top))", 
    }}
    // ye  
    
    className="w-52 flex-shrink-0 flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-subtle)] py-3 px-2 h-full overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="logo-orb" />
          <span className="text-sm font-semibold tracking-wide text-[var(--text-primary)]">
            perplexity
          </span>
        </div>
        <button className="new-thread-btn" title="Collapse">
          <span className="text-xs">&#x276E;</span>
        </button>
      </div>

      {/* Top nav */}
      {SIDEBAR_NAV.map((item) => (
        <div
          key={item.id}
          className={`sidebar-item animate-slide-left delay-100 ${active === item.id ? "active" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className="icon">{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}

      <div className="divider my-2" />

      {/* Tools */}
      {SIDEBAR_TOOLS.map((item, i) => (
        <div
          key={item.id}
          className={`sidebar-item animate-slide-left delay-${100 + i * 50} ${active === item.id ? "active" : ""}`}
          // onClick={() => onSelect(item.id)}
          onClick={() => {
            if (item.id === "new") {
              chat.handleNewChat();
              setAbout(false); // ← new chat button
            } else if (item.id === "About") {
              OpenAbout();
            } else {
              onSelect(item.id);
            }
          }}
        >
          <span className="icon text-[var(--text-muted)]">{item.icon}</span>
          <span>{item.label}</span>
          {item.isNew && (
            <span
              className="ml-auto chip"
              style={{ fontSize: "10px", padding: "1px 6px" }}
            >
              New
            </span>
          )}
        </div>
      ))}

      <div className="recent max-h-[60%] overflow-y-auto ">
        <h2 className="text-gray-400 text-[14px] ">Recent</h2>
        <div className="all-recent-text mt-2 flex flex-col gap-2 ">
          {Object.values(chats).length === 0 ? (
            <p className="text-[var(--text-muted)] text-[11px] text-center mt-3">
              No chats yet
            </p>
          ) : (
            Object.values(chats).map((chatItem, index) => (
              <div
                key={index}
                className="recent-text group bg-[var(--border-def)]  rounded-[5px] p-2 text-[11px] max-h-10 whitespace-nowrap overflow-hidden flex items-center justify-between"
              >
                <p
                  onClick={() => handleGetMsg(chatItem.id)}
                  className="flex-1 overflow-hidden"
                >
                  {chatItem.title}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    chat.handleDeleteChat(chatItem.id); // ← chatItem.id exists here ✓
                  }}
                  className="text-red-500  px-1 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sign-in */}
      <div className="mt-auto pt-4">
        <div className="divider mb-3" />
        <div className="sidebar-item">
          <div className="w-5 h-5 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[10px] text-[var(--text-muted)]">
            👤
          </div>
          <span>{user.username}</span>
        </div>
      </div>
    </aside>
  );
}
