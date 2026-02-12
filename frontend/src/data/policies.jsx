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
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        1. GIỚI THIỆU VÀ PHẠM VI ÁP DỤNG
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0] leading-relaxed">
        <p>
          <strong className="text-[#1a1a2e] dark:text-[#e8e8e8]">AI Young Guru</strong>{" "}
          ("Công ty", "Chúng tôi", "Tổ chức của chúng tôi") cam kết tuân thủ nghiêm ngặt
          các nguyên tắc bảo vệ dữ liệu cá nhân và quyền riêng tư của người dùng. Chính sách Bảo vệ Dữ liệu Cá nhân
          này được xây dựng nhằm đảm bảo tính minh bạch, trách nhiệm giải trình và quyền lợi chính đáng của tất cả
          các bên liên quan.
        </p>
        <p>
          Chính sách này mô tả chi tiết các loại dữ liệu cá nhân mà chúng tôi thu thập, mục đích và cơ sở pháp lý
          cho việc xử lý, cách thức lưu trữ và bảo vệ, quyền của chủ thể dữ liệu, cũng như các biện pháp chúng tôi
          áp dụng để đảm bảo an toàn thông tin.
        </p>
        <div className="bg-[#f0f4f8] dark:bg-[#2a2a3e] p-4 rounded-lg border-l-4 border-[#3b82f6] my-4">
          <p className="font-medium text-[#1a1a2e] dark:text-[#e8e8e8]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
          <p className="text-sm mt-1 text-[#4a4a5a] dark:text-[#9090a0]">Lần cập nhật gần nhất: Tháng 02 năm 2026</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        2. ĐỊNH NGHĨA VÀ THUẬT NGỮ CHUYÊN MÔN
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>Để đảm bảo tính nhất quán và rõ ràng trong việc diễn giải, các thuật ngữ sau được định nghĩa cụ thể:</p>
        
        <div className="grid gap-4">
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Dữ liệu Cá nhân (Personal Data):</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Bất kỳ thông tin nào có thể được sử dụng đơn lẻ hoặc kết hợp với các thông tin khác
              để nhận diện, xác định hoặc liên hệ với một cá nhân cụ thể, bao gồm nhưng không giới hạn ở: họ và tên,
              địa chỉ email, số điện thoại, địa chỉ IP, thông tin thiết bị, dữ liệu định vị địa lý, và các thông tin
              khác thuộc phạm vi bảo vệ theo quy định pháp luật.
            </p>
          </div>
          
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Xử lý Dữ liệu (Data Processing):</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Bất kỳ hoạt động hoặc tập hợp hoạt động nào được thực hiện trên dữ liệu cá nhân,
              bao gồm nhưng không giới hạn ở: thu thập, ghi nhận, tổ chức, cấu trúc, lưu trữ, điều chỉnh, truy xuất,
              sử dụng, tiết lộ, phổ biến, đối chiếu, kết hợp, hạn chế, xóa hoặc hủy dữ liệu.
            </p>
          </div>
          
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Chủ thể Dữ liệu (Data Subject):</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Cá nhân được xác định hoặc có thể được xác định thông qua dữ liệu cá nhân.
              Trong ngữ cảnh của dịch vụ của chúng tôi, đây là người dùng truy cập, đăng ký hoặc sử dụng các sản phẩm
              và dịch vụ của AI Young Guru.
            </p>
          </div>
          
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Bên Kiểm soát Dữ liệu (Data Controller):</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Tổ chức hoặc cá nhân đưa ra quyết định về mục đích và phương thức xử lý dữ liệu cá nhân.
              Trong trường hợp này, AI Young Guru đóng vai trò là Bên Kiểm soát Dữ liệu đối với thông tin của người dùng.
            </p>
          </div>
          
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Bên Xử lý Dữ liệu (Data Processor):</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Tổ chức hoặc cá nhân thực hiện việc xử lý dữ liệu thay mặt cho Bên Kiểm soát Dữ liệu,
              theo hợp đồng hoặc thỏa thuận được thiết lập. Các nhà cung cấp dịch vụ hosting, cloud computing và xử lý
              thanh toán thường đóng vai trò này.
            </p>
          </div>
          
          <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
            <p className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8]">Cookie và Công nghệ Theo dõi:</p>
            <p className="text-sm mt-2 text-[#4a4a5a] dark:text-[#a0a0b0]">
              Các tệp văn bản nhỏ hoặc pixel hình ảnh được lưu trữ trên thiết bị của người dùng,
              cho phép ghi nhớ sở thích, theo dõi hành vi sử dụng và cung cấp trải nghiệm cá nhân hóa.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        3. PHẠM VI DỮ LIỆU CHÚNG TÔI THU THẬP
      </h3>
      <div className="space-y-6 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>Chúng tôi thu thập dữ liệu cá nhân từ nhiều nguồn khác nhau và theo nhiều phương thức. Dưới đây là phân loại
        chi tiết các loại dữ liệu:</p>
        
        <div className="space-y-4">
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">3.1 Dữ liệu Nhận dạng và Tài khoản</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">Thông tin cơ bản để tạo và quản lý tài khoản người dùng, bao gồm:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              <li>Họ và tên đầy đủ (theo thông tin người dùng cung cấp)</li>
              <li>Địa chỉ email cá nhân hoặc chuyên nghiệp</li>
              <li>Số điện thoại di động (nếu người dùng cung cấp tùy chọn)</li>
              <li>Ảnh hồ sơ hoặc hình đại diện (avatar)</li>
              <li>Tên đăng nhập và mật khẩu đã được mã hóa</li>
              <li>Thông tin từ tài khoản mạng xã hội khi đăng nhập qua OAuth (Google, Facebook, LinkedIn)</li>
              <li>Thông tin xác thực hai yếu tố (2FA) nếu được kích hoạt</li>
            </ul>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">3.2 Dữ liệu Hồ sơ Chuyên môn và Nghề nghiệp</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">Thông tin chi tiết về nền tảng học vấn, kinh nghiệm làm việc và định hướng nghề nghiệp:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              <li>Trình độ học vấn, bằng cấp và chứng chỉ chuyên môn</li>
              <li>Lịch sử việc làm, công ty đã làm việc và vị trí đảm nhiệm</li>
              <li>Kỹ năng chuyên môn, công nghệ thành thạo và năng lực ngôn ngữ</li>
              <li>Mục tiêu nghề nghiệp, sở thích và định hướng phát triển</li>
              <li>CV, thư xin việc và các tài liệu ứng tuyển do người dùng tải lên</li>
              <li>Dự án, thành tựu và giải thưởng đã đạt được</li>
              <li>Chứng chỉ nghề nghiệp và khóa đào tạo đã hoàn thành</li>
            </ul>
          </div>
          
          <div className="bg-[#faf5ff] dark:bg-[#2a1a2a] p-4 rounded-lg border border-[#e9d5ff] dark:border-[#4a3a4a]">
            <h4 className="font-semibold text-[#6b21a8] dark:text-[#c0a0d0] mb-2">3.3 Dữ liệu Hội thoại và Nội dung Do người dùng Tạo ra</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">Mọi thông tin trao đổi giữa người dùng và hệ thống AI hoặc với các người dùng khác:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              <li>Lịch sử cuộc trò chuyện với AI career advisor</li>
              <li>Câu hỏi, phản hồi và đánh giá của người dùng</li>
              <li>Kết quả các bài kiểm tra, đánh giá năng lực và quiz</li>
              <li>Ghi chú cá nhân và mục yêu thích do người dùng lưu</li>
              <li>Bình luận, đánh giá và phản hồi về các ngành nghề được đề xuất</li>
            </ul>
          </div>
          
          <div className="bg-[#fffbeb] dark:bg-[#2a2a1a] p-4 rounded-lg border border-[#fde68a] dark:border-[#4a4a3a]">
            <h4 className="font-semibold text-[#92400e] dark:text-[#d0c090] mb-2">3.4 Dữ liệu Phân tích và Gợi ý Thông minh</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">Thông tin được hệ thống tạo ra hoặc tính toán dựa trên dữ liệu đầu vào:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              <li>Điểm số phù hợp (compatibility scores) với các ngành nghề</li>
              <li>Xếp hạng và đề xuất nghề nghiệp được cá nhân hóa</li>
              <li>Phân tích xu hướng và mẫu hành vi sử dụng</li>
              <li>Dự đoán và khuyến nghị dựa trên thuật toán ML/AI</li>
              <li>Lịch sử tìm kiếm và các từ khóa đã sử dụng</li>
              <li>Thời gian tương tác với từng tính năng và nội dung</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        4. MỤC ĐÍCH VÀ CƠ SỞ PHÁP LÝ
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>Chúng tôi thu thập và xử lý dữ liệu cá nhân dựa trên các cơ sở pháp lý sau:</p>
        
        <div className="grid gap-4">
          <div className="bg-[#fef2f2] dark:bg-[#2a1a1a] p-4 rounded-lg border border-[#fecaca] dark:border-[#4a3a3a]">
            <h4 className="font-semibold text-[#991b1b] dark:text-[#d0a0a0] mb-2">4.1 Sự đồng ý của chủ thể dữ liệu</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Chúng tôi xử lý dữ liệu khi người dùng đồng ý rõ ràng, cụ thể, được thông báo đầy đủ và tự nguyện.
              Người dùng có quyền rút lại sự đồng ý bất kỳ lúc nào thông qua cài đặt tài khoản hoặc liên hệ với chúng tôi.
            </p>
          </div>
          
          <div className="bg-[#fef2f2] dark:bg-[#2a1a1a] p-4 rounded-lg border border-[#fecaca] dark:border-[#4a3a3a]">
            <h4 className="font-semibold text-[#991b1b] dark:text-[#d0a0a0] mb-2">4.2 Thực hiện hợp đồng</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Xử lý dữ liệu cần thiết để thực hiện các điều khoản dịch vụ mà người dùng đã đồng ý,
              bao gồm cung cấp dịch vụ tư vấn nghề nghiệp, quản lý tài khoản và hỗ trợ khách hàng.
            </p>
          </div>
          
          <div className="bg-[#fef2f2] dark:bg-[#2a1a1a] p-4 rounded-lg border border-[#fecaca] dark:border-[#4a3a3a]">
            <h4 className="font-semibold text-[#991b1b] dark:text-[#d0a0a0] mb-2">4.3 Nghĩa vụ pháp lý</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Xử lý dữ liệu khi cần thiết để tuân thủ các nghĩa vụ pháp lý mà chúng tôi phải thực hiện,
              bao gồm quy định về thuế, chống rửa tiền và các yêu cầu từ cơ quan nhà nước có thẩm quyền.
            </p>
          </div>
          
          <div className="bg-[#fef2f2] dark:bg-[#2a1a1a] p-4 rounded-lg border border-[#fecaca] dark:border-[#4a3a3a]">
            <h4 className="font-semibold text-[#991b1b] dark:text-[#d0a0a0] mb-2">4.4 Lợi ích hợp pháp</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Xử lý dữ liệu dựa trên lợi ích hợp pháp của chúng tôi hoặc bên thứ ba, bao gồm:
              cải thiện dịch vụ, phát triển sản phẩm mới, ngăn ngừa gian lận và đảm bảo an ninh mạng.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        5. QUYỀN CỦA CHỦ THỂ DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>Người dùng có các quyền sau đây đối với dữ liệu cá nhân của mình, được thực hiện theo quy định của pháp luật:</p>
        
        <div className="grid gap-4">
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.1 Quyền được biết</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền được biết về việc dữ liệu cá nhân của mình có đang được xử lý hay không,
              và nếu có, có quyền truy cập vào dữ liệu đó cùng các thông tin liên quan.
            </p>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.2 Quyền yêu cầu chỉnh sửa</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền yêu cầu chỉnh sửa dữ liệu không chính xác hoặc không đầy đủ.
              Chúng tôi sẽ thực hiện chỉnh sửa trong thời hạn quy định.
            </p>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.3 Quyền xóa dữ liệu</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền yêu cầu xóa dữ liệu cá nhân của mình khi không còn cần thiết cho mục đích thu thập,
              khi rút lại sự đồng ý, hoặc khi dữ liệu đã được xử lý trái pháp luật.
            </p>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.4 Quyền hạn chế xử lý</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền yêu cầu hạn chế xử lý dữ liệu trong các trường hợp quy định,
              trong khi chờ xác minh, phản đối hoặc trong thời gian xem xét yêu cầu.
            </p>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.5 Quyền di chuyển dữ liệu</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền nhận dữ liệu cá nhân của mình theo định dạng có cấu trúc,
              được sử dụng phổ biến và có thể đọc được bằng máy.
            </p>
          </div>
          
          <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
            <h4 className="font-semibold text-[#166534] dark:text-[#90c090] mb-2">5.6 Quyền phản đối</h4>
            <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
              Người dùng có quyền phản đối việc xử lý dữ liệu cá nhân của mình dựa trên lợi ích hợp pháp
              hoặc cho mục đích tiếp thị trực tiếp.
            </p>
          </div>
        </div>
        
        <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
          <p className="text-sm text-[#4a4a5a] dark:text-[#a0a0b0]">
            <strong className="text-[#166534] dark:text-[#90c090]">Cách thực hiện quyền:</strong>{" "}
            Để thực hiện các quyền trên, vui lòng gửi yêu cầu qua email đến địa chỉ được nêu trong mục 13
            hoặc thông qua tính năng "Yêu cầu hỗ trợ" trong ứng dụng. Chúng tôi sẽ phản hồi trong vòng 30 ngày.
          </p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        6. BẢO MẬT VÀ AN NINH THÔNG TIN
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu cá nhân
          khỏi truy cập trái phép, mất mát, hư hỏng hoặc tiết lộ không được phép.
        </p>
        
        <div className="grid gap-4">
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">6.1 Biện pháp kỹ thuật</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Mã hóa dữ liệu trong truyền tải (TLS 1.3) và lưu trữ (AES-256)</li>
              <li>Xác thực đa yếu tố cho tài khoản quản trị</li>
              <li>Giám sát an ninh liên tục 24/7</li>
              <li>Sao lưu dữ liệu tự động hàng ngày</li>
              <li>Kiểm soát truy cập dựa trên vai trò (RBAC)</li>
              <li>Kiểm tra bảo mật định kỳ và đánh giá lỗ hổng</li>
            </ul>
          </div>
          
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">6.2 Biện pháp tổ chức</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Chính sách bảo mật thông tin được cập nhật định kỳ</li>
              <li>Đào tạo nhân viên về bảo mật dữ liệu</li>
              <li>Kiểm soát vật lý tại các trung tâm dữ liệu</li>
              <li>Quy trình xử lý sự cố bảo mật được thiết lập</li>
              <li>Thỏa thuận bảo mật với các bên thứ ba</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        7. CHIA SẺ DỮ LIỆU VỚI BÊN THỨ BA
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi không bán dữ liệu cá nhân của người dùng. Dữ liệu chỉ được chia sẻ trong các trường hợp sau:
        </p>
        
        <div className="grid gap-4">
          <div className="bg-[#faf5ff] dark:bg-[#2a1a2a] p-4 rounded-lg border border-[#e9d5ff] dark:border-[#4a3a4a]">
            <h4 className="font-semibold text-[#6b21a8] dark:text-[#c0a0d0] mb-2">7.1 Nhà cung cấp dịch vụ</h4>
            <p className="text-sm">
              Chúng tôi có thể chia sẻ dữ liệu với các nhà cung cấp dịch vụ bên thứ ba
              (hosting, phân tích, thanh toán) theo hợp đồng và chỉ trong phạm vi cần thiết để cung cấp dịch vụ.
            </p>
          </div>
          
          <div className="bg-[#faf5ff] dark:bg-[#2a1a2a] p-4 rounded-lg border border-[#e9d5ff] dark:border-[#4a3a4a]">
            <h4 className="font-semibold text-[#6b21a8] dark:text-[#c0a0d0] mb-2">7.2 Yêu cầu pháp lý</h4>
            <p className="text-sm">
              Chúng tôi có thể chia sẻ dữ liệu khi được yêu cầu bởi cơ quan nhà nước có thẩm quyền,
              theo quy định pháp luật, hoặc để bảo vệ quyền và lợi ích hợp pháp của chúng tôi.
            </p>
          </div>
          
          <div className="bg-[#faf5ff] dark:bg-[#2a1a2a] p-4 rounded-lg border border-[#e9d5ff] dark:border-[#4a3a4a]">
            <h4 className="font-semibold text-[#6b21a8] dark:text-[#c0a0d0] mb-2">7.3 Chuyển giao doanh nghiệp</h4>
            <p className="text-sm">
              Trong trường hợp sáp nhập, mua lại hoặc bán tài sản, dữ liệu cá nhân có thể được chuyển giao
              như một phần của tài sản doanh nghiệp, với thông báo phù hợp cho người dùng.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        8. CHÍNH SÁCH COOKIE VÀ CÔNG NGHỆ THEO DÕI
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi sử dụng cookie và các công nghệ theo dõi tương tự để cải thiện trải nghiệm người dùng
          và phân tích hiệu suất trang web.
        </p>
        
        <div className="grid gap-4">
          <div className="bg-[#fffbeb] dark:bg-[#2a2a1a] p-4 rounded-lg border border-[#fde68a] dark:border-[#4a4a3a]">
            <h4 className="font-semibold text-[#92400e] dark:text-[#d0c090] mb-2">8.1 Loại Cookie chúng tôi sử dụng</h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>Cookie cần thiết:</strong> Hoạt động cơ bản của trang web (xác thực, giỏ hàng, tùy chọn)</li>
              <li><strong>Cookie hiệu suất:</strong> Thu thập thông tin về cách người dùng sử dụng trang web</li>
              <li><strong>Cookie chức năng:</strong> Ghi nhớ tùy chọn và cài đặt của người dùng</li>
              <li><strong>Cookie tiếp thị:</strong> Theo dõi hành vi duyệt web để cá nhân hóa quảng cáo</li>
            </ul>
          </div>
          
          <div className="bg-[#fffbeb] dark:bg-[#2a2a1a] p-4 rounded-lg border border-[#fde68a] dark:border-[#4a4a3a]">
            <h4 className="font-semibold text-[#92400e] dark:text-[#d0c090] mb-2">8.2 Quản lý Cookie</h4>
            <p className="text-sm">
              Người dùng có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt.
              Lưu ý rằng việc vô hiệu hóa một số cookie có thể ảnh hưởng đến chức năng của trang web.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        9. LƯU TRỮ VÀ XÓA DỮ LIỆU
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi chỉ lưu trữ dữ liệu cá nhân trong thời gian cần thiết cho các mục đích đã nêu trong chính sách này,
          trừ khi pháp luật yêu cầu hoặc cho phép lưu trữ lâu hơn.
        </p>
        
        <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
          <p className="text-sm">
            <strong className="text-[#166534] dark:text-[#90c090]">Thời gian lưu trữ:</strong>{" "}
            Dữ liệu tài khoản được lưu trữ trong suốt thời gian tài khoản hoạt động và xóa trong vòng 90 ngày
            sau khi tài khoản bị hủy. Dữ liệu hội thoại được lưu trữ tối đa 2 năm.
          </p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        10. QUYỀN TRẺ EM
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Dịch vụ của chúng tôi không hướng đến trẻ em dưới 16 tuổi. Chúng tôi không cố ý thu thập
          dữ liệu cá nhân từ trẻ em. Nếu phát hiện đã thu thập dữ liệu từ trẻ em, chúng tôi sẽ xóa ngay lập tức.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        11. THAY ĐỔI CHÍNH SÁCH
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi có thể cập nhật Chính sách Bảo vệ Dữ liệu Cá nhân này để phản ánh thay đổi trong thực tiễn
          bảo mật hoặc pháp lý. Chúng tôi sẽ thông báo cho người dùng về các thay đổi quan trọng thông qua email
          hoặc thông báo trên ứng dụng trước khi thay đổi có hiệu lực.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        12. LIÊN HỆ
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Nếu có bất kỳ câu hỏi hoặc quan ngại nào về Chính sách Bảo vệ Dữ liệu Cá nhân này hoặc cách chúng tôi
          xử lý dữ liệu cá nhân, vui lòng liên hệ:
        </p>
        
        <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
          <p className="text-sm">
            <strong className="text-[#1a1a2e] dark:text-[#e8e8e8]">Team LLMagik</strong><br />
          </p>
        </div>
      </div>
    </section>
  </div>
);

