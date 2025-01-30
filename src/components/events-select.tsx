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
import { Label } from "./ui/label";

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
    <div className={cn("relative flex", wrapperClassName)}>
      <Label className="absolute -top-2 left-[0.8rem] rounded-md bg-white px-1 text-[0.7rem] text-muted-foreground dark:bg-black lg:text-xs">
        Events
      </Label>
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
          {data?.map((event) => {
            const scheduledFromDate = new Date(
              event.scheduledFrom.seconds * 1000,
            );
            const scheduledToDate = new Date(
              event.scheduledFrom.seconds * 1000,
            );
            const scheduledFromDateValue = scheduledFromDate
              .toDateString()
              .split(" ")
              .slice(1, 3)
              .join(" ");
            const scheduledToDateValue = scheduledToDate
              .toDateString()
              .split(" ")
              .slice(1, 3)
              .join(" ");
            const timeline =
              scheduledFromDateValue === scheduledToDateValue
                ? scheduledFromDateValue
                : `${scheduledFromDateValue} - ${scheduledToDateValue}`;
            return (
              <SelectItem key={`select-${event.id}`} value={event.id}>
                {event.name} [{timeline}]
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
