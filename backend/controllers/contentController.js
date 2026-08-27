const Content = require('../models/Content');
const { logChange } = require('../utils/audit');

const getContent = async (req, res) => {
  try {
    const content = await Content.findOne({ key: req.params.key });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    res.json({ success: true, data: content.data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllContent = async (req, res) => {
  try {
    const all = await Content.find();
    const result = {};
    all.forEach((c) => { result[c.key] = c.data; });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const upsertContent = async (req, res) => {
  try {
    const { key, data } = req.body;
    if (!key) return res.status(400).json({ success: false, message: 'Content key is required' });
    const content = await Content.findOneAndUpdate(
      { key },
      { data },
      { new: true, upsert: true, runValidators: true }
    );
    logChange(req, 'updated', 'Content', key, { key, size: Array.isArray(data) ? data.length : 1 });
    res.json({ success: true, data: content.data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({ key: req.params.key });
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
    logChange(req, 'deleted', 'Content', req.params.key, { key: req.params.key });
    res.json({ success: true, message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContent, getAllContent, upsertContent, deleteContent };
