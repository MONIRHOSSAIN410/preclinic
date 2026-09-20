# Preclinic — Clinic / Hospital Admin Dashboard

একটি সম্পূর্ণ ফুল-স্ট্যাক ক্লিনিক ম্যানেজমেন্ট ড্যাশবোর্ড।

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui-style কম্পোনেন্ট + Framer Motion অ্যানিমেশন + Dark Mode + ডাইনামিক থিম কালার
- **Backend:** Node.js + Express.js (MVC — `routes` / `controllers` / `models`) + MongoDB (Mongoose) + JWT Auth

## ফোল্ডার স্ট্রাকচার

```
preclinic-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── models/        # Mongoose schemas
│   │   ├── controllers/   # Route handlers / business logic
│   │   ├── routes/        # Express routers
│   │   ├── middleware/    # auth + error handling
│   │   ├── utils/         # helpers (JWT, query builder)
│   │   ├── seed/          # dummy data seeder
│   │   └── server.js      # app entry point
│   └── package.json
└── frontend/
    ├── app/                # Next.js App Router pages (login, register, dashboard, doctors, patients, ...)
    ├── components/         # UI primitives + feature components
    ├── lib/                # api client, auth/theme/toast contexts
    ├── hooks/
    └── package.json
```

## ফিচার

- Admin **Register + Login** (JWT-based, প্রথম রেজিস্টার হওয়া অ্যাডমিন স্বয়ংক্রিয়ভাবে `superadmin`)
- **Dashboard**: stat cards, appointment statistics চার্ট, popular doctors, mini calendar, recent appointments
- **Doctors**: grid view, add/edit/delete, doctor details পেজ
- **Patients**: grid view, add/edit/delete, vitals + appointment history সহ patient details পেজ
- **Appointments**: টেবিল ভিউ, স্ট্যাটাস ফিল্টার, বুকিং/এডিট ডায়ালগ
- **Services, Departments, Specializations, Locations**: CRUD ম্যানেজমেন্ট
- **Invoices**: লিস্ট + প্রিন্ট-রেডি ইনভয়েস ডিটেইলস পেজ, লাইন-আইটেম সহ ইনভয়েস তৈরি
- **Activities**: টাইমলাইন ফিড
- **Reports**: appointment/invoice status breakdown + department-wise বার চার্ট
- **Settings**: প্রোফাইল আপডেট, ডার্ক মোড টগল, ৮টি প্রিসেট থেকে ডাইনামিক ড্যাশবোর্ড কালার বদলানো
- রেসপনসিভ ডিজাইন, স্মুথ স্ক্রল, পেজ ট্রানজিশন/মাইক্রো-অ্যানিমেশন সব জায়গায়

## সেটআপ (লোকাল মেশিনে)

### ১. MongoDB

লোকাল MongoDB চালু থাকতে হবে (অথবা MongoDB Atlas-এর একটি connection string ব্যবহার করুন)।

### ২. Backend

```bash
cd backend
npm install
cp .env.example .env      # .env ফাইলে MONGO_URI ও JWT_SECRET চেক/পরিবর্তন করুন
npm run seed               # ডামি ডেটা (ডাক্তার, পেশেন্ট, অ্যাপয়েন্টমেন্ট...) দিয়ে ডাটাবেজ ভরে দেবে
npm run dev                # http://localhost:5000 এ সার্ভার চালু হবে
```

সিড করার পর ডিফল্ট অ্যাডমিন লগইন:

```
Email:    admin@preclinic.com
Password: admin123
```

### ৩. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # প্রয়োজনে NEXT_PUBLIC_API_URL পরিবর্তন করুন
npm run dev                         # http://localhost:3000 এ অ্যাপ চালু হবে
```

ব্রাউজারে `http://localhost:3000` খুলুন — এটি স্বয়ংক্রিয়ভাবে লগইন পেজে নিয়ে যাবে। উপরের ডেমো অ্যাডমিন দিয়ে লগইন করুন অথবা নিজের অ্যাকাউন্ট রেজিস্টার করুন।

## ⚠️ গুরুত্বপূর্ণ নোট

এই কোডবেসটি একটি sandboxed cloud এনভায়রনমেন্টে লেখা হয়েছে যেখানে npm রেজিস্ট্রিতে (registry.npmjs.org) নেটওয়ার্ক অ্যাক্সেস সংস্থার নীতি অনুযায়ী ব্লক করা ছিল (`403 host_not_allowed`)। তাই এখানে **`npm install` চালিয়ে সরাসরি রান করে টেস্ট করা সম্ভব হয়নি।** পরিবর্তে প্রতিটি ফাইল কোড হিসেবে যত্ন সহকারে লেখা হয়েছে এবং স্বয়ংক্রিয় টুলের মাধ্যমে যাচাই করা হয়েছে:

- সব `.js`/`.jsx` ফাইল TypeScript কম্পাইলার দিয়ে সিনট্যাক্স-চেক করা হয়েছে (কোনো syntax error নেই)।
- সব `@/...` ইম্পোর্ট পাথ আসলেই বিদ্যমান ফাইলে resolve হয় কিনা যাচাই করা হয়েছে (৪৫০+ ইম্পোর্ট)।
- সব named/default import তার সংশ্লিষ্ট ফাইলে আসলেই export করা আছে কিনা ক্রস-চেক করা হয়েছে (frontend ও backend উভয়ে)।
- Backend-এর সব ফাইল `node --check` দিয়ে সিনট্যাক্স ভ্যালিডেট করা হয়েছে।

তবুও, যেহেতু `npm run dev`/`npm run build` বাস্তবে রান করে দেখা যায়নি, প্রথমবার লোকালে রান করার সময় ছোটখাটো কোনো রানটাইম ইস্যু দেখা দিলে (যেমন কোনো প্যাকেজ ভার্সন মিসম্যাচ) স্বাভাবিক — টার্মিনালের এরর মেসেজ দেখে সহজেই ঠিক করা সম্ভব হবে। প্রয়োজনে আবার এখানে জিজ্ঞেস করলে সমাধান করে দেওয়া হবে।

## API Endpoints (সংক্ষেপে)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/me

GET    /api/dashboard/summary
GET    /api/dashboard/reports

GET|POST      /api/doctors
GET|PUT|DELETE /api/doctors/:id

GET|POST      /api/patients
GET|PUT|DELETE /api/patients/:id
GET           /api/patients/:id/full   (patient + appointment history)

GET|POST      /api/appointments
GET|PUT|DELETE /api/appointments/:id

GET|POST      /api/services            /api/departments        /api/specializations        /api/locations
GET|PUT|DELETE /api/services/:id       /api/departments/:id     /api/specializations/:id     /api/locations/:id

GET|POST      /api/invoices
GET|PUT|DELETE /api/invoices/:id

GET|POST      /api/activities
```

সব রুট (`/auth/register` ও `/auth/login` ছাড়া) `Authorization: Bearer <token>` হেডার দিয়ে প্রোটেক্টেড।
