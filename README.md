<!-- # Student Corner 🎓

Welcome to Student Corner - Your Gateway to Exciting Tech Events! 🚀

## What's Student Corner? 🤔

Student Corner is a cool web app that connects you with awesome hackathons and tech events. Discover, join, and rock these events like a pro! 💻🏆

## Awesome Features 🌟

- 🔍 Find cool hackathons and events
- 🙋‍♂️ Sign up and log in easily
- 🎟️ Join events with just a click
- 🔔 Get real-time updates about new opportunities
- 👑 Admin superpowers for event management
- 👤 Your personal profile and event history

## Let's Get Started! 🏁

Follow these simple steps to set up Student Corner on your computer:

### What You'll Need 📋

- Node.js (v14 or newer) 🟢
- npm (comes with Node.js) 📦
- Supabase account (free tier works great!) 🔥
- Twilio account for SMS magic ✨

### Installation Magic 🧙‍♂️

1. Clone the project:
   
   git clone https://github.com/Gurupatel007/student-corner.git
   

2. Jump into the project folder:
   
   cd student-corner
   

3. Install the goodies:
   
   npm install
   

4. Set up your Supabase database:
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL commands from `supabase_schema.sql` file
   - Grab your Supabase URL and Anon Key from Project Settings > API

5. Connect to your database:
   - The Supabase client is already configured in `config/supabase.js`
   - Just update your environment variables with your Supabase credentials

6. Create your secret sauce (environment variables):
   - Make a new file called `.env` in the main folder
   - Add these magical ingredients:

     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ACCOUNT_SID=your_twilio_account_sid
     AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     EMAIL_FROM=noreply@yourdomain.com
     SESSION_SECRET=your_random_secret_string
     PORT=3000
     ```
   - Replace the placeholders with your real credentials
   - Remember: You need your own Twilio account for SMS superpowers!

### Launch Time! 🚀

1. Start your local server (like XAMPP)

2. Fire up the app:
   
   node App.js
   

3. Open your browser and go to `http://localhost:3000` (or your chosen port)

## What's in the Box? 📦

- `config/`: Database configuration (Supabase client)
- `node_modules/`: Home of the helpful Node.js friends
- `public/`: Your static files hangout spot (images, CSS, JS)
- `routes/`: Traffic control for your app (user & admin routes)
- `services/`: Special helpers for emails and SMS
- `utils/`: Handy tools and functions (OTP generation, validation)
- `views/`: EJS templates - what your users will see
- `App.js`: The heart of your app - main entry point
- `.env`: Your app's secret diary - environment variables
- `supabase_schema.sql`: Database schema and sample data
- `.gitignore`: Tells Git what to ignore
- `package.json` & `package-lock.json`: Your app's ID cards

## Built With Love ❤️

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework for routing and middleware
- **Supabase (PostgreSQL)** - Modern database with built-in auth and real-time capabilities
- **EJS** - Embedded JavaScript templating
- **Twilio** - SMS notifications
- **Nodemailer** - Email service integration
- **Bcrypt** - Password hashing for admin accounts
- **Multer** - File upload handling

## Join the Party! 🎉

