import { CheckCircle2, Star } from "lucide-react";
import Link from "next/link";

interface PriceCardProps {
  title: string;
  subtitle?: string;
  price: string;
  previousPrice?: string;
  features: string[];
  isPopular?: boolean;
  color?: "gold" | "blue" | "navy" | "green";
  buttonText?: string;
  onButtonClick?: () => void;
  badge?: string;
  link?: string;
  footerText?: string;
}

export function PriceCard({
  title,
  subtitle,
  price,
  previousPrice,
  features,
  isPopular = false,
  color = "navy",
  buttonText = "Choisir cette formule",
  badge,
  link,
  footerText
}: PriceCardProps) {
  const getColors = () => {
    switch (color) {
      case "gold":
        return {
          bg: "bg-slate-900",
          border: "border-gold-500",
          text: "text-white",
          accent: "text-gold-500",
          button: "bg-gold-500 hover:bg-gold-400 text-slate-900",
          badge: "bg-gold-500 text-slate-900"
        };
      case "blue":
        return {
          bg: "bg-slate-900",
          border: "border-blue-500",
          text: "text-white",
          accent: "text-blue-500",
          button: "bg-blue-500 hover:bg-blue-400 text-white",
          badge: "bg-blue-500 text-white"
        };
      case "green":
          return {
            bg: "bg-slate-900",
            border: "border-green-500",
            text: "text-white",
            accent: "text-green-500",
            button: "bg-green-600 hover:bg-green-500 text-white",
            badge: "bg-green-500 text-slate-900"
          };
      default: // navy
        return {
          bg: "bg-white",
          border: "border-slate-200",
          text: "text-slate-900",
          accent: "text-slate-900",
          button: "bg-slate-900 hover:bg-slate-800 text-white",
          badge: "bg-slate-900 text-white"
        };
    }
  };

  const style = getColors();
  
  // Use importing Link from next/link is required if using Link component, but PriceCard file doesn't import it at the top.
  // I must check imports at top of file. 
  // Wait, I am replacing the content block. I should make sure I can use Link.
  // Actually, simpler to just return a button if no link, or an <a> tag if link.
  // Or better, let's assume the caller uses a wrapper if they want, OR I add `import Link from "next/link";` at top.
  // Let's modify the imports first in a separate replace call if needed, OR rewrite the whole file component logic here properly.

  return (
    <div className={`relative flex flex-col p-8 rounded-3xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${style.bg} ${style.border} ${isPopular ? "shadow-xl scale-105 z-10" : "shadow-lg"}`}>
      {isPopular && (
        <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-gold-500 to-gold-400 text-slate-900 text-xs font-black uppercase tracking-wider py-2 px-4 rounded-full shadow-lg">
            Meilleure Vente
          </span>
        </div>
      )}

      {badge && (
        <div className={`absolute top-6 right-6 text-xs font-bold uppercase py-1 px-3 rounded-md ${style.badge}`}>
            {badge}
        </div>
      )}

      <div className="mb-6 text-center">
        <h3 className={`text-xl font-black uppercase tracking-wide mb-2 ${style.text}`}>
          {title}
        </h3>
        {subtitle && <p className={`text-sm opacity-80 font-medium ${style.text}`}>{subtitle}</p>}
      </div>

      <div className={`text-center mb-8 pb-8 border-b ${color === "navy" ? "border-slate-100" : "border-white/10"}`}>
        <div className={`flex items-baseline justify-center gap-2 ${style.text}`}>
          <span className="text-4xl lg:text-5xl font-black tracking-tight">{price}</span>
        </div>
        {previousPrice && (
            <span className="text-sm line-through opacity-50 block mt-1">
                {previousPrice}
            </span>
        )}
      </div>

      <ul className="space-y-4 mb-8 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.accent}`} />
            <span className={`text-sm font-medium ${color === "navy" ? "text-slate-600" : "text-gray-300"}`}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {link ? (
        <Link href={link} className={`block w-full text-center py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${style.button}`}>
           {buttonText}
        </Link>
      ) : (
        <button className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${style.button}`}>
          {buttonText}
        </button>
      )}
      {footerText && (
        <p className={`mt-4 text-center text-xs font-medium italic ${color === "navy" ? "text-slate-500" : "text-gray-400"}`}>
          {footerText}
        </p>
      )}
    </div>
  );
}
