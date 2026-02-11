/**
 * Expanded Policy Content — policies.jsx
 * Phiên bản đã cập nhật: bỏ phần liên hệ và điều chỉnh sản phẩm phù hợp cho mọi lứa tuổi.
 *
 * LƯU Ý: Nội dung dưới đây là mẫu nội dung pháp lý/ứng xử điển hình.
 * Trước khi đưa vào sử dụng chính thức, nên cho luật sư / chuyên gia pháp lý kiểm duyệt
 * để đảm bảo phù hợp với pháp luật địa phương và mô hình kinh doanh.
 */

import React from "react";

export const privacyPolicyContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Giới thiệu</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        AI Young Guru ("AI Young Guru", "Chúng tôi", "Dịch vụ") cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của người dùng.
        Chính sách Quyền riêng tư này mô tả loại dữ liệu chúng tôi thu thập, lý do thu thập, cách sử dụng, lưu trữ, chia sẻ,
        quyền của bạn, và cách thực hiện các quyền đó thông qua các chức năng có sẵn trên nền tảng. Nội dung áp dụng cho mọi người dùng truy cập website,
        ứng dụng di động và các sản phẩm/dịch vụ liên quan.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Định nghĩa</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Dữ liệu cá nhân:</strong> Thông tin có thể dùng để xác định một cá nhân (ví dụ: tên, email, địa chỉ IP).</p>
        <p><strong>Xử lý:</strong> Mọi hành vi liên quan đến dữ liệu cá nhân: thu thập, lưu trữ, truy cập, truyền tải, xóa, v.v.</p>
        <p><strong>Người dùng / Bạn:</strong> Cá nhân truy cập hoặc sử dụng dịch vụ AI Young Guru.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Phạm vi dữ liệu chúng tôi thu thập (chi tiết)</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>a) Dữ liệu nhận dạng cơ bản:</strong> Họ tên, email, số điện thoại (nếu cung cấp), ảnh hồ sơ.</p>
        <p><strong>b) Dữ liệu hồ sơ chuyên môn:</strong> Trình độ học vấn, kinh nghiệm làm việc, kỹ năng, mục tiêu nghề nghiệp, CV, tài liệu đính kèm.</p>
        <p><strong>c) Dữ liệu hội thoại và nội dung do bạn tạo:</strong> Lịch sử chat, câu hỏi, phản hồi, đánh giá và mọi nội dung bạn gửi cho AI.</p>
        <p><strong>d) Dữ liệu phân tích và gợi ý nghề nghiệp:</strong> Điểm số, kết quả bài kiểm tra, đề xuất nghề nghiệp mà hệ thống tạo ra.</p>
        <p><strong>e) Dữ liệu kỹ thuật:</strong> Địa chỉ IP (ẩn danh/hợp lệ theo quy định), cookie, ID thiết bị, user agent, loại trình duyệt, ngôn ngữ, nhật ký truy cập, thời gian phiên.</p>
        <p><strong>f) Dữ liệu thanh toán (nếu có):</strong> Thông tin thanh toán được xử lý bởi nhà cung cấp dịch vụ thanh toán bên thứ ba (chúng tôi không lưu số thẻ trên hệ thống của mình trừ khi bạn sử dụng phương thức lưu trữ an toàn do đối tác cung cấp).</p>
        <p><strong>g) Dữ liệu nhạy cảm:</strong> Chúng tôi cố gắng không yêu cầu và không lưu trữ dữ liệu nhạy cảm (ví dụ: tôn giáo, sức khỏe) trừ khi bạn chọn cung cấp và có cơ sở pháp lý rõ ràng.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Nguồn dữ liệu</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi thu thập dữ liệu trực tiếp từ bạn khi bạn đăng ký, tương tác với dịch vụ, hoặc nộp hồ sơ; từ hoạt động của bạn trên nền tảng;
        và từ bên thứ ba khi bạn cho phép (ví dụ: đăng nhập bằng mạng xã hội, nhà cung cấp dịch vụ tuyển dụng). Chúng tôi cũng có thể thu thập dữ liệu tổng hợp/ẩn danh cho mục đích phân tích.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Mục đích và cơ sở pháp lý cho việc xử lý</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Mục đích chính:</strong> Cung cấp dịch vụ tư vấn nghề nghiệp, cá nhân hóa trải nghiệm, lưu trữ lịch sử, hỗ trợ người dùng, xử lý thanh toán, và phân tích để cải thiện sản phẩm.</p>
        <p><strong>Cơ sở pháp lý (ví dụ theo chuẩn GDPR/tiêu chuẩn quốc tế):</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Thực hiện hợp đồng: Khi bạn sử dụng dịch vụ trả phí hoặc tính năng có hợp đồng.</li>
          <li>Đồng ý của bạn: Ví dụ dùng cookie phân tích không thiết yếu, nhận email marketing.</li>
          <li>Nghĩa vụ pháp lý: Khi cần để tuân thủ luật pháp, tòa án, hoặc yêu cầu của cơ quan chức năng.</li>
          <li>Lợi ích hợp pháp của chúng tôi: Bảo vệ dịch vụ, chống gian lận, cải thiện sản phẩm.</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Chia sẻ và chuyển giao dữ liệu</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi KHÔNG bán dữ liệu cá nhân. Tuy nhiên, chúng tôi có thể chia sẻ dữ liệu trong các trường hợp sau:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Với nhà cung cấp dịch vụ kỹ thuật:</strong> Ví dụ: hosting, CDN, nhà cung cấp thanh toán, xử lý email, nhà cung cấp phân tích. Những bên này chỉ được phép xử lý dữ liệu theo hướng dẫn của chúng tôi.</li>
          <li><strong>Để tuân thủ pháp luật:</strong> Khi có trát tòa án, yêu cầu cơ quan nhà nước hoặc để thực thi điều khoản dịch vụ.</li>
          <li><strong>Khi có thương vụ M&A:</strong> Trong trường hợp sáp nhập, mua bán tài sản, dữ liệu có thể được chuyển giao cho bên nhận để tiếp tục cung cấp dịch vụ.</li>
          <li><strong>Với sự đồng ý của bạn:</strong> Chia sẻ dữ liệu cho mục đích cụ thể mà bạn đã đồng ý trước.</li>
        </ul>
        <p className="mt-2">Khi dữ liệu được chuyển ra khỏi lãnh thổ (ví dụ sang máy chủ nước ngoài), chúng tôi áp dụng biện pháp bảo vệ phù hợp (hợp đồng tiêu chuẩn, điều khoản bảo mật) theo quy định liên quan.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Danh sách nhà xử lý (Subprocessors) & nhà cung cấp</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Để vận hành dịch vụ, chúng tôi sử dụng một số nhà cung cấp bên thứ ba (ví dụ: nhà cung cấp hosting, CDN, phân tích, bản tin, thanh toán). Danh sách nhà cung cấp có thể thay đổi; khi có thay đổi đáng kể chúng tôi sẽ cập nhật phần này. Các nhà cung cấp này được yêu cầu tuân thủ hợp đồng bảo mật và chỉ xử lý dữ liệu theo mục đích mà chúng tôi ủy quyền.
      </p>
      <ul className="list-disc pl-6 space-y-1 text-[var(--c-text-muted)]">
        <li>Ví dụ mẫu: Nhà cung cấp hạ tầng (AWS/Google Cloud/Cloudflare), Phân tích (Google Analytics / Matomo), Thanh toán (Stripe/PayPal), Hỗ trợ khách hàng (Intercom/Zendesk).</li>
      </ul>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Bảo mật dữ liệu</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành để bảo vệ dữ liệu, bao gồm nhưng không giới hạn:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Mã hóa dữ liệu truyền tải (TLS) và, nơi phù hợp, mã hóa dữ liệu lưu trữ.</li>
          <li>Quyền truy cập theo vai trò, phân quyền chặt chẽ cho nhân viên và nhà cung cấp.</li>
          <li>Kiểm tra và đánh giá lỗ hổng định kỳ (vulnerability scanning, pentest khi cần thiết).</li>
          <li>Ghi nhật ký truy cập, phát hiện xâm nhập và cơ chế phản hồi sự cố.</li>
          <li>Sao lưu định kỳ và khả năng phục hồi dữ liệu (backup & DR).</li>
        </ul>
        <p className="mt-2">Tuy nhiên, không có hệ thống nào hoàn toàn an toàn — chúng tôi không thể đảm bảo an toàn tuyệt đối. Nếu có vi phạm dữ liệu đáng kể, chúng tôi sẽ thực hiện các bước phù hợp theo quy định pháp luật và thông báo tới người dùng theo cơ chế nội bộ/luật định.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Lưu trữ và thời gian giữ dữ liệu</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi lưu trữ dữ liệu trong khoảng thời gian cần thiết để thực hiện mục đích thu thập hoặc theo yêu cầu pháp luật. Các mốc lưu trữ điển hình:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-[var(--c-text-muted)]">
        <li><strong>Dữ liệu tài khoản:</strong> Lưu khi tài khoản tồn tại + 3 năm sau khi hủy (để xử lý khiếu nại, tuân thủ pháp luật).</li>
        <li><strong>Dữ liệu hội thoại:</strong> Lưu mặc định 1-3 năm tùy cài đặt và loại dữ liệu; có thể xóa theo yêu cầu thông qua chức năng trên nền tảng.</li>
        <li><strong>Dữ liệu thanh toán:</strong> Lưu theo quy định lưu trữ kế toán địa phương (ví dụ 5-10 năm) cho mục đích tuân thủ.</li>
      </ul>
      <p className="mt-2">Bạn có thể yêu cầu xóa hoặc ẩn danh dữ liệu cá nhân thông qua các cơ chế và cài đặt có sẵn trên nền tảng.</p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">10. Quyền của bạn</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn có một số quyền liên quan đến dữ liệu cá nhân của mình, bao gồm nhưng không giới hạn:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Quyền truy cập:</strong> Yêu cầu bản sao dữ liệu mà chúng tôi đang xử lý về bạn.</li>
          <li><strong>Quyền chỉnh sửa:</strong> Yêu cầu sửa dữ liệu không chính xác hoặc bổ sung dữ liệu thiếu.</li>
          <li><strong>Quyền xóa (Right to be forgotten):</strong> Yêu cầu xóa dữ liệu trong những trường hợp pháp lý cho phép.</li>
          <li><strong>Quyền hạn chế xử lý:</strong> Tạm dừng xử lý trong một số tình huống.</li>
          <li><strong>Quyền phản đối:</strong> Phản đối xử lý trên cơ sở lợi ích hợp pháp hoặc cho mục đích tiếp thị trực tiếp.</li>
          <li><strong>Quyền di chuyển dữ liệu (data portability):</strong> Nhận dữ liệu ở định dạng máy đọc được và truyền cho nhà cung cấp khác khi khả thi.</li>
          <li><strong>Rút lại đồng ý:</strong> Rút lại đồng ý đã cho cho các mục đích xử lý dựa trên đồng ý (không ảnh hưởng đến tính pháp lý của xử lý trước đó).</li>
        </ul>
        <p className="mt-2">Để thực hiện quyền, vui lòng sử dụng chức năng cài đặt tài khoản hoặc cơ chế quản lý dữ liệu có sẵn trên nền tảng. Chúng tôi có thể yêu cầu xác minh danh tính trước khi thực hiện. Trường hợp yêu cầu vô căn cứ hoặc lặp lại nhiều lần, chúng tôi có thể từ chối hoặc áp dụng phí hợp lý theo luật định.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">11. Khiếu nại với cơ quan giám sát</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Nếu bạn không hài lòng với cách chúng tôi xử lý dữ liệu, bạn có quyền khiếu nại tại cơ quan bảo vệ dữ liệu có thẩm quyền tại quốc gia của bạn. Chúng tôi khuyến nghị bạn sử dụng cơ chế nội bộ trước để chúng tôi có cơ hội giải quyết.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">12. Tự động quyết định & profiling</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Dịch vụ sử dụng thuật toán và mô hình để phân tích hồ sơ và gợi ý nghề nghiệp (mức độ phù hợp, ranking nghề nghiệp). Quyết định hoàn toàn tự động có thể xảy ra trong phạm vi giới hạn — bạn có quyền yêu cầu can thiệp con người, giải thích về cách thức đưa ra quyết định và phản đối xử lý tự động nếu luật cho phép.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">13. Mọi lứa tuổi</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Dịch vụ được thiết kế để phù hợp cho mọi lứa tuổi. Nếu người dùng là trẻ vị thành niên, chúng tôi khuyến nghị phụ huynh hoặc người giám hộ giám sát hoạt động và hỗ trợ trong việc đưa ra thông tin cá nhân. Nền tảng cung cấp các cơ chế cho phép quản lý quyền riêng tư và kiểm soát dữ liệu phù hợp với trẻ em và người dùng vị thành niên.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">14. Thay đổi chính sách</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật chính sách này theo thời gian. Mọi thay đổi trọng yếu sẽ được thông báo trên nền tảng. Ngày có hiệu lực của phiên bản hiện tại: <strong>11/02/2026</strong>.
      </p>
    </section>
  </div>
);

