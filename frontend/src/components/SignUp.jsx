import { useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import { Box, Button, Flex, Heading, Input, Spinner, Text, useToast } from "@chakra-ui/react";

import { AiOutlineEyeInvisible, AiFillEye } from "react-icons/ai";

import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import { signUpFetch } from "../Redux/UserReducer/action";
import { actionsingUpError } from "../Redux/UserReducer/actionType";

/**
 * Theme — Navy scholar (matches Navbar / LandingPage / LogIn)
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

// Success / error Toast
export const showToast = ({ toast, message, color }) => {
  toast({
    position: "top-right",
    top: "100px",
    duration: 3000,
    render: () => (
      <Box color="white" p={3} borderRadius="8px" bg={color}>
        {message || "Something Went Wrong Please Refresh"}
      </Box>
    ),
  });
};

const SignUp = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const emailbox = useRef(null);
  const passwordInput = useRef(null);
  const passwordbox = useRef(null);
  const nameInput = useRef(null);
  const namebox = useRef(null);
  const confirmPasswordInput = useRef(null);
  const confirmPasswordbox = useRef(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    isPromotion: false,
  });

  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const [isChecked, setIsChecked] = useState(false);
  const [eyeclose, seteyeMoment] = useState(false);
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
    } else if (ele === "name") {
      nameInput.current.style.display = "block";
      nameInput.current.focus();
      namebox.current.style.padding = "8px 20px";
    } else if (ele === "confirmPassword") {
      confirmPasswordInput.current.style.display = "block";
      confirmPasswordInput.current.focus();
      confirmPasswordbox.current.style.padding = "8px 20px";
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
    if (event.target === backgroundRef.current && !form.confirmPassword) {
      confirmPasswordInput.current.style.display = "none";
      confirmPasswordbox.current.style.padding = "16px 20px";
    }
    if (event.target === backgroundRef.current && !form.name) {
      nameInput.current.style.display = "none";
      namebox.current.style.padding = "16px 20px";
    }
  }

  // form management
  function handleInput(e) {
    const { value, name } = e.target;
    setForm({ ...form, [name]: value });
  }

  // see password;
  function showPassword() {
    seteyeMoment(!eyeclose);
    passwordInput.current.type === "password"
      ? (passwordInput.current.type = "text")
      : (passwordInput.current.type = "password");
  }

  // handle promotion
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    setForm({ ...form, isPromotion: !isChecked });
  };

  // SignUp function
  async function handleSignUp() {
    const { email, password, confirmPassword, name } = form;
    if (!email || !password || !confirmPassword || !name) {
      dispatch(actionsingUpError("All fields are required"));
      return;
    }

    if (confirmPassword !== password) {
      dispatch(actionsingUpError("Password does not match"));
      return;
    }

    if (password.length < 8) {
      dispatch(
        actionsingUpError("Password should be at least 8 characters long")
      );
      return;
    }

    dispatch(signUpFetch(form)).then((res) => {
      if (!userStore?.isError) {
        setForm({ email: "", password: "", confirmPassword: "", name: "" });
        showToast({ toast, message: "SignUp Successful", color: "green" });
        navigate("/login");
      } else {
        showToast({ toast, message: userStore?.isError, color: "red" });
      }
    });
  }

  return (
    <Box minH="100vh" bg={BLUSH} >
      <Navbar />

      <Flex
        minH="100vh"
        align="center"
        justify="center"
        px={{ base: "5%", md: "4" }}
        pt={{ base: "110px", md: "40px" }}
        pb={{ base: "10", md: "40px" }}
        onClick={blockInput}
        ref={backgroundRef}
        
      >
        <Box
          w={{ base: "100%", md: "920px" }}
          bg="white"
          borderRadius="18px"
          boxShadow="0 20px 50px rgba(22,33,62,0.16)"
          overflow="hidden"
          display={{ base: "block", md: "flex" }}
          mt='50px'
        >
          {/* left panel — gradient hero */}
          <Box
            flex="0 0 38%"
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            display={{ base: "none", md: "flex" }}
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
            overflow="hidden"
            py="6%"
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
                Learn without limits
              </Heading>
              <Text fontSize="14px" color="whiteAlpha.800" lineHeight="1.6">
                Create your free account and start exploring courses crafted
                by real educators, at your own pace.
              </Text>
            </Box>

            <Text position="relative" zIndex="1" fontSize="11px" color="whiteAlpha.600">
              Online learning, done right.
            </Text>
          </Box>

          {/* right panel — form */}
          <Box flex="1" p={{ base: "7%", md: "4% 8%" }} overflowY={{ base: "visible", md: "auto" }}>
            <Text
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
              mb="1"
            >
              Get started
            </Text>
            <Heading size="md" color={BRAND} mb="6">
              Sign up and start learning
            </Heading>

            {/* name */}
            <Box
              border="1.5px solid"
              borderColor="gray.200"
              borderRadius="10px"
              p="12px 20px"
              mb="8px"
              id="name"
              onClick={showInput}
              ref={namebox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Heading id="name" size="xs" fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                Name
              </Heading>
              <Input
                type="text"
                display="none"
                ref={nameInput}
                border="none"
                p="0px"
                mt="2px"
                h="auto"
                fontSize="14px"
                color={PLUM}
                focusBorderColor="transparent"
                _focus={{ outline: "none" }}
                name="name"
                value={form.name}
                onChange={handleInput}
              />
            </Box>

            {/* email */}
            <Box
              border="1.5px solid"
              borderColor="gray.200"
              borderRadius="10px"
              p="12px 20px"
              mb="8px"
              id="email"
              onClick={showInput}
              ref={emailbox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Heading id="email" size="xs" fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
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
              p="12px 20px"
              mb="8px"
              id="password"
              onClick={showInput}
              ref={passwordbox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Flex justify="space-between" align="center">
                <Box onClick={showInput} id="password" flex="1">
                  <Heading id="password" size="xs" fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                    Password
                  </Heading>
                </Box>
                <Box onClick={showPassword} color="gray.400" _hover={{ color: BRAND }} cursor="pointer">
                  {eyeclose ? <AiFillEye size="18px" /> : <AiOutlineEyeInvisible size="18px" />}
                </Box>
              </Flex>
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

            {/* confirm password */}
            <Box
              border="1.5px solid"
              borderColor="gray.200"
              borderRadius="10px"
              p="12px 20px"
              mb="4px"
              id="confirmPassword"
              onClick={showInput}
              ref={confirmPasswordbox}
              transition="border-color 0.15s ease"
              _hover={{ borderColor: GOLD }}
            >
              <Heading id="confirmPassword" size="xs" fontSize="11px" letterSpacing="0.06em" textTransform="uppercase" color={GOLD} fontWeight="700">
                Confirm Password
              </Heading>
              <Input
                type="password"
                display="none"
                ref={confirmPasswordInput}
                border="none"
                p="0px"
                mt="2px"
                h="auto"
                fontSize="14px"
                color={PLUM}
                focusBorderColor="transparent"
                _focus={{ outline: "none" }}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleInput}
              />
            </Box>

            <Flex align="center" mt="3">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                style={{ accentColor: GOLD, width: "15px", height: "15px", cursor: "pointer" }}
              />
              <Text fontSize="12.5px" color="gray.500" ml="10px" lineHeight="1.5">
                Send me special offers, personalized recommendations, and
                learning tips.
              </Text>
            </Flex>

            <Box mt="4">
              <Button
                w="100%"
                h="44px"
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
                onClick={handleSignUp}
              >
                {userStore.loading ? <Spinner color="white" size="sm" /> : "Sign Up"}
              </Button>
            </Box>

            <Flex mt="4" fontSize="13px" color="gray.500">
              <Text>Already have an account?</Text>
              <Link to="/login">
                <Text fontWeight="700" ml="1.5" color={GOLD} _hover={{ color: BRAND }}>
                  Log in
                </Text>
              </Link>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default SignUp;