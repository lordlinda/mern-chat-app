import React, { useState, useEffect } from "react";
import { Form, Icon, Input, Button, Row, Col } from "antd";
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import Dropzone from "react-dropzone";

import { getChats, postMessage } from "../../../_actions/chat_actions";
import ChatCard from "./sections/ChatCard";
import axios from "axios";
function ChatPage(props) {
  const [chatMessage, setChatMessage] = useState("");
  let server = "http://localhost:5000";

  //!this connectOptions is what prevents the cors errors so dont ever delete it

  var connectionOptions = {
    "force new connection": true,
    reconnectionAttempts: "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
    timeout: 10000, //before connect_error and connect_timeout are emitted.
    transports: ["websocket"],
  };
  const socket = io(server, connectionOptions);
  useEffect(() => {
    props.getChats();
    socket.on("Output Chat Message", (messageFromBackEnd) => {
      console.log(messageFromBackEnd);
      props.postMessage(messageFromBackEnd);
    });
    var element = document.getElementById("scrollElement");
    element.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, []);

  const handleSearchChange = (e) => {
    setChatMessage(e.target.value);
  };

  const submitChatMessage = (e) => {
    e.preventDefault();

    socket.emit("Input Chat Message", {
      chatMessage,
      userId: props.user.userData._id,
      userName: props.user.userData.name,
      userImage: props.user.userData.image,
      nowTime: moment(),
      type: "Text",
    });
    setChatMessage("");
  };
  const onDrop = (files) => {
    console.log(files);
    if (props.user.userData && !props.user.userData.isAuth) {
      return alert("Please Log in first");
    }

    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    formData.append("file", files[0]);

    axios
      .post(
        `${process.env.REACT_APP_URL}/api/chat/uploadfiles`,
        formData,
        config
      )
      .then((response) => {
        if (response.data.success) {
          console.log("sucess");
          socket.emit("Input Chat Message", {
            chatMessage: response.data.url,
            userId: props.user.userData._id,
            userName: props.user.userData.name,
            userImage: props.user.userData.image,
            nowTime: moment(),
            type: "VideoOrImage",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const renderCards = () =>
    props.chats &&
    props.chats.map((chat) => <ChatCard key={chat._id} {...chat} />);
  return (
    <div>
      <React.Fragment>
        <div>
          <p style={{ fontSize: "2rem", textAlign: "center" }}>
            {" "}
            Real Time Chat
          </p>
        </div>

        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="infinite-container">
            {props.chats && <div>{renderCards()}</div>}
            <div id="scrollElement" style={{ float: "left", clear: "both" }} />
          </div>

          <Row>
            <Form layout="inline" onSubmit={submitChatMessage}>
              <Col span={18}>
                <Input
                  id="message"
                  prefix={
                    <Icon type="message" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Let's start talking"
                  type="text"
                  value={chatMessage}
                  onChange={handleSearchChange}
                />
              </Col>
              <Col span={2}>
                <Dropzone onDrop={onDrop}>
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Button>
                          <Icon type="upload" />
                        </Button>
                      </div>
                    </section>
                  )}
                </Dropzone>
              </Col>

              <Col span={4}>
                <Button
                  type="primary"
                  style={{ width: "100%" }}
                  onClick={submitChatMessage}
                  htmlType="submit"
                >
                  <Icon type="enter" />
                </Button>
              </Col>
            </Form>
          </Row>
        </div>
      </React.Fragment>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    chats: state.chat.chats,
  };
};
export default connect(mapStateToProps, { getChats, postMessage })(ChatPage);
