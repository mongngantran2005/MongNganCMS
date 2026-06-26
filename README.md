# BUỔI 3 - 4 - 5: HOÀN THIỆN TRUY VẤN DỮ LIỆU, ADMIN PANEL VÀ BẢO MẬT HỆ THỐNG

## 🎯 Mục tiêu

Trong các buổi 3, 4 và 5, hệ thống CMS được tiếp tục phát triển với các chức năng:

- Truy vấn và xử lý dữ liệu bằng LINQ với Entity Framework Core.
- Xây dựng chức năng CRUD cho các đối tượng trong hệ thống.
- Thiết kế giao diện quản trị Admin Panel.
- Quản lý bài viết, thành viên, sản phẩm và đơn hàng.
- Xây dựng hệ thống đăng nhập và phân quyền người dùng.
- Bảo vệ khu vực quản trị bằng Authentication và Authorization.

---

# 🔎 BUỔI 3: TRUY VẤN DỮ LIỆU VÀ CRUD VỚI ENTITY FRAMEWORK CORE

## Sử dụng LINQ truy vấn dữ liệu

Áp dụng LINQ để thao tác dữ liệu từ Database:

Các kỹ thuật sử dụng:

- Where: Lọc dữ liệu theo điều kiện.
- OrderBy / OrderByDescending: Sắp xếp dữ liệu.
- FirstOrDefault: Lấy một bản ghi.
- Include: Kết nối dữ liệu giữa các bảng.
- ToList: Lấy danh sách dữ liệu.

Ví dụ:

```csharp
var posts = _context.Posts
    .Include(p => p.Category)
    .OrderByDescending(p => p.CreatedDate)
    .ToList();
```

Kết quả:

- Lấy danh sách bài viết.
- Hiển thị thông tin danh mục đi kèm.
- Sắp xếp bài viết mới nhất.

---

# 🔗 Kết nối dữ liệu giữa các bảng

Sử dụng Include để lấy dữ liệu liên quan:

Ví dụ:

```
Post
 |
 └── Category
```

Giúp hiển thị:

- Tên bài viết.
- Danh mục bài viết.
- Thông tin liên quan.

---

# ⚙️ Xây dựng CRUD Category

Hoàn thiện các chức năng:

## Create

Thêm dữ liệu mới vào Database.

Luồng xử lý:

```
Form nhập liệu

↓

Controller

↓

Entity Framework Core

↓

SQL Server
```

---

## Update

Cập nhật dữ liệu:

```csharp
_context.Categories.Update(model);
_context.SaveChanges();
```

---

## Delete

Xóa dữ liệu:

```csharp
_context.Categories.Remove(category);
_context.SaveChanges();
```

---

## Hiển thị dữ liệu mới nhất

Sử dụng:

```csharp
.Take(3)
```

để lấy 3 bài viết mới nhất hiển thị trên trang chủ.

---

# 🖥️ BUỔI 4: XÂY DỰNG GIAO DIỆN QUẢN TRỊ ADMIN PANEL

## 🎯 Mục tiêu

- Xây dựng giao diện quản trị chuyên nghiệp.
- Tạo Layout Admin dùng chung.
- Quản lý các chức năng trong hệ thống.
- Hoàn thiện CRUD Post và User.

---

# 🏗️ Thiết kế Admin Layout

Tạo file:

```
Views/Shared/_LayoutAdmin.cshtml
```

Cấu trúc:

```
Admin Panel

├── Sidebar
│
├── Dashboard
├── Danh mục
├── Bài viết
├── Thành viên
├── Sản phẩm
├── Đơn hàng
│
└── Content
    └── RenderBody()
```

---

## Sidebar quản trị

Các chức năng:

| Chức năng | Controller |
|---|---|
| Dashboard | Home |
| Danh mục | Category |
| Bài viết | Post |
| Thành viên | User |
| Sản phẩm | Product |
| Đơn hàng | Order |

---

## Công nghệ sử dụng

- ASP.NET Core MVC.
- Razor View.
- Bootstrap 5.
- Bootstrap Icons.
- Tag Helpers.

Áp dụng Layout:

```cshtml
@{
    Layout = "_LayoutAdmin";
}
```

---

# 📝 Quản lý bài viết (Post Management)

Hoàn thiện CRUD:

```
Post

├── Index
├── Create
├── Edit
├── Delete
└── Details
```

---

## Thêm bài viết

Chức năng:

- Nhập tiêu đề.
- Nhập nội dung.
- Chọn danh mục.
- Upload hình ảnh.
- Lưu dữ liệu vào Database.

---

## Upload hình ảnh

Quy trình:

