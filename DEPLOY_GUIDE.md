# Hướng Dẫn Cập Nhật Web GitHub Pages

Bạn đang gặp tình trạng "Vẫn thấy 1177 nghề" trên Web GitHub, lý do là vì code mới chưa được đẩy lên để GitHub cập nhật.

Hãy làm theo các bước sau:

## 1. Mở Terminal (Command Prompt hoặc Git Bash)
Tại thư mục dự án `myAIchatbotProject`:

```bash
# 1. Thêm tất cả các file đã sửa (bao gồm offlineStore.js mới)
git add .

# 2. Lưu thay đổi
git commit -m "Fix data: Update offline career list to 238 items"

# 3. Đẩy lên GitHub
git push origin main
```

## 2. Kiểm Tra GitHub Actions
1.  Truy cập repository của bạn trên GitHub.
2.  Bấm vào tab **Actions**.
3.  Bạn sẽ thấy một workflow đang chạy (màu vàng). Chờ nó chuyển sang màu xanh (Success).

## 3. Xóa Cache Trình Duyệt
Sau khi GitHub build xong (khoảng 2-3 phút):
1.  Vào trang Web GitHub Pages của bạn.
2.  Nhấn tổ hợp phím **Ctrl + Shift + R** (hoặc Cmd + Shift + R trên Mac) để tải lại trang và xóa dữ liệu cũ.

---
**Giải thích:**
- File `offlineStore.js` trên máy bạn ĐÃ SỬA (chứa 238 nghề).
- Web GitHub đang chạy phiên bản CŨ (chứa 1177 nghề).
- Bạn phải `git push` để GitHub lấy code mới của bạn và đưa lên Web.
