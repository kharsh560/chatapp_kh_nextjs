"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GlobalLoader } from "../miscellaneousUIcomponents/GlobalLoader";
import { GlobalSpinner } from "../miscellaneousUIcomponents/GlobalSpinner";
import { signIn } from "next-auth/react";

export function SignUp() {
  const [username, setUsername] = useState<String>("");
  const [email, setEmail] = useState<String>("");
  const [password, setPassword] = useState<String>("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [successfullySignedUp, setSuccessfullySignedUp] = useState(false);

  // const submitHandler = async (e : React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   // if (username == "" || email == "" || password == "") {
  //   //   alert("All fields are required!");
  //   //   return;
  //   // }
  //   if (username === "" || email === "" || password === "") {
  //     throw new Error("All fields are required!"); // ✅ Now goes to `catch`
  //   }
  //   console.log(`username: ${username} | email: ${email} | password: ${password}`);
  //   try {
  //     const postedData = await fetch("http://localhost:3000/api/registerUser", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({
  //         username,
  //         email,
  //         password
  //       })
  //     })
  //     // console.log("Direct response, without converting to json: ", postedData);
  //     if (!postedData.ok) {
  //       console.log("Error", postedData);
  //       // NOTE: // ✅ Throw error so it goes to `catch` :-
  //       throw new Error("Failed to register user"); 
  //     }
  //     const jsonResPostedData = await postedData.json();
  //     console.log("User signed up successfully! Json convert response: ", jsonResPostedData);
  //     router.push("/chatroom")
  //   } catch (error) {
  //     console.log("Something went wrong!", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    if (username === "" || email === "" || password === "") {
      throw new Error("All fields are required!"); // ✅ Now goes to `catch`
    }

    console.log(`username: ${username} | email: ${email} | password: ${password}`);

    const postedData = await fetch("http://localhost:3000/api/registerUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!postedData.ok) {
      throw new Error("Failed to register user"); // ✅ Ensures errors always go to `catch`
    }

    const jsonResPostedData = await postedData.json();
    console.log("User signed up successfully! JSON response: ", jsonResPostedData);
    setSuccessfullySignedUp(true);
    // await new Promise((r) => setTimeout(r, 2000)); // Artificial delay
    // setTimeout(() => {
    //   router.push("/chatroom");
    // }, 2000)
    // If the user has signed up successfully, then let him sign in!
    await new Promise((r) => setTimeout(r, 1000));
    await signIn("credentials", { email, password, callbackUrl: "/chatroom" });
  } catch (error) {
    console.error("Something went wrong!", error);
    if (error instanceof Error) {
      alert(error.message); // ✅ Display the error message
    } else {
      alert("An unknown error occurred");
    }
  } finally {
    setIsLoading(false); // ✅ Ensures isLoading is reset in all cases
  }
};

  if (isLoading) return <GlobalLoader />

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 border border-gray-700 rounded-lg shadow-lg bg-opacity-10 backdrop-blur-md">
        <h1 className="text-3xl font-modern text-white text-center mb-6">Sign Up</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200 cursor-pointer"
            onClick={(e) => submitHandler(e)}
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-gray-200 hover:underline">
            Sign In
          </Link>
        </p>

        {successfullySignedUp ? (<div className=" flex flex-col items-center justify-center">
            <h1 className="bg-green-900 text-green-400 text-center w-fit rounded-2xl px-4 py-2 m-2 shadow-lg">
                Sign up successful! 🎉 <br></br>  Routing you to chatroom. 
            </h1>
            <GlobalSpinner />
        </div>) : ""}
      </div>
    </div>
  );
}


/*
default export of a function(fxn) Y from a file X
import anyName from X

named export of a function Y from a file X
import { fxn as anyName } from X
*/