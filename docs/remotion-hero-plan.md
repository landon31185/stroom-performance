# Stroom Remotion Hero Plan

## Goal

Create a short hero film system for `Stroom Performance` that can work in three modes:

1. Pure motion-graphics telemetry loop
2. Jake footage plus telemetry overlays
3. Social and export variants from the same visual language

## Current scaffold

- Remotion entry: `remotion/index.ts`
- Root: `remotion/Root.tsx`
- First composition: `remotion/compositions/StroomHeroTelemetry.tsx`
- Render command: `npm run remotion:render:hero`
- Future site video slot:
  - `src/components/HeroFilmLayer.astro`
  - `site.heroFilm` config in `src/lib/site.ts`

## Direction

The footage should feel like evidence, not like a promo reel:

- dark
- slowed down
- silent
- overlaid with timing-board and telemetry language
- always subordinate to the homepage headline

## Recommended first source clips

Choose 1 to 3 clips from Jake's channel with:

- burnout smoke or launch haze
- side-angle staging or track prep texture
- in-car or trackside moments with strong light contrast

Avoid:

- bright daylight wide shots with lots of visual clutter
- long talking-head sections
- anything that reads like a normal YouTube embed

## Next implementation steps

1. Pull a short local clip into `public/media/stroom-hero-loop.mp4`
2. Set `site.heroFilm.enabled` to `true`
3. Tune opacity, crop, and playback feel in the homepage
4. Feed the same clip into the Remotion composition as `clipSrc`
5. Render:
   - homepage loop
   - square social cut
   - vertical short-form cut
