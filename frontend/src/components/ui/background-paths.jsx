import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function BackgroundPaths({
  title = "Analyst AI",
  ctaLink = "/upload",
  ctaLabel = "Let's go !",
}) {
  const words = title.split(" ");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1.5rem",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        style={{ textAlign: "center", width: "100%", maxWidth: "56rem" }}
      >
        {/* Animated title */}
        <h1
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            marginBottom: "1rem",
            lineHeight: 1.05,
          }}
        >
          {words.map((word, wordIndex) => (
            <span
              key={wordIndex}
              style={{ display: "inline-block", marginRight: "0.5rem" }}
            >
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={`${wordIndex}-${letterIndex}`}
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: wordIndex * 0.1 + letterIndex * 0.03,
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                  style={{
                    display: "inline-block",
                    background:
                      "linear-gradient(to right, #ffffff, rgba(255,255,255,0.75))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.45)",
            marginBottom: "2.5rem",
            letterSpacing: "0.04em",
            fontWeight: 400,
          }}
        >
          Analysis made easy.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Link to={ctaLink} style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.85rem 2.2rem",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "0.01em",
                color: "#0a0a0a",
                background:
                  "linear-gradient(135deg, #ffffff 0%, #e8e8e8 100%)",
                border: "none",
                borderRadius: "9999px",
                cursor: "pointer",
                boxShadow:
                  "0 4px 24px rgba(255,255,255,0.15), 0 1px 4px rgba(0,0,0,0.4)",
              }}
            >
              <span>{ctaLabel}</span>
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block", fontSize: "1.1rem" }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
