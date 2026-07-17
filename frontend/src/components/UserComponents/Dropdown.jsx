import {
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Flex,
  Text,
  Heading,
} from "@chakra-ui/react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actionUserLogout } from "../../Redux/UserReducer/actionType";
import { BiUserCircle } from "react-icons/bi";
import { FaUserShield } from "react-icons/fa";
import { FiMoreVertical, FiChevronRight } from "react-icons/fi";
import { capitalizeFirstLetter } from "../../Redux/UserReducer/action";

/**
 * Theme — Navy scholar (matches ProfilePage / AddCourse / EditPage / Courses)
 * ------------------------------------------------
 * Ink navy       #16213E  – primary / header / CTA
 * Deep navy      #0F172E  – gradient partner / darkest
 * Marginalia gold#C9971E  – accent / focus ring
 * Parchment      #FAF7F0  – page wash
 * Charcoal text  #23262B  – headings on light bg
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";

const NavItem = ({ to, children }) => (
  <Link to={to}>
    <MenuItem
      px="0"
      py="10px"
      fontWeight="600"
      fontSize="14px"
      color={PLUM}
      bg="transparent"
      borderRadius="8px"
      _hover={{ bg: "rgba(201,151,30,0.1)", color: BRAND, px: "10px" }}
      _focus={{ bg: "rgba(201,151,30,0.1)" }}
      transition="all 0.15s ease"
      icon={<FiChevronRight color={GOLD} />}
    >
      {children}
    </MenuItem>
  </Link>
);

const roleLinks = {
  user: [{ to: "/home", label: "Dashboard" ,},

  ],
  admin: [
    { to: "/home", label: "User Dashboard" },
    { to: "/admin/dashboard", label: "Admin Dashboard" },
    { to: "/admin/courses", label: "Courses" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/Add", label: "Add videos" },
    { to: "/admin/videos", label: "All videos" },
  ],
  teacher: [
    { to: "/home", label: "User Dashboard" },
    { to: "/TeacherDashboard", label: "Teacher Dashboard" },
    { to: "/Teacher/courses", label: "Courses" },
    { to: "/Teacher/add", label: "Add videos" },
  ],
};

const Dropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.UserReducer);
  const role = userStore?.role;

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogoutClick = () => {
    const token = userStore?.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post("https://learn-tech-e-learning-platform-backend.onrender.com/users/logout", {}, { headers })
      .then(() => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: "",
            name: "",
            role: "",
            token: "",
            isAuth: "",
            isError: "",
            loading: false,
            success: false,
            isUser: false,
            userId: "",
            place: "",
            age: "",
          })
        );
        dispatch(actionUserLogout());
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box>
      <Menu>
        <MenuButton
          as={Button}
          bg={BRAND}
          color="white"
          borderRadius="8px"
          fontWeight="700"
          fontSize="14px"
          h="42px"
          px="5"
          _hover={{
            bg: GOLD,
            color: BRAND,
            boxShadow: "0 6px 20px rgba(201,151,30,0.35)",
          }}
          _active={{ bg: GOLD, color: BRAND }}
          transition="all 0.15s ease"
        >
          <Flex alignItems="center">
            <Text>Profile</Text>
            <Box ml="0.3rem" display="flex" alignItems="center">
              <FiMoreVertical />
            </Box>
          </Flex>
        </MenuButton>

        <MenuList
          p="0"
          w={{ base: "90vw", sm: "340px" }}
          maxH={role === "admin" ? "85vh" : "auto"}
          overflowY={role === "admin" ? "auto" : "visible"}
          borderRadius="14px"
          border="none"
          boxShadow="0 20px 50px rgba(22,33,62,0.25)"
          overflow="hidden"
        >
          {/* identity header — gradient panel */}
          <Box
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            px="5"
            py="5"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              w="160px"
              h="160px"
              borderRadius="full"
              border="1px solid rgba(201,151,30,0.25)"
              right="-50px"
              top="-70px"
            />
            <Flex justify="space-between" align="center" position="relative" zIndex="1">
              <Flex alignItems="center">
                <Box
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  bg="white"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="2px solid"
                  borderColor={GOLD}
                  flexShrink="0"
                >
                  {role === "admin" || role === "teacher" ? (
                    <FaUserShield size="1.1rem" color={BRAND} />
                  ) : (
                    <BiUserCircle size="1.4rem" color={BRAND} />
                  )}
                </Box>
                <Box ml="3">
                  <Heading size="sm" color="white" fontWeight="700">
                    {capitalizeFirstLetter(userStore?.name)}
                  </Heading>
                  <Text fontSize="10px" fontWeight="700" letterSpacing="0.06em" textTransform="uppercase" color={GOLD}>
                    {capitalizeFirstLetter(role)}
                  </Text>
                </Box>
              </Flex>
              <Button
                size="sm"
                bg={GOLD}
                color={BRAND}
                fontWeight="700"
                borderRadius="7px"
                _hover={{ bg: "white" }}
                onClick={handleLogoutClick}
              >
                Logout
              </Button>
            </Flex>
          </Box>

          {/* menu body */}
          <Box p="4" bg="white">
            {role === "user" && (
              <Box>
                <MenuItem
                  px="0"
                  py="10px"
                  fontWeight="600"
                  fontSize="14px"
                  color={PLUM}
                  onClick={handleProfileClick}
                  bg="transparent"
                  borderRadius="8px"
                  _hover={{ bg: "rgba(201,151,30,0.1)", color: BRAND, px: "10px" }}
                  transition="all 0.15s ease"
                  icon={<FiChevronRight color={GOLD} />}
                >
                  Your account
                </MenuItem>
                {roleLinks.user.map((item) => (
                  <NavItem key={item.to} to={item.to}>
                    {item.label}
                  </NavItem>
                ))}
              </Box>
            )}

            {(role === "admin" || role === "teacher") && (
              <Box>
                <NavItem to="/profile">Your account</NavItem>
                <MenuDivider borderColor={BLUSH} />
                {roleLinks[role].map((item, idx) => (
                  <NavItem key={item.to} to={item.to}>
                    {item.label}
                  </NavItem>
                ))}
              </Box>
            )}
          </Box>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Dropdown;