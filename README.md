# BUỔI 6: WEB API & RESTFUL SERVICE

## 1. Mục tiêu buổi học

Trong buổi 6, hệ thống được chuyển đổi từ mô hình Web MVC truyền thống sang kiến trúc **Web API RESTful Service**, giúp Backend có khả năng cung cấp dữ liệu cho nhiều nền tảng khác nhau như Website ReactJS, Mobile App hoặc các ứng dụng bên ngoài.

Các mục tiêu chính:

* Hiểu kiến trúc Client - Server và vai trò của Web API.
* Làm quen với định dạng dữ liệu JSON trong việc trao đổi dữ liệu.
* Xây dựng các API theo chuẩn RESTful với các phương thức GET, POST, PUT, DELETE.
* Tạo cầu nối dữ liệu giữa Backend ASP.NET Core Web API và giao diện ReactJS ở các buổi tiếp theo.
* Kiểm tra và quản lý API thông qua công cụ Swagger.

---

# 2. Tổng quan về Web API

## API là gì?

API (Application Programming Interface) là cầu nối giúp các ứng dụng có thể giao tiếp và trao đổi dữ liệu với nhau.

Trong mô hình Web truyền thống sử dụng MVC, Server chịu trách nhiệm xử lý dữ liệu và trả về giao diện HTML hoàn chỉnh. Tuy nhiên, với các ứng dụng hiện đại, Backend chỉ tập trung xử lý nghiệp vụ và cung cấp dữ liệu dưới dạng JSON, còn giao diện sẽ được xây dựng bởi các công nghệ Frontend như ReactJS.

### So sánh MVC và Web API:

### MVC truyền thống:

* Server lấy dữ liệu từ Database.
* Kết hợp dữ liệu với View.
* Trả về trang HTML hoàn chỉnh.
* Khó mở rộng khi cần phát triển thêm Mobile App.

### Web API hiện đại:

* Backend chỉ cung cấp dữ liệu JSON.
* Frontend tự xây dựng giao diện.
* Một API có thể phục vụ nhiều nền tảng khác nhau như Web, Mobile, IoT.
* Giúp phân tách rõ ràng giữa Frontend và Backend.

---

# 3. JSON - Định dạng dữ liệu trao đổi

JSON (JavaScript Object Notation) là định dạng dữ liệu phổ biến dùng để giao tiếp giữa Client và Server.

Ví dụ dữ liệu bài viết trả về từ API:

```json
{
  "id": 101,
  "title": "Học Web API Buổi 6",
  "author": "Admin",
  "isPublished": true
}
```

JSON sử dụng dạng:

```
Key : Value
```

Frontend ReactJS sẽ lấy các trường dữ liệu này để hiển thị lên giao diện.

Ví dụ:

```
post.title
post.author
```

---

# 4. Xây dựng API Controller

Tạo Controller dành riêng cho API:

```
Controllers
    └── PostsController.cs
```

API Controller khác MVC Controller ở điểm:

* Sử dụng `[ApiController]`.
* Kế thừa từ `ControllerBase`.
* Không trả về View HTML.
* Chỉ trả về dữ liệu JSON.

Ví dụ:

```csharp
[Route("api/[controller]")]
[ApiController]

public class PostsController : ControllerBase
{

}
```

Địa chỉ API:

```
https://localhost:xxxx/api/posts
```

---

# 5. Xây dựng API lấy danh sách dữ liệu (GET)

API GET dùng để lấy dữ liệu từ Database.

Ví dụ lấy danh sách bài viết:

```csharp
[HttpGet]
public IActionResult GetAll()
{
    var posts = _context.Posts
        .OrderByDescending(p => p.Id)
        .Select(p => new
        {
            p.Id,
            p.Title,
            p.ImageUrl,
            p.CreatedAt
        })
        .ToList();

    return Ok(posts);
}
```

Kết quả trả về:

```json
[
 {
   "id":1,
   "title":"Bài viết đầu tiên",
   "imageUrl":"image.jpg"
 }
]
```

API sử dụng:

```
GET /api/posts
```

---

# 6. API lấy dữ liệu theo danh mục

API hỗ trợ lọc dữ liệu theo tham số URL.

Ví dụ:

```
GET /api/posts/category/1
```

Code:

```csharp
[HttpGet("category/{categoryId}")]
public IActionResult GetByCategory(int categoryId)
{
    var posts = _context.Posts
        .Where(p => p.CategoryId == categoryId)
        .ToList();

    return Ok(posts);
}
```

