import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSST() {
  console.log('🏥 Creating SST (Sauveteurs Secouristes du Travail) course...');

  try {
    // Create the main SST course
    const sstCourse = await prisma.course.create({
      data: {
        title: 'Formation SST - Sauveteurs Secouristes du Travail (Initiale)',
        slug: 'formation-sst-initiale',
        description: 'Formation certifiante pour devenir Sauveteur Secouriste du Travail. Apprenez à intervenir efficacement face à une situation d\'accident et à contribuer à la prévention des risques professionnels.',
        type: 'SECOURISME',
        duration: 14, // 14 heures (2 jours)
        price: 250,
        level: 'BEGINNER',
        isPublished: true,
        imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
        
        modules: {
          create: [
            // Module 1: Introduction et cadre juridique
            {
              title: 'Introduction et cadre juridique',
              description: 'Comprendre le rôle du SST et le cadre juridique de son intervention',
              orderIndex: 1,
              lessons: {
                create: [
                  {
                    title: 'Présentation de la formation SST',
                    content: `# Bienvenue dans la formation SST

## Objectifs de la formation

À l'issue de cette formation, vous serez capable de :
- Intervenir efficacement face à une situation d'accident
- Mettre en application vos compétences en matière de prévention
- Contribuer à la santé et sécurité dans votre entreprise

## Public concerné
Toute personne motivée par l'évolution de son entreprise (groupe de 4 à 10 personnes).

## Prérequis
Aucun prérequis obligatoire.

## Durée
2 jours soit 14 heures de face à face pédagogique.`,
                    orderIndex: 1,
                    duration: 30,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Le cadre juridique de l\'intervention du SST',
                    content: `# Cadre juridique de l'intervention

## Dans l'entreprise
- Connaître les éléments fixant le cadre juridique de votre intervention
- Comprendre vos droits et devoirs en tant que SST
- Identifier les limites de votre intervention

## En dehors de l'entreprise
- Connaître les éléments fixant le cadre juridique hors entreprise
- Comprendre le devoir d'assistance à personne en danger
- Savoir mobiliser vos connaissances lors de votre intervention

## Points clés
✓ Protection du sauveteur
✓ Responsabilité civile et pénale
✓ Secret professionnel
✓ Obligation de porter secours`,
                    orderIndex: 2,
                    duration: 45,
                    type: 'TEXT',
                  },
                ],
              },
            },

            // Module 2: Domaine de compétences 1 - Intervention
            {
              title: 'Domaine de compétences 1 - Protéger, Examiner, Alerter, Secourir',
              description: 'Maîtriser les gestes de premiers secours et l\'intervention d\'urgence',
              orderIndex: 2,
              lessons: {
                create: [
                  {
                    title: 'Réaliser une protection adaptée',
                    content: `# Protection adaptée

## Mesures de protection
- Mettre en œuvre les mesures de protection décrites dans le processus d'alerte aux populations
- Reconnaître les dangers persistants sans s'exposer soi-même

## Identifier les dangers
### Types de dangers :
- **Mécanique** : chute d'objets, écrasement, coupure
- **Électrique** : électrocution, électrisation
- **Incendie, explosion, thermique** : brûlures, asphyxie
- **Atmosphère toxique ou irrespirable** : intoxication, asphyxie

## Actions de protection
1. **Supprimer le danger** (si possible)
2. **Isoler le danger** (baliser, signaler)
3. **Soustraire la victime au danger** (dégagement d'urgence)

⚠️ **Important** : Ne jamais se mettre en danger soi-même !`,
                    orderIndex: 1,
                    duration: 60,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Examiner la victime',
                    content: `# Examen de la victime

## Ordre de recherche des signes
Suivre un ordre déterminé pour détecter les signes vitaux :

### 1. La victime saigne-t-elle abondamment ?
→ Hémorragie externe

### 2. La victime s'étouffe-t-elle ?
→ Obstruction des voies aériennes

### 3. La victime répond-elle et se plaint-elle ?
→ Malaise, brûlure, traumatisme, plaie

### 4. La victime respire-t-elle ?
→ Inconscience, arrêt cardiaque

## Priorisation
En cas de plusieurs signes, définir l'ordre de priorité :
1. Hémorragie
2. Étouffement
3. Inconscience
4. Autres détresses`,
                    orderIndex: 2,
                    duration: 45,
                    type: 'TEXT',
                  },
                  {
                    title: 'Faire alerter ou alerter',
                    content: `# Alerte des secours

## Éléments du message d'alerte
1. **Qui** : Vous identifier
2. **Où** : Localisation précise (adresse, étage, repères)
3. **Quoi** : Nature de l'accident
4. **Combien** : Nombre de victimes
5. **État** : État apparent des victimes
6. **Gestes** : Gestes effectués

## Organisation de l'alerte
- Identifier qui alerter selon l'organisation de l'entreprise
- Choisir la personne la plus apte pour déclencher l'alerte
- Transmettre efficacement le message

## Numéros d'urgence
- **15** : SAMU
- **18** : Pompiers
- **112** : Numéro d'urgence européen
- **114** : Numéro d'urgence pour sourds et malentendants`,
                    orderIndex: 3,
                    duration: 30,
                    type: 'TEXT',
                  },
                  {
                    title: 'Secourir - Saignement abondant',
                    content: `# Saignement abondant

## Conduite à tenir
1. **Allonger** la victime
2. **Comprimer** directement la plaie avec la main
3. **Faire alerter** les secours
4. **Maintenir** la compression jusqu'à l'arrivée des secours

## Cas particuliers
### Saignement de nez
- Asseoir la victime, tête penchée en avant
- Comprimer les narines pendant 10 minutes
- Ne pas allonger la victime

### Vomissement ou crachat de sang
- Allonger la victime en position latérale de sécurité
- Alerter immédiatement les secours

### Autres saignements
- Oreille : ne pas obstruer le conduit
- Bouche : faire cracher, ne pas rincer`,
                    orderIndex: 4,
                    duration: 60,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Secourir - Étouffement',
                    content: `# Étouffement (obstruction des voies aériennes)

## Obstruction totale
La victime ne peut ni parler, ni tousser, ni respirer.

### Chez l'adulte et l'enfant
1. **5 claques dans le dos** (entre les omoplates)
2. Si inefficace : **5 compressions abdominales** (manœuvre de Heimlich)
3. Alterner claques et compressions jusqu'à désobstruction

### Chez le nourrisson
1. **5 claques dans le dos**
2. Si inefficace : **5 compressions thoraciques**
3. Alterner jusqu'à désobstruction

## Obstruction partielle
La victime peut parler et tousser.
→ Encourager à tousser, ne pas intervenir, surveiller`,
                    orderIndex: 5,
                    duration: 60,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Secourir - Malaise',
                    content: `# Malaise

## Signes d'un malaise
- Sensations pénibles
- Signes anormaux (pâleur, sueurs, douleur)
- Modification du comportement

## Conduite à tenir
1. **Mettre au repos** (position confortable)
2. **Questionner** la victime
3. **Alerter** les secours (15 ou 112)
4. **Surveiller** jusqu'à l'arrivée des secours

## Cas particuliers

### Accident Vasculaire Cérébral (AVC)
**Signes** : VITE
- **V**isage paralysé
- **I**ncapacité à bouger un membre
- **T**rouble de la parole
- **E**viter de perdre du temps → appeler le 15

### Malaise cardiaque
**Signes** :
- Douleur thoracique
- Essoufflement
- Pâleur, sueurs
→ Appeler immédiatement le 15`,
                    orderIndex: 6,
                    duration: 45,
                    type: 'TEXT',
                  },
                  {
                    title: 'Secourir - Brûlures',
                    content: `# Brûlures

## Brûlures thermiques
1. **Arroser** abondamment à l'eau (15-20 minutes)
2. **Retirer** les vêtements (sauf si collés)
3. **Protéger** avec un linge propre
4. **Alerter** selon la gravité

## Brûlures chimiques
1. **Arroser** abondamment (au moins 20 minutes)
2. **Retirer** les vêtements imprégnés
3. **Alerter** les secours
4. **Identifier** le produit chimique

## Cas particuliers
### Brûlures électriques
- Couper le courant avant d'intervenir
- Alerter systématiquement (lésions internes possibles)

### Brûlures internes (inhalation/ingestion)
- Ne rien donner à boire
- Alerter immédiatement le 15`,
                    orderIndex: 7,
                    duration: 60,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Secourir - Traumatismes',
                    content: `# Traumatismes

## Douleur empêchant certains mouvements
### Conduite à tenir
1. **Éviter** de mobiliser la zone douloureuse
2. **Protéger** contre le froid
3. **Alerter** les secours
4. **Surveiller** la victime

### Cas particuliers
- Traumatisme du dos/nuque : ne pas mobiliser
- Fracture ouverte : ne pas toucher l'os
- Entorse : immobiliser, appliquer du froid

## Plaie ne saignant pas abondamment
1. **Se laver** les mains
2. **Nettoyer** la plaie (eau et savon)
3. **Protéger** avec un pansement
4. **Alerter** si plaie grave (profonde, étendue, souillée)`,
                    orderIndex: 8,
                    duration: 45,
                    type: 'TEXT',
                  },
                  {
                    title: 'Secourir - Victime inconsciente qui respire',
                    content: `# Victime inconsciente qui respire

## Position Latérale de Sécurité (PLS)

### Objectifs
- Maintenir les voies aériennes ouvertes
- Permettre l'écoulement des liquides
- Faciliter la respiration

### Technique
1. **Préparer** : retirer lunettes, ceinture
2. **Positionner** le bras proche du corps
3. **Saisir** le bras opposé et la jambe opposée
4. **Retourner** la victime sur le côté
5. **Ajuster** la position (tête en arrière, bouche ouverte vers le sol)
6. **Alerter** les secours
7. **Surveiller** la respiration jusqu'à l'arrivée des secours

⚠️ **Important** : Vérifier régulièrement que la victime respire toujours`,
                    orderIndex: 9,
                    duration: 60,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Secourir - Arrêt cardiaque et RCP',
                    content: `# Arrêt cardiaque - Réanimation Cardio-Pulmonaire

## Reconnaître un arrêt cardiaque
- La victime ne répond pas
- La victime ne respire pas (ou respiration anormale)

## Conduite à tenir
1. **Alerter** immédiatement (ou faire alerter)
2. **Débuter** la RCP sans délai
3. **Utiliser** le défibrillateur dès disponible

## Réanimation Cardio-Pulmonaire (RCP)

### Chez l'adulte
- **30 compressions thoraciques** (centre du thorax, 5-6 cm de profondeur)
- **2 insufflations** (bouche-à-bouche)
- Rythme : 100-120 compressions/minute
- Continuer jusqu'à l'arrivée des secours ou reprise de conscience

### Chez l'enfant (1-8 ans)
- Même technique, compressions moins profondes (4-5 cm)
- Utiliser une seule main si nécessaire

### Chez le nourrisson (moins de 1 an)
- Compressions avec 2 doigts (4 cm de profondeur)
- Insufflations bouche-à-bouche-et-nez`,
                    orderIndex: 10,
                    duration: 90,
                    type: 'VIDEO',
                  },
                  {
                    title: 'Utilisation du Défibrillateur Automatisé Externe (DAE)',
                    content: `# Défibrillateur Automatisé Externe (DAE)

## Qu'est-ce qu'un DAE ?
Appareil permettant de délivrer un choc électrique pour relancer le cœur en cas d'arrêt cardiaque.

## Utilisation
1. **Allumer** le défibrillateur
2. **Suivre** les instructions vocales
3. **Coller** les électrodes sur la peau nue
   - Une sous la clavicule droite
   - Une sous l'aisselle gauche
4. **Laisser** le DAE analyser le rythme cardiaque
5. **Ne pas toucher** la victime pendant l'analyse
6. **Appuyer** sur le bouton choc si demandé
7. **Reprendre** immédiatement la RCP après le choc

## Points importants
✓ Sécher la peau si mouillée
✓ Raser si nécessaire (poils abondants)
✓ Retirer les patchs médicamenteux
✓ Ne jamais arrêter la RCP sauf instruction du DAE

## Cas particuliers
- Enfant 1-8 ans : électrodes pédiatriques si disponibles
- Nourrisson : défibrillation possible mais non prioritaire`,
                    orderIndex: 11,
                    duration: 60,
                    type: 'VIDEO',
                  },
                ],
              },
            },

            // Module 3: Domaine de compétences 2 - Prévention
            {
              title: 'Domaine de compétences 2 - Prévention des risques professionnels',
              description: 'Contribuer à la prévention des risques dans l\'entreprise',
              orderIndex: 3,
              lessons: {
                create: [
                  {
                    title: 'Rôle du SST dans la prévention',
                    content: `# Rôle du SST dans la prévention

## Notions de base en prévention

### Définitions
- **Danger** : propriété intrinsèque d'un produit, équipement, situation
- **Situation dangereuse** : exposition à un danger
- **Dommage** : blessure, maladie, décès
- **Événement dangereux** : situation pouvant causer un dommage
- **Accident du Travail (AT)** : accident survenu par le fait du travail
- **Maladie Professionnelle (MP)** : maladie contractée du fait du travail

## Importance de la prévention
- Identifier la nature et l'importance des AT/MP dans votre entreprise
- Comprendre les enjeux humains et économiques
- Connaître les statistiques de votre branche professionnelle

## Le SST, acteur de la prévention
Vous êtes un maillon essentiel de la chaîne de prévention !`,
                    orderIndex: 1,
                    duration: 30,
                    type: 'TEXT',
                  },
                  {
                    title: 'Les acteurs de la prévention',
                    content: `# Les acteurs de la prévention

## Acteurs internes
- **Direction** : responsabilité de la sécurité
- **CSSCT** : représentants du personnel
- **Médecine du travail** : surveillance médicale
- **Responsables hiérarchiques** : application des consignes
- **SST** : intervention et remontée d'informations

## Acteurs externes
- **CARSAT** : prévention et contrôle
- **Inspection du travail** : contrôle réglementaire
- **INRS** : recherche et documentation
- **Services de prévention** : conseil et accompagnement

## Articulation de votre action
- Comprendre votre place dans l'organisation
- Savoir à qui remonter les informations
- Collaborer avec les autres acteurs`,
                    orderIndex: 2,
                    duration: 30,
                    type: 'TEXT',
                  },
                  {
                    title: 'Repérer les situations dangereuses',
                    content: `# Repérer les situations dangereuses

## Méthode d'observation
1. **Observer** l'environnement de travail
2. **Identifier** les dangers potentiels
3. **Repérer** les personnes exposées
4. **Imaginer** les scénarios d'accidents possibles

## Types de dangers à identifier
### Dangers mécaniques
- Chutes de hauteur
- Chutes de plain-pied
- Heurts, écrasements
- Coupures, perforations

### Dangers physiques
- Bruit
- Vibrations
- Températures extrêmes
- Rayonnements

### Dangers chimiques
- Produits toxiques
- Produits corrosifs
- Poussières

### Dangers biologiques
- Virus, bactéries
- Moisissures

### Dangers psychosociaux
- Stress
- Harcèlement
- Violence`,
                    orderIndex: 3,
                    duration: 45,
                    type: 'TEXT',
                  },
                  {
                    title: 'Contribuer à la suppression des risques',
                    content: `# Contribuer à la suppression des risques

## Hiérarchie des mesures de prévention

### 1. Supprimer le danger
→ Solution la plus efficace
Exemple : remplacer un produit dangereux par un produit sans danger

### 2. Isoler le danger
→ Protections collectives
Exemple : garde-corps, capotage de machine

### 3. Protéger les personnes
→ Équipements de Protection Individuelle (EPI)
Exemple : casque, gants, chaussures de sécurité

## Votre rôle
- **Proposer** des actions de prévention
- **Informer** votre hiérarchie
- **Participer** aux démarches de prévention
- **Être force de proposition**

⚠️ Ne pas agir seul, toujours informer !`,
                    orderIndex: 4,
                    duration: 30,
                    type: 'TEXT',
                  },
                  {
                    title: 'Informer et rendre compte',
                    content: `# Informer et rendre compte

## Qui informer ?
Selon l'organisation de votre entreprise :
- Responsable hiérarchique direct
- Responsable sécurité
- CSSCT
- Médecine du travail

## Quoi transmettre ?
### Éléments à communiquer
1. **Description** de la situation dangereuse
2. **Localisation** précise
3. **Personnes exposées**
4. **Risques identifiés**
5. **Propositions d'amélioration**

## Comment transmettre ?
- Utiliser les outils de l'entreprise (fiche de remontée, logiciel)
- Être factuel et précis
- Proposer des solutions
- Assurer un suivi

## Rendre compte des actions
- Informer des actions mises en œuvre
- Vérifier l'efficacité des mesures
- Continuer la surveillance`,
                    orderIndex: 5,
                    duration: 30,
                    type: 'TEXT',
                  },
                ],
              },
            },

            // Module 4: Mise en pratique et évaluation
            {
              title: 'Mise en pratique et évaluation',
              description: 'Exercices pratiques et évaluation des compétences',
              orderIndex: 4,
              lessons: {
                create: [
                  {
                    title: 'Cas pratiques - Situations d\'urgence',
                    content: `# Cas pratiques - Situations d'urgence

## Objectifs
Mettre en application les compétences acquises à travers des mises en situation réalistes.

## Déroulement
Vous serez confronté à différents scénarios d'accidents :
- Hémorragie externe
- Étouffement
- Malaise
- Brûlure
- Traumatisme
- Inconscience
- Arrêt cardiaque

## Évaluation
Chaque geste sera évalué selon :
- La protection
- L'examen de la victime
- L'alerte
- Le secours approprié

## Critères de réussite
✓ Sécurité du sauveteur et de la victime
✓ Pertinence des gestes
✓ Efficacité de l'intervention
✓ Communication avec les secours`,
                    orderIndex: 1,
                    duration: 120,
                    type: 'EXERCISE',
                  },
                  {
                    title: 'Cas pratiques - Prévention',
                    content: `# Cas pratiques - Prévention

## Objectifs
Identifier et proposer des actions de prévention dans des situations de travail.

## Exercices
### Analyse de situations de travail
- Observer une situation
- Identifier les dangers
- Repérer les personnes exposées
- Proposer des mesures de prévention

### Transmission d'informations
- Rédiger une fiche de remontée d'information
- Présenter une situation dangereuse
- Proposer des solutions

## Évaluation
✓ Pertinence de l'analyse
✓ Qualité des propositions
✓ Clarté de la communication`,
                    orderIndex: 2,
                    duration: 90,
                    type: 'EXERCISE',
                  },
                  {
                    title: 'Évaluation certificative',
                    content: `# Évaluation certificative

## Modalités d'évaluation
L'évaluation porte sur les 8 compétences du référentiel SST.

### Épreuves
1. **Mise en situation d'accident** (cas concret)
   - Protection
   - Examen
   - Alerte
   - Secours

2. **Mise en situation de travail** (prévention)
   - Repérage des dangers
   - Propositions d'actions
   - Transmission d'informations

## Critères de validation
Pour obtenir le certificat SST, vous devez :
- Participer activement à l'ensemble de la formation
- Obtenir une évaluation favorable sur les 8 compétences

## Certification
### En cas de réussite
→ Certificat de Sauveteur Secouriste du Travail
→ Validité : 24 mois

### En cas d'échec partiel
→ Attestation de suivi de formation
→ Possibilité de repasser l'évaluation

## Maintien et Actualisation des Compétences (MAC)
⚠️ **Important** : Pour que votre certificat reste valide, vous devez suivre une session MAC tous les 24 mois (7 heures de formation).`,
                    orderIndex: 3,
                    duration: 120,
                    type: 'QUIZ',
                  },
                ],
              },
            },

            // Module 5: Ressources et documents
            {
              title: 'Ressources et documents de référence',
              description: 'Documents officiels et ressources complémentaires',
              orderIndex: 5,
              lessons: {
                create: [
                  {
                    title: 'Documents de référence',
                    content: `# Documents de référence

## Documents INRS
- Guide des données techniques et conduites à tenir
- Document de référence SST
- Aide-mémoire SST (ED 4085)
- Plan d'Intervention

## Ressources en ligne
- Site INRS : www.inrs.fr
- Rubrique SST
- Vidéos pédagogiques
- Fiches pratiques

## Applications mobiles
- Appli "Sauv Life" : alerte citoyenne
- Appli "Staying Alive" : localisation des défibrillateurs

## Numéros utiles
- **15** : SAMU
- **18** : Pompiers
- **112** : Urgence européenne
- **114** : Urgence sourds/malentendants
- **196** : Urgence maritime
- **197** : Alerte attentat`,
                    orderIndex: 1,
                    duration: 15,
                    type: 'TEXT',
                  },
                  {
                    title: 'Après la formation - Maintien des compétences',
                    content: `# Après la formation

## Maintien et Actualisation des Compétences (MAC SST)

### Périodicité
Tous les **24 mois** maximum

### Durée
7 heures minimum (1 jour)

### Objectifs du MAC
- Actualiser vos connaissances
- Réviser les gestes de secours
- Intégrer les évolutions réglementaires
- Maintenir votre certificat valide

## En attendant le MAC
### Restez à jour
- Consultez régulièrement les ressources INRS
- Participez aux exercices d'évacuation
- Restez vigilant dans votre entreprise

### Pratiquez
- Repérez les défibrillateurs
- Identifiez les situations dangereuses
- Proposez des améliorations

### Informez-vous
- Suivez l'actualité de la prévention
- Échangez avec d'autres SST
- Participez aux réunions sécurité

## Votre rôle continue !
Être SST, c'est un engagement quotidien pour la sécurité de tous.`,
                    orderIndex: 2,
                    duration: 15,
                    type: 'TEXT',
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log('✅ SST course created successfully!');
    console.log(`   - Course ID: ${sstCourse.id}`);
    console.log(`   - Slug: ${sstCourse.slug}`);
    console.log(`   - 5 modules created`);
    console.log(`   - 20+ lessons created`);

  } catch (error) {
    console.error('❌ Error creating SST course:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedSST();
    console.log('\n🎉 SST seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
