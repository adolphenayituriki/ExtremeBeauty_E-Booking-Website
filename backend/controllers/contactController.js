const Contact = require('../models/Contact');
const { sendReplyEmail } = require('../utils/mailer');
const { logChange } = require('../utils/audit');

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const replyContact = async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!message || !String(message).trim()) {
      return res.status(400).json({ success: false, message: 'Reply message is required' });
    }
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact message not found' });

    const replySubject = subject && String(subject).trim()
      ? String(subject).trim()
      : `Re: ${contact.subject}`;

    const result = await sendReplyEmail(contact.email, {
      subject: replySubject,
      message,
      originalSubject: contact.subject,
    });

    contact.replied = true;
    contact.replies = contact.replies || [];
    contact.replies.push({
      subject: replySubject,
      message: String(message).trim(),
      sentAt: new Date(),
    });
    await contact.save();

    logChange(req, 'replied', 'Message', contact._id, {
      to: contact.email,
      subject: replySubject,
    });

    res.json({
      success: true,
      delivered: result.delivered,
      message: result.delivered ? 'Reply sent successfully' : 'Reply recorded (email delivery not enabled)',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    logChange(req, 'deleted', 'Message', req.params.id, { name: contact.name, email: contact.email, subject: contact.subject });
    res.json({ success: true, message: 'Contact message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getContacts, createContact, replyContact, deleteContact };
