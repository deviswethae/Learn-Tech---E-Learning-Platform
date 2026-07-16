import { useEffect, useState } from "react";
import {
  Box, Button, Container, Flex, Heading, Input, Radio, RadioGroup, Stack, Text,
  IconButton, Spinner, useToast, Divider,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TeacherNavTop from "./TeacherNavTop";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";
const PARCHMENT_LINE = "#DCCFB0";

const baseURL = "http://localhost:5000";

const emptyQuestion = () => ({
  question: "",
  options: ["", ""],
  answer: "",
});

const AddTeacherQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);
  const toast = useToast();

  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const token = userStore?.token;
    fetch(`${baseURL}/quiz/manage/${courseId}`, {
      headers: { authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.quiz && data.quiz.questions?.length > 0) {
          setQuestions(
            data.quiz.questions.map((q) => ({
              question: q.question,
              options: q.options,
              answer: q.answer,
            }))
          );
          setIsEditMode(true);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [courseId, userStore?.token]);

  // ---- question/option editing helpers ----
  const updateQuestionText = (qIdx, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIdx] = { ...next[qIdx], question: value };
      return next;
    });
  };

  const updateOptionText = (qIdx, oIdx, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      const oldValue = next[qIdx].options[oIdx];
      const newOptions = [...next[qIdx].options];
      newOptions[oIdx] = value;
      // keep the selected answer in sync if we're editing the option that was the answer
      const newAnswer = next[qIdx].answer === oldValue ? value : next[qIdx].answer;
      next[qIdx] = { ...next[qIdx], options: newOptions, answer: newAnswer };
      return next;
    });
  };

  const setAnswer = (qIdx, value) => {
    setQuestions((prev) => {
      const next = [...prev];
      next[qIdx] = { ...next[qIdx], answer: value };
      return next;
    });
  };

  const addOption = (qIdx) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIdx].options.length >= 6) return prev;
      next[qIdx] = { ...next[qIdx], options: [...next[qIdx].options, ""] };
      return next;
    });
  };

  const removeOption = (qIdx, oIdx) => {
    setQuestions((prev) => {
      const next = [...prev];
      if (next[qIdx].options.length <= 2) return prev;
      const removed = next[qIdx].options[oIdx];
      const newOptions = next[qIdx].options.filter((_, i) => i !== oIdx);
      const newAnswer = next[qIdx].answer === removed ? "" : next[qIdx].answer;
      next[qIdx] = { ...next[qIdx], options: newOptions, answer: newAnswer };
      return next;
    });
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qIdx) => {
    setQuestions((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== qIdx);
    });
  };

  // ---- validation ----
  const validate = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) return `Question ${i + 1} needs question text`;
      const filledOptions = q.options.filter((o) => o.trim());
      if (filledOptions.length < 2) return `Question ${i + 1} needs at least 2 options`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1} has an empty option`;
      if (!q.answer) return `Question ${i + 1} needs a correct answer selected`;
      if (!q.options.includes(q.answer)) return `Question ${i + 1}'s answer must match one of its options`;
    }
    return null;
  };

  const handleSave = async () => {
    const error = validate();
    if (error) {
      toast({ title: error, status: "warning", duration: 3000, isClosable: true });
      return;
    }

    setSaving(true);
    try {
      const token = userStore?.token;
      const r = await fetch(`${baseURL}/quiz/add/${courseId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${token}` },
        body: JSON.stringify({ questions }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Failed to save quiz");

      toast({ title: "Quiz saved", status: "success", duration: 2500, isClosable: true });
      navigate("/Teacher/courses");
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 4000, isClosable: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box>
        <TeacherNavTop />
        <Flex justify="center" py="20" mt="80px">
          <Spinner color={GOLD} size="lg" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box bg={BLUSH} minH="100vh">
      <TeacherNavTop />
      <Container maxW="container.md" pt={{ base: "90px", md: "110px" }} pb="10">
        <Heading size="md" color={PLUM} mb="1">
          {isEditMode ? "Edit quiz" : "Create quiz"}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb="6">
          Students need 75% or higher to earn a certificate for this course.
        </Text>

        <Stack spacing="5">
          {questions.map((q, qIdx) => (
            <Box
              key={qIdx}
              bg="white"
              borderRadius="12px"
              border="1px solid"
              borderColor={PARCHMENT_LINE}
              p="6"
              boxShadow="0 8px 20px rgba(16,31,56,0.06)"
            >
              <Flex justify="space-between" align="center" mb="3">
                <Text fontWeight="700" color={INK_NAVY} fontSize="sm">
                  Question {qIdx + 1}
                </Text>
                {questions.length > 1 && (
                  <IconButton
                    aria-label="Remove question"
                    icon={<CloseIcon boxSize="2.5" />}
                    size="xs"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: "red.400" }}
                    onClick={() => removeQuestion(qIdx)}
                  />
                )}
              </Flex>

              <Input
                placeholder="Enter the question"
                value={q.question}
                onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                mb="4"
                borderColor={PARCHMENT_LINE}
                _focus={{ borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}` }}
              />

              <Text fontSize="11px" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color={GOLD} mb="2">
                Options — select the correct one
              </Text>

              <RadioGroup value={q.answer} onChange={(val) => setAnswer(qIdx, val)}>
                <Stack spacing="2">
                  {q.options.map((opt, oIdx) => (
                    <Flex key={oIdx} align="center" gap="2">
                      <Radio value={opt} colorScheme="yellow" isDisabled={!opt.trim()} />
                      <Input
                        placeholder={`Option ${oIdx + 1}`}
                        value={opt}
                        onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
                        size="sm"
                        borderColor={PARCHMENT_LINE}
                        _focus={{ borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}` }}
                      />
                      {q.options.length > 2 && (
                        <IconButton
                          aria-label="Remove option"
                          icon={<CloseIcon boxSize="2" />}
                          size="xs"
                          variant="ghost"
                          color="gray.400"
                          _hover={{ color: "red.400" }}
                          onClick={() => removeOption(qIdx, oIdx)}
                        />
                      )}
                    </Flex>
                  ))}
                </Stack>
              </RadioGroup>

              {q.options.length < 6 && (
                <Button
                  size="xs"
                  variant="ghost"
                  color={INK_NAVY}
                  leftIcon={<AddIcon boxSize="2" />}
                  mt="3"
                  onClick={() => addOption(qIdx)}
                >
                  Add option
                </Button>
              )}
            </Box>
          ))}
        </Stack>

        <Button
          variant="outline"
          borderColor={INK_NAVY}
          color={INK_NAVY}
          leftIcon={<AddIcon boxSize="3" />}
          mt="5"
          w="100%"
          _hover={{ bg: BLUSH }}
          onClick={addQuestion}
        >
          Add question
        </Button>

        <Divider my="6" borderColor={PARCHMENT_LINE} />

        <Flex justify="flex-end" gap="3">
          <Button
            variant="ghost"
            color="gray.500"
            onClick={() => navigate("/Teacher/courses")}
          >
            Cancel
          </Button>
          <Button
            bg={INK_NAVY}
            color="white"
            borderRadius="8px"
            isLoading={saving}
            _hover={{ bg: GOLD, color: INK_NAVY }}
            onClick={handleSave}
          >
            {isEditMode ? "Update quiz" : "Save quiz"}
          </Button>
        </Flex>
      </Container>
    </Box>
  );
};

export default AddTeacherQuiz;