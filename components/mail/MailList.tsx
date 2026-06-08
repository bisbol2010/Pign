"use client";

import { MailRow } from "./MailRow";
import { groupDeliveriesByTime } from "./utils";
import type { DeliveryRow } from "./types";
import type { Id } from "@/convex/_generated/dataModel";

type MailListProps = {
  deliveries: DeliveryRow[];
  userId?: Id<"users">;
};

export function MailList({ deliveries, userId }: MailListProps) {
  const groups = groupDeliveriesByTime(deliveries);

  return (
    <div>
      {groups.map((group) => (
        <section key={group.label}>
          <div className="relative border-b border-grey-6 bg-grey-7/60 px-[30px] py-[6px]">
            <p className="text-[14px] font-medium text-grey-3">{group.label}</p>
          </div>
          {group.items.map((delivery, index) => (
            <MailRow
              key={delivery._id}
              delivery={delivery}
              userId={userId}
              striped={index % 2 === 0}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
