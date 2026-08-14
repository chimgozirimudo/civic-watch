const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite Database (creates a file named 'database.sqlite' in your backend folder)
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run("PRAGMA foreign_keys = ON");
  }
});

// Create the 'reports' table if it doesn't already exist
db.run(
  `CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    location TEXT NOT NULL,
    latitude REAL,
    longitude REAL,
    status TEXT DEFAULT 'Pending',
    priority TEXT DEFAULT 'Medium',
    support_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    } else {
      console.log("Reports table is ready.");
    }
  },
);

db.run(`ALTER TABLE reports ADD COLUMN priority TEXT DEFAULT 'Medium'`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error("Error adding priority column:", err.message);
  }
});

db.run(`ALTER TABLE reports ADD COLUMN support_count INTEGER DEFAULT 0`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error("Error adding support count column:", err.message);
  }
});

db.run(`ALTER TABLE reports ADD COLUMN latitude REAL`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error("Error adding latitude column:", err.message);
  }
});

db.run(`ALTER TABLE reports ADD COLUMN longitude REAL`, (err) => {
  if (err && !err.message.includes("duplicate column name")) {
    console.error("Error adding longitude column:", err.message);
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS report_timeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
)`,
  (err) => {
    if (err) {
      console.error("Error creating timeline table:", err.message);
    } else {
      console.log("Report timeline table is ready.");
    }
  },
);

db.run(
  `CREATE TABLE IF NOT EXISTS report_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    report_id INTEGER NOT NULL,
    author TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
)`,
  (err) => {
    if (err) {
      console.error("Error creating comments table:", err.message);
    } else {
      console.log("Report comments table is ready.");
    }
  },
);

// Add this inside your database initialization table setup
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'citizen'
)`);

// Register Route
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  const userRole = role || "citizen";

  const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, email, password, userRole], function (err) {
    if (err) {
      return res
        .status(400)
        .json({ error: "Email already registered or invalid data." });
    }
    res.json({
      message: "User registered successfully!",
      userId: this.lastID,
      role: userRole,
    });
  });
});

// Login Route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error." });
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Return user details including role so the frontend knows where to route them
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Civic Reporter API is running!" });
});

// ==================== API ROUTES ====================

// 1. CREATE a new report (POST /reports)
app.post("/reports", (req, res) => {
  const { title, description, image, location, priority, latitude, longitude } = req.body;

  if (!title || !description || !location) {
    return res
      .status(400)
      .json({ error: "Title, description, and location are required." });
  }

  const hasLatitude = latitude !== undefined && latitude !== null && latitude !== "";
  const hasLongitude = longitude !== undefined && longitude !== null && longitude !== "";
  const parsedLatitude = hasLatitude ? Number(latitude) : null;
  const parsedLongitude = hasLongitude ? Number(longitude) : null;

  if (
    (hasLatitude || hasLongitude) &&
    (!Number.isFinite(parsedLatitude) ||
      !Number.isFinite(parsedLongitude) ||
      parsedLatitude < -90 ||
      parsedLatitude > 90 ||
      parsedLongitude < -180 ||
      parsedLongitude > 180)
  ) {
    return res.status(400).json({ error: "Valid map coordinates are required." });
  }

  const reportPriority = priority || "Medium";
  const query = `INSERT INTO reports (title, description, image, location, priority, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    title,
    description,
    image || "",
    location,
    reportPriority,
    parsedLatitude,
    parsedLongitude,
  ];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Report created successfully!",
      reportId: this.lastID,
    });

    db.run(
      `INSERT INTO report_timeline (report_id, type, message) VALUES (?, ?, ?)`,
      [this.lastID, "created", "Report submitted by a citizen."],
    );
  });
});

