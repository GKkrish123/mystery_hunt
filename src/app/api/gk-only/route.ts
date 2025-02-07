import { z } from "zod";
import { type NextRequest, NextResponse } from "next/server";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  where,
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
  question: z.string().min(1),
  hints: z.array(z.string()),
  maxTries: z.number().int().min(1),
  expectedSecret: z.string().min(1).toLowerCase(),
  achievement: z.string().min(1).optional(),
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
    audios: z.array(z.string()),
    links: z.array(
      z.object({
        thumbnail: z.string().url(),
        url: z.string().url(),
      }),
    ),
  }),
  scheduledAt: z.string(),
});

const CategorySchema = z.object({
  name: z.string().min(3).max(30),
  searchKeywords: z.array(z.string().min(3).max(30)),
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

async function uploadImage(fileName: string, imgString: string) {
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

async function deleteFiles(files: string[]) {
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
      searchKeywords: [...category.searchKeywords, category.name].flatMap(
        (keyword) => generateNGrams(keyword),
      ),
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
    const mysterySecretMapping: Record<
      string,
      { secret: string; achievement: string }
    > = {};

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
        mysterySecretMapping[mysteryDoc.id] = {
          secret: mystery.expectedSecret,
          achievement: mystery.achievement!,
        };
        delete mystery.achievement;
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

      Object.entries(mysterySecretMapping).forEach(
        ([mysteryId, { secret, achievement }]) => {
          const secretDoc = doc(
            db,
            MysteryCollections.secretChamber,
            mysteryId,
          );
          transaction.set(secretDoc, { secret, achievement });
        },
      );

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

    const indexRequired: string[] = [];
    for (const event of newEventIds) {
      try {
        const fetchEventHuntersQuery = query(
          collection(db, "hunters"),
          where("disabled", "==", false),
          where("emailVerified", "==", true),
          orderBy(`scoreBoard.eventScores.${event}`, "desc"),
          orderBy(`scoreBoard.eventsLastScoredAt.${event}`, "asc"),
        );
        await getDocs(fetchEventHuntersQuery);
      } catch (error) {
        const errMsg = `EVENT - "${event}" FETCH ERROR!!!: ${(error as Error).message}`;
        console.error(errMsg);
        indexRequired.push(errMsg);
      }
    }

    return NextResponse.json(
      {
        success: true,
        indexRequired,
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
    console.error("Error in GK ONLY handler:", (error as Error).message);
    if (uploadedImages.length) {
      await deleteFiles(uploadedImages);
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 404 },
    );
  }
}
