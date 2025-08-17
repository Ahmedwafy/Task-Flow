"use client";
import Link from "next/link";
import TextType from "@/app/components/TextType/TextType";
import styles from "./Home.module.scss";

export default function Home() {
  return (
    <div className={styles.section}>
      <h1>TASK FLOW</h1>
      <TextType
        text={[
          "Welcome to Task Flow",
          "Organize your work effortlessly",
          "Achieve more every day!",
        ]}
        typingSpeed={75}
        pauseDuration={1500}
        showCursor={true}
        cursorCharacter="|"
        variableSpeed={false} // Default value
        onSentenceComplete={() => {}} // Callback function when a sentence is completed
      />

      <div className={styles.links}>
        <Link href="/login">Login</Link>
        <Link href="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
