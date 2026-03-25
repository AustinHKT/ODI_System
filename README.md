# Oswestry Disability Index (ODI) System

ระบบคัดกรองผู้ป่วยด้วยแบบสอบถาม Oswestry Low Back Pain Disability Questionnaire

## Features

### ฝั่งคนไข้ (Patient)
- กรอกข้อมูลเบื้องต้น (ชื่อ, วันเกิด, เพศ, HN)
- ทำแบบสอบถาม ODI 10 หมวด แบบ step-by-step (ภาษาไทย)
- แสดงผลลัพธ์พร้อมคำแนะนำตามระดับความรุนแรง
- บันทึกผลเป็นไฟล์ PNG

### ฝั่งเจ้าหน้าที่ (Admin Dashboard)
- Dashboard แสดงสถิติ แยกตามช่วงอายุ เพศ ระดับความรุนแรง
- ค้นหา/กรองข้อมูลผู้ป่วย
- ดูรายละเอียดคำตอบรายบุคคล
- Export ข้อมูลเป็น Excel (CSV)
- ระบบ Admin/User แยกสิทธิ์

## Tech Stack
- React 18 + Vite
- localStorage สำหรับเก็บข้อมูล
- html2canvas สำหรับ screenshot

## Getting Started

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push โค้ดไปยัง GitHub repository
2. เชื่อมต่อ repository กับ [Vercel](https://vercel.com)
3. Vercel จะ detect Vite framework อัตโนมัติ
4. กด Deploy

## Admin Login
- Username: `admin`
- Password: `1234`
- สามารถเปลี่ยนรหัสผ่านได้ในหน้าจัดการผู้ใช้
