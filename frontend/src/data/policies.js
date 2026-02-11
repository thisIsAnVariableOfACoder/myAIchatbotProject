/**
 * Policy Content
 * Contains professional policy documents for Privacy Policy, Terms of Service, and Cookie Policy
 */

export const privacyPolicyContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Giới thiệu</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        AI Young Guru ("chúng tôi", "dịch vụ") cam kết bảo vệ quyền riêng tư của người dùng. Chính sách Quyền riêng tư này giải thích cách chúng tôi thu thập, sử dụng, và bảo vệ thông tin cá nhân của bạn khi sử dụng dịch vụ tư vấn nghề nghiệp AI của chúng tôi.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Thông tin chúng tôi thu thập</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Thông tin tài khoản:</strong> Email, tên người dùng, loại người dùng (học sinh, sinh viên, người đi làm)</p>
        <p><strong>Thông tin hồ sơ:</strong> Trình độ học vấn, sở thích, kỹ năng, mục tiêu nghề nghiệp</p>
        <p><strong>Thông tin hội thoại:</strong> Lịch sử chat với AI, câu hỏi và câu trả lời</p>
        <p><strong>Thông tin phân tích:</strong> Kết quả đánh giá nghề nghiệp, xác suất phù hợp với các ngành nghề</p>
        <p><strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại thiết bị, trình duyệt, thời gian truy cập</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Cách chúng tôi sử dụng thông tin</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Cung cấp dịch vụ:</strong> Phân tích và đưa ra lời khuyên nghề nghiệp phù hợp</p>
        <p><strong>Cải thiện AI:</strong> Huấn luyện và cải thiện mô hình AI để đưa ra lời khuyên tốt hơn</p>
        <p><strong>Cá nhân hóa:</strong> Tùy chỉnh trải nghiệm dựa trên hồ sơ và lịch sử của bạn</p>
        <p><strong>Liên lạc:</strong> Gửi thông báo quan trọng về tài khoản và dịch vụ</p>
        <p><strong>Phân tích:</strong> Nghiên cứu và thống kê để cải thiện dịch vụ</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Chia sẻ thông tin</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi KHÔNG bán thông tin cá nhân của bạn cho bên thứ ba.</p>
        <p><strong>Chúng tôi có thể chia sẻ thông tin trong các trường hợp:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Với nhà cung cấp dịch vụ (để vận hành dịch vụ)</li>
          <li>Để tuân thủ pháp luật hoặc yêu cầu của cơ quan chức năng</li>
          <li>Để bảo vệ quyền, tài sản, hoặc an toàn của chúng tôi hoặc người dùng</li>
          <li>Với sự đồng ý của bạn</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Bảo mật thông tin</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Mã hóa dữ liệu truyền tải và lưu trữ</li>
          <li>Quyền truy cập hạn chế cho nhân viên</li>
          <li>Đánh giá bảo mật định kỳ</li>
          <li>Backup dữ liệu an toàn</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Quyền của bạn</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn có quyền:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Truy cập và xem thông tin cá nhân của mình</li>
          <li>Chỉnh sửa hoặc cập nhật hồ sơ</li>
          <li>Xóa tài khoản và dữ liệu liên quan</li>
          <li>Từ chối hoặc hủy bỏ sự đồng ý</li>
          <li>Yêu cầu bản sao dữ liệu cá nhân</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Cookie</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi sử dụng cookie để:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Giữ trạng thái đăng nhập</li>
          <li>Nhớ các tùy chọn của bạn</li>
          <li>Phân tích cách sử dụng dịch vụ</li>
          <li>Cải thiện trải nghiệm người dùng</li>
        </ul>
        <p>Bạn có thể quản lý cookie trong cài đặt trình duyệt.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Thời gian lưu trữ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Thông tin cá nhân của bạn sẽ được lưu trữ trong thời gian cần thiết để cung cấp dịch vụ, hoặc theo yêu cầu pháp luật. Khi bạn xóa tài khoản, dữ liệu cá nhân sẽ được xóa hoặc ẩn danh trong vòng 30 ngày.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Thay đổi chính sách</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật chính sách này. Các thay đổi sẽ được thông báo qua email hoặc trên website. Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">10. Liên hệ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Nếu bạn có câu hỏi hoặc thắc mắc về chính sách quyền riêng tư, vui lòng liên hệ với chúng tôi qua email: <strong>support@aiyoungguru.com</strong>
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">11. Hiệu lực</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chính sách này có hiệu lực từ ngày <strong>11/02/2026</strong> và áp dụng cho tất cả người dùng của AI Young Guru.
      </p>
    </section>
  </div>
);

