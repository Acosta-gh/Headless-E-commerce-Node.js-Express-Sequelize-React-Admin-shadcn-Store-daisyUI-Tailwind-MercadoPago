import { Search } from "lucide-react";

export default function SearchBar({ search, setSearch }) {
    return (
        <div className="flex justify-center p-4 sm:pb-2  sm:w-full sm:justify-start">
            <div className="relative w-full max-w-md sm:max-w-3xl">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search size={20} />
                </span>
                <input
                    type="text"
                    placeholder="Busca tu comida favorita..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-10 p-3 pt-3.5 rounded-full bg-white w-full focus:outline-none focus:ring-2 focus:ring-red-900 transition-all duration-300 shadow-md"
                />
            </div>
        </div>
    );
}