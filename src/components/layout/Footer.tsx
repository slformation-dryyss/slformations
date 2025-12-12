import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-white border-t border-slate-200 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative h-10 w-40 md:w-48">
                <Image
                  src="/sl_formations_logo_1.jpg"
                  alt="SL Formations"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            <p className="text-slate-600 mb-4">
              Votre partenaire formation et location pour réussir dans le transport professionnel.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-white text-slate-600 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Formations</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/formations/permis-moto" className="hover:text-gold-500 transition">Permis Moto</Link></li>
              <li><Link href="/formations/permis-auto" className="hover:text-gold-500 transition">Permis Auto</Link></li>
              <li><Link href="/formations/vtc" className="hover:text-gold-500 transition">Formation VTC</Link></li>
              <li><Link href="/formations/taxi" className="hover:text-gold-500 transition">Formation Taxi</Link></li>
              <li><Link href="/formations/ssiap" className="hover:text-gold-500 transition">SSIAP</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Services & Aide</h4>
            <ul className="space-y-2 text-slate-600">
              <li><Link href="/location" className="hover:text-gold-500 transition">Location Véhicules</Link></li>
              <li><Link href="/planning" className="hover:text-gold-500 transition">Planning & Réservation</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-500 transition">Espace Élève</Link></li>
              <li><Link href="/faq" className="hover:text-gold-500 transition">FAQ & Support</Link></li>
              <li><Link href="/legal/cgv" className="hover:text-gold-500 transition">CGV</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-gold-500 transition">Confidentialité</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-slate-900">Contact</h4>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-center space-x-2">
                <MapPin className="text-gold-500 w-5 h-5" />
                <span>123 Avenue de Paris, 75001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-gold-500 w-5 h-5" />
                <span>01 23 45 67 89</span>
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
