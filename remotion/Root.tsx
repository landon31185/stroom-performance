import React from 'react';
import { Composition } from 'remotion';
import { StroomHeroTelemetry } from './compositions/StroomHeroTelemetry';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StroomHeroTelemetry"
        component={StroomHeroTelemetry}
        width={1920}
        height={1080}
        fps={30}
        durationInFrames={240}
        defaultProps={{
          headline: ['BUILT FOR THE RUNS WHERE', 'THIN AIR EXPOSES BAD PARTS.'],
          kicker: 'High-altitude no-prep and index racing',
          clipSrc: '/media/stroom-short-source.mp4',
        }}
      />
    </>
  );
};
