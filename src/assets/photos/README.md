# Photos

All photos live in `library/`. They're auto-discovered and shown in the
Photos app, no code changes needed to add one.

- The **Library** tab shows every photo in `library/`.
- The **Views & Travel** and **People** tabs show subsets, tagged by filename
  in `src/App.tsx` (`TRAVEL_PHOTOS`, `PEOPLE_PHOTOS`, `FAVORITE_PHOTOS`).

## Adding a photo

1. Drop an image into `library/` (`.jpg`, `.jpeg`, `.png`, `.webp`).
   HEIC isn't web-friendly, so convert first, e.g.
   `sips -s format jpeg -Z 1600 IMG_1234.HEIC --out library/photo-35.jpg`
2. To put it in an album, add its filename to the matching set in `src/App.tsx`.

Photos are displayed sorted by filename, so prefix names to control order,
e.g. `photo-01.jpg`, `photo-02.jpg`.
