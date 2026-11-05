interface DeleteAccountProps {
    username: string;
    deleteLink: string;
}

export default function DeleteAccount({ username, deleteLink }: DeleteAccountProps) {
    return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2>Confirm Account Deletion</h2>
      <p>Hello {username},</p>
      <p>
        We received a request to permanently delete your Souls Armory account. Click the button below to confirm:
      </p>
      <a
        href={deleteLink}
        style={{
          display: "inline-block",
          padding: "0.75rem 1.5rem",
          background: "#b91c1c",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          marginTop: "1rem"
        }}
      >
        Delete my account
      </a>
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        If you did not request this, you can safely ignore this email and your account will not be deleted.
      </p>
    </div>
  );
}
