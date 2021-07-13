import { Profile, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Layout } from "../components/Layout";
import Image from "next/image";
import prisma from "../lib/prisma";

interface Props {
  profile: Profile & {
    user: Pick<User, "username" | "name" | "image">;
  };
}

const UserProfile: React.FC<Props> = ({ profile }) => {
  return (
    <Layout>
      <div>
        <Image
          width={100}
          height={100}
          src={profile.user.image}
          alt={`Profile image of ${profile.user.name}`}
        />
      </div>
      <div>
        Welcome to profile of {profile.user.username}, member since{" "}
        {profile.createdAt.getFullYear()}
      </div>
      <div>Works at {profile.company}</div>
      <div>Located in {profile.location}</div>
    </Layout>
  );
};

export default UserProfile;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const user = await prisma.user.findUnique({
    where: {
      username: String(params.username),
    },
    select: {
      profile: {
        select: {
          updatedAt: true,
          createdAt: true,
          company: true,
          location: true,
          user: {
            select: {
              username: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return {
    props: { profile: user.profile },
  };
};
