import { Box, Wrap, WrapItem } from "@chakra-ui/react";
import LandingPageCarousel from "../../Pages/LandingPageComponents/LandingPageCarousel";

// Trimmed down to just the course grid — the dashboard page itself
// supplies the section heading ("All courses"), and progress is
// already covered by CourseProgressLedger, so the old "In Progress
// Courses" / "Top courses in ..." carousels were removed.
const CourseComponent = () => {
  return (
    <Box>
      <Wrap spacing={4} justify={{ base: "center", md: "flex-start" }}>
        <WrapItem w="100%">
          <LandingPageCarousel />
        </WrapItem>
      </Wrap>
    </Box>
  );
};

export default CourseComponent;