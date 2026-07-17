import { useEffect, useState } from "react";
import { Box, Flex, Grid, Icon, Text } from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import AdminNavTop from "../AdminNavTop";
import { BiMale, BiChalkboard } from "react-icons/bi";
import { FaVideo } from "react-icons/fa";
import { FiBook } from "react-icons/fi";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const PARCHMENT = "#F8F3E7";
const PARCHMENT_LINE = "#DCCFB0";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

const DashBoard = () => {
  const userStore = useSelector((store) => store.UserReducer);
  const [counts, setCounts] = useState({ totalUsers: 0, totalTeachers: 0, totalCourses: 0, totalVideos: 0 });
  const [categoryData, setCategoryData] = useState({ labels: [], values: [] });
  const [monthlyData, setMonthlyData] = useState({ labels: MONTH_LABELS, values: new Array(12).fill(0) });
  const [setLoading] = useState(false);

  useEffect(() => {
    const token = userStore?.token;

    const fetchStats = fetch("https://learn-tech-e-learning-platform-backend.onrender.com/stats/admin", {
      headers: { authorization: `Bearer ${token}` },
    }).then((r) => r.json());

    const fetchCourses = fetch("https://learn-tech-e-learning-platform-backend.onrender.com/courses/all?limit=1000").then((r) => r.json());

    Promise.all([fetchStats, fetchCourses])
      .then(([stats, coursesRes]) => {
        setCounts({
          totalUsers: stats.totalUsers || 0,
          totalTeachers: stats.totalTeachers || 0,
          totalCourses: stats.totalCourses || 0,
          totalVideos: stats.totalVideos || 0,
        });

        const courses = coursesRes.course || [];

        // category breakdown
        const byCategory = {};
        courses.forEach((c) => {
          const key = c.category || "Uncategorized";
          byCategory[key] = (byCategory[key] || 0) + 1;
        });
        setCategoryData({
          labels: Object.keys(byCategory),
          values: Object.values(byCategory),
        });

        // courses created per month (current year)
        const currentYear = new Date().getFullYear();
        const monthCounts = new Array(12).fill(0);
        courses.forEach((c) => {
          const d = new Date(c.createdAt);
          if (d.getFullYear() === currentYear) {
            monthCounts[d.getMonth()] += 1;
          }
        });
        setMonthlyData({ labels: MONTH_LABELS, values: monthCounts });
      })
      .catch((err) => console.error("Failed to load dashboard stats:", err))
      .finally(() => setLoading(false));
  }, [userStore?.token]);

  const barData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: "Courses created",
        data: monthlyData.values,
        backgroundColor: GOLD,
        borderColor: INK_NAVY,
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: categoryData.labels.length ? categoryData.labels : ["No data yet"],
    datasets: [
      {
        data: categoryData.values.length ? categoryData.values : [1],
        backgroundColor: [GOLD, INK_NAVY, "#8C9BAB", "#DCCFB0", "#4A5C7A", "#C9971E"],
        hoverBackgroundColor: [GOLD, INK_NAVY, "#8C9BAB", "#DCCFB0", "#4A5C7A", "#C9971E"],
      },
    ],
  };

  return (
    <Box bg={PARCHMENT} minH="100vh">
      <Grid className="Nav" w="94%" gap={10} m="auto">
        <Box mt="80px">
          <AdminNavTop />
          <Box p={5}>
            {/* ---- Stat cards ---- */}
            <Grid
              templateColumns={{ xl: "repeat(4,1fr)", lg: "repeat(2,1fr)", base: "repeat(1,1fr)" }}
              gap={6}
              mb="8"
            >
              <StatCard label="Total Students" count={counts.totalUsers} icon={BiMale} />
              <StatCard label="Total Teachers" count={counts.totalTeachers} icon={BiChalkboard} />
              <StatCard label="Total Courses" count={counts.totalCourses} icon={FiBook} />
              <StatCard label="Total Videos" count={counts.totalVideos} icon={FaVideo} />
            </Grid>

            {/* ---- Bar chart ---- */}
            <Box bg="white" border="1px solid" borderColor={PARCHMENT_LINE} borderRadius="12px" p={5} mb="8" boxShadow="0 8px 20px rgba(16,31,56,0.06)">
              <Text fontSize="16px" fontWeight="700" color={INK_NAVY} mb="4" fontFamily="'Playfair Display', serif">
                Courses Created This Year
              </Text>
              <Box height="300px">
                <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </Box>
            </Box>

            {/* ---- Pie chart ---- */}
            <Box bg="white" border="1px solid" borderColor={PARCHMENT_LINE} borderRadius="12px" p={5} boxShadow="0 8px 20px rgba(16,31,56,0.06)">
              <Text fontSize="16px" fontWeight="700" color={INK_NAVY} mb="4" fontFamily="'Playfair Display', serif">
                Courses by Category
              </Text>
              <Flex justify="center">
                <Box height="300px" width={{ base: "100%", md: "400px" }}>
                  <Pie data={pieData} options={{ maintainAspectRatio: false }} />
                </Box>
              </Flex>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default DashBoard;