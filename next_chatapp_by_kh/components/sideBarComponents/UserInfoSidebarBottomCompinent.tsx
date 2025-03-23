"use client";
import avatars from "@/public/AvatarExporter";
import Image from "next/image";
import { useEffect, useState } from "react";

type userDetailsType = {
  "login": string,
  "id": number,
  "node_id": string,
  "avatar_url": string,
  "gravatar_id": string,
  "url": string,
  "html_url": string,
  "followers_url": string,
  "following_url": string,
  "gists_url": string,
  "starred_url": string,
  "subscriptions_url": string,
  "organizations_url": string,
  "repos_url": string,
  "events_url": string,
  "received_events_url": string,
  "type": string,
  "user_view_type": string,
  "site_admin": false,
  "name": string,
  "company": null,
  "blog": string,
  "location": string,
  "email": null,
  "hireable": null,
  "bio":string,
  "twitter_username": string,
  "public_repos": number,
  "public_gists": number,
  "followers": number,
  "following": number,
  "created_at": string,
  "updated_at": string
}

export function UserInfo({userDetails}:{userDetails: userDetailsType}) {
    // const [userData, setUserData] = useState<userDetailsType | null>(null);
    // const [loadingState, setLoadingState] = useState(true);
    // useEffect(() => {
    //     if (userDetails) {
    //         setUserData(userDetails);
    //         setTimeout(() => {
    //             setLoadingState(false);    
    //         }, 1000);
    //     }
    // }, [userData])

    // if (loadingState) return (
    //     <div className="p-4 border-t border-gray-700 flex justify-center items-center space-x-3 cursor-pointer hover:bg-gray-800">
    //         ...
    //     </div>
    // );
    return (
        <div>
            <div className="p-4 border-t border-gray-700 flex items-center space-x-3 cursor-pointer hover:bg-gray-800">
                <Image
                // src={userData ? userData.avatar_url : ""}
                src={userDetails?.avatar_url}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
                />
                <span className="text-sm"> {userDetails?.name} </span>
                {/* {userData?.name} */}
            </div>
        </div>
    )
}