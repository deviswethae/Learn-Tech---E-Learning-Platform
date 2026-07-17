import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const baseURL = "https://learn-tech-e-learning-platform-backend.onrender.com";

const Certificate = ({ courseId, preloaded }) => {
  const userStore = useSelector((store) => store.UserReducer);
  const [certificate, setCertificate] = useState(preloaded || null);
  const [loading, setLoading] = useState(!preloaded);

  useEffect(() => {
    if (preloaded) return;
    const token = userStore?.token;
    fetch(`${baseURL}/quiz/certificate/${courseId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCertificate(data.certificate))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [courseId, preloaded, userStore?.token]);

  if (loading) return <Flex justify="center" py="10"><Spinner color={GOLD} /></Flex>;
  if (!certificate) return null;

  return (
    <Box>
      <Box
        bg="white"
        border="10px solid"
        borderColor={GOLD}
        borderRadius="16px"
        p={{ base: "8", md: "14" }}
        textAlign="center"
        boxShadow="0 20px 50px rgba(22,33,62,0.15)"
      >
        <Text fontSize="11px" letterSpacing="0.2em" textTransform="uppercase" color={GOLD} fontWeight="700" mb="2">
          Certificate of Completion
        </Text>
        <Heading fontFamily="'Playfair Display', serif" size="lg" color={INK_NAVY} mb="6">
          LearnTech
        </Heading>
        <Text fontSize="sm" color="gray.500" mb="1">This certifies that</Text>
        <Heading size="md" color={INK_NAVY} mb="4" fontFamily="'Playfair Display', serif">
          {certificate.userName}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb="1">has successfully completed</Text>
        <Heading size="sm" color={GOLD} mb="6">
          {certificate.courseTitle}
        </Heading>
        <Text fontSize="xs" color="gray.400" mb="1">
          Score: {certificate.score}/{certificate.totalQuestions} ({certificate.percent}%)
        </Text>
        <Text fontSize="xs" color="gray.400">
          Issued {new Date(certificate.issuedAt).toLocaleDateString()} · ID: {certificate.certificateId}
        </Text>
      </Box>

      <Flex justify="center" mt="4">
        <Button bg={INK_NAVY} color="white" borderRadius="8px" _hover={{ bg: GOLD, color: INK_NAVY }} onClick={() => window.print()}>
          Print / Save as PDF
        </Button>
      </Flex>
    </Box>
  );
};

export default Certificate;