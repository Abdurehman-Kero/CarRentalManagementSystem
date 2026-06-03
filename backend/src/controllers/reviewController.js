// src/controllers/reviewController.js
const pool = require("../lib/db");

// ── Get all reviews ───────────────────────────────────────────────
const getAllReviews = async (req, res) => {
  try {
    const { carId, custId } = req.query;
    const where = [],
      params = [];

    if (carId) {
      where.push("r.CarID = ?");
      params.push(parseInt(carId));
    }
    if (custId) {
      where.push("r.CustID = ?");
      params.push(parseInt(custId));
    }

    const [reviews] = await pool.query(
      `SELECT r.*,
              r.Date AS ReviewDate,
              c.FullName AS CustomerName,
              ca.Brand, ca.Model, ca.LicensePlate
       FROM review r
       LEFT JOIN customer c  ON r.CustID = c.CustID
       LEFT JOIN car      ca ON r.CarID  = ca.CarID
       ${where.length ? "WHERE " + where.join(" AND ") : ""}
       ORDER BY r.Date DESC`,
      params,
    );
    res.json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get review by ID ──────────────────────────────────────────────
const getReviewById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, c.FullName AS CustomerName, ca.Brand, ca.Model
       FROM review r
       LEFT JOIN customer c ON r.CustID = c.CustID
       LEFT JOIN car ca ON r.CarID = ca.CarID
       WHERE r.ReviewID = ?`,
      [req.params.id],
    );
    if (!rows.length)
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Create review ─────────────────────────────────────────────────
const createReview = async (req, res) => {
  try {
    const {
      ReviewID,
      Rating,
      Comment,
      Date: ReviewDate,
      CustID,
      CarID,
    } = req.body;
    if (Rating === undefined || !CustID || !CarID)
      return res
        .status(400)
        .json({
          success: false,
          error: "Rating, CustID and CarID are required",
        });

    if (Rating < 1 || Rating > 5)
      return res
        .status(400)
        .json({ success: false, error: "Rating must be between 1 and 5" });

    let reviewId = ReviewID ? parseInt(ReviewID) : null;
    if (!reviewId) {
      const [rows] = await pool.query(
        "SELECT COALESCE(MAX(ReviewID), 0) AS maxId FROM review",
      );
      reviewId = (rows[0]?.maxId || 0) + 1;
    }

    await pool.query(
      `INSERT INTO review (ReviewID, Rating, Comment, Date, CustID, CarID) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        reviewId,
        parseInt(Rating),
        Comment?.trim() || null,
        ReviewDate ? new Date(ReviewDate) : new Date(),
        parseInt(CustID),
        parseInt(CarID),
      ],
    );

    const [review] = await pool.query(
      `SELECT r.*, r.Date AS ReviewDate, c.FullName AS CustomerName, ca.Brand, ca.Model
       FROM review r
       LEFT JOIN customer c ON r.CustID = c.CustID
       LEFT JOIN car ca ON r.CarID = ca.CarID
       WHERE r.ReviewID = ?`,
      [reviewId],
    );
    res.status(201).json({ success: true, data: review[0] });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res
        .status(409)
        .json({ success: false, error: "ReviewID already exists" });
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Delete review ─────────────────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM review WHERE ReviewID = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    res.json({ success: true, message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── Get review stats (avg rating per car) ─────────────────────────
const getReviewStats = async (req, res) => {
  try {
    const [stats] = await pool.query(
      `SELECT AVG(Rating) AS AvgRating, COUNT(*) AS TotalReviews,
              SUM(CASE WHEN Rating = 5 THEN 1 ELSE 0 END) AS FiveStar,
              SUM(CASE WHEN Rating = 4 THEN 1 ELSE 0 END) AS FourStar,
              SUM(CASE WHEN Rating = 3 THEN 1 ELSE 0 END) AS ThreeStar,
              SUM(CASE WHEN Rating <= 2 THEN 1 ELSE 0 END) AS LowRating
       FROM review`,
    );
    res.json({ success: true, data: stats[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  deleteReview,
  getReviewStats,
};