// 2. GET all reports (GET /reports)
app.get("/reports", (req, res) => {
  const query = `SELECT * FROM reports ORDER BY created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ reports: rows });
  });
});

// 3. GET a single report by ID (GET /reports/:id)
app.get("/reports/:id", (req, res) => {
  const reportQuery = `SELECT * FROM reports WHERE id = ?`;
  db.get(reportQuery, [req.params.id], (err, report) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    db.all(
      `SELECT * FROM report_timeline WHERE report_id = ? ORDER BY created_at ASC, id ASC`,
      [req.params.id],
      (timelineErr, timeline) => {
        if (timelineErr) {
          return res.status(500).json({ error: timelineErr.message });
        }

        db.all(
          `SELECT * FROM report_comments WHERE report_id = ? ORDER BY created_at ASC, id ASC`,
          [req.params.id],
          (commentsErr, comments) => {
            if (commentsErr) {
              return res.status(500).json({ error: commentsErr.message });
            }

            const fallbackTimeline =
              timeline.length > 0
                ? timeline
                : [
                    {
                      id: 0,
                      report_id: report.id,
                      type: "created",
                      message: "Report submitted by a citizen.",
                      created_at: report.created_at,
                    },
                  ];

            res.json({ report, timeline: fallbackTimeline, comments });
          },
        );
      },
    );
  });
});

// 4. UPDATE report status (PUT /reports/:id/status)
app.put("/reports/:id/status", (req, res) => {
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required." });
  }

  const query = `UPDATE reports SET status = ? WHERE id = ?`;
  db.run(query, [status, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Report not found." });
    }

    db.run(
      `INSERT INTO report_timeline (report_id, type, message) VALUES (?, ?, ?)`,
      [req.params.id, "status", `Status changed to ${status}.`],
    );

    res.json({ message: "Report status updated successfully!" });
  });
});

// 5. UPDATE report priority (PUT /reports/:id/priority)
app.put("/reports/:id/priority", (req, res) => {
  const { priority } = req.body;
  const allowedPriorities = ["Low", "Medium", "High", "Urgent"];

  if (!allowedPriorities.includes(priority)) {
    return res.status(400).json({ error: "Valid priority is required." });
  }

  const query = `UPDATE reports SET priority = ? WHERE id = ?`;
  db.run(query, [priority, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Report not found." });
    }

    db.run(
      `INSERT INTO report_timeline (report_id, type, message) VALUES (?, ?, ?)`,
      [req.params.id, "priority", `Priority changed to ${priority}.`],
    );

    res.json({ message: "Report priority updated successfully!" });
  });
});

// 6. SUPPORT a report (POST /reports/:id/support)
app.post("/reports/:id/support", (req, res) => {
  const query = `UPDATE reports SET support_count = COALESCE(support_count, 0) + 1 WHERE id = ?`;

  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Report not found." });
    }

    db.get(
      `SELECT support_count FROM reports WHERE id = ?`,
      [req.params.id],
      (selectErr, row) => {
        if (selectErr) {
          return res.status(500).json({ error: selectErr.message });
        }

        res.json({
          message: "Report support recorded!",
          support_count: row.support_count,
        });
      },
    );
  });
});

// 7. ADD a comment to a report (POST /reports/:id/comments)
app.post("/reports/:id/comments", (req, res) => {
  const { author, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Comment message is required." });
  }

  db.get(`SELECT id FROM reports WHERE id = ?`, [req.params.id], (err, report) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    const commentAuthor = author && author.trim() ? author.trim() : "Citizen";
    db.run(
      `INSERT INTO report_comments (report_id, author, message) VALUES (?, ?, ?)`,
      [req.params.id, commentAuthor, message.trim()],
      function (commentErr) {
        if (commentErr) {
          return res.status(500).json({ error: commentErr.message });
        }

        res.status(201).json({
          message: "Comment added successfully!",
          comment: {
            id: this.lastID,
            report_id: Number(req.params.id),
            author: commentAuthor,
            message: message.trim(),
          },
        });
      },
    );
  });
});

// 8. DELETE a report (DELETE /reports/:id)
app.delete("/reports/:id", (req, res) => {
  const query = `DELETE FROM reports WHERE id = ?`;
  db.run(query, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Report not found." });
    }
    res.json({ message: "Report deleted successfully!" });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
