import styled from "styled-components";
import { AiFillCloseCircle } from "react-icons/ai";

const ButtonContainer = styled.div`
  display: none;
  position: absolute;
  top: -10px;
  right: -10px;
  padding: 0;
  font-size: 25px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #f43d3d;
  border-radius: 200px;
  transition: opacity 0.3s;
  outline: none;
  &:hover {
    opacity: 0.7;
  }
`

export default function CloseButton<P>(props: P) {
  return (
    <ButtonContainer className="close-button" {...props}>
      <AiFillCloseCircle />
    </ButtonContainer>
  )
}