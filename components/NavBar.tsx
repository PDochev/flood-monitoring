import Link from "next/link";
import Image from "next/image";

export default function NavBar() {
  return (
    <nav className="sticky top-0 z-10 bg-white border-b border-gray-200 ">
      <ul className="w-full flex flex-row h-16 justify-between items-center p-4">
        <li>
          <Link
            href="/"
            className="flex items-center font-medium justify-center gap-2 py-3 px-4 text-gray-800 underline"
          >
            <Image
              src="/flood.svg"
              alt="FloodWatch Logo"
              className="rounded-full shadow-sm"
              width={32}
              height={32}
              priority
            />
            FloodWatch
          </Link>
        </li>
      </ul>
    </nav>
  );
}
