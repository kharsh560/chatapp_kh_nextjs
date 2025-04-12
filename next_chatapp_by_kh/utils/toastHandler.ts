"use client";

import { hideToast, showToast, toastStates } from "@/reduxStore/storeFeatures/toastSlice";
import { useDispatch } from "react-redux";
import { useCallback } from "react";

// ✅ Convert it into a custom hook
export function useKHtoast() {
    const dispatch = useDispatch();

    return useCallback((message: string, state: toastStates) => {
        dispatch(showToast({ message, state }));
        setTimeout(() => {
            dispatch(hideToast());
        }, 4000);
    }, [dispatch]);
}








// "use client";

// import { hideToast, showToast } from "@/reduxStore/storeFeatures/toastSlice";
// import { useDispatch } from "react-redux";

// enum toastStates {
//     none,
//     error,
//     warning,
//     success
// }

// export default function (message: string, state: toastStates) {
//     const dispatch = useDispatch();
//     dispatch(showToast({message, state}));
//     setTimeout(() => {
//         dispatch(hideToast());
//     }, 4000);
//     // return <CustomToast />
// }