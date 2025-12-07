/**
 * Created by: Jude Hosmer + Ron Bajrami
 */
"use client"

import * as React from "react"
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]

type CarouselProps = {
  opts?: Parameters<typeof useEmblaCarousel>[0]
  plugins?: Parameters<typeof useEmblaCarousel>[1]
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
} & React.ComponentProps<"div">

type CarouselContextProps = {
  carouselRef: any
  api: CarouselApi
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
  orientation: "horizontal" | "vertical"
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)
const useCarousel = () => React.useContext(CarouselContext)!

export function Carousel({
  orientation = "horizontal",
  opts,
  plugins,
  setApi,
  className,
  children,
  ...props
}: CarouselProps) {
  // Embla expects an axis string, so map our orientation to x/y.
  const axis = orientation === "horizontal" ? "x" : "y"
  const [carouselRef, api] = useEmblaCarousel({ ...opts, axis }, plugins)
  const [canScrollPrev, setPrev] = React.useState(false)
  const [canScrollNext, setNext] = React.useState(false)

  // Track button enabled/disabled state based on current scroll position.
  const update = React.useCallback(() => {
    if (!api) return
    setPrev(api.canScrollPrev())
    setNext(api.canScrollNext())
  }, [api])

  const scrollPrev = () => api?.scrollPrev()
  const scrollNext = () => api?.scrollNext()

  React.useEffect(() => {
    if (!api) return
    setApi?.(api)
    update()
    // Keep controls in sync as the carousel reinitializes or selection changes.
    api.on("select", update).on("reInit", update)
    return () => api.off("select", update)
  }, [api, update, setApi])

  // Allow keyboard arrows to move the carousel when focused.
  const handleKeys = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") scrollPrev()
    if (e.key === "ArrowRight") scrollNext()
  }

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <div
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={handleKeys}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, orientation } = useCarousel()
  const isHorizontal = orientation === "horizontal"

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        // Negative margin offsets each slide's padding so edges stay flush.
        className={cn("flex", isHorizontal ? "-ml-4" : "-mt-4 flex-col", className)}
        {...props}
      />
    </div>
  )
}

export function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel()
  const pad = orientation === "horizontal" ? "pl-4" : "pt-4"

  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 basis-full", pad, className)}
      {...props}
    />
  )
}

export function CarouselPrevious({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()
  // Adjust control placement depending on scroll direction.
  const pos = orientation === "horizontal"
    ? "top-1/2 -left-12 -translate-y-1/2"
    : "-top-12 left-1/2 -translate-x-1/2 rotate-90"

  return (
    <Button
      {...props}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn("absolute size-8 rounded-full", pos, className)}
    >
      <ArrowLeft />
      <span className="sr-only">Previous</span>
    </Button>
  )
}

export function CarouselNext({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()
  // Adjust control placement depending on scroll direction.
  const pos = orientation === "horizontal"
    ? "top-1/2 -right-12 -translate-y-1/2"
    : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90"

  return (
    <Button
      {...props}
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn("absolute size-8 rounded-full", pos, className)}
    >
      <ArrowRight />
      <span className="sr-only">Next</span>
    </Button>
  )
}

export type { CarouselApi }
