import { Profile, User } from "@prisma/client";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../components/Layout";
import { prisma } from "../server";

interface Props {
  profiles: (Profile & {
    user: Pick<User, "username" | "image">;
  })[];
}

const Home: React.FC<Props> = ({ profiles }) => {
  const handleRefresh = async () => {
    await fetch("/api/refresh-profile", {
      method: "POST",
    });
  };

  return (
    <Layout>
      <main>
        <button onClick={handleRefresh}>refresh profile</button>
        {profiles.map((profile) => (
          <div key={profile.id}>
            <Link href={`/${profile.user.username}`}>
              <a>
                <Image src={profile.user.image} width={100} height={100} />
                {profile.user.username}
              </a>
            </Link>
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const profiles = await prisma.profile.findMany({
    where: { user: { username: { not: null } } },
    include: {
      user: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
  return { props: { profiles: profiles || [] } };
};
