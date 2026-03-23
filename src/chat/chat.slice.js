import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: {},
    currentChatId: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    createNewChat: (state, action) => {
      const { chatId, title } = action.payload;
      state.chats[chatId] = {
        id: chatId,
        title,
        messages: [],
        lastUpdated: new Date().toISOString(),
      };
    },
    addNewMsg: (state, action) => {
      const { chatId, content, role } = action.payload;
      state.chats[chatId].messages.push({ content, role });
    },
    addMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      state.chats[chatId].messages.push(...messages);
    },
    resetCurrentChat: (state) => {
      state.currentChatId = null;
    },
    deleteChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];
      // if deleted chat was open, reset to null
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
      }
    },
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  createNewChat,
  addNewMsg,
  addMessages,
  resetCurrentChat,
  deleteChat,
} = chatSlice.actions;
export default chatSlice.reducer;
