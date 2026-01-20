
import { PrismaClient } from '@prisma/client';

export async function seedSSIAP(prisma: PrismaClient) {
  console.log('🔥 (API) Creating SSIAP formations with detailed content...');

  try {
    const category = await prisma.courseCategory.upsert({
      where: { slug: 'incendie' },
      update: {},
      create: {
        name: 'Incendie',
        slug: 'incendie',
        description: 'Formations Sécurité Incendie (SSIAP, EPI, Évacuation)',
      },
    });

    // Helper for upserting courses
    const upsertCourse = async (slug: string, title: string, description: string, price: number, imageUrl: string) => {
      return prisma.course.upsert({
        where: { slug },
        update: { title, description, type: 'INCENDIE', imageUrl, isPublished: true, price },
        create: { title, slug, description, type: 'INCENDIE', imageUrl, isPublished: true, price },
      });
    };

    // Helper to create modules and lessons
    const createModulesAndLessons = async (courseId: string, modules: any[]) => {
        // Clean up existing modules
        const existingModules = await prisma.module.findMany({ where: { courseId } });
        for (const m of existingModules) {
            await prisma.lesson.deleteMany({ where: { moduleId: m.id } });
        }
        await prisma.module.deleteMany({ where: { courseId } });
    
        let position = 0;
        for (const mod of modules) {
            const createdModule = await prisma.module.create({
                data: {
                    title: mod.title,
                    description: mod.description,
                    courseId: courseId,
                    position: position++,
                    isPublished: true,
                },
            });
    
            let lessonPosition = 0;
            for (const lesson of mod.lessons) {
                await prisma.lesson.create({
                    data: {
                        title: lesson.title,
                        moduleId: createdModule.id,
                        position: lessonPosition++,
                        duration: 3600, 
                        isFree: false,
                        isPublished: true,
                        content: lesson.content,
                        videoUrl: '',
                    },
                });
            }
        }
    };

    // ==========================================
    // SSIAP 1
    // ==========================================

    const ssiap1 = await upsertCourse(
      'ssiap-1-agent-securite-incendie',
      'SSIAP 1 - Agent de Service de Sécurité Incendie',
      `Formation diplômante pour devenir Agent de Service de Sécurité Incendie et d'Assistance à Personnes (SSIAP 1).
      
Objectifs pédagogiques :
- Acquérir les connaissances nécessaires pour assurer la sécurité des personnes et la sécurité incendie des biens.
- Sensibiliser les employés.
- Intervenir face à un début d'incendie.
- Alerter et accueillir les secours.
- Évacuer le public.

Prérequis :
- Aptitude physique (certificat médical < 3 mois).
- Secourisme (SST, PSC1 < 2 ans, ou PSE1).
- Maîtrise de la langue française.`,
      700,
      'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp'
    );

    const modulesSSIAP1 = [
        { 
          title: 'Le feu et ses conséquences', 
          description: 'Comprendre la physique du feu, sa propagation et ses effets', 
          lessons: [
            { title: 'Le feu', content: 'Le tétraèdre du feu.\nLes modes de propagation (conduction, convection, rayonnement).\nLes classes de feux (A, B, C, D, F) et les agents extincteurs.' },
            { title: 'Comportement au feu', content: 'Réaction et résistance au feu.\nClassement M et Euroclasses.\nPotentiel calorifique.' }
          ] 
        },
        { 
          title: 'Sécurité incendie', 
          description: 'Principes fondamentaux de sécurité en ERP et IGH', 
          lessons: [
            { title: 'Principes de classement', content: 'Définition et classement des ERP (types et catégories).\nClassement des IGH.' },
            { title: 'Desserte et voirie', content: 'Accessibilité des secours (voies engins, échelles).\nFaçades et baies accessibles.' },
            { title: 'Cloisonnement', content: 'Principe du compartimentage et du recoupement.\nParois et portes coupe-feu.' },
            { title: 'Évacuation', content: 'Dégagements (nombre et largeur).\nBalisage de sécurité.\nEspaces d\'attente sécurisés.' },
            { title: 'Désenfumage', content: 'Désenfumage naturel et mécanique.\nOuvrants, exutoires et volets.' },
            { title: 'Éclairage de sécurité', content: 'Éclairage d\'évacuation et d\'ambiance (anti-panique).\nSources centrales et blocs autonomes.' },
            { title: 'Moyens de secours', content: 'Extincteurs (types, implantation).\nRobinets d\'Incendie Armés (RIA).\nColonnes sèches et humides.\nSprinkleurs.' },
            { title: 'Système de Sécurité Incendie (SSI)', content: 'Définition et composition (SDI, SMSI).\nLes différentes catégories de SSI.' }
          ] 
        },
        { 
          title: 'Installations techniques', 
          description: 'Fonctionnement des installations techniques', 
          lessons: [
            { title: 'Installations électriques', content: 'Sources d\'énergie et de sécurité.\nTGBT et coupure d\'urgence.\nImpact sur la sécurité incendie.' },
            { title: 'Ascenseurs et nacelles', content: 'Dispositifs de sécurité (appel prioritaire, non-stop).\nUtilisation par les secours.' },
            { title: 'Installations fixes d\'extinction', content: 'Fonctionnement des installations automatiques à eau et à gaz.' },
            { title: 'Colonnes sèches et humides', content: 'Description, utilisation et entretien sommaire.' }
          ] 
        },
        { 
          title: 'Rôle et missions des agents', 
          description: 'Missions quotidiennes de l\'agent SSIAP', 
          lessons: [
            { title: 'Le service de sécurité', content: 'Composition et missions du service.\nHiérarchie et relations fonctionnelles.' },
            { title: 'Présentation des consignes', content: 'Consignes générales et particulières.\nConsignes de sécurité incendie.' },
            { title: 'Main courante', content: 'Rôle juridique et rédaction.\nMain courante électronique et papier.' },
            { title: 'Rondes de sécurité', content: 'Objectifs de la ronde.\nModalités de réalisation et points de contrôle.' },
            { title: 'Surveillance de travaux', content: 'Permis de feu.\nMesures de prévention lors de travaux par points chauds.' },
            { title: 'Mise en œuvre des moyens d\'extinction', content: 'Exercices d\'extinction sur feux réels (bac à feu).\nUtilisation des différents extincteurs.' },
            { title: 'Appel et réception des secours', content: 'Message d\'alerte aux sapeurs-pompiers.\nAccueil et guidage des secours.' }
          ] 
        },
        { 
          title: 'Concrétisation des acquis', 
          description: 'Mises en situation', 
          lessons: [
            { title: 'Visites applicatives', content: 'Visite d\'un site (ERP ou IGH) pour repérage des installations de sécurité.' },
            { title: 'Mises en situation d\'intervention', content: 'Scénarios d\'incendie inopinés.\nGestion d\'alarme, levée de doute et intervention.' }
          ] 
        }
    ];
    await createModulesAndLessons(ssiap1.id, modulesSSIAP1);


    // Recyclage SSIAP 1
    const recyclageSsiap1 = await upsertCourse('recyclage-ssiap-1', 'Recyclage SSIAP 1', 
      'Maintien et actualisation des connaissances pour les agents SSIAP 1 en activité (tous les 3 ans).', 250, 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp');
    
    const modulesRecyclageSSIAP1 = [
        { title: 'Prévention', description: 'Mise à jour réglementaire', lessons: [
            { title: 'Évolution de la réglementation', content: 'Nouveaux textes applicables en matière de sécurité incendie.' },
            { title: 'Accessibilité du public', content: 'Rappel sur les règles d\'accessibilité aux personnes handicapées.' }
        ]},
        { title: 'Moyens de secours', description: 'Évolution technique', lessons: [
            { title: 'Agents extincteurs', content: 'Évolution des agents extincteurs et moyens d\'extinction.' },
            { title: 'Système de Sécurité Incendie (SSI)', content: 'Révision sur le fonctionnement et l\'exploitation du SSI.' }
        ]},
        { title: 'Mises en situation', description: 'Pratique', lessons: [
            { title: 'Action face à différents contextes', content: 'Gestion d\'alarme, évacuation, prise en charge des personnes.' },
            { title: 'Extinction de feux réels', content: 'Exercices pratiques sur feux réels.' }
        ]}
    ];
    await createModulesAndLessons(recyclageSsiap1.id, modulesRecyclageSSIAP1);


    // RAN SSIAP 1
    const ranSsiap1 = await upsertCourse('ran-ssiap-1-remise-a-niveau', 'Remise à niveau SSIAP 1', 
      'Renouvellement des compétences pour les agents SSIAP 1 ne remplissant pas les conditions de recyclage.', 300, 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-RAN_SSIAP1_535x300.webp');

    const modulesRANSSIAP1 = [
        { title: 'Fondamentaux de sécurité', description: 'Révisions', lessons: [
            { title: 'Évacuation', content: 'Principes généraux de l\'évacuation en ERP et IGH.' },
            { title: 'Accessibilité', content: 'Réglementation sur l\'accessibilité.' }
        ]},
        { title: 'Prévention', description: 'Mise à jour', lessons: [
            { title: 'Évolution de la réglementation', content: 'Point sur les nouveaux textes en vigueur.' }
        ]},
        { title: 'Moyens de secours', description: 'Technique', lessons: [
            { title: 'Agents extincteurs', content: 'Types de feux et agents extincteurs.' },
            { title: 'SSI', content: 'Fonctionnement du Système de Sécurité Incendie.' },
            { title: 'Moyens d\'extinction', content: 'Manipulation des moyens d\'extinction.' }
        ]},
        { title: 'Mises en situation', description: 'Pratique', lessons: [
            { title: 'Exercices d\'extinction', content: 'Entraînement sur feux réels.' },
            { title: 'Visite technique', content: 'Rondes et vérifications techniques.' }
        ]},
        { title: 'Exploitation du PC', description: 'Gestion PC', lessons: [
            { title: 'Appel et réception des secours', content: 'Procédures d\'alerte et d\'accueil.' },
            { title: 'Main courante', content: 'Tenue de la main courante.' }
        ]}
    ];
    await createModulesAndLessons(ranSsiap1.id, modulesRANSSIAP1);


    // Module Complémentaire SSIAP 1
    const moduleCompSsiap1 = await upsertCourse('module-complementaire-ssiap-1', 'Module Complémentaire SSIAP 1', 
      'Formation par équivalence pour les Sapeurs-Pompiers ou titulaires de qualifications spécifiques.', 350, 'https://ls-formation.fr/wp-content/uploads/2025/05/Formation-Initiale_ssiap1_535x300.webp');
    
    const modulesCompSSIAP1 = [
        { title: 'Sécurité incendie', description: 'Compléments', lessons: [
            { title: 'Dispositions générales et particulières', content: 'Spécificités réglementaires ERP et IGH.' },
            { title: 'Moyens de secours', content: 'Moyens de secours spécifiques aux ERP et IGH.' }
        ]},
        { title: 'Installations techniques', description: 'Technique', lessons: [
            { title: 'Installations électriques', content: 'Impact des installations électriques sur la sécurité.' },
            { title: 'Systèmes d\'extinction', content: 'Sprinkleurs et extinction automatique à gaz.' }
        ]},
        { title: 'Rôles et missions', description: 'Spécificités SSIAP', lessons: [
            { title: 'Le poste de sécurité', content: 'Fonctionnement d\'un PC sécurité en entreprise.' },
            { title: 'Les rondes', content: 'Rondes techniques et de sécurité.' },
            { title: 'Surveillance', content: 'Surveillance des travaux et du public.' }
        ]},
        { title: 'Concrétisation', description: 'Pratique', lessons: [
            { title: 'Visites applicatives', content: 'Visite de site et repérage.' }
        ]}
    ];
    await createModulesAndLessons(moduleCompSsiap1.id, modulesCompSSIAP1);


    // ==========================================
    // SSIAP 2
    // ==========================================

    const ssiap2 = await upsertCourse('ssiap-2-chef-equipe-securite-incendie', 'SSIAP 2 - Chef d\'Équipe',
      'Formation de Chef d\'Équipe pour encadrer les agents de sécurité incendie.', 900, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg');

    const modulesSSIAP2 = [
        { title: 'Rôle et missions du chef d\'équipe', description: 'Management', lessons: [
            { title: 'Gestion de l\'équipe', content: 'Organiser le travail de l\'équipe de sécurité.\nPlanning et rotations.' },
            { title: 'Organisation de séances de formation', content: 'Préparer et animer une séance de formation pratique pour les agents.' },
            { title: 'Gestion des conflits', content: 'Gérer les conflits au sein de l\'équipe ou avec le public.' },
            { title: 'Évaluation de l\'équipe', content: 'Contrôler et évaluer les agents.\nCompte-rendu d\'évaluation.' },
            { title: 'Information de la hiérarchie', content: 'Rendre compte à la hiérarchie.\nRapports d\'incident.' },
            { title: 'Application des consignes', content: 'Faire appliquer les consignes de sécurité.' }
        ]},
        { title: 'Manipulation du SSI', description: 'Technique avancée', lessons: [
            { title: 'Système de Détection Incendie', content: 'Fonctionnement détaillé des détecteurs et du tableau de signalisation.' },
            { title: 'Système de Mise en Sécurité Incendie (SMSI)', content: 'Commandes manuelles et automatiques (UCMC, US).' },
            { title: 'Installations fixes d\'extinction automatique', content: 'Gestion des vannes et tableaux de contrôle sprinkleur.' }
        ]},
        { title: 'Hygiène et sécurité', description: 'Réglementation', lessons: [
            { title: 'Réglementation du code du travail', content: 'Droits et devoirs des salariés.\nDocument unique.' },
            { title: 'Commissions de sécurité', content: 'Rôle du chef d\'équipe lors des visites de la commission de sécurité.' }
        ]},
        { title: 'Chef du PC Sécurité en crise', description: 'Gestion de crise', lessons: [
            { title: 'Gestion du poste central de sécurité', content: 'Organisation du PC en situation de crise.\nMain courante de crise.' },
            { title: 'Conseils techniques aux secours', content: 'Accueillir et renseigner le Commandant des Opérations de Secours (COS).' }
        ]}
    ];
    await createModulesAndLessons(ssiap2.id, modulesSSIAP2);


    // Recyclage SSIAP 2
    const recyclageSsiap2 = await upsertCourse('recyclage-ssiap-2', 'Recyclage SSIAP 2',
      'Maintien et actualisation des connaissances pour les Chefs d\'Équipe SSIAP 2 en activité.', 350, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg');

    const modulesRecyclageSSIAP2 = [
        { title: 'Prévention', description: 'Actualisation', lessons: [
            { title: 'Évolution de la réglementation', content: 'Nouveaux textes applicables et retours d\'expérience.' }
        ]},
        { title: 'Moyens de secours', description: 'Technique', lessons: [
            { title: 'Évolution des moyens de secours', content: 'Nouvelles technologies en matière de détection et d\'extinction.' }
        ]},
        { title: 'Gestion PC en crise', description: 'Mise en situation', lessons: [
            { title: 'Gestion du PC en situation de crise', content: 'Scénarios dégradés au PC sécurité.' }
        ]},
        { title: 'Organisation et Management', description: 'Management', lessons: [
            { title: 'Organisation d\'une séance de formation', content: 'Animation d\'une séance pédagogique.' },
            { title: 'Management de l\'équipe', content: 'Gestion des plannings et des conflits.' }
        ]}
    ];
    await createModulesAndLessons(recyclageSsiap2.id, modulesRecyclageSSIAP2);


    // RAN SSIAP 2
    const ranSsiap2 = await upsertCourse('remise-a-niveau-ssiap-2', 'Remise à niveau SSIAP 2',
      'Récupération de la qualification SSIAP 2 pour les chefs d\'équipe n\'ayant pas les prérequis de recyclage.', 450, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg');

    const modulesRANSSIAP2 = [
        { title: 'Fondamentaux de sécurité', description: 'Révisions', lessons: [
            { title: 'Principes généraux', content: 'Classement, implantation, obligations.' },
            { title: 'Évacuation', content: 'Gestion de l\'évacuation.' },
            { title: 'Accessibilité', content: 'Règles pour les PMR.' }
        ]},
        { title: 'Mise en situation d\'intervention', description: 'Pratique', lessons: [
            { title: 'Conduite à tenir', content: 'Gestion d\'une alarme feu et d\'une évacuation.' },
            { title: 'Méthodes d\'extinction', content: 'Choix et utilisation des moyens d\'extinction.' }
        ]},
        { title: 'Prévention', description: 'Mise à jour', lessons: [
            { title: 'Évolution de la réglementation', content: 'Actualités réglementaires.' }
        ]},
        { title: 'Moyens de secours', description: 'Technique', lessons: [
            { title: 'Agents extincteurs', content: 'Utilisation extincteurs et RIA.' },
            { title: 'SSI', content: 'Gestion du Système de Sécurité Incendie.' }
        ]},
        { title: 'Gestion du PC', description: 'Management', lessons: [
            { title: 'Gestion crise', content: 'Pilotage du PC en crise.' },
            { title: 'Organisation formation', content: 'Pédagogie et formation des agents.' },
            { title: 'Gestion équipe', content: 'Management opérationnel.' }
        ]}
    ];
    await createModulesAndLessons(ranSsiap2.id, modulesRANSSIAP2);


    // Module Complémentaire SSIAP 2
    const moduleCompSsiap2 = await upsertCourse('module-complementaire-ssiap-2', 'Module Complémentaire SSIAP 2',
      'Accès au grade de Chef d\'Équipe SSIAP 2 par équivalence pour les Pompiers et militaires qualifiés.', 500, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-2-300x150.jpg');
    
    const modulesCompSSIAP2 = [
        { title: 'Manipulation du SSI', description: 'Technique', lessons: [
            { title: 'Systèmes de détection et mise en sécurité', content: 'Fonctionnement approfondi du SSI et du CMSI.' }
        ]},
        { title: 'Hygiène et sécurité', description: 'Droit du travail', lessons: [
            { title: 'Code du travail appliqué à la sécurité', content: 'Responsabilités pénales et civiles.\nHygiène et sécurité.' }
        ]},
        { title: 'Gestion de crise', description: 'Direction PC', lessons: [
            { title: 'Chef du poste central de sécurité en situation de crise', content: 'Gestion opérationnelle d\'un sinistre depuis le PC.' }
        ]}
    ];
    await createModulesAndLessons(moduleCompSsiap2.id, modulesCompSSIAP2);


    // ==========================================
    // SSIAP 3
    // ==========================================

    const ssiap3 = await upsertCourse('ssiap-3-chef-service-securite-incendie', 'SSIAP 3 - Chef de Service',
      'Formation de haut niveau pour devenir Chef de Service de Sécurité Incendie (ERP/IGH).', 2500, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg');

    const modulesSSIAP3 = [
        { title: 'Le feu et ses conséquences', description: 'Expertise', lessons: [
            { title: 'Éclosion et développement du feu', content: 'Thermodynamique et cinétique de la combustion.' },
            { title: 'Comportement au feu', content: 'Résistance au feu des structures et réaction au feu des matériaux.' }
        ]},
        { title: 'La sécurité incendie et les bâtiments', description: 'Construction', lessons: [
            { title: 'Matériaux de construction', content: 'Propriétés des matériaux (béton, acier, bois, verre).' },
            { title: 'Études de plans', content: 'Lecture et analyse de plans d\'architecte (coupes, façades, masse).' },
            { title: 'Outils d\'analyse', content: 'Méthodologie de lecture de plans.' }
        ]},
        { title: 'La réglementation incendie', description: 'Réglementation', lessons: [
            { title: 'Organisation de la réglementation', content: 'Hiérarchie des textes (Code de la construction, Arrêtés, IT).' },
            { title: 'Classement des bâtiments', content: 'Typologie des ERP et IGH.\nCalcul des effectifs.' },
            { title: 'Dispositions constructives', content: 'Implantation, isolement, structures, façades.' },
            { title: 'Moyens de secours', content: 'Calcul des besoins en dégagements et moyens de secours.' },
            { title: 'Accessibilité handicapés', content: 'Dispositions réglementaires et aménagements spécifiques.' }
        ]},
        { title: 'Gestion des risques', description: 'Analyse', lessons: [
            { title: 'Analyse des risques', content: 'Identification et évaluation des risques incendie.\nDocument unique.' },
            { title: 'Réalisation des travaux', content: 'Sécurité lors des travaux d\'aménagement.\nPermis de feu.' },
            { title: 'Documents administratifs', content: 'Registre de sécurité, dossiers techniques.' }
        ]},
        { title: 'Conseil au chef d\'établissement', description: 'Conseil', lessons: [
            { title: 'Information hiérarchie', content: 'Rapports et notes de synthèse pour la direction.' },
            { title: 'Veille réglementaire', content: 'Suivi des évolutions législatives et normatives.' }
        ]},
        { title: 'Correspondant commissions', description: 'Relations', lessons: [
            { title: 'Préparation et passage des commissions de sécurité', content: 'Préparation des dossiers, accueil de la commission, levée des prescriptions.' }
        ]},
        { title: 'Management et Budget', description: 'Gestion', lessons: [
            { title: 'Organisation du service', content: 'Organigramme, fiches de poste, recrutement.' },
            { title: 'Gestion du personnel', content: 'Formation, habilitations, planning.' },
            { title: 'Suivi budgétaire', content: 'Élaboration et suivi du budget sécurité (fonctionnement, investissement).' }
        ]}
    ];
    await createModulesAndLessons(ssiap3.id, modulesSSIAP3);


    // Recyclage SSIAP 3
    const recyclageSsiap3 = await upsertCourse('recyclage-ssiap-3', 'Recyclage SSIAP 3',
      'Recyclage triennal obligatoire pour les Chefs de Service SSIAP 3.', 600, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg');

    const modulesRecyclageSSIAP3 = [
        { title: 'Réglementation', description: 'Mise à jour', lessons: [
            { title: 'Évolution de la réglementation', content: 'Nouveautés réglementaires (ERP, IGH, Code du travail).' },
            { title: 'Responsabilité civile et pénale', content: 'Jurisprudence et cas concrets de responsabilité.' }
        ]},
        { title: 'Technique et Sécurité', description: 'Technique', lessons: [
            { title: 'Notices techniques de sécurité', content: 'Rédaction de notices de sécurité pour travaux.' },
            { title: 'Contrats de maintenance', content: 'Gestion et suivi des contrats de maintenance des installations.' }
        ]},
        { title: 'Pratique', description: 'Cas pratiques', lessons: [
            { title: 'Accessibilité des personnes handicapées', content: 'Audit et conformité accessibilité.' },
            { title: 'Analyse des risques', content: 'Étude de cas sur l\'analyse des risques.' }
        ]}
    ];
    await createModulesAndLessons(recyclageSsiap3.id, modulesRecyclageSSIAP3);


    // RAN SSIAP 3
    const ranSsiap3 = await upsertCourse('remise-a-niveau-ssiap-3', 'Remise à niveau SSIAP 3',
      'Pour les Chefs de Service SSIAP 3 n\'ayant pas les conditions de recyclage.', 800, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg');

    const modulesRANSSIAP3 = [
        { title: 'Textes réglementaires', description: 'Droit', lessons: [
            { title: 'Évolution des textes', content: 'Mise à jour complète sur la réglementation incendie.' },
            { title: 'Code de construction', content: 'Lecture et application du CCH.' },
            { title: 'Droit civil et pénal', content: 'Responsabilités du Chef de Service.' }
        ]},
        { title: 'Gestion technique', description: 'Administration', lessons: [
            { title: 'Documents administratifs', content: 'Tenue des registres et dossiers.' },
            { title: 'Contrats de maintenance', content: 'Suivi des prestataires.' },
            { title: 'Commissions de sécurité', content: 'Préparation des visites périodiques.' }
        ]},
        { title: 'Analyse et Conception', description: 'Projets', lessons: [
            { title: 'Analyse de projets de construction', content: 'Étude critique de dossiers PC et AT.' },
            { title: 'Accessibilité handicapés', content: 'Réglementation PMR.' },
            { title: 'Analyse des risques', content: 'Méthodologie d\'analyse.' }
        ]}
    ];
    await createModulesAndLessons(ranSsiap3.id, modulesRANSSIAP3);


    // Module Complémentaire SSIAP 3
    const moduleCompSsiap3 = await upsertCourse('module-complementaire-ssiap-3', 'Module Complémentaire SSIAP 3',
      'Équivalence pour l\'obtention du diplôme SSIAP 3 pour les titulaires du PRV 2 ou AP 2.', 1000, 'https://ls-formation.fr/wp-content/uploads/2025/05/SSIAP-3-300x206.jpg');

    const modulesCompSSIAP3 = [
        { title: 'Sécurité incendie et bâtiments', description: 'Approfondissement', lessons: [
            { title: 'Comportement au feu', content: 'Réaction et résistance au feu.' },
            { title: 'Matériaux et construction', content: 'Matériaux utilisés en construction.' }
        ]},
        { title: 'Analyse de projet', description: 'Méthodologie', lessons: [
            { title: 'Trame d\'analyse de projet de construction', content: 'Méthode détaillée d\'analyse de plans et notices.' }
        ]},
        { title: 'Management', description: 'Gestion', lessons: [
            { title: 'Organisation et gestion du service', content: 'Management du service de sécurité incendie.' }
        ]}
    ];
    await createModulesAndLessons(moduleCompSsiap3.id, modulesCompSSIAP3);


    // Link all to category
    const courses = [
        ssiap1, recyclageSsiap1, ranSsiap1, moduleCompSsiap1,
        ssiap2, recyclageSsiap2, ranSsiap2, moduleCompSsiap2,
        ssiap3, recyclageSsiap3, ranSsiap3, moduleCompSsiap3
    ];

    for (const c of courses) {
        await prisma.courseOnCategory.upsert({
            where: { courseId_categoryId: { courseId: c.id, categoryId: category.id } },
            update: {},
            create: { courseId: c.id, categoryId: category.id },
        });
    }

    console.log('\n🎉 (API) All 12 SSIAP formations created successfully with DETAILED official programs!');

  } catch (error) {
    console.error('❌ (API) Error creating SSIAP formations:', error);
    throw error;
  }
}
