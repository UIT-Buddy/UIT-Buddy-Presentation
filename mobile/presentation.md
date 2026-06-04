# BÀI THUYẾT TRÌNH MÔN LẬP TRÌNH TRÊN THIẾT BỊ DI ĐỘNG — UIT BUDDY

## Thời lượng: 20 phút | 39 slides | Ít chữ — nhiều hình ảnh

---

## SLIDE 1 — Trang bìa

**UIT BUDDY**
*Ứng dụng đồng hành cùng sinh viên UIT trong học tập*

- Môn: Lập trình trên thiết bị di động - SE346.Q22
- Nhóm: UIT BUDDY
- GVHD: Nguyễn Tấn Toàn

---

## SLIDE 2 — Giới thiệu thành viên

*(4 cards in a single row)*

| STT | Họ và tên | MSSV | Vai trò |
| --- | ------------ | -------- | --------- |
| 1 | Phan Đình Minh | 23520949 | Frontend + DevOps |
| 2 | Tăng Minh Hoàng | 23520941 | Frontend |
| 3 | Trần Anh Tuấn | 23521409 | Backend |
| 4 | Võ Minh Tiến | 24521784 | Backend + AI + DevOps |

---

## SLIDE 3 — Giới thiệu đề tài: Vấn đề đặt ra

**Sự phân mảnh thông tin học đường:**
- Sinh viên phải truy cập nhiều hệ thống (Moodle, Portal, Email...) để theo dõi thời khoá biểu, điểm số và deadline.
- Dẫn đến nguy cơ bỏ lỡ deadline, tốn thời gian chuyển đổi nền tảng, và thiếu nơi tương tác nhóm chuyên sâu.

---

## SLIDE 4 — Giới thiệu đề tài: Giải pháp UIT Buddy

**Giải pháp All-in-One:**
Ứng dụng di động (Android/iOS) tích hợp học tập & tương tác trong một nền tảng duy nhất:
- Xem lịch học & thi
- Theo dõi tiến độ GPA
- Trao đổi bài vở & News Feed
- Lưu tài liệu AWS S3
- Chatbot hỗ trợ AI tư vấn

---

## SLIDE 5 — Tổng quan kiến trúc hệ thống

**3 Repositories — 1 Tổ chức GitHub:**
- **UIT-Buddy-Backend:** Spring Boot API + Dockerfile + DB migration.
- **UIT-Buddy-Frontend-App:** Flutter App Client (iOS, Android).
- **UIT-Buddy-GitOps-Manifests:** Deploy production & AWS infrastructure provisioning.

---

## SLIDE 6 — Công nghệ sử dụng

**Công nghệ lõi:**
- **Mobile App:** Flutter 3.38.6, BLoC Pattern, GoRouter, SecureStorage
- **Backend:** Spring Boot 4.0, Spring Security (JWT), Spring WebSockets
- **Database:** PostgreSQL 17 + Redis 8 Alpine
- **Cloud & DevOps:** AWS S3, CloudFront CDN, Docker, Terraform
- **AI Chatbot:** Python FastAPI + Neo4j Graph DB

---

## SLIDE 7 — Kiến trúc tổng quan (System Overview)

**Luồng dữ liệu:**
- Mobile App gửi requests đến REST / WebSocket Gateway.
- Backend Spring Boot điều phối các modules (auth, social, document...).
- Tác vụ tư vấn học tập / tri thức môn học được định tuyến riêng sang Python FastAPI kết nối database đồ thị Neo4j.

---

## SLIDE 8 — Backend: Kiến trúc Layered

**Spring Boot 4.0 — Layered Architecture:**
- **Controller Layer:** Định nghĩa endpoints, nhận requests và xác thực đầu vào.
- **Service Layer:** Xử lý nghiệp vụ chính, transaction management.
- **Repository Layer:** Spring Data JPA kết nối PostgreSQL.

---

## SLIDE 9 — Backend: Module Xác thực & Moodle

**Module auth & academic:**
- Bảo mật JWT: Access Token (15 phút) & Refresh Token (7 ngày).
- Tích hợp Mail Sender gửi OTP reset mật khẩu.
- Đồng bộ lịch học và điểm số qua Moodle API.
- Tích hợp Resilience4j Circuit Breaker phòng tránh Moodle API quá tải.

---

## SLIDE 10 — Backend: Module Mạng xã hội & File

**Module social & document:**
- Lưu trữ bài viết, bình luận, và biểu cảm (reactions) trong database quan hệ.
- Tạo S3 Presigned URL SigV4 cho phép client upload ảnh/video trực tiếp lên S3.
- Quản lý kênh WebSockets cho cộng tác biên tập tài liệu thời gian thực.

---

## SLIDE 11 — Backend: Database & Caching

