import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Props = {
  headline: [string, string];
  kicker: string;
  clipSrc?: string | null;
};

const palette = {
  base: '#16171a',
  line: 'rgba(241, 239, 236, 0.08)',
  orange: '#e8672e',
  paper: '#f1efec',
  muted: '#9a9997',
};

export const StroomHeroTelemetry: React.FC<Props> = ({ headline, kicker, clipSrc }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 120,
      mass: 0.9,
    },
  });

  const copyOpacity = interpolate(frame, [0, 18, 180, 220], [0, 1, 1, 0], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const telemetryRows = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        y: height * (0.28 + index * 0.06),
        phase: index * 0.55,
        weight: index === 2 ? 1.4 : 1,
        alpha: index === 2 ? 0.42 : 0.18,
      })),
    [height],
  );

  const guideColumns = useMemo(
    () => Array.from({ length: 6 }, (_, index) => width * (0.52 + index * 0.09)),
    [width],
  );

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        baseX: width * (0.46 + (index % 6) * 0.08),
        baseY: height * (0.24 + Math.floor(index / 6) * 0.16),
        offset: index * 7,
      })),
    [height, width],
  );

  const resolvedClipSrc = clipSrc ?? staticFile('media/stroom-short-source.mp4');

  return (
    <AbsoluteFill style={{ backgroundColor: palette.base, fontFamily: 'Archivo, Hanken Grotesk, sans-serif' }}>
      {resolvedClipSrc ? (
        <AbsoluteFill style={{ opacity: 0.18, filter: 'grayscale(1) contrast(1.05) brightness(0.45)' }}>
          <OffthreadVideo src={resolvedClipSrc} muted />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(115deg, rgba(0,0,0,0) 0 55%, rgba(232,103,46,0.11) 55% 61%, rgba(0,0,0,0) 61% 100%)',
        }}
      />

      <AbsoluteFill>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {guideColumns.map((x, index) => (
            <line
              key={index}
              x1={x}
              y1={height * 0.18}
              x2={x}
              y2={height}
              stroke={palette.line}
              strokeWidth={1}
            />
          ))}

          {telemetryRows.map((row, index) => {
            const drift = Math.sin(frame / 28 + row.phase) * 14;
            const endDrift = Math.sin(frame / 34 + row.phase) * 10;
            return (
              <path
                key={index}
                d={`M 0 ${row.y} C ${width * 0.2} ${row.y - 20 + drift}, ${width * 0.56} ${row.y + 18 - drift}, ${width} ${row.y + endDrift}`}
                fill="none"
                stroke={`rgba(232, 103, 46, ${row.alpha})`}
                strokeWidth={row.weight}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      <AbsoluteFill>
        {particles.map((particle, index) => {
          const x = particle.baseX + Math.sin((frame + particle.offset) / 18) * 12;
          const y = particle.baseY + Math.cos((frame + particle.offset) / 22) * 8;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: index % 3 === 0 ? 4 : 2,
                height: index % 3 === 0 ? 4 : 2,
                background: palette.orange,
                opacity: 0.55,
              }}
            />
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(22,23,26,0.96) 0 34%, rgba(22,23,26,0.38) 58%, rgba(22,23,26,0.68) 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 170,
          color: palette.orange,
          fontSize: 24,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          opacity: copyOpacity,
          transform: `translateY(${interpolate(intro, [0, 1], [18, 0])}px)`,
        }}
      >
        {kicker}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 292,
          maxWidth: 980,
          color: palette.paper,
          textTransform: 'uppercase',
          lineHeight: 0.93,
          fontWeight: 700,
          fontSize: 126,
          letterSpacing: '-0.03em',
          opacity: copyOpacity,
          transform: `translateY(${interpolate(intro, [0, 1], [40, 0])}px)`,
        }}
      >
        <div>{headline[0]}</div>
        <div style={{ color: palette.orange, marginTop: 10 }}>{headline[1]}</div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 112,
          bottom: 108,
          width: 660,
          padding: '26px 30px 30px',
          background: 'rgba(29,30,34,0.9)',
          border: '1px solid rgba(241, 239, 236, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: palette.muted,
            fontSize: 22,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: palette.orange }}>Stroom Run Sheet</span>
          <span>01 / Current Positioning</span>
        </div>
        <div style={{ width: 420, height: 8, background: palette.orange, marginTop: 22, marginBottom: 24 }} />
        <div
          style={{
            color: palette.paper,
            fontSize: 58,
            lineHeight: 1,
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          <div>Race-day proof</div>
          <div>Supplier trust</div>
          <div>Altitude moat</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
