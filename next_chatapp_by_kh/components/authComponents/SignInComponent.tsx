import Link from "next/link";
import { SignInButton } from "../miscellaneousUIcomponents/SignInButton";

export function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-8 border border-gray-700 rounded-lg shadow-lg bg-opacity-10 backdrop-blur-md">
        <h1 className="text-3xl font-modern text-white text-center mb-6">Sign In</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-transparent border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <SignInButton />
        </form>

        <p className="text-gray-400 text-center mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-gray-200 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
