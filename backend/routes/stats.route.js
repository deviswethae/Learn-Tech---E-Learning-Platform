const express = require("express");
const { UserModel } = require("../models/users.models");
const courseModel = require("../models/courses.model");
const { VideoModel } = require("../models/video.model");
const { auth } = require("../middlewares/users.middleware");

const statsRoute = express.Router();
statsRoute.use(auth);

// GET /stats/admin — platform-wide counts
statsRoute.get("/admin", async (req, res) => {
  try {
    if (req.body.role !== "admin") {
      return res.status(401).json({ error: "you don't have access to stats" });
    }
    const [totalUsers, totalTeachers, totalCourses, totalVideos] = await Promise.all([
      UserModel.countDocuments({ role: "user" }),
      UserModel.countDocuments({ role: "teacher" }),
      courseModel.countDocuments(),
      VideoModel.countDocuments(),
    ]);
    res.status(200).json({ totalUsers, totalTeachers, totalCourses, totalVideos });
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});

// GET /stats/teacher — counts + per-course breakdown for the logged-in teacher
statsRoute.get("/teacher", async (req, res) => {
  try {
    const teacherId = req.body.userId;
    const courses = await courseModel.find({ teacherId }).populate("videos");

    const totalCourses = courses.length;
    const totalVideos = courses.reduce((sum, c) => sum + (c.videos?.length || 0), 0);

    const perCourse = await Promise.all(
      courses.map(async (c) => {
        const enrolledUsers = await UserModel.countDocuments({ course: c._id });
        return {
          _id: c._id,
          title: c.title,
          category: c.category,
          img: c.img,
          videos: c.videos?.length || 0,
          enrolledUsers,
        };
      })
    );

    const totalStudents = perCourse.reduce((sum, c) => sum + c.enrolledUsers, 0);

    res.status(200).json({ totalCourses, totalVideos, totalStudents, courses: perCourse });
  } catch (err) {
    res.status(400).json({ message: "Something Went Wrong", error: err.message });
  }
});

module.exports = { statsRoute };