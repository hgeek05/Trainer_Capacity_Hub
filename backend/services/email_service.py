import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def _send_smtp_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Envoie un e-mail réel à N'IMPORTE QUEL destinataire (Outlook, UM6P, Gmail, etc.)
    en utilisant le serveur SMTP direct Google Gmail.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    from_email = os.getenv("EMAILS_FROM_EMAIL", smtp_user).strip()
    from_name = os.getenv("EMAILS_FROM_NAME", "Trainer Capacity Hub").strip()

    if not smtp_user or not smtp_password:
        print("[SMTP NOTICE] SMTP_USER ou SMTP_PASSWORD non configure.")
        return False

    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = f"{from_name} <{from_email}>"
    message["To"] = to_email
    message.attach(MIMEText(html_content, "html"))

    try:
        with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, message.as_string())
        print(f"[SMTP SUCCESS] E-mail envoye avec succes a {to_email} via {smtp_server}")
        return True
    except Exception as e:
        print(f"[SMTP ERROR] Echec de l'envoi SMTP a {to_email} : {e}")
        return False


async def send_reset_password_email(to_email: str, reset_token: str, user_name: str = "Collaborateur"):
    """
    Envoie un email de réinitialisation de mot de passe via SMTP Google Gmail.
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001").rstrip("/")
    reset_link = f"{frontend_url}/login/reset-password?token={reset_token}"
    subject = "Reinitialisation de votre mot de passe - Trainer Capacity Hub"
    
    # Impression ASCII-safe du lien en console
    print(f"\n=======================================================")
    print(f"[DEMANDE DE REINITIALISATION DE MOT DE PASSE]")
    print(f"Destinataire : {to_email} ({user_name})")
    print(f"LIEN DE REINITIALISATION : {reset_link}")
    print(f"=======================================================\n")

    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #1F2937; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #E04F26; margin-bottom: 8px;">Trainer Capacity Hub — UM6P TechniX</h2>
        <p style="margin-top: 0; color: #4B5563;">Bonjour {user_name},</p>
        <p style="color: #4B5563;">Une demande de réinitialisation de mot de passe a été effectuée pour votre compte.</p>
        <p style="margin: 25px 0;">
            <a href="{reset_link}" style="background-color: #E04F26; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Réinitialiser mon mot de passe
            </a>
        </p>
        <p style="font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 12px;">Ce lien expirera dans 15 minutes. Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</p>
    </div>
    """

    return _send_smtp_email(to_email, subject, html_content)


async def send_2fa_otp_email(to_email: str, otp_code: str, user_name: str = "Collaborateur"):
    """
    Envoie le code de sécurité 2FA à 6 chiffres par email via SMTP Google Gmail.
    """
    subject = f"{otp_code} est votre code de verification 2FA - Trainer Capacity Hub"

    # Impression ASCII-safe du code OTP en console
    print(f"\n=======================================================")
    print(f"[CODE DE SECURITE 2FA]")
    print(f"Destinataire : {to_email} ({user_name})")
    print(f"CODE OTP : {otp_code}")
    print(f"=======================================================\n")

    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #1F2937; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 16px; background-color: #ffffff;">
        <h2 style="color: #E04F26; margin-bottom: 8px;">Trainer Capacity Hub — UM6P TechniX</h2>
        <p style="margin-top: 0; color: #4B5563;">Bonjour {user_name},</p>
        <p style="color: #4B5563;">Voici votre code de sécurité à 6 chiffres pour valider votre connexion :</p>
        <div style="background-color: #FFF5F2; border: 2px dashed #E04F26; border-radius: 12px; padding: 16px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #E04F26; font-family: monospace;">{otp_code}</span>
        </div>
        <p style="font-size: 12px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 12px;">Ce code expirera dans 5 minutes. Ne le partagez avec personne.</p>
    </div>
    """

    return _send_smtp_email(to_email, subject, html_content)
