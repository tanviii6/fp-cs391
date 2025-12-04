/*
  Created By: Christian Gonzalez
*/

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { Heart } from "lucide-react";
import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { logFilm } from "@/lib/watched";
import { toggleLike } from "@/lib/likes";
import { SerializedUser, SerializedFilm } from "@/types/schemas";

// my idea behind the initialData prop is to retrieve loggedFilm in the parent
// and if it exists, then i pass in the data here, so the MovieLogger
// component always shows up to date info
interface MovieLoggerProps {
  user?: SerializedUser;
  film: SerializedFilm;
  initialData?: {
    isWatched?: boolean;
    isLiked?: boolean;
    rating?: number;
  };
}

export default function MovieLogger({
  user,
  film,
  initialData,
}: MovieLoggerProps) {
  const [isWatched, setIsWatched] = useState(initialData?.isWatched || false);
  const [isLiked, setIsLiked] = useState(initialData?.isLiked || false);
  const [rating, setRating] = useState<number>(initialData?.rating || 0);

  const handleRatingChange = async (
    event: React.SyntheticEvent,
    newRating: number | null,
  ) => {
    const ratingValue = newRating ?? 0;
    setRating(ratingValue);

    // save rating to db immediately when changed
    if (user?._id && film._id && newRating !== null) {
      try {
        const result = await logFilm(film._id, user._id, ratingValue);
        if (result.success) {
          setIsWatched(true); // mark as watched when rating is set
        }
      } catch (e) {
        console.error("something went wrong saving rating", e);
      }
    }
  };

  const handleFilmLogging = async () => {
    if (user?._id && film._id) {
      try {
        const result = await logFilm(film._id, user._id, rating);
        if (result.success) {
          setIsWatched(true);
        }
      } catch (e) {
        console.error("something went wrong", e);
      }
    }
  };

  const handleLikeToggle = async (filmId: string, userId: string) => {
    try {
      const result = await toggleLike(filmId, userId);
      if (result.success) {
        setIsLiked(!isLiked);
      }
    } catch (e) {
      console.error("something went wrong", e);
    }
  };

  return (
    <div className="flex flex-1 flex-col ml-20 pt-4 md:pt-12 text-slate-100">
      <Card className="w-[50%] max-w-sm border-none rounded-sm bg-[#455566] text-[#BCD] py-0">
        <CardContent className="px-0">
          {user ? (
            <div className="flex flex-col">
              <div id="top-row" className="grid grid-cols-2">
                <div
                  className="flex flex-col items-center justify-center py-3 cursor-pointer"
                  onClick={handleFilmLogging}
                >
                  <div>
                    {!isWatched ? (
                      <Eye className="scale-125" />
                    ) : (
                      <Eye className="scale-150 fill-green-500 stroke-[#455566]" />
                    )}
                  </div>
                  <div className="text-[13px] py-1">Watched</div>
                </div>
                <div
                  className="flex flex-col items-center justify-center py-3 cursor-pointer"
                  onClick={() => {
                    if (user._id && film._id) {
                      handleLikeToggle(film._id, user._id);
                    }
                  }}
                >
                  <div>
                    {!isLiked ? (
                      <Heart className="scale-125" />
                    ) : (
                      <Heart className="scale-150 fill-[#D8352D] stroke-[#455566]" />
                    )}
                  </div>
                  <div className="text-[13px] py-1">Like</div>
                </div>
              </div>
              <div id="ratings-row" className="grid border-t border-[#678]">
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="text-[13px]">Rate</div>
                  <div className="pt-1">
                    <Rating
                      className="scale-125"
                      icon={<StarIcon />}
                      emptyIcon={<StarIcon />}
                      precision={0.5}
                      sx={{
                        "& .MuiRating-icon": {
                          transition: "none",
                        },
                      }}
                      value={rating}
                      onChange={handleRatingChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <p>Please sign in to rate a film</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
