import { Github, Profile, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import { Layout } from "../components/Layout";
import Image from "next/image";
import prisma from "../lib/prisma";

interface Props {
  profile: Profile & {
    owner: Pick<User, "username" | "name" | "image">;
    github: Pick<Github, "company" | "location">;
  };
}

const UserProfile: React.FC<Props> = ({ profile }) => {
  return (
    <Layout>
      <div>
        <Image
          width={100}
          height={100}
          src={profile.owner.image}
          alt={`Profile image of ${profile.owner.name}`}
        />
      </div>
      <div>
        Welcome to profile of {profile.owner.username}, member since{" "}
        {profile.createdAt.getFullYear()}
      </div>
      <div>Works at {profile.github.company}</div>
      <div>Located in {profile.github.location}</div>
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
          github: {
            select: {
              company: true,
              location: true,
            },
          },
          owner: {
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
