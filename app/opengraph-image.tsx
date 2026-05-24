import { ImageResponse } from 'next/og';

export const alt = 'Prairie Oak Dental Studio — A calmer kind of dental visit. South Calgary.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F6F1E8',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Accent rule */}
        <div
          style={{
            width: '48px',
            height: '3px',
            background: '#D97757',
            marginBottom: '28px',
          }}
        />

        {/* Practice name */}
        <div
          style={{
            fontSize: '22px',
            color: '#7A8593',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}
        >
          Prairie Oak Dental Studio
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: '72px',
            color: '#1F2E40',
            fontWeight: 600,
            lineHeight: 1.05,
            maxWidth: '820px',
            marginBottom: '28px',
          }}
        >
          A calmer kind of dental visit.
        </div>

        {/* Tagline pills row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            'Weighted blankets',
            'Direct billing',
            'Same-day emergencies',
            'South Calgary',
          ].map((label) => (
            <div
              key={label}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5DCC8',
                borderRadius: '999px',
                padding: '8px 18px',
                fontSize: '18px',
                color: '#445567',
                fontWeight: 500,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Bottom-right rating badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '72px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="#C9A464"
              style={{ marginRight: '6px' }}
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <div style={{ fontSize: '22px', color: '#C9A464', fontWeight: 600 }}>
              4.9
            </div>
          </div>
          <div
            style={{ width: '1px', height: '22px', background: '#E5DCC8' }}
          />
          <div style={{ fontSize: '16px', color: '#7A8593' }}>
            312 Google Reviews
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
