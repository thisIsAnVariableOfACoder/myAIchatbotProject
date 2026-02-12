/**
 * Comprehensive Legal and Regulatory Documentation — policies.jsx
 * Phiên bản mở rộng và toàn diện: Tuân thủ tiêu chuẩn quốc tế về bảo vệ dữ liệu và quyền người dùng.
 *
 * Sản phẩm và dịch vụ này là của Team LLMagik thực hiện trong CUỘC THI AI YOUNG GURU.
 *
 * LƯU Ý PHÁP LÝ QUAN TRỌNG:
 * --------------------------------------------------------------------
 * Nội dung dưới đây được biên soạn dựa trên các tiêu chuẩn pháp lý quốc tế phổ biến
 * (GDPR, ISO 27001, SOC 2 Type II và các quy định liên quan tại Việt Nam).
 *
 * Tuy nhiên, đây CHỈ LÀ MẪU NỘI DUNG THAM KHẢO. Trước khi đưa vào sử dụng chính thức
 * cho mục đích thương mại, BẮT BUỘC phải tham vấn luật sư chuyên về công nghệ thông tin
 * và bảo vệ dữ liệu cá nhân tại Việt Nam.
 * --------------------------------------------------------------------
 */

import React from "react";

/**
 * ====================================================================
 * CHÍNH SÁCH BẢO VỆ DỮ LIỆU CÁ NHÂN TOÀN DIỆN
 * ====================================================================
 */
