import React, { useState } from "react";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

import VideoCard from "@/components/VideoCard";
import NoResults from "@/components/NoResults";
import { IUser, Video } from "@/types";
import { base_url } from "@/utils";
import useAuthStore from "@/store/authStore";

const Search = ({ videos }: { videos: Video[] }) => {
  const [isAccounts, setIsAccounts] = useState(false);
  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const router = useRouter();
  const { searchTerm }: any = router.query;
  const { allUsers } = useAuthStore();
  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(videos.length);
  return (
    <div className="w-full ">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
          onClick={() => setIsAccounts(true)}
        >
          Accounts
        </p>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
          onClick={() => setIsAccounts(false)}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div>
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, index: number) => (
              <Link href={`/profile/${user._id}`} key={index}>
                <div className="flex gap-3 p-2 cursor-pointer rounded border-b-2 border-gray-200">
                  <div>
                    <Image
                      src={user.image}
                      width="50"
                      height="50"
                      className="rounded-full"
                      alt="user profile"
                    />
                  </div>
                  <div>
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {user.userName.replaceAll(" ", "")}{" "}
                      <GoVerified className="text-blue-400" />
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {user.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`No account results for ${searchTerm}`} />
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length > 0 ? (
            videos.map((video: Video, index: number) => (
              <VideoCard post={video} key={index} />
            ))
          ) : (
            <NoResults text={`No video results for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const { data } = await axios.get(`${base_url}/api/search/${searchTerm}`);
  return { props: { videos: data } };
};

export default Search;
