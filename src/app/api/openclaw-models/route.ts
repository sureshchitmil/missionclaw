import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";

export async function GET() {
  try {
    const configPath = join(homedir(), ".openclaw", "openclaw.json");
    const content = await readFile(configPath, "utf-8");
    const config = JSON.parse(content);
    
    const models = config?.models?.providers?.kilocode?.models || [];
    const modelList = models.map((m: { id: string; name: string }) => ({
      id: m.id,
      name: m.name || m.id,
    }));
    
    return NextResponse.json({
      available: true,
      provider: "kilocode",
      models: modelList,
    });
  } catch (error) {
    return NextResponse.json({ 
      available: false, 
      models: [], 
      error: "Cannot read OpenClaw config" 
    }, { status: 200 });
  }
}