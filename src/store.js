import { createClient } from "@liveblocks/client";
import { liveblocksEnhancer } from "@liveblocks/redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

const client = createClient({
  publicApiKey: process.env.REACT_APP_LIVEBLOCKS,
});

const initialState = {
  todos: [],
  draft: '',
  isTyping: false,
};

const slice = createSlice({
  name: "state",
  initialState,
  reducers: {
    setDraft: (state, action) => {
      state.isTyping = action.payload === "" ? false : true;
      state.draft = action.payload;
    },
    addTodo: (state) => {
      state.isTyping = false;
      state.todos.push({ text: state.draft });
      state.draft = "";
    },
    deleteTodo: (state, action) => {
      state.todos.splice(action.payload, 1);
    },
    editTodo: (state, action) => {
      state.todos.map((todo, index) => {
        if (index === action.payload.index) {
          return { ...todo, text: action.payload.newText };
        }
        return todo;
      })
      state.draft = ""
    }
  },
});

export const { setDraft, addTodo, deleteTodo, editTodo } = slice.actions;

export function makeStore() {
  return configureStore({
    reducer: slice.reducer,
    enhancers: [
      liveblocksEnhancer({
        client,
        storageMapping: { todos: true },
        presenceMapping: { isTyping: true },
      }),
    ],
  });
}

const store = makeStore();

export default store;