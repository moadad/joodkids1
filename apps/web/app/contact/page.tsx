import ContactClient from "./ui";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">تواصل معنا</h1>
      <p className="text-sm text-zinc-600 mt-1">روابط التواصل ومواقعنا يتم إدارتها من لوحة التحكم.</p>
      <div className="mt-6">
        <ContactClient />
      </div>
    </div>
  );
}
