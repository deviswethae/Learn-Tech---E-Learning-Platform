import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";

/**
 * Theme — Navy scholar (matches AddCourse / Courses / SinglePage)
 */
const BRAND = "#16213E";
const GOLD = "#C9971E";
const BLUSH = "#F4F1E8";
const PLUM = "#23262B";

const SingleList = () => {
  const list = [
    "Build enterprise level Node applications and deploy to the cloud (AWS)",
    "Lead NodeJS projects by making good architecture decisions and helping others on your team",
    "Work with real life data and SpaceX API to build a NASA launch system, discover new planets that may contain life + other projects",
    "Build a MERN (MongoDb, Express, React, Node) fullstack app and deploy to production",
    "Become the top 10% Node Developer. Learn REALLY advanced topics!",
    "Master the latest ecosystem of a Backend NodeJS Developer from scratch",
    "Learn to build secure and performant, large scale applications like a senior backend developer",
    "Using NodeJS, build production grade apps including REST APIs and GraphQL APIs",
    "Authentication, File I/O, Databases (SQL, MongoDB), Express Framework, Sockets, plus many other important topics a backend developer should know",
    "Load balancing, Monitoring, CI/CD, and Zero Downtime Deployment",
    "Focus on security best practices throughout the course so you can be confident with your deployments",
  ];

  return (
    <Flex justify="center">
      <Box
        bg="white"
        my="5"
        py="6"
        px="6"
        maxW="598px"
        w="100%"
        borderRadius="14px"
        boxShadow="0 10px 30px rgba(22,33,62,0.08)"
        border="1px solid"
        borderColor="gray.100"
      >
        <Flex align="center" gap="2" pb="4">
          <Box w="4px" h="18px" bg={GOLD} borderRadius="full" />
          <Heading size="sm" color={PLUM}>
            What you'll learn
          </Heading>
        </Flex>

        <Box
          display="grid"
          gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
          gap="2"
        >
          {list.map((item, i) => (
            <Flex
              key={i}
              align="flex-start"
              gap="2"
              p="2"
              borderRadius="8px"
              transition="all 0.15s ease"
              _hover={{ bg: BLUSH, transform: "translateX(2px)" }}
            >
              <Flex
                align="center"
                justify="center"
                boxSize="18px"
                minW="18px"
                mt="1px"
                borderRadius="full"
                bg={BRAND}
                color={GOLD}
              >
                <FaCheck size="9px" />
              </Flex>
              <Text fontSize="12px" color="gray.600" lineHeight="1.5">
                {item}
              </Text>
            </Flex>
          ))}
        </Box>
      </Box>
    </Flex>
  );
};

export default SingleList;