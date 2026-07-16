import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, { deleteProduct, getvideo } from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

/**
 * Theme — Navy scholar (matches ProfilePage / AddCourse / Courses / Users)
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
const NAVBAR_HEIGHT = "12px";

const GetVideos = () => {
  const store = useSelector((store) => store.AdminReducer.videos);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getvideo(page, limit, user));
  }, [page, limit]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = Math.ceil(store.length / limit);

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Box minH="100vh" bg={BLUSH}>
      <AdminNavTop />

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
            <Box position="relative" zIndex="1">
              <Text
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color={GOLD}
              >
                Video library
              </Text>
              <Heading size="md" color="white" mt="1" fontWeight="700">
                Courses Video
              </Heading>
            </Box>
          </Box>

          {/* table */}
          <Box p={{ base: "4%", md: "2% 3%" }} overflowX="auto">
            <Table variant="unstyled" w="100%" size={tableSize}>
              <Thead>
                <Tr>
                  {["Title", "Uploaded", "Description", "Views", "Link", ""].map((h) => (
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
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {store.length > 0 &&
                  store.map((el, i) => (
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
                      <Td color="gray.600" py="4" maxW="320px">
                        <Text noOfLines={2} fontSize="14px">
                          {el.description}
                        </Text>
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
                          {el.views}
                        </Box>
                      </Td>
                      <Td color="gray.500" py="4" maxW="220px">
                        <Text noOfLines={1} fontSize="13px" title={el.link}>
                          {el.link}
                        </Text>
                      </Td>
                      <Td py="4">
                        <Flex gap="2" justify="flex-end">
                          <Link to={`/admin/videos/add/${el.courseId}`}>
                            <Button
                              size="sm"
                              bg={BRAND}
                              color="white"
                              borderRadius="7px"
                              _hover={{ bg: GOLD, color: BRAND }}
                              transition="all 0.15s ease"
                            >
                              Add
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
                  No videos found.
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

export default GetVideos;