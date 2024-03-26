**1. Giới thiệu đồ án:**
Đồ án này là một website GAME CỜ VUA online multiplayer, được thiết kế để cung cấp trải nghiệm chơi cờ vua trực tuyến. Người dùng có thể tham gia vào các trận đấu với người chơi khác thông qua mạng internet.

**1.1. Tính năng chính:**
**Chơi đa người chơi:** Người dùng có thể tham gia vào các trận đấu với người chơi khác trên mạng.

**Nhiều page:** Giao diện được chia thành nhiều trang để dễ dàng quản lý và tương tác.

**Realtime:** Trò chơi được cập nhật realtime qua WebSocket, đảm bảo sự tương tác nhanh chóng và mượt mà.

**2. Công nghệ sử dụng:**
**2.1. Frontend (FE):**
ReactJS: Dùng để xây dựng giao diện người dùng (UI) linh hoạt và tương tác.
**2.2. Backend (BE):**
Spring Boot: Framework Java được sử dụng để xây dựng backend, cung cấp các API cho việc xử lý logic, quản lý dữ liệu và tương tác với cơ sở dữ liệu.
WebSocket API: Tạo kết nối realtime với client, cung cấp cơ chế truyền tải thông tin về trạng thái trò chơi, di chuyển của quân cờ, và thông báo kết quả trận đấu.
**2.3. Cơ sở dữ liệu:**
MySQL: Lưu trữ thông tin về người dùng, trạng thái trò chơi, lịch sử di chuyển quân cờ và các dữ liệu khác liên quan đến game.