export const termsOfServiceContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Chấp nhận điều khoản</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Bằng việc truy cập hoặc sử dụng AI Young Guru, bạn đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ ("Điều khoản"). Nếu bạn không đồng ý, vui lòng không sử dụng dịch vụ.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Định nghĩa & Phạm vi dịch vụ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        AI Young Guru cung cấp nền tảng tư vấn nghề nghiệp bằng AI, bao gồm nhưng không giới hạn: công cụ đánh giá, gợi ý nghề nghiệp, lưu trữ lịch sử hội thoại, tài nguyên tuyển dụng và các tính năng trả phí/miễn phí. Chúng tôi có thể thay đổi, nâng cấp hoặc ngừng một phần hoặc toàn bộ dịch vụ.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Điều kiện tham gia</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bất kỳ cá nhân nào đều có thể sử dụng dịch vụ. Đối với người dùng vị thành niên, chúng tôi khuyến nghị có sự giám sát hoặc đồng ý của phụ huynh/người giám hộ theo quy định địa phương.</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Bạn cung cấp thông tin chính xác, đầy đủ khi đăng ký.</li>
          <li>Bạn không sử dụng dịch vụ cho mục đích bất hợp pháp hoặc gây hại.</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Tài khoản & bảo mật</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Người dùng chịu trách nhiệm bảo mật tài khoản và mật khẩu. Mọi hành vi dưới tài khoản của bạn được coi là hành vi do bạn thực hiện. Nếu phát hiện truy cập trái phép, bạn nên sử dụng các công cụ có sẵn trên nền tảng để khóa hoặc thay đổi thông tin đăng nhập.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Gói dịch vụ, Thanh toán & Hoàn tiền</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Gói dịch vụ:</strong> Một số tính năng có thể yêu cầu đăng ký trả phí. Mô tả, giá cả và điều kiện mỗi gói được hiển thị tại trang thanh toán.</p>
        <p><strong>Thanh toán:</strong> Thanh toán được xử lý qua nhà cung cấp thanh toán bên thứ ba (ví dụ Stripe/PayPal). Bằng việc đăng ký gói trả phí, bạn ủy quyền cho chúng tôi thu phí theo chu kỳ.</p>
        <p><strong>Hoàn tiền:</strong> Chính sách hoàn tiền (nếu có) sẽ được mô tả rõ trên trang gói; thông thường không hoàn tiền cho việc sử dụng đầy đủ dịch vụ trong chu kỳ đã thanh toán, trừ khi có quy định khác.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Quyền và giới hạn sử dụng</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn được cấp quyền sử dụng cá nhân, không độc quyền, không chuyển nhượng để truy cập và sử dụng dịch vụ theo các điều khoản này. Bạn không được:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Phân phối, bán lại hoặc cho thuê dịch vụ.</li>
          <li>Thay đổi, reverse-engineer, tách mã nguồn hoặc xây dựng dịch vụ tương tự dựa trên dịch vụ của chúng tôi.</li>
          <li>Sử dụng dịch vụ để gửi spam, phần mềm độc hại, hoặc hành vi xâm phạm quyền người khác.</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Nội dung người dùng & quyền sử dụng</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn giữ quyền sở hữu nội dung mà bạn tạo và cung cấp. Tuy nhiên, bằng cách gửi nội dung cho dịch vụ, bạn cấp cho chúng tôi giấy phép không độc quyền, không tốn phí, toàn cầu để sử dụng, sao chép, chỉnh sửa và lưu trữ nội dung đó nhằm cung cấp, vận hành và cải thiện dịch vụ (bao gồm huấn luyện mô hình, nếu bạn đã đồng ý rõ ràng).</p>
        <p>Nội dung bạn gửi không nên vi phạm bản quyền, quyền riêng tư hoặc bất kỳ quyền hợp pháp nào của người khác. Bạn đồng ý bồi thường cho chúng tôi nếu nội dung bạn cung cấp gây thiệt hại pháp lý cho công ty.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Hạn chế trách nhiệm & Tuyên bố miễn trừ</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Miễn trừ bảo đảm:</strong> Dịch vụ được cung cấp "nguyên trạng" và "có sẵn". Chúng tôi không đảm bảo dịch vụ phù hợp cho mục đích cụ thể, không có lỗi và không chịu trách nhiệm về kết quả nghề nghiệp cụ thể.</p>
        <p><strong>Giới hạn trách nhiệm:</strong> Trong mọi trường hợp, trách nhiệm pháp lý tổng cộng của chúng tôi liên quan đến dịch vụ sẽ không vượt quá số tiền mà bạn đã trả cho chúng tôi trong 12 tháng gần nhất (hoặc khoản giới hạn tối thiểu theo luật áp dụng nếu giới hạn này bị cấm).</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Chấm dứt và đình chỉ</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có quyền đình chỉ hoặc chấm dứt tài khoản nếu bạn vi phạm Điều khoản hoặc hành vi gây hại cho dịch vụ. Người dùng có thể xóa tài khoản theo hướng dẫn trong phần cài đặt; việc xóa có thể không loại bỏ toàn bộ dữ liệu do nghĩa vụ lưu trữ pháp lý.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">10. Tranh chấp, Luật áp dụng & Giải quyết</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Mọi tranh chấp sẽ được ưu tiên giải quyết bằng thương lượng. Nếu không đạt được thỏa thuận, tranh chấp sẽ được giải quyết theo pháp luật Việt Nam và tại tòa án có thẩm quyền tại Việt Nam (hoặc trọng tài nếu các bên thỏa thuận).
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">11. Sửa đổi Điều khoản</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật Điều khoản. Thay đổi trọng yếu sẽ được thông báo trên nền tảng; việc bạn tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa bạn chấp nhận các thay đổi đó. Phiên bản hiện tại có hiệu lực từ <strong>11/02/2026</strong>.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">12. Các điều khoản bổ sung (nếu áp dụng)</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p><strong>Beta & Tính năng mới:</strong> Một số tính năng beta có thể được cung cấp để thử nghiệm; các tính năng này có thể có rủi ro và có những điều khoản bổ sung.</p>
        <p><strong>Giấy phép nội dung từ bên thứ ba:</strong> Một số nội dung hoặc công cụ tích hợp có thể được cung cấp theo giấy phép bên thứ ba kèm điều kiện riêng.</p>
      </div>
    </section>
  </div>
);

