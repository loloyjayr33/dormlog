
🔐 Account Management (Admin)

The administrator can create multiple user accounts simultaneously by entering a list of occupant email addresses. Upon clicking the Create Account button, the system automatically performs the following actions:

- Generates a random temporary password for each email address

- Sends the generated password to the corresponding email address

- Creates the occupant account based on the email entered by the administrator

Newly created users can log in using the emailed credentials and are encouraged to change their password after the first login for security purposes.

👨‍💼 Admin Features

Manage Occupants

- Add new occupants to the system using email-based registration

- Delete existing occupant accounts when necessary

View Sign-In and Sign-Out Logs

- View complete records of occupant sign-in and sign-out activities

Log details include:

- Date and time

- Destination

- Reason for leaving

Monitoring Dashboard

- View real-time status of occupants:
  - Inside the dormitory
  - Outside the dormitory

Account Settings

- Change administrator password

- Manage account security settings

🧑‍🎓 Occupant Features

Sign-In

- Record return time upon entering the dormitory

Sign-Out

- Log departure details including:
  - Reason for leaving
  - Destination
  - Expected return time

Profile Management

- Edit personal information such as name, contact details, and room number (if permitted)

Account Settings

- Change password securely

🔔 System Automation

- Automatically records sign-in and sign-out timestamps

- Logs all activities in real time for monitoring and reporting

📌 Feature Summary

Admin:

- Account creation via email, occupant management, activity log monitoring, password management

Occupant:

- Sign-in and sign-out logging, profile editing, password management

🧩 Tech Stack for DormLog

🌐 Frontend (Client-Side)

React.js

- Builds a responsive and interactive user interface

- Handles forms for sign-in, sign-out, profile editing, and admin management

Vite

- Fast development server and optimized production builds

Tailwind CSS

- Utility-first styling for a clean and modern interface

- Mobile-friendly design for accessibility

React Router

- Manages navigation between pages (Login, Dashboard, Logs, Settings)

JavaScript (ES6+)

- Core scripting language for frontend logic

🔐 Backend (Supabase – Backend as a Service)

Supabase Authentication

- Email and password authentication

- Supports admin-created accounts

- Allows password changes for both administrators and occupants

Supabase PostgreSQL Database

Stores:

- User accounts and roles

- Occupant profiles

- Sign-in and sign-out logs

- Destinations and reasons

Provides structured relational data storage

Supabase Row Level Security (RLS)

Role-based access control:

- Admin: full system access

- Occupant: access to personal data only

📧 Email & Automation

Supabase Email Service / Custom SMTP

- Sends randomly generated passwords to newly created accounts

- Sends automated system notifications

Supabase Edge Functions

- Generates random passwords during account creation

- Sends bulk emails to multiple users

- Handles scheduled system tasks

Supabase Cron Jobs

- Executes automated checks (e.g., nightly presence monitoring)

🔒 Security

- Passwords encrypted and managed by Supabase Authentication

- Environment variables used for API keys

- HTTPS enforced through hosting platforms

- Role-based access control implemented via RLS

🚀 Deployment & Hosting

Vercel

- Hosts the React frontend

- Provides fast global delivery and automatic HTTPS

Supabase Cloud

- Hosts authentication, database, and backend services

📊 Data Needed for DormLog

1️⃣ Users

Stores authentication-related information for all system users.

- user_id (UUID, PK)

- email (TEXT, UNIQUE, NOT NULL)

- role (TEXT: Admin, Occupant)

- is_active (BOOLEAN, DEFAULT TRUE)

- created_at (TIMESTAMP)

2️⃣ Occupants

Stores personal and dormitory-related information of occupants.

- occupant_id (UUID, PK)

- user_id (UUID, FK → users.user_id, UNIQUE, NOT NULL)

- last_name (TEXT)

- first_name (TEXT)

- middle_name (TEXT, NULLABLE)

- contact_number (TEXT)

- room_number (TEXT)

- status (TEXT: Inside, Outside)

- created_at (TIMESTAMP)

3️⃣ Sign Logs

Records sign-in and sign-out activities of occupants.

- log_id (UUID, PK)

- occupant_id (UUID, FK → occupants.occupant_id)

- sign_out_time (TIMESTAMP)

- sign_in_time (TIMESTAMP, NULLABLE)

- destination (TEXT)

- reason (TEXT)

- expected_return (TIMESTAMP)

- actual_return (TIMESTAMP)

- status (TEXT: Out, In, Late)

- created_at (TIMESTAMP)

4️⃣ Admin Actions

Tracks administrative activities for auditing purposes.

- action_id (UUID, PK)

- admin_id (UUID, FK → users.user_id)

- action_type (TEXT: Add, Delete, Create Account)

- target_user (UUID)

- created_at (TIMESTAMP)

5️⃣ Email Notifications

Stores records of system-generated emails.

- notification_id (UUID, PK)

- recipient_email (TEXT)

- email_type (TEXT: Account Creation, Night Summary)

- sent_at (TIMESTAMP)

- status (TEXT: Sent, Failed)

6️⃣ Account Credentials (System-Handled)

Handled securely by Supabase Authentication.

- temporary_password (SYSTEM GENERATED, EMAILED)

- password_changed (BOOLEAN)

Note: Actual passwords are encrypted and not stored manually.

🔐 Data Relationships

- One User → One Occupant

- One Occupant → Many Sign Logs

- One Admin → Many Admin Actions

📌 Why This Data Is Needed

- Supports bulk account creation with random passwords

- Enables accurate sign-in and sign-out tracking

- Allows administrators to monitor destinations and reasons

- Supports email notifications and audit trails

- Enforces role-based access control

🧠 Final Summary

DormLog requires structured data for user accounts, occupant profiles, activity logs, administrative actions, and email notifications to provide a secure, efficient, and automated dormitory monitoring system.