/**
 * ====================================================================
 * ĐIỀU KHOẢN DỊCH VỤ (TERMS OF SERVICE)
 * ====================================================================
 */
export const termsOfServiceContent = (
  <div className="space-y-8">
    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        1. CHẤP NHẬN ĐIỀU KHOẢN
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Bằng việc truy cập và sử dụng dịch vụ của <strong className="text-[#1a1a2e] dark:text-[#e8e8e8]">AI Young Guru</strong>,
          bạn đồng ý bị ràng buộc bởi các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ điều khoản nào,
          vui lòng không sử dụng dịch vụ của chúng tôi.
        </p>
        <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
          <p className="font-medium text-[#166534] dark:text-[#90c090]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        2. MÔ TẢ DỊCH VỤ
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          AI Young Guru là nền tảng tư vấn nghề nghiệp sử dụng trí tuệ nhân tạo để:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Đánh giá sở thích, kỹ năng và định hướng nghề nghiệp của người dùng</li>
          <li>Đề xuất các ngành nghề phù hợp dựa trên phân tích dữ liệu</li>
          <li>Cung cấp thông tin về yêu cầu, cơ hội việc làm và định hướng học tập</li>
          <li>Hỗ trợ người dùng trong quá trình ra quyết định nghề nghiệp</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        3. TÀI KHOẢN NGƯỜI DÙNG
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Để sử dụng đầy đủ các tính năng của dịch vụ, bạn cần tạo một tài khoản. Bạn chịu trách nhiệm:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Cung cấp thông tin chính xác và đầy đủ khi đăng ký</li>
          <li>Duy trì bảo mật thông tin đăng nhập</li>
          <li>Thông báo ngay cho chúng tôi về bất kỳ vi phạm bảo mật nào</li>
          <li>Chịu mọi hoạt động diễn ra dưới tài khoản của bạn</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        4. SỬ DỤNG DỊCH VỤ
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Không sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp nào</li>
          <li>Không can thiệp hoặc cố gắng can thiệp vào hoạt động của dịch vụ</li>
          <li>Không sao chép, sửa đổi hoặc phân phối nội dung của dịch vụ mà không có sự đồng ý</li>
          <li>Không sử dụng robot, spider hoặc các phương tiện tự động khác để truy cập dịch vụ</li>
          <li>Không tạo nhiều tài khoản cho mục đích gian lận</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        5. NỘI DUNG DO NGƯỜI DÙNG TẠO
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Bạn giữ quyền sở hữu đối với nội dung bạn tạo ra trên nền tảng. Tuy nhiên, khi đăng tải nội dung,
          bạn cấp cho chúng tôi giấy phép không độc quyền, có thể chuyển nhượng, có thể cấp phép lại,
          miễn phí, vĩnh viễn để sử dụng, sao chép, sửa đổi, hiển thị và phân phối nội dung đó.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        6. TUYÊN BỐ TỪ CHỐI
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <div className="bg-[#fef2f2] dark:bg-[#2a1a1a] p-4 rounded-lg border border-[#fecaca] dark:border-[#4a3a3a]">
          <p className="text-sm">
            <strong className="text-[#991b1b] dark:text-[#d0a0a0]">Lưu ý quan trọng:</strong>{" "}
            Dịch vụ tư vấn nghề nghiệp của chúng tôi chỉ mang tính chất tham khảo.
            Các đề xuất nghề nghiệp được tạo ra dựa trên thuật toán và không đảm bảo chính xác 100%.
            Người dùng nên tự xem xét và đưa ra quyết định cuối cùng.
          </p>
        </div>
        <p>
          DỊCH VỤ ĐƯỢC CUNG CẤP "NHƯ NÓ ĐANG LÀ" VÀ "NHƯ CÓ SẴN". CHÚNG TÔI TỪ CHỐI MỌI BẢO ĐẢM,
          RÕ RÀNG HOẶC NGỤ Ý, BAO GỒM NHƯNG KHÔNG GIỚI HẠN Ở BẢO ĐẢM VỀ PHÙ HỢP CHO MỘT MỤC ĐÍCH CỤ THỂ,
          KHÔNG VI PHẠM VÀ TUYỆT ĐỐI AN TOÀN.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        7. GIỚI HẠN TRÁCH NHIỆM
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          TRONG PHẠM VI TỐI ĐA ĐƯỢC PHÁP LUẬT CHO PHÉP, CHÚNG TÔI SẼ KHÔNG CHỊU TRÁCH NHIỆM
          CHO BẤT KỲ THIỆT HẠI GIÁN TIẾP, NGẪU NHIÊN, ĐẶC BIỆT, HỆ QUẢ HOẶC TRỪNG PHẠT NÀO
          PHÁT SINH TỪ HOẶC LIÊN QUAN ĐẾN VIỆC SỬ DỤNG DỊCH VỤ.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        8. CHẤM DỨT
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi có thể chấm dứt hoặc đình chỉ quyền truy cập của bạn vào dịch vụ ngay lập tức,
          không cần thông báo trước, nếu bạn vi phạm Điều khoản Dịch vụ này.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        9. LUẬT ÁP DỤNG
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Điều khoản Dịch vụ này được điều chỉnh bởi pháp luật của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam.
          Mọi tranh chấp phát sinh từ việc sử dụng dịch vụ sẽ được giải quyết tại tòa án có thẩm quyền
          của Việt Nam.
        </p>
      </div>
    </section>
  </div>
);

