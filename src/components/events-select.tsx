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

export function EventsSelect({
  wrapperClassName,
  value,
  ...props
}: ComponentProps<typeof Select> & { wrapperClassName?: string }) {
  const { data, isLoading } = api.events.getCompletedEvents.useQuery();
  const [eventValue, setEventValue] = useState<string | undefined>(value);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setEventValue(value);
  }, [value]);

  const onSelectValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      setEventValue(value);
      params.set("event", value);
      params.delete("state");
      params.delete("city");
    } else {
      setEventValue("");
      params.delete("event");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={cn("flex", wrapperClassName)}>
      <Select
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        value={eventValue || "all"}
        onValueChange={onSelectValueChange}
        defaultValue="all"
        disabled={isLoading}
        {...props}
      >
        <SelectTrigger>
          {!isLoading ? (
            <SelectValue placeholder="Mysteryverse" />
          ) : (
            <Loader className="mx-auto my-0 h-7 w-7" />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Mysteryverse</SelectItem>
          {data?.map((event) => (
            <SelectItem key={`select-${event.id}`} value={event.id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
