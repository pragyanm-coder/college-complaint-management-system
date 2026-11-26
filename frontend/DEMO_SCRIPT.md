# Demo script

**Before you start:** refresh the browser so the sample data is fresh. Do not refresh during the demo, because the data resets. Keep the project open on the Home page.

## 1. Introduction (1 minute)
- "This is the College Complaint Registration System. Students register complaints, staff handle them, and the admin supervises."
- Scroll the Home page: features and the five-step "How It Works".
- "I built the frontend with React, JavaScript and CSS. It runs on sample data until the backend is connected."

## 2. Registration and login (1 minute)
- Open **Register**. Click Create account empty to show the error messages. Enter different passwords to show the mismatch error.
- Fill the form and register. Show the empty dashboard ("No complaints yet"), then **Log out**.
- Open **Login**, press Log in empty to show the errors, then use the **Student** demo button.

## 3. Student: submit a complaint (2 minutes)
- Show the dashboard: statistic cards, recent complaints, and the notice "1 resolved complaint is waiting for your confirmation".
- Open **Register a Complaint**. Show validation, then submit an **Urgent** complaint, for example "Fire extinguisher missing in Lab 3".
- Open **My Complaints**. Show search and filters (status, category, dates).

## 4. Admin: assign it (2 minutes)
- Log out, log in as **Admin**. Show the dashboard and the "waiting to be assigned" notice.
- Open your new complaint. Assign it to the **Maintenance Department** and **Demo Staff**. Point out that the staff list only shows people from that department.
- Show **Users** (deactivate rules), **Departments** (a department with staff cannot be removed) and **Reports** (filters, charts, **Download CSV**).

## 5. Staff: work on it (1 minute)
- Log out, log in as **Staff**. Show the urgent notice and that urgent complaints come first.
- Open your complaint. Click **Start work** with a remark. Then **Mark as resolved** with an explanation.

## 6. Student: confirm (1 minute)
- Log out, log in as **Student**. Open the complaint and show the timeline with the staff remarks.
- Confirm the resolution with a star rating and feedback.
- Optional: open **CMP-1003** and choose "No, it is not resolved" to show it returning to In Progress.

## 7. Finish (1 minute)
- Narrow the browser window to show the mobile layout and the sidebar menu.
- Say what is demo-only: data resets, login is not real security.
- Say how the backend connects: only the three files in `src/context` change.

## Questions your teacher may ask
- **Why sample data?** The backend is built by teammates. The screens are finished and tested, and only three files change when the API is ready.
- **Is login secure?** No. It is a demo. Real security must be done by the backend, which checks every request.
- **How are pages protected?** Each area is wrapped in a protected route that checks the role. This is for convenience only, and the backend must enforce it too.
- **Is it responsive?** Yes, the layouts adapt for laptop, tablet and mobile.
- **What would you add next?** File attachments, notifications, password reset, and real accounts.