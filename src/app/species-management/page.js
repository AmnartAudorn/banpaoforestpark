/** @format */
"use client";
import React, { useState, useEffect } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Divider,
	IconButton,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Grid,
	Paper,
	useMediaQuery,
	CssBaseline,
	Snackbar,
	Alert,
	Modal,
	TablePagination,
	DialogContentText,
	Box,
} from "@mui/material";
import { Edit, Delete, Add, Menu, ExitToApp, Forest, AddPhotoAlternate } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import AWS from "aws-sdk";

import speciesService from "../service/species.js";

// Create a Material-UI theme
const theme = createTheme();

const useStyles = makeStyles(() => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		backgroundColor: "#001529",
	},
	root: {
		display: "flex",
		minHeight: "100vh",
	},
	drawer: {
		width: 240,
		flexShrink: 0,
		"@media (max-width: 768px)": {
			display: "none", // Hide drawer for small screens
		},
	},
	drawerPaper: {
		width: 240,
	},
	content: {
		flexGrow: 1,
		padding: "24px",
		marginLeft: 240,
		"@media (max-width: 768px)": {
			marginLeft: 0, // Remove left margin for small screens
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
		width: "auto", // Adjust button width
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	dialog: {
		"& .MuiPaper-root": {
			borderRadius: "12px",
			padding: "20px",
		},
	},
	tableHead: {
		backgroundColor: "#f5f5f5", // Light gray background for header
	},
	tableCell: {
		fontWeight: "bold",
		color: "#333",
	},
	tableRow: {
		"&:hover": {
			backgroundColor: "#f5f5f5", // Hover effect for table rows
		},
	},
	iconButton: {
		margin: "0 5px",
	},
	dialogTitle: {
		textAlign: "center",
	},
}));

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	backgroundColor: "white",
	padding: "20px",
	maxHeight: "80%",
	overflowY: "auto", // Allows scrolling if the content overflows
	width: "80%", // Makes modal width responsive
	maxWidth: "100%", // Set a max width for the modal
};

const imageContainerStyle = {
	display: "grid",
	gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", // Grid layout for images
	gap: "10px", // Adds space between images
	justifyItems: "center", // Centers images in each grid cell
	marginTop: "20px",
};

const imageStyle = {
	width: "100%",
	height: "auto",
	maxWidth: "100%", // Ensures the images are responsive and fit within the grid
	borderRadius: "8px", // Adds rounded corners to the images
	boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Subtle shadow for a better visual effect
};

