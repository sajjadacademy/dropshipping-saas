export const dynamic = 'force-dynamic';

export default function DebugPage() {
    return (
        <div style={{ padding: '50px', color: 'white' }}>
            <h1>Debug Page</h1>
            <p>If you see this, Next.js routing is working correctly.</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
