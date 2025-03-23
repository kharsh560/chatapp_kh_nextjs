"use client";
import { useRouter } from "next/navigation";

export function SignInButton() {
  const router = useRouter();
  const handleSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/chatroom");
    console.log(router);
  }
    return (
        <button
            className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            onClick={(e) => handleSignIn(e)}
          >
            Sign In
          </button>
    );
}

// {clickActionHandler, label} : {clickActionHandler : () => void, label : string}