```
Chọn ảnh

↓

Lưu vào wwwroot/uploads

↓

Tạo tên file bằng GUID

↓

Lưu đường dẫn vào Database
```

Database lưu:

```
/uploads/image.jpg
```

---

## Chỉnh sửa bài viết

Cho phép:

- Cập nhật tiêu đề.
- Cập nhật nội dung.
- Thay đổi danh mục.
- Thay đổi hình ảnh.

---

## Xóa bài viết

Quy trình:

```
Find()

↓

Remove()

↓

SaveChanges()

↓

Database
```

---

# ✍️ Tích hợp CKEditor

Mục đích:

- Soạn thảo nội dung chuyên nghiệp.
- Hỗ trợ định dạng văn bản.
- Hiển thị nội dung HTML.

Hiển thị:

```cshtml
@Html.Raw(Model.Content)
```

---

# 👥 Quản lý thành viên (User Management)

Hoàn thiện:

```
User

├── Index
├── Create
├── Edit
└── Delete
```

---

## Thông tin User

Quản lý:

- Username.
- Password.
- FullName.
- Role.

Role:

```
Admin
Editor
```

---

## Chỉnh sửa User

Chức năng:

- Cập nhật thông tin.
- Đổi quyền.
- Đổi mật khẩu.
- Giữ mật khẩu cũ nếu không nhập mới.

Sử dụng:

```csharp
AsNoTracking()
```

---

# 🔐 BUỔI 5: AUTHENTICATION & AUTHORIZATION

## 🎯 Mục tiêu

- Xây dựng chức năng đăng nhập.
- Xác thực người dùng bằng Cookie.
- Phân quyền Admin / Editor.
- Bảo vệ trang quản trị.

---

# 🔑 Luồng đăng nhập

```
Nhập Username + Password

↓

Kiểm tra bảng Users

↓

Tạo Claims

↓

Lưu Cookie

↓

Truy cập Admin
```

---

# ⚙️ Cookie Authentication

Cấu hình:

```
Program.cs
```

Sử dụng:

```csharp
AddAuthentication()
.AddCookie();
```

Đường dẫn:

```
Login:
/Account/Login

AccessDenied:
/Account/AccessDenied
```

---

# 👤 AccountController

Xây dựng:

```
AccountController

├── Login()
├── Logout()
└── AccessDenied()
```

---

# 📝 Chức năng Login

Hệ thống:

- Kiểm tra tài khoản trong Database.
- Tạo thông tin Claims.
- Lưu Cookie xác thực.

Claims bao gồm:

- Username.
- FullName.
- Role.

---

# 🔒 Authorization - Phân quyền

## Bảo vệ Controller

Sử dụng:

```csharp
[Authorize]
```

Ví dụ:

```csharp
[Authorize]
public class PostController : Controller
{
}
```

Chỉ người đăng nhập mới truy cập được.

---

## Phân quyền Admin

Sử dụng:

```csharp
[Authorize(Roles="Admin")]
```

Admin có quyền:

- Quản lý User.
- Quản lý toàn bộ hệ thống.

---

## Quyền Editor

Editor được:

- Quản lý bài viết.

Không được:

- Quản lý thành viên.

---

# 🚫 Access Denied

Khi không đủ quyền:

Hiển thị:

```
403 - KHÔNG CÓ QUYỀN TRUY CẬP
```

Ví dụ:

```
Editor

↓

Vào User Management

↓

Access Denied
```

---

# 🔐 Bảo mật mật khẩu

Trong giai đoạn học tập:

- Lưu mật khẩu để kiểm tra chức năng.

Khi triển khai thực tế:

- Cần Hash Password.
- Không lưu mật khẩu dạng Plain Text.

---

# ✅ KẾT QUẢ ĐẠT ĐƯỢC

Sau khi hoàn thành Buổi 3, 4 và 5:

✅ Truy vấn dữ liệu bằng LINQ.

✅ Hoàn thiện CRUD Category, Post, User.

✅ Xây dựng Admin Panel chuyên nghiệp.

✅ Quản lý bài viết và thành viên.

✅ Upload hình ảnh.

✅ Tích hợp CKEditor.

✅ Xây dựng Login bằng Cookie Authentication.

✅ Phân quyền Admin / Editor.

✅ Bảo vệ các trang quản trị.

---

# 🚀 Hướng phát triển tiếp theo

- Hash mật khẩu bằng BCrypt.
- Xây dựng API Backend.
- Kết nối React Frontend.
- Hoàn thiện quản lý sản phẩm.
- Xây dựng giỏ hàng.
- Xây dựng chức năng đặt hàng.
- Hoàn thiện hệ thống thương mại điện tử.
