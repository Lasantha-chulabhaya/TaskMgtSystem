package com.UserTask.UserTask.service.IMPL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.password-reset.base-url}")
    private String baseUrl;

    public void sendPasswordResetEmail(String toEmail, String userName, String resetToken) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Password Reset Request - Task Management System");

        String resetUrl = baseUrl + "/reset-password?token=" + resetToken;

        String htmlContent = buildPasswordResetEmailTemplate(userName, resetUrl);
        helper.setText(htmlContent, true);

        javaMailSender.send(mimeMessage);
    }

    private String buildPasswordResetEmailTemplate(String userName, String resetUrl) {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; }" +
                ".container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }" +
                ".header { background-color: #001529; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }" +
                ".header h1 { margin: 0; font-size: 24px; }" +
                ".content { line-height: 1.6; color: #333; }" +
                ".reset-button { display: inline-block; background-color: #1890ff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }" +
                ".reset-button:hover { background-color: #40a9ff; }" +
                ".footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }" +
                ".warning { background-color: #fff7e6; border: 1px solid #ffd591; padding: 15px; border-radius: 5px; margin: 20px 0; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h1>Task Management System</h1>" +
                "</div>" +
                "<div class='content'>" +
                "<h2>Password Reset Request</h2>" +
                "<p>Hello " + userName + ",</p>" +
                "<p>We received a request to reset your password for your Task Management System account.</p>" +
                "<p>Click the button below to reset your password:</p>" +
                "<p style='text-align: center;'>" +
                "<a href='" + resetUrl + "' class='reset-button'>Reset Password</a>" +
                "</p>" +
                "<div class='warning'>" +
                "<p><strong>Important:</strong></p>" +
                "<ul>" +
                "<li>This link will expire in 15 minutes for security reasons</li>" +
                "<li>If you didn't request this password reset, please ignore this email</li>" +
                "<li>For security, do not share this link with anyone</li>" +
                "</ul>" +
                "</div>" +
                "<p>If the button doesn't work, copy and paste this link into your browser:</p>" +
                "<p style='word-break: break-all; color: #1890ff;'>" + resetUrl + "</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>This is an automated message, please do not reply to this email.</p>" +
                "<p>© 2024 Task Management System. All rights reserved.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

}
