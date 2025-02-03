/** @format */
"use client";
import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Button, Snackbar, Alert, Box, useMediaQuery, TextField } from "@mui/material";
import { Edit, Delete, Add, Menu, ExitToApp, Forest, AddPhotoAlternate, Download } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import speciesService from "../service/species.js";
// Create a Material-UI theme
const theme = createTheme();

const useStyles = makeStyles(() => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: "#1976d2",
		boxShadow: "none", // Remove shadow for a sleek look
	},
	root: {
		display: "flex",
		minHeight: "100vh",
		backgroundColor: "#f5f5f5", // Light background for better contrast
	},
	drawer: {
		width: 240,
		flexShrink: 0,
		"@media (max-width: 768px)": {
			display: "none",
		},
	},
	drawerPaper: {
		width: 240,
		backgroundColor: "#ffffff", // White background for the drawer
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Soft shadow for drawer
	},
	content: {
		flexGrow: 1,
		padding: "24px",
		marginLeft: 240,
		"@media (max-width: 768px)": {
			marginLeft: 0,
		},
	},
	toolbar: theme?.mixins?.toolbar || {
		minHeight: 64,
	},
	tableContainer: {
		borderRadius: "8px",
		overflow: "hidden",
		boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
		marginBottom: "20px",
	},
	addButton: {
		marginBottom: "16px",
		backgroundColor: "#1976d2",
		color: "#fff",
		"&:hover": {
			backgroundColor: "#115293",
		},
		width: "auto",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: "4px", // Rounded corners for buttons
	},
	dialog: {
		"& .MuiPaper-root": {
			borderRadius: "12px",
			padding: "20px",
		},
	},
	tableHead: {
		backgroundColor: "#f5f5f5",
	},
	tableCell: {
		fontWeight: "bold",
		color: "#333",
	},
	tableRow: {
		"&:hover": {
			backgroundColor: "#f5f5f5",
		},
	},
	iconButton: {
		margin: "0 5px",
	},
	dialogTitle: {
		textAlign: "center",
	},
	videoContainer: {
		display: "flex",
		flexDirection: "column",
		gap: "20px", // Space out videos vertically
		marginTop: "20px",
	},
	videoItem: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		backgroundColor: "#ffffff",
		borderRadius: "8px",
		boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
		padding: "10px",
	},
	videoTitle: {
		fontSize: "1.2rem",
		fontWeight: "bold",
		color: "#333",
		marginBottom: "10px",
	},
	videoElement: {
		width: "100%",
		maxWidth: "480px", // Max width for video element
		borderRadius: "8px",
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
	},
	uploadForm: {
		marginTop: "20px",
		padding: "20px",
		backgroundColor: "#ffffff",
		borderRadius: "8px",
		boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
	},
	formTitle: {
		fontSize: "1.5rem",
		fontWeight: "bold",
		color: "#333",
		marginBottom: "16px",
	},
	formInput: {
		marginBottom: "16px",
	},
	formButton: {
		width: "100%",
		marginTop: "16px",
		padding: "12px",
		backgroundColor: "#1976d2",
		color: "#fff",
		"&:hover": {
			backgroundColor: "#115293",
		},
	},
	alertMessage: {
		fontSize: "1rem",
		fontWeight: "bold",
	},
	errorText: {
		color: "red",
		fontSize: "1rem",
	},
}));

