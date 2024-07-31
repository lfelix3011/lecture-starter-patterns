import styled from '@emotion/styled';

const StyledDialog = styled.dialog`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 80%;
  max-width: 500px;
  z-index: 1000;
  background-color: white;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  &[open] {
    opacity: 1;
  }

  button {
    background: none;
    border: none;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
`;

const ModalButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

export { StyledDialog, ModalButton, Backdrop };
