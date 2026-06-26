const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const { isValidEmail, isValidMobileNumber } = require("../utils/validation");
const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');
const generateNumericOTP = require('../utils/generateOTP');

// Global variables
const upcomingEvents = [];
const upcomingHackthons = [];
const EnrolledEvents = [];
const EnrolledHackthons = [];
const PastEnrolledEvents = [];
const PastEnrolledHackthons = [];
const otps = {};

async function loadEventData() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    const eventData = data.map(row => ({
      id: row.id,
      deadlineDate: row.deadlinedate,
      eventName: row.eventname,
      logo: row.logo,
      location: row.location,
      month: row.month,
      day: row.day,
      status: row.status,
      moreDetails: {
        img: row.img,
        startingTime: row.startingtime,
        endingTime: row.endingtime,
        description: row.description,
        age: row.age,
        country: row.country
      }
    }));

    upcomingEvents.push(...eventData);
  } catch (error) {
    console.error('Error loading event data:', error);
    throw error;
  }
}

async function loadHackathonData() {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    if (data && data.length > 0) {
      const hackathonData = data.map(row => ({
        id: row.id,
        deadlineDate: row.deadlinedate,
        eventName: row.eventname,
        logo: row.logo,
        location: row.location,
        month: row.month,
        day: row.day,
        status: row.status,
        moreDetails: {
          img: row.img,
          startingTime: row.startingtime,
          endingTime: row.endingtime,
          description: row.description,
          age: row.age,
          country: row.country
        }
      }));

      upcomingHackthons.push(...hackathonData);
    }
  } catch (error) {
    console.error('Error loading hackathon data:', error);
    throw error;
  }
}

async function loadEnrolledEvents(userEmail) {
  try {
    const { data, error } = await supabase
      .from('enrolled_events')
      .select(`
        *,
        events:event_id (
          eventname,
          deadlinedate,
          location,
          img,
          day,
          month,
          status
        )
      `)
      .eq('user_email', userEmail);

    if (error) throw error;

    const enrolledEvents = data.map(row => ({
      id: row.event_id,
      name: row.events.eventname,
      location: row.events.location,
      image: row.events.img,
      deadline: row.events.deadlinedate,
      status: row.events.status,
      day: row.events.day,
      month: row.events.month
    }));

    EnrolledEvents.length = 0;
    EnrolledEvents.push(...enrolledEvents);
    return enrolledEvents;
  } catch (error) {
    console.error('Error loading enrolled events:', error);
    throw error;
  }
}

async function loadEnrolledHackathons(userEmail) {
  try {
    const { data, error } = await supabase
      .from('enrolled_hackathons')
      .select(`
        *,
        hackathons:hackathon_id (
          eventname,
          deadlinedate,
          location,
          img
        )
      `)
      .eq('user_email', userEmail);

    if (error) throw error;

    const enrolledHackathons = data.map(row => ({
      id: row.hackathon_id,
      name: row.hackathons.eventname,
      deadline: row.hackathons.deadlinedate,
      location: row.hackathons.location,
      image: row.hackathons.img
    }));

    EnrolledHackthons.length = 0;
    EnrolledHackthons.push(...enrolledHackathons);
    return enrolledHackathons;
  } catch (error) {
    console.error('Error loading enrolled hackathons:', error);
    throw error;
  }
}

async function loadPastEnrolledEvents(userEmail) {
  try {
    const { data, error } = await supabase
      .from('enrolled_events')
      .select(`
        events:event_id (
          id,
          deadlinedate,
          eventname,
          logo,
          location,
          month,
          day,
          img,
          startingtime,
          endingtime,
          description,
          age,
          country,
          status
        )
      `)
      .eq('user_email', userEmail);

    if (error) throw error;

    const pastEvents = data
      .filter(row => row.events.status === 'past')
      .map(row => ({
        id: row.events.id,
        name: row.events.eventname,
        location: row.events.location,
        image: row.events.img,
        deadline: row.events.deadlinedate,
        status: row.events.status,
        day: row.events.day,
        month: row.events.month
      }));

    PastEnrolledEvents.length = 0;
    PastEnrolledEvents.push(...pastEvents);
    return pastEvents;
  } catch (error) {
    console.error('Error loading past enrolled events:', error);
    throw error;
  }
}

