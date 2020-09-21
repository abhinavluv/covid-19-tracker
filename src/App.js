import React, { useState, useEffect } from 'react';
import {
    MenuItem,
    FormControl,
    Select,
    Card,
    CardContent,
} from '@material-ui/core';

import InfoBox from './InfoBox/InfoBox.component';
import Map from './Map/Map.component';
import Table from './Table/Table.component';
import LineGraph from './LineGraph/LineGraph.component';
import 'leaflet/dist/leaflet.css';
import { sortData, prettyPrintStat } from './util';

import './App.css';

function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796,
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
    const [casesType, setCasesType] = useState('cases');

    //   useEffect (runs a piece of code based on a given condition)

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then((response) => response.json())
            .then((data) => {
                setCountryInfo(data);
            });
    }, []);

    useEffect(() => {
        // if array is empty, this code inside runs once when app loads and not again after
        // if you pass something in the array, the code runs once when the app loads and then whenever the variable in the array changes

        // async -> send a request, wait for it, do something with response
        const getCountriesData = async () => {
            await fetch('https://disease.sh/v3/covid-19/countries')
                .then((response) => response.json())
                .then((data) => {
                    const countries = data.map((country) => ({
                        name: country.country,
                        value: country.countryInfo.iso2,
                    }));

                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setCountries(countries);
                    setMapCountries(data);
                });
        };

        getCountriesData();
    }, []);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        // setCountry(countryCode);

        const url =
            countryCode === 'worldwide'
                ? 'https://disease.sh/v3/covid-19/all'
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                setCountry(countryCode);
                setCountryInfo(data);
                countryCode === 'worldwide'
                    ? setMapCenter([34.80746, -40.4796])
                    : setMapCenter([
                          data.countryInfo.lat,
                          data.countryInfo.long,
                      ]);
                setMapZoom(3);
                // console.log("Data: ", data);
            });
        // console.log("Country Code: ", countryCode);
    };

    return (
        <Card className='app'>
            <div className='app__left'>
                <div className='app__header'>
                    <h1>COVID-19 TRACKER</h1>
                    <FormControl className='app__dropdown'>
                        <Select
                            variant='outlined'
                            value={country}
                            onChange={onCountryChange}>
                            <MenuItem value='worldwide'>WorldWide</MenuItem>
                            {/* Loop through all countries and show themin dropdown list */}
                            {countries.map((country) => (
                                <MenuItem value={country.value}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <div className='app__stats'>
                    <InfoBox
                        isRed
                        active={casesType === 'cases'}
                        onClick={(event) => setCasesType('cases')}
                        title='Coronavirus Cases'
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={prettyPrintStat(countryInfo.cases)}
                    />
                    <InfoBox
                        active={casesType === 'recovered'}
                        onClick={(event) => setCasesType('recovered')}
                        title='Recovered'
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={prettyPrintStat(countryInfo.recovered)}
                    />
                    <InfoBox
                        isRed
                        active={casesType === 'deaths'}
                        onClick={(event) => setCasesType('deaths')}
                        title='Deaths'
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={prettyPrintStat(countryInfo.deaths)}
                    />
                </div>

                {/* Map */}
                <Map
                    center={mapCenter}
                    zoom={mapZoom}
                    countries={mapCountries}
                    casesType={casesType}
                />
            </div>
            <div className='app__right'>
                <CardContent>
                    <h3>Live Cases By Country</h3>
                    <Table countries={tableData}></Table>

                    <h3 className='app__graphTitle'>
                        Worldwide New {casesType.toUpperCase()}
                    </h3>
                    {/* <br /> */}
                    <LineGraph className='app__graph' casesType={casesType} />
                </CardContent>
            </div>
        </Card>
    );
}

export default App;
