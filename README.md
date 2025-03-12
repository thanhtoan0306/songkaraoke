# Ứng Dụng Gợi Ý Bài Hát AI

Ứng dụng Progressive Web App (PWA) sử dụng Gemini AI để gợi ý bài hát.

## Yêu Cầu

- Node.js (để chạy web server đơn giản)
- API key của Google Gemini

## Cách Cài Đặt

1. Clone repository này về máy
2. Mở file `app.js` và thay thế `GEMINI_API_KEY` bằng API key của bạn
3. Cài đặt `http-server` globally:
```bash
npm install -g http-server
```

## Cách Chạy

1. Mở terminal trong thư mục dự án
2. Chạy lệnh:
```bash
http-server
```
3. Mở trình duyệt và truy cập: `http://localhost:8080`

## Tính Năng

- Gợi ý bài hát ngẫu nhiên bằng AI
- Giao diện người dùng đẹp mắt
- Hỗ trợ PWA (có thể cài đặt như ứng dụng native)
- Hoạt động offline
- Responsive design 