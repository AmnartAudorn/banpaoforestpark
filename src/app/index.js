/** @format */

import { Row, Col, Modal, Carousel, Menu, Layout, Form, Input, Spin } from "antd";
import Image from "next/image";
import styles from "./page.module.css";
import { DownloadOutlined } from "@ant-design/icons";
import { Box, Typography, Container, Button, Grid, IconButton, Snackbar, Alert } from "@mui/material";
import { FaFacebookF, FaLine, FaPhoneAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";

import userService from "./service/user.js";
import speciesService from "./service/species.js";

import AWS from "aws-sdk";

import { useState, useEffect } from "react";

const index = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState([]);
	const [currentAlbum18C, setCurrentAlbum18C] = useState([]);
	const [, setIsClient] = useState(false);
	const [speciesData, setSpeciesData] = useState([]);
	const router = useRouter();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [alert, setAlert] = useState({ open: false, message: "", severity: "success" });
	const [selectedImage, setSelectedImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(6);

	const { Footer } = Layout;
	useEffect(() => {
		if (typeof window !== "undefined") {
			document.querySelector("html").style.scrollBehavior = "smooth";
		}
		const fetchSpeciesData = async () => {
			try {
				const data = await speciesService.getAllSpecies(); // Fetch data from the backend
				openAlbum18C();
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
	useEffect(() => {
		const updatePageSize = () => {
			if (window.innerWidth > 768) {
				setPageSize(12); // จอใหญ่ แสดง 12 รูป
			} else {
				setPageSize(6); // จอมือถือ แสดง 6 รูป
			}
		};

		updatePageSize(); // เรียกครั้งแรก
		window.addEventListener("resize", updatePageSize); // ติดตามการเปลี่ยนแปลงขนาดจอ

		return () => window.removeEventListener("resize", updatePageSize);
	}, []);

	const paginatedImages = currentAlbum.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

			return data.Contents.map((file) => `https://d2rw5mzd3w31z9.cloudfront.net/${file.Key}`);
		} catch (err) {
			console.error("Error fetching images:", err);
			return [];
		}
	};

	const openAlbumB = () => {
		setLoading(true);
		getAlbumImages("albumB2")
			.then((images) => {
				// ตัดรายการแรกออกจากอาเรย์
				const filteredImages = images.slice(1);
				console.log(filteredImages);
				setCurrentAlbum(filteredImages);
				setIsModalOpen(true);
				setTimeout(() => {
					setLoading(false); // ปิด Loading หลัง 10 วินาที
				}, 2000);
			})
			.catch((error) => {
				console.error("Failed to fetch images:", error);
				setLoading(false); // ปิด Loading กรณีเกิดข้อผิดพลาด
			});
	};

	const openAlbumA = () => {
		setLoading(true);
		getAlbumImages("albumA2")
			.then((images) => {
				// ตัดรายการแรกออกจากอาเรย์
				const filteredImages = images.slice(1);
				console.log(filteredImages);
				setCurrentAlbum(filteredImages);
				setIsModalOpen(true);
				setTimeout(() => {
					setLoading(false); // ปิด Loading หลัง 10 วินาที
				}, 2000);
			})
			.catch((error) => {
				console.error("Failed to fetch images:", error);
				setLoading(false); // ปิด Loading กรณีเกิดข้อผิดพลาด
			});
	};

	const openAlbum18C = () => {
		setLoading(true);
		getAlbumImages("18C")
			.then((images) => {
				const filteredImages = images.slice(1); // Slice to remove the first element
				const sortedImages = filteredImages.sort((a, b) => a - b); // Sort the images sequentially
				setCurrentAlbum18C(sortedImages);
			})
			.catch((error) => console.error("Failed to fetch images:", error))
			.finally(() => {
				setLoading(false);
			});
	};

	const openAlbum = (id) => {
		setLoading(true);
		getAlbumImages(id)
			.then((images) => {
				const filteredImages = images.slice(1); // ตัดภาพแรกออก
				console.log(filteredImages);
				setCurrentAlbum(filteredImages);
				setIsModalOpen(true);
			})
			.catch((error) => console.error("Failed to fetch images:", error))
			.finally(() => {
				setLoading(false);
			});
	};

	const openAlbumC = () => {
		window.open("https://www.facebook.com/profile.php?id=100054831138147&sk=photos&locale=th_TH", "_blank");
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumA2/DJI_0530.jpg'
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumA2/DJI_0545.jpg'
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumA2/DJI_0569.jpg'
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
						<video
							controls
							autoPlay
							muted
							preload='auto'
							className={styles.video}
						>
							<source
								src='https://my-video-storages.s3.us-east-1.amazonaws.com/BanPaoForestParkedit2.mp4'
								type='video/mp4'
							/>
							Your browser does not support the video tag.
						</video>
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumB2/DSC09671.jpg'
								alt='Album Thumbnail'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={200}
								className={styles.imageBottom}
							/>
							<Image
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumA2/DJI_0541.jpg'
								alt='Second Image'
								width={300}
								height={200}
								style={{ width: "100% ", height: "100%" }}
								className={styles.imageTopA}
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumB2/DSC09737.jpg'
								alt='Album Thumbnail'
								layout='responsive' // Ensures the image scales responsively
								width={300}
								height={250}
								className={styles.imageBottom}
							/>
							<Image
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumB2/DSC09685.jpg'
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
								src='https://my-image-banpao.s3.us-east-1.amazonaws.com/albumB2/DSC09685.jpg'
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
							onClick={() => openAlbum(String(index + 1).padStart(2, "0"))}
						>
							{/* Display image dynamically */}
							<Image
								src={currentAlbum18C[index]}
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
			{/* Modal แสดงรูปภาพทั้งหมด */}
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
					style={{ padding: "0px 0px" }}
				>
					{loading ? (
						<div className={styles.loadingContainer}>
							<Spin size='large' />
							<p>กำลังโหลด...</p>
						</div>
					) : (
						<Row gutter={[8, 8]}>
							{currentAlbum.map((image, index) => (
								<Col
									key={index}
									xs={12}
									sm={8}
									md={6}
									lg={4}
									className={styles.modalImageCol}
								>
									<a
										onClick={() => downloadBase64Image(image, `Image_${index + 1}.jpg`)}
										className={styles.downloadIcon}
									>
										<DownloadOutlined />
									</a>
									<div className={styles.imageContainer}>
										<Image
											src={image}
											alt={`Album Image ${index + 1}`}
											layout='responsive'
											width={280}
											height={200}
											className={styles.modalImage}
											loading='lazy'
											onClick={() => setSelectedImage(image)}
										/>
									</div>
								</Col>
							))}
						</Row>
					)}
				</Modal>

				{/* Full Image Modal */}
				<Modal
					open={!!selectedImage}
					onCancel={() => setSelectedImage(null)}
					footer={null}
					centered
					width='100vw'
					className={styles.fullImageModal}
				>
					<Image
						src={selectedImage}
						alt='Full Size'
						width={600}
						height={600}
						className={styles.fullImage} // Use the class defined in your CSS file
						style={{ objectFit: "contain" }} // Apply only non-media-query styles here
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
