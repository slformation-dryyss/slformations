# 🚀 Guide Rapide : Ajouter le Modèle PaymentLink

## Étape 1 : Ouvrir le fichier
Ouvrez `prisma/schema.prisma` dans votre éditeur

## Étape 2 : Trouver l'emplacement
Cherchez le modèle `DataExportRequest` (vers la ligne 106-121)

## Étape 3 : Copier-coller
Juste APRÈS la fermeture du modèle `DataExportRequest` (après le `}`), 
collez ce code :

```prisma
// Liens de paiement Stripe pour paiements différés
model PaymentLink {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  courseId    String?
  course      Course?  @relation(fields: [courseId], references: [id], onDelete: SetNull)
  
  stripeUrl   String   // URL du Stripe Payment Link
  amount      Float    // Montant en euros
  status      String   @default("PENDING") // PENDING, PAID, EXPIRED, CANCELLED
  
  expiresAt   DateTime?
  paidAt      DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([courseId])
}
```

## Étape 4 : Sauvegarder
Sauvegardez le fichier (Ctrl+S)

## Étape 5 : Migrer
Dans le terminal, exécutez :
```bash
npx prisma db push
```

## ✅ C'est tout !
Une fois fait, rechargez la page admin et le générateur de liens de paiement fonctionnera parfaitement !