**PostgreSQL 17 (AWS RDS) & Redis 8:**
- Cập nhật database version-controlled qua Flyway Migrations.
- Database RDS được đặt trong Private Subnet an toàn.
- Redis caching tối ưu tốc độ: cache môn học gần nhất (TTL: 1h), lưu OTP email (TTL: 5m) và quản lý token bị thu hồi.

---

## SLIDE 12 — Kiến trúc Frontend — Clean Architecture

**Flutter 3 Layers:**
- **Presentation:** UI Widgets và Quản lý trạng thái UI (BLoC/Cubit).
- **Domain:** Chứa Entities, UseCases và abstract Repositories (nghiệp vụ thuần Dart).
- **Data:** Models (ánh xạ JSON via Freezed), Repository Impls, và Dio Data Sources.

---

## SLIDE 13 — Cấu trúc thư mục Flutter

**Cấu trúc Feature-Driven:**
- Phân tách theo từng module tính năng độc lập (onboarding, calendar, social, chat, storage).
- Dễ phát triển song song và giảm thiểu xung đột git merge conflict.

---

## SLIDE 14 — State Management — BLoC Pattern

**flutter_bloc 9.1.1:**
- Luồng dữ liệu một chiều (Event → BLoC → State) rõ ràng.
- Giao diện UI tự động vẽ lại thông qua BlocBuilder.
- Dễ dàng Unit Test độc lập logic nghiệp vụ.

---

## SLIDE 15 — Dependency Injection & Routing

**GetIt & GoRouter:**
- GetIt quản lý Dependency Injection tập trung (Dio, SecureStorage, BLoCs).
- GoRouter điều hướng khai báo dạng cây mượt mà.
- Redirect Guard bảo vệ các route yêu cầu xác thực người dùng.

---

## SLIDE 16 — Network Layer — Dio & Error Handling

**Dio Interceptor & fpdart:**
- Tự động gắn token vào header.
- AuthInterceptor tự động refresh token ngầm khi nhận lỗi 401 Unauthorized.
- Sử dụng fpdart `Either<Failure, Success>` để bắt lỗi thuần hàm, hạn chế crash ứng dụng.

---

## SLIDE 17 — Freezed & Code Generation

**Freezed 3.1.0:**
- Sinh code tự động cho các Data Models, tránh viết mã boilerplate thủ công.
- Tự động sinh hàm `fromJson` / `toJson` và `copyWith` để clone đối tượng bất biến.

---

## SLIDE 18 — Tính năng: Onboarding & Đăng ký

**Xác minh danh tính sinh viên:**
- Sinh viên cung cấp Moodle Token cá nhân.
- Server gọi API Moodle trường xác minh danh tính và lấy MSSV, họ tên thật của sinh viên để hoàn tất đăng ký.

---

## SLIDE 19 — Tính năng: Session & Email OTP

**Bảo mật phiên & Đặt lại mật khẩu:**
- Lưu trữ an toàn JWT trong Keychain / Keystore qua `FlutterSecureStorage`.
- Gửi mã OTP xác nhận về Email trường của sinh viên để đặt lại mật khẩu mới.

---

## SLIDE 20 — Tính năng: Home Dashboard

**Bảng điều khiển cá nhân hóa:**
- Hiển thị thông tin sinh viên, thời khóa biểu sắp diễn ra.
- Tích hợp widget ghi chú nhanh và widget thời tiết địa phương.
- Nút truy cập nhanh các website nội bộ trường.

---

## SLIDE 21 — Tính năng: Lịch học tuần

**Thời khóa biểu trực quan:**
- Dạng lưới lịch học tuần dễ theo dõi.
- Hiển thị phòng học, tên giảng viên và deadline bài tập tương ứng của môn học.
- Lưu cache local để xem lịch ngoại tuyến khi mất kết nối.

---

## SLIDE 22 — Tính năng: Ghi chú Markdown

**Note Editor:**
- Trình soạn thảo văn bản kết hợp xem trước (Preview) Markdown thời gian thực ở phần dưới màn hình.
- Hỗ trợ đầy đủ định dạng chữ in nghiêng, in đậm, danh sách và codeblock.

---

## SLIDE 23 — Tính năng: S3 Document Export

**Save to Doc:**
- Tính năng xuất ghi chú thành file tài liệu.
- Tích hợp Folder Picker hiển thị modal thư mục lưu trữ S3, cho phép chọn folder đích và upload file.

---

## SLIDE 24 — Tính năng: Thời tiết học đường

**Định vị GPS & OpenWeatherMap:**
- Geolocator tự động định vị tọa độ Thủ Đức khi mở app.
- Hiển thị thông số chi tiết (độ ẩm, xác suất mưa) và dự báo thời tiết 24h & 7 ngày.

---

## SLIDE 25 — Tính năng: Theo dõi Deadlines

