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

    public void sendVerificationEmail(String to, String verificationToken) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(to);
        helper.setSubject("Xác thực email của bạn");
        String verificationLink = "http://localhost:8080/identity/users/verify-email?token=" + verificationToken;
        String htmlContent = String.format("""
            <h3>Vui lòng xác thực email của bạn</h3>
            <p>Nhấn vào link sau để xác thực: <a href="%s">Xác thực ngay</a></p>
            <p>Link này sẽ hết hạn sau 24 giờ.</p>
            """, verificationLink);

        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}