import { useEffect, useState } from "react";
import { Box, Flex, Grid, Icon, Text, Image } from "@chakra-ui/react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { useSelector } from "react-redux";
import TeacherNavTop from "./TeacherNavTop";
import { FiBook, FiUsers } from "react-icons/fi";
import { FaVideo } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const PARCHMENT = "#F8F3E7";
const PARCHMENT_LINE = "#DCCFB0";

const StatCard = ({ label, count, icon }) => (
  <Box
    bg="white"
    border="1px solid"
    borderColor={PARCHMENT_LINE}
    borderRadius="12px"
    p={5}
    boxShadow="0 8px 20px rgba(16,31,56,0.06)"
  >
    <Flex justify="space-between" align="center">
      <Text fontSize="11px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={GOLD}>
        {label}
      </Text>
      <Icon as={icon} boxSize={5} color={INK_NAVY} />
    </Flex>
    <Text fontSize="32px" fontWeight="700" color={INK_NAVY} mt="2" fontFamily="'Playfair Display', serif">
      {count}
    </Text>
  </Box>
);

const TeacherDashboard = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const [stats, setStats] = useState({ totalCourses: 0, totalVideos: 0, totalStudents: 0, courses: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = userStore?.token;
    fetch("https://learn-tech-e-learning-platform-backend.onrender.com/stats/teacher", {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load teacher stats:", err))
      .finally(() => setLoading(false));
  }, [userStore?.token]);

  const barData = {
    labels: stats.courses.map((c) => c.title),
    datasets: [
      {
        label: "Enrolled students",
        data: stats.courses.map((c) => c.enrolledUsers),
        backgroundColor: GOLD,
        borderColor: INK_NAVY,
        borderWidth: 1,
      },
    ],
  };

  return (
    <Box bg={PARCHMENT} minH="100vh">
      <Grid className="Nav" w="94%" gap={10} m="auto">
        <Box mt="80px">
          <TeacherNavTop />
          <Box p={5}>
            {/* ---- Stat cards ---- */}
            <Grid
              templateColumns={{ xl: "repeat(3,1fr)", lg: "repeat(2,1fr)", base: "repeat(1,1fr)" }}
              gap={6}
              mb="8"
            >
              <StatCard label="Your Courses" count={stats.totalCourses} icon={FiBook} />
              <StatCard label="Total Videos" count={stats.totalVideos} icon={FaVideo} />
              <StatCard label="Total Students" count={stats.totalStudents} icon={FiUsers} />
            </Grid>

            {/* ---- Per-course cards ---- */}
            {stats.courses.length > 0 && (
              <Box mb="8">
                <Text fontSize="16px" fontWeight="700" color={INK_NAVY} mb="4" fontFamily="'Playfair Display', serif">
                  Your Courses
                </Text>
                <Grid templateColumns={{ xl: "repeat(3,1fr)", md: "repeat(2,1fr)", base: "1fr" }} gap={5}>
                  {stats.courses.map((course) => (
                    <Flex
                      key={course._id}
                      bg="white"
                      border="1px solid"
                      borderColor={PARCHMENT_LINE}
                      borderRadius="12px"
                      overflow="hidden"
                      boxShadow="0 8px 20px rgba(16,31,56,0.06)"
                    >
                      <Image src={course.img} alt={course.title} w="200px" h="90px" objectFit="cover" flexShrink={0} />
                      <Box p="3" textAlign="left">
                        <Text fontWeight="700" color={INK_NAVY} fontSize="sm" noOfLines={1}>
                          {course.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500" mt="1">
                          {course.videos} video{course.videos === 1 ? "" : "s"}
                        </Text>
                        <Text fontSize="xs" color={GOLD} fontWeight="700" mt="1">
                          {course.enrolledUsers} enrolled
                        </Text>
                      </Box>
                    </Flex>
                  ))}
                </Grid>
              </Box>
            )}

            {/* ---- Bar chart ---- */}
            {stats.courses.length > 0 && (
              <Box bg="white" border="1px solid" borderColor={PARCHMENT_LINE} borderRadius="12px" p={5} boxShadow="0 8px 20px rgba(16,31,56,0.06)">
                <Text fontSize="16px" fontWeight="700" color={INK_NAVY} mb="4" fontFamily="'Playfair Display', serif">
                  Enrollment by Course
                </Text>
                <Box height="300px">
                  <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                </Box>
              </Box>
            )}

            {!loading && stats.courses.length === 0 && (
              <Box bg="white" border="1px dashed" borderColor="gray.300" borderRadius="12px" p={8} textAlign="center">
                <Text color="gray.500">You haven't created any courses yet.</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;