**Moodle Deadlines Manager:**
- Gom nhóm toàn bộ deadline từ Moodle phân chia theo từng lớp môn học.
- Trạng thái màu sắc cảnh báo trực quan: Đỏ (Overdue), Vàng (Near Deadline), Xanh (Done).

---

## SLIDE 26 — Tính năng: Chi tiết Deadline

**Yêu cầu chi tiết & Nộp bài:**
- Hiển thị đầy đủ yêu cầu bài tập của giảng viên, file đính kèm và bộ đếm ngược thời gian còn lại.
- Tra cứu trạng thái bài nộp và điểm số trực tiếp.

---

## SLIDE 27 — Tính năng: Mạng xã hội News Feed

**Bản tin sinh viên UIT:**
- Đăng bài viết thảo luận học tập, câu lạc bộ kèm hình ảnh, video (lưu trữ S3).
- Hệ thống thả biểu cảm đa dạng và bình luận lồng nhau.

---

## SLIDE 28 — Tính năng: Hệ thống bạn bè & Tìm kiếm

**Friendship & Search:**
- Quản lý danh sách bạn bè cùng trường, tab duyệt lời mời kết bạn.
- Tìm kiếm sinh viên qua tên, MSSV và tìm kiếm bài viết theo từ khóa.

---

## SLIDE 29 — Tính năng: Trợ lý AI UIT Buddy

**UIT Buddy AI Chatbot:**
- Chatbot hỗ trợ 24/7 giải đáp thắc mắc về lộ trình, thông tin môn học.
- Giao diện chat thời gian thực hỗ trợ render cú pháp Markdown và codeblock.

---

## SLIDE 30 — Tính năng: Kiến trúc RAG phía Backend

**Tri thức đồ thị Neo4j:**
- Dịch vụ AI backend truy vấn đồ thị quan hệ môn học tiên quyết trong cơ sở dữ liệu Neo4j.
- RAG kết hợp LLM để sinh lộ trình học tập tối ưu nhất cho sinh viên.

---

## SLIDE 31 — Tính năng: Chat 1-1 & Nhóm

**Real-time CometChat SDK:**
- Mở cuộc trò chuyện nhắn tin 1-1 với bạn học hoặc tạo phòng nhóm thảo luận theo mã môn học.
- Trạng thái tin nhắn đã gửi, đã đọc, và trạng thái online/offline thời gian thực.

---

## SLIDE 32 — Tính năng: Voice & Video Calls

**HD CometChat Calls:**
- Tích hợp module gọi thoại và gọi video call chất lượng HD trực tiếp giữa các sinh viên.
- Kết nối ngang hàng WebRTC P2P tối thiểu hóa độ trễ âm thanh và hình ảnh.

---

## SLIDE 33 — Tính năng: Lưu trữ S3 & CloudFront CDN

**Hệ thống file học tập:**
- Quản lý file/folder môn học, hỗ trợ xem trước (Preview) file PDF, ảnh trực tiếp trong app.
- Phân phối file an toàn qua CloudFront CDN SigV4 Presigned URL.

---

## SLIDE 34 — Tính năng: Phân quyền Storage

**Access Control:**
- Cấu hình quyền truy cập thư mục: Viewer, Editor, Owner/Manager.
- Chia sẻ tài liệu an toàn cho các bạn học cùng nhóm.
- Cộng tác biên tập đồng thời qua kênh WebSocket.

---

## SLIDE 35 — Tính năng: Quản lý Task cá nhân

**Checklist & Reminder:**
- Tạo checklist công việc tự do bên cạnh deadline Moodle.
- Thiết lập độ ưu tiên (High, Medium, Low) và hẹn giờ nhắc nhở (Local Notification).

---

## SLIDE 36 — Tính năng: Tiến độ học tập & Điểm

**GPA & Credit Progress:**
- Tra cứu bảng điểm chi tiết từng học kỳ.
- Biểu đồ đường thay đổi GPA qua các học kỳ và thanh tiến độ hoàn thành tín chỉ tốt nghiệp.

---

## SLIDE 37 — Push Notification — Firebase FCM

**Firebase Cloud Messaging (FCM):**
- Tự động đẩy thông báo nhắc deadline lúc 8h sáng hàng ngày.
- Đẩy thông báo tin nhắn chat mới, cuộc gọi nhỡ, reaction bài viết.

---

## SLIDE 38 — Tổng kết

**Kết quả đạt được:**
- Ứng dụng di động hoạt động tốt trên cả Android & iOS.
- Clean Architecture vững vàng giúp bảo trì và mở rộng tính năng dễ dàng.
- Tự động hóa CI/CD 100% qua GitHub Actions, độ trễ WebSocket < 100ms.

---

## SLIDE 39 — Cảm ơn & Q&A

**Hỏi & Đáp — Q&A** 🎤
