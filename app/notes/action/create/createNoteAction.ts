"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createNote } from "@/lib/api";

export async function createNoteAction(formData: FormData) {
  const note = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    tag: formData.get("tag") as string,
  };

  await createNote(note);
  revalidateTag("notes"); 
  redirect("/");
}
