import { GET_CHATS, POST_MESSAGE } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case GET_CHATS:
      return { ...state, chats: action.payload };
    case POST_MESSAGE:
      return { ...state, chats: [...state.chats, action.payload] };

    default:
      return state;
  }
}
