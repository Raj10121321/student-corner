const express = require('express');
const bcrypt = require('bcrypt');
const supabase = require('../config/supabase');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { sendEmail } = require('../services/emailService');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.redirect('/admin/login');
});

// Admin login route
router.get('/login', (req, res) => {
  res.render('adminLogin');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

router.get('/users/add', (req, res) => {
  res.render('addUser');
});

router.get('/events/add', (req, res) => {
  res.render('addEvent');
});

router.get('/hackathons/add', (req, res) => {
  res.render('addHackathon');
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);

  try {
    const { data: results, error } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .maybeSingle(); // Use maybeSingle() to handle no results gracefully

    if (error) {
      console.error('Database query error:', error);
      return res.render('adminLogin', { error: 'An error occurred. Please try again.' });
    }

    if (!results) {
      return res.render('adminLogin', { error: 'Invalid credentials' });
    }

    const admin = results;
    if (admin && admin.password) {
      try {
        const match = await bcrypt.compare(password, admin.password);

        if (match) {
          req.session.admin = admin;
          res.redirect('/admin/dashboard');
        } else {
          res.render('adminLogin', { error: 'Invalid credentials' });
        }
      } catch (error) {
        console.error('Error during password comparison:', error);
        res.render('adminLogin', { error: 'An error occurred. Please try again.' });
      }
    } else {
      res.render('adminLogin', { error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.render('adminLogin', { error: 'An error occurred. Please try again.' });
  }
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
  try {
    // Fetch all counts in parallel
    const [usersResult, eventsResult, hackathonsResult] = await Promise.all([
      supabase.from('accounts').select('*'),
      supabase.from('events').select('*'),
      supabase.from('hackathons').select('*')
    ]);

    if (usersResult.error) throw usersResult.error;
    if (eventsResult.error) throw eventsResult.error;
    if (hackathonsResult.error) throw hackathonsResult.error;

    const userCount = usersResult.data.length;
    const eventCount = eventsResult.data.length;
    const hackathonCount = hackathonsResult.data.length;

    if (req.session.admin) {
      res.render('adminDashboard', { userCount, eventCount, hackathonCount });
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('An error occurred while loading the dashboard');
  }
});

// Add user
router.post('/users/add', async (req, res) => {
  const { name, phonenumber, email, dob, gender, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        name,
        phonenumber,
        email,
        dob,
        gender,
        password
      });

    if (error) throw error;

    res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).send('Error adding user');
  }
});

// Get unique emails for notifications
async function getUniqueEmails() {
  try {
    // Get emails from newsletters
    const { data: newsletterEmails, error: newsletterError } = await supabase
      .from('newsletters')
      .select('email');

    if (newsletterError) throw newsletterError;

    // Get emails from accounts
    const { data: accountEmails, error: accountsError } = await supabase
      .from('accounts')
      .select('email');

    if (accountsError) throw accountsError;

    // Combine and deduplicate emails
    const allEmails = [
      ...newsletterEmails.map(e => e.email),
      ...accountEmails.map(e => e.email)
    ];

    return [...new Set(allEmails)];
  } catch (error) {
    console.error('Error fetching emails:', error);
    throw error;
  }
}

// Send notification emails
async function sendNotificationEmails(type, name, emails) {
  const subject = `New ${type} Added: ${name}`;
  const text = `
Dear Subscriber,

We're excited to inform you that a new ${type.toLowerCase()} has been added to our platform!

Event Details:
- Name: "${name}"
- Type: ${type}

We encourage you to check it out and learn more about this exciting opportunity. Visit the following link to view all events, including this new addition:

http://localhost:3000/events

Log in to your account to view full details, including date, time, location, and how to participate.

Don't miss out on this chance to engage with the tech community and expand your skills!

If you have any questions or need further information, please don't hesitate to contact us.

Best regards,
The Tech Events Team

---
This is an automated notification. Please do not reply to this email.
`;

  for (const email of emails) {
    try {
      await sendEmail(email, subject, text);
      console.log(`Notification email sent to ${email}`);
    } catch (error) {
      console.error(`Error sending email to ${email}:`, error);
    }
  }
}

// Add event
router.post('/events/add', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'img', maxCount: 1 }]), async (req, res) => {
  const { eventName, deadlineDate, location, month, day, startingTime, endingTime, description, age, country } = req.body;
  const logoPath = req.files['logo'] ? '/images/uploads/' + req.files['logo'][0].filename : null;
  const imgPath = req.files['img'] ? '/images/uploads/' + req.files['img'][0].filename : null;
  const eventid = uuidv4();

  try {
    // Insert event
    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        id: eventid,
        deadlinedate: deadlineDate,
        eventname: eventName,
        logo: logoPath,
        location,
        month,
        day,
        img: imgPath,
        startingtime: startingTime,
        endingtime: endingTime,
        description,
        age,
        country,
        status: 'active'
      });

    if (insertError) throw insertError;

    try {
      const emails = await getUniqueEmails();
      await sendNotificationEmails('Event', eventName, emails);
      res.status(200).json({ message: 'Event added successfully' });
    } catch (error) {
      console.error('Error in notification process:', error);
      res.status(200).json({ message: 'Event added successfully, but there was an error sending notifications' });
    }
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).send('Error adding event');
  }
});

