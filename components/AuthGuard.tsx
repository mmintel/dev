import { signIn, useSession } from "next-auth/client";
import { useEffect } from "react";

export function AuthGuard({ children }: { children: JSX.Element }) {
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      signIn();
    }
  }, [loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loading && session) {
    return <>{children}</>;
  }

  return null;
}