async function loadPastEnrolledHackathons(userEmail) {
  try {
    const { data, error } = await supabase
      .from('enrolled_hackathons')
      .select(`
        hackathons:hackathon_id (
          id,
          deadlinedate,
          eventname,
          logo,
          location,
          month,
          day,
          img,
          startingtime,
          endingtime,
          description,
          age,
          country,
          status
        )
      `)
      .eq('user_email', userEmail);

    if (error) throw error;

    const pastHackathons = data
      .filter(row => row.hackathons.status === 'past')
      .map(row => ({
        id: row.hackathons.id,
        name: row.hackathons.eventname,
        location: row.hackathons.location,
        image: row.hackathons.img,
        deadline: row.hackathons.deadlinedate,
        status: row.hackathons.status,
        day: row.hackathons.day,
        month: row.hackathons.month
      }));

    PastEnrolledHackthons.length = 0;
    PastEnrolledHackthons.push(...pastHackathons);
    return pastHackathons;
  } catch (error) {
    console.error('Error loading past enrolled hackathons:', error);
    throw error;
  }
}

// Load data when the server starts
Promise.all([
  loadEventData(),
  loadHackathonData(),
  loadPastEnrolledEvents(''),
  loadPastEnrolledHackathons('')
])
  .then(() => {
    console.log('All data loaded successfully');
  })
  .catch((error) => {
    console.error('Error loading data:', error);
  });

// Refresh data function
function refreshData(userEmail) {
  upcomingEvents.length = 0;
  upcomingHackthons.length = 0;
  return Promise.all([
    loadEventData(),
    loadHackathonData(),
    loadEnrolledEvents(userEmail),
    loadEnrolledHackathons(userEmail),
    loadPastEnrolledEvents(userEmail),
    loadPastEnrolledHackathons(userEmail)
  ]);
}

// Routes
router.get("/", (req, res) => {
  const isAuthenticated = req.session.user ? true : false;
  res.render('landing', { isAuthenticated });
});

router.get("/signin", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("register");
});

router.get("/forgot-password", (req, res) => {
  res.render("forgotpass");
});

router.get('/newpass', (req, res) => {
  res.render('newpass');
});

router.get("/newPass", (req, res) => {
  res.render("newpass");
});

router.get('/my-events', (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    res.render('enrolled_events', { EnrolledEvents, PastEnrolledEvents });
  }
});

router.get('/my-hackathons', (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    res.render('enrolled_hackathons', { EnrolledHackthons, PastEnrolledHackthons });
  }
});

router.post('/profile/edit', async (req, res) => {
  const { name, email, phonenumber, gender, dob, password } = req.body;

  try {
    const { error } = await supabase
      .from('accounts')
      .update({
        name,
        email,
        phonenumber,
        gender,
        dob,
        password
      })
      .eq('email', req.session.user.email);

    if (error) throw error;

    res.status(200).json({ status: 'success', message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Supabase query error:', error);
    res.status(500).json({ status: 'error', message: 'An error occurred while updating user data' });
  }
});

router.get('/events', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    try {
      const userEmail = req.session.user.email;

      // Fetch all events
      const { data: eventsResults, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'active');

      if (eventsError) throw eventsError;

      // Fetch user's enrolled events
      const { data: enrollmentsResults, error: enrollmentsError } = await supabase
        .from('enrolled_events')
        .select('event_id')
        .eq('user_email', userEmail);

      if (enrollmentsError) throw enrollmentsError;

      // Create a set of enrolled event IDs for quick lookup
      const enrolledEventIds = new Set(enrollmentsResults.map(enrollment => enrollment.event_id));

      // Add isEnrolled property to each event
      const upcomingEvents = eventsResults.map(event => ({
        ...event,
        isEnrolled: enrolledEventIds.has(event.id)
      }));

      res.render('events', { upcomingEvents });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch events' });
    }
  }
});

router.get('/hackathons', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    try {
      const userEmail = req.session.user.email;

      // Fetch all hackathons
      const { data: hackathonsResults, error: hackathonsError } = await supabase
        .from('hackathons')
        .select('*')
        .eq('status', 'active');

      if (hackathonsError) throw hackathonsError;

      // Fetch user's enrolled hackathons
      const { data: enrollmentsResults, error: enrollmentsError } = await supabase
        .from('enrolled_hackathons')
        .select('hackathon_id')
        .eq('user_email', userEmail);

      if (enrollmentsError) throw enrollmentsError;

      // Create a set of enrolled hackathon IDs for quick lookup
      const enrolledHackathonIds = new Set(enrollmentsResults.map(enrollment => enrollment.hackathon_id));

      // Add isEnrolled property to each hackathon
      const upcomingHackthons = hackathonsResults.map(hackathon => ({
        ...hackathon,
        isEnrolled: enrolledHackathonIds.has(hackathon.id)
      }));

      res.render('hackathon', { upcomingHackthons });
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch hackathons' });
    }
  }
});

