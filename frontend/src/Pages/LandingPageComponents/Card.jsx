import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const PARCHMENT_LINE = "#E3DCC8";

const fallbackImages = [
  "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/ddp/branding/mba-macquarie/thumbnail.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=204&fit=crop&q=50",
  "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/ddp/branding/bachelor-of-science-computer-science-bits/2c1c9800-93b0-48df-b278-a5246da9e086.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=204&q=50&fit=crop",
  "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://s3.amazonaws.com/coursera_assets/ddp/branding/mads-umich/thumbnail.jpg?auto=format%2Ccompress%2C%20enhance&dpr=1&w=265&h=204&q=50&fit=crop",
  "https://cdn.dribbble.com/users/1141617/screenshots/20111093/media/f5852b7b0c7d5831f0081fce75bd1641.jpg?compress=1&resize=1000x750&vertical=center",
];

const Card = ({ course, title, category, description, _id, img }) => {
  const thumbnail = img || fallbackImages[Math.floor(Math.random() * fallbackImages.length)];

  return (
    <Link to={`/course/${_id}`} target="_blank">
      <Box
        bg="white"
        border="1px solid"
        borderColor={PARCHMENT_LINE}
        borderRadius="14px"
        overflow="hidden"
        boxShadow="0 8px 24px rgba(16,31,56,0.08)"
        m={2}
        h={{ sm: "400px", md: "380px", lg: "380px" }}
        display="flex"
        flexDirection="column"
        transition="transform 0.2s ease, box-shadow 0.2s ease"
        _hover={{
          transform: "translateY(-3px)",
          boxShadow: "0 16px 36px rgba(16,31,56,0.16)",
          cursor: "pointer",
        }}
      >
        <Image src={thumbnail} alt={title} objectFit="cover" h="150px" w="100%" flexShrink={0} />

        <Flex direction="column" flex="1" p="5" textAlign="left">
          <Text
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color={GOLD}
            mb="2"
          >
            {category}
          </Text>

          <Text
            fontSize="16px"
            fontWeight="700"
            color={INK_NAVY}
            mb="2"
            textTransform="capitalize"
            noOfLines={2}
          >
            {title}
          </Text>

          <Text fontSize="13px" color="gray.500" noOfLines={3} mb="3">
            {description?.substring(0, 90)}...
          </Text>

          <Box mt="auto">
            <Text fontSize="11px" color="gray.400" mb="2">
              {course}
            </Text>
            <Box
              display="inline-block"
              bg={INK_NAVY}
              color="white"
              fontSize="11px"
              fontWeight="700"
              px="3"
              py="1.5"
              borderRadius="6px"
              transition="all 0.15s ease"
              _hover={{ bg: GOLD, color: INK_NAVY }}
            >
              View course
            </Box>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
};

export default Card;