// Add hackathon
router.post('/hackathons/add', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'img', maxCount: 1 }]), async (req, res) => {
  const { eventName, deadlineDate, location, month, day, startingTime, endingTime, description, age, country } = req.body;
  const logoPath = req.files['logo'] ? '/images/uploads/' + req.files['logo'][0].filename : null;
  const imgPath = req.files['img'] ? '/images/uploads/' + req.files['img'][0].filename : null;
  const eventid = uuidv4();

  try {
    // Insert hackathon
    const { data, error: insertError } = await supabase
      .from('hackathons')
      .insert({
        id: eventid,
        eventname: eventName,
        deadlinedate: deadlineDate,
        location,
        month,
        day,
        startingtime: startingTime,
        endingtime: endingTime,
        description,
        age,
        country,
        logo: logoPath,
        img: imgPath,
        status: 'active'
      });

    if (insertError) throw insertError;

    try {
      const emails = await getUniqueEmails();
      await sendNotificationEmails('Hackathon', eventName, emails);
      res.status(200).json({ message: 'Hackathon added successfully' });
    } catch (error) {
      console.error('Error in notification process:', error);
      res.status(200).json({ message: 'Hackathon added successfully, but there was an error sending notifications' });
    }
  } catch (error) {
    console.error('Error adding hackathon:', error);
    res.status(500).json({ error: 'Error adding hackathon' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('accounts')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    res.render('adminUsers', { users: results });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('An error occurred while fetching users');
  }
});

// Get single user
router.get('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const { data: results, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); // Use maybeSingle() to handle no results gracefully

    if (error) throw error;
    if (!results) {
      return res.status(404).send('User not found');
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred while fetching user');
  }
});

// Edit user
router.post('/users/:id/edit', express.json(), async (req, res) => {
  const userId = req.params.id;
  const { name, phonenumber, email, dob, gender, password } = req.body;

  console.log("Received data:", req.body);

  try {
    const { error } = await supabase
      .from('accounts')
      .update({
        name,
        phonenumber,
        email,
        dob,
        gender,
        password
      })
      .eq('id', userId);

    if (error) throw error;

    console.log("Update successful");
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating user' });
  }
});

// Delete user
router.post('/users/:id/delete', async (req, res) => {
  const userEmail = req.params.id;

  try {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('email', userEmail);

    if (error) throw error;

    console.log("Delete successful");
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'An error occurred while deleting user' });
  }
});

// Events management
router.get('/events', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('events')
      .select('*')
      .order('deadlinedate', { ascending: true });

    if (error) throw error;

    res.render('adminEvents', { events: results });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('An error occurred while fetching events');
  }
});

// Get single event
router.get('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  try {
    const { data: results, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .maybeSingle(); // Use maybeSingle() to handle no results gracefully

    if (error) throw error;
    if (!results) {
      return res.status(404).send('Event not found');
    }

    console.log(results);
    res.json(results);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).send('An error occurred while fetching event');
  }
});

// Edit event
router.post('/events/:id/edit', express.json(), async (req, res) => {
  const eventId = req.params.id;
  const { eventName, deadlineDate, location, month, day, startingTime, endingTime, description, age, country } = req.body;

  console.log("Received data:", req.body);

  try {
    const { error } = await supabase
      .from('events')
      .update({
        eventname: eventName,
        deadlinedate: deadlineDate,
        location,
        month,
        day,
        startingtime: startingTime,
        endingtime: endingTime,
        description,
        age,
        country
      })
      .eq('id', eventId);

    if (error) throw error;

    console.log("Update successful");
    res.status(200).json({ success: true, message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating event' });
  }
});

// Delete event
router.post('/events/:id/delete', async (req, res) => {
  const eventId = req.params.id;

  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;

    console.log("Delete successful");
    res.status(200).json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ success: false, message: 'An error occurred while deleting event' });
  }
});

// Hackathons management
router.get('/hackathons', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('deadlinedate', { ascending: true });

    if (error) throw error;

    res.render('adminHackathons', { hackathons: results });
  } catch (error) {
    console.error('Error fetching hackathons:', error);
    res.status(500).send('An error occurred while fetching hackathons');
  }
});

// Get single hackathon
router.get('/hackathons/:id', async (req, res) => {
  const hackathonId = req.params.id;

  try {
    const { data: results, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('id', hackathonId)
      .maybeSingle(); // Use maybeSingle() to handle no results gracefully

    if (error) throw error;
    if (!results) {
      return res.status(404).send('Hackathon not found');
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching hackathon:', error);
    res.status(500).send('An error occurred while fetching hackathon');
  }
});

// Edit hackathon
router.post('/hackathons/:id/edit', express.json(), async (req, res) => {
  const hackathonId = req.params.id;
  const { hackathonName, deadlineDate, location, month, day, startingTime, endingTime, description, age, country } = req.body;

  console.log("Received data:", req.body);

  try {
    const { error } = await supabase
      .from('hackathons')
      .update({
        eventname: hackathonName,
        deadlinedate: deadlineDate,
        location,
        month,
        day,
        startingtime: startingTime,
        endingtime: endingTime,
        description,
        age,
        country
      })
      .eq('id', hackathonId);

    if (error) throw error;

    console.log("Update successful");
    res.status(200).json({ success: true, message: 'Hackathon updated successfully' });
  } catch (error) {
    console.error('Error updating hackathon:', error);
    res.status(500).json({ success: false, message: 'An error occurred while updating hackathon' });
  }
});

// Delete hackathon
router.post('/hackathons/:id/delete', async (req, res) => {
  const hackathonId = req.params.id;

  try {
    const { error } = await supabase
      .from('hackathons')
      .delete()
      .eq('id', hackathonId);

    if (error) throw error;

    console.log("Delete successful");
    res.status(200).json({ success: true, message: 'Hackathon deleted successfully' });
  } catch (error) {
    console.error('Error deleting hackathon:', error);
    res.status(500).json({ success: false, message: 'An error occurred while deleting hackathon' });
  }
});

module.exports = router;