export const privacyPolicyContent = (
  <div className="space-y-8">
    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        1. GIỚI THIỆU VÀ PHẠM VI ÁP DỤNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)] leading-relaxed">
        <p>
          <strong>AI Young Guru</strong> ("Công ty", "Chúng tôi", "Tổ chức của chúng tôi") cam kết tuân thủ nghiêm ngặt
          các nguyên tắc bảo vệ dữ liệu cá nhân và quyền riêng tư của người dùng. Chính sách Bảo vệ Dữ liệu Cá nhân
          này được xây dựng nhằm đảm bảo tính minh bạch, trách nhiệm giải trình và quyền lợi chính đáng của tất cả
          các bên liên quan.
        </p>
        <p>
          Chính sách này mô tả chi tiết các loại dữ liệu cá nhân mà chúng tôi thu thập, mục đích và cơ sở pháp lý
          cho việc xử lý, cách thức lưu trữ và bảo vệ, quyền của chủ thể dữ liệu, cũng như các biện pháp chúng tôi
          áp dụng để đảm bảo an toàn thông tin.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
          <p className="font-medium text-[var(--c-text)]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
          <p className="text-sm mt-1">Lần cập nhật gần nhất: Tháng 02 năm 2026</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        2. ĐỊNH NGHĨA VÀ THUẬT NGỮ CHUYÊN MÔN
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Để đảm bảo tính nhất quán và rõ ràng trong việc diễn giải, các thuật ngữ sau được định nghĩa cụ thể:</p>
        
        <div className="grid gap-4">
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Dữ liệu Cá nhân (Personal Data):</strong></p>
            <p className="text-sm mt-1">Bất kỳ thông tin nào có thể được sử dụng đơn lẻ hoặc kết hợp với các thông tin khác
            để nhận diện, xác định hoặc liên hệ với một cá nhân cụ thể, bao gồm nhưng không giới hạn ở: họ và tên,
            địa chỉ email, số điện thoại, địa chỉ IP, thông tin thiết bị, dữ liệu định vị địa lý, và các thông tin
            khác thuộc phạm vi bảo vệ theo quy định pháp luật.</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Xử lý Dữ liệu (Data Processing):</strong></p>
            <p className="text-sm mt-1">Bất kỳ hoạt động hoặc tập hợp hoạt động nào được thực hiện trên dữ liệu cá nhân,
            bao gồm nhưng không giới hạn ở: thu thập, ghi nhận, tổ chức, cấu trúc, lưu trữ, điều chỉnh, truy xuất,
            sử dụng, tiết lộ, phổ biến, đối chiếu, kết hợp, hạn chế, xóa hoặc hủy dữ liệu.</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Chủ thể Dữ liệu (Data Subject):</strong></p>
            <p className="text-sm mt-1">Cá nhân được xác định hoặc có thể được xác định thông qua dữ liệu cá nhân.
            Trong ngữ cảnh của dịch vụ của chúng tôi, đây là người dùng truy cập, đăng ký hoặc sử dụng các sản phẩm
            và dịch vụ của AI Young Guru.</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Bên Kiểm soát Dữ liệu (Data Controller):</strong></p>
            <p className="text-sm mt-1">Tổ chức hoặc cá nhân đưa ra quyết định về mục đích và phương thức xử lý dữ liệu cá nhân.
            Trong trường hợp này, AI Young Guru đóng vai trò là Bên Kiểm soát Dữ liệu đối với thông tin của người dùng.</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Bên Xử lý Dữ liệu (Data Processor):</strong></p>
            <p className="text-sm mt-1">Tổ chức hoặc cá nhân thực hiện việc xử lý dữ liệu thay mặt cho Bên Kiểm soát Dữ liệu,
            theo hợp đồng hoặc thỏa thuận được thiết lập. Các nhà cung cấp dịch vụ hosting, cloud computing và xử lý
            thanh toán thường đóng vai trò này.</p>
          </div>
          
          <div className="bg-gray-50 p-3 rounded">
            <p><strong>Cookie và Công nghệ Theo dõi:</strong></p>
            <p className="text-sm mt-1">Các tệp văn bản nhỏ hoặc pixel hình ảnh được lưu trữ trên thiết bị của người dùng,
            cho phép ghi nhớ sở thích, theo dõi hành vi sử dụng và cung cấp trải nghiệm cá nhân hóa.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        3. PHẠM VI DỮ LIỆU CHÚNG TÔI THU THẬP
      </h3>
      <div className="space-y-6 text-[var(--c-text-muted)]">
        <p>Chúng tôi thu thập dữ liệu cá nhân từ nhiều nguồn khác nhau và theo nhiều phương thức. Dưới đây là phân loại
        chi tiết các loại dữ liệu:</p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.1 Dữ liệu Nhận dạng và Tài khoản</h4>
            <p className="text-sm">Thông tin cơ bản để tạo và quản lý tài khoản người dùng, bao gồm:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Họ và tên đầy đủ (theo thông tin người dùng cung cấp)</li>
              <li>Địa chỉ email cá nhân hoặc chuyên nghiệp</li>
              <li>Số điện thoại di động (nếu người dùng cung cấp tùy chọn)</li>
              <li>Ảnh hồ sơ hoặc hình đại diện (avatar)</li>
              <li>Tên đăng nhập và mật khẩu đã được mã hóa</li>
              <li>Thông tin từ tài khoản mạng xã hội khi đăng nhập qua OAuth (Google, Facebook, LinkedIn)</li>
              <li>Thông tin xác thực hai yếu tố (2FA) nếu được kích hoạt</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.2 Dữ liệu Hồ sơ Chuyên môn và Nghề nghiệp</h4>
            <p className="text-sm">Thông tin chi tiết về nền tảng học vấn, kinh nghiệm làm việc và định hướng nghề nghiệp:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Trình độ học vấn, bằng cấp và chứng chỉ chuyên môn</li>
              <li>Lịch sử việc làm, công ty đã làm việc và vị trí đảm nhiệm</li>
              <li>Kỹ năng chuyên môn, công nghệ thành thạo và năng lực ngôn ngữ</li>
              <li>Mục tiêu nghề nghiệp, sở thích và định hướng phát triển</li>
              <li>CV, thư xin việc và các tài liệu ứng tuyển do người dùng tải lên</li>
              <li>Dự án, thành tựu và giải thưởng đã đạt được</li>
              <li>Chứng chỉ nghề nghiệp và khóa đào tạo đã hoàn thành</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.3 Dữ liệu Hội thoại và Nội dung Do người dùng Tạo ra</h4>
            <p className="text-sm">Mọi thông tin trao đổi giữa người dùng và hệ thống AI hoặc với các người dùng khác:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Lịch sử cuộc trò chuyện với AI career advisor</li>
              <li>Câu hỏi, phản hồi và đánh giá của người dùng</li>
              <li>Kết quả các bài kiểm tra, đánh giá năng lực và quiz</li>
              <li>Ghi chú cá nhân và mục yêu thích do người dùng lưu</li>
              <li>Bình luận, đánh giá và phản hồi về các ngành nghề được đề xuất</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.4 Dữ liệu Phân tích và Gợi ý Thông minh</h4>
            <p className="text-sm">Thông tin được hệ thống tạo ra hoặc tính toán dựa trên dữ liệu đầu vào:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Điểm số phù hợp (compatibility scores) với các ngành nghề</li>
              <li>Xếp hạng và đề xuất nghề nghiệp được cá nhân hóa</li>
              <li>Phân tích xu hướng và mẫu hành vi sử dụng</li>
              <li>Dự đoán và khuyến nghị dựa trên thuật toán ML/AI</li>
              <li>Lịch sử tìm kiếm và các từ khóa đã sử dụng</li>
              <li>Thời gian tương tác với từng tính năng và nội dung</li>
            </ul>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.5 Dữ liệu Kỹ thuật và Hoạt động</h4>
            <p className="text-sm">Thông tin về thiết bị, trình duyệt và hoạt động truy cập:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Địa chỉ IP (có thể được ẩn danh hóa theo tiêu chuẩn bảo vệ dữ liệu)</li>
              <li>Loại thiết bị, hệ điều hành và phiên bản</li>
              <li>Loại trình duyệt web, phiên bản và ngôn ngữ cài đặt</li>
              <li>ID thiết bị duy nhất (device identifiers)</li>
              <li>Thông tin kết nối mạng và nhà cung cấp dịch vụ internet</li>
              <li>Cookies, pixel tags và các công nghệ theo dõi tương tự</li>
              <li>Nhật ký truy cập (access logs) và timestamps</li>
              <li>Dữ liệu định vị địa lý thô (geolocation data) - nếu người dùng cho phép</li>
            </ul>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.6 Dữ liệu Thanh toán và Giao dịch</h4>
            <p className="text-sm">Thông tin liên quan đến các giao dịch tài chính (nếu có dịch vụ trả phí):</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Phương thức thanh toán đã lưu (không bao gồm số thẻ tín dụng đầy đủ)</li>
              <li>Lịch sử giao dịch và hóa đơn</li>
              <li>Trạng thái đăng ký và gói dịch vụ</li>
              <li>Mã giảm giá và ưu đãi đã sử dụng</li>
              <li>Thông tin xuất hóa đơn (tên công ty, mã số thuế, địa chỉ - nếu yêu cầu)</li>
            </ul>
            <p className="text-sm mt-2 italic">Lưu ý: Toàn bộ thông tin thanh toán nhạy cảm được xử lý bởi nhà cung cấp dịch vụ
            thanh toán bên thứ ba tuân thủ PCI-DSS (Stripe, PayPal, v.v.). Chúng tôi không lưu trữ thông tin thẻ
            tín dụng hoặc thông tin thanh toán nhạy cảm trên hệ thống của mình.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">3.7 Dữ liệu Nhạy cảm và Đặc biệt</h4>
            <p className="text-sm">Chúng tôi cố gắng hạn chế tối đa việc thu thập dữ liệu nhạy cảm:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li><strong>Nguyên tắc chung:</strong> Chúng tôi KHÔNG chủ động thu thập dữ liệu về chủng tộc, tôn giáo,
              quan điểm chính trị, đời tư, sức khỏe hoặc các dữ liệu nhạy cảm khác theo quy định pháp luật.</li>
              <li><strong>Ngoại lệ:</strong> Nếu người dùng tự nguyện cung cấp thông tin nhạy cảm (ví dụ: tình trạng
              khuyết tật để điều chỉnh gợi ý nghề nghiệp phù hợp), chúng tôi cam kết xử lý với sự đồng ý rõ ràng
              và biện pháp bảo vệ tăng cường.</li>
              <li><strong>Dữ liệu sinh trắc học:</strong> KHÔNG được thu thập dưới bất kỳ hình thức nào.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        4. NGUỒN DỮ LIỆU VÀ PHƯƠNG THỨC THU THẬP
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Dữ liệu cá nhân được thu thập từ nhiều nguồn và thông qua nhiều phương thức khác nhau:</p>
        
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-600 mt-1">✓</div>
            <div>
              <p className="font-medium text-[var(--c-text)]">Trực tiếp từ người dùng</p>
              <p className="text-sm">Khi người dùng đăng ký tài khoản, hoàn thành hồ sơ, điền thông tin cá nhân, tải lên tài liệu,
              trả lời câu hỏi đánh giá, hoặc liên hệ với bộ phận hỗ trợ khách hàng.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full text-green-600 mt-1">✓</div>
            <div>
              <p className="font-medium text-[var(--c-text)]">Từ hoạt động sử dụng dịch vụ</p>
              <p className="text-sm">Tự động thu thập thông qua cookies, pixels và các công nghệ theo dõi khi người dùng tương tác
              với website, ứng dụng di động hoặc các sản phẩm số của chúng tôi.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-600 mt-1">✓</div>
            <div>
              <p className="font-medium text-[var(--c-text)]">Từ bên thứ ba được ủy quyền</p>
              <p className="text-sm">Khi người dùng đăng nhập qua tài khoản mạng xã hội (Google, Facebook, LinkedIn) hoặc khi
              chúng tôi hợp tác với các đối tác tuyển dụng, nhà tuyển dụng hoặc tổ chức giáo dục.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-yellow-100 p-2 rounded-full text-yellow-600 mt-1">✓</div>
            <div>
              <p className="font-medium text-[var(--c-text)]">Từ nguồn công khai</p>
              <p className="text-sm">Thông tin người dùng được cung cấp công khai trên các nền tảng mạng xã hội chuyên nghiệp
              (LinkedIn) hoặc các nguồn dữ liệu nghề nghiệp được cấp phép.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        5. MỤC ĐÍCH XỬ LÝ VÀ CƠ SỞ PHÁP LÝ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Việc xử lý dữ liệu cá nhân được thực hiện dựa trên một hoặc nhiều cơ sở pháp lý được quy định rõ ràng.
        Dưới đây là chi tiết về mục đích xử lý và cơ sở pháp lý tương ứng:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Mục đích Xử lý</th>
                <th className="border p-2 text-left">Loại Dữ liệu</th>
                <th className="border p-2 text-left">Cơ sở Pháp lý</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Cung cấp dịch vụ tư vấn nghề nghiệp AI</td>
                <td className="border p-2">Hồ sơ chuyên môn, dữ liệu hội thoại, kết quả đánh giá</td>
                <td className="border p-2">Thực hiện hợp đồng (ToS)</td>
              </tr>
              <tr>
                <td className="border p-2">Tạo và quản lý tài khoản người dùng</td>
                <td className="border p-2">Dữ liệu nhận dạng, thông tin tài khoản</td>
                <td className="border p-2">Thực hiện hợp đồng, Đồng ý</td>
              </tr>
              <tr>
                <td className="border p-2">Cá nhân hóa gợi ý và trải nghiệm người dùng</td>
                <td className="border p-2">Dữ liệu phân tích, lịch sử tương tác</td>
                <td className="border p-2">Lợi ích hợp pháp, Đồng ý</td>
              </tr>
              <tr>
                <td className="border p-2">Xử lý thanh toán và giao dịch tài chính</td>
                <td className="border p-2">Dữ liệu thanh toán, lịch sử giao dịch</td>
                <td className="border p-2">Thực hiện hợp đồng, Nghĩa vụ pháp lý</td>
              </tr>
              <tr>
                <td className="border p-2">Giao tiếp hỗ trợ khách hàng</td>
                <td className="border p-2">Dữ liệu liên hệ, lịch sử hội thoại hỗ trợ</td>
                <td className="border p-2">Lợi ích hợp pháp, Thực hiện hợp đồng</td>
              </tr>
              <tr>
                <td className="border p-2">Gửi email marketing (có đồng ý)</td>
                <td className="border p-2">Địa chỉ email, sở thích người dùng</td>
                <td className="border p-2">Đồng ý rõ ràng</td>
              </tr>
              <tr>
                <td className="border p-2">Phân tích thống kê, cải thiện sản phẩm</td>
                <td className="border p-2">Dữ liệu kỹ thuật, dữ liệu sử dụng ẩn danh</td>
                <td className="border p-2">Lợi ích hợp pháp</td>
              </tr>
              <tr>
                <td className="border p-2">Bảo mật hệ thống, phát hiện gian lận</td>
                <td className="border p-2">Dữ liệu kỹ thuật, nhật ký truy cập</td>
                <td className="border p-2">Lợi ích hợp pháp, Nghĩa vụ pháp lý</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">Giải thích các Cơ sở Pháp lý chính:</h4>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Thực hiện Hợp đồng:</strong> Khi việc xử lý cần thiết để thực hiện hợp đồng mà người dùng là một bên.</li>
            <li><strong>Đồng ý:</strong> Khi người dùng đồng ý rõ ràng cho một hoặc nhiều mục đích xử lý cụ thể.</li>
            <li><strong>Nghĩa vụ Pháp lý:</strong> Khi việc xử lý cần thiết để tuân thủ các nghĩa vụ pháp lý mà chúng tôi phải thực hiện.</li>
            <li><strong>Lợi ích Hợp pháp:</strong> Khi việc xử lý cần thiết cho các lợi ích hợp pháp của chúng tôi hoặc của bên thứ ba.</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        6. CHIA SẺ, TIẾT LỘ VÀ CHUYỂN GIAO DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p className="font-medium text-red-600">Cam kết quan trọng: Chúng tôi KHÔNG BAO GIỜ bán, cho thuê hoặc trao đổi dữ liệu cá nhân
        của người dùng cho mục đích tiếp thị trực tiếp hoặc lợi ích tài chính của bên thứ ba.</p>
        
        <p>Dữ liệu cá nhân có thể được chia sẻ trong các trường hợp sau:</p>
        
        <div className="space-y-4">
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">6.1 Với Nhà cung cấp Dịch vụ (Subprocessors)</h4>
            <p className="text-sm">Chúng tôi hợp tác với các nhà cung cấp bên thứ ba để vận hành dịch vụ. Các nhà cung cấp này
            chỉ được phép truy cập dữ liệu cần thiết để thực hiện nhiệm vụ của họ và phải tuân thủ hợp đồng bảo mật nghiêm ngặt.</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li><strong>Dịch vụ Hosting và Cloud:</strong> AWS, Google Cloud, Cloudflare</li>
              <li><strong>Phân tích và Monitoring:</strong> Google Analytics, Sentry, LogRocket (dữ liệu ẩn danh)</li>
              <li><strong>Thanh toán:</strong> Stripe, PayPal (xử lý giao dịch tài chính)</li>
              <li><strong>Hỗ trợ Khách hàng:</strong> Intercom, Zendesk</li>
              <li><strong>AI/ML Services:</strong> OpenAI, Groq (dữ liệu được ẩn danh hóa)</li>
            </ul>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">6.2 Để Tuân thủ Pháp luật</h4>
            <p className="text-sm">Chúng tôi có thể tiết lộ dữ liệu khi được yêu cầu hợp pháp bởi cơ quan nhà nước có thẩm quyền,
            trát tòa án, hoặc để bảo vệ quyền, tài sản hoặc an toàn của chúng tôi, người dùng hoặc công chúng.</p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">6.3 Trong trường hợp Thương vụ (M&A)</h4>
            <p className="text-sm">Trong trường hợp sáp nhập, mua lại, chuyển nhượng tài sản, dữ liệu cá nhân có thể được
            chuyển giao cho bên nhận để tiếp tục cung cấp dịch vụ. Người dùng sẽ được thông báo trước khi việc
            chuyển giao có hiệu lực.</p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">6.4 Với sự Đồng ý Rõ ràng</h4>
            <p className="text-sm">Khi người dùng đồng ý rõ ràng, chúng tôi có thể chia sẻ dữ liệu với đối tác tuyển dụng,
            nhà tuyển dụng hoặc tổ chức giáo dục theo yêu cầu của người dùng.</p>
          </div>
          
          <div className="border p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">6.5 Chuyển Dữ liệu Quốc tế</h4>
            <p className="text-sm">Nếu dữ liệu được chuyển ra ngoài lãnh thổ Việt Nam, chúng tôi áp dụng các biện pháp
            bảo vệ phù hợp như Standard Contractual Clauses, Binding Corporate Rules và đảm bảo mức bảo vệ dữ liệu
            tương đương theo quy định pháp luật.</p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        7. BIỆN PHÁP BẢO MẬT VÀ AN TOÀN DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức tiên tiến để bảo vệ dữ liệu cá nhân, tuân thủ các tiêu chuẩn
        quốc tế về an ninh thông tin như ISO 27001 và SOC 2 Type II.</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">Biện pháp Kỹ thuật</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Mã hóa dữ liệu truyền tải (TLS 1.3/SSL)</li>
              <li>Mã hóa dữ liệu lưu trữ (AES-256)</li>
              <li>Xác thực đa yếu tố (MFA/2FA)</li>
              <li>Kiểm soát truy cập dựa trên vai trò (RBAC)</li>
              <li>Firewall ứng dụng web (WAF) và bảo vệ DDoS</li>
              <li>Hệ thống phát hiện xâm nhập (IDS/IPS)</li>
              <li>Giám sát an ninh 24/7</li>
              <li>Sao lưu dữ liệu tự động với mã hóa</li>
              <li>Kiểm tra lỗ hổng định kỳ</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">Biện pháp Tổ chức</h4>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>Chính sách bảo mật thông tin nội bộ</li>
              <li>Đào tạo bảo mật định kỳ cho nhân viên</li>
              <li>Kiểm soát truy cập theo nguyên tắc đặc quyền tối thiểu</li>
              <li>Thỏa thuận bảo mật (NDA) với nhân viên và nhà cung cấp</li>
              <li>Quy trình xử lý sự cố bảo mật</li>
              <li>Kiểm toán định kỳ và đánh giá tuân thủ</li>
              <li>Chính sách lưu giữ và xóa dữ liệu</li>
              <li>Đánh giá tác động bảo mật (DPIA)</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg mt-4">
          <p className="font-medium text-[var(--c-text)]">Tuyên bố miễn trừ về An ninh:</p>
          <p className="text-sm mt-1">Mặc dù chúng tôi cam kết áp dụng các biện pháp bảo mật tiên tiến nhất, không có phương pháp
          truyền tải qua Internet hoặc phương pháp lưu trữ điện tử nào là hoàn toàn an toàn. Trong trường hợp xảy ra
          vi phạm dữ liệu (data breach) đáng kể, chúng tôi sẽ thông báo cho cơ quan bảo vệ dữ liệu trong vòng 72 giờ
          và thông báo cho người dùng bị ảnh hưởng ngay lập tức.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        8. LƯU TRỮ VÀ THỜI GIAN GIỮ DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Dữ liệu cá nhân được lưu trữ trong thời gian cần thiết để thực hiện các mục đích thu thập hoặc theo yêu cầu
        của pháp luật. Bảng dưới đây mô tả thời gian lưu giữ điển hình:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Loại Dữ liệu</th>
                <th className="border p-2 text-left">Thời gian Lưu giữ</th>
                <th className="border p-2 text-left">Cơ sở / Lý do</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Dữ liệu tài khoản (hoạt động)</td>
                <td className="border p-2">Trong suốt thời gian tài khoản hoạt động</td>
                <td className="border p-2">Cung cấp dịch vụ</td>
              </tr>
              <tr>
                <td className="border p-2">Dữ liệu tài khoản (đã xóa)</td>
                <td className="border p-2">3 năm sau khi xóa tài khoản</td>
                <td className="border p-2">Xử lý khiếu nại, tuân thủ pháp luật</td>
              </tr>
              <tr>
                <td className="border p-2">Dữ liệu hội thoại và chat</td>
                <td className="border p-2">1-3 năm (tùy cài đặt người dùng)</td>
                <td className="border p-2">Cải thiện dịch vụ</td>
              </tr>
              <tr>
                <td className="border p-2">Dữ liệu thanh toán và hóa đơn</td>
                <td className="border p-2">5-10 năm (theo quy định kế toán)</td>
                <td className="border p-2">Nghĩa vụ pháp lý</td>
              </tr>
              <tr>
                <td className="border p-2">Nhật ký truy cập và bảo mật</td>
                <td className="border p-2">12 tháng</td>
                <td className="border p-2">Bảo mật, phát hiện gian lận</td>
              </tr>
              <tr>
                <td className="border p-2">Dữ liệu marketing</td>
                <td className="border p-2">Cho đến khi rút lại đồng ý</td>
                <td className="border p-2">Đồng ý của người dùng</td>
              </tr>
              <tr>
                <td className="border p-2">Dữ liệu ẩn danh/hóa</td>
                <td className="border p-2">Vĩnh viễn</td>
                <td className="border p-2">Phân tích</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-4">Sau thời gian lưu giữ, dữ liệu sẽ được xóa vĩnh viễn hoặc ẩn danh hóa một cách an toàn
        (sử dụng các phương pháp xóa an toàn theo tiêu chuẩn NIST).</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        9. QUYỀN CỦA CHỦ THỂ DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Người dùng (chủ thể dữ liệu) có các quyền sau đây đối với dữ liệu cá nhân của mình:</p>
        
        <div className="grid gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.1 Quyền Truy cập (Right of Access)</h4>
            <p className="text-sm">Người dùng có quyền yêu cầu và nhận bản sao dữ liệu cá nhân. Chúng tôi cam kết cung cấp
            bản sao dữ liệu trong vòng 30 ngày.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.2 Quyền Chỉnh sửa (Right to Rectification)</h4>
            <p className="text-sm">Người dùng có quyền yêu cầu sửa dữ liệu không chính xác hoặc bổ sung dữ liệu thiếu.
            Người dùng có thể tự chỉnh sửa thông qua tính năng cài đặt tài khoản.</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.3 Quyền Xóa / Quyền được Lãng quên</h4>
            <p className="text-sm">Người dùng có quyền yêu cầu xóa dữ liệu cá nhân trong các trường hợp: dữ liệu không còn
            cần thiết, người dùng rút lại đồng ý, hoặc dữ liệu được xử lý trái pháp luật.</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.4 Quyền Hạn chế Xử lý</h4>
            <p className="text-sm">Người dùng có quyền yêu cầu tạm dừng xử lý dữ liệu trong các trường hợp: tính chính xác
            của dữ liệu bị nghi vấn hoặc xử lý là trái pháp luật nhưng người dùng yêu cầu thay vì xóa.</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.5 Quyền Phản đối</h4>
            <p className="text-sm">Người dùng có quyền phản đối việc xử lý dữ liệu dựa trên lợi ích hợp pháp hoặc cho mục đích
            tiếp thị trực tiếp. Đối với tiếp thị trực tiếp, chúng tôi sẽ dừng xử lý ngay lập tức.</p>
          </div>
          
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.6 Quyền Di chuyển Dữ liệu</h4>
            <p className="text-sm">Người dùng có quyền nhận dữ liệu cá nhân theo định dạng có cấu trúc, được sử dụng phổ biến
            và có thể đọc được bằng máy (JSON, CSV).</p>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.7 Quyền Rút lại Đồng ý</h4>
            <p className="text-sm">Đối với các hoạt động xử lý dựa trên đồng ý, người dùng có quyền rút lại đồng ý bất cứ
            lúc nào. Việc rút lại không ảnh hưởng đến tính hợp pháp của việc xử lý đã thực hiện.</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">9.8 Quyền khiếu nại</h4>
            <p className="text-sm">Người dùng có quyền khiếu nại đến cơ quan bảo vệ dữ liệu cá nhân có thẩm quyền
            nếu cho rằng việc xử lý dữ liệu cá nhân của mình vi phạm quy định pháp luật.</p>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">Cách thực hiện quyền:</h4>
          <p className="text-sm">Để thực hiện bất kỳ quyền nào nêu trên, người dùng có thể:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>Sử dụng tính năng "Cài đặt Quyền riêng tư" trong phần cài đặt tài khoản</li>
            <li>Gửi yêu cầu qua email đến: <strong>privacy@aiyoungguru.com</strong></li>
            <li>Liên hệ qua mẫu "Yêu cầu Dữ liệu" trên trang web của chúng tôi</li>
          </ul>
          <p className="text-sm mt-2">Chúng tôi có thể yêu cầu xác minh danh tính trước khi xử lý yêu cầu.
          Thời gian phản hồi tối đa là 30 ngày theo quy định pháp luật.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        10. BẢO VỆ TRẺ EM VÀ NGƯỜI VỊ THÀNH NIÊN
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Dịch vụ của chúng tôi được thiết kế để phù hợp cho người dùng từ 16 tuổi trở lên. Đối với người dùng dưới
        16 tuổi, chúng tôi áp dụng các biện pháp bảo vệ đặc biệt:</p>
        
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Yêu cầu sự đồng ý của cha mẹ/người giám hộ:</strong> Đối với người dùng dưới 16 tuổi,
          chúng tôi yêu cầu sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp trước khi thu thập dữ liệu.</li>
          <li><strong>Giám sát của người lớn:</strong> Chúng tôi khuyến nghị cha mẹ/người giám hộ giám sát hoạt động
          trực tuyến của trẻ em.</li>
          <li><strong>Quyền của cha mẹ/người giám hộ:</strong> Cha mẹ có quyền xem, chỉnh sửa hoặc xóa
          thông tin của trẻ em mà họ giám sát.</li>
        </ul>
        
        <p className="mt-4 bg-yellow-50 p-3 rounded">Nếu chúng tôi phát hiện dữ liệu của trẻ em dưới 16 tuổi được thu thập mà không có sự
        đồng ý của cha mẹ/người giám hộ, chúng tôi sẽ xóa dữ liệu đó càng sớm càng tốt.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        11. QUYẾT ĐỊNH TỰ ĐỘNG VÀ PROFILING
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Dịch vụ của chúng tôi sử dụng thuật toán và mô hình trí tuệ nhân tạo (AI) và học máy (ML) để cung cấp
        các gợi ý nghề nghiệp được cá nhân hóa:</p>
        
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Phân tích hồ sơ:</strong> Hệ thống phân tích thông tin người dùng để tạo ra đánh giá phù hợp.</li>
          <li><strong>Xếp hạng nghề nghiệp:</strong> Các thuật toán sắp xếp và xếp hạng các ngành nghề được đề xuất.</li>
          <li><strong>Đề xuất cá nhân hóa:</strong> Nội dung và gợi ý được điều chỉnh theo hành vi và sở thích.</li>
        </ul>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">Quyền của người dùng đối với quyết định tự động:</h4>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Quyền yêu cầu can thiệp con người trong quyết định tự động</li>
            <li>Quyền được giải thích về cách thức đưa ra quyết định</li>
            <li>Quyền phản đối xử lý tự động nếu luật cho phép</li>
            <li>Quyền không bị quyết định dựa trên xử lý tự động có tác động pháp lý hoặc tương tự</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        12. THAY ĐỔI CHÍNH SÁCH
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Chúng tôi có thể cập nhật Chính sách Bảo vệ Dữ liệu Cá nhân này theo thời gian để phản ánh các thay đổi
        trong thực tiễn bảo mật, công nghệ hoặc pháp luật.</p>
        
        <ul className="list-disc pl-6 space-y-2">
          <li>Mọi thay đổi trọng yếu sẽ được thông báo qua email đến người dùng hoặc thông báo nổi bật trên nền tảng.</li>
          <li>Phiên bản cập nhật sẽ được đăng tải với ngày có hiệu lực rõ ràng.</li>
          <li>Người dùng nên thường xuyên xem lại Chính sách này để cập nhật thông tin.</li>
        </ul>
        
        <p className="mt-4 bg-gray-50 p-3 rounded">
          <strong>Phiên bản hiện có hiệu lực:</strong> 11/02/2026<br/>
          <strong>Ngày cập nhật cuối cùng:</strong> Tháng 02 năm 2026
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        13. LIÊN HỆ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc yêu cầu nào liên quan đến Chính sách Bảo vệ Dữ liệu Cá nhân này
        hoặc thực tiễn bảo mật của chúng tôi, vui lòng liên hệ:</p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-medium text-[var(--c-text)]">AI Young Guru</p>
          <p className="text-sm mt-1"><strong>Bộ phận Bảo vệ Dữ liệu:</strong> privacy@aiyoungguru.com</p>
          <p className="text-sm"><strong>Hỗ trợ chung:</strong> support@aiyoungguru.com</p>
          <p className="text-sm"><strong>Website:</strong> https://aiyoungguru.com</p>
          <p className="text-sm mt-2 pt-2 border-t border-blue-200">
            <em>Sản phẩm và dịch vụ này là của <strong>Team LLMagik</strong> thực hiện trong <strong>CUỘC THI AI YOUNG GURU</strong>.</em>
          </p>
        </div>
        
        <p className="mt-4">Chúng tôi cam kết phản hồi mọi yêu cầu trong vòng 30 ngày theo quy định pháp luật về bảo vệ dữ liệu cá nhân.</p>
      </div>
    </section>
  </div>
);

