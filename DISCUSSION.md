# Discussion

## Search

- I decided to move the search to the BE. There is not enough data to warrant that at the moment, but in the long run it would mean less overfetching and have a significant impact on performance. I also built out pagination support. Both of these of course end up complicating things and require re-fetching on search, but that could be ameliorated with a cache.
