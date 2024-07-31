import React, { ChangeEvent, useState } from "react";

import { AddButton } from "./add-button";
import { Input } from "./styled/input";
import { isStringNullOrEmpty } from "../../common/helpers/utilities";
import { ErrorMessage } from "./styled/error-message";
import { InputButtonContainer } from "./styled/input-button-container";

type Props = {
  onSubmit: (value: string) => void;
};

const CreatorInput = ({ onSubmit }: Props) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  const hanldeNameChange = (_event: ChangeEvent<HTMLInputElement>) => {
    const name: string = _event.target.value;

    setName(name);
    validateName(name);
  };

  const validateName = (name: string): void => {
    if (isStringNullOrEmpty(name)) {
      setNameError("Name is required");
      return;
    }

    setNameError("");
    return;
  };

  const isNameValidToSubmit = (): boolean => {
    return isStringNullOrEmpty(nameError) && !isStringNullOrEmpty(name);
  };

  const onClick = () => {
    validateName(name);
    if (!isNameValidToSubmit()) {
      return;
    }

    setName("");
    onSubmit(name);
  };

  return (
    <React.Fragment>
      <section>
        <InputButtonContainer>
          <Input
            className="creator-input"
            value={name}
            onChange={hanldeNameChange}
            fontSize="medium"
            width={250}
          />
          <AddButton onClick={onClick} />
        </InputButtonContainer>
        {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
      </section>
    </React.Fragment>
  );
};

export { CreatorInput };
