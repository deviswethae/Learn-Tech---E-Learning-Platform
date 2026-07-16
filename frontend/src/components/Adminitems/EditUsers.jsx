import {
  Box,
  Button,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import AdminNavTop from "../AdminNavTop";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { patchUser } from "../../Redux/AdminReducer/action";

/**
 * Theme — Navy scholar (matches ProfilePage / AddCourse / EditPage)
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
// Height of AdminNavTop as rendered (fixed/sticky) — adjust if it differs.
const NAVBAR_HEIGHT = "12px";

const Field = ({ id, label, value, onChange, type = "text" }) => (
  <Box
    bg="white"
    borderRadius="10px"
    border="1.5px solid"
    borderColor="gray.200"
    p="16px 20px"
    minH="76px"
    transition="all 0.15s ease"
    _focusWithin={{
      borderColor: GOLD,
      boxShadow: `0 0 0 3px rgba(201,151,30,0.15)`,
    }}
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
      fontSize="14px"
      color={PLUM}
      focusBorderColor="transparent"
      _focus={{ outline: "none" }}
    />
  </Box>
);

const EditUser = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const store = useSelector((store) => store.AdminReducer.users);
  const existedUser = store.filter((el) => el._id === id);
  const navigate = useNavigate();

  let obj = {
    name: existedUser[0]?.name,
    email: existedUser[0]?.email,
    password: existedUser[0]?.password,
    city: existedUser[0]?.city,
    age: existedUser[0]?.age,
    role: existedUser[0]?.role,
  };

  const [detail, setDetail] = useState(obj);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = () => {
    setLoading(true);
    dispatch(patchUser(id, detail));
    setLoading(false);
    alert("Data Updated Successfully");
    navigate("/admin/users");
  };

  const isDisabled =
    !detail.name ||
    !detail.email ||
    !detail.password ||
    !detail.city ||
    !detail.age ||
    !detail.role;

  const filledCount = [
    detail.name,
    detail.email,
    detail.password,
    detail.city,
    detail.age,
    detail.role,
  ].filter(Boolean).length;

  const initials = (detail.name || "?")
    .trim()
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Box minH="100vh" bg={BLUSH}>
      <AdminNavTop />

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
              fontSize="11px"
              fontWeight="700"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color={GOLD}
            >
              Edit User
            </Text>

            <Box
              position="relative"
              zIndex="1"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box
                w="120px"
                h="120px"
                borderRadius="full"
                bg="white"
                border="4px solid"
                borderColor={GOLD}
                boxShadow="0 8px 24px rgba(0,0,0,0.2)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                <Text fontSize="2xl" color={BRAND} fontWeight="700">
                  {initials}
                </Text>
              </Box>
              <Heading size="md" mt="18px" color="white" textAlign="center" fontWeight="700">
                {detail.name || "Unnamed User"}
              </Heading>
              <Text fontSize="xs" color="whiteAlpha.800" mt="6px" textAlign="center" maxW="220px">
                Update the user details and save your changes
              </Text>
            </Box>

            <Box position="relative" zIndex="1" display="flex" justifyContent="center" gap="10px">
              <Box bg="whiteAlpha.200" borderRadius="8px" px="14px" py="8px" textAlign="center" minW="90px">
                <Text fontSize="lg" fontWeight="700" color={GOLD}>
                  {filledCount}/6
                </Text>
                <Text fontSize="10px" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.05em">
                  Complete
                </Text>
              </Box>
              <Box bg="whiteAlpha.200" borderRadius="8px" px="14px" py="8px" textAlign="center" minW="90px">
                <Text fontSize="lg" fontWeight="700" color={GOLD} textTransform="capitalize">
                  {detail.role || "—"}
                </Text>
                <Text fontSize="10px" color="whiteAlpha.800" textTransform="uppercase" letterSpacing="0.05em">
                  Role
                </Text>
              </Box>
            </Box>
          </Box>

          {/* right panel — form */}
          <Box
            flex="1"
            p={{ base: "6%", md: "3% 5%" }}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            overflowY={{ base: "visible", md: "auto" }}
          >
            <Box>
              <Heading size="sm" color={PLUM} mb="1">
                User details
              </Heading>
              <Text fontSize="xs" color="gray.500" mb="5">
                Update the information below and save your changes.
              </Text>

              <Box display="grid" gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap="14px">
                <Field id="name" label="Name" value={detail.name} onChange={handleChange} />
                <Field id="email" label="Email" type="email" value={detail.email} onChange={handleChange} />
                <Field id="password" label="Password" type="password" value={detail.password} onChange={handleChange} />
                <Field id="age" label="Age" type="number" value={detail.age} onChange={handleChange} />
                <Field id="city" label="City" value={detail.city} onChange={handleChange} />
                <Field id="role" label="Role" value={detail.role} onChange={handleChange} />
              </Box>
            </Box>

            {/* button row */}
            <Box display="flex" alignItems="center" gap="18px" pt="4">
              <Button
                flex="1"
                h="46px"
                color="white"
                bg={BRAND}
                _hover={{
                  bg: GOLD,
                  color: BRAND,
                  boxShadow: `0 6px 20px rgba(201,151,30,0.35)`,
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                _disabled={{ bg: "gray.100", color: "gray.400", cursor: "not-allowed", boxShadow: "none" }}
                borderRadius="8px"
                transition="all 0.15s ease"
                textAlign="center"
                isDisabled={isDisabled}
                isLoading={loading}
                onClick={handleSubmit}
              >
                <Heading size="xs">Save changes</Heading>
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

export default EditUser;