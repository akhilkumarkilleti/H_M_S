package com.example.potla_medicore_backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.sesv2.SesV2Client;
import software.amazon.awssdk.services.sesv2.model.Body;
import software.amazon.awssdk.services.sesv2.model.Content;
import software.amazon.awssdk.services.sesv2.model.Destination;
import software.amazon.awssdk.services.sesv2.model.EmailContent;
import software.amazon.awssdk.services.sesv2.model.Message;
import software.amazon.awssdk.services.sesv2.model.SendEmailRequest;

@Service
public class EmailService {

    private final SesV2Client sesClient;

    public EmailService(SesV2Client sesClient) {this.sesClient = sesClient;}

    @Value("${aws.ses.from-email}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public void sendSignupConfirmation(String recipientEmail, String name) {

        String subject = "Welcome to Potla MediCo";

        String htmlBody = """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">

                    <h2 style="color: #1976D2;">
                        Welcome to Potla MediCore, %s!
                    </h2>

                    <p>
                        Your patient account has been successfully registered.
                    </p>

                    <p>
                        You can now log in using your registered email address.
                    </p>

                    <br>

                    <p>
                        Thank you for registering with Potla MediCore.
                    </p>

                    <p>
                        Regards,<br>
                        <strong>Potla MediCore Team</strong>
                    </p>

                </body>
                </html>
                """.formatted(name);

        sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    public void sendStaffCredentials(String recipientEmail, String name, String role, String password) {

        String subject = "Your Potla MediCore Staff Account Credentials";
        String loginUrl = frontendUrl + "/admin/login";

        String htmlBody = """
                <!DOCTYPE html>
                <html>
                <body style="font-family: Arial, sans-serif;">

                    <h2 style="color: #1976D2;">
                        Welcome to Potla MediCore, %s!
                    </h2>

                    <p>
                        An employee account has been created for you by the hospital administrator.
                        Your login credentials are below:
                    </p>

                    <table style="border-collapse: collapse; margin: 16px 0;">
                        <tr>
                            <td style="padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Login Email</strong></td>
                            <td style="padding: 8px 16px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Password</strong></td>
                            <td style="padding: 8px 16px; border: 1px solid #ddd;">%s</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 16px; border: 1px solid #ddd; background: #f5f5f5;"><strong>Role</strong></td>
                            <td style="padding: 8px 16px; border: 1px solid #ddd;">%s</td>
                        </tr>
                    </table>

                    <p>
                        Login here: <a href="%s">%s</a>
                    </p>

                    <p style="color: #b26a00;">
                        For security, please change your password after your first login and do not share these credentials with anyone.
                    </p>

                    <br>

                    <p>
                        Regards,<br>
                        <strong>Potla MediCore Team</strong>
                    </p>

                </body>
                </html>
                """.formatted(name, recipientEmail, password, role, loginUrl, loginUrl);

        sendHtmlEmail(recipientEmail, subject, htmlBody);
    }

    private void sendHtmlEmail(String recipientEmail, String subject, String htmlBody) {
        Destination destination = Destination.builder()
                .toAddresses(recipientEmail)
                .build();

        Content subjectContent = Content.builder()
                .data(subject)
                .build();

        Content htmlContent = Content.builder()
                .data(htmlBody)
                .build();

        Body body = Body.builder()
                .html(htmlContent)
                .build();

        Message message = Message.builder()
                .subject(subjectContent)
                .body(body)
                .build();

        EmailContent emailContent = EmailContent.builder()
                .simple(message)
                .build();

        SendEmailRequest request = SendEmailRequest.builder()
                .fromEmailAddress(fromEmail)
                .destination(destination)
                .content(emailContent)
                .build();

        sesClient.sendEmail(request);
    }
}