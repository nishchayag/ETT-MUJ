import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import connectDB from "@/lib/db";
import DocumentModel from "@/models/Document";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { extractTextFromPdf } from "@/lib/pdf";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 },
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 },
      );
    }

    // Ensure upload directory exists
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${safeName}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Connect to database
    await connectDB();

    // Get user ID from database
    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create document record
    const document = await DocumentModel.create({
      userId: user._id,
      name: file.name.replace(/\.pdf$/i, ""),
      originalName: file.name,
      filePath: filename,
      fileSize: file.size,
      mimeType: file.type,
      status: "processing",
    });

    // Extract text from PDF (async, don't block response)
    extractPdfText(document._id.toString(), buffer).catch(console.error);

    return NextResponse.json({
      success: true,
      document: {
        id: document._id,
        name: document.name,
        status: document.status,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 },
    );
  }
}

async function extractPdfText(documentId: string, buffer: Buffer) {
  try {
    await connectDB();

    const result = await extractTextFromPdf(buffer);

    await DocumentModel.findByIdAndUpdate(documentId, {
      extractedText: result.text,
      pageCount: result.pageCount,
      status: "ready",
    });

    console.log(`PDF text extracted for document ${documentId}`);
  } catch (error) {
    console.error(`PDF extraction error for ${documentId}:`, error);

    await DocumentModel.findByIdAndUpdate(documentId, {
      status: "error",
    });
  }
}

// GET - List user's documents
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const User = (await import("@/models/User")).default;
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const documents = await DocumentModel.find({ userId: user._id })
      .select("-extractedText")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Fetch documents error:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 },
    );
  }
}