/**
 * ====================================================================
 * ĐIỀU KHOẢN DỊCH VỤ TOÀN DIỆN
 * ====================================================================
 */
export const termsOfServiceContent = (
  <div className="space-y-8">
    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        1. CHẤP NHẬN ĐIỀU KHOẢN
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)] leading-relaxed">
        <p>
          <strong>1.1</strong> Bằng việc truy cập, đăng ký, tạo tài khoản hoặc sử dụng bất kỳ dịch vụ, sản phẩm,
          ứng dụng hoặc tính năng nào do AI Young Guru cung cấp (sau đây gọi tắt là "Dịch vụ"), bạn ("Người dùng",
          "Bạn") đồng ý bị ràng buộc và tuân thủ nghiêm ngặt các Điều khoản Dịch vụ này ("Điều khoản", "Thỏa thuận").
        </p>
        <p>
          <strong>1.2</strong> Nếu bạn đang sử dụng Dịch vụ thay mặt cho một tổ chức, công ty, doanh nghiệp hoặc pháp nhân
          khác ("Tổ chức"), bạn đại diện và bảo đảm rằng bạn có đầy đủ quyền hợp pháp để ràng buộc Tổ chức đó tuân thủ
          các Điều khoản này, và trong trường hợp đó, "Người dùng" hoặc "Bạn" đề cập đến cả cá nhân và Tổ chức đó.
        </p>
        <p>
          <strong>1.3</strong> NẾU BẠN KHÔNG ĐỒNG Ý VỚI BẤT KỲ PHẦN NÀO CỦA CÁC ĐIỀU KHOẢN NÀY, BẠN KHÔNG ĐƯỢC PHÉP
          TRUY CẬP HOẶC SỬ DỤNG DỊCH VỤ.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
          <p className="font-medium text-[var(--c-text)]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
          <p className="text-sm mt-1">Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        2. MÔ TẢ DỊCH VỤ VÀ PHẠM VI ÁP DỤNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>
          <strong>2.1</strong> AI Young Guru là nền tảng tư vấn nghề nghiệp thông minh, sử dụng công nghệ trí tuệ
          nhân tạo (AI) và học máy (Machine Learning) để cung cấp các dịch vụ sau:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Đánh giá và phân tích năng lực, kỹ năng, sở thích nghề nghiệp</li>
          <li>Đề xuất và gợi ý các ngành nghề, con đường sự nghiệp phù hợp</li>
          <li>Cung cấp thông tin về thị trường lao động, xu hướng nghề nghiệp</li>
          <li>Hỗ trợ xây dựng chiến lược phát triển nghề nghiệp cá nhân hóa</li>
          <li>Lưu trữ và quản lý hồ sơ nghề nghiệp</li>
          <li>Các tính năng khác được thông báo qua kênh chính thức</li>
        </ul>
        <p>
          <strong>2.2</strong> Dịch vụ được cung cấp thông qua các kênh: website (bao gồm cả phiên bản di động),
          ứng dụng di động (iOS và Android), API và các kênh phân phối khác mà chúng tôi có thể phát triển.
        </p>
        <p>
          <strong>2.3</strong> Chúng tôi có quyền thay đổi, cập nhật, nâng cấp, cải tiến, bổ sung hoặc ngừng cung cấp
          bất kỳ phần nào của Dịch vụ mà không cần thông báo trước. Các tính năng mới có thể tuân theo các điều khoản bổ sung.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        3. TÀI KHOẢN VÀ ĐĂNG KÝ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>
          <strong>3.1 Yêu cầu Tài khoản:</strong> Để sử dụng đầy đủ các tính năng của Dịch vụ, bạn cần tạo một tài khoản
          bằng cách cung cấp thông tin chính xác, đầy đủ và cập nhật. Bạn chịu trách nhiệm duy trì tính chính xác và
          cập nhật của thông tin tài khoản.
        </p>
        <p>
          <strong>3.2 Bảo mật Tài khoản:</strong> Bạn chịu trách nhiệm bảo mật thông tin đăng nhập (username, password)
          và mọi hoạt động diễn ra dưới tài khoản của bạn. Bạn đồng ý thông báo ngay lập tức cho chúng tôi qua
          email bảo mật nếu phát hiện hoặc nghi ngờ bất kỳ truy cập trái phép hoặc vi phạm bảo mật nào.
        </p>
        <p>
          <strong>3.3 Tuổi và Năng lực Pháp lý:</strong> Dịch vụ dành cho người dùng từ 16 tuổi trở lên. Đối với người
          dùng dưới 16 tuổi, cần có sự đồng ý của cha mẹ hoặc người giám hộ hợp pháp. Bằng việc sử dụng Dịchụ, bạn
          đại diện và bảo đảm rằng bạn có đủ năng lực pháp lý để ràng buộc các điều khoản này.
        </p>
        <p>
          <strong>3.4 Xóa Tài khoản:</strong> Bạn có thể yêu cầu xóa tài khoản bất cứ lúc nào thông qua cài đặt tài
          khoản hoặc liên hệ hỗ trợ. Việc xóa tài khoản sẽ dẫn đến mất quyền truy cập Dịch vụ và có thể xóa vĩnh viễn
          tất cả dữ liệu liên quan theo chính lưu giữ dữ liệu của chúng tôi.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        4. SỬ DỤNG DỊCH VỤ VÀ NGHĨA VỤ NGƯỜI DÙNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>4.1 Quyền sử dụng được cấp phép:</strong> Theo các Điều khoản này, chúng tôi cấp cho bạn quyền
        sử dụng cá nhân, không độc quyền, không thể chuyển nhượng, có giới hạn để truy cập và sử dụng Dịch vụ cho
        mục đích hợp pháp và phù hợp với mục đích thiết kế của Dịch vụ.</p>
        
        <p><strong>4.2 Các hành vi Bị cấm:</strong> Bạn đồng ý KHÔNG thực hiện hoặc cho phép bất kỳ bên thứ ba thực hiện
        các hành vi sau:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sử dụng Dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc trái với các điều khoản này</li>
          <li>Vi phạm, xâm phạm hoặc cố gắng xâm phạm quyền sở hữu trí tuệ của chúng tôi hoặc bên thứ ba</li>
          <li>Can thiệp, gây gián đoạn hoặc làm hỏng hoạt động của Dịch vụ hoặc các hệ thống liên quan</li>
          <li>Cố gắng truy cập trái phép vào bất kỳ phần nào của Dịch vụ, hệ thống hoặc mạng</li>
          <li>Sử dụng Dịch vụ để gửi spam, quảng cáo không mong muốn hoặc liên lạc thương mại không được yêu cầu</li>
          <li>Tải lên, phân phối hoặc chia sẻ phần mềm độc hại, virus hoặc mã độc</li>
          <li>Thu thập hoặc lưu trữ thông tin cá nhân về người dùng khác mà không có sự đồng ý</li>
          <li>Reverse engineer, disassemble hoặc cố gắng lấy mã nguồn của Dịch vụ</li>
          <li>Sử dụng các phương pháp tự động (bots, crawlers, scrapers) để truy cập Dịch vụ mà không có sự cho phép</li>
          <li>Tạo nhiều tài khoản để lạm dụng khuyến mãi hoặc các chương trình ưu đãi</li>
          <li>Bất kỳ hành vi nào khác mà chúng tôi cho là không phù hợp hoặc vi phạm tinh thần của các Điều khoản</li>
        </ul>
        
        <p><strong>4.3 Trách nhiệm về Nội dung:</strong> Bạn chịu trách nhiệm hoàn toàn về mọi nội dung bạn tạo ra,
        tải lên, chia sẻ hoặc truyền qua Dịch vụ. Bạn đảm bảo rằng bạn có đầy đủ quyền để chia sẻ nội dung đó và
        nội dung không vi phạm quyền của bất kỳ bên thứ ba nào.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        5. NỘI DUNG DO NGƯỜI DÙNG TẠO RA VÀ QUYỀN SỞ HỮU
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>5.1 Quyền sở hữu của Người dùng:</strong> Bạn giữ mọi quyền sở hữu đối với Nội dung do bạn tạo ra
        ("Nội dung Người dùng") mà bạn gửi, tải lên, hiển thị hoặc truyền qua Dịch vụ. "Nội dung Người dùng" bao gồm
        nhưng không giới hạn ở: hồ sơ cá nhân, câu trả lời khảo sát, đánh giá, bình luận, tin nhắn và các tài liệu khác.</p>
        
        <p><strong>5.2 Giấy phép cho AI Young Guru:</strong> Bằng việc gửi, tải lên hoặc cung cấp Nội dung Người dùng,
        bạn cấp cho AI Young Guru một giấy phép toàn cầu, không độc quyền, miễn phí bản quyền, có thể cấp phép lại
        và có thể chuyển nhượng để:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sử dụng, sao chép, lưu trữ, xử lý và hiển thị Nội dung Người dùng để cung cấp Dịch vụ</li>
          <li>Chỉnh sửa, điều chỉnh và chuyển đổi định dạng Nội dung Người dùng khi cần thiết</li>
          <li>Sử dụng Nội dung Người dùng (sau khi ẩn danh hóa hoặc tổng hợp) để cải thiện, phát triển và huấn luyện
          các thuật toán AI và ML của chúng tôi</li>
          <li>Chia sẻ Nội dung Người dùng với các nhà cung cấp dịch vụ bên thứ ba (subprocessors) tuân thủ các
          điều khoản bảo mật nghiêm ngặt</li>
        </ul>
        
        <p><strong>5.3 Phạm vi Giấy phép:</strong> Giấy phép này tồn tại trong suốt thời gian Nội dung Người dùng
        được lưu trữ trên hệ thống của chúng tôi. Sau khi xóa Nội dung Người dùng (theo yêu cầu của bạn hoặc khi
        tài khoản bị xóa), giấy phép này sẽ kết thúc đối với nội dung cụ thể đó, trừ trường hợp nội dung đã được
        ẩn danh hóa hoặc tổng hợp cho mục đích phân tích.</p>
        
        <p><strong>5.4 Lưu ý về Thông tin Nhạy cảm:</strong> Bạn KHÔNG nên gửi các thông tin nhạy cảm như số thẻ tín
        dụng, mật khẩu, số an sinh xã hội hoặc các thông tin nhận dạng cá nhân khác thông qua Dịch vụ.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        6. SỞ HỮU TRÍ TUỆ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>6.1 Quyền sở hữu của AI Young Guru:</strong> Dịch vụ và tất cả các nội dung, tính năng, chức năng,
        thiết kế, giao diện người dùng, logo, nhãn hiệu, tên thương mại, mã nguồn, cơ sở dữ liệu, thuật toán và tài
        sản trí tuệ khác thuộc sở hữu của AI Young Guru và được bảo vệ bởi luật sở hữu trí tuệ Việt Nam và quốc tế.</p>
        
        <p><strong>6.2 Các quyền được cấp:</strong> Chúng tôi cấp cho bạn quyền sử dụng có giới hạn, không độc quyền,
        có thể thu hồi để truy cập và sử dụng Dịch vụ theo các Điều khoản này. Quyền này không bao gồm quyền:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sao chép, sửa đổi, phân phối hoặc tạo các tác phẩm phái sinh từ Dịch vụ</li>
          <li>Bán, cho thuê, cấp phép lại hoặc thương mại hóa Dịch vụ</li>
          <li>Reverse engineer, disassemble hoặc cố gắng truy cập mã nguồn</li>
          <li>Xóa, che khuất hoặc sửa đổi các thông báo bản quyền, nhãn hiệu hoặc quyền sở hữu khác</li>
        </ul>
        
        <p><strong>6.3 Phản hồi và Đề xuất:</strong> Nếu bạn cung cấp bất kỳ phản hồi, đề xuất, ý tưởng cải tiến
        hoặc đề xuất tính năng nào liên quan đến Dịch vụ ("Phản hồi"), bạn cấp cho chúng tôi quyền sử dụng, tiết lộ
        và khai thác Phản hồi đó mà không có nghĩa vụ bồi thường hoặc ghi nhận quyền sở hữu của bạn.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        7. THANH TOÁN VÀ GÓI DỊCH VỤ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>7.1 Dịch vụ Miễn phí và Trả phí:</strong> AI Young Guru cung cấp cả gói dịch vụ miễn phí (Free)
        và các gói dịch vụ trả phí (Premium, Enterprise) với các tính năng khác nhau. Chi tiết về tính năng và giá
        của từng gói được hiển thị tại trang pricing hoặc trong phần cài đặt tài khoản.</p>
        
        <p><strong>7.2 Thanh toán:</strong> Đối với các gói trả phí, bạn đồng ý cung cấp thông tin thanh toán chính xác
        và đầy đủ. Thanh toán được xử lý qua nhà cung cấp dịch vụ thanh toán bên thứ ba (Stripe, PayPal, v.v.). Bằng
        việc đăng ký gói trả phí, bạn ủy quyền cho chúng tôi thu phí theo chu kỳ đã chọn cho đến khi hủy đăng ký.</p>
        
        <p><strong>7.3 Tự động Gia hạn:</strong> Đăng ký trả phí sẽ tự động gia hạn vào cuối mỗi chu kỳ trừ khi bạn
        hủy trước ít nhất 24 giờ trước khi kết thúc chu kỳ hiện tại.</p>
        
        <p><strong>7.4 Hoàn tiền và Hủy:</strong> Chính sách hoàn tiền như sau:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Không hoàn tiền cho việc sử dụng một phần hoặc toàn bộ chu kỳ đã thanh toán</li>
          <li>Có thể hủy đăng ký bất cứ lúc nào trong phần cài đặt tài khoản</li>
          <li>Quyền truy cập vào tính năng Premium sẽ tiếp tục đến hết chu kỳ thanh toán hiện tại</li>
          <li>Các trường hợp hoàn tiền đặc biệt (lỗi hệ thống, thanh toán trùng lặp) sẽ được xem xét riêng</li>
        </ul>
        
        <p><strong>7.5 Thay đổi Giá:</strong> Chúng tôi có quyền thay đổi giá của các gói dịch vụ. Thay đổi giá sẽ có
        hiệu lực sau khi thông báo trước ít nhất 30 ngày. Việc tiếp tục sử dụng dịch vụ sau khi thay đổi có hiệu lực
        đồng nghĩa với việc chấp nhận giá mới.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        8. BẢO HÀNH VÀ TUYÊN BỐ MIỄN TRỪ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>8.1 Dịch vụ được cung cấp "nguyên trạng":</strong> DỊCH VỤ ĐƯỢC CUNG CẤP THEO NGUYÊN TRẠNG ("AS IS")
        VÀ "NHƯ CÓ SẴN" ("AS AVAILABLE"). CHÚNG TÔI TỪ CHỐI MỌI BẢO ĐẢM RÕ RÀNG HOẶC NGẦM ĐỊNH, BAO GỒM NHƯNG KHÔNG GIỚI HẠN Ở
        BẢO ĐẢM VỀ KHẢ NĂNG BÁN, PHÙ HỢP CHO MỘT MỤC ĐÍCH CỤ THỂ, QUYỀN SỞ HỮU VÀ KHÔNG VI PHẠM.</p>
        
        <p><strong>8.2 Giới hạn về Lời khuyên Nghề nghiệp:</strong> CÁC ĐỀ XUẤT, GỢI Ý VÀ THÔNG TIN VỀ NGHỀ NGHIỆP DO DỊCH VỤ
        CUNG CẤP CHỈ MANG TÍNH CHẤT THAM KHẢO VÀ KHÔNG CẤU THÀNH LỜI KHUYÊN CHUYÊN MÔN VỀ NGHỀ NGHIỆP, TÀI CHÍNH HOẶC PHÁP LÝ.
        CHÚNG TÔI KHÔNG ĐẢM BẢO RẰNG CÁC ĐỀ XUẤT SẼ PHÙ HỢP HOẶC DẪN ĐẾN KẾT QUẢ TÍCH CỰC CHO NGƯỜI DÙNG.</p>
        
        <p><strong>8.3 Trách nhiệm của Người dùng:</strong> Người dùng chịu trách nhiệm đánh giá độc lập các lời khuyên,
        đề xuất và thông tin từ Dịch vụ và đưa ra quyết định nghề nghiệp dựa trên đánh giá riêng của mình.
        Chúng tôi khuyến nghị người dùng tham vấn với các chuyên gia tư vấn nghề nghiệp, giáo dục hoặc tài chính
        được cấp chứng chỉ trước khi đưa ra các quyết định quan trọng.</p>
        
        <p><strong>8.4 Độ chính xác của Thông tin:</strong> Mặc dù chúng tôi cố gắng đảm bảo thông tin về thị trường
        lao động, xu hướng nghề nghiệp và các dữ liệu khác là chính xác và cập nhật, chúng tôi không đảm bảo tính
        chính xác, đầy đủ hoặc cập nhật của các thông tin này. Thị trường lao động và yêu cầu nghề nghiệp thay đổi
        liên tục và có thể không phản ánh kịp thời trên Dịch vụ.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        9. GIỚI HẠN TRÁCH NHIỆM
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>9.1 Giới hạn Tổng thể:</strong> TRONG MỌI TRƯỜNG HỢP, TỔNG TRÁCH NHIỆM PHÁP LÝ CỦA AI YOUNG GURU
        VÀ CÁC CÔNG TY LIÊN QUAN, NHÀ CUNG CẤP, GIÁM ĐỐC, NHÂN VIÊN VÀ ĐẠI DIỆN CỦA HỌ ĐỐI VỚI BẠN HOẶC BẤT KỲ BÊN THỨ BA
        NÀO SẼ KHÔNG VƯỢT QUÁ SỐ TIỀN LỚN HƠN GIỮA (A) SỐ TIỀN BẠN ĐÃ THANH TOÁN CHO CHÚNG TÔI TRONG 12 THÁNG GẦN NHẤT
        HOẶC (B) MỘT TRIỆU ĐỒNG VIỆT NAM (1.000.000 VND), TÙY THEO MỨC NÀO THẤP HƠN.</p>
        
        <p><strong>9.2 Thiệt hại Gián tiếp và Hậu quả:</strong> TRONG MỌI TRƯỜNG HỢP, CHÚNG TÔI SẼ KHÔNG CHỊU TRÁCH NHIỆM
        CHO BẤT KỲ THIỆT HẠI GIÁN TIẾP, NGẪU NHIÊN, ĐẶC BIỆT, TRỪNG PHẠT HOẶC HẬU QUẢ NÀO (BAO GỒM NHƯNG KHÔNG GIỚI HẠN Ở
        MẤT MÁT LỢI NHUẬN, MẤT DỮ LIỆU, MẤT CƠ HỘI KINH DOANH, GIÁN ĐOẠN KINH DOANH HOẶC CÁC THIỆT HẠI PHI VẬT CHẤT KHÁC)
        PHÁT SINH TỪ HOẶC LIÊN QUAN ĐẾN VIỆC SỬ DỤNG HOẶC KHÔNG THỂ SỬ DỤNG DỊCH VỤ, NGAY CẢ KHI CHÚNG TÔI ĐÃ ĐƯỢC
        THÔNG BÁO VỀ KHẢ NĂNG XẢY RA CÁC THIỆT HẠI ĐÓ.</p>
        
        <p><strong>9.3 Ngoại lệ:</strong> CÁC GIỚI HẠN TRÁCH NHIỆM NÀY KHÔNG ÁP DỤNG CHO (A) TRÁCH NHIỆM PHÁP LÝ DO CỐ Ý
        GÂY HẠI HOẠC SƠ SUẤT NẶNG NỀ CỦA CHÚNG TÔI, (B) TRÁCH NHIỆM KHÔNG THỂ LOẠI TRỪ THEO PHÁP LUẬT ÁP DỤNG, HOẶC
        (C) TRÁCH NHIỆM PHÁT SINH TỪ CÁC ĐIỀU KHOẢN VỀ BẢO MẬT VÀ BẢO VỆ DỮ LIỆU.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        10. BỒI THƯỜNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Bạn đồng ý bồi thường, bảo vệ và giữ cho AI Young Guru, các công ty liên quan, cán bộ, giám đốc, nhân viên,
        đại lý và người đại diện của họ ("Các bên được bồi thường") khỏi mọi khiếu nại, yêu cầu, tổn thất, thiệt hại,
        nghĩa vụ và chi phí (bao gồm phí luật sư hợp lý) phát sinh từ hoặc liên quan đến:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Việc bạn sử dụng hoặc lạm dụng Dịch vụ</li>
          <li>Vi phạm các Điều khoản này của bạn</li>
          <li>Vi phạm quyền của bất kỳ bên thứ ba nào, bao gồm quyền sở hữu trí tuệ, quyền riêng tư hoặc các quyền khác</li>
          <li>Bất kỳ Nội dung Người dùng nào bạn gửi qua Dịch vụ</li>
        </ul>
        <p>Bạn cũng đồng ý hợp tác đầy đủ với chúng tôi trong việc bảo vệ chống lại bất kỳ khiếu nại nào.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        11. CHẤM DỨT VÀ ĐÌNH CHỈ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>11.1 Chấm dứt bởi Người dùng:</strong> Bạn có thể ngừng sử dụng Dịch vụ hoặc xóa tài khoản bất cứ
        lúc nào mà không cần thông báo trước. Xóa tài khoản có thể được thực hiện thông qua phần cài đặt hoặc liên hệ hỗ trợ.</p>
        
        <p><strong>11.2 Chấm dứt bởi AI Young Guru:</strong> Chúng tôi có quyền chấm dứt hoặc đình chỉ tài khoản của bạn
        và quyền truy cập Dịch vụ ngay lập tức, không cần thông báo trước, nếu:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Bạn vi phạm nghiêm trọng hoặc lặp lại vi phạm các Điều khoản này</li>
          <li>Bạn tham gia vào các hoạt động bất hợp pháp hoặc gian lận</li>
          <li>Bạn cố gắng can thiệp vào hoạt động bình thường của Dịch vụ</li>
          <li>Chúng tôi phải tuân theo yêu cầu pháp lý hoặc quy định của cơ quan nhà nước</li>
          <li>Dịch vụ ngừng hoạt động vì lý do kỹ thuật hoặc kinh doanh</li>
        </ul>
        
        <p><strong>11.3 Hậu quả của Chấm dứt:</strong> Khi tài khoản bị chấm dứt, quyền truy cập và sử dụng Dịch vụ sẽ
        chấm dứt ngay lập tức. Chúng tôi có thể (nhưng không có nghĩa vụ) xóa vĩnh viễn tất cả dữ liệu và Nội dung
        Người dùng liên quan đến tài khoản đó. Các quyền đã mua hoặc phí đã thanh toán sẽ không được hoàn trả trừ
        trường hợp pháp luật yêu cầu khác.</p>
        
        <p><strong>11.4 Tồn tại của Điều khoản:</strong> Các điều khoản sau sẽ tiếp tục có hiệu lực sau khi chấm dứt:
        Sở hữu Trí tuệ, Bảo hành và Tuyên bố Miễn trừ, Giới hạn Trách nhiệm, Bồi thường, Luật Áp dụng và Giải quyết Tranh chấp.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        12. LUẬT ÁP DỤNG VÀ GIẢI QUYẾT TRANH CHẤP
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>12.1 Luật Áp dụng:</strong> Các Điều khoản Dịch vụ này được điều chỉnh và giải thích theo pháp luật
        nước Cộng hòa Xã hội Chủ nghĩa Việt Nam, không tính đến các nguyên tắc xung đột pháp luật.</p>
        
        <p><strong>12.2 Giải quyết Tranh chấp:</strong> Mọi tranh chấp, khác biệt hoặc yêu cầu phát sinh từ hoặc liên
        quan đến các Điều khoản này hoặc việc sử dụng Dịch vụ sẽ được giải quyết theo quy trình sau:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Giai đoạn 1 - Thương lượng Thiện chí:</strong> Các bên sẽ cố gắng giải quyết tranh chấp thông qua
          đàm phán thiện chí trong vòng 30 ngày kể từ khi một bên thông báo bằng văn bản về tranh chấp.</li>
          <li><strong>Giai đoạn 2 - Hòa giải:</strong> Nếu thương lượng không thành công, các bên có thể sử dụng dịch vụ
          hòa giải của Trung tâm Hòa giải thương mại hoặc cơ quan có thẩm quyền khác.</li>
          <li><strong>Giai đoạn 3 - Tòa án:</strong> Nếu hòa giải không thành công, tranh chấp sẽ được đưa ra tòa án có
          thẩm quyền tại Việt Nam để giải quyết.</li>
        </ul>
        
        <p><strong>12.3 Kiện tụng tập thể:</strong> Bạn đồng ý rằng bạn chỉ có thể giải quyết tranh chấp với chúng tôi
        trên cơ sở cá nhân và không được kiện tụng tập thể, kiện tụng đại diện hoặc kiện tụng tổ hợp dưới bất kỳ hình
        thức nào.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        13. ĐIỀU KHOẢN CHUNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>13.1 Toàn bộ Thỏa thuận:</strong> Các Điều khoản Dịch vụ này, cùng với Chính sách Bảo mật, Chính sách
        Cookie và bất kỳ thông báo pháp lý nào được đăng tải trên Dịch vụ, cấu thành toàn bộ thỏa thuận giữa bạn và AI
        Young Guru liên quan đến việc sử dụng Dịch vụ và thay thế mọi thỏa thuận, hiểu biết, đàm phán và trao đổi trước
        đó giữa các bên về nội dung đó.</p>
        
        <p><strong>13.2 Sửa đổi Điều khoản:</strong> Chúng tôi có quyền sửa đổi, cập nhật hoặc thay đổi các Điều khoản
        này vào bất kỳ lúc nào. Các thay đổi trọng yếu sẽ được thông báo qua email hoặc thông báo nổi bật trên Dịch vụ
        ít nhất 30 ngày trước khi có hiệu lực. Việc bạn tiếp tục sử dụng Dịch vụ sau khi thay đổi có hiệu lực đồng nghĩa
        với việc bạn chấp nhận các thay đổi đó.</p>
        
        <p><strong>13.3 Từ bỏ:</strong> Việc không thực thi hoặc chậm trễ trong việc thực thi bất kỳ quyền hoặc điều khoản
        nào theo các Điều khoản này sẽ không cấu thành sự từ bỏ quyền đó. Sự từ bỏ sẽ chỉ có hiệu lực khi được thể hiện
        bằng văn bản ký bởi người có thẩm quyền.</p>
        
        <p><strong>13.4 Tính riêng lẻ:</strong> Nếu bất kỳ điều khoản nào của các Điều khoản này được coi là bất hợp pháp,
        vô hiệu hoặc không thể thi hành, các điều khoản còn lại sẽ vẫn có đầy đủ hiệu lực và hiệu lực thi hành.</p>
        
        <p><strong>13.5 Chuyển nhượng:</strong> Bạn không được chuyển nhượng hoặc ủy quyền các quyền hoặc nghĩa vụ theo
        các Điều khoản này mà không có sự đồng ý trước bằng văn bản của chúng tôi. Chúng tôi có thể chuyển nhượng các
        quyền và nghĩa vụ này cho bất kỳ bên thứ ba nào trong trường hợp sáp nhập, mua lại hoặc bán tài sản.</p>
        
        <p><strong>13.6 Quan hệ độc lập:</strong> Các bên là các bên độc lập. Các Điều khoản này không tạo ra quan hệ đối
        tác, liên doanh, quan hệ lao động hoặc quan hệ đại lý giữa các bên.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        14. LIÊN HỆ
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Nếu bạn có bất kỳ câu hỏi, thắc mắc hoặc phản hồi nào về các Điều khoản Dịch vụ này, vui lòng liên hệ:</p>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="font-medium text-[var(--c-text)]">AI Young Guru</p>
          <p className="text-sm mt-1"><strong>Email hỗ trợ:</strong> support@aiyoungguru.com</p>
          <p className="text-sm"><strong>Email pháp lý:</strong> legal@aiyoungguru.com</p>
          <p className="text-sm"><strong>Website:</strong> https://aiyoungguru.com</p>
          <p className="text-sm mt-2 pt-2 border-t border-blue-200">
            <em>Sản phẩm và dịch vụ này là của <strong>Team LLMagik</strong> thực hiện trong <strong>CUỘC THI AI YOUNG GURU</strong>.</em>
          </p>
        </div>
      </div>
    </section>
  </div>
);

