import { create } from "zustand";
import { createAuthSlice } from "./slice/AuthSlice";
import { createChatSlice } from "./slice/ChatSlice";


export const useAppStore=create()((...a)=>({
    ...createAuthSlice(...a),
    ...createChatSlice(...a)
}))