# MongNganCMS - E-Commerce Website Portfolio

MongNganCMS là một hệ thống Website thương mại điện tử hoàn chỉnh được xây dựng dựa trên kiến trúc hiện đại, phân tách rõ ràng giữa Frontend và Backend. Dự án được phát triển với mục đích quản lý bán hàng, cung cấp trải nghiệm mua sắm trực tuyến mượt mà và tối ưu hóa quy trình quản trị.

---

## 🌟 Chức Năng Nổi Bật (Features)

### 1. Dành cho Khách Hàng (Customer - Frontend)
- **Giao diện chuẩn Hasaki:** UI/UX hiện đại, màu sắc đồng bộ, cấu trúc phân cấp rõ ràng với Sticky Navbar tiện dụng.
- **Trang chủ (Home):** Banner động, slider danh mục, hiển thị danh sách sản phẩm mới nhất và hệ thống tin tức/blog.
- **Quản lý Sản phẩm:** Hiển thị danh sách sản phẩm, lọc và tìm kiếm sản phẩm cơ bản, phân trang (Pagination).
- **Chi tiết Sản phẩm:** Hình ảnh Gallery/Lightbox, chọn số lượng, hiển thị thông tin giá, mô tả, tồn kho và các sản phẩm liên quan.
- **Giỏ hàng (Cart):** Tính năng thêm vào giỏ hàng với `useCart` Hook, lưu trữ cục bộ (Local Storage), điều chỉnh số lượng tự động tính tổng tiền.
- **Thanh toán (Checkout):** Nhập thông tin giao hàng, chọn phương thức thanh toán (COD, Bank Transfer...), tổng hợp hóa đơn và đặt hàng.
- **Tài khoản & Xác thực:** Đăng ký, đăng nhập bảo mật (JWT Tokens), quản lý thông tin hồ sơ (Profile) và theo dõi lịch sử đặt hàng.

### 2. Dành cho Quản Trị Viên (Admin - Backend)
- **Quản trị API:** RESTful API chuẩn mực phục vụ cho toàn bộ hoạt động của Frontend.
- **Quản lý Đơn hàng:** Xem, duyệt và cập nhật trạng thái đơn hàng.
- **Quản lý Sản phẩm & Danh mục:** Thêm, sửa, xóa sản phẩm và phân loại danh mục.

---

## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React.js (Sử dụng Vite để build nhanh chóng).
- **Ngôn ngữ:** JavaScript / JSX.
- **Routing:** React Router DOM.
- **UI/UX & Styling:** Vanilla CSS với tư duy CSS Modules / Component-based (Thiết kế lấy cảm hứng từ Hasaki.vn).
- **Icons:** Lucide React (Gọn nhẹ, hiện đại).
- **Kiến trúc:** Functional Components, Custom Hooks (`useCart`), Tách biệt API Services (`productService`, `orderService`, `authService`).

### Backend
- **Framework:** ASP.NET Core Web API / MVC (C#).
- **ORM:** Entity Framework Core.
- **Database:** SQL Server (Hoặc SQLite tùy môi trường cấu hình).
- **Bảo mật:** Authentication/Authorization với JWT (JSON Web Tokens).
- **Kiến trúc:** Layered Architecture (Models, Data, Controllers), RESTful API Design.

---

## 📁 Cấu Trúc Thư Mục (Folder Structure)

Dự án được phân tách thành 2 phần chính: `CMS.Backend` và `CMS.Frontend`.

```text
MongNganCMS_SOLUTION/
├── CMS.Backend/               # Source code ASP.NET Core Backend
│   ├── Controllers/           # Các API Endpoints
│   ├── Models/                # Entity Models định nghĩa cấu trúc DB
│   └── Program.cs             # Cấu hình Services, Middleware
│
├── CMS.Data/                  # Lớp truy cập dữ liệu (Data Access Layer / Entity Framework)
│
├── CMS.Frontend/              # Source code React.js Frontend
│   ├── src/
│   │   ├── components/        # Các thành phần tái sử dụng (Auth, Cart, Home, Common,...)
│   │   ├── hooks/             # Custom Hooks (useCart.js)
│   │   ├── pages/             # Các trang chính (HomePage, CartPage, CheckoutPage,...)
│   │   ├── services/          # Chứa logic kết nối API (Call Axios/Fetch)
│   │   ├── App.jsx            # Entry point của Routing
│   │   └── main.jsx           # Entry point của React App
```

---

## 🚀 Hướng Dẫn Cài Đặt (Getting Started)

### 1. Chạy Backend (ASP.NET Core)
1. Mở thư mục `CMS.Backend` bằng Visual Studio hoặc Terminal.
2. Cập nhật chuỗi kết nối Database trong `appsettings.json`.
3. Chạy lệnh:
   ```bash
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

### 2. Chạy Frontend (React + Vite)
1. Mở Terminal và di chuyển vào thư mục `CMS.Frontend`.
2. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```
3. Khởi động môi trường dev:
   ```bash
   npm run dev
   ```
4. Truy cập `http://localhost:5173` để trải nghiệm ứng dụng.

---

*Dự án này là minh chứng cho khả năng Fullstack Development, từ việc thiết kế CSDL, xây dựng API Backend mạnh mẽ đến việc cắt ghép giao diện Frontend tối ưu UX/UI.*
