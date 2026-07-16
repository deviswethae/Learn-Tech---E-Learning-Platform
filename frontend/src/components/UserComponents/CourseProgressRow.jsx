import { Box, Flex, Text, Image } from "@chakra-ui/react";

// Navy Scholar tokens — kept local so this drops into the existing theme
// without depending on a shared theme file that may not exist yet.
const INK_NAVY = "#101F38";
const GOLD = "#C6A15B";
const PARCHMENT = "#F4EDE0";
const PARCHMENT_LINE = "#DCCFB0";

const CourseProgressRow = ({ course, watched, total, percent }) => {
  return (
    <Flex
      align="center"
      gap={5}
      py={4}
      borderBottom="1px solid"
      borderColor={PARCHMENT_LINE}
      _last={{ borderBottom: "none" }}
    >
      <Image
        src={course?.img || "https://via.placeholder.com/64x64?text=%20"}
        alt={course?.title}
        boxSize="56px"
        objectFit="cover"
        borderRadius="4px"
        border="1px solid"
        borderColor={PARCHMENT_LINE}
        flexShrink={0}
      />

      <Box flex="1" minW={0}>
        <Text
          fontFamily="'Playfair Display', serif"
          fontWeight="700"
          fontSize="17px"
          color={INK_NAVY}
          noOfLines={1}
        >
          {course?.title || "Untitled Course"}
        </Text>
        <Text fontSize="13px" color="#6B6656" mt="1px">
          {watched} of {total} lesson{total === 1 ? "" : "s"} watched
        </Text>

        {/* the ledger fill-bar — a rule that fills with gold, not a rounded pill */}
        <Box
          mt={2}
          h="6px"
          w="100%"
          bg={PARCHMENT}
          border="1px solid"
          borderColor={PARCHMENT_LINE}
          borderRadius="2px"
          overflow="hidden"
        >
          <Box
            h="100%"
            w={`${percent}%`}
            bg={GOLD}
            transition="width 0.4s ease"
          />
        </Box>
      </Box>

      <Text
        fontFamily="'Playfair Display', serif"
        fontWeight="700"
        fontSize="26px"
        color={percent === 100 ? GOLD : INK_NAVY}
        minW="64px"
        textAlign="right"
      >
        {percent}%
      </Text>
    </Flex>
  );
};

export default CourseProgressRow;