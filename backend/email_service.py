# backend/email_service.py
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from config import settings

# --- Brevo Configuration ---
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key["api-key"] = settings.BREVO_API_KEY

# Create an instance of the API class
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(
    sib_api_v3_sdk.ApiClient(configuration)
)


async def send_password_reset_email(email_to: str, token: str):
    """
    Sends a password reset email using the Brevo API.
    """
    # Define the reset link and the HTML content of the email
    reset_link = f"{settings.FRONTEND_URL}/reset-password/{token}"

    html_content = f"""
    <html><body>
        <h1>Cognis Password Reset</h1>
        <p>Hi,</p>
        <p>You requested a password reset for your Cognis account.</p>
        <p>Please click the button below to set a new password. This link will expire in 1 hour.</p>
        <a 
            href="{reset_link}" 
            style="background-color: #4ECDC4; color: #0A0F14; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;"
        >
            Reset Your Password
        </a>
        <p style="margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
    </body></html>
    """

    # --- Create the email object ---
    subject = "Cognis - Password Reset Request"
    sender = {"name": settings.MAIL_FROM_NAME, "email": settings.MAIL_FROM}
    to = [{"email": email_to}]

    send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(
        to=to, sender=sender, subject=subject, html_content=html_content
    )

    # --- Send the email ---
    try:
        api_response = api_instance.send_transac_email(send_smtp_email)
        print("Email sent successfully! Response:")
        print(api_response)
    except ApiException as e:
        print(
            f"Exception when calling TransactionalEmailsApi->send_transac_email: {e}\n"
        )