We love new friends! Here's how you can join in:

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/CoolNewThing`)
3. Commit your changes (`git commit -m 'Add some CoolNewThing'`)
4. Push to the Branch (`git push origin feature/CoolNewThing`)
5. Open a Pull Request and let's chat!

## License 📜

Shared under the MIT License. Check out `LICENSE` for the legal stuff.

## Say Hi! 👋

Guru Patel - [gurupatel279@gmail.com](mailto:gurupatel279@gmail.com) or [code.guru@outlook.in](mailto:code.guru@outlook.in)

Project Home: [https://github.com/Gurupatel007/student-corner](https://github.com/Gurupatel007/student-corner)

## High Fives 🙌

- Twilio for the awesome SMS powers

Let's make something awesome together! 💪😎 -->


# Student Corner 🎓

Welcome to Student Corner - Your Gateway to Exciting Tech Events! 🚀

## What's Student Corner? 🤔

Student Corner is a cool web app that connects you with awesome hackathons and tech events. Discover, join, and rock these events like a pro! 💻🏆

## Awesome Features 🌟

- 🔍 Find cool hackathons and events
- 🙋‍♂️ Sign up and log in easily
- 🎟️ Join events with just a click
- 🔔 Get real-time updates about new opportunities
- 👑 Admin superpowers for event management
- 👤 Your personal profile and event history

![Landing](./public/images/readme%20images/landing.png)

## Let's Get Started! 🏁

Follow these simple steps to set up Student Corner on your computer:

### What You'll Need 📋

- Node.js (v14 or newer) 🟢
- npm (comes with Node.js) 📦
- Supabase account (free tier works great!) 🔥
- Twilio account for SMS magic ✨

### Installation Magic 🧙‍♂️

1. Clone the project:
   
   ```bash
   git clone https://github.com/Gurupatel007/student-corner.git
   ```

2. Jump into the project folder:
   
   ```bash
   cd student-corner
   ```

3. Install the goodies:
   
   ```bash
   npm install
   ```

4. Set up your Supabase database:
   - Create a free account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to SQL Editor in your Supabase dashboard
   - Run the SQL commands from `supabase_schema.sql` file
   - Grab your Supabase URL and Anon Key from Project Settings > API

5. Connect to your database:
   - The Supabase client is already configured in `config/supabase.js`
   - Just update your environment variables with your Supabase credentials

6. Create your secret sauce (environment variables):
   - Make a new file called `.env` in the main folder
   - Add these magical ingredients:

     ```
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ACCOUNT_SID=your_twilio_account_sid
     AUTH_TOKEN=your_twilio_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_phone_number
     EMAIL_USER=your_email@example.com
     EMAIL_PASS=your_email_password
     EMAIL_FROM=noreply@yourdomain.com
     SESSION_SECRET=your_random_secret_string
     PORT=3000
     ```
   - Replace the placeholders with your real credentials
   - Remember: You need your own Twilio account for SMS superpowers!

### Launch Time! 🚀

1. Fire up the app:

   ```bash
   npm start
   ```

   Or run with nodemon for development:
   ```bash
   nodemon App.js
   ```

2. Open your browser and go to `http://localhost:3000` (or your chosen port)

3. **Admin Access**: Login to admin panel at `/admin/login`
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin123`
   - **Important**: Change the default admin password after first login!

## What's in the Box? 📦

- `config/`: Database configuration (Supabase client)
- `node_modules/`: Home of the helpful Node.js friends
- `public/`: Your static files hangout spot (images, CSS, JS)
- `routes/`: Traffic control for your app (user & admin routes)
- `services/`: Special helpers for emails and SMS
- `utils/`: Handy tools and functions (OTP generation, validation)
- `views/`: EJS templates - what your users will see
- `App.js`: The heart of your app - main entry point
- `.env`: Your app's secret diary - environment variables
- `supabase_schema.sql`: Database schema and sample data
- `.gitignore`: Tells Git what to ignore
- `package.json` & `package-lock.json`: Your app's ID cards

![Dashboard](./public/images/readme%20images/dashboard.png)
![Edit Profile](./public/images/readme%20images/edit-profile.png)

## Admin Features 👑

Admins can manage events, approve or reject participation, and more!

![Admin Dashboard](./public/images/readme%20images/adminDashboard.png)

## Join the Party! 🎉

We love new friends! Here's how you can join in:

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/CoolNewThing`)
3. Commit your changes (`git commit -m 'Add some CoolNewThing'`)
4. Push to the Branch (`git push origin feature/CoolNewThing`)
5. Open a Pull Request and let's chat!

## License 📜

Shared under the MIT License. Check out `LICENSE` for the legal stuff.

## Say Hi! 👋

Guru Patel - [gurupatel279@gmail.com](mailto:gurupatel279@gmail.com) or [code.guru@outlook.in](mailto:code.guru@outlook.in)

Project Home: [https://github.com/Gurupatel007/student-corner](https://github.com/Gurupatel007/student-corner)

## High Fives 🙌

- Twilio for the awesome SMS powers

Let's make something awesome together! 💪😎
