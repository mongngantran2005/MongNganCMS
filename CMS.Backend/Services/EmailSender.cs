using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace CMS.Backend.Services
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
    }

    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            var mailSettings = _configuration.GetSection("MailSettings");
            var host = mailSettings["Host"];
            var port = int.Parse(mailSettings["Port"] ?? "587");
            var mail = mailSettings["Mail"];
            var password = mailSettings["Password"];

            if (string.IsNullOrEmpty(host) || string.IsNullOrEmpty(mail))
            {
                // Bỏ qua nếu chưa cấu hình
                return;
            }

            using var client = new SmtpClient(host, port)
            {
                Credentials = new NetworkCredential(mail, password),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(mail, "MongNganCMS"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            await client.SendMailAsync(mailMessage);
        }
    }
}
