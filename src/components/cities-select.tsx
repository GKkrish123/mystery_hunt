"use client";

import { useState, type ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Loader from "./ui/loader";

export function CitiesSelect({
  wrapperClassName,
  state,
  value,
  ...props
}: ComponentProps<typeof Select> & {
  state?: string;
  wrapperClassName?: string;
}) {
  const { data, isLoading } = api.user.getStateCities.useQuery(
    { state: state ?? "", country: "India" },
    { enabled: !!state },
  );

  const [cityValue, setCityValue] = useState<string | undefined>(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onSelectValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      setCityValue(value);
      params.set("city", value);
    } else {
      setCityValue("");
      params.delete("city");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("flex", wrapperClassName)}>
      <Select
        value={cityValue ?? "all"}
        onValueChange={onSelectValueChange}
        defaultValue="all"
        disabled={isLoading}
        {...props}
      >
        <SelectTrigger>
          {!isLoading ? (
            <SelectValue placeholder="All Cities" />
          ) : (
            <Loader className="mx-auto my-0 h-7 w-7" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {data?.map((city) => (
            <SelectItem key={`select-${city}`} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