/**
 * ====================================================================
 * CHÍNH SÁCH COOKIE TOÀN DIỆN
 * ====================================================================
 */
export const cookiePolicyContent = (
  <div className="space-y-8">
    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        1. GIỚI THIỆU VÀ PHẠM VI ÁP DỤNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)] leading-relaxed">
        <p>
          <strong>AI Young Guru</strong> sử dụng cookie, pixel tags, web beacons và các công nghệ lưu trữ và theo dõi
          tương tự (gọi chung là "Cookies") để cải thiện trải nghiệm người dùng, phân tích cách sử dụng Dịch vụ,
          đảm bảo hoạt động ổn định của hệ thống và cung cấp nội dung phù hợp với sở thích của người dùng.
        </p>
        <p>
          Chính sách Cookie này giải thích chi tiết các loại Cookies mà chúng tôi sử dụng, mục đích của từng loại,
          cách bạn có thể quản lý và kiểm soát Cookies, cũng như các lựa chọn của bạn liên quan đến việc sử dụng
          công nghệ theo dõi này.
        </p>
        <p>
          Chính sách này là một phần bổ sung cho Chính sách Bảo mật Dữ liệu Cá nhân và Điều khoản Dịch vụ của chúng tôi.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500 my-4">
          <p className="font-medium text-[var(--c-text)]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
          <p className="text-sm mt-1">Cập nhật lần cuối: Tháng 02 năm 2026</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        2. COOKIE LÀ GÌ VÀ CÁCH HOẠT ĐỘNG
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>
          <strong>2.1 Định nghĩa Cookie:</strong> Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn
          (máy tính, điện thoại di động, máy tính bảng hoặc thiết bị kết nối internet khác) khi bạn truy cập và sử dụng
          Dịch vụ của chúng tôi. Cookies được gửi từ máy chủ web đến trình duyệt của bạn và được lưu trữ cục bộ.
        </p>
        
        <p><strong>2.2 Các loại Cookie theo Thời gian Tồn tại:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cookie Phiên (Session Cookies):</strong> Là các cookie tạm thời chỉ tồn tại trong bộ nhớ của
          trình duyệt trong suốt phiên truy cập của bạn. Chúng tự động bị xóa khi bạn đóng trình duyệt. Thường được
          sử dụng để duy trì trạng thái đăng nhập, theo dõi hoạt động trong một phiên duy nhất.</li>
          <li><strong>Cookie Vĩnh cửu (Persistent Cookies):</strong> Là các cookie được lưu trữ trên thiết bị của
          bạn trong một khoảng thời gian dài (thường từ vài ngày đến vài năm) và không bị xóa khi bạn đóng trình
          duyệt. Chúng được sử dụng để ghi nhớ các tùy chọn, cài đặt ngôn ngữ và thông tin đăng nhập cho các lần
          truy cập tiếp theo.</li>
        </ul>
        
        <p><strong>2.3 Các loại Cookie theo Nguồn gốc:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Cookie First-party (Cookie bên thứ nhất):</strong> Được đặt bởi AI Young Guru khi bạn truy cập
          Dịch vụ của chúng tôi. Được sử dụng để vận hành, cải thiện và cá nhân hóa trải nghiệm của bạn.</li>
          <li><strong>Cookie Third-party (Cookie bên thứ ba):</strong> Được đặt bởi các bên thứ ba (nhà cung cấp dịch vụ,
          đối tác quảng cáo, nền tảng phân tích) khi bạn truy cập Dịch vụ của chúng tôi. Chúng tuân theo chính sách
          riêng của bên thứ ba đó.</li>
        </ul>
        
        <p><strong>2.4 Công nghệ Theo dõi Khác:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Pixel Tags / Web Beacons:</strong> Hình ảnh nhỏ trong suốt (1x1 pixel) được nhúng vào trang web
          hoặc email, cho phép theo dõi xem người dùng đã xem trang hoặc email đó hay chưa.</li>
          <li><strong>Local Storage:</strong> Công nghệ lưu trữ web cho phép lưu dữ liệu cục bộ trên trình duyệt của
          bạn, thường được sử dụng để lưu trữ các tùy chọn và cài đặt người dùng.</li>
          <li><strong>Device Fingerprinting:</strong> Kỹ thuật thu thập thông tin về thiết bị (loại trình duyệt, hệ
          điều hành, cài đặt ngôn ngữ) để nhận diện và theo dõi thiết bị qua các phiên truy cập.</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        3. CÁC LOẠI COOKIE CHÚNG TÔI SỬ DỤNG
      </h3>
      <div className="space-y-6 text-[var(--c-text-muted)]">
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.1 Cookie Thiết yếu (Essential Cookies)</h4>
          <p className="text-sm">Những cookie này cần thiết để Dịch vụ hoạt động đúng cách và cung cấp các chức năng cốt lõi.
          Chúng không thể bị tắt trong hệ thống của chúng tôi.</p>
          <p className="text-sm mt-2"><strong>Mục đích:</strong></p>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
            <li>Xác thực và duy trì trạng thái đăng nhập của người dùng</li>
            <li>Bảo mật tài khoản và phòng chống gian lận</li>
            <li>Xử lý và hoàn tất các yêu cầu của người dùng</li>
            <li>Duy trì các tùy chọn cơ bản (ngôn ngữ, khu vực)</li>
            <li>Cân bằng tải và đảm bảo hiệu suất hệ thống</li>
            <li>Ngăn chặn các hoạt động độc hại và bảo vệ tính toàn vẹn của Dịch vụ</li>
          </ul>
          <p className="text-sm mt-2"><strong>Thời gian lưu trữ:</strong> Thường là session hoặc lên đến 12 tháng</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.2 Cookie Chức năng (Functional Cookies)</h4>
          <p className="text-sm">Những cookie này cho phép Dịch vụ ghi nhớ các lựa chọn và tùy chỉnh của bạn để cung cấp
          trải nghiệm cá nhân hóa và tiện lợi hơn.</p>
          <p className="text-sm mt-2"><strong>Mục đích:</strong></p>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
            <li>Ghi nhớ tùy chọn ngôn ngữ và khu vực địa lý</li>
            <li>Lưu trữ cài đặt giao diện và hiển thị (chủ đề, kích thước phông chữ)</li>
            <li>Duy trì lịch sử hội thoại và các mục yêu thích</li>
            <li>Ghi nhớ các tùy chọn cá nhân hóa đã đặt</li>
            <li>Cung cấp các tính năng nâng cao như chia sẻ màn hình hoặc live chat</li>
            <li>Tùy chỉnh nội dung và gợi ý dựa trên sở thích</li>
          </ul>
          <p className="text-sm mt-2"><strong>Thời gian lưu trữ:</strong> Lên đến 24 tháng</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.3 Cookie Phân tích và Hiệu suất (Analytics Cookies)</h4>
          <p className="text-sm">Những cookie này giúp chúng tôi hiểu cách người dùng tương tác với Dịch vụ, đo lường hiệu suất
          và xác định các lĩnh vực cần cải thiện.</p>
          <p className="text-sm mt-2"><strong>Mục đích:</strong></p>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
            <li>Đếm số lượng người truy cập và theo dõi các trang được xem nhiều nhất</li>
            <li>Phân tích thời gian người dùng dành cho từng trang và tính năng</li>
            <li>Xác định các lỗi kỹ thuật và vấn đề trải nghiệm người dùng</li>
            <li>Đo lường hiệu quả của các chiến dịch tiếp thị</li>
            <li>Phân tích các kênh và nguồn lưu lượng truy cập</li>
            <li>Hiểu hành vi người dùng để cải thiện Dịch vụ</li>
          </ul>
          <p className="text-sm mt-2"><strong>Dữ liệu được thu thập:</strong> Thông tin được thu thập thường được ẩn danh hóa
          và không nhận dạng cá nhân. Chúng tôi không liên kết dữ liệu phân tích với tài khoản cá nhân của bạn.</p>
          <p className="text-sm mt-1"><strong>Thời gian lưu trữ:</strong> Lên đến 24 tháng</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.4 Cookie Tiếp thị và Quảng cáo (Marketing Cookies)</h4>
          <p className="text-sm">Những cookie này được sử dụng để cung cấp quảng cáo phù hợp với sở thích của bạn và đo lường
          hiệu quả của các chiến dịch quảng cáo.</p>
          <p className="text-sm mt-2"><strong>Mục đích:</strong></p>
          <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
            <li>Hiển thị quảng cáo phù hợp với sở thích và hành vi của bạn</li>
            <li>Giới hạn số lần bạn xem một quảng cáo cụ thể</li>
            <li>Đo lường hiệu quả của chiến dịch quảng cáo</li>
            <li>Xây dựng hồ sơ về sở thích để cung cấp nội dung liên quan</li>
            <li>Theo dõi người dùng qua các trang web khác nhau</li>
            <li>Tùy chỉnh nội dung tiếp thị qua các kênh khác nhau</li>
          </ul>
          <p className="text-sm mt-2"><strong>Lưu ý:</strong> Cookie tiếp thị chỉ được sử dụng khi bạn đã đồng ý cho phép
          quảng cáo được cá nhân hóa. Bạn có thể rút lại đồng ý này bất cứ lúc nào.</p>
          <p className="text-sm mt-1"><strong>Thời gian lưu trữ:</strong> Lên đến 12 tháng</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">3.5 Cookie Bên Thứ Ba (Third-Party Cookies)</h4>
          <p className="text-sm">Các dịch vụ bên thứ ba mà chúng tôi tích hợp có thể đặt cookie riêng trên thiết bị của bạn
          để cung cấp và cải thiện các tính năng của họ.</p>
          
          <p className="text-sm mt-2"><strong>Ví dụ về Nhà cung cấp và Mục đích:</strong></p>
          <div className="overflow-x-auto mt-2">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Nhà cung cấp</th>
                  <th className="border p-2 text-left">Mục đích</th>
                  <th className="border p-2 text-left">Chính sách</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Google Analytics</td>
                  <td className="border p-2">Phân tích lưu lượng truy cập</td>
                  <td className="border p-2">privacy.google.com</td>
                </tr>
                <tr>
                  <td className="border p-2">Cloudflare</td>
                  <td className="border p-2">Bảo mật và CDN</td>
                  <td className="border p-2">cloudflare.com/privacy</td>
                </tr>
                <tr>
                  <td className="border p-2">Stripe / PayPal</td>
                  <td className="border p-2">Xử lý thanh toán</td>
                  <td className="border p-2">stripe.com/privacy</td>
                </tr>
                <tr>
                  <td className="border p-2">OpenAI / Groq</td>
                  <td className="border p-2">Dịch vụ AI</td>
                  <td className="border p-2">openai.com/policies</td>
                </tr>
                <tr>
                  <td className="border p-2">Intercom / Zendesk</td>
                  <td className="border p-2">Hỗ trợ khách hàng</td>
                  <td className="border p-2">intercom.com/privacy</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="text-sm mt-2"><strong>Lưu ý quan trọng:</strong> Chúng tôi không kiểm soát các cookie được đặt bởi
          các nhà cung cấp bên thứ ba này. Chúng tôi khuyến khích bạn xem xét chính sách bảo mật của họ để hiểu rõ cách
          họ sử dụng cookie và các công nghệ theo dõi khác.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        4. MỤC ĐÍCH SỬ DỤNG COOKIE
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự cho nhiều mục đích hợp pháp và cần thiết:</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">4.1 Vận hành và Bảo mật</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Xác thực danh tính người dùng</li>
              <li>Duy trì trạng thái đăng nhập an toàn</li>
              <li>Ngăn chặn truy cập trái phép tài khoản</li>
              <li>Phát hiện và ngăn chặn gian lận</li>
              <li>Bảo vệ chống lại các cuộc tấn công mạng</li>
              <li>Đảm bảo hoạt động ổn định của Dịch vụ</li>
              <li>Cân bằng tải máy chủ</li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">4.2 Trải nghiệm Cá nhân hóa</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Ghi nhớ tùy chọn ngôn ngữ và khu vực</li>
              <li>Lưu cài đặt giao diện người dùng</li>
              <li>Tùy chỉnh nội dung và gợi ý</li>
              <li>Duy trì lịch sử hoạt động</li>
              <li>Lưu các mục yêu thích và ghi chú</li>
              <li>Cung cấp tính năng "gợi ý cho bạn"</li>
              <li>Tối ưu hóa trải nghiệm người dùng</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">4.3 Phân tích và Cải thiện</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Hiểu cách người dùng sử dụng Dịch vụ</li>
              <li>Đo lường hiệu suất và tốc độ tải trang</li>
              <li>Xác định các vấn đề kỹ thuật</li>
              <li>Phân tích xu hướng và sở thích người dùng</li>
              <li>Đánh giá hiệu quả của các tính năng mới</li>
              <li>Tối ưu hóa nội dung và thiết kế</li>
              <li>Cải thiện chiến lược tiếp thị</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">4.4 Tiếp thị và Quảng cáo</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Hiển thị quảng cáo phù hợp với sở thích</li>
              <li>Đo lường hiệu quả chiến dịch quảng cáo</li>
              <li>Hạn chế tần suất hiển thị quảng cáo</li>
              <li>Tùy chỉnh nội dung tiếp thị</li>
              <li>Theo dõi chuyển đổi từ quảng cáo</li>
              <li>Tạo đối tượng mục tiêu ẩn danh</li>
              <li>Ngăn chặn hiển thị quảng cáo lặp lại</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        5. QUẢN LÝ VÀ KIỂM SOÁT COOKIE
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Bạn có quyền quyết định việc sử dụng cookie trên thiết bị của mình. Dưới đây là các cách để bạn quản lý
        và kiểm soát cookie:</p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">5.1 Cài đặt Cookie trên Dịch vụ</h4>
            <p className="text-sm">Khi bạn truy cập Dịch vụ lần đầu tiên, chúng tôi sẽ hiển thị banner cookie cho phép bạn:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Chấp nhận tất cả cookie</li>
              <li>Từ chối tất cả cookie không thiết yếu</li>
              <li>Tùy chỉnh từng loại cookie</li>
              <li>Đóng banner mà không chấp nhận (chỉ cookie thiết yếu được bật)</li>
            </ul>
            <p className="text-sm mt-2">Bạn có thể thay đổi tùy chọn cookie bất cứ lúc nào thông qua liên kết "Cài đặt Cookie"
            trong footer của website hoặc trong phần cài đặt tài khoản.</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">5.2 Cài đặt Trình duyệt Web</h4>
            <p className="text-sm">Hầu hết các trình duyệt web cho phép bạn quản lý cookie thông qua cài đặt trình duyệt.
            Dưới đây là hướng dẫn cho các trình duyệt phổ biến:</p>
            
            <div className="mt-2 space-y-2">
              <div className="border p-3 rounded">
                <p className="font-medium text-[var(--c-text)]">Google Chrome</p>
                <p className="text-sm">Settings → Privacy and Security → Cookies and other site data</p>
              </div>
              <div className="border p-3 rounded">
                <p className="font-medium text-[var(--c-text)]">Mozilla Firefox</p>
                <p className="text-sm">Settings → Privacy & Security → Cookies and Site Data</p>
              </div>
              <div className="border p-3 rounded">
                <p className="font-medium text-[var(--c-text)]">Safari (macOS/iOS)</p>
                <p className="text-sm">Preferences → Privacy → Cookies and website data</p>
              </div>
              <div className="border p-3 rounded">
                <p className="font-medium text-[var(--c-text)]">Microsoft Edge</p>
                <p className="text-sm">Settings → Cookies and site permissions → Manage and delete cookies</p>
              </div>
            </div>
            
            <p className="text-sm mt-2"><strong>Các tùy chọn trong cài đặt trình duyệt thường bao gồm:</strong></p>
            <ul className="list-disc pl-6 mt-1 space-y-1 text-sm">
              <li>Chặn tất cả cookie</li>
              <li>Chỉ chấp nhận cookie từ các trang web bạn truy cập</li>
              <li>Xóa cookie khi đóng trình duyệt</li>
              <li>Chặn cookie của bên thứ ba</li>
              <li>Yêu cầu trang web không theo dõi bạn (Do Not Track)</li>
            </ul>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">5.3 Công cụ Chặn Theo dõi Bên thứ ba</h4>
            <p className="text-sm">Bạn có thể cài đặt các tiện ích mở rộng trình duyệt để chặn theo dõi và quản lý cookie:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Privacy Badger (EFF)</li>
              <li>uBlock Origin</li>
              <li>Ghostery</li>
              <li>Disconnect</li>
            </ul>
            <p className="text-sm mt-2"><strong>Lưu ý:</strong> Việc sử dụng các công cụ này có thể ảnh hưởng đến chức năng
            của Dịch vụ vì một số tính năng cần cookie để hoạt động.</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-[var(--c-text)] mb-2">5.4 Quản lý trên Thiết bị Di động</h4>
            <p className="text-sm">Đối với ứng dụng di động, bạn có thể quản lý cài đặt cookie và theo dõi thông qua:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li><strong>iOS:</strong> Settings → Privacy → Tracking</li>
              <li><strong>Android:</strong> Settings → Google → Ads → Delete advertising ID</li>
              <li>Đặt lại ID quảng cáo trong cài đặt thiết bị</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg mt-4">
          <h4 className="font-semibold text-[var(--c-text)] mb-2">5.5 Hậu quả của việc Tắt Cookie</h4>
          <p className="text-sm"><strong>Lưu ý quan trọng:</strong> Việc tắt hoặc chặn cookie có thể gây ra các hậu quả sau:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
            <li>Không thể đăng nhập hoặc duy trì trạng thái đăng nhập</li>
            <li>Mất các tùy chọn và cài đặt đã lưu</li>
            <li>Trải nghiệm người dùng kém cá nhân hóa hơn</li>
            <li>Một số tính năng có thể không hoạt động đúng cách</li>
            <li>Trang web có thể tải chậm hơn</li>
            <li>Không thể lưu các mục yêu thích hoặc ghi chú</li>
          </ul>
          <p className="text-sm mt-2"><strong>Cookie Thiết yếu</strong> không thể bị tắt vì chúng cần thiết cho hoạt động
          cơ bản của Dịch vụ.</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        6. THỜI GIAN LƯU TRỮ COOKIE
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Thời gian lưu trữ cookie phụ thuộc vào loại cookie và mục đích sử dụng:</p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Loại Cookie</th>
                <th className="border p-2 text-left">Thời gian Lưu trữ Điển hình</th>
                <th className="border p-2 text-left">Ví dụ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Cookie Phiên (Session)</td>
                <td className="border p-2">Đến khi đóng trình duyệt</td>
                <td className="border p-2">Session ID, trạng thái đăng nhập</td>
              </tr>
              <tr>
                <td className="border p-2">Cookie Ngắn hạn</td>
                <td className="border p-2">Vài phút đến vài giờ</td>
                <td className="border p-2">Giỏ hàng tạm thời, mã phiên</td>
              </tr>
              <tr>
                <td className="border p-2">Cookie Trung bình</td>
                <td className="border p-2">1 ngày đến 1 tháng</td>
                <td className="border p-2">Tùy chọn ngôn ngữ, cài đặt giao diện</td>
              </tr>
              <tr>
                <td className="border p-2">Cookie Dài hạn</td>
                <td className="border p-2">6 tháng đến 2 năm</td>
                <td className="border p-2">"Ghi nhớ đăng nhập", sở thích người dùng</td>
              </tr>
              <tr>
                <td className="border p-2">Cookie Vĩnh cửu</td>
                <td className="border p-2">Cho đến khi người dùng xóa thủ công</td>
                <td className="border p-2">ID theo dõi, hồ sơ sở thích</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mt-4">Bạn có thể xóa cookie thủ công thông qua cài đặt trình duyệt hoặc sử dụng tính năng
        "Xóa dữ liệu trình duyệt" của trình duyệt. Thời gian cụ thể mà mỗi cookie được lưu trữ được ghi trong
        siêu dữ liệu của cookie đó.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        7. DO NOT TRACK (DNT)
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>7.1 Tín hiệu DNT là gì?</strong> "Do Not Track" (DNT) là một cài đặt trình duyệt cho phép bạn
        yêu cầu các trang web không theo dõi hoạt động của bạn trên các trang web khác nhau.</p>
        
        <p><strong>7.2 Cách chúng tôi xử lý DNT:</strong> Hiện tại, không có tiêu chuẩn ngành thống nhất về cách các
        trình duyệt và dịch vụ web nên phản hồi với tín hiệu DNT. Do đó, chúng tôi không tự động phản hồi với tín
        hiệu DNT từ trình duyệt của bạn.</p>
        
        <p><strong>7.3 Cách quản lý theo dõi thay thế:</strong> Thay vì dựa vào tín hiệu DNT, bạn có thể:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Sử dụng các tùy chọn cookie trên Dịch vụ của chúng tôi để tắt cookie phân tích và tiếp thị</li>
          <li>Cài đặt các tiện ích mở rộng chặn theo dõi như Privacy Badger hoặc uBlock Origin</li>
          <li>Sử dụng chế độ ẩn danh/incognito trong trình duyệt</li>
          <li>Thường xuyên xóa cookie và dữ liệu trình duyệt</li>
        </ul>
        
        <p className="mt-4 bg-yellow-50 p-3 rounded">Chúng tôi khuyến khích bạn sử dụng các công cụ và cài đặt được mô tả
        trong phần "Quản lý và Kiểm soát Cookie" để quản lý quyền riêng tư của mình một cách hiệu quả hơn.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        8. COOKIE VÀ QUYỀN RIÊNG TƯ CỦA TRẺ EM
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p>Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi mà không có sự đồng ý của cha mẹ hoặc người giám hộ.
        Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 16 tuổi thông qua cookie hoặc các phương thức khác.</p>
        
        <p>Nếu bạn là cha mẹ hoặc người giám hộ và tin rằng con bạn đã cung cấp thông tin cá nhân cho chúng tôi mà không
        có sự đồng ý của bạn, vui lòng liên hệ với chúng tôi ngay lập tức để chúng tôi có thể xóa thông tin đó.</p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[var(--c-text)] border-b pb-2">
        9. CẬP NHẬT CHÍNH SÁCH COOKIE
      </h3>
      <div className="space-y-4 text-[var(--c-text-muted)]">
        <p><strong>9.1 Thay đổi Chính sách:</strong> Chúng tôi có thể cập nhật Chính sách Cookie này để phản ánh các
        thay đổi trong cách chúng tôi sử dụng cookie, các công nghệ mới, yêu cầu pháp lý hoặc thực tiễn kinh doanh.</p>
        
        <p><strong>9.2 Thông báo về Thay đổi:</strong> Khi có thay đổi trọng yếu, chúng tôi sẽ:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Đăng tải Chính sách mới trên trang web với ngày cập nhật rõ ràng</li>
          <li>Thông báo qua banner cookie khi bạn truy cập Dịch vụ lần tiếp theo</li>
          <li>Gửi email thông báo cho người dùng đã đăng ký về các thay đổi quan trọng</li>
        </ul>
        
        <p><strong>9.3 Khuyến nghị:</strong> Chúng tôi khuyến nghị bạn xem xét Chính sách Cookie này định kỳ để cập
        nhật thông tin về cách chúng tôi sử dụng cookie và các công nghệ theo dõi khác một cách có trách nhiệm.</p>
        
        <div className="bg-blue-50 p-4 rounded-lg mt-4">
          <p className="font-medium text-[var(--c-text)] mb-2">Về Chúng tôi</p>
          <p className="text-sm">Sản phẩm và dịch vụ này là của <strong>Team LLMagik</strong> thực hiện trong <strong>CUỘC THI AI YOUNG GURU</strong>.</p>
          <p className="text-sm mt-2">
            <strong>Email liên hệ:</strong> team.llmagik@aiyoungguru.com
          </p>
        </div>
      </div>
    </section>
  </div>
);
