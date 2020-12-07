import axios from "axios";
import { GET_CHATS, POST_MESSAGE } from "./types";
import { CHAT_SERVER } from "../components/Config";

export const getChats = async () => async (dispatch) => {
  await axios.get(`${CHAT_SERVER}/getChats`).then((res) =>
    dispatch({
      type: GET_CHATS,
      payload: res.data,
    })
  );
};

export const postMessage = (post) => async (dispatch) => {
  dispatch({
    type: POST_MESSAGE,
    payload: post,
  });
};
