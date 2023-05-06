import React, { useState } from 'react';
import './App.css';
import Autocomplete from './components/Autocomplete';

interface OptionType {
  title: string;
  value: string;
}

function App (): JSX.Element {
  // This part is of course not production ready
  // Ideally data fetching should be in some service using some 3rd party library like axios and useQuery
  // Also here should be implemented some type of cache to avoid excessive loading of same values
  // but since 3rd party libraries are not allowed, I don't want to spend extra time writing it
  const citiesDataSource = async (
    searchTerm: string
  ): Promise<OptionType[]> => {
    const response = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=91988d1eae614c9f9c1205250230505&q=${searchTerm}`
    );
    const data = await response.json();
    return data.map((city: { name: any; id: any }) => ({
      title: city.name,
      value: city.id
    }));
  };

  const validateCity = (value: string): boolean => {
    const cityRegex = /^[a-zA-Z\s]+$/;
    return cityRegex.test(value);
  };

  const [selectedCity, setSelectedCity] = useState<OptionType | null>();

  return (
    <div className="App">
      <p>React Autocomplete Component</p>
      <p>Start typing to load cities suggestion from Weather API</p>
      <p>Loading starts after at least 3 symbols by WeatherAPI rules</p>
      <main>
        <div className="App-content">
          <Autocomplete
            dataSource={citiesDataSource}
            loadingIndicator={<span>loading...</span>}
            allowClear
            placeholder="City"
            onSelect={(option) => {
              setSelectedCity(option);
            }}
            validateInput={validateCity}
          />
        </div>
        {selectedCity != null && (
          <div>
            You have selected city {selectedCity.title}, id {selectedCity.value}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
