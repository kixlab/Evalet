import { useState, useRef, useEffect } from 'react';
import * as S from './TextInput.style';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  inactive?: boolean;
}

export const OnelineTextInput = ({ value, onChange, placeholder, inactive = false }: Props) => {
  return (
    <S.OnelineTextInput
      className={inactive ? 'inactive' : ''}
      value={value}
      onChange={(e) => {
        if (inactive) return;
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      disabled={inactive}
    />
  );
};

export const TextArea = ({ value, onChange, placeholder }: Props) => {
  const LINE_HEIGHT = 16;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: any) => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto'; // Reset the height to recalculate
    const newHeight = textareaRef.current.scrollHeight;
    textareaRef.current.style.height = `${newHeight}px`;

    onChange(event.target.value);
  };

  return <S.ResizableTextArea ref={textareaRef} value={value} onChange={(e) => handleChange(e)} placeholder={placeholder} />;
};

export const FixedSizeTextArea = ({ value, onChange, placeholder }: Props) => {
  return <S.ResizableTextArea className="fixed" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
};
