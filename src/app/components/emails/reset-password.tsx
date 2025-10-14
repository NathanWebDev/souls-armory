interface ForgotPasswordProps {
    username: string;
    resetLink: string;
}

export default function ForgotPassword({ username, resetLink }: ForgotPasswordProps) {
    return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2>Reset Your Password</h2>
      <p>Hello {username},</p>
      <p>
        We received a request to reset your password for your Souls Armory account. Click the button below to set a new password:
      </p>
      <a
        href={resetLink}
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
        Reset Password
      </a>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        If you did not request a password reset, you can safely ignore this email.
      </p>
    </div>
  );
}