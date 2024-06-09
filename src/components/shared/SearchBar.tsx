"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Input } from "../ui/input";

interface Props {
  routeType: string;
}

const Searchbar: React.FC<Props> = ({ routeType }) => {
  const router = useRouter();
  const [search, setSearch] = useState<string>("");

  const handleSearch = useCallback(
    (input: string) => {
      if (input.trim() !== "") {
        router.push(`/${routeType}?q=` + input);
      } else {
        router.push(`/${routeType}`);
      }
    },
    [router, routeType]
  );

  // Debounced search query after 300ms of no input changes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(search);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, handleSearch]);

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />
      <Input
        id="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          routeType !== "/search" ? "Search communities" : "Search creators"
        }
        className="no-focus searchbar_input"
      />
    </div>
  );
};

export default Searchbar;
