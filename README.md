# BUỔI 1: KHỞI TẠO CẤU TRÚC ĐỒ ÁN CMS FULL-STACK

## 🎯 Mục tiêu
- Xây dựng cấu trúc Solution theo mô hình 3 tầng:
  - CMS.Data: Quản lý Entity và dữ liệu.
  - CMS.Backend: Xây dựng API và xử lý nghiệp vụ bằng ASP.NET Core.
  - CMS.Frontend: Xây dựng giao diện người dùng bằng ReactJS.
- Thiết kế các thực thể cơ bản cho hệ thống quản lý nội dung và bán hàng.
- Thiết lập mối quan hệ giữa các bảng trong Database.

---

## 🏗 Cấu trúc dự án


CMS_Solution
│
├── CMS.Data
│ └── Entities
│ ├── Category.cs
│ ├── Post.cs
│ ├── User.cs
│ ├── CategoryProduct.cs
│ ├── Product.cs
│ ├── Customer.cs
│ ├── Order.cs
│ └── OrderDetail.cs
│
├── CMS.Backend
│ ├── Controllers
│ └── Views
│
└── CMS.Frontend
├── src
├── public
└── package.json


---

## 📌 CMS.Data - Thiết kế Entity

Đã xây dựng các Entity chính:

### Quản lý nội dung
- Category: Quản lý danh mục bài viết.
- Post: Quản lý bài viết, nội dung và hình ảnh.
- User: Quản lý tài khoản quản trị.

### Quản lý bán hàng
- CategoryProduct: Quản lý danh mục sản phẩm.
- Product: Quản lý thông tin sản phẩm, giá, số lượng tồn kho.
- Customer: Quản lý thông tin khách hàng.
- Order: Lưu thông tin đơn hàng.
- OrderDetail: Lưu chi tiết sản phẩm trong đơn hàng.

Các Entity được thiết lập khóa chính, khóa ngoại và quan hệ giữa các bảng.

---

## ⚙️ CMS.Backend

- Khởi tạo dự án ASP.NET Core MVC.
- Kết nối tham chiếu tới CMS.Data.
- Thiết lập Backend làm Startup Project.
- Tạo Controller và View kiểm tra kết nối dữ liệu.

Đã thực hiện demo:
- CategoryController hiển thị danh sách danh mục.
- PostController hiển thị danh sách bài viết.
- UserController hiển thị danh sách người dùng.

---

## 🌐 CMS.Frontend

- Cài đặt môi trường ReactJS bằng Node.js.
- Khởi tạo project React.
- Tích hợp React vào Solution.
- Kiểm tra chạy giao diện Frontend.

Lệnh khởi tạo:

```bash
npx create-react-app cms.frontend

Chạy dự án:

npm start
