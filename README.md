# 💰 Expense Tracker Web Application

A full-stack expense tracking system that helps users manage their daily expenses with beautiful visualizations and analytics.

![Expense Tracker](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node.js-v14+-green)

## 📋 Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 🔐 **User Authentication** - Secure login and signup with password hashing
- 💵 **Expense Management** - Add, view, and delete expenses
- 📊 **Visual Analytics** - Interactive pie charts and bar charts
- 🏷️ **Category-wise Analysis** - Track spending by categories
- 🔍 **Advanced Filters** - Filter by category, date, and amount range
- 📈 **Real-time Summary** - Total expenses, monthly expenses, and entry count
- 🎨 **Clean UI/UX** - Modern, responsive design
- 💾 **Data Persistence** - MySQL database for secure data storage

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3 (Custom styling with gradients)
- JavaScript (ES6+)
- Chart.js (Data visualization)

### Backend
- Node.js
- Express.js
- MySQL2 (Database driver)
- bcrypt (Password hashing)
- body-parser
- CORS

### Database
- MySQL

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Git

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up MySQL database** (See [Database Setup](#database-setup))

4. **Configure database connection**
   - Open `backend/db.js`
   - Update MySQL credentials:
```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'expense_tracker'
});
```

## 🗄️ Database Setup

1. **Open MySQL**
```bash
mysql -u root -p
```

2. **Run the schema**
```sql
source database/schema.sql
```

Or manually execute:
```sql
CREATE DATABASE expense_tracker;
USE expense_tracker;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses table
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Budget table
CREATE TABLE budgets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    monthly_limit DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🚀 Running the Application

1. **Start the server**
```bash
npm start
```

2. **Open your browser**
```
http://localhost:3000
```

3. **Create an account** and start tracking expenses!

## 📂 Project Structure
```
expense-tracker/
│
├── frontend/              # Frontend files
│   ├── index.html        # Login page
│   ├── signup.html       # Signup page
│   ├── dashboard.html    # Main dashboard
│   ├── style.css         # All styles
│   └── script.js         # Client-side JavaScript
│
├── backend/              # Backend files
│   ├── server.js         # Main server file
│   ├── db.js             # Database connection
│   └── routes/           # API routes
│       ├── authRoutes.js     # Authentication routes
│       └── expenseRoutes.js  # Expense CRUD routes
│
├── database/
│   └── schema.sql        # Database schema
│
├── .gitignore
├── package.json
└── README.md
```

## 📸 Screenshots

### Login Page
![Login](screenshots/login.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Analytics
![Analytics](screenshots/analytics.png)

## 🔮 Future Enhancements

- [ ] Budget alerts and notifications
- [ ] Export reports as PDF/Excel
- [ ] Recurring expenses
- [ ] Multi-currency support
- [ ] Mobile responsive improvements
- [ ] Email reminders
- [ ] Dark mode
- [ ] Receipt upload feature
- [ ] Expense sharing between users

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- Chart.js for beautiful charts
- Express.js community
- MySQL documentation

---

⭐ If you found this project helpful, please give it a star!
```

---

### 3️⃣ **`LICENSE`** (MIT License)

Create a file named `LICENSE` in the root folder:
```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.