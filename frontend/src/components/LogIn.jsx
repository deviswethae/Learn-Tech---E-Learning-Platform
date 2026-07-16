import { useEffect, useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import { Box, Button, Flex, Heading, Input, Spinner, Text, useToast } from "@chakra-ui/react";

import { useDispatch, useSelector } from "react-redux";
import { loginFetch } from "../Redux/UserReducer/action";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./SignUp";

/**
 * Theme — Navy scholar (matches Navbar / LandingPage / SignUp)
 * ------------------------------------------------
 * Ink navy       #16213E  – hero panel / CTA
 * Deep navy      #0F172E  – gradient partner
 * Marginalia gold#C9971E  – accent / focus ring / CTA
 * Parchment      #F4F1E8  – page wash
 * Charcoal text  #23262B  – headings on light bg
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";

const Login = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const emailbox = useRef(null);
  const passwordInput = useRef(null);
  const passwordbox = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // will show the input element when click on element
  function showInput(e) {
    const ele = e.target.id;
    if (ele === "email") {
      emailInput.current.style.display = "block";
      emailInput.current.focus();
      emailbox.current.style.padding = "8px 20px";
    } else if (ele === "password") {
      passwordInput.current.style.display = "block";
      passwordInput.current.focus();
      passwordbox.current.style.padding = "8px 20px";
    }
  }

  // will block the input element when click on backgrond
  function blockInput(event) {
    if (event.target === backgroundRef.current && !form.email) {
      emailInput.current.style.display = "none";
      emailbox.current.style.padding = "16px 20px";
    }
    if (event.target === backgroundRef.current && !form.password) {
      passwordInput.current.style.display = "none";
      passwordbox.current.style.padding = "16px 20px";
    }
  }

  // form management
  function handleInput(e) {
    const { value, name } = e.target;
    if (name === "email") {
      setForm({ ...form, email: value });
    } else {
      setForm({ ...form, password: value });
    }
  }

  // login function
  function handleLogin() {
    dispatch(loginFetch(form)).then((res) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.message) {
        showToast({ toast, message: "Login Successful", color: "green" });
        setForm({ email: "", password: "" });
      } else {
        showToast({ toast, message: userStore?.isError, color: "red" });
      }
    });
  }

  useEffect(() => {
    // if isAuth is true move to dashboard;
    if (userStore.isAuth) {
      if (userStore?.role === "user") {
        navigate("/home");
      } else if (userStore?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userStore?.role === "teacher") {
        navigate("/TeacherDashboard");
      }
    }
  }, [userStore?.isAuth, userStore?.role]);

  return (
    <Box minH="100vh" bg={BLUSH}>
      <Navbar />

      <Flex
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: "5%", md: "4" }}
        pt={{ base: "110px", md: "0" }}
        pb={{ base: "10", md: "0" }}
        onClick={blockInput}
        ref={backgroundRef}
      >
        <Box
          w={{ base: "100%", md: "860px" }}
          bg="white"
          borderRadius="18px"
          boxShadow="0 20px 50px rgba(22,33,62,0.16)"
          overflow="hidden"
          display={{ base: "block", md: "flex" }}
          mt='40px'
        >
          {/* left panel — gradient hero */}
          <Box
            flex="0 0 40%"
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
            overflow="hidden"
            py="10%"
            px="9%"
          >
            <Box
              position="absolute"
              w="220px"
              h="220px"
              borderRadius="full"
              border="1px solid rgba(201,151,30,0.3)"
              left="50%"
              top="50%"
              transform="translate(-50%,-50%)"
            />
            <Box
              position="absolute"
              w="300px"
              h="300px"
              borderRadius="full"
              border="1px solid rgba(201,151,30,0.15)"
              left="50%"
              top="50%"
              transform="translate(-50%,-50%)"
            />

            <Text
              position="relative"
              zIndex="1"
              fontSize="24px"
              fontWeight="800"
              color={GOLD}
            >
              LearnTech
            </Text>

            <Box position="relative" zIndex="1">
              <Heading size="md" color="white" mb="3">
                Welcome back
              </Heading>
              <Text fontSize="14px" color="whiteAlpha.800" lineHeight="1.6">
                Log in to pick up where you left off — your courses and
                progress are right where you left them.
              </Text>
            </Box>

            <Text position="relative" zIndex="1" fontSize="11px" color="whiteAlpha.600">
              Online learning, done right.
            </Text>
          </Box>

          {/* right panel — form */}
          <Box flex="1" p={{ base: "8%", md: "8% 9%" }}>
            <Text
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
              mb="2"
            >
              Sign in
            </Text>
            <Heading size="md" color={BRAND} mb="7">
              Log in to your account
            </Heading>

            {/* email */}
            <Box
              border="1.5px solid"
              borderColor="gray.200"
              borderRadius="10px"
              p="16px 20px"
              mb="12px"
              id="email"
              onClick={showInput}
              ref={emailbox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Heading
                id="email"
                size="xs"
                fontSize="11px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={GOLD}
                fontWeight="700"
              >
                Email
              </Heading>
              <Input
                display="none"
                ref={emailInput}
                border="none"
                p="0px"
                mt="2px"
                h="auto"
                fontSize="14px"
                color={PLUM}
                focusBorderColor="transparent"
                _focus={{ outline: "none" }}
                name="email"
                value={form.email}
                onChange={handleInput}
              />
            </Box>

            {/* password */}
            <Box
              border="1.5px solid"
              borderColor="gray.200"
              borderRadius="10px"
              p="16px 20px"
              mb="6px"
              id="password"
              onClick={showInput}
              ref={passwordbox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Heading
                id="password"
                size="xs"
                fontSize="11px"
                letterSpacing="0.06em"
                textTransform="uppercase"
                color={GOLD}
                fontWeight="700"
              >
                Password
              </Heading>
              <Input
                type="password"
                display="none"
                ref={passwordInput}
                border="none"
                p="0px"
                mt="2px"
                h="auto"
                fontSize="14px"
                color={PLUM}
                focusBorderColor="transparent"
                _focus={{ outline: "none" }}
                name="password"
                value={form.password}
                onChange={handleInput}
              />
            </Box>

            <Flex mt="4" mb="6" fontSize="13px" color="gray.500">
              <Text>Don't have an account?</Text>
              <Link to="/signup">
                <Text fontWeight="700" ml="1.5" color={GOLD} _hover={{ color: BRAND }}>
                  Sign up
                </Text>
              </Link>
            </Flex>

            <Button
              w="100%"
              h="48px"
              color="white"
              bg={BRAND}
              _hover={{
                bg: GOLD,
                color: BRAND,
                boxShadow: `0 6px 20px rgba(201,151,30,0.35)`,
                transform: "translateY(-1px)",
              }}
              _active={{ transform: "translateY(0)" }}
              borderRadius="8px"
              transition="all 0.15s ease"
              onClick={handleLogin}
            >
              {userStore.loading ? <Spinner color="white" size="sm" /> : "Log in"}
            </Button>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default Login;