const VideoManagement = () => {
	const classes = useStyles();
	const router = useRouter();

	const [videos, setVideos] = useState([]); // List of videos to be managed
	const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const [video, setVideo] = useState(null);
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [openSnackbar, setOpenSnackbar] = useState(false);

	const isSmallScreen = useMediaQuery("(max-width:760px)");

	// Simulating video data for example purposes

	useEffect(() => {
		const fetchVideos = async () => {
			const videoData = await speciesService.getAllVideo(); // Fetch videos from the backend
			setVideos(videoData);
		};
		fetchVideos();
	}, []);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		console.log(file);
		if (file && file.type.startsWith("video/mp4")) {
			setError(""); // Reset error
			setVideo(file);
		} else {
			setError("Please select a valid video file");
		}
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const convertFileToBase64 = (file) => {
		return new Promise((resolve, reject) => {
			if (!file) {
				reject(new Error("No file provided"));
				return;
			}
			if (!window.FileReader) {
				console.error("FileReader is not supported in this browser.");
			}
			console.log("File received:", file);

			const reader = new FileReader();

			reader.onload = () => {
				console.log("Base64 conversion successful");
				resolve(reader.result);
			};

			reader.onerror = (error) => {
				console.error("FileReader error:", error);
				reject(error);
			};

			reader.readAsDataURL(file); // ต้องเรียกหลังจากตั้งค่า `onload` และ `onerror`
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!video) {
			setError("Please provide both a name and a video.");
			return;
		}
		console.log("video:", video);
		const base64String = await convertFileToBase64(video);
		// Example usage in axios

		const data = await speciesService.uploadVideo(base64String);
		// axios
		// 	.post(
		// 		`http://localhost:3001/api/upload-video`,
		// 		{ videoBase64: base64String },
		// 		{
		// 			headers: {
		// 				"Content-Type": "multipart/form-data",
		// 			},
		// 		}
		// 	)
		// 	.then((response) => {
		// 		console.log(response.data);
		// 	})
		// 	.catch((error) => {
		// 		console.error(error);
		// 	});
	};
	const handleDrawerToggle = () => {
		setIsDrawerOpen((prev) => !prev);
	};

	const handleLogout = () => {
		setAlert({ open: true, message: "Logged out successfully", severity: "success" });
		router.push("/");
	};

	const navigateTo = (path) => {
		router.push(path);
		handleDrawerToggle(); // Close drawer after clicking
	};

	return (
		<ThemeProvider theme={theme}>
			<div className={classes.root}>
				<AppBar
					position='fixed'
					className={classes.appBar}
				>
					<Toolbar>
						<IconButton
							color='inherit'
							edge='start'
							onClick={handleDrawerToggle}
						>
							<Menu />
						</IconButton>
						<Typography
							variant='h6'
							noWrap
						>
							ระบบจัดการวีดีโอ
						</Typography>
						<IconButton
							color='inherit'
							style={{ marginLeft: "auto" }}
							onClick={handleLogout}
						>
							<ExitToApp />
						</IconButton>
					</Toolbar>
				</AppBar>

				{isSmallScreen && (
					<Drawer
						variant='temporary'
						classes={{ paper: classes.drawerPaper }}
						open={isDrawerOpen}
						onClose={handleDrawerToggle}
					>
						<div className={classes.toolbar} />
						<List>
							<ListItem onClick={() => navigateTo("/species-management")}>
								<ListItemIcon>
									<Forest />
								</ListItemIcon>
								<ListItemText primary='จัดการพันธุ์ไม้' />
							</ListItem>

							<Divider />

							<ListItem onClick={() => navigateTo("/video-management")}>
								<ListItemIcon>
									<Forest />
								</ListItemIcon>
								<ListItemText primary='อัพโหลดวีดีโอ' />
							</ListItem>
						</List>
					</Drawer>
				)}

				{!isSmallScreen && (
					<Drawer
						variant='persistent'
						classes={{ paper: classes.drawerPaper }}
						open
					>
						<div className={classes.toolbar} />
						<List>
							<ListItem onClick={() => navigateTo("/species-management")}>
								<ListItemIcon>
									<Forest />
								</ListItemIcon>
								<ListItemText primary='จัดการพันธุ์ไม้' />
							</ListItem>

							<Divider />

							<ListItem onClick={() => navigateTo("/video-management")}>
								<ListItemIcon>
									<Forest />
								</ListItemIcon>
								<ListItemText primary='อัพโหลดวีดีโอ' />
							</ListItem>
						</List>
					</Drawer>
				)}

				{/* Main content */}
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<Typography
						variant='h4'
						style={{ marginTop: "20px" }}
					>
						ดาวน์โหลดวีดีโอ
					</Typography>
					<div>
						<h1>Video Gallery</h1>
						{error && <p style={{ color: "red" }}>{error}</p>}
						<div>
							{videos.length === 0 ? (
								<p>No videos available</p>
							) : (
								videos.map((video, index) => (
									<div
										key={index}
										style={{ marginBottom: "20px" }}
									>
										{/* Check if the video data has the necessary properties */}
										{video.video ? (
											<video
												width='400'
												controls
											>
												<source
													src={`${video.video}`}
													type='video/mp4'
												/>
												Your browser does not support the video tag.
											</video>
										) : (
											<p>Video data is missing.</p>
										)}
									</div>
								))
							)}
						</div>
					</div>
					{/* Form for uploading videos */}
					<form onSubmit={handleSubmit}>
						<TextField
							label='Video Name'
							variant='outlined'
							fullWidth
							value={name}
							onChange={handleNameChange}
							error={!!error}
							helperText={error}
							style={{ marginBottom: "16px" }}
						/>

						<input
							type='file'
							accept='video/*'
							onChange={handleFileChange}
							style={{ marginBottom: "16px" }}
						/>
						{error && <Typography color='error'>{error}</Typography>}

						<Button
							type='submit'
							variant='contained'
							color='primary'
							startIcon={<Add />}
							style={{ marginTop: "16px" }}
						>
							Upload Video
						</Button>
					</form>

					{/* Success or Error Snackbar */}
					<Snackbar
						open={openSnackbar}
						autoHideDuration={3000}
						onClose={() => setOpenSnackbar(false)}
					>
						<Alert
							onClose={() => setOpenSnackbar(false)}
							severity={success ? "success" : "error"}
							sx={{ width: "100%" }}
						>
							{success || error}
						</Alert>
					</Snackbar>
				</main>
			</div>
		</ThemeProvider>
	);
};

export default VideoManagement;
