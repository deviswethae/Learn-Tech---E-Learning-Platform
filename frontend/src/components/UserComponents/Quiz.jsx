import { useEffect, useState } from "react";
import {
  Box, Button, Container, Flex, Heading, Radio, RadioGroup, Stack, Text, Spinner, Progress,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserNavbar from "./UserNavbar";
import Footer from "../../Pages/Footer";
import Certificate from "./Certificate";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";

const baseURL = "http://localhost:5000";

const Quiz = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);

  const [status, setStatus] = useState("loading"); // loading | blocked | noQuiz | ready | submitted | certified
  const [message, setMessage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = userStore?.token;
    fetch(`${baseURL}/quiz/${courseId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        const data = await r.json();
        if (r.status === 403) {
          setMessage(data.message || "Finish all videos before taking the quiz");
          setStatus("blocked");
          return;
        }
        if (r.status === 404) {
          setMessage(data.message || "No quiz has been added for this course yet");
          setStatus("noQuiz");
          return;
        }
        if (!r.ok) throw new Error(data.message || "Failed to load quiz");

        if (data.alreadyCertified) {
          setStatus("certified");
        } else {
          setQuestions(data.questions || []);
          setStatus("ready");
        }
      })
      .catch(() => {
        setMessage("Something went wrong loading the quiz");
        setStatus("blocked");
      });
  }, [courseId, userStore?.token]);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q._id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = userStore?.token;
      const payload = {
        answers: Object.entries(answers).map(([questionId, selected]) => ({ questionId, selected })),
      };
      const r = await fetch(`${baseURL}/quiz/submit/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      setResult(data);
      setStatus("submitted");
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box bg={BLUSH} minH="100vh">
      <UserNavbar />
      <Container maxW="container.md" pt={{ base: "90px", md: "110px" }} pb="10">
        {status === "loading" && (
          <Flex justify="center" py="20"><Spinner color={GOLD} size="lg" /></Flex>
        )}

        {(status === "blocked" || status === "noQuiz") && (
          <Box bg="white" borderRadius="14px" p="10" textAlign="center" boxShadow="0 20px 50px rgba(22,33,62,0.1)">
            <Heading size="md" color={PLUM} mb="3">
              {status === "blocked" ? "Quiz locked" : "No quiz yet"}
            </Heading>
            <Text color="gray.500" mb="6">{message}</Text>
            <Button
              bg={INK_NAVY}
              color="white"
              borderRadius="8px"
              _hover={{ bg: GOLD, color: INK_NAVY }}
              onClick={() => navigate(`/course/${courseId}`)}
            >
              Back to course
            </Button>
          </Box>
        )}

        {status === "certified" && <Certificate courseId={courseId} />}

        {status === "ready" && (
          <Box>
            <Heading size="md" color={PLUM} mb="1">Course quiz</Heading>
            <Text fontSize="sm" color="gray.500" mb="6">
              Answer all {questions.length} questions — you need 75% or higher to earn your certificate.
            </Text>

            <Stack spacing="5">
              {questions.map((q, idx) => (
                <Box key={q._id} bg="white" borderRadius="12px" p="6" boxShadow="0 8px 20px rgba(16,31,56,0.06)">
                  <Text fontWeight="700" color={PLUM} mb="3">
                    {idx + 1}. {q.question}
                  </Text>
                  <RadioGroup onChange={(val) => handleSelect(q._id, val)} value={answers[q._id] || ""}>
                    <Stack spacing="2">
                      {q.options.map((opt) => (
                        <Radio key={opt} value={opt} colorScheme="yellow">
                          <Text fontSize="sm">{opt}</Text>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              ))}
            </Stack>

            <Flex justify="flex-end" mt="6">
              <Button
                bg={allAnswered ? INK_NAVY : "gray.300"}
                color="white"
                isDisabled={!allAnswered || submitting}
                isLoading={submitting}
                borderRadius="8px"
                _hover={allAnswered ? { bg: GOLD, color: INK_NAVY } : {}}
                onClick={handleSubmit}
              >
                Submit quiz
              </Button>
            </Flex>
          </Box>
        )}

        {status === "submitted" && result && (
          <Box>
            <Box bg="white" borderRadius="14px" p="10" textAlign="center" boxShadow="0 20px 50px rgba(22,33,62,0.1)" mb="6">
              <Heading size="lg" color={result.passed ? GOLD : PLUM} mb="2">
                {result.score} / {result.total}
              </Heading>
              <Text color="gray.500" mb="4">{result.percent}% correct</Text>
              <Progress
                value={result.percent}
                size="sm"
                borderRadius="full"
                bg={BLUSH}
                sx={{ "& > div": { background: result.passed ? GOLD : "gray.400" } }}
                mb="4"
              />
              {result.passed ? (
                <Text color={GOLD} fontWeight="700">🎉 You passed! Your certificate is ready below.</Text>
              ) : (
                <>
                  <Text color="gray.600" mb="4">You need 75% to earn a certificate. Review the videos and try again.</Text>
                  <Button
                    bg={INK_NAVY}
                    color="white"
                    borderRadius="8px"
                    _hover={{ bg: GOLD, color: INK_NAVY }}
                    onClick={() => navigate(`/course/${courseId}`)}
                  >
                    Back to course
                  </Button>
                </>
              )}
            </Box>

            {result.passed && <Certificate courseId={courseId} preloaded={result.certificate} />}
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Quiz;