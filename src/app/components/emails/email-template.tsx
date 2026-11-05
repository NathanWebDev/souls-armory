interface EmailTemplateProps {
    heading: string;
    username: string;
    message: string;
    footnote: string;
    button?: { label: string; link: string; color?: string };
}

export default function EmailTemplate({ heading, username, message, footnote, button }: EmailTemplateProps) {
    return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "2rem", background: "#f9f9f9", borderRadius: "8px" }}>
      <h2>{heading}</h2>
      <p>Hello {username},</p>
      <p>{message}</p>
      {button && (
        <a
          href={button.link}
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            background: button.color ?? "#000000",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
            marginTop: "1rem"
          }}
        >
          {button.label}
        </a>
      )}
      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>{footnote}</p>
    </div>
  );
}
