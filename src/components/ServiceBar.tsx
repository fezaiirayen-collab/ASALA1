import React from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

const services = [
  {
    icon: Truck,
    title: "LIVRAISON RAPIDE",
    subtitle: "Partout en Tunisie",
  },
  {
    icon: RotateCcw,
    title: "RETOURS FACILES",
    subtitle: "Sous 14 jours",
  },
  {
    icon: ShieldCheck,
    title: "PAIEMENT SÉCURISÉ",
    subtitle: "100% sécurisé",
  },
];

const ServiceBar: React.FC = () => {
  return (
    <section className="h-[76px] w-full bg-white border-b border-black/10 select-none sm:h-[90px]">
      <div className="grid h-full w-full grid-cols-3 divide-x divide-black/10">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="flex min-w-0 items-center justify-center gap-1.5 px-1.5 py-2 sm:gap-3.5 sm:px-4 sm:py-4"
            >
              <Icon size={19} strokeWidth={1.3} className="h-5 w-5 shrink-0 text-black sm:h-[26px] sm:w-[26px]" />
              <div className="text-left">
                <h3 className="text-[8px] uppercase tracking-[0.06em] font-medium leading-tight text-black sm:text-[11px] sm:tracking-[0.14em]">
                  {service.title}
                </h3>
                <p className="mt-0.5 text-[8px] leading-tight text-stone font-normal sm:text-[11px]">
                  {service.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ServiceBar;
