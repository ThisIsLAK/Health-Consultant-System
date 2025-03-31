package com.swp.user_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    /**
     * Gửi email xác thực đến người dùng với link xác thực.
     *
     * @param to              Địa chỉ email người nhận
     * @param verificationToken Token xác thực để tạo link
     * @throws MessagingException Nếu có lỗi khi gửi email
     */
    public void sendVerificationEmail(String to, String verificationToken) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Cấu hình thông tin cơ bản của email
        helper.setTo(to);
        helper.setFrom("tbinhduong0101@gmail.com"); // Thay bằng email của bạn
        helper.setSubject("Xác Thực Email Của Bạn - Health Consultant System");

        // Tạo link xác thực
        String verificationLink = "http://localhost:8080/identity/users/verify-email?token=" + verificationToken;

        // Nội dung HTML được định dạng đẹp và chuyên nghiệp
        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .button { display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #fff; text-decoration: none; border-radius: 5px; }
                    .footer { font-size: 12px; color: #777; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h3>Xin chào!</h3>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại Health Consultant System. Vui lòng xác thực email của bạn bằng cách nhấn vào nút bên dưới:</p>
                    <p><a href="%s" class="button">Xác Thực Email Ngay</a></p>
                    <p>Link này sẽ hết hạn sau <strong>24 giờ</strong>. Nếu bạn không thực hiện hành động này, bạn có thể yêu cầu một link xác thực mới.</p>
                    <p>Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
                    <div class="footer">
                        <p>Trân trọng,<br>Đội ngũ Health Consultant System</p>
                        <p>Email: tbinhduong0101@gmail.com</p>
                    </div>
                </div>
            </body>
            </html>
            """, verificationLink);

        // Đặt nội dung email dưới dạng HTML
        helper.setText(htmlContent, true);

        // Gửi email
        mailSender.send(message);
    }
}