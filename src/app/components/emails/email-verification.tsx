interface EmailVerificationProps {
    username: string;
    verificationLink: string;
}

export default function EmailVerification({ username, verificationLink }: EmailVerificationProps) {
    return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2>Verify Your Account</h2>
      <p>Hello {username},</p>
      <p>
        Thank you for signing up on Souls Foundry! Please verify your account by clicking the button below:
      </p>
      <a
        href={verificationLink}
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#000000",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          marginTop: "1rem"
        }}
      >
        Verify Account
      </a>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        If you did not create this account, you can safely ignore this email.
      </p>
    </div>
  );
}