export const termsOfServiceContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Chấp nhận Điều khoản</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Bằng việc truy cập và sử dụng dịch vụ AI Young Guru, bạn đồng ý tuân thủ các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Mô tả dịch vụ</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>AI Young Guru cung cấp:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Dịch vụ tư vấn nghề nghiệp bằng AI</li>
          <li>Phân tích và đánh giá phù hợp với các ngành nghề</li>
          <li>Lưu trữ lịch sử hội thoại</li>
          <li>Cá nhân hóa lời khuyên dựa trên hồ sơ</li>
        </ul>
        <p>Chúng tôi có thể thay đổi hoặc ngừng cung cấp bất kỳ tính năng nào của dịch vụ mà không cần thông báo trước.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Trách nhiệm của người dùng</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn đồng ý:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Cung cấp thông tin chính xác và cập nhật</li>
          <li>Bảo mật tài khoản và mật khẩu</li>
          <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
          <li>Không can thiệp hoặc làm gián đoạn hoạt động của dịch vụ</li>
          <li>Không sao chép, sửa đổi, hoặc phân phối nội dung của dịch vụ</li>
          <li>Tuân thủ tất cả các luật pháp hiện hành</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Hạn chế trách nhiệm</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Lời khuyên của AI:</strong> Lời khuyên nghề nghiệp từ AI chỉ mang tính chất tham khảo. Chúng tôi không đảm bảo tính chính xác tuyệt đối và không chịu trách nhiệm cho các quyết định nghề nghiệp của bạn.</p>
        <p><strong>Dịch vụ:</strong> Dịch vụ được cung cấp "nguyên trạng" (as-is) và không có bảo đảm rõ ràng hay ngầm định nào.</p>
        <p><strong>Thiệt hại:</strong> Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, hoặc hậu quả nào phát sinh từ việc sử dụng dịch vụ.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Sở hữu trí tuệ</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Tất cả nội dung, tính năng, và thiết kế của AI Young Guru thuộc sở hữu của chúng tôi và được bảo vệ bởi luật sở hữu trí tuệ.</p>
        <p>Bạn được cấp quyền sử dụng dịch vụ cho mục đích cá nhân, không thương mại. Bạn không được:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Sao chép, sửa đổi, hoặc tạo bản phái sinh</li>
          <li>Sử dụng cho mục đích thương mại mà không có sự cho phép</li>
          <li>Xóa hoặc thay đổi các thông báo bản quyền</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Bảo mật tài khoản</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản và mật khẩu. Chúng tôi không chịu trách nhiệm cho bất kỳ mất mát hoặc thiệt hại nào phát sinh từ việc bạn không bảo mật thông tin tài khoản.</p>
        <p>Bạn phải thông báo ngay cho chúng tôi nếu phát hiện bất kỳ việc sử dụng trái phép nào đối với tài khoản của mình.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Chấm dứt dịch vụ</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi có quyền:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Đình chỉ hoặc chấm dứt tài khoản của bạn nếu bạn vi phạm các điều khoản này</li>
          <li>Ngừng cung cấp dịch vụ bất cứ lúc nào mà không cần thông báo trước</li>
          <li>Xóa nội dung hoặc tài khoản vi phạm chính sách</li>
        </ul>
        <p>Bạn cũng có thể xóa tài khoản của mình bất cứ lúc nào.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Nội dung người dùng</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn giữ quyền sở hữu đối với nội dung bạn cung cấp (hồ sơ, câu hỏi, phản hồi).</p>
        <p>Bằng cách cung cấp nội dung, bạn cấp cho chúng tôi quyền sử dụng, lưu trữ, và xử lý nội dung đó để cung cấp và cải thiện dịch vụ.</p>
        <p>Chúng tôi không sử dụng nội dung của bạn cho mục đích thương mại mà không có sự đồng ý của bạn.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Giải quyết tranh chấp</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Mọi tranh chấp phát sinh từ việc sử dụng dịch vụ sẽ được giải quyết thông qua:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Thương lượng thân thiện giữa các bên</li>
          <li>Trọng tài hoặc tòa án có thẩm quyền tại Việt Nam</li>
        </ul>
        <p>Luật áp dụng sẽ là luật pháp Việt Nam.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">10. Thay đổi điều khoản</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật các điều khoản này. Các thay đổi sẽ được thông báo qua email hoặc trên website. Việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa với việc bạn chấp nhận các thay đổi đó.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">11. Liên hệ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Nếu bạn có câu hỏi hoặc thắc mắc về Điều khoản Dịch vụ, vui lòng liên hệ với chúng tôi qua email: <strong>support@aiyoungguru.com</strong>
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">12. Hiệu lực</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Điều khoản Dịch vụ này có hiệu lực từ ngày <strong>11/02/2026</strong> và áp dụng cho tất cả người dùng của AI Young Guru.
      </p>
    </section>
  </div>
);

