const Session = require("../models/Session");

/**
 * GET /sessions
 * Public: list published sessions, optionally ?limit= & ?skip=
 */
exports.listPublished = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || "20"), 100);
    const skip = parseInt(req.query.skip || "0");
    const sessions = await Session.find({ status: "published" })
      .sort({ updated_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user_id", "email");
    res.json({ count: sessions.length, sessions });
  } catch (err) {
    console.error("listPublished error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /my-sessions
 * Protected: returns the user's sessions (draft + published)
 */
exports.listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const sessions = await Session.find({ user_id: userId }).sort({ updated_at: -1 });
    res.json({ count: sessions.length, sessions });
  } catch (err) {
    console.error("listMine error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /my-sessions/:id
 * Protected: returns a single session for the user
 */
exports.getOne = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ message: "Session not found" });
    if (session.user_id.toString() !== userId) return res.status(403).json({ message: "Forbidden" });
    res.json(session);
  } catch (err) {
    console.error("getOne error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /my-sessions/save-draft
 * Body: { id? , title, tags (array or comma string), json_file_url }
 * If id is present -> update (if owner), else create
 */
exports.saveDraft = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, tags, json_file_url } = req.body;

    if (!title || title.trim().length === 0) return res.status(400).json({ message: "Title is required" });

    const tagsArr = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : []);

    if (id) {
      // update
      const s = await Session.findById(id);
      if (!s) return res.status(404).json({ message: "Session not found" });
      if (s.user_id.toString() !== userId) return res.status(403).json({ message: "Forbidden" });

      s.title = title;
      s.tags = tagsArr;
      s.json_file_url = json_file_url || "";
      s.status = "draft";
      await s.save();
      return res.json({ message: "Draft updated", session: s });
    } else {
      const newS = new Session({
        user_id: userId,
        title,
        tags: tagsArr,
        json_file_url: json_file_url || "",
        status: "draft"
      });
      await newS.save();
      return res.status(201).json({ message: "Draft saved", session: newS });
    }
  } catch (err) {
    console.error("saveDraft error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * POST /my-sessions/publish
 * Body: { id, title?, tags?, json_file_url? }
 * Publishes an existing draft (or creates+publishes if no id)
 */
exports.publish = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id, title, tags, json_file_url } = req.body;

    const tagsArr = Array.isArray(tags) ? tags : (typeof tags === "string" ? tags.split(",").map(t => t.trim()).filter(Boolean) : []);

    if (id) {
      const s = await Session.findById(id);
      if (!s) return res.status(404).json({ message: "Session not found" });
      if (s.user_id.toString() !== userId) return res.status(403).json({ message: "Forbidden" });

      if (title) s.title = title;
      if (tagsArr.length) s.tags = tagsArr;
      if (typeof json_file_url !== "undefined") s.json_file_url = json_file_url;
      s.status = "published";
      await s.save();
      return res.json({ message: "Session published", session: s });
    } else {
      if (!title) return res.status(400).json({ message: "Title required to create+publish" });

      const newS = new Session({
        user_id: userId,
        title,
        tags: tagsArr,
        json_file_url: json_file_url || "",
        status: "published"
      });

      await newS.save();
      return res.status(201).json({ message: "Session created & published", session: newS });
    }
  } catch (err) {
    console.error("publish error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
