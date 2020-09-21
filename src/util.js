import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
	cases: {
		hex: "#cc1034",
		// rgb: "rgb(204, 16, 52)",
		// half_op: "rgba(204, 16, 52, 0.5)",
		multiplier: 600,
	},
	recovered: {
		hex: "#7dd71d",
		// rgb: "rgb(125, 215, 29)",
		// half_op: "rgba(125, 215, 29, 0.5)",
		multiplier: 1000,
	},
	deaths: {
		hex: "#fb4443",
		// rgb: "rgb(251, 68, 67)",
		// half_op: "rgba(251, 68, 67, 0.5)",
		multiplier: 1800,
	},
};

export const sortData = (data) => {
	const sortedData = [...data];
	return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const prettyPrintStat = (stat) =>
	stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// Draw circles on map
export const showDataOnMap = (data, casesType = "cases") =>
	data.map((country) => (
		<Circle
			center={[country.countryInfo.lat, country.countryInfo.long]}
			fillOpacity={0.4}
			color={casesTypeColors[casesType].hex}
			fillColor={casesTypeColors[casesType].hex}
			radius={
				Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
			}
		>
			<Popup>
				<div className="info-container">
					<div
						className="info-flag"
						style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
					/>
					<div className="info-name">{country.country}</div>
					<div className="info-confirmed">
						<strong>Cases: </strong>
						{numeral(country.cases).format("0,0")}
					</div>
					<div className="info-recovered">
						<strong>Recovered: </strong>
						{numeral(country.recovered).format("0,0")}
					</div>
					<div className="info-deaths">
						<strong>Deaths: </strong>
						{numeral(country.deaths).format("0,0")}
					</div>
				</div>
			</Popup>
		</Circle>
	));