router.get("/dashboard", async (req, res) => {
  if (!req.session.user) {
    res.redirect("/signin");
  } else {
    try {
      const user = req.session.user;
      const [enrolledEvents, enrolledHackathons] = await Promise.all([
        loadEnrolledEvents(user.email),
        loadEnrolledHackathons(user.email),
      ]);

      res.render("dashboard", {
        accounts: user,
        upcomingEvents,
        upcomingHackthons,
        EnrolledEvents: enrolledEvents,
        EnrolledHackthons: enrolledHackathons
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      res.status(500).send('An error occurred while loading user data');
    }
  }
});

router.get('/edit-profile', async (req, res) => {
  try {
    const { data: result, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('email', req.session.user.email)
      .maybeSingle(); // Use maybeSingle() to handle no results

    if (error) throw error;
    if (!result) {
      return res.status(404).send('User not found');
    }

    res.render('edit-profile', { user: result });
  } catch (error) {
    console.error('Supabase query error:', error);
    res.status(500).send('An error occurred while fetching user data');
  }
});

router.get('/pastEvents', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'past');

    if (error) throw error;

    res.render('pastEvents', { pastEvents: results });
  } catch (error) {
    console.error('Error loading past events:', error);
    res.status(500).send('An error occurred while fetching past events');
  }
});

router.get('/pastHackathons', async (req, res) => {
  try {
    const { data: results, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('status', 'past');

    if (error) throw error;

    res.render('pastHackathons', { pastHackathons: results });
  } catch (error) {
    console.error('Error loading past hackathons:', error);
    res.status(500).send('An error occurred while fetching past hackathons');
  }
});

router.post("/register", async (req, res) => {
  const { name, email, phonenumber, dob, gender, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        name,
        email,
        phonenumber,
        dob,
        gender,
        password
      });

    if (error) throw error;

    res.send({ status: 'success' });
  } catch (error) {
    console.error("Supabase query error:", error);
    res.send("Registration failed. Please try again.");
  }
});

router.post("/login", async (req, res) => {
  const identifier = req.body.identifier;
  const password = req.body.password;

  const isEmail = isValidEmail(identifier);
  const isMobile = isValidMobileNumber(identifier);

  if (isEmail || isMobile) {
    try {
      let query;

      if (isEmail) {
        query = supabase
          .from('accounts')
          .select('*')
          .eq('email', identifier)
          .single();
      } else {
        query = supabase
          .from('accounts')
          .select('*')
          .eq('phonenumber', identifier)
          .single();
      }

      const { data: result, error } = await query;

      if (error) {
        // Handle no rows found
        if (error.code === 'PGRST116') {
          return res.send({ status: 'error', message: `User not found or Password Incorrect.` });
        }
        throw error;
      }

      if (result && result.password === password) {
        req.session.user = result;
        res.send({ status: 'success' });
      } else {
        res.send({ status: 'error', message: 'Incorrect password.' });
      }
    } catch (error) {
      console.error("Supabase query error:", error);
      res.send("Login failed. Please try again.");
    }
  } else {
    res.send({ status: 'error', message: 'Invalid input. Please enter either an email or phone number.' });
  }
});

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});

