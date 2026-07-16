import Footer from "./Footer";
import Navbar from "./Navbar";
import {
  Flex,
  Box,
  Text,
  Heading,
  Button,
  Image,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaChalkboardTeacher, FaClock, FaCertificate } from "react-icons/fa";
import teacher from "../asset/A.png";

/**
 * Theme — Navy scholar (matches Navbar / Login / SignUp / Profile)
 * ------------------------------------------------
 * Ink navy       #16213E
 * Deep navy      #0F172E
 * Marginalia gold#C9971E
 * Parchment      #F4F1E8
 * Charcoal text  #23262B
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";

const highlights = [
  { icon: FaChalkboardTeacher, text: "Expert-led courses" },
  { icon: FaClock, text: "Learn at your pace" },
  { icon: FaCertificate, text: "Earn certificates" },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Flex direction="column">
      <Navbar />

      {/* Hero */}
      <Flex
        pt={{ base: "100px", md: "130px" }}
        pb={{ base: "12", md: "16" }}
        px={{ base: "6", md: "12" }}
        justify="space-between"
        align="center"
        wrap="wrap"
        gap="10"
        maxW="1280px"
        mx="auto"
        w="100%"
      >
        <Flex
          direction="column"
          w={{ base: "100%", md: "46%" }}
          gap={5}
          textAlign={{ base: "center", md: "left" }}
          align={{ base: "center", md: "flex-start" }}
        >
          <Text
            fontSize="12px"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            color={GOLD}
          >
            Online learning, done right
          </Text>

          <Heading
            fontSize={{ base: "38px", md: "64px" }}
            fontWeight="800"
            lineHeight="1.1"
            color={BRAND}
          >
            Learn without limits
          </Heading>

          <Text fontSize="17px" color={PLUM} lineHeight="1.65" maxW="480px">
            LearnTech connects educators and students in one place — teachers
            craft courses, students learn at their own pace.
          </Text>

          <Flex gap={4} pt="2">
            <Button
              bg={GOLD}
              color={BRAND}
              fontWeight="700"
              size="lg"
              px={8}
              borderRadius="8px"
              _hover={{ bg: BRAND, color: "white", transform: "translateY(-2px)" }}
              transition="all 0.15s ease"
              onClick={() => navigate("/signup")}
            >
              Join for Free
            </Button>
            <Button
              variant="outline"
              borderColor={BRAND}
              color={BRAND}
              fontWeight="700"
              size="lg"
              px={8}
              borderRadius="8px"
              _hover={{ bg: BRAND, color: "white" }}
              transition="all 0.15s ease"
              onClick={() => navigate("/login")}
            >
              Log In
            </Button>
          </Flex>

          {/* Highlight strip */}
          <Flex gap={6} pt="6" wrap="wrap">
            {highlights.map((h) => (
              <Flex key={h.text} align="center" gap={2}>
                <Icon as={h.icon} color={GOLD} boxSize="16px" />
                <Text fontSize="13px" fontWeight="600" color={PLUM}>
                  {h.text}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Flex>

        <Flex
          w={{ base: "100%", md: "46%" }}
          justify="center"
          align="center"
        >
          <Image
            src={teacher}
            alt="LearnTech Illustration"
            maxH={{ base: "300px", md: "420px" }}
            w="auto"
            maxW="100%"
            objectFit="contain"
          />
        </Flex>
      </Flex>

      {/* CTA band */}
      <Box
        mx={{ base: "4", md: "12" }}
        mb={{ base: "14", md: "20" }}
        bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
        borderRadius="18px"
        px={{ base: "6", md: "16" }}
        py={{ base: "10", md: "12" }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          w="220px"
          h="220px"
          borderRadius="full"
          border="1px solid rgba(201,151,30,0.25)"
          right="-60px"
          top="-80px"
        />
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap="6"
          position="relative"
          zIndex="1"
        >
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading size="lg" color="white" mb="1">
              Ready to start learning?
            </Heading>
            <Text color="whiteAlpha.800" fontSize="14px">
              Free to sign up. No strings attached.
            </Text>
          </Box>
          <Button
            bg={GOLD}
            color={BRAND}
            fontWeight="700"
            size="lg"
            px={8}
            borderRadius="8px"
            _hover={{ bg: "white", transform: "translateY(-2px)" }}
            transition="all 0.15s ease"
            onClick={() => navigate("/signup")}
          >
            Join for Free
          </Button>
        </Flex>
      </Box>

      <Footer />
    </Flex>
  );
};

export default LandingPage;