import { LoaderCircle } from "lucide-react";

function Loading() {
    return (
        <div className="flex justify-center items-center h-screen text-gray-800">
            <LoaderCircle className="animate-spin"/>
        </div>
    )
}

export default Loading