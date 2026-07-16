import { useState } from "react";
import {
  Flex,
  Box,
  Input,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import Dropdown from "./Dropdown";
import { useLocation, useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../NavBarDrawer";
import { showToast } from "../SignUp";

/**
 * Theme — Navy scholar (matches Login / SignUp / Profile / Navbar)
 * ------------------------------------------------
 * Ink navy       #16213E  – primary / text / CTA
 * Marginalia gold#C9971E  – accent / hover
 * Parchment      #FAF7F0  – navbar background
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const GOLD = "#C9971E";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [showSearchBar, setShowSearchBar] = useState(false);
  const toast = useToast();
  const location = useLocation();
  function home() {
    navigate("/home");
  }

  function handleShowSearchBar() {
    setShowSearchBar(!showSearchBar);
    if (showSearchBar && location.pathname === "/home") {
      showToast({
        toast,
        message: `Below is you search Result`,
        color: "green",
      });
    }
  }

  return (
    <Box>
<Flex
  as="nav"
  align="center"
  justify="space-between"
  px={{ base: 4, md: 8 }}
  py={3}
  bg="white"
  position="fixed"
  top="0"
  w="100%"
  zIndex="1000"
  boxShadow="sm"
  borderBottom="1px solid #E2E8F0"
>
<Text
  fontSize="32px"
  fontWeight="900"
  cursor="pointer"
  onClick={home}
>
  <Box as="span" color={BRAND}>
    Learn
  </Box>
  <Box as="span" color={GOLD}>
    Tech
  </Box>
</Text>
  {/* Desktop */}
  {!isMobile && (
    <Flex align="center" gap={6} flex="1" ml={10} justify='center'>
     

      {/* Search */}
      <Flex
        flex="1"
        maxW="400px"
        bg="#F5F7FA"
        borderRadius="50px"
        overflow="hidden"
        
        border="1px solid #E2E8F0"
      >
        <Input
          placeholder="Search for courses..."
          border="none"
          bg="transparent"
          _focus={{
            boxShadow: "none",
          }}
        />

        <IconButton
          aria-label="Search"
          icon={<FaSearch />}
          bg={BRAND}
          color="white"
          borderRadius="0"
          px={8}
          _hover={{
            bg: GOLD,
            color: BRAND,
          }}
        />
      </Flex>
    </Flex>
  )}

  {/* Right Side */}
  {!isMobile && (
    <Flex align="center" gap={5} ml={8}>
      {user.role !== "teacher" &&
        user.role !== "admin" && (
          <Link
            href="/Teachme"
            fontWeight="600"
            color="gray.700"
            _hover={{
              color: BRAND,
              textDecoration: "none",
            }}
          >
            Teach on LearnTech
          </Link>
        )}

      <Dropdown />
    </Flex>
  )}

  {/* Mobile */}
  {isMobile && (
    <IconButton
      aria-label="Menu"
      icon={<FaBars />}
      bg="transparent"
      color={BRAND}
      fontSize="22px"
      onClick={onOpen}
      _hover={{
        bg:"transparent",
        color:{GOLD},
      }}
    />
  )}
</Flex>
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;