// app/signup/layout.tsx
import type { ReactNode } from "react";

export default function SignupLayout({ children }: { children: ReactNode }) {
  // you can still add a minimal header/logo here if you like,
  // or just return the raw children:
  return <>{children}</>;
}
