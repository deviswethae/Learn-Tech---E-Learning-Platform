import { useState, useEffect } from "react";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Grid,
  Heading,
  Image,
  Progress,
  ScaleFade,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckCircleIcon, CheckIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";
import Payment from "../../Pages/Payment/Payment";
import SingleAbsolute from "./SingleAbsolute";
import SingleList from "./SingleList";
import convertDateFormat from "../../Redux/AdminReducer/action";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";

const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";  

const baseURL = "https://learn-tech-e-learning-platform-backend.onrender.com/";

export default function SinglePage() {
  const [res, setRes] = useState({});
  const [progress, setProgress] = useState({
    watchedVideos: [],
    total: 0,
    watched: 0,
    percent: 0,
    completed: false,
  });
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getSinglePageData = (courseId) => {
    const token = userStore?.token;
    fetch(`${baseURL}/videos/courseVideos/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((data) => setRes(data))
      .catch((err) => console.log(err));
  };

  // ---- Backend-driven progress -------------------------------------
  const getProgress = async () => {
    try {
      const token = userStore?.token;
      const r = await fetch(`${baseURL}/progress/${id}`, {
        headers: { authorization: `Bearer ${token}` },
      });
      const data = await r.json();
      setProgress({
        watchedVideos: data.watchedVideos || [],
        total: data.total || 0,
        watched: data.watched || 0,
        percent: data.percent || 0,
        completed: data.completed || false,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const isWatched = (videoId) => progress.watchedVideos.includes(videoId);

  const markWatched = async (videoId) => {
    if (isWatched(videoId)) return;
    try {
      const token = userStore?.token;
      const r = await fetch(`${baseURL}/progress/markWatched`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId: id, videoId }),
      });
      const data = await r.json();
      setProgress((prev) => ({
        ...prev,
        watchedVideos: [...prev.watchedVideos, videoId],
        watched: data.watched,
        total: data.total,
        percent: data.percent,
        completed: data.completed,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Gated: unsubscribed users get redirected to the subscribe modal
  // instead of the actual video link.
  const handleVideoOpen = (video) => {
    if (!isEnrolled) {
      onOpen();
      return;
    }
    markWatched(video._id || video.id);
    window.open(video.link, "_blank");
  };
  // --------------------------------------------------------------------

  // ---- Enrollment check -----------------------------------------------
  const checkEnrollment = async () => {
    if (!userStore?.userId) return;
    try {
      const r = await fetch(`${baseURL}/users/userCourse/${userStore.userId}`);
      const data = await r.json();
      const enrolled = (data.course || []).some((c) => c._id === id);
      setIsEnrolled(enrolled);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePaymentClose = () => {
    onClose();
    checkEnrollment();
  };
  // --------------------------------------------------------------------

  useEffect(() => {
    getSinglePageData(id);
  }, [id]);

  useEffect(() => {
    if (userStore?.userId) {
      getProgress();
      checkEnrollment();
    }
  }, [id, userStore?.userId]);

  const heroHighlights =
    res?.course?.highlights?.length > 0
      ? res.course.highlights.slice(0, 3)
      : [
          "Core concepts explained step by step",
          "Hands-on projects you can add to your portfolio",
          "Practical skills you can apply immediately",
        ];

  const totalVideos = progress.total || res?.course?.videos?.length || 0;
  const watchedCount = progress.watched || 0;
  const progressPercent = progress.percent || 0;

  return (
    <Box bg={BLUSH} minH="100vh">
      <Navbar />
      <div className="w-full flex justify-center items-center flex-col">
        {/* ---------------- Hero ---------------- */}
        <Box
          w="100%"
          bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
          display="flex"
          justifyContent="center"
          position="relative"
          overflow="hidden"
          pt="100px"
          pb="10"
        >
          <Box
            position="absolute"
            w="320px"
            h="320px"
            borderRadius="full"
            border="1px solid rgba(201,151,30,0.25)"
            right="-80px"
            top="-120px"
          />
          <Box
            position="absolute"
            w="220px"
            h="220px"
            borderRadius="full"
            border="1px solid rgba(201,151,30,0.15)"
            right="20px"
            bottom="-100px"
          />

          <Box
            className="px-4 w-full max-w-[1100px] mx-auto"
            position="relative"
            zIndex="1"
          >
            {/* Always render as a 2-column layout: info on the left,
                enrollment/progress card on the right, at every breakpoint. */}
            <div className="flex flex-row space-x-4 items-start">
              <Box className="my-8" flex="1" minW="0">
                <Box color="white" width="100%" fontFamily="sans-serif">
                  <Box className="space-y-2">
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      letterSpacing="0.14em"
                      textTransform="uppercase"
                      color={GOLD}
                      textAlign="left"
                    >
                      Course
                    </Text>
                    <Text fontSize="2rem" fontWeight="bold" textAlign="left">
                      {res?.course?.title || "Course Name"}
                    </Text>
                    <Box
                      className="text-[16px] font-thin w-40vw"
                      color="whiteAlpha.800"
                      textAlign="left"
                    >
                      {res?.course?.description}
                    </Box>

                    <Box
                      bg="whiteAlpha.300"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      borderRadius="10px"
                      p="3"
                      maxW="420px"
                    >
                      <Text
                        fontSize="10px"
                        fontWeight="700"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color={GOLD}
                        mb="2"
                        textAlign="left"
                      >
                        What you'll learn
                      </Text>
                      <Stack spacing="1.5">
                        {heroHighlights.map((point, i) => (
                          <Flex key={i} align="flex-start" gap="2">
                            <Flex
                              align="center"
                              justify="center"
                              boxSize="16px"
                              minW="16px"
                              mt="1px"
                              borderRadius="full"
                              bg={GOLD}
                              color={BRAND}
                            >
                              <CheckIcon boxSize="2.5" />
                            </Flex>
                            <Text fontSize="12px" color="whiteAlpha.900" lineHeight="1.4">
                              {point}
                            </Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Box>

                    <Box className="rating space-x-2 flex fontWeight-5px">
                      <Box color={GOLD} className="text-xs" fontWeight="700">
                        4.8
                      </Box>
                      <Box className="text-[11px]">⭐⭐⭐⭐</Box>
                      <Box className="flex text-[12px] space-x-2" color="whiteAlpha.800">
                        <Box color={GOLD}>(128 ratings)</Box>
                        <Box>35 students</Box>
                      </Box>
                    </Box>
                    <Box className="createdby space-x-2 flex" color="whiteAlpha.800">
                      <Box className="text-[12px]">Created by</Box>
                      <Box color={GOLD} className="text-[12px] underline">
                        {res?.course?.teacher}
                      </Box>
                    </Box>
                    <Box className="text-[12px] space-x-4 flex" color="whiteAlpha.700">
                      <Box>🌗 Last updated 3/2025</Box>
                      <Box>🌐 English</Box>
                      <Box className="flex">
                        ⌨️ English [Auto], {" , "}
                        <Box color={GOLD}>12 more</Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <div
                className="mt-6 flex-shrink-0"
                style={{ width: "320px", minWidth: "260px" }}
              >
                <SingleAbsolute
                  props={{ ...res?.course, onOpen, onClose: handlePaymentClose, isEnrolled }}
                />
              </div>
            </div>
          </Box>
        </Box>

        {/* ---------------- Course info + progress card ---------------- */}
        <Box
          mt="1.5rem"
          bg="white"
          w="95%"
          maxW="1000px"
          borderRadius="16px"
          boxShadow="0 20px 50px rgba(22,33,62,0.12)"
          overflow="hidden"
        >
          <Box
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            px={{ base: "5%", md: "3%" }}
            py="5"
          >
            <Text
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
              textAlign="left"
            >
              Course overview
            </Text>
            <Heading size="md" color="white" mt="1" fontWeight="700" textAlign="left">
              {capitalizeFirstLetter(res?.course?.title) || "Course Name"}
            </Heading>
          </Box>

          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
            gap="0"
            borderBottom="1px solid"
            borderColor={BLUSH}
          >
            <Box p={{ base: "5%", md: "4%" }} borderRight={{ md: "1px solid" }} borderColor={BLUSH} textAlign="left">
              <Text fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                Teacher
              </Text>
              <Text color={PLUM} fontWeight="600" mt="1">
                {capitalizeFirstLetter(res?.course?.teacher) || "Teacher Name"}
              </Text>
            </Box>
            <Box p={{ base: "5%", md: "4%" }} borderRight={{ md: "1px solid" }} borderColor={BLUSH} textAlign="left">
              <Text fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                Course created
              </Text>
              <Text color={PLUM} fontWeight="600" mt="1">
                {convertDateFormat(res?.course?.createdAt)}
              </Text>
            </Box>
            <Box p={{ base: "5%", md: "4%" }} textAlign="left">
              <Text fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                Total videos
              </Text>
              <Text color={PLUM} fontWeight="600" mt="1">
                {totalVideos}
              </Text>
            </Box>
          </Grid>

          {/* ---- Your progress ---- */}
          <Box p={{ base: "5%", md: "3%" }}>
            <Flex justify="space-between" align="center" mb="2" flexWrap="wrap" gap="2">
              <Flex align="center" gap="2">
                <Text fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                  Your progress
                </Text>
                <Badge
                  borderRadius="full"
                  px="2.5"
                  py="0.5"
                  fontSize="9px"
                  letterSpacing="0.04em"
                  bg={
                    progressPercent === 100
                      ? GOLD
                      : progressPercent > 0
                      ? BRAND
                      : "gray.200"
                  }
                  color={progressPercent > 0 ? "white" : "gray.500"}
                  transition="all 0.2s ease"
                >
                  {progressPercent === 100
                    ? "Completed"
                    : progressPercent > 0
                    ? "In progress"
                    : "Not started"}
                </Badge>
              </Flex>
              <Text fontSize="sm" color={PLUM} fontWeight="700">
                {watchedCount}/{totalVideos} watched · {progressPercent}%
              </Text>
            </Flex>
            <Progress
              value={progressPercent}
              size="sm"
              borderRadius="full"
              bg={BLUSH}
              transition="width 0.4s ease"
              sx={{
                "& > div": {
                  background: `linear-gradient(90deg, ${GOLD}, ${BRAND})`,
                  transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            />

            {totalVideos > 0 && progressPercent === 100 && (
              <ScaleFade in={progressPercent === 100} initialScale={0.9}>
                <Text fontSize="xs" color={GOLD} fontWeight="700" mt="2">
                  🎉 Course complete — nice work!
                </Text>
              </ScaleFade>
            )}

            {/* ---- Quiz CTA ---- */}
            <Flex
              mt="5"
              justify="space-between"
              align="center"
              bg={BLUSH}
              borderRadius="10px"
              p="4"
              flexWrap="wrap"
              gap="3"
            >
              <Flex align="center" gap="3">
                <Flex
                  align="center"
                  justify="center"
                  boxSize="34px"
                  borderRadius="full"
                  bg={progressPercent === 100 ? GOLD : "gray.200"}
                  color={progressPercent === 100 ? BRAND : "gray.500"}
                  transition="all 0.2s ease"
                >
                  {progressPercent === 100 ? (
                    <UnlockIcon boxSize="4" />
                  ) : (
                    <LockIcon boxSize="4" />
                  )}
                </Flex>
                <Box textAlign="left">
                  <Text fontWeight="700" color={PLUM} fontSize="sm">
                    Course quiz
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {progressPercent === 100
                      ? "You're all set — test what you've learned."
                      : "Finish all videos to unlock the quiz."}
                  </Text>
                </Box>
              </Flex>

              <Tooltip
                isDisabled={progressPercent === 100}
                label="Watch every video to unlock the quiz"
                hasArrow
              >
                <Button
                  bg={progressPercent === 100 ? BRAND : "gray.300"}
                  color="white"
                  borderRadius="8px"
                  isDisabled={progressPercent !== 100}
                  _hover={
                    progressPercent === 100
                      ? {
                          bg: GOLD,
                          color: BRAND,
                          transform: "translateY(-1px)",
                          boxShadow: "0 6px 16px rgba(201,151,30,0.35)",
                        }
                      : {}
                  }
                  transition="all 0.15s ease"
                  onClick={() => navigate(`/quiz/${id}`)}
                >
                  Complete Quiz
                </Button>
              </Tooltip>
            </Flex>
          </Box>
        </Box>

        {/* ---------------- Video list ---------------- */}
        {res?.course?.videos?.length ? (
          <Box mt="40px" w="95%" maxW="1000px">
            {res?.course?.videos?.map((video, index) => {
              const watched = isWatched(video._id || video.id);
              return (
                <Card
                  key={video._id || index}
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  border="1.5px solid"
                  borderColor={watched ? GOLD : "gray.200"}
                  borderRadius="12px"
                  m="0 0 15px 0"
                  bg="white"
                  boxShadow="0 6px 18px rgba(22,33,62,0.06)"
                  transition="all 0.2s ease"
                  _hover={{
                    boxShadow: "0 12px 28px rgba(22,33,62,0.14)",
                    transform: "translateY(-2px)",
                  }}
                >
                  <Box
                    onClick={() => handleVideoOpen(video)}
                    position="relative"
                    w={{ base: "100%", sm: "20vw" }}
                    p="1rem"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ cursor: "pointer" }}
                  >
                    <Image
                      w="100%"
                      borderRadius="8px"
                      src={video?.img || ""}
                      alt={video?.title}
                      transition="transform 0.25s ease"
                      _groupHover={{ transform: "scale(1.03)" }}
                      filter={!isEnrolled ? "blur(2px) brightness(0.7)" : "none"}
                    />
                    {!isEnrolled && (
                      <Flex
                        position="absolute"
                        inset="1rem"
                        align="center"
                        justify="center"
                        borderRadius="8px"
                      >
                        <Flex
                          align="center"
                          justify="center"
                          boxSize="44px"
                          borderRadius="full"
                          bg="whiteAlpha.900"
                          boxShadow="0 4px 12px rgba(0,0,0,0.3)"
                        >
                          <LockIcon color={BRAND} boxSize="5" />
                        </Flex>
                      </Flex>
                    )}
                    {isEnrolled && watched && (
                      <ScaleFade in={watched} initialScale={0.6}>
                        <Box
                          position="absolute"
                          top="1.4rem"
                          right="1.4rem"
                          bg="white"
                          borderRadius="full"
                          boxShadow="0 2px 6px rgba(0,0,0,0.2)"
                        >
                          <CheckCircleIcon color={GOLD} boxSize="6" />
                        </Box>
                      </ScaleFade>
                    )}
                  </Box>
                  <Stack flex="1">
                    <CardBody textAlign="left">
                      <Flex justify="space-between" align="flex-start">
                        <Heading size="md" color={PLUM}>
                          {video?.title || "Video Name"}
                        </Heading>
                        {isEnrolled && watched && (
                          <Badge
                            bg={GOLD}
                            color={BRAND}
                            fontSize="10px"
                            fontWeight="700"
                            px="2.5"
                            py="1"
                            borderRadius="full"
                            whiteSpace="nowrap"
                            ml="2"
                          >
                            Watched
                          </Badge>
                        )}
                      </Flex>
                      <Text py="2" color="gray.600">
                        {video.description}
                      </Text>
                      <Text size="12px" color="gray.600">
                        <Text fontWeight="bold" display="inline" mr="5px" color={PLUM}>
                          Instructor:
                        </Text>
                        {capitalizeFirstLetter(video?.teacher) || "Teacher Name"}
                      </Text>
                      <Text size="12px" color="gray.600">
                        <Text fontWeight="bold" display="inline" mr="5px" color={PLUM}>
                          Date:
                        </Text>
                        {convertDateFormat(video?.createdAt)}
                      </Text>
                      <Flex justify="space-between" align="center" mt="1">
                        <Text color="gray.600">
                          <Text fontWeight="bold" display="inline" mr="5px" color={PLUM}>
                            Views:
                          </Text>
                          {video?.views || 0}
                        </Text>
                        <Button
                          size="sm"
                          leftIcon={!isEnrolled ? <LockIcon boxSize="3" /> : undefined}
                          bg={!isEnrolled ? "gray.200" : watched ? BLUSH : BRAND}
                          color={!isEnrolled ? "gray.600" : watched ? PLUM : "white"}
                          borderRadius="7px"
                          _hover={{ bg: GOLD, color: BRAND }}
                          onClick={() => handleVideoOpen(video)}
                        >
                          {!isEnrolled ? "Subscribe to watch" : watched ? "Watch again" : "Watch now"}
                        </Button>
                      </Flex>
                    </CardBody>
                  </Stack>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Box
            mt="3rem"
            w="95%"
            maxW="1000px"
            bg="white"
            borderRadius="12px"
            border="1px dashed"
            borderColor="gray.300"
            p="6"
            mb="1rem"
            textAlign="center"
          >
            <Text fontSize="1.1rem" fontWeight="bold" color={PLUM}>
              We are working on the content of this course.
            </Text>
            <Text fontSize="sm" color="gray.500" mt="1">
              Videos will be available soon.
            </Text>
          </Box>
        )}

        <Payment isOpen={isOpen} onOpen={onOpen} onClose={handlePaymentClose} />
        <Footer />
      </div>
    </Box>
  );
}
