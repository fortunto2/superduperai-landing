import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'File Status';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

interface Props {
  params: {
    fileId: string;
  };
}

export default async function Image({ params }: Props) {
  const { fileId } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #333 2%, transparent 0%), radial-gradient(circle at 75px 75px, #333 2%, transparent 0%)',
          backgroundSize: '100px 100px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111',
            border: '1px solid #333',
            borderRadius: '16px',
            padding: '60px',
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
            }}
          >
            📁 File Status
          </div>
          
          <div
            style={{
              fontSize: 24,
              color: '#888',
              marginBottom: '30px',
            }}
          >
            Track your AI file generation progress
          </div>
          
          <div
            style={{
              fontSize: 18,
              color: '#666',
              fontFamily: 'monospace',
              backgroundColor: '#222',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid #333',
            }}
          >
            {fileId}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
} 