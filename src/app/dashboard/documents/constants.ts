export type DocType = "ID_CARD" | "DRIVING_LICENSE" | "JUSTIF_DOMICILE" | "PHOTO" | "RIB" | "NEPH" | "OTHER";

export const REQUIRED_DOCS: { type: DocType; label: string }[] = [
    { type: "ID_CARD", label: "Pièce d'Identité (CNI, Passeport, Titre de Séjour)" },
    { type: "DRIVING_LICENSE", label: "Permis de Conduire" },
    { type: "JUSTIF_DOMICILE", label: "Justificatif de Domicile (< 3 mois)" },
    { type: "PHOTO", label: "Photo d'identité" },
    { type: "RIB", label: "RIB (Relevé d'Identité Bancaire)" },
];

export const OPTIONAL_DOCS: { type: DocType; label: string; description?: string }[] = [
    {
        type: "NEPH",
        label: "Numéro NEPH (Inscription Préfecture)",
        description: "Document attestant de votre numéro NEPH (ex: Attestation d'inscription, dossier CERFA)."
    },
    {
        type: "OTHER",
        label: "Autre document",
        description: "Tout autre document complémentaire utile à votre dossier."
    },
];

