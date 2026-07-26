# রেজাল্ট ট্রান্সক্রিপ্ট (Academic Transcript) — Kashiani G.C. Pilot High School

Google Apps Script দিয়ে বানানো ছাত্র ফলাফল অনুসন্ধান ওয়েব অ্যাপ। এই রিপো `clasp` ব্যবহার করে
GitHub → Google Apps Script অটো-ডিপ্লয়ের জন্য রেডি করা হয়েছে।

## ফাইল স্ট্রাকচার

```
Code.gs                     ← ব্যাকএন্ড লজিক (SHEET_CONFIG, getStudentResult, doGet, doPost)
Transcript.html              ← ফ্রন্টএন্ড UI
appsscript.json               ← Apps Script ম্যানিফেস্ট
.clasp.json.example          ← .clasp.json বানানোর টেমপ্লেট (আসল ফাইলটা কমিট হবে না)
.claspignore                 ← clasp push করার সময় কোন ফাইল যাবে তা নিয়ন্ত্রণ করে
.github/workflows/deploy.yml ← main ব্র্যাঞ্চে push করলেই অটো ডিপ্লয়
```

## ⚠️ প্রথমে জরুরি একটা বিষয়

`Code.gs`-এর `SHEET_CONFIG`-এ কিছু ক্লাস-সেকশনের আসল Google Spreadsheet ID বসানো আছে
(এখনো যেগুলো `PASTE_SPREADSHEET_ID...` দিয়ে বদলানো হয়নি)। GitHub রিপোটা যদি **পাবলিক** হয়,
তাহলে এই আইডিগুলো যে কেউ দেখতে পারবে। তাই:

- হয় রিপোটা **Private** রাখুন, অথবা
- আইডিগুলো `Code.gs`-এ হার্ডকোড না করে **Script Properties**-এ রাখুন (চাইলে আমি এটা করে দিতে পারি)।

## প্রথমবার সেটআপ (লোকাল কম্পিউটার থেকে)

```bash
npm install -g @google/clasp
clasp login                     # ব্রাউজারে গুগল অ্যাকাউন্ট দিয়ে লগইন হবে
```

যদি নতুন Apps Script প্রজেক্ট বানাতে চান:
```bash
clasp create --type webapp --title "রেজাল্ট ট্রান্সক্রিপ্ট"
```

যদি আগে থেকেই একটা Apps Script প্রজেক্ট থাকে, তাহলে সেই প্রজেক্টের Script ID (Apps Script এডিটরের
Project Settings থেকে পাওয়া যাবে) দিয়ে `.clasp.json.example` কপি করে `.clasp.json` বানান:

```bash
cp .clasp.json.example .clasp.json
# .clasp.json খুলে scriptId বসিয়ে দিন
clasp push --force
```

## GitHub থেকে অটো-ডিপ্লয় চালু করার জন্য (GitHub Actions)

`.github/workflows/deploy.yml` ফাইলটা ইতিমধ্যে যোগ করা আছে — `main` ব্র্যাঞ্চে push হলেই
স্বয়ংক্রিয়ভাবে Apps Script-এ কোড push হয়ে যাবে। এর জন্য দুটো GitHub Secret বসাতে হবে
(রিপোর **Settings → Secrets and variables → Actions**-এ গিয়ে):

1. **`SCRIPT_ID`** — আপনার Apps Script প্রজেক্টের Script ID
2. **`CLASPRC_JSON`** — `clasp login` করার পর লোকাল কম্পিউটারে তৈরি হওয়া
   `~/.clasprc.json` ফাইলের সম্পূর্ণ কন্টেন্ট। বের করার জন্য:
   ```bash
   cat ~/.clasprc.json
   ```
   পুরো আউটপুটটা কপি করে Secret এ পেস্ট করুন।

সেটআপ শেষে যেকোনো সময় কোড পরিবর্তন করে `git push origin main` করলেই অ্যাপ আপডেট হয়ে যাবে।

## ওয়েব অ্যাপ হিসেবে পাবলিশ করা (প্রথমবার, ম্যানুয়ালি)

`clasp push` শুধু কোড আপলোড করে — ওয়েব অ্যাপ হিসেবে লাইভ URL পেতে Apps Script এডিটরে গিয়ে:
**Deploy → New deployment → Web app** সিলেক্ট করে, Execute as: **Me**, Who has access:
**Anyone** দিয়ে Deploy করুন। এরপর থেকে শুধু `clasp push` (বা GitHub push) করলেই কোড আপডেট
হবে, URL পাল্টাবে না।

## ব্যবহার

- `doGet` ছাড়া parameter দিলে (`?roll=..&class=..&section=..&examName=..&examYear=..`) JSON রেসপন্স দেয় (API mode)।
- parameter ছাড়া হিট করলে `Transcript.html` UI দেখায় (Web app mode)।
- `doPost`-এ `action: 'getResult' / 'getBatch' / 'getRanking'` সাপোর্ট করে।

> নোট: `doPost`-এর `getBatchResults` ও `getClassRanking` ফাংশন দুটো এই ফাইলে নেই — এগুলো
> অন্য কোনো `.gs` ফাইলে থাকলে সেটাও এই রিপোতে যোগ করে দিন, নাহলে ওই দুটো action কল করলে এরর আসবে।
