"use client";


import { toastStates } from "@/reduxStore/storeFeatures/toastSlice";
import { useSelector } from "react-redux";

type toastSliceStatesType = {
    visible: boolean;
    message: string;
    state: toastStates;
}

export default function CustomToast() {
    // {message, state, visible} : {message: string, state: toastStates, visible: boolean}
    const toastSliceStates : toastSliceStatesType = useSelector((state : any) => state.toastData);
    if (!toastSliceStates.visible) return "";
    {
        switch (toastSliceStates.state) {
            case toastStates.warning:
                return (<div className=" h-screen w-screen ">
                            <h1 className="bg-yellow-900 text-yellow-400 w-fit rounded-2xl px-4 py-2 m-2 shadow-lg absolute bottom-0 right-0">
                                {toastSliceStates.message}
                            </h1>
                        </div>)
                break;
            case toastStates.error:
                return (<div className=" h-screen w-screen ">
                            <h1 className="bg-red-900 text-red-400 w-fit rounded-2xl px-4 py-2 m-2 shadow-lg absolute bottom-0 right-0">
                                {toastSliceStates.message}
                            </h1>
                        </div>)
                break;
            case toastStates.success:
                return (<div className=" h-screen w-screen ">
                            <h1 className="bg-green-900 text-green-400 w-fit rounded-2xl px-4 py-2 m-2 shadow-lg absolute bottom-0 right-0">
                                {toastSliceStates.message}
                            </h1>
                        </div>)
                break;
        }

    }
}