/**
 * ====================================================================
 * CHÍNH SÁCH COOKIE (COOKIE POLICY)
 * ====================================================================
 */
export const cookiePolicyContent = (
  <div className="space-y-8">
    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        1. COOKIE LÀ GÌ?
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Cookie là các tệp văn bản nhỏ được lưu trữ trên thiết bị của bạn khi bạn truy cập trang web.
          Chúng giúp trang web hoạt động hiệu quả hơn và cung cấp thông tin cho chủ sở hữu trang web.
        </p>
        <div className="bg-[#f0fdf4] dark:bg-[#1a2a1a] p-4 rounded-lg border border-[#bbf7d0] dark:border-[#3a4a3a]">
          <p className="font-medium text-[#166534] dark:text-[#90c090]">Phiên bản hiện có hiệu lực: 11/02/2026</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        2. LOẠI COOKIE CHÚNG TÔI SỬ DỤNG
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <div className="grid gap-4">
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">2.1 Cookie cần thiết</h4>
            <p className="text-sm">
              Những cookie này rất quan trọng để trang web hoạt động đúng cách. Chúng cho phép
              các chức năng cơ bản như đăng nhập, giỏ hàng và tùy chọn ngôn ngữ.
              Bạn không thể tắt những cookie này.
            </p>
          </div>
          
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">2.2 Cookie hiệu suất</h4>
            <p className="text-sm">
              Những cookie này giúp chúng tôi hiểu cách khách truy cập sử dụng trang web,
              như trang nào được xem nhiều nhất và có lỗi xảy ra không. Thông tin này
              giúp cải thiện chất lượng dịch vụ.
            </p>
          </div>
          
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">2.3 Cookie chức năng</h4>
            <p className="text-sm">
              Những cookie cho phép trang web ghi nhớ các lựa chọn của bạn (như tên đăng nhập,
              ngôn ngữ và khu vực) và cung cấp các tính năng cá nhân hóa nâng cao.
            </p>
          </div>
          
          <div className="bg-[#eff6ff] dark:bg-[#1e2a3a] p-4 rounded-lg border border-[#bfdbfe] dark:border-[#3a4a5a]">
            <h4 className="font-semibold text-[#1e3a5f] dark:text-[#a0c0e0] mb-2">2.4 Cookie tiếp thị</h4>
            <p className="text-sm">
              Những cookie được sử dụng để theo dõi hành vi duyệt web của bạn để cá nhân hóa
              quảng cáo và nội dung tiếp thị phù hợp với sở thích của bạn.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        3. QUẢN LÝ COOKIE
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Bạn có thể quản lý hoặc xóa cookie thông qua cài đặt trình duyệt của mình.
          Dưới đây là hướng dẫn cho các trình duyệt phổ biến:
        </p>
        
        <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
          <h4 className="font-semibold text-[#1a1a2e] dark:text-[#e8e8e8] mb-3">Hướng dẫn quản lý Cookie:</h4>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies → Manage</li>
            <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies → Manage</li>
            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
            <li><strong>Edge:</strong> Settings → Cookies and Site Permissions → Manage</li>
          </ul>
        </div>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        4. TÁC ĐỘNG CỦA VIỆC TẮT COOKIE
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Nếu bạn tắt hoặc xóa tất cả cookie, một số chức năng của trang web có thể không hoạt động đúng:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Không thể đăng nhập hoặc duy trì trạng thái đăng nhập</li>
          <li>Tùy chọn ngôn ngữ và giao diện không được lưu</li>
          <li>Trải nghiệm cá nhân hóa bị ảnh hưởng</li>
          <li>Một số trang có thể tải chậm hơn</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        5. CÔNG NGHỆ THEO DÕI KHÁC
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Ngoài cookie, chúng tôi cũng có thể sử dụng các công nghệ theo dõi khác:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Pixel tags:</strong> Hình ảnh nhỏ vô hình giúp phân tích hiệu quả chiến dịch</li>
          <li><strong>Local Storage:</strong> Lưu trữ dữ liệu cục bộ trên thiết bị của bạn</li>
          <li><strong>Fingerprinting:</strong> Thu thập thông tin thiết bị để nhận diện</li>
        </ul>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        6. THAY ĐỔI CHÍNH SÁCH
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Chúng tôi có thể cập nhật Chính sách Cookie này để phản ánh thay đổi trong thực tiễn
          kinh doanh hoặc pháp lý. Chúng tôi khuyến khích bạn xem lại chính sách này định kỳ.
        </p>
      </div>
    </section>

    <section>
      <h3 className="text-lg font-semibold mb-4 text-[#1a1a2e] dark:text-[#e8e8e8] border-b pb-2">
        7. LIÊN HỆ
      </h3>
      <div className="space-y-4 text-[#4a4a5a] dark:text-[#b0b0c0]">
        <p>
          Nếu có bất kỳ câu hỏi nào về Chính sách Cookie này, vui lòng liên hệ:
        </p>
        
        <div className="bg-[#f8fafc] dark:bg-[#1e1e30] p-4 rounded-lg border border-[#e2e8f0] dark:border-[#3a3a50]">
          <p className="text-sm">
            <strong className="text-[#1a1a2e] dark:text-[#e8e8e8]">Team LLMagik</strong>
          </p>
        </div>
      </div>
    </section>
  </div>
);

export default {
  privacyPolicyContent,
  termsOfServiceContent,
  cookiePolicyContent
};
