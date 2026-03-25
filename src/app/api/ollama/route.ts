import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const baseUrl = searchParams.get("url") || "http://localhost:11434";
  
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${baseUrl}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    
    if (response.ok) {
      const data = await response.json();
      const models = data.models?.map((m: { name: string }) => m.name) || [];
      return NextResponse.json({
        available: true,
        url: baseUrl,
        models,
      });
    }
    
    return NextResponse.json({ available: false, models: [], error: "Ollama not responding" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ available: false, models: [], error: "Cannot connect to Ollama" }, { status: 200 });
  }
}