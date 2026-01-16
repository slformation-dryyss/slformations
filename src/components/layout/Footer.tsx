import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Ghost, Video } from "lucide-react";
import { prisma } from "@/lib/prisma";

import { SystemSetting } from "@prisma/client";

export async function Footer() {
  let settingsList: SystemSetting[] = [];
  try {
    settingsList = await prisma.systemSetting.findMany({
      where: {
        key: {
          in: [
            "CONTACT_PHONE",
            "CONTACT_ADDRESS",
            "CONTACT_EMAIL",
            "SOCIAL_FACEBOOK",
            "SOCIAL_INSTAGRAM",
            "SOCIAL_LINKEDIN",
            "SOCIAL_SNAPCHAT",
            "SOCIAL_TIKTOK"
          ]
        }
      }
    });
  } catch (error) {
    console.warn("Failed to fetch system settings in Footer (likely due to missing tables during build):", error);
    // Silent fail to allow build to pass - will use defaults below
  }

  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const address = settings["CONTACT_ADDRESS"] || "41 av République 77340 Pontault Combault";
  const phone = settings["CONTACT_PHONE"] || "01 60 28 54 18";
  const email = settings["CONTACT_EMAIL"] || "contact@sl-formations.fr";

  return (
    <footer id="footer" className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-10 w-40 md:w-48">
                <Image
                  src="/logo.svg"
                  alt="SL Formations"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              Votre partenaire formation pour réussir dans le transport professionnel.
            </p>
            <div className="flex space-x-4">
              {settings["SOCIAL_FACEBOOK"] && (
                <a href={settings["SOCIAL_FACEBOOK"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings["SOCIAL_INSTAGRAM"] && (
                <a href={settings["SOCIAL_INSTAGRAM"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings["SOCIAL_LINKEDIN"] && (
                <a href={settings["SOCIAL_LINKEDIN"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {settings["SOCIAL_SNAPCHAT"] && (
                <a href={settings["SOCIAL_SNAPCHAT"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                  <Ghost className="w-5 h-5" />
                </a>
              )}
              {settings["SOCIAL_TIKTOK"] && (
                <a href={settings["SOCIAL_TIKTOK"]} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition" title="TikTok">
                  <Video className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Formations</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/formations/recuperation-points" className="hover:text-gold-500 transition">Récupération de Points</Link></li>
              <li><Link href="/formations/vtc" className="hover:text-gold-500 transition">VTC / Taxi</Link></li>
              <li><Link href="/formations/caces" className="hover:text-gold-500 transition">CACES®</Link></li>
              <li><Link href="/formations/secourisme" className="hover:text-gold-500 transition">Secourisme (SST)</Link></li>
              <li><Link href="/formations/incendie" className="hover:text-gold-500 transition">Sécurité Incendie</Link></li>
              <li><Link href="/formations/habilitation-electrique" className="hover:text-gold-500 transition">Habilitation Élec.</Link></li>
              <li><Link href="/formations/catalogue" className="font-medium text-gold-600 hover:underline transition mt-2 inline-block">Tout le catalogue</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Services & Aide</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/nos-plannings" className="hover:text-gold-500 transition">Planning & Réservation</Link></li>
              <li><Link href="/faq" className="hover:text-gold-500 transition">FAQ & Support</Link></li>
              <li><Link href="/legal/cgv" className="hover:text-gold-500 transition">CGV</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-gold-500 transition">Confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Contact</h4>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start space-x-2">
                <MapPin className="text-gold-500 w-5 h-5 mt-1 flex-shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-gold-500 w-5 h-5 flex-shrink-0" />
                <span>{phone}</span>
              </li>
              <li className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <Mail className="text-gold-500 w-5 h-5 flex-shrink-0" />
                  <a href="mailto:info@sl-formations.fr" className="hover:text-gold-500 font-medium">info@sl-formations.fr</a>
                </div>
                <p className="text-[10px] text-slate-400 pl-7 leading-tight italic">
                  Informations, Inscriptions & Documents
                </p>
              </li>
              <li className="mt-4">
                <Link href="/contact" className="inline-block text-gold-500 hover:underline">
                  Nous envoyer un message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} SL Formations. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}

