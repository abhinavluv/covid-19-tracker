import React from "react";
import "./InfoBox.css";

import { Card, CardContent, Typography } from "@material-ui/core";

function InfoBox({ title, cases, active, isRed, total, ...props }) {
	return (
		<Card
			className={`infoBox ${active && "infoBox--selected"} ${
				isRed && "infoBox--red"
			}`}
			onClick={props.onClick}
		>
			<CardContent>
				{/* Title */}
				<Typography color="textSecondary" className="infoBox__title">
					{title}
				</Typography>

				{/* Number of cases new */}
				<h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
					{cases}
				</h2>

				{/* Total number of cases */}
				<Typography color="textSecondary" className="infoBox__total">
					Total: {total}
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
