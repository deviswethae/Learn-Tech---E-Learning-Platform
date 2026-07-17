import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import CourseProgressRow from "./CourseProgressRow";
import { getWatchedVideoIds, calcProgress } from "../../utils/progress";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const PARCHMENT = "#F8F3E7";
const PARCHMENT_LINE = "#DCCFB0";

let baseURL = "https://learn-tech-e-learning-platform-backend.onrender.com/";

const CourseProgressLedger = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (!userStore?.userId || !userStore?.token) return;

  const fetchProgress = async () => {
    try {
      const { data } = await axios.get(`${baseURL}progress/summary`, {
        headers: { Authorization: `Bearer ${userStore.token}` }
      });
      setRows(data.summary || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchProgress();
}, [userStore?.userId]);

  return (
    <Box
      width="90%"
      margin="24px auto"
      bg={PARCHMENT}
      border="1px solid"
      borderColor={PARCHMENT_LINE}
      borderRadius="6px"
      px={{ base: 4, md: 8 }}
      py={6}
      position="relative"
    >
      {/* thin navy rule as the "ledger" tell, top-left, not a decorative accent */}
      <Box
        position="absolute"
        top={0}
        left={0}
        w="64px"
        h="4px"
        bg={INK_NAVY}
        borderTopLeftRadius="6px"
      />

      <Flex justify="space-between" align="baseline" mb={2}>
        <Heading
          as="h2"
          fontFamily="'Playfair Display', serif"
          fontSize="22px"
          color={INK_NAVY}
        >
          Your Progress
        </Heading>
        <Text fontSize="12px" letterSpacing="0.06em" color={GOLD} fontWeight="600">
          {rows.length} ENROLLED
        </Text>
      </Flex>

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner color={GOLD} />
        </Flex>
      ) : rows.length === 0 ? (
        <Text color="#6B6656" py={6}>
          No courses yet — enroll in one to start filling this ledger.
        </Text>
      ) : (
        <Box>
          {rows.map(({ course, watched, total, percent }) => (
            <CourseProgressRow
              key={course._id}
              course={course}
              watched={watched}
              total={total}
              percent={percent}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CourseProgressLedger;