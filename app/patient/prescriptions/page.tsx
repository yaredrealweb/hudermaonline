"use client";

import { usePatientPrescriptions } from "@/hooks/use-prescriptions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export default function Page() {
  const { data, isLoading } = usePatientPrescriptions();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<{
    imageUrl: string;
    title?: string | null;
    createdAt?: string | Date;
    note?: string | null;
  } | null>(null);

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4 bg-transparent">
        <h2 className="text-lg font-semibold">Your Prescriptions</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !data?.items?.length ? (
          <p className="text-sm text-muted-foreground">
            No prescriptions available.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <div key={item.id} className="border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    setActive({
                      imageUrl: item.imageUrl as unknown as string,
                      title: (item as any).title,
                      createdAt: (item as any).createdAt as unknown as string,
                      note: (item as any).note,
                    });
                    setOpen(true);
                  }}
                  className="block w-full"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title || "Prescription"}
                    className="w-full h-48 object-cover"
                  />
                </button>
                <div className="p-3 space-y-1">
                  <p className="font-medium truncate">
                    {item.title || "Prescription"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      item.createdAt as unknown as string
                    ).toLocaleString()}
                  </p>
                  {item.note && (
                    <p className="text-sm mt-2 whitespace-pre-wrap line-clamp-5">
                      {item.note}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setActive({
                          imageUrl: item.imageUrl as unknown as string,
                          title: (item as any).title,
                          createdAt: (item as any)
                            .createdAt as unknown as string,
                          note: (item as any).note,
                        });
                        setOpen(true);
                      }}
                    >
                      View
                    </Button>
                    <a
                      href={item.imageUrl as unknown as string}
                      download
                      className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{active?.title || "Prescription"}</DialogTitle>
          </DialogHeader>
          {active?.imageUrl && (
            <div className="w-full">
              <img
                src={active.imageUrl}
                alt={active.title || "Prescription"}
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          )}
          <div className="flex gap-2">
            {active?.imageUrl && (
              <a
                href={active.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Open in new tab
              </a>
            )}
            {active?.imageUrl && (
              <a
                href={active.imageUrl}
                download
                className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Download
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
