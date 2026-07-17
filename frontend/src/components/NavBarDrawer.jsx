import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { BiUserCircle } from "react-icons/bi";
import { capitalizeFirstLetter } from "../Redux/UserReducer/action";
import { FaUserShield } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import axios from "axios";
import { actionUserLogout } from "../Redux/UserReducer/actionType";
import { showToast } from "./SignUp";


export function NavBarDrawer({ isOpen, onClose }) {
  
 
  const navigate = useNavigate();
  const toast = useToast();

  const dispatch = useDispatch();

  const userStore = useSelector((state) => state.UserReducer);

  const handleLogoutClick = () => {
    const token = userStore?.token;
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(
        "https://learn-tech-e-learning-platform-backend.onrender.com/users/logout",
        {},
        { headers }
      )
      .then((res) => {
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: "",
            name: "",
            role: "",
            token: "",
            isAuth: false,
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
        showToast({
          toast,
          message: "You have Logout Successfully",
          color: "green",
        });
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box>
      <Drawer placement={"top"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            borderBottomWidth="1px"
            bg="#f5f5f5"
            boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
            display="flex"
            justifyContent="space-between"
          >
            <Link to="/">
              <Text
                textAlign="center"
                fontSize={30}
                fontWeight="extrabold"
                color="#fa0f6d#"
                _hover={{ cursor: "pointer" }}
              >
                LearnTech
              </Text>
            </Link>
            <Box>
              <RxCross2 size="1.5rem" onClick={onClose} />
            </Box>
          </DrawerHeader>
          <DrawerBody >
            {userStore?.isAuth ? (
              <Flex justify="space-between" alignItems="center">
                <Box p="1.5rem 0">
                  {userStore?.role === "admin" || userStore?.role==='teacher' ? (
                    <Flex alignItems={"center"}>
                      <Box>
                        <FaUserShield size="2rem" color="#fa0f6d#" />
                        <Text fontSize="0.6rem" fontWeight="bold">
                          {capitalizeFirstLetter(userStore?.role)}
                        </Text>
                      </Box>
                      <Heading size="sm" ml="1rem">
                        {capitalizeFirstLetter(userStore?.name)}
                      </Heading>
                    </Flex>
                  ) : userStore?.role === "user" ? (
                    <Flex alignItems={"center"}>
                      <BiUserCircle size="2rem" color="#fa0f6d" />
                      <Heading size="sm" ml="1rem">
                        {capitalizeFirstLetter(userStore?.name)}
                      </Heading>
                    </Flex>
                  ) : null}
                </Box>
                <Button
                  fontSize="0.8rem"
                  p="1rem"
                  colorScheme="blue"
                  fontWeight={"bold"}
                  onClick={handleLogoutClick}
                >
                  Logout
                </Button>
              </Flex>
            ) : (
              <Box
                borderTop="1px solid #3A3F3F"
                pt="25px"
                display="flex"
                justifyContent="space-between"
              >
                <Link to="/login">
                  <Button
                    bg="#fa0f6d#"
                    color="white"
                    borderRadius="5px"
                    _hover={{ bg: "#003e9c" }}
                  >
                    LogIn
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    bg="#fa0f6d"
                    color="white"
                    borderRadius="5px"
                    _hover={{ bg: "#003e9c" }}
                  >
                    Join for free
                  </Button>
                </Link>
              </Box>
            )}
            {/* personlized settings  */}
            {/* teacher options  */}
            {userStore?.role === "admin" && (
              <Box p="0.5rem 0" borderTop="1px solid #3A3F3F">
                <Box>
                  <Link to="/profile">
                    <Text fontSize="0.8rem" p="1rem 0">
                      Your Account
                    </Text>
                  </Link>
                  <Link to="/home">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      User Dashboard
                    </Text>
                  </Link>
                  <Link to="/admin/dashboard">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Admin Dashboard
                    </Text>
                  </Link>
                  <Link to="/admin/courses">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Courses
                    </Text>
                  </Link>
                  <Link to="/admin/users">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Users
                    </Text>
                  </Link>
                  <Link to="/admin/videos">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      AllVideos
                    </Text>
                  </Link>
                
                 
                  
                </Box>
              </Box>
            ) }

            {/*teacher options  */}
            {userStore?.role==='teacher' && (
              <Box p="0.5rem 0" borderTop="1px solid #3A3F3F">
                <Box>
                  <Link to="/profile">
                    <Text fontSize="0.8rem" p="1rem 0">
                      Your Account
                    </Text>
                  </Link>
                  <Link to="/home">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      User Dashboard
                    </Text>
                  </Link>
                  <Link to="/Teacherdashboard">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Teacher Dashboard
                    </Text>
                  </Link>
                  <Link to="/Teacher/courses">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Courses
                    </Text>
                  </Link>
                  <Link to="/Teacher/users">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      Users
                    </Text>
                  </Link>
                  <Link to="/admin/videos">
                    <Text
                      fontSize="0.8rem" p="1rem 0"
                    >
                      AllVideos
                    </Text>
                  </Link>
                  
                  
                </Box>
              </Box>
            )}

            {/* users options  */}
            {userStore?.role === "user" && (
              <Box p="0.5rem 0" borderTop="1px solid #3A3F3F">
                <Link to="/profile">
                  <Flex alignItems={"center"} justify="space-between">
                    <Text fontSize="0.8rem" p="1rem 0">
                      Your Account
                    </Text>
                    <IoIosArrowForward />
                  </Flex>
                </Link>

                <Link to="/home">
                  <Flex alignItems={"center"} justify="space-between">
                    <Text fontSize="0.8rem" p="1rem 0">
                      Dashboard
                    </Text>
                    <IoIosArrowForward />
                  </Flex>
                </Link>
              </Box>
            )}

            
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}