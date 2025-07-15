"use client";

import css from "./NoteForm.module.css";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNoteAction } from "@/app/notes/action/create/createNoteAction";

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft } = useNoteStore();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", draft.title);
      formData.append("content", draft.content);
      formData.append("tag", draft.tag);
      await createNoteAction(formData);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      setDraft({ title: "", content: "", tag: "Todo" });
      router.push("/");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await mutateAsync();
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          value={draft.title}
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDraft({ ...draft, title: e.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDraft({ ...draft, content: e.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setDraft({ ...draft, tag: e.target.value })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
