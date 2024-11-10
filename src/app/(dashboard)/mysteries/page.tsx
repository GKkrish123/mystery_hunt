import { cn } from "@/lib/utils";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardImage,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";


export interface Album {
  name: string
  artist: string
  cover: string
}

export const listenNowAlbums: Album[] = [
  {
    name: "React Rendezvous",
    artist: "Ethan Byte",
    cover:
      "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=300&dpr=2&q=80",
  },
  {
    name: "Async Awakenings",
    artist: "Nina Netcode",
    cover:
      "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    name: "The Art of Reusability",
    artist: "Lena Logic",
    cover:
      "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
  {
    name: "Async Awakenings",
    artist: "Nina Netcode",
    cover:
      "https://images.unsplash.com/photo-1468817814611-b7edf94b5d60?w=300&dpr=2&q=80",
  },
  {
    name: "The Art of Reusability",
    artist: "Lena Logic",
    cover:
      "https://images.unsplash.com/photo-1528143358888-6d3c7f67bd5d?w=300&dpr=2&q=80",
  },
  {
    name: "Stateful Symphony",
    artist: "Beth Binary",
    cover:
      "https://images.unsplash.com/photo-1490300472339-79e4adc6be4a?w=300&dpr=2&q=80",
  },
]

export default async function MysteryPage() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-4 sm:grid-cols-2">
        {/* <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" /> */}
        {/* <div className="flex space-x-4 pb-4"> */}
        <div className="col-span-full">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Trending
              </h2>
              <p className="text-sm text-muted-foreground">
                Discover the most captivating mysteries everyone’s unraveling right now.
              </p>
            </div>
          </div>
          <Separator className="mt-3" />
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4 pb-5">
              {listenNowAlbums.map((album) => <div className="space-y-3 cursor-pointer transition-all hover:scale-105">
                <div className="overflow-hidden rounded-md">
                  <Image
                    src={album.cover}
                    alt={album.name}
                    width={250}
                    height={300}
                    className={cn(
                      "h-[300px] w-full object-cover transition-all hover:scale-105 aspect-square",
                    )}
                  />
                </div>

                <div className="space-y-1 text-sm">
                  <h3 className="font-medium leading-none">{album.name}</h3>
                  <p className="text-xs text-muted-foreground">{album.artist}</p>
                </div>
              </div>
              )}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-4 sm:grid-cols-2">
        {/* <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" />
                <div className="aspect-video rounded-xl bg-muted/50" /> */}
        {/* <div className="flex space-x-4 pb-4"> */}
        <div className="col-span-full">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Categories
              </h2>
              <p className="text-sm text-muted-foreground">
                Dive into diverse categories, each with its own mystery.
              </p>
            </div>
          </div>
          <Separator className="mt-3" />
          <div className="flex justify-center max-w-fit pt-4">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-9/12 sm:w-5/6 lg:w-11/12"
          >
            <CarouselPrevious className="-left-10 -mt-5"/>
            <CarouselContent>
              {listenNowAlbums.map((album, index) =>
                <CarouselItem key={index} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                  <div className="space-y-3 cursor-pointer transition-all p-1">
                    <div className="overflow-hidden rounded-md">
                      <Image
                        src={album.cover}
                        alt={album.name}
                        width={200}
                        height={200}
                        className={cn(
                          "h-[200px] w-full object-cover transition-all hover:scale-105 aspect-square",
                        )}
                      />
                    </div>

                    <div className="space-y-1 text-sm">
                      <h3 className="font-medium leading-none">{album.name}</h3>
                      <p className="text-xs text-muted-foreground">{album.artist}</p>
                    </div>
                  </div></CarouselItem>
              )}
            </CarouselContent>
            <CarouselNext className="-right-10 -mt-5"/>
          </Carousel>
        </div>
        </div>
      </div>
    </>
  );
}
