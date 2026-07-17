import { useEffect, useState } from "react";
import UserNavbar from "../components/UserComponents/UserNavbar";
import Footer from "./Footer";
import CourseComponent from "../components/UserComponents/CourseComponent";
import CourseProgressLedger from "../components/UserComponents/CourseProgressLedger";

import { Box, Container, Heading, Image, Text, Button, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../Redux/UserReducer/action";

const INK_NAVY = "#101F38";
const GOLD = "#da9e2e";
const BLUSH = "#F4F1E8";

// How many courses to feature — bump this if you want more/fewer slides
const FEATURED_COUNT = 6;

// Same custom-arrow pattern as LandingPageCarousel — react-slick clones
// this element and injects onClick/currentSlide/etc, so spread ...rest through.
const PrevArrow = ({ onClick, currentSlide, slideCount, ...rest }) => (
  <IconButton
    aria-label="Previous featured courses"
    icon={<ChevronLeftIcon boxSize={6} />}
    onClick={onClick}
    position="absolute"
    left={{ base: "-4px", md: "-56px" }}
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    borderRadius="full"
    bg={INK_NAVY}
    color="white"
    _hover={{ bg: GOLD, color: INK_NAVY }}
    boxShadow="0 4px 12px rgba(16,31,56,0.3)"
  />
);

const NextArrow = ({ onClick, currentSlide, slideCount, ...rest }) => (
  <IconButton
    aria-label="Next featured courses"
    icon={<ChevronRightIcon boxSize={6} />}
    onClick={onClick}
    position="absolute"
    right={{ base: "-4px", md: "-56px" }}
    top="50%"
    transform="translateY(-50%)"
    zIndex={2}
    borderRadius="full"
    bg={INK_NAVY}
    color="white"
    _hover={{ bg: GOLD, color: INK_NAVY }}
    boxShadow="0 4px 12px rgba(16,31,56,0.3)"
  />
);

const UserDashboard = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const displayName = userStore?.name || userStore?.email || "there";

  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    fetch("https://learn-tech-e-learning-platform-backend.onrender.com/courses/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`courses/all responded ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        const courses = data?.course || [];
        if (courses.length > 0) {
          setFeaturedCourses(courses.slice(0, FEATURED_COUNT));
        } else {
          console.warn("courses/all returned no courses — check the backend/db.");
        }
      })
      .catch((err) => console.error("Failed to fetch featured courses:", err));
  }, []);

  const slidesToShow = 2;
  const canLoop = featuredCourses.length > slidesToShow;

  const sliderSettings = {
    swipe: true,
    dots: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    infinite: canLoop,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: featuredCourses.length > 1,
        },
      },
    ],
  };

  return (
    <Box bg={BLUSH} minH="100vh">
      <UserNavbar />

      <Container maxW="container.xl" pt={{ base: "90px", md: "110px" }} pb="6">
        {/* ---------------- My name ---------------- */}
        <Box mb="8">
          <Text
            fontSize="21px"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color={GOLD}
            textAlign="left"
            ml='60px'
          >
            Welcome back
          </Text>
          <Heading size="lg" color={INK_NAVY} textAlign="left" mt="1"  ml='60px'>
            {capitalizeFirstLetter(displayName)}
          </Heading>
        </Box>

        {/* ---------------- My progress of course ---------------- */}
        <CourseProgressLedger />

        {/* ---------------- Featured courses ---------------- */}
       {featuredCourses.length > 0 && (
  <Box mt="8" mb="6" position="relative" px={{ base: "6px", md: "60px" }}>
            <Text
              fontSize="21px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
              textAlign="left"
              mb="3"
            >
              Featured courses
            </Text>

            <Slider {...sliderSettings}>
              {featuredCourses.map((course) => (
                <Box key={course._id} px="2">
                  <Box
                    bgGradient={`linear(160deg, ${INK_NAVY} 0%, #16213E 100%)`}
                    borderRadius="16px"
                    overflow="hidden"
                    boxShadow="0 20px 50px rgba(16,31,56,0.25)"
                    display={{ base: "block", sm: "flex" }}
                    h={{ sm: "220px" }}
                  >
                    <Image
                      src={course.img}
                      alt={course.title}
                      w={{ base: "100%", sm: "180px" }}
                      h={{ base: "160px", sm: "100%" }}
                      objectFit="cover"
                      flexShrink={0}
                    />
                    <Box p="6" flex="1" textAlign="left">
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color={GOLD}
                      >
                        {course.category}
                      </Text>
                      <Heading size="sm" color="white" mt="2" mb="2" textAlign="left" noOfLines={1}>
                        {course.title}
                      </Heading>
                      <Text color="whiteAlpha.800" fontSize="xs" noOfLines={3} mb="4" textAlign="left">
                        {course.description}
                      </Text>
                      <Link to={`/course/${course._id}`}>
                        <Button
                          size="sm"
                          bg={GOLD}
                          color={INK_NAVY}
                          fontWeight="700"
                          borderRadius="8px"
                          _hover={{
                            bg: "white",
                            transform: "translateY(-1px)",
                            boxShadow: "0 6px 20px rgba(255,255,255,0.3)",
                          }}
                          transition="all 0.15s ease"
                        >
                          View course
                        </Button>
                      </Link>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Slider>
          </Box>
        )}


{/* ---------------- All courses ---------------- */}
<Box mb="6">
  <Text
    fontSize="21px"
    fontWeight="700"
    letterSpacing="0.14em"
    textTransform="uppercase"
    color={GOLD}
    textAlign="left"
    mb="2"
    ml="60px"
  >
    All courses
  </Text>
  <CourseComponent />
</Box>
      </Container>

      <Container mt="20px" maxW="container.xxl">
        <Footer />
      </Container>
    </Box>
  );
};

export default UserDashboard;