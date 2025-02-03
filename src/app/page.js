/** @format */
"use client";
import Index from "./index.js";
import { useState, useEffect } from "react";

export default function Home() {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	return (
		<div>
			<Index />
		</div>
	);
}
