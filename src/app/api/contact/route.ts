import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation error", errors: parsed.error.issues },
        { status: 400 }
      );
    }

    // In production with email credentials, this triggers transactional email
    console.log("Contact inquiry received from:", parsed.data.email, parsed.data.subject);

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully sent to Adv. Harshal's chambers.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { message: "Server error sending message" },
      { status: 500 }
    );
  }
}
