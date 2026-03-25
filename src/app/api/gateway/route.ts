import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if gateway is reachable on port 18789
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch("http://127.0.0.1:18789/", {
      method: "HEAD",
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (response.ok || response.status === 200) {
      return NextResponse.json({ 
        connected: true, 
        url: "http://127.0.0.1:18789",
        status: "running"
      });
    }
    
    return NextResponse.json({ connected: false, error: "Gateway not responding" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ connected: false, error: "Cannot connect to gateway" }, { status: 500 });
  }
}