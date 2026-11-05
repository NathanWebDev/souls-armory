interface AccountDeletedProps {
    username: string;
}

export default function AccountDeleted({ username }: AccountDeletedProps) {
    return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2>Your Account Has Been Deleted</h2>
      <p>Hello {username},</p>
      <p>
        Your Souls Armory account has been permanently deleted. We&apos;re sorry to see you go.
      </p>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        If you did not make this request, please contact us right away.
      </p>
    </div>
  );
}
