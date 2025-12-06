import Link from "next/link";
import { GraduationCap, Facebook, Instagram, Linkedin, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="bg-navy-900 border-t border-navy-700 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-gold-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-navy-900 w-6 h-6" />
              </div>
              <span className="text-xl font-bold">
                DriveAcademy<span className="text-gold-500">Pro</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Votre partenaire formation et location pour réussir dans le transport professionnel.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Formations</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/formations/permis-moto" className="hover:text-gold-500 transition">Permis Moto</Link></li>
              <li><Link href="/formations/permis-auto" className="hover:text-gold-500 transition">Permis Auto</Link></li>
              <li><Link href="/formations/vtc" className="hover:text-gold-500 transition">Formation VTC</Link></li>
              <li><Link href="/formations/taxi" className="hover:text-gold-500 transition">Formation Taxi</Link></li>
              <li><Link href="/formations/ssiap" className="hover:text-gold-500 transition">SSIAP</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/location" className="hover:text-gold-500 transition">Location Véhicules</Link></li>
              <li><Link href="/planning" className="hover:text-gold-500 transition">Planning & Réservation</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold-500 transition">Espace Élève</Link></li>
              <li><Link href="/paiement" className="hover:text-gold-500 transition">Paiement en ligne</Link></li>
              <li><Link href="/support" className="hover:text-gold-500 transition">Support 7j/7</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center space-x-2">
                <MapPin className="text-gold-500 w-5 h-5" />
                <span>123 Avenue de Paris, 75001</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-gold-500 w-5 h-5" />
                <span>01 23 45 67 89</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
