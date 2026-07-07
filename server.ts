import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Setup Web Push
const vapidPublicKey = process.env.VITE_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidPublicKey,
    vapidPrivateKey
  );
}

app.use(express.json());

// In-memory store for subscriptions (for prototype/demo)
// In a real app, this should be a database
const subscriptions: any[] = [];

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  
  // Check if subscription already exists
  const exists = subscriptions.find(s => s.endpoint === subscription.endpoint);
  if (!exists) {
    subscriptions.push(subscription);
  }
  
  res.status(201).json({ message: "Subscription added successfully" });
});

app.post("/api/notify-all", async (req, res) => {
  const notificationPayload = JSON.stringify({
    title: req.body.title || "Health Alert",
    body: req.body.body || "New health update available",
    icon: "/icon.png", // Make sure to have an icon if needed or use a public URL
    data: req.body.data || {}
  });

  const pushPromises = subscriptions.map(subscription => {
    return webpush.sendNotification(subscription, notificationPayload)
      .catch(err => {
        console.error("Error sending notification:", err);
        if (err.statusCode === 401 || err.statusCode === 410) {
          // Subscription has expired or is no longer valid
          const index = subscriptions.indexOf(subscription);
          if (index > -1) subscriptions.splice(index, 1);
        }
      });
  });

  await Promise.all(pushPromises);
  res.status(200).json({ message: "Notifications sent", count: subscriptions.length });
});

// Vite middleware setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupVite();
