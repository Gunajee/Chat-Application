import React from "react";
import styled from "styled-components";
import Robot from "../assert/robot.gif";

export default function Welcome({ currentUser }) {
  return (
    <Container>
      <img src={Robot} alt="Robot" />
      <h1>
        {/* Welcome, <span>{currentUser.username}!</span> */}
        Welcome, <span>{currentUser.username}!</span>
      </h1>
      <h3>Please select a chat to Start Messaging</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
`;
