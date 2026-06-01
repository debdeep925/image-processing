import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs-extra";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, "uploads");
const META_FILE = path.join(UPLOAD_DIR, "metadata.json");

// ensure folder exists
fs.ensureDirSync(UPLOAD_DIR);

// initialize metadata file
if (!fs.existsSync(META_FILE)) {
  fs.writeJsonSync(META_FILE, []);
}

// --------------------
// Multer setup
// --------------------
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// --------------------
// APIs
// --------------------

// 📤 Upload single/multiple images (folder upload supported)
app.post("/api/upload", upload.array("images"), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];

    const metadata = await fs.readJson(META_FILE);

    files.forEach((file) => {
      metadata.push({
        filename: file.filename,
        originalName: file.originalname,
        uploadedAt: new Date().toISOString(),
      });
    });

    await fs.writeJson(META_FILE, metadata, { spaces: 2 });

    res.json({
      success: true,
      uploaded: files.length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 📂 Get all images (admin panel)
app.get("/api/images", async (_req, res) => {
  try {
    const metadata = await fs.readJson(META_FILE);

    const result = metadata.map((file: any) => ({
      ...file,
      url: `http://localhost:5000/uploads/${file.filename}`,
    }));

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 📁 Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Server is running successfully",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --------------------
// Start server
// --------------------
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
