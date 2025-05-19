import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Mini DNS API</title>
        <meta name="description" content="Realistic DNS API built with Next.js and PostgreSQL" />
      </Head>
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#111827",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            padding: "2.5rem",
          }}
        >
          <Image
            src="/project-icon.png"
            alt="Mini DNS Logo"
            width={100}
            height={75}
            style={{ marginBottom: "1rem" }}
          />
          <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem", color: "#555" }}>
            Mini DNS API
          </h1>
          <p style={{ color: "#555", marginBottom: "2rem", lineHeight: "1.6" }}>
            A Mini DNS API project that mimics realistic DNS behavior using TypeScript, Next.js, and PostgreSQL.

          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <a
              href="https://red-firefly-292308.postman.co/workspace/AdmitSpot~a0955b4b-6b28-480d-ae10-bb16aa124702/collection/24728942-d39db7de-3e4c-4cb4-bb13-747bdeb9232c?action=share&creator=24728942"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "0.75rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              📬 Explore Postman Collection
            </a>

            <a
              href="https://piyushpriyadarshi.dev"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "#111827",
                color: "white",
                padding: "0.75rem",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              🌐 Visit My Portfolio
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
