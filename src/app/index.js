/** @format */

import { Row, Col, Modal, Carousel, Menu, Layout, Form, Input } from "antd";
import Image from "next/image";
import styles from "./page.module.css";
import { DownloadOutlined } from "@ant-design/icons";
import { Box, Typography, Container, TextField, Button, Grid, IconButton, Snackbar, Alert } from "@mui/material";
import { FaFacebookF, FaLine, FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import userService from "./service/user.js";
import speciesService from "./service/species.js";
import ImageJson from "./img.json";

import { useState, useEffect } from "react";

const index = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState([]);
	const [, setIsClient] = useState(false);
	const [speciesData, setSpeciesData] = useState([]);
	const router = useRouter();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
	const [selectedImage, setSelectedImage] = useState(null);

	const { Footer } = Layout;
	useEffect(() => {
		if (typeof window !== "undefined") {
			document.querySelector("html").style.scrollBehavior = "smooth";
		}
		const fetchSpeciesData = async () => {
			try {
				const data = await speciesService.getAllSpecies(); // Fetch data from the backend

				setSpeciesData(data); // Set the fetched data to state
			} catch (error) {
				console.error("Error fetching species data:", error);
			}
		};

		fetchSpeciesData(); // Call the function
	}, []);

	const downloadBase64Image = (base64Data, filename) => {
		const link = document.createElement("a");
		link.href = base64Data;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	const onLoginFinish = async (values) => {
		try {
			const response = await userService.login(values);

			if (response) {
				setIsModalVisible(false);
				localStorage.setItem("token", response.token);
				router.push("/species-management");
				setAlert({ open: true, message: "Login successfully", severity: "success" });
			} else {
				console.error("Login failed:", response.message || "Unknown error");
			}
		} catch (error) {
			console.error("Error during login:", error);
		}
	};

	const menuItems = [
		{
			key: "home",
			label: <a href='#home'>หน้าแรก</a>,
		},
		{
			key: "atmosphere",
			label: <a href='#atmosphere'>ภาพบรรยากาศ</a>,
		},
		{
			key: "species",
			label: <a href='#species'>พันธุ์ไม้</a>,
		},
		// {
		// 	key: "download",
		// 	label: <a href='#download'>ดาวน์โหลด</a>,
		// },
		{
			key: "contact",
			label: <a href='#contact'>ติดต่อสอบถาม</a>,
		},
		{
			key: "login",
			label: (
				<a
					href='#login'
					onClick={(e) => {
						e.preventDefault(); // ป้องกันการเปลี่ยน URL
						showModal();
					}}
				>
					เข้าสู่ระบบ-สำหรับเจ้าหน้าที่
				</a>
			),
		},
	];

	const albumImagesA = ImageJson.albumImagesA;
	const albumImagesB = ImageJson.albumImagesB;

	const openAlbumA = () => {
		setCurrentAlbum(albumImagesA);
		setIsModalOpen(true);
	};

	const openAlbumB = () => {
		setCurrentAlbum(albumImagesB);
		setIsModalOpen(true);
	};

	const openAlbumC = () => {
		window.open("https://www.facebook.com/profile.php?id=100054831138147&sk=photos&locale=th_TH", "_blank");
	};

	const openAlbum = (id) => {
		const albumMap = {
			1: ImageJson.albumImages1,
			2: ImageJson.albumImages2,
			3: ImageJson.albumImages3,
			4: ImageJson.albumImages4,
			5: ImageJson.albumImages5,
			6: ImageJson.albumImages6,
			7: ImageJson.albumImages7,
			8: ImageJson.albumImages8,
			9: ImageJson.albumImages9,
			10: ImageJson.albumImages10,
			11: ImageJson.albumImages11,
			12: ImageJson.albumImages12,
			13: ImageJson.albumImages13,
			14: ImageJson.albumImages14,
			15: ImageJson.albumImages15,
			16: ImageJson.albumImages16,
			17: ImageJson.albumImages17,
			18: ImageJson.albumImages18,
		};

		const selectedAlbum = albumMap[id];
		if (selectedAlbum) {
			setCurrentAlbum(selectedAlbum);
			setIsModalOpen(true);
		} else {
			console.error("Album not found");
		}
	};

	return (
		<div>
			<Row id='home'>
				<Col
					span={24}
					className={styles.sidebarCol}
				>
					<Carousel autoplay>
						<div className={styles.carouselItem}>
							<Image
								src='/images/albumA/DJI_0530.JPG'
								alt='Banner 1'
								width={1920}
								height={1080}
								className={styles.bannerImage}
							/>
							<div className={styles.logoContainer}>
								<Image
									src='/images/LOGO_FINAL.png'
									alt='Logo'
									width={100}
									height={100}
									quality={100} // ปรับคุณภาพสูงสุด
									className={styles.logoImage}
								/>
							</div>
						</div>
						<div className={styles.carouselItem}>
							<Image
								src='/images/albumA/DJI_0545.JPG'
								alt='Banner 2'
								width={1920}
								height={1080}
								className={styles.bannerImage}
							/>
							<div className={styles.logoContainer}>
								<Image
									src='/images/LOGO_FINAL.png'
									alt='Logo'
									width={100}
									height={100}
									quality={100} // ปรับคุณภาพสูงสุด
									className={styles.logoImage}
								/>
							</div>
						</div>
						<div className={styles.carouselItem}>
							<Image
								src='/images/albumA/DJI_0569.JPG'
								alt='Banner 3'
								width={1920}
								height={1080}
								className={styles.bannerImage}
							/>
							<div className={styles.logoContainer}>
								<Image
									src='/images/LOGO_FINAL.png'
									alt='Logo'
									width={100}
									height={100}
									quality={100} // ปรับคุณภาพสูงสุด
									className={styles.logoImage}
								/>
							</div>
						</div>
					</Carousel>
				</Col>
			</Row>
			<Row
				justify='center'
				className={styles.bottomNavBar}
				gutter={[16, 16]}
			>
				<Menu
					mode='horizontal'
					className={styles.menu}
					items={menuItems}
				/>
			</Row>
			<Row gutter={16}>
				<Col
					xs={24}
					sm={12}
					md={12}
				>
					<div className={styles.videoContainer}>
						<iframe
							className={styles.video}
							width='100%'
							height='300px'
							src='https://www.youtube.com/embed/sm47bqkMs_s'
							title='YouTube Video'
							frameBorder='0'
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
						></iframe>
					</div>
				</Col>
				<Col
					xs={24}
					sm={12}
					md={12}
					lg={12}
				>
					{/* ข้อความ */}
					<div className={styles.textContainer}>
						<h2>สวนป่าบ้านเปา</h2>
						<p>สวนป่าบ้านเป้า แปลงเพาะพันธุ์ไม้ป่า ไม้ประดับ คุณภาพสูง</p>
					</div>
				</Col>
			</Row>
			<Row
				id='atmosphere'
				gutter={[16, 16]}
			>
				<Col
					xs={24}
					sm={8}
					md={8}
					lg={8}
					className={styles.contentCol}
				>
					<div
						className={styles.albumContainer_a}
						onClick={openAlbumA}
					>
						<div className={styles.imageContainer}>
							<Image
								src='/images/albumB/DSC09696.jpg'
								alt='Album Thumbnail'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageBottom}
							/>
							<Image
								src='/images/albumB/DSC09696.jpg'
								alt='Second Image'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageTop}
							/>
						</div>
						<div className={styles.albumTitleV}>ภาพบรรยากาศ</div>
					</div>
				</Col>

				<Col
					xs={24}
					sm={8}
					md={8}
					lg={8}
					className={styles.contentCol}
				>
					<div
						className={styles.albumContainer_a}
						onClick={openAlbumB}
					>
						<div className={styles.imageContainer}>
							<Image
								src='/images/albumB/DSC09737.jpg'
								alt='Album Thumbnail'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={250}
								className={styles.imageBottom}
							/>
							<Image
								src='/images/albumB/DSC09685.jpg'
								alt='Second Image'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageTop}
							/>
						</div>
						<div className={styles.albumTitleV}>ภาพรวมต้นไม้</div>
					</div>
				</Col>
				<Col
					xs={24}
					sm={8}
					md={8}
					lg={8}
					className={styles.contentCol}
				>
					<div
						className={styles.albumContainer_a}
						onClick={openAlbumC}
					>
						<div className={styles.imageContainer}>
							<Image
								src='/images/albumB/DSC09685.jpg'
								alt='Album Thumbnail'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageBottom}
							/>
							<Image
								src='/images/FUN01.jpg'
								alt='Second Image'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageTop}
							/>
						</div>
						<div className={styles.albumTitleV}>ภาพกิจกรรมภายในสวน</div>
					</div>
				</Col>
			</Row>
			<Row
				id='species'
				gutter={[16, 16]}
				justify='center'
				className={styles.rowWithBorder}
			>
				{speciesData.map((species, index) => (
					<Col
						key={index}
						xs={12} // ✅ 4 คอลัมน์ต่อแถวบนจอมือถือ
						sm={8} // 3 คอลัมน์ต่อแถวบนจอเล็ก
						md={6} // 4 คอลัมน์ต่อแถวบนจอกลาง
						lg={6} // 4 คอลัมน์ต่อแถวบนจอใหญ่
						xl={6} // 4 คอลัมน์ต่อแถวบนจอใหญ่มาก
					>
						<div
							className={styles.albumContainer}
							onClick={() => openAlbum(index + 1)}
						>
							{/* Display image dynamically */}
							<Image
								src={`/images/18C/${index + 1}.jpg`}
								alt={species.name}
								layout='responsive'
								width={300}
								height={200}
								className={styles.image}
							/>

							<div className={styles.albumTitleName}>{species.name}</div>
							<div className={styles.infoContainer}>
								{/* Text Content */}
								<div className={styles.leftText}>
									<div className={styles.albumTitle}>จำนวน {species.quantity} ต้น</div>
									<div className={styles.albumTitle}>ความสูง {species.height} เมตร</div>
									<div className={styles.albumTitle}>ขนาดลำต้น {species.trunkSize} นิ้ว</div>
								</div>
								{/* Updated Date */}
								<div className={styles.rightText}>
									<div className={styles.updatedDate}>
										อัพเดทเมื่อ:{" "}
										{new Date(species.lastUpdated).toLocaleDateString("th-TH", {
											day: "2-digit",
											month: "2-digit",
											year: "numeric",
										})}
									</div>
								</div>
							</div>
						</div>
					</Col>
				))}
			</Row>
			{/* <Row id='download'></Row> */}
			<Row
				id='contact'
				justify='center'
				className={styles.contactSection}
			>
				<Col
					span={24}
					sm={20}
					md={16}
					lg={12}
				>
					<Container maxWidth='lg'>
						{/* Header */}
						<Box
							sx={{
								textAlign: "center",
								marginBottom: 4,
								padding: 2,
								borderRadius: 2,
							}}
						>
							<Typography
								variant='h3'
								sx={{ marginBottom: 2 }}
							>
								ติดต่อเรา
							</Typography>
							<Typography variant='body1'>ติดต่อเราผ่านช่องทางต่าง ๆ ด้านล่างนี้</Typography>
						</Box>

						{/* Contact Info */}
						<Grid
							container
							spacing={3}
							sx={{ marginBottom: 4 }}
						>
							<Grid
								item
								xs={12}
								sm={4}
								md={4}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<IconButton
										href='https://www.facebook.com/profile.php?id=100054831138147&locale=th_TH'
										target='_blank'
										sx={{ color: "#4267B2" }}
									>
										<FaFacebookF size={36} />
									</IconButton>
									<Typography>Ban Pao Forest Park</Typography>
								</Box>
							</Grid>
							<Grid
								item
								xs={12}
								sm={4}
								md={4}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<IconButton
										target='_blank'
										sx={{ color: "#00B900" }}
									>
										<FaLine size={36} />
									</IconButton>
									<Typography>@BanPaoForestPark</Typography>
								</Box>
							</Grid>
							<Grid
								item
								xs={12}
								sm={4}
								md={4}
							>
								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<IconButton
										href='tel:0974462351'
										sx={{ color: "#FF5722" }}
									>
										<FaPhoneAlt size={36} />
									</IconButton>
									<Typography>097-446-2351</Typography>
								</Box>
							</Grid>
						</Grid>
					</Container>
				</Col>
			</Row>
			<Row id='login'>{/* Login section content */}</Row>
			<Footer className={styles.footer}>
				<Row
					justify='center'
					className={styles.footerContent}
				>
					{/* Logo Section */}
					<Col
						xs={24}
						sm={12}
						className={styles.logoSection}
					>
						<img
							src='/images/LOGO_FINAL.png'
							alt='Logo'
							className={styles.logo}
						/>
					</Col>

					{/* Social Media Section */}
					<Col
						xs={24}
						sm={12}
						className={styles.socialSection}
					>
						<h3>Follow Us</h3>
						<div className={styles.socialIcons}>
							<IconButton
								href='https://www.facebook.com/profile.php?id=100054831138147&locale=th_TH'
								target='_blank'
								sx={{ color: "#4267B2" }}
							>
								<FaFacebookF size={36} />
							</IconButton>
							<IconButton
								target='_blank'
								sx={{ color: "#00B900" }}
							>
								<FaLine size={36} />
							</IconButton>
							<IconButton
								href='tel:0974462351'
								sx={{ color: "#FF5722" }}
							>
								<FaPhoneAlt size={24} />
							</IconButton>
						</div>
					</Col>
				</Row>
				<div className={styles.copyright}>© 2025 Ban Pao Forest Park.</div>
			</Footer>
			<Modal
				title='เข้าสู่ระบบ'
				open={isModalVisible}
				onCancel={handleCancel}
				footer={null}
				centered
			>
				<Form
					name='loginForm'
					layout='vertical'
					onFinish={onLoginFinish}
					style={{ padding: "10px" }}
				>
					<Form.Item
						label='ชื่อผู้ใช้ (Username)'
						name='username'
						rules={[{ required: true, message: "กรุณาใส่ชื่อผู้ใช้" }]}
					>
						<Input placeholder='กรุณาใส่ชื่อผู้ใช้' />
					</Form.Item>

					<Form.Item
						label='รหัสผ่าน (Password)'
						name='password'
						rules={[{ required: true, message: "กรุณาใส่รหัสผ่าน" }]}
					>
						<Input.Password placeholder='กรุณาใส่รหัสผ่าน' />
					</Form.Item>

					<Form.Item>
						<Button
							type='primary'
							style={{ width: "100%" }}
						>
							เข้าสู่ระบบ
						</Button>
					</Form.Item>
				</Form>
			</Modal>
			{/* Modal แสดงรูปภาพทั้งหมด */}(
			<>
				{/* Modal แสดงรูปทั้งหมด */}
				<Modal
					open={isModalOpen}
					onCancel={() => {
						setIsModalOpen(false);
						setCurrentAlbum([]);
					}}
					footer={null}
					width='90%'
					className={styles.modalCustom}
					style={{ padding: "16px" }}
				>
					<Row gutter={[8, 8]}>
						{currentAlbum.map((image, index) => (
							<Col
								xs={8} // แสดง 4 คอลัมน์ในหน้าจอเล็ก
								sm={8} // 3 คอลัมน์ในหน้าจอกลาง
								md={6} // 4 คอลัมน์ในหน้าจอใหญ่
								lg={4} // 5 คอลัมน์ในหน้าจอใหญ่ขึ้น
								key={index}
								className={styles.modalImageCol}
							>
								<div
									className={styles.imageContainer}
									style={{ width: "100%" }}
								>
									{/* กดเพื่อดาวน์โหลด */}
									<a
										onClick={() => downloadBase64Image(image, `Image_${index + 1}.jpg`)}
										className={styles.downloadIcon}
									>
										<DownloadOutlined />
									</a>

									<Image
										src={image}
										alt={`Album Image ${index + 1}`}
										layout='responsive'
										width={280}
										height={200}
										className={styles.modalImage}
										preview={undefined} // ปิด preview
										onClick={() => setSelectedImage(image)} // เปิดภาพขนาดเต็ม
									/>
								</div>
							</Col>
						))}
					</Row>
				</Modal>

				<Modal
					open={!!selectedImage}
					onCancel={() => setSelectedImage(null)}
					footer={null}
					centered
					width='50vw'
					className={styles.fullImageModal}
				>
					<Image
						src={selectedImage}
						alt='Full Size'
						layout='intrinsic' // ใช้ให้รูปไม่แตก
						width={1000} // ตั้งค่าขนาดรูปจริง
						height={600}
						className={styles.fullImage}
						style={{ objectFit: "contain", width: "100%", height: "auto" }} // ป้องกันรูปแตก
					/>
				</Modal>
			</>
			<Snackbar
				open={alert.open}
				autoHideDuration={3000}
				onClose={() => setAlert({ ...alert, open: false })}
			>
				<Alert severity={alert.severity}>{alert.message}</Alert>
			</Snackbar>
		</div>
	);
};

export default index;
