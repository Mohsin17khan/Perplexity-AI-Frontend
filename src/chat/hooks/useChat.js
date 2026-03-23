import { initializeSocketConnection } from "../services/chat.socket";
import { sendmsg, getmsg, getchats, deletemsg } from "../services/chat.api";
import { useDispatch, useSelector } from "react-redux";

import {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  addNewMsg,
  createNewChat,
  addMessages,
  resetCurrentChat,
  deleteChat
} from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const chats = useSelector((state) => state.chat.chats);

  async function handleSendMsg({ message, chatId }) {
    dispatch(setLoading(true)); // ← loading starts
    try {
      const data = await sendmsg({ message, chatId });
      const { chat, aiMessage } = data;
      if (!chatId) {
        dispatch(createNewChat({ chatId: chat._id, title: chat.title }));
      }
      dispatch(
        addNewMsg({
          chatId: chatId || chat._id,
          content: message,
          role: "user",
        }),
      );
      dispatch(
        addNewMsg({
          chatId: chatId || chat._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      dispatch(setCurrentChatId(chat._id));
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false)); // ← loading ends (always)
    }
  }

  async function handleGetChats() {
    dispatch(setLoading(true));
    const data = await getchats();
    const { chats } = data;
    dispatch(
      setChats(
        chats.reduce((acc, chat) => {
          acc[chat._id] = {
            id: chat._id,
            title: chat.title,
            messages: [],
            lastUpdated: chat.updatedAt,
          };
          return acc;
        }, {}),
      ),
    );
    dispatch(setLoading(false));
  }

  async function handleOpenChat(chatId) {
    dispatch(setLoading(true));
    dispatch(setCurrentChatId(chatId)); // ← ADD THIS, sets currentChatId so Dashboard renders correct chat

    // Only fetch if messages not already loaded
    const existingMessages = chats[chatId]?.messages; // ← needs chats from Redux
    if (existingMessages && existingMessages.length > 0) {
      dispatch(setLoading(false));
      return; // ← skip fetch if already loaded, prevents duplicates
    }

    const data = await getmsg(chatId);
    const { messages } = data;
    dispatch(
      addMessages({
        chatId,
        messages: messages.map((msg) => ({
          content: msg.content,
          role: msg.role,
        })),
      }),
    );
    dispatch(setLoading(false));
  }
  
async function handleDeleteChat(chatId) {
    try {
        await deletemsg(chatId);           // ← call API first
        dispatch(deleteChat(chatId));      // ← then remove from Redux
    } catch (err) {
        dispatch(setError(err.message));
    }
}
  function handleNewChat() {
    dispatch(resetCurrentChat()); // clears currentChatId → Dashboard shows empty state
  }

  return {
    initializeSocketConnection,
    handleSendMsg,
    handleGetChats,
    handleOpenChat,
    handleNewChat,
    handleDeleteChat
  };
};
