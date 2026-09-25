import React from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Accordion: React.FC<Props> = ({ title, open, onToggle, children }) => (
  <div className="border-b border-ink/15">
    <button onClick={onToggle} className="w-full flex items-center justify-between py-5 text-left text-[11px] uppercase tracking-[0.16em]">
      {title}
      <ChevronDown size={17} strokeWidth={1.4} className={`transition-transform ${open ? "rotate-180" : ""}`} />
    </button>
    {open && <div className="pb-5 text-[13px] leading-relaxed text-ink/75">{children}</div>}
  </div>
);

export default Accordion;
