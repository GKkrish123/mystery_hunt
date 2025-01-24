"use client";

import { useEffect, useState, type ComponentProps } from "react";
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

export function StatesSelect({
  wrapperClassName,
  value,
  ...props
}: ComponentProps<typeof Select> & { wrapperClassName?: string }) {
  const { data, isLoading } = api.user.getCountryStates.useQuery({
    country: "India",
  });
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setStateValue(value);
  }, [value]);

  const onSelectValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      setStateValue(value);
      params.set("state", value);
      params.delete("city");
      params.delete("event");
    } else {
      setStateValue("");
      params.delete("state");
      params.delete("city");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("flex", wrapperClassName)}>
      <Select
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        value={stateValue || "all"}
        onValueChange={onSelectValueChange}
        defaultValue="all"
        disabled={isLoading}
        {...props}
      >
        <SelectTrigger>
          {!isLoading ? (
            <SelectValue placeholder="All States" />
          ) : (
            <Loader className="mx-auto my-0 h-7 w-7" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {data?.map((state) => (
            <SelectItem key={`select-${state.state_code}`} value={state.name}>
              {state.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
