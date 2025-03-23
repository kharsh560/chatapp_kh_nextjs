export default function ({children} : {children: React.ReactNode}) {
    return (
        <div>
            {/* <div className="flex justify-center w-screen">
                <h1 className="bg-yellow-900 text-yellow-400 w-fit rounded-2xl px-4 py-2 m-2 shadow-lg">
                    Sign in now to get 20% off!
                </h1>
            </div> */}
            {children}
        </div>
    )
}