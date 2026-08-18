import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def _send_smtp_email(to_email: str, subject: str, html_content: str) -> bool:
    """
    Envoie un e-mail réel à N'IMPORTE QUEL destinataire (Outlook, UM6P, Gmail, etc.)
    en utilisant un serveur SMTP (ex: Brevo SMTP ou Gmail) sans aucune restriction de domaine.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp-relay.brevo.com").strip()
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    from_email = os.getenv("EMAILS_FROM_EMAIL", smtp_user).strip()
    from_name = os.getenv("EMAILS_FROM_NAME", "Trainer Capacity Hub").strip()

    if not smtp_user or not smtp_password:
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
        print(f"✅ [BREVO/SMTP SUCCESS] E-mail envoyé avec succès à {to_email} via {smtp_server}")
        return True
    except Exception as e:
        print(f"❌ [SMTP ERROR] Échec de l'envoi SMTP à {to_email} : {e}")
        return False


async def send_reset_password_email(to_email: str, reset_token: str, user_name: str = "Collaborateur"):
    """
    Envoie un email de réinitialisation de mot de passe via SMTP Gmail ou Resend.
    """
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3001").rstrip("/")
    reset_link = f"{frontend_url}/login/reset-password?token={reset_token}"
    subject = "Réinitialisation de votre mot de passe - Trainer Capacity Hub"
    
    # 🔑 Impression du lien en console pour le développement local
    print(f"\n=======================================================")
    print(f"🔑 [DEMANDE DE RÉINITIALISATION DE MOT DE PASSE]")
    print(f"📧 Destinataire : {to_email} ({user_name})")
    print(f"🔗 LIEN DE RÉINITIALISATION : {reset_link}")
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

    # 1. Tentative d'envoi par SMTP (Gmail / Brevo)
    if _send_smtp_email(to_email, subject, html_content):
        return True

    # 2. Fallback via Resend API
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    if api_key:
        try:
            import resend
            resend.api_key = api_key
            params = {
                "from": "Trainer Capacity Hub <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_content
            }
            resend.Emails.send(params)
            print(f"✅ [RESEND SUCCESS] Email envoyé via Resend à {to_email}")
            return True
        except Exception as e:
            print(f"⚠️ [RESEND NOTICE] {e}")

    return True


async def send_2fa_otp_email(to_email: str, otp_code: str, user_name: str = "Collaborateur"):
    """
    Envoie le code de sécurité 2FA à 6 chiffres par email via SMTP Gmail ou Resend.
    """
    subject = f"{otp_code} est votre code de vérification 2FA - Trainer Capacity Hub"

    # 🔑 Impression du code OTP en console pour le développement local
    print(f"\n=======================================================")
    print(f"🛡️ [DOUBLE AUTHENTIFICATION 2FA]")
    print(f"📧 Destinataire : {to_email} ({user_name})")
    print(f"🔢 CODE DE VÉRIFICATION OTP : {otp_code}")
    print(f"=======================================================\n")

    html_content = f"""
    <div style="font-family: Arial, sans-serif; color: #1F2937; padding: 24px; max-width: 500px; margin: 0 auto; border: 1px solid #E5E7EB; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #E04F26; margin: 0; font-size: 20px;">Trainer Capacity Hub</h2>
            <span style="font-size: 11px; color: #6B7280; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">UM6P TechniX — Sécurité 2FA</span>
        </div>
        
        <p style="margin: 0 0 12px; font-size: 14px;">Bonjour <strong>{user_name}</strong>,</p>
        <p style="margin: 0 0 20px; font-size: 13px; color: #4B5563; line-height: 1.5;">
            Une tentative de connexion à votre espace sécurisé a été initiée. Utilisez le code à usage unique ci-dessous pour valider votre accès :
        </p>
        
        <div style="background-color: #F8FAFC; border: 2px dashed #CBD5E1; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #0F172A;">
                {otp_code}
            </span>
        </div>
        
        <p style="font-size: 12px; color: #64748B; margin: 0 0 20px; text-align: center;">
            ⏱️ Ce code est valable pendant <strong>5 minutes</strong>.
        </p>
        
        <div style="border-top: 1px solid #E2E8F0; padding-top: 14px; font-size: 11px; color: #94A3B8; line-height: 1.4;">
            Si vous n'êtes pas à l'origine de cette tentative de connexion, nous vous conseillons de changer immédiatement votre mot de passe.
        </div>
    </div>
    """

    # 1. Tentative d'envoi par SMTP (Gmail / Brevo)
    if _send_smtp_email(to_email, subject, html_content):
        return True

    # 2. Fallback via Resend API
    api_key = os.getenv("RESEND_API_KEY", "").strip()
    if api_key:
        try:
            import resend
            resend.api_key = api_key
            params = {
                "from": "Trainer Capacity Hub <onboarding@resend.dev>",
                "to": [to_email],
                "subject": subject,
                "html": html_content
            }
            resend.Emails.send(params)
            print(f"✅ [RESEND 2FA SUCCESS] Email 2FA envoyé via Resend à {to_email}")
            return True
        except Exception as e:
            print(f"⚠️ [RESEND 2FA NOTICE] {e}")

    return True
