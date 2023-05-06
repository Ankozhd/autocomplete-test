import React from 'react';
import { type OptionType } from '../types';

interface OptionProps {
  title: string;
  value: string;
  onClick: (option: OptionType) => void;
  highlightText: (text: string) => React.ReactNode;
}

const Option: React.FC<OptionProps> = ({
  title,
  value,
  onClick,
  highlightText
}) => {
  const handleClick = (): void => {
    onClick({ title, value });
  };

  return <li onClick={handleClick}>{highlightText(title)}</li>;
};

export default Option;
