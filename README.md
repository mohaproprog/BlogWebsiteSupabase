# 📝 Blogger – Realtime Blog Platform

Blogger is a modern full-stack blog platform built with React, Supabase, and Tailwind CSS.  
Users can create blogs, update or delete their posts, and interact through realtime comments.

---

## 🚀 Features

- 🔐 Authentication (Sign up / Sign in / Sign out)
- ✍️ Create, update, and delete blogs
- 👤 Author-based permissions
- 💬 Realtime comments (Insert / Update / Delete)
- ⚡ Instant UI updates using Supabase Realtime
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern UI built with Tailwind CSS
- 🧠 Clean state management with React Hooks

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- Tailwind CSS

### Backend
- Supabase (PostgreSQL database)
- Supabase Authentication
- Supabase Realtime subscriptions

---

## 📂 Project Structure

```
src/
│
├── components/
│   ├── AuthContext.jsx
│   ├── protectedPage.jsx
│   ├── Comments.jsx
│   ├── Loading.jsx
│   └── UseAuth.jsx
│   └── Navbar.jsx
│   └── UnAuth.jsx
src/
│
├── Pages/
│   ├── BlogExplore.jsx
│   ├── Blogs.jsx
│   ├── CreateBlog.jsx
│   ├── Home.jsx
│   └── NotFoundPage.jsx
│   └── SignIn.jsx
│   └── SingUp.jsx
│   └── Profile.jsx

│
├── supabase/
│   └── supabase.client.js
│
└── App.jsx
```

---

## 🗄️ Database Structure

### Blog Table
- id
- title
- content
- Author (foreign key → user.id)
- created_at

### Comments Table
- id
- content
- forUser (foreign key → user.id)
- forBlog (foreign key → Blog.id)
- created_at

### User Table
- id
- username
- full_name
- Avatar_url

---

## ⚙️ Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/blogger.git
```

2. Navigate into the project:

```
cd blogger
```

3. Install dependencies:

```
npm install
```

4. Create a `.env` file and add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

5. Start the development server:

```
npm run dev
```

---

## 🔥 Realtime Functionality

This project uses Supabase Realtime to:

- Instantly show new blogs
- Update blogs without refreshing
- Sync comments live between users
- Handle delete actions in real-time

No manual refresh required.

---

## 🔐 Authorization Logic

- Only the blog author can edit or delete their blog.
- Comment owners can edit or delete their comments.
- Blog owners can delete any comment under their blog.
- Non-logged-in users see:  
  “Sign in to comment”

---

## 📱 Responsive Design

- Mobile-first layout
- No text overflow on small screens
- Fixed comment input bar
- Responsive blog grid
- Adaptive typography

---

## 🎯 Future Improvements

- Like system for blogs
- User profiles page
- Blog categories/tags
- Search functionality
- Dark/Light mode toggle
- Pagination or infinite scroll
- Image uploads for blogs

---

## 👨‍💻 Author

Built with @MohaProg using React and Supabase.