export const cookiePolicyContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Giới thiệu về Cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        AI Young Guru sử dụng cookie và các công nghệ tương tự để cải thiện trải nghiệm người dùng, phân tích cách sử dụng dịch vụ, và đảm bảo hoạt động ổn định của hệ thống. Chính sách Cookie này giải thích cách chúng tôi sử dụng cookie và quyền lựa chọn của bạn.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Cookie là gì?</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập một website. Cookie giúp website ghi nhớ:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Tùy chọn và cài đặt của bạn</li>
          <li>Trạng thái đăng nhập</li>
          <li>Hành vi và lịch sử truy cập</li>
          <li>Thông tin để cá nhân hóa trải nghiệm</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Các loại Cookie chúng tôi sử dụng</h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.1 Cookie thiết yếu (Essential Cookies)</h4>
          <p>Cookie này cần thiết để website hoạt động đúng cách. Chúng bao gồm:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Giữ trạng thái đăng nhập</li>
            <li>Bảo mật tài khoản</li>
            <li>Ngăn chặn gian lận</li>
          </ul>
          <p className="mt-2 text-sm italic">Cookie này không thể bị tắt.</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.2 Cookie chức năng (Functional Cookies)</h4>
          <p>Cookie này giúp ghi nhớ các tùy chọn của bạn:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Ngôn ngữ giao diện</li>
            <li>Tùy chọn hiển thị</li>
            <li>Lịch sử hội thoại</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.3 Cookie phân tích (Analytics Cookies)</h4>
          <p>Cookie này giúp chúng tôi hiểu cách bạn sử dụng dịch vụ:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Số lượng người truy cập</li>
            <li>Thời gian sử dụng</li>
            <li>Các tính năng phổ biến</li>
            <li>Vấn đề kỹ thuật</li>
          </ul>
          <p className="mt-2 text-sm italic">Thông tin được thu thập ẩn danh và không xác định danh tính cá nhân.</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.4 Cookie bên thứ ba (Third-Party Cookies)</h4>
          <p>Chúng tôi có thể sử dụng dịch vụ của bên thứ ba đặt cookie:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Dịch vụ xác thực (Google, Facebook)</li>
            <li>Dịch vụ phân tích</li>
            <li>Dịch vụ hỗ trợ khách hàng</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Cách chúng tôi sử dụng Cookie</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi sử dụng cookie để:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Cung cấp dịch vụ:</strong> Đảm bảo website hoạt động đúng cách</li>
          <li><strong>Cá nhân hóa:</strong> Tùy chỉnh trải nghiệm dựa trên tùy chọn của bạn</li>
          <li><strong>Phân tích:</strong> Hiểu cách sử dụng để cải thiện dịch vụ</li>
          <li><strong>Bảo mật:</strong> Bảo vệ tài khoản và ngăn chặn gian lận</li>
          <li><strong>Quảng cáo:</strong> (nếu có) Hiển thị quảng cáo phù hợp</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Thời gian lưu trữ Cookie</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Cookie có thời gian lưu trữ khác nhau:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Cookie phiên (Session Cookies):</strong> Xóa khi bạn đóng trình duyệt</li>
          <li><strong>Cookie vĩnh cửu (Persistent Cookies):</strong> Lưu trữ trong thời gian dài (thường là 30 ngày đến 1 năm)</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Quản lý Cookie</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn có thể quản lý cookie thông qua trình duyệt của mình:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Xem tất cả cookie đang được lưu trữ</li>
          <li>Xóa cookie cụ thể hoặc tất cả cookie</li>
          <li>Chặn cookie từ các website cụ thể</li>
          <li>Tắt cookie của bên thứ ba</li>
        </ul>
        <p className="mt-3"><strong>Lưu ý:</strong> Việc tắt cookie có thể ảnh hưởng đến trải nghiệm sử dụng dịch vụ. Một số tính năng có thể không hoạt động đúng cách.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Cập nhật Chính sách Cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật chính sách này khi thay đổi cách sử dụng cookie. Các thay đổi sẽ được thông báo qua email hoặc trên website.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Liên hệ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Nếu bạn có câu hỏi hoặc thắc mắc về Chính sách Cookie, vui lòng liên hệ với chúng tôi qua email: <strong>support@aiyoungguru.com</strong>
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Hiệu lực</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chính sách Cookie này có hiệu lực từ ngày <strong>11/02/2026</strong> và áp dụng cho tất cả người dùng của AI Young Guru.
      </p>
    </section>
  </div>
);