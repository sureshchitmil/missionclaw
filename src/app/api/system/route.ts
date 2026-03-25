import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  try {
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const totalGB = (totalMemory / (1024 * 1024 * 1024)).toFixed(1);
    const usedGB = (usedMemory / (1024 * 1024 * 1024)).toFixed(1);
    
    return NextResponse.json({
      totalMemory: totalGB,
      usedMemory: usedGB,
      percentage: Math.round((usedMemory / totalMemory) * 100),
    });
  } catch (error) {
    return NextResponse.json({ error: "Cannot get system info" }, { status: 500 });
  }
}