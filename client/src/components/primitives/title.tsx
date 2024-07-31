import { ChangeEvent, useEffect, useState } from 'react';

import { useComponentVisible } from '../../hooks/useComponentVisible';
import { BasicTitle } from './styled/basic-title';
import { TitleContainer } from './styled/title-container';
import { TitleInput } from './styled/title-input';
import { isStringNullOrEmpty } from '../../common/helpers/utilities';
import { ErrorMessage } from './styled/error-message';
import { FormElement } from './styled/form-element';

type Props = {
  fontSize: 'x-large' | 'large' | 'medium';
  isBold?: boolean;
  title: string;
  width?: number;
  onChange: (value: string) => void;
};

export const Title = ({ onChange, title, fontSize, isBold, width }: Props) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const [value, setValue] = useState(title);
  const [valueError, setValueError] = useState('');

  useEffect(() => {
    setValue(title);
    if (isStringNullOrEmpty(title)) setIsComponentVisible(true);
  }, [title]);

  const validateValue = (value: string): boolean => {
    if (isStringNullOrEmpty(value)) {
      setValueError('Value is required');
      return false;
    }

    setValueError('');
    return true;
  };

  const isValueValidToSubmit = (): boolean => {
    return isStringNullOrEmpty(valueError);
  };

  const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
    const valueChanged = e.target.value;

    const isValid: boolean = validateValue(valueChanged);
    if (!isValid) {
      setIsComponentVisible(true);
      return;
    }

    setValue(valueChanged);
    onChange(valueChanged);
  };

  const onBlur = () => {
    if (!isValueValidToSubmit()) {
      setIsComponentVisible(true);
      return;
    }
    setIsComponentVisible(false);
    setValueError('');
  };
  return (
    <TitleContainer className="title-container" ref={ref}>
      {isComponentVisible ? (
        <FormElement>
          <TitleInput
            className="title-input"
            value={value}
            onChange={onEdit}
            onBlur={onBlur}
            fontSize={fontSize}
            isBold={isBold}
            autoFocus={isComponentVisible}
            width={width ?? 250}
          />
          {valueError && <ErrorMessage>{valueError}</ErrorMessage>}
        </FormElement>
      ) : (
        <BasicTitle className="title-content" onClick={() => setIsComponentVisible(true)}>
          {value}
        </BasicTitle>
      )}
    </TitleContainer>
  );
};
