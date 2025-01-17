"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const response = await fetch("/api/sessionCheck", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      if (result.loggedIn) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router]);

  return (
    <main>
      <h1 className="text-center text-8xl mt-44 font-body-700 text-cream font-bold">
        Sound Track
      </h1>
      <div className="flex items-center justify-center">
        <h2 className="animate-typing overflow-hidden border-r-4 border-r-white text-3xl mt-8 mb-32 font-body-500 text-cream whitespace-nowrap">
          Journey Through Your Musical Past
        </h2>
      </div>
      <div className="text-center">
        <Link href="/login">
          <button className="border px-8 mx-4 text-cream border-cream text-xl hover:bg-cream hover:text-blue">
            Log In
          </button>
        </Link>
        <Link href="signup">
          <button className="border px-8 mx-4 text-cream border-cream text-xl hover:bg-cream hover:text-blue">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
