// app/admin/posts/AdminPostForm.tsx
"use client";

import { useForm } from "react-hook-form";

type PostType =
  | "POPUP"
  | "EVENT_UPCOMING"
  | "EVENT_POLAROID"
  | "GM"
  | "OFFICER";

type FormValues = {
  type: PostType;
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  year?: string;
  quarter?: string;
};

const seasonAliases: Record<string, string> = {
  fall: "Fall", f: "Fall", "1": "Fall", q1: "Fall", autumn: "Fall",
  winter: "Winter", w: "Winter", "2": "Winter", q2: "Winter",
  spring: "Spring", s: "Spring", "3": "Spring", q3: "Spring",
  summer: "Summer", su: "Summer", "4": "Summer", q4: "Summer",
};
function normalizeQuarter(input?: string) {
  if (!input) return "";
  const key = input.trim().toLowerCase().replace(/\s+/g, "");
  return seasonAliases[key] ?? "";
}

export default function AdminPostForm() {
  const { register, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { type: "POPUP", imageUrl: "" },
  });

  const type = watch("type");

  const onSubmit = async (values: FormValues) => {
    if (!values.imageUrl?.trim()) { alert("Image URL is required."); return; }
  
    const normQ = (q?: string) => {
      const m: Record<string,string> = {
        fall:"Fall", f:"Fall", "1":"Fall", q1:"Fall", autumn:"Fall",
        winter:"Winter", w:"Winter", "2":"Winter", q2:"Winter",
        spring:"Spring", s:"Spring", "3":"Spring", q3:"Spring",
      };
      const k = (q||"").trim().toLowerCase().replace(/\s+/g,"");
      return m[k] || "";
    };
  
    let body: any = { type: values.type, imageUrl: values.imageUrl.trim() };
  
    if (values.type === "POPUP") {
      if (!values.linkUrl?.trim()) { alert("Link URL required for POPUP."); return; }
      body.linkUrl = values.linkUrl.trim();
    } else if (values.type === "EVENT_UPCOMING") {
      if (!values.linkUrl?.trim()) { alert("Google Form URL required for EVENT_UPCOMING."); return; }
      body.linkUrl = values.linkUrl.trim();
    } else if (values.type === "EVENT_POLAROID") {
      if (!values.title?.trim()) { alert("Title required for EVENT_POLAROID."); return; }
      const q = normQ(values.quarter);
      if (!values.year?.trim()) { alert("Year required for EVENT_POLAROID."); return; }
      if (!q) { alert("Quarter must be Fall/Winter/Spring/Summer."); return; }
      body.title = values.title.trim();
      body.year = values.year.trim();
      body.quarter = q;
      if (values.linkUrl?.trim()) body.linkUrl = values.linkUrl.trim();
    } else if (values.type === "GM") {
      const q = normQ(values.quarter);
      if (!values.year?.trim()) { alert("Year required for GM."); return; }
      if (!q) { alert("Quarter must be Fall/Winter/Spring/Summer."); return; }
      // GM은 title 필요 없음
      body.year = values.year.trim();
      body.quarter = q;
    } else if (values.type === "OFFICER") {
      alert("OFFICER는 전용 폼에서 등록하세요."); return;
    }
  
    console.log("[payload]", body);
  
    const token = (localStorage.getItem("ksea:admintoken") || "dev123").trim();
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Token": token,
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(()=> ({}));
    alert(res.ok ? "Saved ✓" : `${json?.error || "Publish failed"} (status ${res.status})`);
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <label className="block text-sm font-medium">Type</label>
      <select {...register("type")} className="border rounded px-2 py-1 w-full">
        <option value="POPUP">POPUP</option>
        <option value="EVENT_UPCOMING">EVENT_UPCOMING</option>
        <option value="EVENT_POLAROID">EVENT_POLAROID</option>
        <option value="GM">GM</option>
        <option value="OFFICER">OFFICER</option>
      </select>

      {/* Image URL — 모든 타입에서 필요 */}
      <label className="block text-sm font-medium">Image URL</label>
      <input
        {...register("imageUrl", { required: true })}
        placeholder="http://localhost:3000/uploads/example.png"
        className="border rounded px-3 py-2 w-full"
      />

      {/* Title — EVENT_POLAROID에서만 필수, 그 외 선택/비표시 */}
      {type === "EVENT_POLAROID" && (
        <>
          <label className="block text-sm font-medium">Title</label>
          <input
            {...register("title", { required: true })}
            className="border rounded px-3 py-2 w-full"
          />
        </>
      )}

      {/* Link URL — POPUP / EVENT_UPCOMING 필수, EVENT_POLAROID 선택 */}
      {(type === "POPUP" || type === "EVENT_UPCOMING" || type === "EVENT_POLAROID") && (
        <>
          <label className="block text-sm font-medium">
            {type === "EVENT_UPCOMING" ? "Google Form URL" : "Link URL"}
          </label>
          <input
            {...register("linkUrl", {
              required: type === "POPUP" || type === "EVENT_UPCOMING",
            })}
            className="border rounded px-3 py-2 w-full"
            placeholder="https://..."
          />
        </>
      )}

      {/* Year/Quarter — GM & EVENT_POLAROID 필수 */}
      {(type === "GM" || type === "EVENT_POLAROID") && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Year</label>
            <input
              {...register("year", { required: true })}
              className="border rounded px-3 py-2 w-full"
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Quarter (Fall/Winter/Spring/Summer)
            </label>
            <input
              {...register("quarter", { required: true })}
              className="border rounded px-3 py-2 w-full"
              placeholder="Spring"
            />
          </div>
        </div>
      )}

      <button type="submit" className="px-4 py-2 rounded bg-black text-white">
        저장
      </button>
    </form>
  );
}
