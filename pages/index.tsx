import { Profile, User } from "@prisma/client";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { Layout } from "../components/Layout";
import prisma from "../lib/prisma";

interface Props {
  profiles: (Profile & {
    owner: Pick<User, "username" | "image">;
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
            <Link href={`/${profile.owner.username}`}>
              <a>
                <Image src={profile.owner.image} width={100} height={100} />
                {profile.owner.username}
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
    where: { owner: { username: { not: null } } },
    include: {
      owner: {
        select: {
          username: true,
          image: true,
        },
      },
    },
  });
  return { props: { profiles } };
};
