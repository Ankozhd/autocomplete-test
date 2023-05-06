import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Autocomplete from './index';
import { type OptionType } from './types';

const options = [
  { title: 'New York', value: 'NY' },
  { title: 'Los Angeles', value: 'LA' },
  { title: 'Chicago', value: 'CH' },
  { title: 'Houston', value: 'HO' }
];

const testDataSource = async (searchValue: string): Promise<OptionType[]> => {
  return await new Promise<OptionType[]>((resolve) => {
    const filtered =
        options.filter(option => option.title.toLowerCase().includes(searchValue.toLowerCase()));
    resolve(filtered);
  })
};

// Here of course should be more tests
// I just did two simple tests, but with everything required for complex ones:
// render, finding elements, mocking functions, waiting for async action
describe('Autocomplete', () => {
  it('should render the autocomplete component', () => {
    render(<Autocomplete placeholder={'Search...'} dataSource={testDataSource} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    expect(inputElement).toBeInTheDocument();
  });

  it('should display dropdown when user types at least 3 characters', async () => {
    render(<Autocomplete placeholder={'Search...'} dataSource={testDataSource} loadingIndicator={<span>loading</span>} />);
    const inputElement = screen.getByPlaceholderText('Search...');
    fireEvent.change(inputElement, { target: { value: 'new' } });

    await waitFor(async () => {
      const dropdownItem = await screen.findByText('York');
      expect(dropdownItem).toBeInTheDocument();
    }, { timeout: 3000 });
  })
});
