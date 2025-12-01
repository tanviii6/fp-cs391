export default function ProfileContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-[#9ab]">
      <div id="favorites" className="pb-8 grid relative lg:col-span-2">
        <div>
          <h2
            className="text-[13px] tracking-[.075em] pb-1 border-b border-[#9ab]
             mb-3 mx-0"
          >
            FAVORITE FILMS
          </h2>
          {/*
            letterboxd sends you to a settings page, but i don't think we need one
            maybe we can just do a dialog onClick for "favorite films"
          */}
          <p className="text-[15px] leading-1.5">
            Select some of your favorite films!
          </p>
          {/* will render movie cards from mondodb keyed by isFavorite (movie) */}
        </div>
      </div>
      <aside className="pb-8 grid relative lg:col-span-1">
        <h2 className="text-[13px] tracking-[.075em] mb-3 mx-0">SIDEBAR</h2>
        {/*
          once we have ratings, i will add a histogram for all user ratings

          letterboxd also has an mini recent activity panel here, not sure if i will add this
        */}
      </aside>
      <div id="recent-activity" className="pb-8 grid relative lg:col-span-2">
        <div>
          <h2
            className="text-[13px] tracking-[.075em] pb-1 border-b border-[#9ab]
             mb-3 mx-0"
          >
            RECENT ACTIVITY
          </h2>
          {/* will render movie cards by most recent from mondodb (watched) */}
        </div>
      </div>
    </div>
  );
}
