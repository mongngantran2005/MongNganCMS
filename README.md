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
- **Thanh toán (Checkout):** Nhập thông tin giao hàng, chọn phương thức thanh toán (COD, Bank Transfer...), tổng hợp hóa đơn và đặt hàng. Validate toàn bộ các trường chặt chẽ trước khi gửi dữ liệu đi.
- **Tài khoản & Xác thực:** Đăng ký, đăng nhập bảo mật (JWT Tokens), quản lý thông tin hồ sơ (Profile) và theo dõi lịch sử đặt hàng.
- **Quên mật khẩu OTP:** Xác thực và đổi mật khẩu qua mã OTP 6 số bảo mật gửi thẳng về email, thực hiện hoàn toàn liền mạch trên một giao diện.

### 2. Dành cho Quản Trị Viên (Admin - Backend)
- **Giao diện thân thiện (Admin Layout):** Sidebar cố định không bị trượt khi cuộn trang, menu dạng Accordion tinh gọn, giao diện nút bấm (Action buttons) tối ưu hóa chỉ còn icon.
- **Quản trị API:** RESTful API chuẩn mực phục vụ cho toàn bộ hoạt động của Frontend.
- **Quản lý Đơn hàng:** Xem, duyệt và cập nhật trạng thái đơn hàng. Hỗ trợ thay đổi trạng thái hàng loạt qua AJAX và Modal xem chi tiết cực nhanh.
- **Quản lý Sản phẩm & Danh mục:** Thêm, sửa, xóa sản phẩm và phân loại danh mục.
- **Phân trang Backend (Pagination):** Xử lý lượng lớn dữ liệu trơn tru ở tất cả các danh sách (Products, Categories, Users, Posts...) với phân trang Server-side.

---

## 🚀 Những Cập Nhật Mới Nhất (Buổi 9)

1. **Tối ưu hóa API sản phẩm mới nhất & bài viết mới nhất:**
   - Tách riêng API chuyên dụng `GET /api/products/latest` thay vì tái sử dụng `GetAll`. Giải quyết rủi ro tải toàn bộ dữ liệu khi không truyền `limit`.
   - Tách riêng API `GET /api/posts/latest` cho bài viết. Cả 2 đều là API đơn nhiệm (Single Responsibility), dễ tối ưu Cache/Index về sau.
2. **Chức năng Hủy từng sản phẩm trong đơn hàng (Admin):**
   - Admin có thể đánh dấu từng sản phẩm trong đơn là "Không thể giao".
   - Hệ thống tự động: cập nhật `OrderDetail.Status = Cancelled`, lưu lý do hủy, hoàn trả số lượng tồn kho và tính lại tổng tiền đơn.
   - Gửi **email HTML đẹp** thông báo đến khách hàng về sản phẩm bị hủy và số tiền hoàn lại.
   - Entity `OrderDetail` được bổ sung 2 trường: `Status` và `CancelReason` (đã Migration).
3. **Fix lỗi giỏ hàng không trống sau khi đặt hàng:**
   - Phát hiện lỗi closure: hàm `removeFromCart` trong vòng lặp `forEach` đọc state cũ nên chỉ xóa 1 sản phẩm.
   - Sửa bằng cách thay thế toàn bộ vòng lặp bằng `clearCart()` — xóa sạch giỏ hàng một lần duy nhất sau khi đặt hàng thành công.
4. **Dọn dẹp giao diện trang Giỏ hàng:**
   - Bỏ phần "Có thể bạn thích" dùng placeholder ảnh giả (SP1-SP6 cứng) không có dữ liệu thật.
5. **Cải thiện thông báo kết quả tìm kiếm trống:**
   - Thay icon "NOT FOUND" và nội dung cũ bằng thông báo thân thiện hơn: *"Rất tiếc, chúng tôi chưa có sản phẩm nào cho danh mục này."*

## 🚀 Những Cập Nhật (Buổi 8)

1. **Giao diện & Trải nghiệm Quản trị viên (Admin):**
   - Cố định Sidebar (`position: fixed`), bổ sung menu Accordion sổ xuống.
   - Đồng bộ toàn bộ nút "Sửa" thành dạng Icon (chuẩn phong cách Minimalist).
   - Bổ sung thông tin FullName và Badge Role người quản trị trên Topbar.
2. **Quản lý Đơn hàng (Admin):**
   - Hỗ trợ thao tác chọn nhiều đơn hàng bằng Checkbox và cập nhật trạng thái ("Chờ vận chuyển") hàng loạt mà không cần reload trang.
