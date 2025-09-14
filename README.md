# Library UI

## Mô tả
Đây là dự án sử dụng **Vite** và **ReactJS** để phát triển ứng dụng web. Dự án được quản lý mã nguồn bằng Git với quy trình Git Workflow sử dụng các nhánh `main`, `develop`, và các nhánh `feature/*`.

## Yêu cầu
- Node.js (phiên bản 22.12.0 trở lên)
- npm hoặc Yarn
- Git

## Cài đặt và khởi động dự án

### 1. Clone repository
```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Cài đặt dependencies
```bash
npm install
```
Hoặc nếu sử dụng Yarn:
```bash
yarn install
```

### 3. Khởi động dự án (môi trường phát triển)
```bash
npm run dev
```
Hoặc với Yarn:
```bash
yarn dev
```
Dự án sẽ chạy tại `http://localhost:5173` (hoặc cổng khác nếu được cấu hình).

### 4. Build dự án (cho môi trường production)
```bash
npm run build
```
Hoặc với Yarn:
```bash
yarn build
```
File build sẽ được tạo trong thư mục `dist`.

### 5. Preview dự án sau khi build
```bash
npm run preview
```
Hoặc với Yarn:
```bash
yarn preview
```

## Quy trình làm việc với Git (Git Workflow)

### Cấu trúc nhánh
- **main**: Nhánh chính, chứa mã ổn định dùng cho production.
- **develop**: Nhánh tích hợp, chứa các tính năng đã hoàn thiện từ các nhánh `feature/*`.
- **feature/***: Các nhánh tính năng, được tạo để phát triển từng tính năng cụ thể.

### Quy trình làm việc
1. **Tạo nhánh feature**:
   - Từ nhánh `develop`, tạo nhánh feature mới:
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/<tên-tính-năng>
     ```
   - Ví dụ: `feature/add-login-page`

2. **Phát triển trên nhánh feature**:
   - Thực hiện các thay đổi và commit:
     ```bash
     git add .
     git commit -m "Mô tả chi tiết thay đổi"
     ```
   - Đẩy nhánh feature lên remote:
     ```bash
     git push origin feature/<tên-tính-năng>
     ```

3. **Merge nhánh feature vào develop**:
   - Khi tính năng hoàn thiện, tạo Pull Request (PR) từ nhánh `feature/*` vào nhánh `develop` trên giao diện Git (GitHub, GitLab, v.v.).
   - Sau khi PR được duyệt và merge:
     ```bash
     git checkout develop
     git pull origin develop
     ```
   - Xóa nhánh feature (nếu cần):
     ```bash
     git push origin --delete feature/<tên-tính-năng>
     ```

4. **Merge nhánh develop vào main**:
   - Khi nhánh `develop` ổn định và sẵn sàng cho production:
     ```bash
     git checkout main
     git pull origin main
     git merge develop
     git push origin main
     ```

### Lưu ý khi commit
- Viết commit message rõ ràng, mô tả ngắn gọn và cụ thể công việc đã thực hiện.
- Ví dụ: `Add login page UI`, `Fix bug in user authentication`, `Update README with Git workflow`.
- Tránh commit các file không liên quan (như `node_modules`, `.env`, v.v.). Đảm bảo file `.gitignore` được cấu hình đúng.

## Cấu hình .gitignore
Đảm bảo file `.gitignore` chứa các mục sau:
```
node_modules/
dist/
.env
*.log
```

## Góp ý
Nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ, vui lòng liên hệ team hoặc tạo issue trên repository.
