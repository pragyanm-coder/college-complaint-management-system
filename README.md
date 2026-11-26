# College Complaint Registration System: Frontend

A web application where students register college complaints, track their progress, and confirm when they are resolved. Staff handle the complaints assigned to them, and the admin supervises everything.

Built with **React**, **JavaScript** and **CSS**. Vite runs the project and React Router moves between pages.

> **This is the frontend only.** It currently runs on sample (demo) data, so it works without a backend. See "Connecting to the backend" below.

## How to run it

You need [Node.js](https://nodejs.org) (the LTS version).

```bash
cd frontend
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the project for development |
| `npm run build` | Checks everything and creates the production files |
| `npm run preview` | Shows the production build locally |
| `npm run lint` | Checks the code for mistakes |

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Student | student@college.test | Demo@123 |
| Staff | staff@college.test | Demo@123 |
| Admin | admin@college.test | Demo@123 |

The login page has buttons that fill these in. These accounts are for testing only.

## What each role can do

**Student**: register an account, submit complaints (title, category, priority, location, description), search and filter their complaints, track progress on a timeline, read staff remarks, confirm a resolution with a star rating and feedback, or say the problem is not solved.

**Staff**: see complaints assigned to them (most urgent first), search and filter them, start work, add remarks that the student can read, and mark a complaint as resolved.

**Admin**: see statistics for all complaints, assign or reassign complaints to a department and staff member, manage students and staff (activate or deactivate, add staff, edit departments), manage departments, and view reports with charts, filters and CSV download.

## Pages

| Address | Page |
| --- | --- |
| `/` | Home |
| `/login` | Login (sends each user to their own area) |
| `/register` | Student registration |
| `/student/dashboard` | Student dashboard |
| `/student/complaints/new` | Register a complaint |
| `/student/complaints` | My complaints |
| `/student/complaints/:id` | Complaint details and tracking |
| `/staff/dashboard` | Staff dashboard |
| `/staff/complaints` | Assigned complaints |
| `/staff/complaints/:id` | Staff complaint details |
| `/admin/dashboard` | Admin dashboard |
| `/admin/complaints` | All complaints |
| `/admin/complaints/:id` | Admin complaint details (assign) |
| `/admin/users` | Students and staff |
| `/admin/departments` | Departments |
| `/admin/reports` | Reports |

## Folder structure

```text
src/
  components/
    common/    reusable pieces (FormField, StatusBadge, StatCard, Timeline, BarChart, ...)
    layout/    PublicLayout (top bar) and DashboardLayout (sidebar + top bar)
  context/     shared data: AuthProvider, ComplaintsProvider, DirectoryProvider
  data/        sample data and option lists
  pages/       public/, student/, staff/, admin/
  utils/       helpers (validation, date formatting, filters, CSV export)
  App.jsx      all the routes
  main.jsx     entry point
  index.css    colours, fonts and shared styles
```

## Demo mode: please read

- **Data resets when the page is refreshed.** Complaints, users and departments are kept in memory only.
- **Login is not real security.** Passwords are checked against sample accounts in the code. The backend must do real login, and must also check every request. Hiding pages in the frontend does not protect data.
- **Students who register cannot log in again** after logging out, because accounts are not saved anywhere yet.
- Not included: file attachments, email or in-app notifications, password reset.

## Connecting to the backend

The screens do not need to change. Only the three files in `src/context` talk to data:

| File | What to replace |
| --- | --- |
| `AuthProvider.jsx` | `login`, `registerStudent`, `logout`: call the login and register API, keep the returned token or session |
| `ComplaintsProvider.jsx` | `addComplaint`, `assignComplaint`, `updateStatus`, `addRemark`, `confirmResolution`, `reopenComplaint`: call the complaint API, and load the complaints list from it |
| `DirectoryProvider.jsx` | departments, staff and students: load and update through the user and department API |

After that, delete the sample files `data/sampleComplaints.js`, `data/demoUsers.js` and the sample lists in `data/directory.js`. The shape of one complaint is described at the top of `sampleComplaints.js`, so agree with the backend team that the API returns the same fields (or change the frontend to match). Complaints are matched to staff by name in the demo. The backend should use IDs.

## Deploying

This app uses browser addresses like `/student/dashboard`. The web server must send every unknown address to `index.html`, otherwise refreshing a page shows "not found".