💰 Expense Tracker - Personal Finance Manager
https://img.shields.io/badge/Expense_Tracker-V1.0-blue
https://img.shields.io/badge/License-MIT-green
https://img.shields.io/badge/Built_With-HTML5%252FCSS3%252FJS-yellow

A sleek, modern, and fully-featured expense tracking application built with vanilla JavaScript. Track your spending, manage your budget, and gain insights into your financial habits with this intuitive web application.


🎯 Features
✨ Core Features
📝 Add Expenses - Quickly log expenses with name, amount, and category

🗑️ Delete Expenses - Remove individual expenses with confirmation

🧹 Clear All - One-click removal of all expenses

💾 Auto-Save - Data persists automatically using LocalStorage

📊 Real-time Statistics - View total spent and expense count

🎨 Categories & Organization
7 Color-coded Categories: Food, Transport, Shopping, Entertainment, Bills, Health, Other

Visual Indicators: Each category has a unique color and icon

Smart Sorting: Expenses sorted by date (newest first)

🎮 User Experience
Responsive Design - Works perfectly on desktop, tablet, and mobile

Keyboard Support - Press Enter to quickly add expenses

Visual Feedback - Animations and transitions for all interactions

Empty State - Friendly message when no expenses exist

Form Validation - Ensures data integrity

🚀 Live Demo
Try it Live Here!
https://annrose-akande-expense-tracker.netlify.app/

📦 Installation & Setup
Option 1: Local Installation
Clone the repository

bash
git clone https://github.com/yourusername/expense-tracker.git
Navigate to project folder

bash
cd expense-tracker
Open index.html in your browser

Simply double-click the file, or

Use a local server: python -m http.server 8000

Option 2: Direct Download
Download the ZIP file from GitHub

Extract to a folder of your choice

Open index.html in any modern browser

🛠️ Technologies Used
HTML5 - Semantic markup structure

CSS3 - Modern styling with Flexbox/Grid

Vanilla JavaScript - No frameworks or libraries

LocalStorage API - Client-side data persistence

Font Awesome - Icon library

Google Fonts - Typography

📁 Project Structure
text
expense-tracker/
│
├── index.html          # Main HTML file
├── style.css           # All styling and responsive design
├── script.js           # Complete application logic
│
└── README.md           # This file
📋 How to Use
Adding an Expense
Type the expense name (e.g., "Coffee")

Enter the amount (e.g., 4.50)

Select a category from the dropdown

Click "Add Expense" or press Enter

Managing Expenses
Delete Single Expense: Click the trash icon next to any expense

Delete All Expenses: Use the "Clear All Expenses" button at the bottom

View Statistics: Check the top cards for total spent and count

Data Persistence
All data is automatically saved in your browser's LocalStorage

Expenses remain even after closing the browser or refreshing

To clear all data: Use "Clear All Expenses" button

🎨 Features in Detail
1. Category System
Each expense can be categorized into one of 7 categories, each with:

Unique color scheme

Corresponding emoji icon

Consistent styling across the app

2. Responsive Design
Desktop: Three-column layout for optimal viewing

Tablet: Adjusted spacing and sizing

Mobile: Single column with touch-friendly buttons

3. Animations & Feedback
Smooth slide-in animations for new expenses

Confirmation dialogs for destructive actions

Visual feedback on button interactions

Success/error states for form validation

4. LocalStorage Implementation
javascript
// Save data
localStorage.setItem("expenses", JSON.stringify(expenses));

// Load data
JSON.parse(localStorage.getItem("expenses")) || [];
🔧 Development
Prerequisites
Any modern web browser (Chrome, Firefox, Safari, Edge)

Code editor (VS Code, Sublime Text, etc.)

Running Locally
bash
# Using Python's built-in server
python -m http.server 8000

# Using Node.js with http-server
npx http-server
File Structure Overview
index.html: Contains the complete HTML structure

style.css: All styling including responsive design

script.js: Complete JavaScript with all functionality

📈 Future Enhancements
Planned features for upcoming versions:

Budget Setting - Set monthly budgets for categories

Charts & Graphs - Visual spending breakdown

Export Data - CSV/PDF export functionality

Dark Mode - Toggle between light/dark themes

Search & Filter - Find expenses by name or date

Recurring Expenses - Set up monthly subscriptions

Currency Support - Multiple currency formats

Backup/Restore - Import/export data files

🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository

Create a feature branch

bash
git checkout -b feature/AmazingFeature
Commit your changes

bash
git commit -m 'Add some AmazingFeature'
Push to the branch

bash
git push origin feature/AmazingFeature
Open a Pull Request

Development Guidelines
Follow the existing code style

Add comments for complex logic

Test thoroughly before submitting

Update documentation as needed

🐛 Troubleshooting
Common Issues
Issue: Expenses not saving after refresh
Solution: Check if LocalStorage is enabled in your browser settings

Issue: Buttons not working
Solution: Ensure JavaScript is enabled in your browser

Issue: Layout looks broken
Solution: Clear browser cache or try a different browser

Issue: Can't delete expenses
Solution: Check browser console for errors (F12 → Console)

Browser Support
✅ Chrome 60+

✅ Firefox 55+

✅ Safari 11+

✅ Edge 79+

✅ Opera 50+

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Annrose Akande

GitHub: Annrose-debug

Portfolio: https://annroseakande1.netlify.app/

LinkedIn: www.linkedin.com/in/annrose-akande-a2a279349

🙏 Acknowledgments
Icons by Font Awesome

Color palette inspired by Coolors

Gradient backgrounds from uiGradients

Inspired by various budgeting apps and personal finance tools

⭐ Show Your Support
If you find this project useful, please give it a star on GitHub!

https://api.star-history.com/svg?repos=yourusername/expense-tracker&type=Date

Built with ❤️ for developers learning frontend fundamentals