Trong đó:

* `{categoryId}` nhận giá trị từ URL.
* `Where()` tương đương câu lệnh WHERE trong SQL.

---

# 7. API lấy chi tiết dữ liệu theo ID

API lấy thông tin chi tiết:

```
GET /api/posts/{id}
```

Ví dụ:

```
GET /api/posts/5
```

Code:

```csharp
[HttpGet("{id}")]
public IActionResult GetDetail(int id)
{
    var post = _context.Posts
        .FirstOrDefault(p => p.Id == id);

    if(post == null)
    {
        return NotFound();
    }

    return Ok(post);
}
```

Xử lý kết quả:

* Có dữ liệu → trả về HTTP 200.
* Không tìm thấy → trả về HTTP 404.

---

# 8. Kiểm tra API bằng Swagger

Swagger là công cụ hỗ trợ kiểm tra và mô tả API.

Cách kiểm tra:

1. Chạy dự án bằng Visual Studio (F5).
2. Truy cập:

```
https://localhost:xxxx/swagger
```

3. Chọn API cần kiểm tra.
4. Nhấn:

```
Try it out
→ Execute
```

Kiểm tra:

* Status Code.
* Response Body.
* Request URL.

Nếu nhận được JSON và mã 200 thì API hoạt động thành công.

---

# 9. Cấu hình CORS cho ReactJS

CORS (Cross-Origin Resource Sharing) cho phép Frontend ReactJS truy cập dữ liệu từ Backend API.

Trong file `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});
```

Kích hoạt:

```csharp
app.UseCors("AllowAll");
```

Sau khi cấu hình CORS:

* ReactJS có thể gọi API.
* Backend cho phép nhận request từ Frontend.
* Hệ thống sẵn sàng kết nối giao diện.

---

# 10. HTTP Status Code sử dụng trong API

API trả về dữ liệu kèm mã trạng thái để Client biết kết quả xử lý.

Các mã thường dùng:

| Status Code               | Ý nghĩa                            |
| ------------------------- | ---------------------------------- |
| 200 OK                    | Request thành công                 |
| 201 Created               | Tạo dữ liệu mới thành công         |
| 400 Bad Request           | Dữ liệu gửi lên sai                |
| 401 Unauthorized          | Chưa đăng nhập hoặc không có quyền |
| 404 Not Found             | Không tìm thấy dữ liệu             |
| 500 Internal Server Error | Lỗi phía Server                    |

---

# 11. Thiết kế Database hệ thống bán hàng

## Table CategoriesProduct (Danh mục sản phẩm)

Lưu thông tin danh mục sản phẩm.

Các trường:

* Id
* Name
* Description

## Table Products (Sản phẩm)

Lưu thông tin sản phẩm.

Các trường:

* Id
* Name
* Description
* Price
* StockQuantity
* ImageUrl
* CategoryProductId (Khóa ngoại)

## Table Customers (Khách hàng)

Lưu thông tin người mua hàng.

Các trường:

* Id
* FullName
* Email
* Phone
* Address
* Password

## Table Orders (Đơn hàng)

Lưu thông tin chung của đơn hàng.

Các trường:

* Id
* OrderDate
* CustomerId
* Status

Trạng thái:

* 0: Chờ duyệt

* 1: Đang giao

* 2: Đã hoàn thành

* Notes

## Table OrderDetails (Chi tiết đơn hàng)

Lưu danh sách sản phẩm trong đơn hàng.

Các trường:

* Id
* OrderId
* ProductId
* Quantity
* UnitPrice

---

# 12. Kết quả hoàn thành Buổi 6

Sau khi hoàn thành buổi học, hệ thống đã đạt được:

✅ Xây dựng thành công ASP.NET Core Web API.
✅ Tạo API Controller làm việc với Database.
✅ Trả dữ liệu dưới dạng JSON.
✅ Hoàn thành API GET danh sách và chi tiết dữ liệu.
✅ Kiểm tra API bằng Swagger.
✅ Cấu hình CORS để kết nối ReactJS.
✅ Chuẩn bị Backend API làm nguồn dữ liệu cho phần Frontend ở Buổi 7.

Web API hoàn thành đóng vai trò là lớp trung gian giữa Database và giao diện người dùng, giúp hệ thống dễ mở rộng, bảo trì và phát triển thêm nhiều nền tảng khác nhau.
