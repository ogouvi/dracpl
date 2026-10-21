import dance from '@/assets/cultural-dance.jpg';
import heritage from '@/assets/heritage.jpg';
import artisan from '@/assets/artisan.jpg';
import exhibition from '@/assets/exhibition.jpg';
import education from '@/assets/education.jpg';
import percussions from '@/assets/percussions.jpg';
import paysages from '@/assets/paysages.jpg';
import memoire from '@/assets/memoire.jpg';
export const images = { dance, heritage, artisan, exhibition, education, percussions, paysages, memoire };
export type ContentKind = 'actualites' | 'annonces' | 'agenda' | 'projets' | 'galeries' | 'videos' | 'artistes';
export type ContentItem = { slug:string; title:string; category:string; date:string; summary:string; image:string; gallery?:string[]; location?:string; day?:string; month?:string; time?:string; status?:string; duration?:string; body:string[] };
export const content: Record<ContentKind,ContentItem[]> = {
 actualites: [
 {slug:'savoir-faire-kpalime',title:'À Kpalimé, les savoir-faire se transmettent de génération en génération',category:'Artisanat',date:'5 octobre 2026',summary:'Rencontre avec les artisans qui font vivre le tissage, le batik et la sculpture au cœur des Plateaux.',image:artisan,location:'Kpalimé',body:['À Kpalimé, les ateliers sont des lieux de création autant que de transmission. Le bois, le fil et les pigments naturels y deviennent des objets porteurs de mémoire. Chaque geste raconte une connaissance patiemment acquise auprès des aînés.','Le tissage, la sculpture et le batik occupent une place importante dans la vie artistique locale. La rencontre entre les maîtres artisans et les jeunes générations contribue à préserver ces techniques tout en ouvrant la voie à des expressions nouvelles.','Accompagner ces savoir-faire, c’est aussi reconnaître le rôle économique et social des ateliers. La valorisation des œuvres et la documentation des pratiques constituent des leviers pour renforcer leur visibilité.'],gallery:[dance,heritage,exhibition,education]},
 {slug:'rencontres-creation',title:'La jeune création des Plateaux à l’honneur',category:'Arts visuels',date:'2 octobre 2026',summary:'Peinture, sculpture et regards contemporains : une scène artistique qui affirme sa voix.',image:exhibition,location:'Atakpamé',body:['La scène artistique des Plateaux se nourrit du dialogue entre héritages et création contemporaine. Les jeunes artistes explorent la mémoire, la ville et les liens entre communautés.','Les rencontres entre créateurs et publics favorisent une meilleure compréhension des œuvres. Elles permettent également aux associations de partager leurs expériences et de construire des collaborations.','Ce dossier éditorial invite à découvrir des démarches artistiques diverses et à donner une place durable à la création dans la vie régionale.'],gallery:[artisan,dance,heritage,education]},
 {slug:'memoire-patrimoine',title:'Préserver notre patrimoine, partager notre mémoire',category:'Patrimoine',date:'28 septembre 2026',summary:'Des lieux historiques aux traditions orales, un héritage commun à faire découvrir.',image:memoire,location:'Notsé',body:['Le patrimoine culturel des Plateaux associe des sites historiques, des traditions orales et des savoir-faire vivants. Notsé et son histoire occupent une place particulière dans la mémoire des communautés éwé.','Préserver le patrimoine suppose de réunir les connaissances des communautés, de documenter les sites et de sensibiliser les jeunes publics. La protection doit respecter les usages locaux et les significations attachées à chaque lieu.','La transmission de cette mémoire gagne à associer les écoles, les associations et les détenteurs de savoirs dans un dialogue constant.'],gallery:[heritage,paysages,dance,artisan]},
 {slug:'rythmes-traditions',title:'Les rythmes traditionnels, un langage vivant',category:'Musique et danse',date:'22 septembre 2026',summary:'Quand les percussions et les danses rassemblent les communautés autour d’une mémoire partagée.',image:percussions,body:['Dans les Plateaux, les pratiques musicales accompagnent les fêtes, les rencontres et la vie collective. La danse est à la fois expression artistique et moyen de transmission.','Les répertoires varient selon les communautés et les occasions. Leur documentation ne peut se faire sans l’accord et la participation de celles et ceux qui les font vivre.','Donner une place aux groupes locaux dans les espaces culturels permet de renforcer le dialogue entre les générations.'],gallery:[dance,memoire,heritage,paysages]},
 {slug:'ecoles-culture',title:'L’éducation artistique, une ouverture sur le territoire',category:'Éducation',date:'18 septembre 2026',summary:'Faire découvrir aux jeunes les métiers d’art et les richesses culturelles de leur région.',image:education,body:['L’éducation artistique permet aux jeunes de rencontrer des œuvres, des artistes et des pratiques nouvelles. Elle encourage la curiosité et le respect de la diversité culturelle.','Des ateliers adaptés peuvent être élaborés avec les établissements scolaires et les professionnels de la culture. Les projets doivent tenir compte de l’âge des participants et des ressources disponibles.','La découverte du patrimoine local donne aux élèves des repères pour comprendre leur territoire.'],gallery:[artisan,exhibition,paysages,dance]},
 {slug:'paysages-plateaux',title:'Les paysages des Plateaux, entre nature et récits',category:'Patrimoine',date:'12 septembre 2026',summary:'Montagnes, cascades et récits locaux composent une identité à préserver.',image:paysages,body:['Du mont Agou aux cascades de la région de Badou, les paysages des Plateaux participent à l’identité du territoire. Ils sont également liés à des récits et des usages communautaires.','Le tourisme culturel doit respecter les lieux et les populations. La sensibilisation des visiteurs contribue à la préservation de ces espaces.','Les initiatives locales offrent l’occasion de relier découverte des paysages et rencontre avec les savoir-faire.'],gallery:[heritage,memoire,artisan,exhibition]}
 ],
 annonces:[
 {slug:'appel-projets-culturels',title:'Appel à projets culturels : valorisons les initiatives locales',category:'Appel à projets',date:'6 octobre 2026',summary:'Associations et acteurs culturels : proposez vos initiatives de transmission et de création.',image:exhibition,status:'Ouvert',body:['Cet exemple d’appel à projets présente les informations nécessaires à un futur dispositif régional. Les projets pourront porter sur la transmission des savoir-faire, la médiation du patrimoine ou la création artistique.','Le dossier comprend une présentation de la structure, les objectifs du projet, un calendrier et un budget prévisionnel. Les critères envisagés sont l’intérêt culturel, la participation des publics et la faisabilité.','Date limite indicative : 30 novembre 2026. Aucun dépôt ni financement réel n’est ouvert sur cette version de présentation.']},
 {slug:'recensement-acteurs',title:'Recensement des artistes et des acteurs culturels des Plateaux',category:'Information',date:'3 octobre 2026',summary:'Une démarche pour mieux connaître les talents et les structures de notre territoire.',image:artisan,status:'En cours',body:['Le recensement vise à améliorer la connaissance des disciplines artistiques et des structures culturelles présentes dans les Plateaux.','Les informations envisagées sont la discipline, la localité, les activités et les coordonnées professionnelles consenties. Les données ne seront publiées qu’après accord des personnes concernées.','Cette annonce constitue un exemple éditorial. Aucun formulaire de collecte officielle n’est actuellement ouvert.']},
 {slug:'rencontre-associations',title:'Rencontre d’échange avec les associations culturelles',category:'Communiqué',date:'1 octobre 2026',summary:'Un temps de dialogue autour des besoins et des perspectives du secteur culturel régional.',image:dance,status:'À venir',body:['Les associations jouent un rôle essentiel dans la transmission et la diffusion culturelle. Une rencontre de concertation permettrait de partager les attentes et d’identifier des priorités communes.','Les échanges porteront sur la formation, l’accès aux espaces culturels et la mise en réseau des initiatives.','Lieu et date à confirmer par la Direction. Cette rencontre est présentée à titre d’exemple et ne constitue pas une invitation officielle.']}
 ],
 agenda:[
 {slug:'journees-patrimoine',title:'Journées du patrimoine des Plateaux',category:'Patrimoine',date:'24 octobre 2026',day:'24',month:'Oct.',location:'Atakpamé',time:'09 h 00 – 17 h 00',summary:'Un rendez-vous pour découvrir l’histoire et les patrimoines qui nous rassemblent.',image:heritage,body:['Une journée de découverte associant présentations historiques, échanges avec les communautés et ateliers de sensibilisation.','Le programme indicatif prévoit une rencontre sur la mémoire régionale et des activités pour les familles. Les conditions d’accueil et les lieux précis doivent être validés.','Événement de démonstration : date et programme non confirmés. Aucune réservation n’est proposée.']},
 {slug:'festival-arts-vivants',title:'Rencontres des arts et des traditions',category:'Musique et danse',date:'7 novembre 2026',day:'07',month:'Nov.',location:'Kpalimé',time:'14 h 00 – 19 h 00',summary:'Danses, percussions et échanges autour des expressions culturelles vivantes.',image:dance,body:['Un moment de partage entre groupes de danse, musiciens et publics autour des expressions culturelles régionales.','Des présentations artistiques et des échanges avec les interprètes permettront de mieux comprendre les répertoires et leurs contextes.','Événement de démonstration : participation, lieu et calendrier à confirmer.']},
 {slug:'exposition-regards',title:'Regards sur les Plateaux',category:'Arts visuels',date:'14 novembre 2026',day:'14',month:'Nov.',location:'Kpalimé',time:'10 h 00 – 18 h 00',summary:'Une exposition collective dédiée aux regards des artistes sur leur territoire.',image:exhibition,body:['Peinture, dessin et sculpture réunis autour des paysages et des récits des Plateaux. Une proposition pour mettre en dialogue création contemporaine et mémoire.','Des temps de rencontre avec les artistes permettront aux visiteurs de découvrir les techniques et les intentions derrière les œuvres.','Exposition de démonstration. Les artistes participants et le lieu seront annoncés après validation.']},
 {slug:'atelier-batik',title:'À la découverte du batik',category:'Artisanat',date:'21 novembre 2026',day:'21',month:'Nov.',location:'Kpalimé',time:'09 h 00 – 12 h 00',summary:'Une initiation aux couleurs, aux motifs et aux gestes du batik.',image:artisan,body:['Une introduction aux techniques de réserve et de teinture, accompagnée d’une présentation des motifs et de leurs usages.','L’atelier indicatif s’adresse aux jeunes et aux adultes. L’encadrement, le matériel et la capacité d’accueil doivent être confirmés.','Activité de démonstration : aucune inscription réelle n’est ouverte.']}
 ],
 projets:[
 {slug:'transmission-savoir-faire',title:'Transmettre les savoir-faire',category:'Formation',date:'2026 – 2027',status:'En préparation',image:artisan,summary:'Favoriser le dialogue entre maîtres artisans et jeunes générations.',body:['Objectif : encourager la transmission des techniques artisanales et reconnaître les détenteurs de savoirs.','Activités envisagées : ateliers intergénérationnels, documentation des gestes et rencontres de restitution. Le projet associerait artisans, associations et établissements scolaires.','Calendrier indicatif : concertation en 2026, expérimentation en 2027. Résultats attendus : des compétences partagées et une meilleure visibilité des ateliers. Ce programme est un exemple à valider.']},
 {slug:'memoires-plateaux',title:'Mémoires des Plateaux',category:'Patrimoine',date:'2026 – 2028',status:'À l’étude',image:heritage,summary:'Documenter les récits et valoriser les patrimoines de notre région.',body:['Objectif : favoriser la connaissance du patrimoine matériel et immatériel des Plateaux.','La démarche proposée associe collecte consentie de récits, repérage de sites et création de supports de médiation. Les communautés gardent une place centrale dans le choix des éléments à partager.','Le calendrier et les partenariats seront définis après concertation. Résultat attendu : des ressources accessibles et respectueuses des droits culturels. Programme de démonstration.']},
 {slug:'creation-proximite',title:'La création au plus près de tous',category:'Médiation',date:'2027',status:'En préparation',image:exhibition,summary:'Renforcer l’accès aux œuvres et aux pratiques artistiques dans les localités.',body:['Objectif : développer la rencontre entre artistes et publics dans les différentes localités.','Les activités envisagées comprennent des expositions itinérantes, des rencontres et des ateliers. Les lieux seront choisis avec les acteurs locaux.','Résultats attendus : une meilleure circulation des œuvres et des collaborations durables. Programme indicatif, non encore adopté.']}
 ],
 galeries:[
 {slug:'gestes-artisans',title:'Les gestes et les matières',category:'Artisanat',date:'5 octobre 2026',summary:'Une promenade visuelle au cœur des savoir-faire des Plateaux.',image:artisan,body:['Une sélection d’illustrations consacrée aux ateliers, aux matières et à la transmission. Les visuels de cette galerie ont été générés pour la présentation du portail.']},
 {slug:'cultures-en-partage',title:'Cultures en partage',category:'Musique et danse',date:'22 septembre 2026',summary:'Les expressions collectives qui font vivre les liens entre générations.',image:dance,body:['Un regard illustré sur la danse et la musique comme lieux de rencontre. Ces images sont des illustrations générées et non des photographies d’un événement réel.']},
 {slug:'paysages-memoire',title:'Paysages et mémoire',category:'Patrimoine',date:'12 septembre 2026',summary:'Un territoire de montagnes, de cascades et de récits.',image:heritage,body:['Les paysages des Plateaux inspirent les artistes et accompagnent les récits locaux. Les images présentées sont des illustrations, non un relevé documentaire des sites.']}
 ],
 videos:[
 {slug:'regards-plateaux',title:'Regards sur les Plateaux',category:'Portrait de territoire',date:'5 octobre 2026',duration:'00:16',image:dance,summary:'Une évocation visuelle des paysages, des arts et des savoir-faire.',body:['Ce court récit visuel associe des illustrations de danse, de paysages et d’artisanat. Il présente l’univers culturel du portail sans documenter un événement officiel.']},
 {slug:'mains-creation',title:'Les mains de la création',category:'Artisanat',date:'2 octobre 2026',duration:'00:16',image:artisan,summary:'Un récit visuel autour des gestes et des matières.',body:['Les gestes artisanaux invitent à regarder la matière autrement. Ce film de présentation utilise des illustrations générées pour évoquer la création.']}
 ],
 artistes:[
 {slug:'ateliers-kpalime',title:'Les ateliers de Kpalimé',category:'Artisanat',location:'Kpalimé',date:'2026',image:artisan,summary:'Tissage, batik et sculpture : des pratiques ancrées dans le territoire.',body:['Cette fiche thématique présente les savoir-faire de Kpalimé. Les profils individuels seront ajoutés avec le consentement des artistes.']},
 {slug:'creation-atakpame',title:'La création à Atakpamé',category:'Arts visuels',location:'Atakpamé',date:'2026',image:exhibition,summary:'Rencontrer les expressions plastiques et les initiatives associatives.',body:['Une présentation thématique de la création locale, à compléter par des profils professionnels vérifiés.']},
 {slug:'expressions-notse',title:'Les expressions de Notsé',category:'Musique et danse',location:'Notsé',date:'2026',image:dance,summary:'Des pratiques vivantes au croisement de la musique et de la mémoire.',body:['Une fiche consacrée aux pratiques collectives. Les structures et artistes seront présentés après accord.']}
 ]
};
export const pageInfo = {
 'la-direction':{title:'La Direction',intro:'Au service des arts, des cultures et de la transmission dans la région des Plateaux.'},
 missions:{title:'Missions et attributions',intro:'Accompagner la création, préserver le patrimoine et rendre la culture accessible à tous.'},
 organisation:{title:'Organisation et équipe',intro:'Une organisation au service des acteurs culturels et des habitants des Plateaux.'},
 actualites:{title:'Actualités',intro:'Les nouvelles de la création, du patrimoine et de la vie culturelle des Plateaux.'},
 annonces:{title:'Annonces officielles',intro:'Communiqués, appels à projets et informations pratiques pour les acteurs culturels.'},
 agenda:{title:'Agenda culturel',intro:'Des rendez-vous pour découvrir, rencontrer et partager les cultures de notre région.'},
 patrimoine:{title:'Patrimoine et cultures',intro:'Des héritages vivants, des paysages singuliers et des talents à découvrir.'},
 'arts-traditionnels':{title:'Arts traditionnels',intro:'Des gestes, des rythmes et des expressions qui se transmettent entre les générations.'},
 'patrimoine-culturel':{title:'Patrimoine culturel',intro:'Préserver les lieux et les mémoires, partager les richesses de notre territoire.'},
 artistes:{title:'Artistes et acteurs culturels',intro:'À la rencontre des savoir-faire et des expressions artistiques des Plateaux.'},
 mediatheque:{title:'Médiathèque',intro:'Les arts et les cultures des Plateaux en images et en récits.'},
 galeries:{title:'Galeries photo',intro:'Des regards sur les paysages, les gestes et les moments de partage.'},
 videos:{title:'Vidéos',intro:'Des récits visuels pour découvrir les expressions culturelles du territoire.'},
 projets:{title:'Projets et programmes',intro:'Des perspectives pour accompagner la transmission, la création et l’accès à la culture.'},
 partenaires:{title:'Nos partenaires',intro:'Faire vivre la culture grâce au dialogue et à la coopération.'},
 contact:{title:'Contact',intro:'Une question, une initiative ou un besoin d’accompagnement ? Entrons en dialogue.'},
 faq:{title:'Questions fréquentes',intro:'Les réponses aux principales questions concernant la Direction et ses activités.'},
 recherche:{title:'Recherche',intro:'Retrouvez une actualité, un rendez-vous ou une ressource culturelle.'},
 archives:{title:'Archives',intro:'Explorez les publications par thème, par catégorie ou par année.'},
 'mentions-legales':{title:'Mentions légales',intro:'Informations relatives à l’édition et à l’utilisation du portail.'},
 confidentialite:{title:'Politique de confidentialité',intro:'Comprendre comment vos informations sont utilisées et protégées.'},
 'plan-du-site':{title:'Plan du site',intro:'Toutes les rubriques du portail culturel des Plateaux.'},
};
export const nav = [ ['Accueil','/'],['La Direction','/la-direction'],['Actualités','/actualites'],['Annonces','/annonces'],['Agenda culturel','/agenda'],['Patrimoine et cultures','/patrimoine'],['Médiathèque','/mediatheque'],['Projets','/projets'],['Partenaires','/partenaires'],['Contact','/contact'] ] as const;
export function metadata(title:string, description:string, image?:string) { return {meta:[{title:`${title} — Arts & Cultures des Plateaux`},{name:'description',content:description},{property:'og:title',content:`${title} — Arts & Cultures des Plateaux`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'},...(image?.startsWith('https://')?[{property:'og:image',content:image},{name:'twitter:image',content:image}]:[])]}; }

export const pagePaths = {
 'la-direction': '/la-direction',
 'missions': '/missions',
 'organisation': '/organisation',
 'actualites': '/actualites',
 'annonces': '/annonces',
 'agenda': '/agenda',
 'patrimoine': '/patrimoine',
 'arts-traditionnels': '/arts-traditionnels',
 'patrimoine-culturel': '/patrimoine-culturel',
 'artistes': '/artistes',
 'mediatheque': '/mediatheque',
 'galeries': '/galeries',
 'videos': '/videos',
 'projets': '/projets',
 'partenaires': '/partenaires',
 'contact': '/contact',
 'faq': '/faq',
 'recherche': '/recherche',
 'archives': '/archives',
 'mentions-legales': '/mentions-legales',
 'confidentialite': '/confidentialite',
 'plan-du-site': '/plan-du-site',
} as const;
