# Discussion

## Search

I decided to move the search to the BE. There is not enough data to warrant that at the moment, but in the long run it would mean less overfetching and have a significant impact on performance. I also built out pagination support. Both of these of course end up complicating things and require re-fetching on search, but that could be ameliorated with a cache.

Debounces to avoid continous new requests on typing in search bar. However, it is still a little flashy, would be worth animating transitions, fixing table height and so on.

## Fetch

`useSWR` is standard enough I forgot it wasn't bundled with `create-next-app`

## Icons

I like `lucide-react`, threw some in there.

## Testing

Uses jest + testing-library. Decently covers some FE unit test territory inclusive of some rendered components and hooks.

BE is very slim, setting up a fake DB/sqllite is out of scope.

## Didn't get to

would be neat to

- sort tables
- add an index to to the db (maybe trigram for the like search)
- the specialty pills could technically be infinite in size, should truncate
- probably more ag-grid territory: make columns moveable, optional, resizable etc. Even filter and aggregatable would have been simple. Should have just started there really.
- pretty bare-bones design, just default tailwind
