import { useEffect, useState } from "react";
import { Flex, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPageComponent.css";
import Card from "./Card";
import LoadingComponent from "../LoadingComponents/LoadingComponent";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";

// Custom arrows — Chakra-rendered so they don't depend on the slick-theme
// icon font (which is likely why the default arrows weren't visible).
// react-slick clones this element and injects onClick/currentSlide/etc,
// so we spread ...rest through to the button.
const PrevArrow = ({ onClick, currentSlide, slideCount, ...rest }) => (
  <IconButton
    aria-label="Previous courses"
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
    aria-label="Next courses"
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

const LandingPageCarousel = () => {
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState([]);
  const arr = [1, 2, 3, 4];
  const slidesToShow = 4;

  // infinite:true clones slides to pad out to slidesToShow — with fewer
  // real courses than that, the clones show up as visible duplicates.
  // Only loop when there are enough courses to fill a full set.
  const canLoop = course.length > slidesToShow;

  var settings = {
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
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(4, course.length) || 1,
          slidesToScroll: 1,
          infinite: course.length > 4,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, course.length) || 1,
          slidesToScroll: 1,
          infinite: course.length > 3,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: Math.min(2, course.length) || 1,
          slidesToScroll: 1,
          infinite: course.length > 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: course.length > 1,
        },
      },
    ],
  };
  
  useEffect(() => {
    const url = "https://learn-tech-e-learning-platform-backend.onrender.com/courses/all";
    setLoading(true);

    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error: " + response.status);
        }
      })
      .then((data) => {
        setCourse(data.course);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, []);

 return (
  <Flex
    direction={"column"}
    width={{ base: "90%", md: "85%" }}
    p={"20px"}
    m={"auto"}
    position="relative"
  >
    <Slider {...settings}>
      {!loading
        ? course?.map((el) => <Card {...el} key={el._id} />)
        : arr.map((el, i) => <LoadingComponent key={i} />)}
    </Slider>
  </Flex>
);
};

export default LandingPageCarousel;