3. **Phân trang (Server-side Pagination):**
   - Áp dụng phân trang đồng loạt trên tất cả các trang danh sách của Admin.
4. **Giao diện Thanh toán (Checkout - Frontend):**
   - Xây dựng hệ thống Validation Form chuyên sâu: báo lỗi riêng cho từng trường, tô đỏ ô bị lỗi và tự động scroll trang tới lỗi đầu tiên.
5. **Tính năng Quên mật khẩu OTP:**
   - Xóa bỏ kiểu gửi link xác thực rườm rà. Nâng cấp lên gửi **Mã OTP 6 số** qua email, giúp trải nghiệm khôi phục mật khẩu liền mạch, hiện đại và bảo mật hơn rất nhiều.

---


## 🛠 Công Nghệ Sử Dụng (Tech Stack)

### Frontend
- **Framework:** React.js (Sử dụng Vite để build nhanh chóng).
- **Routing:** React Router DOM.
- **UI/UX & Styling:** Vanilla CSS với tư duy CSS Modules / Component-based (Thiết kế lấy cảm hứng từ Hasaki.vn).
- **Kiến trúc:** Functional Components, Custom Hooks (`useCart`).

### Backend
- **Framework:** ASP.NET Core MVC & Web API (C#).
- **ORM:** Entity Framework Core.
- **Database:** SQL Server.
- **Bảo mật:** JWT (JSON Web Tokens), BCrypt Hashing.

---

## 📁 Cấu Trúc Thư Mục (Folder Structure)

Dự án được phân tách thành 3 project chính theo chuẩn kiến trúc: `CMS.Backend`, `CMS.Data`, và `CMS.Frontend`.

```text
MongNganCMS_SOLUTION/
├── CMS.Backend/               # Project ASP.NET Core (Xử lý API & Admin UI)
│   ├── Controllers/           # Các Controllers (MVC cho Admin và API cho Frontend)
│   ├── Services/              # Các Business Logic Services (vd: Gửi Email)
│   ├── Views/                 # Giao diện Razor Pages cho trang Quản trị (Admin)
│   │   ├── Shared/            # Chứa LayoutAdmin, Pagination dùng chung
│   │   └── ...
│   ├── appsettings.json       # Cấu hình ConnectionString và SMTP Email
│   └── Program.cs             # Cấu hình Middleware, Dependency Injection
│
├── CMS.Data/                  # Project Data Layer (Entity Framework Core)
│   ├── Entities/              # Các Models ánh xạ với bảng Database (Customer, Order...)
│   ├── ApplicationDbContext.cs# Cấu hình Context cho EF
│   └── Migrations/            # Chứa các file lịch sử thay đổi cấu trúc DB
│
├── CMS.Frontend/              # Project React.js (Giao diện người dùng)
│   ├── src/
│   │   ├── components/        # Thư mục chứa các UI Components tái sử dụng
│   │   │   ├── Auth/          # Form Đăng nhập, Đăng ký
│   │   │   ├── Checkout/      # Components chia nhỏ cho trang Thanh toán
│   │   │   └── Common/        # Navbar, Footer dùng chung
│   │   ├── hooks/             # Custom Hooks (useCart.js xử lý logic giỏ hàng)
│   │   ├── pages/             # Các màn hình chính (HomePage, CheckoutPage, ForgotPasswordPage...)
│   │   ├── services/          # Thư mục giao tiếp API với Backend qua Axios
│   │   ├── App.jsx            # Cấu hình Routing toàn bộ ứng dụng
│   │   └── main.jsx           # Entry point
│   ├── .env                   # Chứa biến môi trường (API URL)
│   └── package.json           # Danh sách thư viện NPM
│
└── README.md                  # File tài liệu mô tả toàn bộ dự án
```

---

## 🚀 Hướng Dẫn Cài Đặt (Getting Started)

### 1. Chạy Backend (ASP.NET Core)
1. Mở thư mục `CMS.Backend`.
2. Cập nhật chuỗi kết nối Database và thông tin MailSettings trong `appsettings.json`.
3. Chạy lệnh:
   ```bash
   dotnet restore
   dotnet ef database update --project ../CMS.Data
   dotnet run
   ```

### 2. Chạy Frontend (React + Vite)
1. Mở Terminal và di chuyển vào thư mục `CMS.Frontend`.
2. Chạy lệnh:
   ```bash
   npm install
   npm run dev
   ```
3. Truy cập `http://localhost:5173` để trải nghiệm ứng dụng người dùng. Trực tiếp vào cổng Backend (vd: `http://localhost:5188`) để truy cập trang Quản trị Admin.
