import { signOut, signIn, useSession } from "next-auth/client";
import Link from "next/link";

export const Header: React.FC = () => {
  const [session, loading] = useSession();

  if (loading) return <div>Loading...</div>;

  if (session)
    return (
      <div>
        <Link href="/">
          <h1>Dev</h1>
        </Link>
        Logged in as{" "}
        <Link href="/app">
          <a>
            {session.user.name} ({session.user.email})
          </a>
        </Link>
        ,<button onClick={() => signOut()}>logout now</button>
      </div>
    );

  return (
    <div>
      Logged out, <button onClick={() => signIn()}>login</button>
    </div>
  );
};
