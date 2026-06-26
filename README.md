# BUỔI 2: KẾT NỐI DATABASE VỚI ENTITY FRAMEWORK CORE (EF CORE)

## 🎯 Mục tiêu

- Kết nối hệ thống với SQL Server bằng Entity Framework Core.
- Thực hiện kỹ thuật Code First Migration.
- Chuyển đổi các Entity C# thành bảng trong Database.
- Thay thế dữ liệu giả ở Buổi 1 bằng dữ liệu thật từ Database.

Sau buổi này:
- Có thể quản lý Database bằng Migration.
- Backend có thể truy xuất dữ liệu trực tiếp từ SQL Server.
- Hoàn thiện luồng dữ liệu từ Database → Backend → Giao diện.

---

# 🗃️ Kết nối Entity Framework Core

## Cài đặt thư viện NuGet

Đã cài đặt các package cần thiết:

- Microsoft.EntityFrameworkCore.SqlServer  
  → Kết nối với SQL Server.

- Microsoft.EntityFrameworkCore.Tools  
  → Hỗ trợ tạo Migration.

- Microsoft.EntityFrameworkCore.Design  
  → Hỗ trợ thiết kế Database.

Các package được cài đặt cho:
- CMS.Data
- CMS.Backend

---

# ⚙️ Xây dựng ApplicationDbContext

Tạo lớp:
