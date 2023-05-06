import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { type OptionType } from './types';
import Option from './Option';

interface AutocompleteProps {
  onSelect?: (option: OptionType | null) => void;
  placeholder?: string;
  allowClear?: boolean;
  dataSource: (searchTerm: string) => Promise<OptionType[]>;
  loadingIndicator?: React.ReactNode;
  validateInput?: (value: string) => boolean;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  onSelect,
  dataSource,
  allowClear,
  placeholder,
  loadingIndicator,
  validateInput
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<OptionType>();
  const [filteredOptions, setFilteredOptions] = useState<OptionType[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isUserInput, setIsUserInput] = useState<boolean>(true);
  const [isValid, setIsValid] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (filteredOptions.length === 0) setIsDropdownVisible(false);
  }, [filteredOptions]);

  useEffect(() => {
    if (!isValid) {
      inputRef.current?.setCustomValidity('error');
    } else {
      inputRef.current?.setCustomValidity('');
    }
  }, [isValid]);

  useEffect(() => {
    // Here I would use debounce function from 3rd party library
    // but since I can't because of task definition, I will write one myself
    const debounceTimeout = setTimeout(async () => {
      if (inputValue?.length >= 3 && isUserInput && isValid) {
        setLoading(true);
        const filteredOptions = await dataSource(inputValue);
        setLoading(false);
        setFilteredOptions(filteredOptions);
        setIsDropdownVisible(true);
      } else {
        setFilteredOptions([]);
      }
    }, 1000);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, dataSource]);

  useEffect(() => {
    setInputValue(selectedOption?.title ?? '');
  }, [selectedOption]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = event.target.value;
    if (validateInput != null) {
      setIsValid(validateInput(newValue));
    }
    setInputValue(newValue);
    setIsUserInput(true);
  };

  const handleOptionClick = (option: OptionType): void => {
    setSelectedOption(option);
    if (onSelect != null) {
      onSelect(option);
    }
    setIsDropdownVisible(false);
    setIsUserInput(false);
  };

  const handleClickOutside = (event: MouseEvent): void => {
    if (
      autocompleteRef.current != null &&
      !autocompleteRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleClearClick = (): void => {
    setInputValue('');
    setIsDropdownVisible(false);
    if (onSelect != null) {
      onSelect(null);
    }
  };

  const highlightText = (text: string): React.ReactNode => {
    if (text === '') return <span/>;
    const regex = new RegExp(`(${inputValue})`, 'gi');
    return text.split(regex).map((chunk, index) =>
      chunk.toLowerCase() === inputValue.toLowerCase()
        ? (
        <span className="highlight" key={index}>
          {chunk}
        </span>
          )
        : (
        <React.Fragment key={index}>{chunk}</React.Fragment>
          )
    );
  };

  return (
    <div className="autocomplete" ref={autocompleteRef}>
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue !== '' && allowClear === true && (
          <button className="autocomplete-clear" onClick={handleClearClick}>
            <span>clear</span>
          </button>
        )}
      </div>
      {loading && loadingIndicator}
      {isDropdownVisible && (
        <ul className="autocomplete-options">
          {filteredOptions.map((option) => (
            <Option
              key={option.value}
              title={option.title}
              value={option.value}
              onClick={handleOptionClick}
              highlightText={highlightText}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
