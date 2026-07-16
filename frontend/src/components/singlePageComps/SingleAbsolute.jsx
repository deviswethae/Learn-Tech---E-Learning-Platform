import { Box, Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

const BRAND = "#16213E";
const GOLD = "#C9971E";
const PLUM = "#23262B";

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);

  const { onOpen, img, isEnrolled } = props;

  function handlePayment() {
    onOpen();
  }

  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  return (
    <Box
      bg="white"
      borderRadius="14px"
      overflow="hidden"
      boxShadow="0 20px 50px rgba(22,33,62,0.25)"
      w={{ base: "100%", xl: "320px" }}
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ boxShadow: "0 24px 60px rgba(22,33,62,0.35)" }}
    >
      {/* thumbnail — unchanged */}
      <Box position="relative">
        <Image src={img} w="100%" h="180px" objectFit="cover" />
        <Box
          position="absolute"
          top="10px"
          right="10px"
          bg={GOLD}
          color={BRAND}
          fontSize="10px"
          fontWeight="700"
          px="2.5"
          py="1"
          borderRadius="full"
        >
          {isEnrolled ? "Enrolled" : `${random}% off today`}
        </Box>
      </Box>

      {/* tabs — unchanged, still shown regardless of enrollment */}
      <Box display="flex" justifyContent="space-around" fontWeight="600" fontSize="sm" h="46px" borderBottom="1px solid" borderColor="gray.100">
        <Box
          onClick={() => setPage("left")}
          cursor="pointer"
          w="100%"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={page === "left" ? BRAND : "gray.400"}
          borderBottom="3px solid"
          borderColor={page === "left" ? GOLD : "transparent"}
          transition="all 0.2s ease"
          _hover={{ color: BRAND }}
        >
          Personal
        </Box>
        <Box
          onClick={() => setPage("right")}
          cursor="pointer"
          w="100%"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={page === "right" ? BRAND : "gray.400"}
          borderBottom="3px solid"
          borderColor={page === "right" ? GOLD : "transparent"}
          transition="all 0.2s ease"
          _hover={{ color: BRAND }}
        >
          Teams
        </Box>
      </Box>

      {/* bottom box — only this part changes based on enrollment */}
      <Box p="6">
        {isEnrolled ? (
          <>
            <Flex align="center" gap="2" mb="2">
              <CheckCircleIcon color={GOLD} boxSize="5" />
              <Heading size="sm" color={PLUM}>
                You're subscribed
              </Heading>
            </Flex>
            <Text fontSize="12px" color="gray.500" mb="4" textAlign="left">
              Scroll down to continue watching and track your progress.
            </Text>
            <Button
              w="100%"
              h="44px"
              bg={BRAND}
              color="white"
              borderRadius="8px"
              fontWeight="700"
              isDisabled
              opacity="0.85"
              cursor="default"
            >
              Enrolled ✓
            </Button>
          </>
        ) : (
          <>
            <Heading size="sm" color={PLUM} mb="2" textAlign="left">
              {page === "left"
                ? "Subscribe to SRM's top courses"
                : "Bring this course to your team"}
            </Heading>
            <Text fontSize="12px" color="gray.500" mb="4" textAlign="left">
              {page === "left"
                ? "Get this course, plus 8,000+ of our top-rated courses with Personal Plan."
                : "Give your whole team access with centralized billing and progress tracking."}
            </Text>
            <Button
              w="100%"
              h="44px"
              bg={BRAND}
              color="white"
              borderRadius="8px"
              fontWeight="700"
              transition="all 0.15s ease"
              _hover={{
                bg: GOLD,
                color: BRAND,
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(201,151,30,0.35)",
              }}
              _active={{ transform: "translateY(0)" }}
              onClick={handlePayment}
            >
              {page === "left" ? "Start subscription" : "Get team access"}
            </Button>
            <Text fontSize="10px" color="gray.400" textAlign="center" mt="3">
              30-day money-back guarantee
            </Text>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SingleAbsolute;