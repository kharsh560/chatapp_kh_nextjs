"use client";
import avatars from "@/public/AvatarExporter";
import { getToken } from "next-auth/jwt";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Home, MessageCircle, Users, HeartPulse } from 'lucide-react';


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

// const socketRef = useRef<WebSocket | null>(null);


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
    const router = useRouter();
    const session = useSession();
    // console.log("Client session: ",session);
    const userName = session.data?.user?.name;
    console.log(userName);

    const dispatch = useDispatch();

//     useEffect(() => {
//         // if (status === "loading") return; // Wait for session
//         if (!session) {
//         console.log("User not authenticated");
//         return;
//         }

//         // Retrieve the JWT token from session (depends on your NextAuth configuration)
//         // const token = session.accessToken; 
//         // or session.user?.token if you set it up that way

//         if (!userName) {
//         console.log("No token available");
//         return;
//         }
//         else {
//             console.log("Hello ", userName)
//         }

//         // Create WebSocket connection with the token as a query parameter
//         const ws = new WebSocket(`ws://localhost:8080?username=${userName}`);
//         // socketRef.current = ws;
//         console.log("WS at connection: ", ws);
//         // dispatch(openConnection(ws));

//         ws.onopen = () => {
//             console.log(`${userName} connected successfully through WebSocket.`);
//             ws.send(`Hello ${userName}, WebSocket connection established! : From Frontend!`);
//         };

        // ws.onmessage = (event) => {
        // console.log("Received:", event.data);
        // };

//         // if (ws || userName) ws.send(`Hello ${userName}, WebSocket connection established! : From Frontend!`);

//         ws.onerror = (error) => {
//         console.log("WebSocket error:", error);
//         };

//         ws.onclose = () => {
//         console.log(`${userName} disconnected successfully.`);
//         // dispatch(closeConnection());
//         };

//         // Cleanup the connection when the component unmounts
//         return () => {
//         ws.close();
//         };
//   }, [userName]);

const healthCheck = async () => {
  try {
    const resp = await fetch("http://localhost:6900/api/v1/healthcheck", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: 'include',
    })

    const jsonResponse = await resp.json();
    console.log(jsonResponse);
  } catch (error) {
    console.log("Error: ", error)
  }
}
    
    return (
        <div>
            <div className="p-4 border-t border-gray-700 flex justify-between items-center space-x-3 ">
                {/* cursor-pointer hover:bg-gray-800 */}
                <div className=" flex items-center gap-2 w-full">
                    <Image
                    // src={userData ? userData.avatar_url : ""}
                    // src={userDetails?.avatar_url}
                    src={avatars.avatar8.src}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                    />
                    {/* <span className="text-sm"> {userDetails?.name} </span> */}
                    <span className="text-sm cursor-default w-full"> {session?.data ? <div>   <p>{session.data.user?.name}</p> </div> : "..."} </span>
                    {/* {userData?.name} */}
                </div>

                <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                    <HeartPulse size={20} />
                    <button onClick={healthCheck}>Health Check</button>
                </div>

                <button className="p-1 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer w-24" onClick={ async () => {
                    // await signOut();
                    await signOut({ callbackUrl: "/" });
                    // router.push("/");
                }}>Sign Out</button>
            </div>
            {/* <div> {session?.data ? <div>   <p>{JSON.stringify(session.data.user?.name)}</p> </div> : ""} </div> */}
        </div>
    )
}