import { AccessToken } from "livekit-server-sdk";
import { NextRequest } from "next/server";

// GET /api/livekit/token?roomName=...&participantIdentity=...&participantName=...&metadata=...
// Returns: { serverUrl, participantToken }
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const roomName = searchParams.get("roomName");
  const participantIdentity = searchParams.get("participantIdentity");
  const participantName = searchParams.get("participantName") ?? participantIdentity;
  const metadata = searchParams.get("metadata") ?? undefined;

  if (!roomName || !participantIdentity) {
    return Response.json(
      { error: "roomName and participantIdentity are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const serverUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !serverUrl) {
    return Response.json(
      { error: "LiveKit environment variables not configured" },
      { status: 500 }
    );
  }

  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
    name: participantName ?? participantIdentity,
    metadata,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  const participantToken = await at.toJwt();

  return Response.json({ serverUrl, participantToken });
}
