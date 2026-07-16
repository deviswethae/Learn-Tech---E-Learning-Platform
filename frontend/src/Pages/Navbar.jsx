import {
  Flex,
  Box,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
  useBreakpointValue,
  Text,
  Link,
  useDisclosure,
} from "@chakra-ui/react";
import { FaSearch, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavBarDrawer } from "../components/NavBarDrawer";

/**
 * Theme — Navy scholar (matches Login / SignUp / Profile / LandingPage)
 * ------------------------------------------------
 * Ink navy       #16213E  – primary / text / CTA
 * Marginalia gold#C9971E  – accent / hover
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const GOLD = "#C9971E";

const Navbar = () => {
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const signup = () => navigate("/signup");
  const home = () => navigate("/");

  return (
    <Box>
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        px={{ base: 5, md: 8 }}
        py={3.5}
        bg={BRAND}
        boxShadow="0 4px 14px rgba(22,33,62,0.18)"
        position="fixed"
        width="100%"
        zIndex={12}
        gap={4}
      >
        {/* Logo */}
        <Text
          fontSize={{ base: "22px", md: "26px" }}
          fontWeight="800"
          color={GOLD}
          onClick={home}
          cursor="pointer"
          _hover={{ color: "white" }}
          transition="color 0.15s ease"
          flexShrink={0}
        >
          LearnTech
        </Text>

        {/* Search — desktop only */}
        {!isMobile && (
          <InputGroup maxW="440px" flex="1" mx={6}>
            <Input
              type="text"
              bg="white"
              border="none"
              fontSize="14px"
              color={BRAND}
              placeholder="What do you want to learn?"
              borderRadius="8px"
              h="42px"
              pr="42px"
              _placeholder={{ color: "gray.400" }}
              _focus={{ boxShadow: `0 0 0 2px ${GOLD}` }}
            />
            <InputRightElement h="42px">
              <IconButton
                aria-label="Search"
                icon={<FaSearch size="13px" />}
                size="sm"
                bg="transparent"
                color={BRAND}
                _hover={{ color: GOLD, bg: "transparent" }}
              />
            </InputRightElement>
          </InputGroup>
        )}

        {/* Right side — desktop */}
        {!isMobile ? (
          <Flex align="center" gap={5} flexShrink={0}>
            <Link
              href="/login"
              color="whiteAlpha.900"
              fontWeight="600"
              fontSize="15px"
              textDecoration="none"
              _hover={{ color: GOLD }}
              transition="color 0.15s ease"
            >
              Log In
            </Link>
            <Button
              bg={GOLD}
              color={BRAND}
              fontWeight="700"
              borderRadius="8px"
              px={5}
              h="40px"
              _hover={{ bg: "white", transform: "translateY(-1px)" }}
              transition="all 0.15s ease"
              onClick={signup}
            >
              Join for free
            </Button>
          </Flex>
        ) : (
          /* Right side — mobile */
          <Flex align="center" gap={2} flexShrink={0}>
            <IconButton
              aria-label="Search"
              icon={<FaSearch />}
              color={BRAND}
              bg={GOLD}
              borderRadius="7px"
              _hover={{ bg: "white" }}
            />
            <IconButton
              aria-label="Menu"
              icon={<FaBars />}
              bg="transparent"
              color="white"
              onClick={onOpen}
              fontSize="xl"
              _hover={{ color: GOLD, bg: "transparent" }}
            />
          </Flex>
        )}
      </Flex>
      <NavBarDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
};

export default Navbar;