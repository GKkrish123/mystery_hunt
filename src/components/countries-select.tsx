"use client";

import { type ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function CountriesSelect({
  wrapperClassName,
  value,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  onValueChange,
  ...props
}: ComponentProps<typeof Select> & {
  wrapperClassName?: string;
}) {
  //   const { data, isLoading } = api.user.getStateCities.useQuery(
  //     { state: state ?? "", country: "India" },
  //     { enabled: !!state },
  //   );

  return (
    <div className={cn("flex", wrapperClassName)}>
      <Select
        value={value ?? "India"}
        onValueChange={onValueChange}
        defaultValue="India"
        {...props}
      >
        <SelectTrigger>
          <SelectValue placeholder="India" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="India">India</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
