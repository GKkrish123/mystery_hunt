import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";
import { adminAuth } from "firebase-king";
import {
  getHiddenGemsByUrl,
  getHunterTrailById,
  updateToolTrail,
} from "@/server/api/helpers/query";
import { type HunterTrail } from "@/server/model/hunter-trails";

interface UserData {
  uid: string;
  hunterId: string;
}

async function authenticate(req: NextRequest): Promise<UserData | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const userTokenData = await adminAuth.verifyIdToken(token, true);
    return {
      uid: userTokenData.uid,
      hunterId: userTokenData.name as string,
    };
  } catch (error) {
    console.error("Authentication failed:", JSON.stringify(error));
    return null;
  }
}

async function fetchHunterTrail(hunterId: string): Promise<HunterTrail | null> {
  const hunterTrailDoc = await getHunterTrailById(hunterId);
  if (!hunterTrailDoc.exists()) {
    console.error("Hunter trail not found:", hunterId);
    return null;
  }
  return hunterTrailDoc.data() as HunterTrail;
}

const PayloadSchema = z.object({
  url: z.string().url(),
  tool: z.enum(["torch", "eye", "brush", "axe"]),
  content: z.string().min(1, "Content cannot be empty"),
  attributes: z
    .string()
    .transform((val) => JSON.parse(val) as Record<string, string[]>),
});

export async function GET(req: NextRequest) {
  try {
    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hunterTrailsData = await fetchHunterTrail(user.hunterId);
    if (!hunterTrailsData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { trails: hunterTrailsData.interactions.tools || {} },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET handler:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, unknown>;
    const validationResult = PayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const user = await authenticate(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hunterTrailsData = await fetchHunterTrail(user.hunterId);
    if (!hunterTrailsData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url, attributes, content, tool } = validationResult.data;
    const toolsTrails = hunterTrailsData.interactions.tools || {};
    const now = Date.now();
    const lastUsed = toolsTrails[tool];

    if (lastUsed && now - lastUsed < 5 * 60 * 1000) {
      return NextResponse.json(
        { success: false, message: "try-later", trails: toolsTrails },
        { status: 400 },
      );
    }

    await updateToolTrail(user.hunterId, tool, now);
    const gems = await getHiddenGemsByUrl(url, tool);

    if (!gems) {
      return NextResponse.json(
        {
          success: false,
          message: "not-found",
          trails: { ...toolsTrails, [tool]: now },
        },
        { status: 400 },
      );
    }

    const trueGem = gems.find(
      (gem) =>
        content.includes(gem.textMatch) &&
        Object.entries(gem.attributeMatch).every(
          ([key, values]) =>
            Array.isArray(attributes[key]) &&
            values.every((value) => attributes[key]?.includes(value)),
        ),
    );

    if (!trueGem) {
      return NextResponse.json(
        {
          success: false,
          message: "not-found",
          trails: { ...toolsTrails, [tool]: now },
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "found",
        html: trueGem.gem,
        trails: { ...toolsTrails, [tool]: now },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST handler:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
