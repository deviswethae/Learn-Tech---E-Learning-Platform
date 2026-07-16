import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

/**
 * Theme — Navy scholar (matches ProfilePage / AddCourse / EditPage)
 * ------------------------------------------------
 * Ink navy       #16213E  – primary / header / CTA
 * Deep navy      #0F172E  – gradient partner / darkest
 * Marginalia gold#C9971E  – accent / focus ring / edit
 * Parchment      #FAF7F0  – page wash
 * Charcoal text  #23262B  – headings on light bg
 * ------------------------------------------------
 */
const BRAND = "#16213E";
const BRAND2 = "#0F172E";
const GOLD = "#f4c046";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";
const NAVBAR_HEIGHT = "12px";

const Courses = () => {
  const store = useSelector((store) => store.AdminReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };
  const count = 4;

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Box minH="100vh" bg={BLUSH}>
      <AdminNavTop handleSearch={handleSearch} />

      <Box mt={NAVBAR_HEIGHT} p={{ base: "4%", md: "2% 3%" }}>
        <Box
          bg="white"
          borderRadius="18px"
          boxShadow="0 20px 50px rgba(22,33,62,0.16)"
          overflow="hidden"
        >
          {/* header strip — gradient toolbar */}
          <Box
            bgGradient={`linear(160deg, ${BRAND} 0%, ${BRAND2} 100%)`}
            px={{ base: "5%", md: "3%" }}
            py="6"
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
              top="-90px"
            />
            <Grid
              templateColumns={{ base: "1fr", lg: "1fr auto auto" }}
              alignItems="center"
              gap={{ base: "4", lg: "6" }}
              position="relative"
              zIndex="1"
            >
              <Box>
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  letterSpacing="0.14em"
                  textTransform="uppercase"
                  color={GOLD}
                >
                  Course catalog
                </Text>
                <Heading size="md" color="white" mt="1" fontWeight="700">
                  Welcome to Courses
                </Heading>
              </Box>

              <Select
                onChange={handleSelect}
                bg="white"
                color={PLUM}
                borderRadius="8px"
                border="none"
                w={{ base: "100%", lg: "280px" }}
                h="42px"
                fontSize="14px"
                _focus={{ boxShadow: `0 0 0 3px rgba(201,151,30,0.35)` }}
              >
                <option value="asc">Price: low to high</option>
                <option value="desc">Price: high to low</option>
              </Select>

              <Link to="/admin/addCourse">
                <Button
                  bg={GOLD}
                  color={BRAND}
                  fontWeight="700"
                  borderRadius="8px"
                  h="42px"
                  px="6"
                  w={{ base: "100%", lg: "auto" }}
                  _hover={{
                    bg: "white",
                    boxShadow: "0 6px 20px rgba(255,255,255,0.35)",
                    transform: "translateY(-1px)",
                  }}
                  transition="all 0.15s ease"
                >
                  + Create course
                </Button>
              </Link>
            </Grid>
          </Box>

          {/* table */}
          <Box p={{ base: "4%", md: "2% 3%" }} overflowX="auto">
            <Table variant="unstyled" w="100%" size={tableSize}>
              <Thead>
                <Tr>
                  {["Title", "Date", "Category", "Description", "Price", "Teacher", "Actions"].map(
                    (h) => (
                      <Th
                        key={h}
                        fontSize="11px"
                        letterSpacing="0.06em"
                        textTransform="uppercase"
                        color={GOLD}
                        fontWeight="700"
                        borderBottom="2px solid"
                        borderColor={BLUSH}
                        py="3"
                      >
                        {h}
                      </Th>
                    )
                  )}
                </Tr>
              </Thead>
              <Tbody>
                {store?.length > 0 &&
                  store?.map((el, i) => (
                    <Tr
                      key={el._id || i}
                      bg={i % 2 === 0 ? "white" : BLUSH}
                      _hover={{ bg: "rgba(201,151,30,0.08)" }}
                      transition="background 0.15s ease"
                    >
                      <Td color={PLUM} fontWeight="600" py="4">
                        {el.title}
                      </Td>
                      <Td color="gray.500" py="4" whiteSpace="nowrap">
                        {convertDateFormat(el.createdAt)}
                      </Td>
                      <Td py="4">
                        <Box
                          as="span"
                          bg={BRAND}
                          color="white"
                          fontSize="11px"
                          fontWeight="700"
                          px="3"
                          py="1"
                          borderRadius="full"
                          whiteSpace="nowrap"
                        >
                          {el.category}
                        </Box>
                      </Td>
                      <Td color="gray.600" py="4" maxW="360px">
                        <Text noOfLines={2} fontSize="14px">
                          {el.description}
                        </Text>
                      </Td>
                      <Td color={PLUM} fontWeight="700" py="4">
                        Rs.{el.price}
                      </Td>
                      <Td color="gray.500" py="4" whiteSpace="nowrap">
                        {el.teacher}
                      </Td>
                      <Td py="4">
                        <Flex gap="2" justify="flex-end">
                          <Link to={`/admin/edit/${el._id}`}>
                            <Button
                              size="sm"
                              leftIcon={<EditIcon boxSize="3" />}
                              bg={BRAND}
                              color="white"
                              borderRadius="7px"
                              _hover={{
                                bg: GOLD,
                                color: BRAND,
                              }}
                              transition="all 0.15s ease"
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="gray.300"
                            color="gray.500"
                            borderRadius="7px"
                            _hover={{
                              bg: "red.50",
                              color: "red.500",
                              borderColor: "red.200",
                            }}
                            onClick={() => handleDelete(el._id, el.title)}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>

            {(!store || store.length === 0) && (
              <Box textAlign="center" py="16">
                <Text color="gray.400" fontSize="sm">
                  No courses found.
                </Text>
              </Box>
            )}
          </Box>

          {/* pagination footer */}
          <Flex
            justify={{ base: "center", md: "flex-end" }}
            align="center"
            gap="3"
            px={{ base: "4%", md: "3%" }}
            py="5"
            borderTop="1px solid"
            borderColor={BLUSH}
            flexWrap="wrap"
          >
            <Button
              size="sm"
              variant="outline"
              borderColor="gray.300"
              color={PLUM}
              borderRadius="7px"
              isDisabled={page <= 1}
              onClick={() => handlePageButton(-1)}
              _hover={{ bg: GOLD, color: BRAND, borderColor: GOLD }}
            >
              Prev
            </Button>
            <Pagination
              totalCount={count}
              current_page={page}
              handlePageChange={handlePageChange}
            />
            <Button
              size="sm"
              variant="outline"
              borderColor="gray.300"
              color={PLUM}
              borderRadius="7px"
              isDisabled={page >= count}
              onClick={() => handlePageButton(1)}
              _hover={{ bg: GOLD, color: BRAND, borderColor: GOLD }}
            >
              Next
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default Courses;