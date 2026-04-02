import React from "react";
import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { Resend } from "resend";
import { z } from "zod";

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);
    const {
      success: zodSuccess,
      data: zodData,
      error: zodError,
    } = Email.safeParse(body);
    
    if (!zodSuccess)
      return Response.json({ error: zodError?.message }, { status: 400 });

    if (!process.env.RESEND_API_KEY) {
      console.log("RESEND_API_KEY is not set. Simulating a successful email send.");
      return Response.json({ data: { id: "simulated_id" } });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [config.email],
      subject: "Contact me from portfolio",
      react: (
        <EmailTemplate
          fullName={zodData.fullName}
          email={zodData.email}
          message={zodData.message}
        />
      ) as React.ReactElement,
    });

    if (resendError) {
      return Response.json({ error: resendError.message }, { status: 500 });
    }

    return Response.json({ data: resendData });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
