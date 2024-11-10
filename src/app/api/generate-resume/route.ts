import Docxtemplater from "docxtemplater";
import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import PizZip from "pizzip";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const answers = await request.json();
    console.log("Received answers:", answers);

    const templatePath = path.join(
      process.cwd(),
      "public",
      "resume-template.docx"
    );
    const templateContent = await readFile(templatePath);

    const zip = new PizZip(templateContent);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      fullname: answers.fullName || "",
      email: answers.email || "",
      phone: answers.phone || "",
      position: answers.position || "",
      experience: answers.experience || "",
      education: answers.education || "",
      skills: answers.skills || "",
      motivation: answers.motivation || "",
      availability: answers.availability || "",
      salaryExpectations: answers.salaryExpectations || "",
    });

    const buffer = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    const encodedFilename = encodeURIComponent(answers.fullName)
      .replace(/['()]/g, escape)
      .replace(/\*/g, "%2A")
      .replace(/%(?:7C|60|5E)/g, unescape);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodedFilename}.docx`,
      },
    });
  } catch (error: any) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json(
      { error: "Failed to generate DOCX", details: error.message },
      { status: 500 }
    );
  }
}