router.post("/send-otp", async (req, res) => {
  const identifier = req.body.identifier;

  if (isValidEmail(identifier)) {
    try {
      const { data: rows, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('email', identifier)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results

      if (error) throw error;

      if (rows) {
        const otp = generateNumericOTP(6);
        otps[identifier] = {
          otp,
          createdAt: Date.now(),
        };

        try {
          await sendEmail(identifier, "Your OTP for Email Verification", `Your OTP is: ${otp}`);
          res.render("otp", { identifier, storedOTP: otp });
        } catch (error) {
          console.error(error);
          res.send("Failed to send OTP. Please try again.");
        }
      } else {
        res.send("No such email found in the database. Please sign up.");
      }
    } catch (error) {
      console.error(error);
      res.send("An error occurred while checking the email.");
    }
  } else if (isValidMobileNumber(identifier)) {
    try {
      const { data: rows, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('phonenumber', identifier)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no results

      if (error) throw error;

      if (rows) {
        const otp = generateNumericOTP(6);
        otps[identifier] = {
          otp,
          createdAt: Date.now(),
        };

        try {
          await sendSMS("+91" + identifier, `Your OTP is: ${otp}`);
          res.render("otp", { identifier, storedOTP: otp });
        } catch (error) {
          console.error(error);
          res.send("Failed to send SMS OTP. Please try again.");
        }
      } else {
        res.send("No such phone number found in the database. Please sign up.");
      }
    } catch (error) {
      console.error(error);
      res.send("An error occurred while checking the phone number.");
    }
  } else {
    res.send("Invalid input. Please enter either an email or mobile number.");
  }
});

// OTP verification
router.post("/verify-otp", (req, res) => {
  const identifier = req.body.identifier;
  const userOTP = req.body.otp;
  const storedOTP = req.body.storedOTP;

  if (otpIsValid(identifier, userOTP)) {
    res.render("newpass", { identifier });
  } else {
    res.send("Invalid OTP or expired. Please try again.");
  }
});

// OTP validation function
const otpValidityDuration = 2 * 60 * 1000; // 2 minutes

function otpIsValid(identifier, userOTP) {
  const storedOTP = otps[identifier];
  if (!storedOTP) {
    return false;
  }

  const currentTime = Date.now();
  const elapsedTime = currentTime - storedOTP.createdAt;

  if (elapsedTime <= otpValidityDuration && storedOTP.otp === userOTP) {
    delete otps[identifier];
    return true;
  } else {
    return false;
  }
}

// Reset password
router.post("/update-password", async (req, res) => {
  const identifier = req.body.identifier;
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;

  if (newPassword !== confirmPassword) {
    res.send({
      status: 'error',
      message: "New password and confirmation password do not match. Please try again."
    });
  } else {
    const isEmail = isValidEmail(identifier);
    const isMobile = isValidMobileNumber(identifier);

    if (isEmail || isMobile) {
      try {
        let query;

        if (isEmail) {
          query = supabase
            .from('accounts')
            .update({ password: newPassword })
            .eq('email', identifier);
        } else {
          query = supabase
            .from('accounts')
            .update({ password: newPassword })
            .eq('phonenumber', identifier);
        }

        const { error } = await query;

        if (error) throw error;

        res.send({ status: 'success' });
      } catch (error) {
        console.error("Supabase query error:", error);
        res.send({
          status: 'error',
          message: "Failed to update password. Please try again."
        });
      }
    } else {
      res.send({
        status: 'error',
        message: "Invalid input. Please enter either an email or mobile number."
      });
    }
  }
});

router.get('/event/:id', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    try {
      const eventId = req.params.id;
      const userEmail = req.session.user.email;

      // Fetch all events
      const { data: eventsResults, error: eventsError } = await supabase
        .from('events')
        .select('*');

      if (eventsError) throw eventsError;

      // Fetch user's enrolled events
      const { data: enrollmentsResults, error: enrollmentsError } = await supabase
        .from('enrolled_events')
        .select('event_id')
        .eq('user_email', userEmail);

      if (enrollmentsError) throw enrollmentsError;

      // Create a set of enrolled event IDs
      const enrolledEventIds = new Set(enrollmentsResults.map(enrollment => enrollment.event_id));

      // Find the event details
      const eventDetails = eventsResults.find(event => event.id === eventId);

      if (!eventDetails) {
        return res.status(404).send('Event not found');
      }

      // Add isEnrolled property
      eventDetails.isEnrolled = enrolledEventIds.has(eventDetails.id);

      // Get three random related events
      const relatedEvents = eventsResults
        .filter(event => event.id !== eventId)
        .map(event => ({
          ...event,
          isEnrolled: enrolledEventIds.has(event.id)
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      res.render('eventDetails', { eventDetails, relatedEvents });
    } catch (error) {
      console.error('Error fetching event details:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch event details' });
    }
  }
});

router.get('/hackathon/:id', async (req, res) => {
  if (!req.session.user) {
    res.redirect('/signin');
  } else {
    try {
      const hackathonId = req.params.id;
      const userEmail = req.session.user.email;

      // Fetch all hackathons
      const { data: hackathonsResults, error: hackathonsError } = await supabase
        .from('hackathons')
        .select('*');

      if (hackathonsError) throw hackathonsError;

      // Fetch user's enrolled hackathons
      const { data: enrollmentsResults, error: enrollmentsError } = await supabase
        .from('enrolled_hackathons')
        .select('hackathon_id')
        .eq('user_email', userEmail);

      if (enrollmentsError) throw enrollmentsError;

      // Create a set of enrolled hackathon IDs
      const enrolledHackathonIds = new Set(enrollmentsResults.map(enrollment => enrollment.hackathon_id));

      // Find the hackathon details
      const hackathonDetails = hackathonsResults.find(hackathon => hackathon.id === hackathonId);

      if (!hackathonDetails) {
        return res.status(404).send('Hackathon not found');
      }

      // Add isEnrolled property
      hackathonDetails.isEnrolled = enrolledHackathonIds.has(hackathonDetails.id);

      // Get three random related hackathons
      const relatedHackathons = hackathonsResults
        .filter(hackathon => hackathon.id !== hackathonId)
        .map(hackathon => ({
          ...hackathon,
          isEnrolled: enrolledHackathonIds.has(hackathon.id)
        }))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      res.render('hackathonDetails', { hackathonDetails, relatedHackathons });
    } catch (error) {
      console.error('Error fetching hackathon details:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch hackathon details' });
    }
  }
});

// Update user details
router.post('/updateDetails', async (req, res) => {
  const { name, email, phone, dob, gender } = req.body;
  const userEmail = req.body.email;
  const userPhone = req.body.phone;

  try {
    const { error: updateError } = await supabase
      .from('accounts')
      .update({ name, email, phonenumber: phone, dob, gender })
      .or(`email.eq.${userEmail},phonenumber.eq.${userPhone}`);

    if (updateError) throw updateError;

    // Re-fetch the user from the database after updating
    const { data: results, error: fetchError } = await supabase
      .from('accounts')
      .select('*')
      .or(`email.eq.${userEmail},phonenumber.eq.${userPhone}`)
      .limit(1); // Use limit(1) instead of single() for OR queries

    if (fetchError) throw fetchError;
    if (!results || results.length === 0) {
      return res.status(404).send('User not found');
    }

    const updatedUser = results;
    req.session.user = updatedUser;
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while updating the user details.');
  }
});

// Subscribe to newsletter
router.post('/subscribe', async (req, res) => {
  const email = req.body.email;

  try {
    const { error } = await supabase
      .from('newsletters')
      .insert({ email });

    if (error) throw error;

    res.send({ status: 'success' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ status: 'error', message: 'Failed to subscribe' });
  }
});

// Enroll in event
router.post('/enroll', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }

  const { eventId, eventType } = req.body;
  const userEmail = req.session.user.email;
  const enrolledAt = new Date();

  try {
    let checkQuery, enrollQuery;

    if (eventType === 'event') {
      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('enrolled_events')
        .select('*')
        .eq('user_email', userEmail)
        .eq('event_id', eventId)
        .maybeSingle(); // Use maybeSingle() to handle no results

      if (checkError) throw checkError;

      if (existingEnrollment) {
        return res.status(400).json({ status: 'error', message: 'You are already enrolled in this event' });
      }

      // Enroll
      const { error: enrollError } = await supabase
        .from('enrolled_events')
        .insert({
          user_email: userEmail,
          event_id: eventId,
          enrollment_date: enrolledAt
        });

      if (enrollError) throw enrollError;
    } else if (eventType === 'hackathon') {
      // Check if already enrolled
      const { data: existingEnrollment, error: checkError } = await supabase
        .from('enrolled_hackathons')
        .select('*')
        .eq('user_email', userEmail)
        .eq('hackathon_id', eventId)
        .maybeSingle(); // Use maybeSingle() to handle no results

      if (checkError) throw checkError;

      if (existingEnrollment) {
        return res.status(400).json({ status: 'error', message: 'You are already enrolled in this hackathon' });
      }

      // Enroll
      const { error: enrollError } = await supabase
        .from('enrolled_hackathons')
        .insert({
          user_email: userEmail,
          hackathon_id: eventId,
          enrollment_date: enrolledAt
        });

      if (enrollError) throw enrollError;
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid event type' });
    }

    res.json({ status: 'success', message: 'Enrolled successfully' });
  } catch (error) {
    console.error('Error enrolling:', error);
    res.status(500).json({ status: 'error', message: 'Failed to enroll' });
  }
});

// Unenroll from event
router.post('/unenroll', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }

  const { eventId, eventType } = req.body;
  const userEmail = req.session.user.email;

  try {
    const { error } = await supabase
      .from('enrolled_events')
      .delete()
      .eq('event_id', eventId)
      .eq('user_email', userEmail);

    if (error) throw error;

    res.json({ status: 'success', message: 'Successfully unenrolled from event' });
  } catch (error) {
    console.error('Error unenrolling:', error);
    res.status(500).json({ status: 'error', message: 'Failed to unenroll from event' });
  }
});

// Unenroll from hackathon
router.post('/unenroll/:id', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }

  const hackathonId = req.params.id;
  const userEmail = req.session.user.email;

  try {
    const { error } = await supabase
      .from('enrolled_hackathons')
      .delete()
      .eq('hackathon_id', hackathonId)
      .eq('user_email', userEmail);

    if (error) throw error;

    res.json({ status: 'success', message: 'Successfully unenrolled from hackathon' });
  } catch (error) {
    console.error('Error unenrolling:', error);
    res.status(500).json({ status: 'error', message: 'Failed to unenroll from hackathon' });
  }
});

module.exports = router;
