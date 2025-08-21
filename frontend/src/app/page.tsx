'use client';

import { ConnectionProvider } from "@/components/context/connectionContext";
import HomePage from "@/components/screenComponent/homePage";


export default function Home() {
  return (
    <ConnectionProvider>
      <HomePage />
    </ConnectionProvider>
  );
}
