# 🚪 GatePass — Smart Gate Pass Management System

A modern, full-stack **Gate Pass Management System** built with a production-ready SaaS architecture.
Designed for organizations to **create, track, verify, and manage entry passes efficiently**.

---

## ✨ Features

### 🔐 Authentication

* Secure login with Supabase Auth
* Session persistence & protected routes

### 🎟️ Pass Management

* Create Visitor, Employee, Material, and Event passes
* Dynamic form based on pass type
* Status lifecycle: **Pending → Active → Expired / Rejected**

### 📊 Dashboard

* Real-time statistics (Total, Active, Pending, Expired)
* Interactive KPI cards
* Recent passes overview

### 📋 Pass Listing

* Advanced search (name, pass number, purpose)
* Filters (status + type)
* Quick actions:

  * ✅ Approve / Reject
  * 🔓 Check-in / Check-out
  * 🖨️ Print pass

### 🧾 Printable Pass

* Clean printable card UI
* QR code for verification
* Time-bound validity
* Professional layout for real-world usage

### 🎨 UI/UX

* Modern SaaS design (Tailwind + shadcn/ui)
* Fully responsive
* Smooth animations (Framer Motion)
* Accessible components

---

## 🏗️ Tech Stack

### Frontend

* ⚛️ React (Vite)
* 🧠 TypeScript
* 🎨 Tailwind CSS
* 🧩 shadcn/ui
* 🎞️ Framer Motion

### Backend

* 🟢 Supabase (PostgreSQL + Auth + API)

### State & Data

* ⚡ React Query (TanStack)

### Utilities

* 📅 date-fns
* 🔔 Sonner (toasts)
* 🔳 QRCode.react

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AppLayout.tsx
│   ├── StatCard.tsx
│   ├── PassStatusBadge.tsx
│   ├── PassTypeBadge.tsx
│   ├── PrintablePassCard.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── CreatePass.tsx
│   ├── PassList.tsx
│   ├── Auth.tsx
│   ├── NotFound.tsx
│
├── integrations/
│   └── supabase/
│
└── main.tsx
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/gatepass-system.git
cd gatepass-system
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create `.env` file:

---

### 4️⃣ Run the app

```bash
npm run dev
```

---

## 🧠 Core Workflow

1. User logs in
2. Create a gate pass
3. Admin approves/rejects
4. Security checks in/out
5. QR code used for verification
6. Pass expires automatically

---

## 🔒 Security Considerations

* Supabase Auth for secure sessions
* Role-based access ready
* QR payload structure for validation
* Server-side validation recommended (future enhancement)

---

## 📸 Screens (Recommended)

> Add screenshots or GIFs here for better GitHub visibility

* Dashboard UI
* Create Pass Form
* Pass List Table
* Printable Pass

---

## 🌟 Future Enhancements

* 📱 Mobile pass (wallet style)
* 🔍 QR scanner verification page
* 📊 Analytics & charts
* 🔄 Realtime updates
* 📄 PDF export (bulk passes)
* 👥 Role-based access control

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Ravula Ramesh**

* 💼 Full Stack Developer
* 🚀 Building SaaS & modern web apps

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
