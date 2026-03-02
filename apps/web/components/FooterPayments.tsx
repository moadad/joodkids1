import Image from "next/image";

const icons = [
  { key: "vodafone", label: "Vodafone Cash", src: "/payments/vodafone.png" },
  { key: "etisalat", label: "Etisalat Cash", src: "/payments/etisalat.png" },
  { key: "orange", label: "Orange Cash", src: "/payments/orange.png" },
  { key: "instapay", label: "InstaPay", src: "/payments/instapay.png" },
  { key: "cash", label: "Cash", src: "/payments/cash.png" },
];

export default function FooterPayments() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {icons.map(i => (
        <div key={i.key} title={i.label} className="h-10 w-10 rounded-xl border border-zinc-200 bg-white flex items-center justify-center overflow-hidden">
          <Image src={i.src} alt={i.label} width={32} height={32} />
        </div>
      ))}
    </div>
  );
}