const SpeciesManagement = () => {
	const classes = useStyles();
	const router = useRouter();

	const [speciesData, setSpeciesData] = useState([]);
	const [currentAlbum18C, setCurrentAlbum18C] = useState([]);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSpecies, setEditingSpecies] = useState(null);
	const [formValues, setFormValues] = useState({
		images: [],
		name: "",
		quantity: "",
		height: "",
		trunkSize: "",
	});
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const isSmallScreen = useMediaQuery("(max-width:760px)");
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
	const [selectedImages, setSelectedImages] = useState([]);
	const [page, setPage] = useState(0); // หน้าปัจจุบัน
	const [rowsPerPage, setRowsPerPage] = useState(20); // จำนวนแถวต่อหน้า
	const [openConfirm, setOpenConfirm] = useState(false);
	const [speciesToDelete, setSpeciesToDelete] = useState(null);
	const [image, setImage] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token"); // or sessionStorage, depending on where your token is stored

		if (token) {
			fetchSpeciesData(); // Proceed with the fetch if token exists
		} else {
			router.push("/");
			setAlert({ open: true, message: "No token found, redirecting to login or showing error!", severity: "error" });
		}
	}, []);

	useEffect(() => {
		handleImageChange(selectedImages[0]);
	}, [selectedImages]);

	const handleImageChange = (file) => {
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				setImage(reader.result);
			};
		}
	};

	// handle เปลี่ยนหน้า
	const handleChangePage = (_, newPage) => {
		setPage(newPage);
	};

	// handle เปลี่ยนจำนวนแถวต่อหน้า
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const fetchSpeciesData = async () => {
		try {
			const data = await speciesService.getAllSpecies(); // Fetch data from the backend
			openAlbum18C();
			setSpeciesData(data); // Set the fetched data to state
		} catch (error) {
			setAlert({ open: true, message: "Error fetching species data:!", severity: "error" });
		}
	};

	// กำหนดค่า AWS SDK
	const s3 = new AWS.S3({
		accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
		region: "us-east-1",
	});

	const getAlbumImages = async (album) => {
		console.log(album);
		const params = {
			Bucket: "my-image-banpao",
			Prefix: `${album}/`,
		};

		try {
			const data = await s3.listObjectsV2(params).promise();

			console.log(data);
			return data.Contents.map((file) => `https://d2rw5mzd3w31z9.cloudfront.net/${file.Key}`);
		} catch (err) {
			console.error("Error fetching images:", err);
			return [];
		}
	};

	const openAlbum18C = () => {
		getAlbumImages("18C")
			.then((images) => {
				const filteredImages = images.slice(1);
				setCurrentAlbum18C(filteredImages);
			})
			.catch((error) => console.error("Failed to fetch images:", error));
	};

	const handleRemoveImage = (index) => {
		setSelectedImages(selectedImages.filter((_, i) => i !== index));
	};

	const handleDrawerToggle = () => {
		setIsDrawerOpen((prev) => !prev);
	};

	const handleAdd = () => {
		setEditingSpecies(null);
		setFormValues({ images: [], name: "", quantity: "", height: "", trunkSize: "" });
		setIsDialogOpen(true);
	};

	const handleEdit = (record) => {
		setEditingSpecies(record);
		setFormValues(record);
		setIsDialogOpen(true);
	};

	const handleClickDelete = (id) => {
		setSpeciesToDelete(id);
		setOpenConfirm(true);
	};

	const handleCloseConfirm = () => {
		setOpenConfirm(false);
		setSpeciesToDelete(null);
	};

	const handleDelete = async (id) => {
		setOpenConfirm(false);

		try {
			const response = await speciesService.deleteSpecies(id);

			setAlert({ open: true, message: "Species deleted successfully!", severity: "success" });

			fetchSpeciesData();
		} catch (error) {
			setAlert({
				open: true,
				message: error.response?.data?.message || "Failed to delete species.",
				severity: "error",
			});
		}
	};

	const handleDialogClose = () => {
		setIsDialogOpen(false);
	};

	const handleSave = async (event) => {
		try {
			// Simulate sending the species data to the backend
			if (editingSpecies) {
				// Simulating API call for updating species
				const response = await speciesService.updateSpecies(editingSpecies._id, formValues);

				if (response) {
					setAlert({ open: true, message: "แก้ไขสายพันธุ์ต้นไม้สำเร็จ!", severity: "success" });
					fetchSpeciesData();
				} else {
					setAlert({ open: true, message: "เพิ่มสายพันธุ์ต้นไม้ไม่สำเร็จ!", severity: "error" });
				}
			} else {
				const response = await speciesService.addSpecies({ ...formValues, image });

				if (response) {
					fetchSpeciesData();
					setAlert({ open: true, message: "เพิ่มสายพันธุ์ต้นไม้สำเร็จ!", severity: "success" });
				} else {
					setAlert({ open: true, message: "เพิ่มสายพันธุ์ต้นไม้ไม่สำเร็จ!", severity: "error" });
				}

				setSelectedImages([]);
				setImage([]);
			}
		} catch (error) {
			console.error("Error during species save:", error);
			setAlert({ open: true, message: "เพิ่มสายพันธุ์ต้นไม้ไม่สำเร็จ!", severity: "error" });
		} finally {
			setIsDialogOpen(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		const files = e.target.files ? Array.from(e.target.files) : [];

		setSelectedImages((prevImages) => [...prevImages, ...files]);

		setFormValues((prev) => ({ ...prev, [name]: value }));
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
		<>
			<ThemeProvider theme={theme}>
				<CssBaseline />
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
								ระบบจัดการพันธุ์ไม้
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
							onClose={handleDrawerToggle} // Close when clicking outside or toggling
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

								{/* <ListItem onClick={() => navigateTo("/video-management")}>
									<ListItemIcon>
										<Forest />
									</ListItemIcon>
									<ListItemText primary='อัพโหลดวีดีโอ' />
								</ListItem> */}
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

								{/* <ListItem onClick={() => navigateTo("/video-management")}>
									<ListItemIcon>
										<Forest />
									</ListItemIcon>
									<ListItemText primary='อัพโหลดวีดีโอ' />
								</ListItem> */}
							</List>
						</Drawer>
					)}

					<main className={classes.content}>
						<div className={classes.toolbar} />
						<Typography
							variant='h4'
							style={{ marginBottom: "20px" }}
						>
							จัดการรายการสายพันธุ์ไม้
						</Typography>

						<Button
							variant='contained'
							startIcon={<Add />}
							onClick={handleAdd}
							className={classes.addButton}
						>
							เพิ่มสายพันธุ์ไม้
						</Button>
						<Paper>
							<TableContainer
								component={Box}
								sx={{ overflowX: "auto" }}
							>
								<Table style={{ textAlign: "center" }}>
									<TableHead>
										<TableRow>
											<TableCell>รูปสายพันธุ์</TableCell>
											<TableCell>ชื่อสายพันธุ์</TableCell>
											<TableCell>จำนวน (ต้น)</TableCell>
											<TableCell>ความสูง (เมตร)</TableCell>
											<TableCell>ขนาดลำต้น (นิ้ว)</TableCell>
											<TableCell>การจัดการ</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{speciesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((species, index) => (
											<TableRow key={species.id || index}>
												<TableCell>
													<img
														src={currentAlbum18C[index]}
														alt={species.name}
														style={{ width: 150, height: "auto", objectFit: "cover", cursor: "pointer" }}
													/>
												</TableCell>
												<TableCell>{species.name}</TableCell>
												<TableCell>{species.quantity}</TableCell>
												<TableCell>{species.height}</TableCell>
												<TableCell>{species.trunkSize}</TableCell>
												<TableCell>
													<IconButton
														onClick={() => handleEdit(species)}
														color='info'
													>
														<Edit />
													</IconButton>
													<IconButton
														onClick={() => handleClickDelete(species._id)}
														color='error'
													>
														<Delete />
													</IconButton>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>

							{/* Pagination */}
							<TablePagination
								rowsPerPageOptions={[5, 10, 20]}
								component='div'
								count={speciesData.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</Paper>

						<Dialog
							open={isDialogOpen}
							onClose={handleDialogClose}
							fullWidth
							maxWidth={isMobile ? "xs" : "sm"}
							sx={{
								"& .MuiPaper-root": {
									borderRadius: 3,
									padding: isMobile ? 2 : 3,
									backgroundColor: "#f5f5f5",
									boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
								},
							}}
						>
							<DialogTitle
								sx={{
									fontSize: isMobile ? "1.2rem" : "1.5rem",
									fontWeight: "bold",
									textAlign: "center",
									paddingBottom: 2,
								}}
							>
								{editingSpecies ? "แก้ไขสายพันธุ์ไม้" : "เพิ่มสายพันธุ์ไม้"}
							</DialogTitle>

							<DialogContent>
								<Grid
									container
									spacing={2}
									sx={{
										paddingX: isMobile ? 1 : 2,
										"& .MuiTextField-root": {
											backgroundColor: "#fff",
											borderRadius: 1,
											marginTop: "10px",
										},
									}}
								>
									<Grid
										item
										xs={12}
									>
										<TextField
											label='ชื่อสายพันธุ์'
											name='name'
											value={formValues.name}
											onChange={handleInputChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
									>
										<TextField
											label='จำนวน'
											name='quantity'
											type='number'
											value={formValues.quantity}
											onChange={handleInputChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid
										item
										xs={12}
										sm={6}
									>
										<TextField
											label='ความสูง (เมตร)'
											name='height'
											type='number'
											value={formValues.height}
											onChange={handleInputChange}
											fullWidth
											required
										/>
									</Grid>
									<Grid
										item
										xs={12}
									>
										<TextField
											label='ขนาดลำต้น (นิ้ว)'
											name='trunkSize'
											type='number'
											value={formValues.trunkSize}
											onChange={handleInputChange}
											fullWidth
											required
										/>
									</Grid>
									{!editingSpecies && (
										<Grid
											item
											xs={12}
										>
											<Button
												variant='outlined'
												component='label'
												sx={{ width: "100%", marginTop: 2 }}
											>
												<AddPhotoAlternate sx={{ marginRight: 1 }} />
												อัพโหลดรูปภาพ
												<input
													type='file'
													multiple
													hidden
													name='images'
													onChange={handleInputChange}
												/>
											</Button>

											{selectedImages && (
												<Grid
													container
													spacing={1}
													sx={{ marginTop: 2 }}
												>
													{selectedImages.map((image, index) => (
														<Grid
															item
															key={index}
															xs={4}
															sm={3}
															md={2}
														>
															<div
																style={{
																	position: "relative",
																	display: "inline-block",
																	width: "100%",
																	height: "100%",
																}}
															>
																<img
																	src={URL.createObjectURL(image)}
																	alt={`Image ${index + 1}`}
																	style={{
																		width: "100%",
																		height: "auto",
																		objectFit: "cover",
																		borderRadius: 4,
																	}}
																/>
																<IconButton
																	sx={{
																		position: "absolute",
																		top: 0,
																		right: 0,
																		color: "red",
																	}}
																	onClick={() => handleRemoveImage(index)}
																>
																	<Typography sx={{ fontSize: 12 }}>X</Typography>
																</IconButton>
															</div>
														</Grid>
													))}
												</Grid>
											)}
										</Grid>
									)}
								</Grid>
							</DialogContent>

							<DialogActions sx={{ justifyContent: "space-between", paddingX: isMobile ? 2 : 3, paddingBottom: 2 }}>
								<Button
									onClick={handleDialogClose}
									variant='outlined'
									color='error'
									sx={{
										borderRadius: 2,
										paddingX: 2,
										fontSize: isMobile ? "0.8rem" : "1rem",
									}}
								>
									ยกเลิก
								</Button>
								<Button
									onClick={handleSave}
									variant='contained'
									color='primary'
									sx={{
										borderRadius: 2,
										paddingX: 3,
										fontSize: isMobile ? "0.8rem" : "1rem",
										backgroundColor: "#1976d2",
										"&:hover": { backgroundColor: "#115293" },
									}}
								>
									บันทึก
								</Button>
							</DialogActions>
						</Dialog>
					</main>
				</div>
			</ThemeProvider>
			{/* Snackbar for Alerts */}
			<Snackbar
				open={alert.open}
				autoHideDuration={3000}
				onClose={() => setAlert({ ...alert, open: false })}
			>
				<Alert severity={alert.severity}>{alert.message}</Alert>
			</Snackbar>
			<Dialog
				open={openConfirm}
				onClose={handleCloseConfirm}
			>
				<DialogTitle>ยืนยันการลบ</DialogTitle>
				<DialogContent>
					<DialogContentText>คุณแน่ใจว่าต้องการลบข้อมูลของสายพันธุ์นี้?</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseConfirm}
						color='primary'
					>
						ยกเลิก
					</Button>
					<Button
						onClick={() => {
							handleDelete(speciesToDelete); // เรียกฟังก์ชันลบที่คุณใช้
							handleCloseConfirm();
						}}
						color='secondary'
					>
						ลบ
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default SpeciesManagement;