export const cookiePolicyContent = (
  <div className="space-y-6">
    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">1. Giới thiệu về Cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        AI Young Guru sử dụng cookie và công nghệ lưu trữ tương tự để cung cấp chức năng cốt lõi, cá nhân hóa trải nghiệm, phân tích sử dụng và quảng cáo (nếu có). Chính sách Cookie này mô tả loại cookie chúng tôi sử dụng, mục đích và cách bạn quản lý chúng.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">2. Cookie là gì & cách hoạt động</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Cookie là tệp nhỏ mà trang web lưu trên thiết bị bạn sử dụng. Cookie có thể là 'session' (tạm thời) hoặc 'persistent' (lưu lâu). Chúng lưu trạng thái, tùy chọn và thông tin để giúp trang web hoạt động hiệu quả hơn.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">3. Hạng mục cookie chúng tôi sử dụng</h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.1 Cookie thiết yếu (Essential)</h4>
          <p>Những cookie cần thiết để vận hành tính năng cơ bản: đăng nhập, bảo mật phiên, xử lý biểu mẫu.</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.2 Cookie chức năng (Functional)</h4>
          <p>Ghi nhớ tùy chọn người dùng như ngôn ngữ, thiết lập hiển thị, lịch sử hội thoại (nếu người dùng chọn lưu).</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.3 Cookie phân tích (Analytics)</h4>
          <p>Thu thập dữ liệu sử dụng ở dạng ẩn danh nhằm cải thiện tính năng và hiệu năng (ví dụ: số lượng truy cập, trang phổ biến, lỗi hệ thống).</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.4 Cookie quảng cáo (Advertising / Targeting)</h4>
          <p>Dùng để cung cấp quảng cáo phù hợp (nếu chúng tôi triển khai quảng cáo) và đo lường hiệu quả chiến dịch. Thường do bên thứ ba cung cấp.</p>
        </div>

        <div>
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.5 Cookie bên thứ ba</h4>
          <p>Các dịch vụ tích hợp (ví dụ: trình thanh toán, phân tích, mạng xã hội) có thể đặt cookie riêng; chúng chịu chính sách của nhà cung cấp đó.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">4. Ví dụ nhà cung cấp cookie bên thứ ba</h3>
      <ul className="list-disc pl-6 space-y-1 text-[var(--c-text-muted)]">
        <li>Google Analytics / Google Tag Manager — phân tích truy cập và hành vi (dữ liệu ẩn danh).</li>
        <li>Cloudflare — an ninh, CDN và bảo mật.</li>
        <li>Stripe / PayPal — xử lý thanh toán (cookie hỗ trợ giao dịch, thanh toán an toàn).</li>
        <li>Sentry / LogRocket — ghi nhận lỗi và chẩn đoán sự cố.</li>
      </ul>
      <p className="mt-2 text-[var(--c-text-muted)]">Danh sách có thể thay đổi; nhà cung cấp thứ ba có chính sách cookie riêng mà bạn nên tham khảo trực tiếp.</p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">5. Cách chúng tôi sử dụng cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Cookie giúp:
      </p>
      <ul className="list-disc pl-6 space-y-1 text-[var(--c-text-muted)]">
        <li>Giữ trạng thái đăng nhập và bảo mật phiên.</li>
        <li>Ghi nhớ tùy chọn hiển thị và ngôn ngữ.</li>
        <li>Phân tích để cải thiện trải nghiệm và hiệu năng.</li>
        <li>Hỗ trợ chức năng thanh toán và bảo mật giao dịch.</li>
      </ul>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">6. Quản lý và từ chối cookie</h3>
      <div className="space-y-3 text-[var(--c-text-muted)]">
        <p>Bạn có thể quản lý cookie bằng cách:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Sử dụng cài đặt cookie trên trang web của chúng tôi (nếu có bảng quản lý cookie với toggle cho từng loại).</li>
          <li>Thay đổi cài đặt trình duyệt để chặn hoặc xóa cookie (Chrome, Firefox, Safari, Edge đều có hướng dẫn cụ thể).</li>
          <li>Sử dụng các công cụ/tiện ích mở rộng chặn tracking.</li>
        </ul>
        <p className="mt-2"><strong>Lưu ý:</strong> Tắt cookie thiết yếu có thể khiến một số phần của dịch vụ không hoạt động.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">7. Thời gian lưu trữ cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Cookie phiên bị xóa khi bạn đóng trình duyệt. Cookie vĩnh cửu có thể tồn tại từ vài ngày đến một năm hoặc hơn, tùy mục đích. Thời gian cụ thể được ghi trong từng cookie.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">8. Do Not Track</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Hiện tại, nhiều nhà cung cấp dịch vụ web và trình duyệt vẫn chưa đồng nhất việc tuân thủ tín hiệu "Do Not Track". Chúng tôi tôn trọng quyền riêng tư và khuyến khích bạn sử dụng cài đặt trình duyệt hoặc công cụ chặn để quản lý theo ý muốn.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-3 text-[var(--c-text)]">9. Cập nhật chính sách Cookie</h3>
      <p className="text-[var(--c-text-muted)] leading-relaxed">
        Chúng tôi có thể cập nhật chính sách Cookie khi có thay đổi về cách thức sử dụng cookie. Phiên bản hiện tại có hiệu lực từ <strong>11/02/2026</strong>. Mọi thay đổi quan trọng sẽ được thông báo trên nền tảng.
      </p>
    </section>
  </div>
);
