import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";
import {
  arrayUnion,
  collection,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "firebase-user";
import { MysteryCollections } from "@/server/constants";
import { generateNGrams } from "@/server/api/helpers/mystery";
import GraphemeSplitter from "grapheme-splitter";
import { headers } from "next/headers";
import { firebaseAdminApp } from "firebase-king";

const SHHHH = "dhoni-07";

const MysterySchema = z.object({
  title: z.string().min(3).max(50),
  searchKeywords: z.array(z.string().min(3).max(50)),
  description: z.string().max(100),
  question: z.string(),
  hints: z.array(z.string()),
  maxTries: z.number().int().min(1),
  expectedSecret: z.string().min(1),
  linkedEvent: z.string(),
  maxPoints: z.number().int().positive(),
  minPoints: z.number().int().positive(),
  preFindCooldown: z.number().int().positive(),
  preFindCooldownCut: z.number().int().positive(),
  postFindCooldown: z.number().int().positive(),
  postFindCooldownCut: z.number().int().positive(),
  tags: z.array(z.string()).min(1),
  retryInterval: z.number().int().positive(),
  attachments: z.object({
    photos: z.array(z.string()).min(1),
  }),
  scheduledAt: z.string(),
});

const CategorySchema = z.object({
  name: z.string().min(3).max(30),
  description: z.string().max(100),
  tag: z.string().min(3).max(30),
  themePicUrl: z.string(),
  scheduledAt: z.string(),
});

const EventSchema = z.object({
  name: z.string().min(3).max(50),
  imageUrl: z.string().url(),
  scheduledFrom: z.string(),
  scheduledTo: z.string(),
  expiresAt: z.string(),
});

const PayloadSchema = z.object({
  events: z.array(EventSchema),
  categories: z.array(CategorySchema),
  mysteries: z.array(MysterySchema),
});

export async function uploadImage(fileName: string, imgString: string) {
  const buffer = Buffer.from(imgString?.split(",")?.[1] ?? "", "base64");
  const maxSizeInBytes = 100 * 1024;
  if (buffer.length > maxSizeInBytes) {
    throw new Error("File size exceeds 100 KB limit.", {
      cause: "file-size-exceeds-limit",
    });
  }

  const storage = firebaseAdminApp.storage();
  const bucket = storage.bucket("gkrish-mystery-hunt.firebasestorage.app");
  const file = bucket.file(fileName);
  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  await file.makePublic();
  return file.publicUrl();
}

export async function deleteFiles(files: string[]) {
  const storage = firebaseAdminApp.storage();
  const bucket = storage.bucket("gkrish-mystery-hunt.firebasestorage.app");
  for (const file of files) {
    const deleteFile = bucket.file(file);
    await deleteFile.delete({
      ignoreNotFound: true,
    });
  }
}

export async function POST(req: NextRequest) {
  const uploadedImages: string[] = [];
  try {
    const reqHeaders = await headers();
    if (
      process.env.NODE_ENV === "production" ||
      reqHeaders.get("secret-gk") !== SHHHH
    ) {
      return NextResponse.json({ error: "No No No No" }, { status: 400 });
    }

    const now = new Date();
    const body = (await req.json()) as Record<string, unknown>;
    const validationResult = PayloadSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Ohh Mistake - ", JSON.stringify(validationResult.error));
      return NextResponse.json({ error: "Invalid !!" }, { status: 400 });
    }

    const splitter = new GraphemeSplitter();
    const newMysteries = validationResult.data.mysteries.map((mystery) => ({
      ...mystery,
      solvedBy: [],
      guessCount: 0,
      solvedCount: 0,
      searchKeywords: [...mystery.searchKeywords, mystery.title].flatMap(
        (keyword) => generateNGrams(keyword),
      ),
      description:
        mystery.description ||
        `${splitter.splitGraphemes(mystery.question).slice(0, 15).join("")}...`,
      scheduledAt: new Date(mystery.scheduledAt),
      createdAt: now,
      updatedAt: now,
    }));
    const newCategories = validationResult.data.categories.map((category) => ({
      ...category,
      scheduledAt: new Date(category.scheduledAt),
      createdAt: now,
      updatedAt: now,
    }));
    const newEvents = validationResult.data.events.map((event) => ({
      ...event,
      mysteries: [],
      scheduledFrom: new Date(event.scheduledFrom),
      scheduledTo: new Date(event.scheduledTo),
      expiresAt: new Date(event.expiresAt),
      createdAt: now,
      updatedAt: now,
    }));

    const newMysteryIds: string[] = [];
    const newCategoryIds: string[] = [];
    const newEventIds: string[] = [];
    const eventMysteryMapping: Record<string, string[]> = {};
    const mysterySecretMapping: Record<string, string> = {};

    await runTransaction(db, async (transaction) => {
      for (const mystery of newMysteries) {
        const mysteryDoc = doc(collection(db, MysteryCollections.mysteries));
        const attachments = {
          photos: await Promise.all(
            mystery.attachments.photos.map(async (file, index) => {
              const imgName = `mysteries/${mysteryDoc.id}_${index + 1}.jpeg`;
              const uploadedImage = await uploadImage(imgName, file);
              uploadedImages.push(imgName);
              return uploadedImage;
            }),
          ),
        };
        mysterySecretMapping[mysteryDoc.id] = mystery.expectedSecret;
        const expectedSecret = splitter
          .splitGraphemes(mystery.expectedSecret)
          .map((_) => "*")
          .join(" ");
        transaction.set(mysteryDoc, {
          ...mystery,
          expectedSecret,
          attachments,
          thumbnailUrl: attachments.photos[0],
        });
        newMysteryIds.push(mysteryDoc.id);
        if (mystery.linkedEvent) {
          eventMysteryMapping[mystery.linkedEvent] = [
            ...(eventMysteryMapping[mystery.linkedEvent] ?? []),
            mysteryDoc.id,
          ];
        }
      }

      Object.entries(mysterySecretMapping).forEach(([mysteryId, secret]) => {
        const secretDoc = doc(db, MysteryCollections.secretChamber, mysteryId);
        transaction.set(secretDoc, { secret });
      });

      for (const category of newCategories) {
        const categoryDoc = doc(collection(db, MysteryCollections.categories));
        const imgName = `categories/${categoryDoc.id}.jpeg`;
        const themePicUrl = await uploadImage(imgName, category.themePicUrl);
        uploadedImages.push(imgName);
        transaction.set(categoryDoc, { ...category, themePicUrl });
        newCategoryIds.push(categoryDoc.id);
      }

      for (const event of newEvents) {
        const eventDoc = doc(db, MysteryCollections.events, event.name);
        const imgName = `events/${eventDoc.id}.jpeg`;
        const imageUrl = await uploadImage(imgName, event.imageUrl);
        uploadedImages.push(imgName);
        transaction.set(eventDoc, {
          ...event,
          mysteries: eventMysteryMapping[event.name] ?? [],
          imageUrl,
        });
        newEventIds.push(eventDoc.id);
      }

      Object.entries(eventMysteryMapping).forEach(([event, mysteries]) => {
        if (!newEventIds.includes(event)) {
          const eventDoc = doc(db, MysteryCollections.events, event);
          transaction.update(eventDoc, {
            mysteries: arrayUnion(...mysteries),
          });
        }
      });
    });

    return NextResponse.json(
      {
        success: true,
        message: "All Done",
        mysteries: newMysteryIds,
        categories: newCategoryIds,
        events: newEventIds,
        eventMysteryMapping,
        uploadedImages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(
      "Error in GK ONLY handler:",
      JSON.stringify((error as Error).message),
    );
    if (uploadedImages.length) {
      await deleteFiles(uploadedImages);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 404 },
    );
  }
}
