"use client";

import {useKHtoast} from "@/utils/toastHandler";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

enum toastStates {
    none,
    error,
    warning,
    success
}

export function SignInButton({email, password} : {email: string, password: string}) {
  const router = useRouter();
  const showToast = useKHtoast();

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (email == null || email == undefined || email == "" || password == null || password == undefined || password == "") {
      alert("Empty credentials!");
      return;
    }
    // const signInRes = await signIn("credentials", { email, password, callbackUrl: "/chatroom" });
    // console.log(signInRes);
    const signInRes = await signIn("credentials", { email, password, redirect: false });

    if (signInRes?.error) {
      console.log(signInRes.error);
      // alert("Invalid credentials"); // Show user-friendly message
      showToast("Error signing in. Please retry!", toastStates.error);
    } else {
      router.push("/chatroom"); // Redirect manually
      showToast("Successfully signed in!", toastStates.success);
    }
    // router.push("/chatroom");
    // console.log(router);
  }

    return (
        <button
            className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
            onClick={(e) => handleSignIn(e)}
          >
            Sign In
          </button>
    );
}

// {clickActionHandler, label} : {clickActionHandler : () => void, label : string}