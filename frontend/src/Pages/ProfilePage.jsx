import { useState } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  Avatar,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import UserNavbar from "../components/UserComponents/UserNavbar";
import { useDispatch, useSelector } from "react-redux";
import { actionLoginSuccess } from "../Redux/UserReducer/actionType";
import { showToast } from "../components/SignUp";
import { useNavigate } from "react-router-dom";

/**
 * Theme — Navy scholar
 * ------------------------------------------------
 * Ink navy       #16213E  – primary / hero panel
 * Deep navy      #0F172E  – gradient partner / darkest
 * Marginalia gold#C9971E  – accent / CTA / focus ring
 * Parchment      #FAF7F0  – page wash
 * Charcoal text  #23262B  – headings on light bg
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";
// Height of UserNavbar as rendered (fixed/sticky, p={4} + content) — matches the real navbar now.
const NAVBAR_HEIGHT = "72px";

const Field = ({ id, label, type = "text", value, onChange }) => (
  <Box
    bg="white"
    borderRadius="10px"
    border="1.5px solid"
    borderColor="gray.200"
    p="16px 20px"
    minH="76px"
    transition="all 0.15s ease"
    _focusWithin={{ borderColor: GOLD, boxShadow: `0 0 0 3px rgba(201,151,30,0.15)` }}
  >
    <Heading
      size="xs"
      fontSize="11px"
      letterSpacing="0.06em"
      textTransform="uppercase"
      color={GOLD}
      fontWeight="700"
    >
      {label}
    </Heading>
    <Input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      border="none"
      p="0px"
      mt="2px"
      h="auto"
      fontSize="17px"
      color={PLUM}
      focusBorderColor="transparent"
      _focus={{ outline: "none" }}
    />
  </Box>
);

const ProfilePage = () => {
  const userStore = useSelector((store) => store.UserReducer);

  const [name, setName] = useState(userStore?.name || "");
  const [email, setEmail] = useState(userStore?.email || "");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState(userStore?.age || "");
  const [city, setCity] = useState(userStore?.place || "");
  const [job, setJob] = useState(
    (userStore?.job !== "null" && userStore?.job) || ""
  );
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = () => {
    const obj = { name, email, password, age, city, job };
    const id = userStore?.userId;
    setLoading(true);

    axios
      .patch(
        `https://elearning-platform-using-mern-j5py.vercel.app/users/update/${id}`,
        obj
      )
      .then((res) => {
        dispatch(actionLoginSuccess(res?.data));
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: res.data.user.email,
            name: res.data.user.name,
            role: res.data.user.role,
            token: res.data.token,
            isAuth: true,
            userId: res.data.user._id,
            age: res.data.user.age,
            job: res.data.user.job,
            place: res.data.user.city,
          })
        );
        navigate(-1);
        showToast({ toast, message: "Profile Updated", color: "green" });
      })
      .catch((err) => {
        showToast({ toast, message: "Error occur", color: "red" });
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const isDisabled = name === "" || email === "" || age === "" || city === "" || job === "";
  const filledCount = [name, email, age, city, job].filter(Boolean).length;

  return (
    <Box minH="100vh" bg={BLUSH}>
      <UserNavbar />

      {/*
        UserNavbar renders as fixed/sticky, so it doesn't take up layout space
        and was covering the content. NAVBAR_HEIGHT offsets below it — adjust
        if your navbar's real rendered height differs.
      */}
      <Box
        h={{ base: "auto", md: `calc(100vh - ${NAVBAR_HEIGHT})` }}
        mt={NAVBAR_HEIGHT}
        overflow={{ base: "visible", md: "hidden" }}
        p={{ base: "4%", md: "2%" }}
      >
        <Box
          h="100%"
          display={{ base: "block", md: "flex" }}
          bg="white"
          borderRadius="18px"
          boxShadow="0 20px 50px rgba(22,33,62,0.16)"
          overflow="hidden"
        >
          {/* left panel — gradient hero */}
          <Box
            flex="0 0 34%"
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            position="relative"
            overflow="hidden"
            py={{ base: "8", md: "8%" }}
            px="8%"
          >
            {/* decorative glow rings */}
            <Box position="absolute" w="220px" h="220px" borderRadius="full" border="1px solid rgba(201,151,30,0.3)" left="50%" top="50%" transform="translate(-50%,-50%)" />
            <Box position="absolute" w="300px" h="300px" borderRadius="full" border="1px solid rgba(201,151,30,0.15)" left="50%" top="50%" transform="translate(-50%,-50%)" />

            <Text
              position="relative"
              zIndex="1"
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
            >
              My Profile
            </Text>

            <Box position="relative" zIndex="1" display="flex" flexDirection="column" alignItems="center">
              <Avatar
                size="2xl"
                name={name}
                src="/path/to/profile-image.jpg"
                bg="white"
                color={BRAND}
                fontWeight="700"
                border="4px solid"
                borderColor={GOLD}
                boxShadow="0 8px 24px rgba(0,0,0,0.2)"
              />
              <Heading size="md" mt="18px" color="white" textAlign="center" fontWeight="700">
                {name || "Your Profile"}
              </Heading>
              <Text fontSize="xs" color="whiteAlpha.800" mt="6px" textAlign="center" maxW="220px">
                Keep your learning profile fresh and up to date
              </Text>
            </Box>

            <Box position="relative" zIndex="1" display="flex" justifyContent="center" gap="10px">
              <Box bg="whiteAlpha.200" borderRadius="8px" px="14px" py="8px" textAlign="center" minW="90px">
                <Text fontSize="lg" fontWeight="700" color={GOLD}>{filledCount}/5</Text>
                <Text fontSize="10px" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.05em">Complete</Text>
              </Box>
              <Box bg="whiteAlpha.200" borderRadius="8px" px="14px" py="8px" textAlign="center" minW="90px">
                <Text fontSize="lg" fontWeight="700" color={GOLD}>{city || "—"}</Text>
                <Text fontSize="10px" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.05em">Location</Text>
              </Box>
            </Box>
          </Box>

          {/* right panel — form */}
          <Box flex="1" p={{ base: "6%", md: "3% 5%" }} display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
              <Heading size="sm" color={PLUM} mb="1">
                Account details
              </Heading>
              <Text fontSize="xs" color="gray.500" mb="5">
                Update the information below and save your changes.
              </Text>

              <Box display="grid" gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Field id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Field id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Field
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Field id="age" label="Age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                <Field id="city" label="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <Field id="job" label="Job" value={job} onChange={(e) => setJob(e.target.value)} />
              </Box>
            </Box>

            {/* button row */}
            <Box display="flex" alignItems="center" gap="18px" pt="4">
              <Button
                flex="1"
                h="46px"
                color="white"
                bg={BRAND}
                _hover={{ bg: GOLD, color: BRAND, boxShadow: `0 6px 20px rgba(201,151,30,0.35)`, transform: "translateY(-1px)" }}
                _active={{ transform: "translateY(0)" }}
                _disabled={{ bg: "gray.100", color: "gray.400", cursor: "not-allowed", boxShadow: "none" }}
                borderRadius="8px"
                transition="all 0.15s ease"
                textAlign="center"
                isDisabled={isDisabled}
                onClick={handleSave}
              >
                <Heading size="xs">
                  {loading ? <Spinner color="currentColor" size="sm" /> : "Save changes"}
                </Heading>
              </Button>
              <Text
                fontSize="0.75rem"
                cursor="pointer"
                _hover={{ color: GOLD }}
                fontWeight="600"
                color="gray.500"
                whiteSpace="nowrap"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;