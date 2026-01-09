export type DocType = "ID_CARD" | "DRIVING_LICENSE" | "JUSTIF_DOMICILE" | "PHOTO" | "RIB";

export const REQUIRED_DOCS: { type: DocType; label: string }[] = [
    { type: "ID_CARD", label: "Pièce d'Identité (CNI, Passeport, Titre de Séjour)" },
    { type: "DRIVING_LICENSE", label: "Permis de Conduire" },
    { type: "JUSTIF_DOMICILE", label: "Justificatif de Domicile (< 3 mois)" },
    { type: "PHOTO", label: "Photo d'identité" },
    { type: "RIB", label: "RIB (Relevé d'Identité Bancaire)" },
];

