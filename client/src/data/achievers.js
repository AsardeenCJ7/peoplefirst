// Mock data for achievers
// NOTE: biographyPages is the admin-editable content for the FlipBook.
// Each page has: title (string), icon (emoji), paragraphs (array of strings).
// Admin CMS / API should return this structure per achiever.
export const achievers = [
  {
    id: 1,
    name: "Dr. Nilanthi Jayasinghe",
    title: "Pioneer of Rural Tele-Health Diagnostics",
    category: "Healthcare & Medicine",
    location: "Badulla District",
    year: "2018",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: `Dr. Nilanthi Jayasinghe is a pioneering medical professional who revolutionized healthcare access in rural Sri Lanka. Born in Badulla, she dedicated three decades to serving underprivileged communities across the Uva Province.\n\nHer groundbreaking achievement was establishing a network of decentralized tele-health diagnostics, connecting over 400 rural clinics with specialist units in Colombo. This innovation allowed patients in the most remote areas to receive specialist consultations without traveling hundreds of kilometers.\n\nHer work has benefited over 2 million rural patients since 2018, significantly reducing maternal mortality rates by 67% in the regions she served. She was awarded the National Medical Excellence Award in 2020 and the Commonwealth Medical Innovation Prize in 2022.\n\nDr. Jayasinghe continues to train the next generation of rural health workers, having established a Rural Health Academy that has graduated over 500 community health officers.`,
    achievements: [
      "National Medical Excellence Award 2020",
      "Commonwealth Medical Innovation Prize 2022",
      "500+ Community Health Officers Trained",
      "67% reduction in maternal mortality",
      "2M+ rural patients served"
    ],
    tags: ["Healthcare", "Innovation", "Rural Development", "Women in Medicine"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-1-1",
        episode: 1,
        title: "Part 1: The Remote Diagnostic Vision & Early Days",
        videoId: "dQw4w9WgXcQ",
        duration: "18:24",
        date: "2026-01-15",
        description: "Dr. Nilanthi discusses the foundational hurdles of establishing tele-health kiosks in Badulla."
      },
      {
        id: "ep-1-2",
        episode: 2,
        title: "Part 2: Overcoming Mountain Road Realities & Maternal Care",
        videoId: "9bZkp7q19f0",
        duration: "22:10",
        date: "2026-02-01",
        description: "In-depth insights into emergency maternal diagnostic systems in Uva Province."
      },
      {
        id: "ep-1-3",
        episode: 3,
        title: "Part 3: The Rural Health Academy & Future Vision",
        videoId: "kJQP7kiw5Fk",
        duration: "15:45",
        date: "2026-03-05",
        description: "Training over 500 community officers and the roadmap to nationwide healthcare coverage."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings",
        icon: "📖",
        paragraphs: [
          "Dr. Nilanthi Jayasinghe was born in 1972 in the verdant hills of Badulla, the heart of Sri Lanka's Uva Province. Growing up in a modest family of teachers, she witnessed firsthand the chronic lack of medical care that plagued rural communities — a reality that would define her life's mission.",
          "Her father, a village school principal, often walked five miles to fetch a doctor for ailing neighbours. That sight never left her. At the age of nine, she resolved to become a doctor — not to work in a city hospital, but to return to the people who needed her most.",
          "She excelled academically, earning a full scholarship to the University of Colombo Faculty of Medicine in 1990. There, she distinguished herself not only by academic performance but by her deep compassion, often volunteering at underfunded provincial clinics during semester breaks."
        ]
      },
      {
        title: "Journey & Contribution",
        icon: "🌟",
        paragraphs: [
          "After completing her medical degree and postgraduate specialisation in Internal Medicine, Dr. Jayasinghe made a decision that shocked her peers: she turned down a prestigious Colombo hospital offer and returned to Badulla.",
          "Over the next decade, she drove long mountain roads daily to reach remote clinics, often treating patients by lantern-light. Her patient list grew from hundreds to thousands as word spread of a doctor who truly listened and never turned anyone away for inability to pay.",
          "In 2010, she began conceptualizing a tele-health network — a system that would use satellite internet and telemedicine kiosks to connect village clinics directly with specialist units at teaching hospitals in Colombo, effectively bringing the city's best doctors to every village doorstep."
        ]
      },
      {
        title: "Key Achievements – Part I",
        icon: "🏆",
        paragraphs: [
          "By 2018, Dr. Jayasinghe had successfully connected 400 rural clinics across the Uva Province to specialist units in Colombo. Each kiosk she installed allowed villagers to receive specialist consultations via high-quality video, with real-time diagnostic tool integration including ECG and ultrasound.",
          "The results were transformative. Maternal mortality in connected regions dropped by 67% within three years. Thousands of patients who would have otherwise died from undiagnosed conditions — cancers, cardiac diseases, diabetes — were identified early and treated successfully.",
          "She was awarded the National Medical Excellence Award in 2020 by the Sri Lankan President, citing her network as \"the single most impactful rural health intervention in the nation's modern history.\""
        ]
      },
      {
        title: "Key Achievements – Part II",
        icon: "🎖️",
        paragraphs: [
          "In 2022, Dr. Jayasinghe received the Commonwealth Medical Innovation Prize — the most prestigious medical award in the Commonwealth — recognising her tele-health model as a replicable blueprint for developing nations.",
          "Her Rural Health Academy, established in 2019, has to date graduated over 500 Community Health Officers, each trained to operate tele-health kiosks and provide first-response care. These graduates now serve in 14 districts across Sri Lanka.",
          "Over 2 million rural patients have benefited from her network since 2018. The Sri Lankan Ministry of Health has adopted her model as the national standard for rural healthcare delivery, with plans to expand to all provinces by 2028."
        ]
      },
      {
        title: "Historical Impact & Legacy",
        icon: "🌍",
        paragraphs: [
          "Dr. Jayasinghe's work transcends medicine. In communities she served, school enrolment rates rose as families no longer needed to keep older children home to care for chronically ill parents. Female workforce participation increased as women gained access to maternal and reproductive healthcare.",
          "International health organisations from Bangladesh, Nepal, and three Sub-Saharan African nations have dispatched delegations to study her model. The WHO has cited her network in its 2023 global report on rural healthcare innovation.",
          "\"I did not invent technology,\" she has said in interviews. \"I simply refused to let geography be a death sentence. Every child in Badulla deserves the same doctor as every child in Colombo.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice",
        icon: "💬",
        paragraphs: [
          "The communities Dr. Jayasinghe served have honoured her in ways no award could match. Villages across Badulla have named streets, schools, and clinics after her. A mural painted by local school children stretches 30 metres along the walls of the Badulla General Hospital.",
          "Her story has been adapted into a Sinhala-language film and a children's educational graphic novel distributed free to all primary schools in the Uva Province — inspiring the next generation of rural doctors.",
          "Share your tribute, memory, or message for Dr. Nilanthi Jayasinghe in the community comments below. This page is a living record — every voice matters in the Roll of Honor."
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Prof. Shantha Wickramasinghe",
    title: "Guardian of Ancient Palm-Leaf Manuscripts",
    category: "Education & Heritage",
    location: "Peradeniya, Kandy",
    year: "2015",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    videoId: "9bZkp7q19f0",
    bio: `Professor Shantha Wickramasinghe has dedicated his life to preserving Sri Lanka's ancient literary heritage. As a senior professor at the University of Peradeniya, he spearheaded the most ambitious digitization project in South Asian cultural history.\n\nOver 30 years, Prof. Wickramasinghe personally supervised the archiving of more than 12,000 ancient palm-leaf Ola manuscripts, converting them into high-resolution digital formats now accessible to scholars worldwide through open-access repositories.\n\nHis work has preserved invaluable texts on Ayurvedic medicine, ancient Sinhalese poetry, Buddhist philosophy, and historical chronicles that would otherwise have been lost to time and deterioration.\n\nRecognized by UNESCO as a Cultural Heritage Champion in 2019, his digital archive serves researchers in over 45 countries. He was also instrumental in recovering 2,000 manuscripts that were believed destroyed during the 1981 Jaffna Library fire.`,
    achievements: [
      "UNESCO Cultural Heritage Champion 2019",
      "12,000+ Manuscripts Digitized",
      "Peradeniya University Emeritus Professor",
      "45+ Countries Access His Archive",
      "Presidential Award for Cultural Preservation"
    ],
    tags: ["Heritage", "Education", "Digital Preservation", "Academia"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-2-1",
        episode: 1,
        title: "Part 1: The Vanishing Palm-Leaf Manuscripts of Peradeniya",
        videoId: "9bZkp7q19f0",
        duration: "24:10",
        date: "2026-01-18",
        description: "Prof. Shantha shares the thrilling discovery of thousands of Ola manuscripts preserved across ancient temple archives."
      },
      {
        id: "ep-2-2",
        episode: 2,
        title: "Part 2: High-Resolution Digitization & Global Scholarly Access",
        videoId: "dQw4w9WgXcQ",
        duration: "19:50",
        date: "2026-02-12",
        description: "Developing non-invasive imaging techniques to protect brittle historical palm-leaf artifacts."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings",
        icon: "📖",
        paragraphs: [
          "Professor Shantha Wickramasinghe was born in 1955 in the ancient city of Kandy, raised in the shadow of the Temple of the Tooth — a childhood steeped in centuries of living heritage. His grandfather was a traditional scribe who copied palm-leaf texts by hand, and young Shantha grew up watching those fragile leaves carry the weight of a civilization.",
          "His passion for ancient literature led him to the University of Peradeniya, where he pursued a degree in Sinhala Literature before completing his doctorate in South Asian Manuscript Studies at Oxford. He returned to Peradeniya in 1985 with one obsession: to save what remained.",
          "At the time, thousands of Ola leaf manuscripts in temple libraries and private collections across Sri Lanka were crumbling from humidity, insect damage, and neglect. Prof. Wickramasinghe began documenting them by hand — a task that would consume the next four decades of his life."
        ]
      },
      {
        title: "Journey & Contribution",
        icon: "🌟",
        paragraphs: [
          "In 1992, Prof. Wickramasinghe secured a landmark grant to begin systematic digitization of Sri Lanka's palm-leaf manuscript heritage. Working with a small team of students and temple librarians, he developed specialized imaging protocols that could capture text from damaged leaves without physical contact.",
          "Over 30 years, his project expanded from a single university room to a fully-equipped digitization centre employing 45 researchers and conservators. The centre processed over 12,000 unique manuscripts — works on Ayurvedic medicine, Sinhalese poetry, Buddhist cosmology, and historical chronicles dating to the 3rd century BCE.",
          "He pioneered a unique crowd-sourcing method where village temples registered their collections online, enabling his team to reach locations that no formal survey had ever documented."
        ]
      },
      {
        title: "Key Achievements – Part I",
        icon: "🏆",
        paragraphs: [
          "UNESCO named Prof. Wickramasinghe a Cultural Heritage Champion in 2019, one of only seven individuals globally to receive the honour that year. The citation described his digital archive as \"the most comprehensive collection of South Asian manuscript culture ever assembled by a single research team.\"",
          "His archive is now accessible to scholars in over 45 countries through an open-access online platform that receives over 120,000 academic visits annually. Universities in Japan, Germany, and India have established collaborative research programmes based on his collection.",
          "Perhaps most remarkably, his team recovered 2,000 manuscripts previously believed destroyed in the catastrophic 1981 Jaffna Public Library fire — copies that had been quietly held in remote temple collections no one had thought to survey."
        ]
      },
      {
        title: "Key Achievements – Part II",
        icon: "🎖️",
        paragraphs: [
          "Prof. Wickramasinghe received the Presidential Award for Cultural Preservation in 2021 and the Peradeniya University Emeritus Professorship — the highest academic honour the institution confers.",
          "He established the Ceylon Manuscript Studies programme, a postgraduate course that has produced 120 trained archivists now working in libraries and universities across South Asia.",
          "Three complete Ayurvedic medical texts recovered by his team have been translated and published, reintroducing ancient remedies now being studied by modern pharmacological researchers at the University of Colombo."
        ]
      },
      {
        title: "Historical Impact & Legacy",
        icon: "🌍",
        paragraphs: [
          "Prof. Wickramasinghe's legacy is measured not in awards but in what exists now that would otherwise have been lost forever. The 12,000 manuscripts he preserved represent an irreplaceable record of a civilization's thought, belief, medicine, and art.",
          "The village temples whose libraries he documented often report that his visits were the first time anyone had formally acknowledged the value of their collections. \"He treated each leaf as a living elder,\" said one monk in Matale. \"He gave our ancestors a voice again.\"",
          "His work is a reminder that preservation is not a passive act — it is a daily battle against time, indifference, and the elements. Prof. Wickramasinghe chose to fight that battle for 40 years."
        ]
      },
      {
        title: "Public Tributes & Community Voice",
        icon: "💬",
        paragraphs: [
          "Researchers, monks, historians, and ordinary Sri Lankans have written thousands of letters and messages to Prof. Wickramasinghe over the decades. Many describe discovering a family ancestor's writings in his digital archive — an experience they describe as \"meeting the past.\"",
          "The Peradeniya University campus has named its manuscript reading room the Wickramasinghe Hall, and his portrait hangs alongside founders in the university's gallery of distinguished alumni.",
          "Leave your tribute or message for Prof. Shantha Wickramasinghe below. Every comment becomes part of this permanent living archive in his honour."
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Eng. Priyantha Dissanayake",
    title: "Sri Lanka's Solar Energy Revolution Pioneer",
    category: "Engineering & Technology",
    location: "Colombo",
    year: "2020",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    videoId: "kJQP7kiw5Fk",
    bio: `Engineer Priyantha Dissanayake is the visionary behind Sri Lanka's most ambitious renewable energy transformation. As a solar energy engineer, he designed and implemented the National Solar Grid Initiative that brought electricity to 150,000 homes in off-grid communities.\n\nHis innovative approach using locally manufactured solar panels reduced costs by 40% compared to imported alternatives, creating a thriving local solar industry that employs over 5,000 workers. His patented solar water pumping technology has been adopted in 12 countries across South and Southeast Asia.\n\nRecognized by the Asian Development Bank as a Green Energy Champion, Dissanayake's work has prevented an estimated 2 million tons of CO2 emissions annually. He currently advises the Sri Lankan government on achieving carbon neutrality by 2050.`,
    achievements: [
      "ADB Green Energy Champion 2021",
      "150,000 Homes Electrified",
      "5,000+ Jobs Created",
      "Patent: Solar Water Pumping Technology",
      "Technology adopted in 12 countries"
    ],
    tags: ["Engineering", "Renewable Energy", "Innovation", "Environment"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-3-1",
        episode: 1,
        title: "Part 1: Designing Solar Tech for Off-Grid Rural Homes",
        videoId: "kJQP7kiw5Fk",
        duration: "21:15",
        date: "2026-01-22",
        description: "Eng. Priyantha explains the engineering behind affordable indigenous solar panels."
      },
      {
        id: "ep-3-2",
        episode: 2,
        title: "Part 2: 150,000 Households Electrified & ADB Recognition",
        videoId: "dQw4w9WgXcQ",
        duration: "17:40",
        date: "2026-02-18",
        description: "Transforming agricultural yields with patented solar water pumping mechanisms."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings",
        icon: "📖",
        paragraphs: [
          "Engineer Priyantha Dissanayake grew up in Colombo's industrial Dehiwela district, the son of an electrician who spent his evenings rewiring neighbourhood homes by torchlight. From childhood, Priyantha was fascinated by the way electricity transformed lives — and frustrated by how millions in rural Sri Lanka lived without it.",
          "He earned his degree in Electrical Engineering from the University of Moratuwa in 1998 and completed postgraduate research in photovoltaic systems in Germany, where he was exposed to Europe's emerging solar energy revolution.",
          "Returning to Sri Lanka in 2003, he found a nation still overwhelmingly dependent on hydropower and diesel generators, with entire districts — particularly in the North and East — completely unconnected to the national grid."
        ]
      },
      {
        title: "Journey & Contribution",
        icon: "🌟",
        paragraphs: [
          "In 2008, Priyantha founded SolarLanka Engineering, a company with an unusual mission: design solar energy systems affordable enough for off-grid rural households. He worked with local manufacturers to source components domestically, cutting costs by 40% compared to imported systems.",
          "His breakthrough came with the development of a patented modular solar panel that could be assembled by villagers themselves from locally available materials, dramatically reducing installation costs and creating local technical jobs in the process.",
          "By 2015, SolarLanka had electrified over 50,000 homes. His solar water pumping technology — the first designed specifically for Sri Lanka's shallow well conditions — was adopted by the government's rural agriculture programme."
        ]
      },
      {
        title: "Key Achievements – Part I",
        icon: "🏆",
        paragraphs: [
          "The Asian Development Bank named Priyantha a Green Energy Champion in 2021, recognising his National Solar Grid Initiative — a partnership with the Ministry of Power that brought electricity to 150,000 homes in off-grid communities between 2016 and 2022.",
          "His patented solar water pumping technology has been adopted in 12 countries across South and Southeast Asia, with implementations in Bangladesh, Myanmar, Cambodia, and four East African nations under World Bank-supported programmes.",
          "The 5,000 jobs created by his local solar manufacturing ecosystem represent one of the largest single-source renewable energy employment initiatives in Sri Lankan history."
        ]
      },
      {
        title: "Key Achievements – Part II",
        icon: "🎖️",
        paragraphs: [
          "Priyantha's work has prevented an estimated 2 million tons of CO2 emissions annually — equivalent to removing 430,000 cars from Sri Lanka's roads. This contribution has been formally recognised in Sri Lanka's national climate action reporting to the UN.",
          "He currently serves as a technical advisor to the Sri Lankan government's 2050 Carbon Neutrality Committee and has been instrumental in shaping the national renewable energy roadmap that targets 70% clean energy by 2030.",
          "His engineering faculty at Moratuwa University has endowed a solar energy research chair in his name, supporting 15 postgraduate researchers working on next-generation rural electrification technologies."
        ]
      },
      {
        title: "Historical Impact & Legacy",
        icon: "🌍",
        paragraphs: [
          "The 150,000 families who received electricity through Priyantha's initiative experienced life changes that go far beyond light. Children could study after dark. Refrigerators preserved medicines and food. Small businesses could operate evening hours. Women working in cottage industries doubled their output.",
          "In villages where his solar pumping systems were installed, crop yields increased by 35% as farmers gained reliable irrigation for the first time. Several communities that were net food importers became self-sufficient within three years.",
          "\"I did not give these communities electricity,\" Priyantha has said. \"I gave them the ability to write their own future. The sun was always shining. We just needed to catch it.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice",
        icon: "💬",
        paragraphs: [
          "Families from Ampara to Mannar have sent handwritten letters to Priyantha's office, describing the moment the first bulb lit up in their village. Many describe it as the most significant day of their lives.",
          "School children in rural communities draw solar panels as symbols of hope in their artwork. In one Northern Province school, a class named their classroom \"The Priyantha Room\" after receiving electricity for the first time.",
          "Share your tribute, story, or gratitude for Engineer Priyantha Dissanayake in the comments below. Your voice is part of this living Roll of Honor."
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Mrs. Kamala Perera",
    title: "Champion of Girls' Education in Conflict Zones",
    category: "Social Impact",
    location: "Jaffna",
    year: "2012",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    videoId: "fRh_vgS2dFE",
    bio: `Mrs. Kamala Perera is a social activist and educator whose tireless work during and after Sri Lanka's civil conflict ensured that thousands of girls did not lose their right to education. Working in the conflict-affected Northern Province, she established 25 safe learning spaces for girls, serving over 10,000 students between 2008 and 2015.\n\nHer organization, "Girls Rise Lanka," provided scholarships, psychological support, and vocational training to girls displaced by conflict. Today, 85% of her scholarship recipients have gone on to university education, with many becoming doctors, engineers, and teachers.\n\nAwarded the Nansen Refugee Award by UNHCR in 2016, Mrs. Perera continues her work, having expanded her programs to include digital literacy for women in rural communities.`,
    achievements: [
      "UNHCR Nansen Refugee Award 2016",
      "10,000+ Girls Educated",
      "25 Safe Learning Spaces Established",
      "85% University Enrollment Rate",
      "Girls Rise Lanka Founder"
    ],
    tags: ["Social Impact", "Education", "Women Empowerment", "Conflict Recovery"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-4-1",
        episode: 1,
        title: "Part 1: Safeguarding Girls' Right to Learn in the North",
        videoId: "fRh_vgS2dFE",
        duration: "25:30",
        date: "2026-01-10",
        description: "Kamala Perera recalls establishing underground learning spaces during turbulent decades."
      },
      {
        id: "ep-4-2",
        episode: 2,
        title: "Part 2: UNHCR Nansen Award & The Future of Girls Rise Lanka",
        videoId: "9bZkp7q19f0",
        duration: "20:45",
        date: "2026-02-05",
        description: "How 85% of scholarship recipients achieved university degrees across STEM and medicine."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings",
        icon: "📖",
        paragraphs: [
          "Mrs. Kamala Perera was born in 1967 in Jaffna, growing up during a period of increasing political tension in Sri Lanka's Northern Province. Her childhood was punctuated by the sounds of uncertainty — yet within her family home, her mother ran an informal school for neighbourhood children, planting in Kamala a lifelong belief that education is the most powerful form of resistance.",
          "She completed her own education under extraordinary conditions, walking to school during curfews and studying by candlelight during power outages. Her determination earned her a degree in Social Work from the University of Jaffna in 1989.",
          "When the civil conflict intensified in the 1990s, Kamala refused to leave. She watched families flee, schools close, and children — especially girls — disappear from education as families kept them home for safety. She decided to build safety into education itself."
        ]
      },
      {
        title: "Journey & Contribution",
        icon: "🌟",
        paragraphs: [
          "In 2008, amid the final and most intense phase of the civil conflict, Kamala established 'Girls Rise Lanka' — an organisation dedicated to keeping girls in education through the provision of safe learning spaces, counselling, scholarships, and vocational training.",
          "She negotiated with military commanders, local officials, and community leaders to establish protected learning spaces in Jaffna, Kilinochchi, and Mullaitivu — areas at the epicentre of the conflict. She converted community halls, temple annexes, and even abandoned buildings into functional classrooms.",
          "By 2015, she had established 25 safe learning spaces serving over 10,000 girls, providing not only academic instruction but also psychological trauma support, nutrition programmes, and legal advocacy for girls whose civil rights had been violated."
        ]
      },
      {
        title: "Key Achievements – Part I",
        icon: "🏆",
        paragraphs: [
          "UNHCR awarded Kamala the Nansen Refugee Award in 2016 — the world's highest honour for extraordinary service to displaced and conflict-affected populations. The award cited her as \"a lighthouse for girls navigating the darkness of conflict.\"",
          "85% of the girls who received Girls Rise Lanka scholarships went on to complete university education — a rate higher than the national average for girls from unaffected regions. Many are now doctors, engineers, lawyers, and teachers.",
          "Her psychological support model, developed with trauma specialists, has been adopted by UNICEF as a recommended framework for educational programme design in post-conflict zones."
        ]
      },
      {
        title: "Key Achievements – Part II",
        icon: "🎖️",
        paragraphs: [
          "Following the end of the conflict, Kamala expanded Girls Rise Lanka's mandate to include digital literacy for women in rural communities across the North and East. The programme has trained over 5,000 women in basic computing and internet skills, enabling access to government services, banking, and online markets.",
          "She has been recognised by the International Women's Day Foundation, the Sri Lanka Human Rights Commission, and three consecutive Prime Ministers for her contribution to post-conflict reconciliation through education.",
          "Girls Rise Lanka now operates in 8 districts and employs 200 full-time staff and counsellors, making it the largest grassroots girls' education organisation in Sri Lanka's history."
        ]
      },
      {
        title: "Historical Impact & Legacy",
        icon: "🌍",
        paragraphs: [
          "The 10,000 girls Kamala educated during the conflict years are now adults who are shaping Sri Lanka's post-conflict north. They are building businesses, running hospitals, teaching in schools, and raising daughters who will never know what it meant to be denied education because of gender or geography.",
          "In Jaffna, three schools have been formally renamed in her honour. A square in Kilinochchi bears her name. The Northern Provincial Council has established the Kamala Perera Annual Award for Women's Education, presented each year at a ceremony she attends.",
          "\"A girl who reads cannot be erased,\" she has said at every commencement ceremony she has spoken at. \"We did not just teach subjects. We taught girls that they exist, they matter, and they belong.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice",
        icon: "💬",
        paragraphs: [
          "Many of the girls Kamala educated during the conflict have written publicly about how her intervention changed the trajectory of their lives. Their stories have been published in international journals, Sri Lankan newspapers, and UNHCR's annual reports.",
          "In 2023, a group of 200 Girls Rise Lanka graduates organized a surprise ceremony for Kamala in Jaffna, presenting her with a book of personal letters — one from each of them — titled 'Because of You.'",
          "Leave your message, tribute, or story for Mrs. Kamala Perera in the community section below. Every word is a chapter in her ongoing story."
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Ravi Jayawardena",
    title: "World Champion Athlete & Youth Coach",
    category: "Sports",
    location: "Galle",
    year: "2019",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    videoId: "L_jWHffIx5E",
    bio: `Ravi Jayawardena is Sri Lanka's most decorated track and field athlete, having won gold medals at the 2014 Asian Games and the 2016 Commonwealth Games in the 400m hurdles. Despite coming from a humble fishing community in Galle, Ravi's determination and natural talent propelled him to the world stage.\n\nAfter retiring from competition, Ravi founded the "Sprint to Success" academy in Galle, which has produced 15 national-level athletes. His coaching philosophy emphasizes character development alongside athletic excellence, with all his athletes maintaining above-average academic performance.\n\nRavi's story of rising from poverty to world-class athletics has inspired countless young Sri Lankans from underprivileged backgrounds.`,
    achievements: [
      "Asian Games Gold Medal 2014",
      "Commonwealth Games Gold Medal 2016",
      "National Athletic Record Holder",
      "15 National Athletes Coached",
      "Sprint to Success Academy Founder"
    ],
    tags: ["Sports", "Athletics", "Youth Development", "Coaching"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-5-1",
        episode: 1,
        title: "Part 1: From Galle Fishing Beach to the Asian Games Gold",
        videoId: "L_jWHffIx5E",
        duration: "22:15",
        date: "2026-01-28",
        description: "Ravi Jayawardena narrates the raw grit of training without running shoes and winning for Sri Lanka."
      },
      {
        id: "ep-5-2",
        episode: 2,
        title: "Part 2: Sprint to Success — Coaching the Next Generation",
        videoId: "dQw4w9WgXcQ",
        duration: "16:40",
        date: "2026-02-25",
        description: "Building free athletic academies and mentoring rural youth toward international podiums."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings",
        icon: "📖",
        paragraphs: [
          "Ravi Jayawardena was born in 1988 in a fishing village on the outskirts of Galle, the youngest of five siblings in a household where his father repaired fishing nets and his mother sold fresh catch at the morning market. There were no coaches, no athletic facilities, and no path that any child from that village had ever taken to international sports.",
          "Ravi ran. He ran to school because he had no bus fare. He ran along the beach because it felt like freedom. His secondary school physical education teacher, Mr. Dharmasena, noticed that Ravi ran differently — with a natural stride mechanics that she had only seen in textbooks about elite sprinters.",
          "At 16, she entered him in the provincial athletic championships without his parents' knowledge, borrowing a pair of proper running shoes from another student. Ravi won by seven seconds. The path that no child from his village had taken began to open."
        ]
      },
      {
        title: "Journey & Contribution",
        icon: "🌟",
        paragraphs: [
          "Ravi earned a sports scholarship to the National Athletic Training Centre in Colombo at 17, leaving his village for the first time. The adjustment was brutal — he felt out of place among athletes from wealthier backgrounds, missed his family, and struggled academically.",
          "He channelled his homesickness into training with an intensity that alarmed his coaches. Within two years, he held the national junior record in the 400m hurdles. By 22, he was competing internationally, reaching his first Asian Athletic Championships final.",
          "At the 2014 Asian Games in Incheon, he crossed the finish line first in the 400m hurdles, becoming the first Sri Lankan in 28 years to win an Asian Games gold medal in track and field. He stood on the podium and wept — not for himself, but thinking of his father mending nets at dawn."
        ]
      },
      {
        title: "Key Achievements – Part I",
        icon: "🏆",
        paragraphs: [
          "Ravi's 2014 Asian Games gold medal in the 400m hurdles broke a 28-year Sri Lankan drought at Asia's premier multi-sport event. His winning time set a new South Asian record that stood for six years.",
          "At the 2016 Commonwealth Games in Gold Coast, he defended his championship form to win gold again, becoming one of only three Sri Lankan athletes to win gold at two consecutive major games in the same event.",
          "He holds three national athletic records, is a four-time Sri Lanka Athletics Athlete of the Year, and was inducted into the National Sports Hall of Fame in 2019 at just 31 years old — one of the youngest inductees in history."
        ]
      },
      {
        title: "Key Achievements – Part II",
        icon: "🎖️",
        paragraphs: [
          "After retiring from competition in 2020, Ravi returned to Galle and founded the Sprint to Success Academy — a free coaching programme for underprivileged youth aged 10-18. The academy operates entirely on donations and has no barriers to entry.",
          "In five years, Sprint to Success has produced 15 national-level athletes, two of whom qualified for the 2024 Paris Olympics. Every athlete in the programme maintains a minimum academic performance standard — Ravi insists education comes first.",
          "The academy has also partnered with three international sports brands to provide free equipment and scholarships, creating a pipeline from Galle's fishing villages to the national athletics stage."
        ]
      },
      {
        title: "Historical Impact & Legacy",
        icon: "🌍",
        paragraphs: [
          "Ravi Jayawardena's story has changed what young people from coastal communities in southern Sri Lanka believe is possible. His face appears in school textbooks. His academy is mentioned in Sri Lanka's national sports development policy as a model for grassroots talent identification.",
          "More than medals, what defines his legacy is the culture he has built at Sprint to Success — where athletics is a vehicle for character, discipline, and academic achievement rather than a substitute for it.",
          "\"I was lucky,\" he says at every public appearance. \"A teacher saw me. That is all it takes — someone to see you. My job now is to see every child who comes through that gate.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice",
        icon: "💬",
        paragraphs: [
          "The fishing village where Ravi grew up has painted a mural of him on the wall of the beachfront community centre. During the 2016 Commonwealth Games, the entire village gathered on the beach with a television set borrowed from the local school to watch him race.",
          "His mother, who sold fish to save for his school shoes, was invited to the Presidential Awards ceremony and placed the National Excellence Medal around his neck herself — a moment that was broadcast nationally and reduced the audience to tears.",
          "Share your tribute or message for Ravi Jayawardena below. Become part of his living Roll of Honor."
        ]
      }
    ]
  },
  {
    id: 6,
    name: "Chef Saman Kumara",
    title: "Reviving Ancient Ceylon Culinary Arts",
    category: "Arts & Culture",
    location: "Kandy",
    year: "2022",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&q=80",
    videoId: "QH2-TGUlwu4",
    bio: `Chef Saman Kumara is an internationally acclaimed culinary artist who has single-handedly revived ancient Ceylon cuisine that was at risk of being lost forever. Through years of research with village elders and historical texts, Saman documented over 500 traditional recipes dating back to the Kandyan kingdom period.\n\nHis restaurant "Ancient Ceylon" in Kandy has received international acclaim, being featured in the Michelin Guide Asia as a regional star. He has published three cookbooks translated into eight languages and regularly appears on international cooking programs.\n\nSaman's culinary school provides free training to underprivileged youth, with graduates finding employment in leading hotels worldwide. He has trained over 300 professional chefs who carry Ceylon's culinary heritage to kitchens across the globe.`,
    achievements: [
      "Michelin Guide Asia Regional Star 2023",
      "500+ Traditional Recipes Documented",
      "3 International Cookbooks Published",
      "300+ Chefs Trained",
      "World Food Programme Ambassador"
    ],
    tags: ["Culture", "Culinary Arts", "Heritage", "International Recognition"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-6-1",
        episode: 1,
        title: "Part 1: Rediscovering Lost 17th Century Kandyan Royal Recipes",
        videoId: "QH2-TGUlwu4",
        duration: "26:00",
        date: "2026-01-30",
        description: "Chef Saman demonstrates rare ancient clay pot techniques and spice blend alchemy."
      },
      {
        id: "ep-6-2",
        episode: 2,
        title: "Part 2: Michelin Recognition & Free Culinary Schools",
        videoId: "kJQP7kiw5Fk",
        duration: "18:30",
        date: "2026-02-28",
        description: "Training over 300 young underprivileged youth to become master chefs worldwide."
      }
    ],
    biographyPages: [
      {
        title: "Early Life & Beginnings", icon: "📖",
        paragraphs: [
          "Chef Saman Kumara was born in 1978 in Kandy's inner city, raised in the kitchen of his grandmother's home where ancient spice blends, passed down through four generations, perfumed the air every morning. His grandmother, a renowned cook among the Kandyan aristocracy, taught him that each dish was a living document — a story told through flavour.",
          "He trained at the Colombo School of Hospitality before working in five-star hotel kitchens in Colombo and Singapore. But fine dining left him empty. The food he was cooking — French reductions, Japanese minimalism — felt foreign to him. He returned to Kandy with one mission: find the recipes that were disappearing.",
          "He began by interviewing elderly home cooks, village ayurvedic practitioners, and retired palace servants in Kandyan noble families — people who held in memory preparations that existed in no cookbook, no archive, no written record anywhere."
        ]
      },
      {
        title: "Journey & Contribution", icon: "🌟",
        paragraphs: [
          "Over 15 years of fieldwork, Saman documented 500 traditional recipes from the Kandyan kingdom period — dishes that ranged from royal ceremonial preparations to daily staple foods of farming communities. He worked with historians to cross-reference oral traditions with written court chronicles from the 17th and 18th centuries.",
          "In 2012, he opened Ancient Ceylon restaurant in Kandy's heritage quarter — a restaurant where every dish on the menu was historically authentic, prepared using traditional techniques: wood-fire clay pots, stone-ground spices, hand-pressed coconut milk.",
          "The restaurant became a cultural pilgrimage destination. Sri Lankans arrived in tears recognising dishes their grandparents had made. International food journalists described it as \"eating at the intersection of archaeology and art.\""
        ]
      },
      {
        title: "Key Achievements – Part I", icon: "🏆",
        paragraphs: [
          "The Michelin Guide Asia awarded Ancient Ceylon a Regional Star in 2023 — the first Sri Lankan restaurant in history to receive Michelin recognition. The citation described Saman's work as \"culinary archaeology of the highest order, served with the hospitality of a nation.\"",
          "He has published three internationally acclaimed cookbooks — 'Flavours of the Kandyan Court,' 'Ancient Ceylon: A Culinary History,' and 'The Village Table' — translated into eight languages including Japanese, German, and French.",
          "His books are now used in culinary schools in Japan and Germany as reference texts on South Asian food history, representing the first Sri Lankan cuisine to receive formal academic recognition in European culinary education."
        ]
      },
      {
        title: "Key Achievements – Part II", icon: "🎖️",
        paragraphs: [
          "Saman's culinary school, established in 2016, provides entirely free professional chef training to underprivileged youth from across Sri Lanka. All 300 graduates of the school have secured employment in leading hotels and restaurants in Sri Lanka, the Maldives, Singapore, and the UAE.",
          "He serves as a World Food Programme Ambassador, working with WFP to promote traditional food systems as sustainable solutions to food insecurity in developing nations.",
          "In 2023, he was invited to cook a state dinner for visiting Commonwealth heads of government — the first time Sri Lanka's official state cuisine was entirely drawn from ancient Kandyan traditions rather than Western fine dining."
        ]
      },
      {
        title: "Historical Impact & Legacy", icon: "🌍",
        paragraphs: [
          "Saman Kumara has done something extraordinary: he has made a nation hungry for its own history. Ancient Ceylon's waiting list stretches six months. His books sell out within weeks of publication. Sri Lankans who had never thought about their culinary heritage are now cooking ancient recipes in their modern kitchens.",
          "He has trained a generation of chefs who carry Ceylon's food story to tables across the world. In Singapore, New York, and Dubai, his graduates are opening restaurants that introduce global diners to flavours that were nearly lost forever.",
          "\"Every spice blend is a library,\" he says. \"Every recipe is a letter from our ancestors. My grandmother taught me to read them. My job is to make sure they are never forgotten again.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice", icon: "💬",
        paragraphs: [
          "The ancient spice traders of Kandy's Pettah market have honoured Saman with a ceremonial title traditionally reserved for master craftsmen — the first time in recorded history it has been conferred on a chef.",
          "International visitors to Ancient Ceylon frequently leave notes describing transformative experiences — not just culinary but deeply personal, as flavours trigger unexpected emotions and connections to ancestry and history.",
          "Share your tribute, food memory, or message for Chef Saman Kumara in the community section below."
        ]
      }
    ]
  },
  {
    id: 7,
    name: "Prof. Savitri Rodrigo",
    title: "Living Custodian of Endangered Ceylon Dialects",
    category: "Linguistics & Culture",
    location: "Colombo",
    year: "2016",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    videoId: "uelHwf8o7_U",
    bio: `Professor Savitri Rodrigo is Sri Lanka's foremost linguist and the world's leading authority on endangered Dravidian dialects spoken in the Northern and Eastern provinces. Having studied linguistics at Oxford, she returned to Sri Lanka to dedicate her career to preserving languages that are spoken by fewer than 1,000 people each.\n\nHer lifetime work includes the documentation of 12 near-extinct dialects, creation of the first comprehensive dictionaries for 6 languages, and development of educational materials that have helped revive 3 languages now being taught in schools.\n\nProf. Rodrigo established the Ceylon Language Archive at Colombo University, housing recordings of over 800 native speakers of endangered languages. Her work is considered one of the most significant contributions to global linguistic diversity preservation in the 21st century.`,
    achievements: [
      "Oxford Linguistics Award 2018",
      "12 Dialects Documented",
      "6 Languages Dictionaries Created",
      "3 Languages Successfully Revived",
      "800+ Speaker Recordings Archived"
    ],
    tags: ["Linguistics", "Culture", "Heritage Preservation", "Academia"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    biographyPages: [
      {
        title: "Early Life & Beginnings", icon: "📖",
        paragraphs: [
          "Professor Savitri Rodrigo was born in 1960 in Colombo to a multilingual family — her mother a Tamil speaker from Jaffna, her father a Sinhalese academic from Matara. Growing up between two languages, she developed an early and acute sensitivity to the way language shapes identity, memory, and belonging.",
          "She studied linguistics at the University of Colombo before winning a Rhodes Scholarship to Oxford, where she specialized in endangered language documentation under the supervision of one of the world's foremost field linguists.",
          "Returning to Sri Lanka in 1988, she joined the University of Colombo faculty and immediately began fieldwork in the Northern and Eastern provinces, where she discovered that several Dravidian dialects spoken by small fishing and farming communities were completely undocumented by modern linguistics."
        ]
      },
      {
        title: "Journey & Contribution", icon: "🌟",
        paragraphs: [
          "Prof. Rodrigo's fieldwork took her to isolated coastal villages, island communities, and highland settlements where she would spend weeks living with native speaker communities, building trust, recording oral traditions, and constructing the first phonological and grammatical analyses ever undertaken for these languages.",
          "Her methodology was innovative and deeply ethical: she trained community members themselves as co-researchers, ensuring that the act of documentation was also an act of cultural revitalization. Many languages she worked on had no written form — she developed scripts in consultation with communities, giving them ownership of their own linguistic heritage.",
          "The civil conflict that engulfed Sri Lanka's north and east from the 1980s made this work extraordinarily dangerous. She continued fieldwork throughout the conflict years, often the only academic in areas most Colombo scholars refused to enter."
        ]
      },
      {
        title: "Key Achievements – Part I", icon: "🏆",
        paragraphs: [
          "Prof. Rodrigo has documented 12 near-extinct dialects, created the first comprehensive dictionaries for 6 languages, and developed educational materials that have helped revive 3 languages now being taught in local schools across the Northern Province.",
          "The Oxford Linguistics Award, conferred in 2018, recognized her body of work as \"the most significant single contribution to South Asian linguistic diversity preservation in the 21st century.\"",
          "Her Ceylon Language Archive at Colombo University houses audio recordings of over 800 native speakers — the largest such collection for Sri Lanka's endangered languages in existence, many of them last speakers whose voices would otherwise have been lost entirely."
        ]
      },
      {
        title: "Key Achievements – Part II", icon: "🎖️",
        paragraphs: [
          "Three languages that Prof. Rodrigo documented are now being formally taught in primary schools in their home communities — a revitalization she engineered by working with community leaders to integrate the languages into local school curricula.",
          "Her work is cited in 340 peer-reviewed academic papers internationally and has influenced linguistic policy in India, Nepal, and Papua New Guinea. She has been invited to present her methodology at UNESCO's Endangered Languages Programme five times.",
          "She established the Colombo University Endangered Languages Research Centre, now staffed by 18 researchers and 40 postgraduate students from 12 countries who come specifically to learn her documentation methodology."
        ]
      },
      {
        title: "Historical Impact & Legacy", icon: "🌍",
        paragraphs: [
          "When a language dies, a universe of knowledge dies with it — specific words for ecological phenomena, traditional medicine practices, oral historical records, and ways of seeing the world that no other language encodes. Prof. Rodrigo has kept 12 such universes alive.",
          "Community members who participated in her documentation projects describe a profound psychological effect: the act of recording and preserving their language gave their communities a sense of dignity, visibility, and continuity that no political process had provided.",
          "\"Language is not a tool,\" she has written. \"It is the mind itself. When we lose a language, we lose a way of being human that will never exist again. I refused to let that happen quietly.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice", icon: "💬",
        paragraphs: [
          "Communities whose languages Prof. Rodrigo saved have held ceremonies in her honour — traditional gatherings involving music, oral recitation, and ritual offerings that are themselves examples of the living culture she preserved.",
          "In a fishing village near Mullativu, the community council named their new library the Savitri Rodrigo Language House, stocking it with her dictionaries, recordings, and educational materials.",
          "Share your tribute or message for Prof. Savitri Rodrigo in the community section below. Your voice adds to the archive she built."
        ]
      }
    ]
  },
  {
    id: 8,
    name: "Maj. Gen. (Ret.) Arjuna Silva",
    title: "Humanitarian Demining Pioneer",
    category: "Humanitarian Service",
    location: "Trincomalee",
    year: "2010",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    videoId: "YR5ApYxkU-U",
    bio: `Major General (Retired) Arjuna Silva led the most extensive humanitarian demining operation in South Asian history. After retiring from active military service, he established the "Safe Ground Lanka" foundation, which has cleared over 15,000 hectares of landmine-contaminated land in the Northern and Eastern provinces.\n\nThis work has allowed over 80,000 displaced families to return safely to their ancestral lands and resume farming. The cleared land has been converted into productive agricultural zones, contributing significantly to regional economic recovery.\n\nRecognized by the United Nations Mine Action Service, General Silva's methodology has been adopted as a best-practice framework for demining operations in post-conflict zones across Africa and Southeast Asia.`,
    achievements: [
      "UN Mine Action Service Recognition 2015",
      "15,000 Hectares Cleared",
      "80,000 Families Resettled",
      "Global Demining Methodology Pioneer",
      "Presidential Medal of Honor"
    ],
    tags: ["Humanitarian", "Demining", "Post-Conflict", "Peace Building"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    biographyPages: [
      {
        title: "Early Life & Beginnings", icon: "📖",
        paragraphs: [
          "Major General (Retired) Arjuna Silva was born in 1955 in Trincomalee to a military family with a generations-long tradition of service. His father served in the Ceylon Army, and from childhood Arjuna understood military life as a form of public duty — not a career, but a calling.",
          "He rose through the Sri Lanka Army's engineer corps over three decades, becoming one of the nation's most respected military engineers with expertise in explosive ordnance disposal. He served in multiple operational theatres and trained with demining specialists from the British Army, the Indian Army, and the UN Mine Action Service.",
          "As the civil conflict intensified in the 1990s and 2000s, Arjuna watched vast tracts of agricultural land in the North and East become contaminated with landmines and unexploded ordnance — effectively stolen from the families who had farmed them for generations."
        ]
      },
      {
        title: "Journey & Contribution", icon: "🌟",
        paragraphs: [
          "Upon retiring from active service in 2009, weeks after the end of the civil conflict, Arjuna made an extraordinary decision: he would spend his retirement not in a comfortable Colombo home but in the landmine-contaminated districts of the North and East, doing the most dangerous voluntary work imaginable.",
          "He established 'Safe Ground Lanka' foundation in 2010, assembling a team of retired military engineers, international demining experts, and — crucially — local community members trained as deminers. He believed that communities should lead their own liberation from landmines, not merely receive it from outside specialists.",
          "His methodology combined systematic technical surveys using ground-penetrating radar with community mapping — having villagers identify from memory every area they remembered as dangerous. This hybrid approach proved dramatically more efficient than standard survey methods."
        ]
      },
      {
        title: "Key Achievements – Part I", icon: "🏆",
        paragraphs: [
          "Safe Ground Lanka has cleared over 15,000 hectares of landmine-contaminated land in the Northern and Eastern provinces — the largest humanitarian demining operation in South Asian history.",
          "The UN Mine Action Service formally recognized General Silva's methodology in 2015, adopting elements of his community-integrated approach as a recommended global framework for post-conflict demining.",
          "His work has allowed over 80,000 displaced families to return safely to their ancestral lands. Many of these families had been internal refugees for 10 to 20 years, living in transit camps far from their villages."
        ]
      },
      {
        title: "Key Achievements – Part II", icon: "🎖️",
        paragraphs: [
          "The 15,000 hectares cleared by Safe Ground Lanka have been converted into productive agricultural land, contributing an estimated LKR 8 billion annually to the regional economy of the North and East.",
          "General Silva received the Presidential Medal of Honor — Sri Lanka's highest civilian honour — in 2018, presented personally by the President in a ceremony attended by 500 resettled family representatives from the communities he served.",
          "His methodology has been formally adopted for demining programmes in Mozambique, Angola, and Cambodia, implemented by teams he personally trained through a partnership with the Geneva International Centre for Humanitarian Demining."
        ]
      },
      {
        title: "Historical Impact & Legacy", icon: "🌍",
        paragraphs: [
          "The land that General Silva cleared was not simply agricultural territory — it was ancestral, cultural, and sacred. Families buried relatives in these lands. Elders knew every tree, every well, every boundary stone. Returning to their land was, for many families, a restoration of identity that no political process had provided.",
          "The farming communities now thriving on cleared land produce rice, vegetables, and fruit that feed communities across the North. The agricultural recovery of these regions has reduced dependence on food aid from international organisations by 60%.",
          "\"Every mine I cleared,\" he has said, \"was a war crime undone. Every family that went home was a victory that cost no blood. That is the only war worth fighting in peacetime.\""
        ]
      },
      {
        title: "Public Tributes & Community Voice", icon: "💬",
        paragraphs: [
          "Resettled communities in Kilinochchi, Mullaitivu, and Mannar have organized annual 'Homecoming Day' ceremonies where they invite General Silva as the guest of honour. In 2023, over 3,000 families attended the ceremony in Kilinochchi, presenting him with a traditional ceremonial cloth woven from the first harvest grown on cleared land.",
          "The families of deminers who died during Safe Ground Lanka operations have received lifetime support from the foundation — a commitment General Silva made personally and funds through his own pension.",
          "Leave your tribute or message for Major General (Ret.) Arjuna Silva in the community section below. Each word adds to his permanent Roll of Honor."
        ]
      }
    ]
  },
  {
    id: 9,
    name: "M. H. M. Ashraff",
    title: "Visionary Statesman, Founder of SLMC & Minister of Ports & Shipping",
    category: "Politics & Leadership",
    location: "Kalmunai, Ampara District",
    year: "1989",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: `Mohammed Hussain Mohamed Ashraff (1948 – 2000), affectionately known as 'Marhoom Ashraff', was one of Sri Lanka's most charismatic political visionaries, senior legal counsels, and acclaimed literary figures. Born in Sammanthurai and rooted in Kalmunai in the Ampara District, he founded the Sri Lanka Muslim Congress (SLMC) and later the National Unity Alliance (NUA), completely reshaping the democratic representation of minority communities in Sri Lanka.\n\nAs Cabinet Minister of Ports, Shipping, Rehabilitation and Reconstruction from 1994 until his untimely demise in 2000, Ashraff spearheaded a golden era of national infrastructure development. He revolutionized the Port of Colombo with the expansion of the Queen Elizabeth Quay into a world-class global transshipment hub and envisioned the strategic Oluvil Port development project in the Eastern Province.\n\nA staunch champion of higher education, Ashraff founded the South Eastern University of Sri Lanka (SEUSL) at Oluvil, bringing university education directly to underserved rural youth in the East. Under his rehabilitation ministry, over 100,000 conflict-displaced families across the Northern and Eastern provinces were resettled with permanent housing and livelihoods.\n\nBeyond politics, Ashraff was a distinguished Senior Attorney-at-Law and a celebrated Tamil poet whose anthology 'Naan Ennum Nee' remains a landmark of contemporary Sri Lankan literature. His legacy as a bridge-builder, champion of pluralism, and visionary regional developer continues to inspire generations.`,
    achievements: [
      "Founder Leader of Sri Lanka Muslim Congress (SLMC) & National Unity Alliance (NUA)",
      "Cabinet Minister of Ports, Shipping, Rehabilitation & Reconstruction (1994–2000)",
      "Founder of the South Eastern University of Sri Lanka (SEUSL) at Oluvil",
      "Modernized Colombo Port into a World-Class Global Transshipment Container Hub",
      "Visionary Architect of the Oluvil Port & Lighthouse Maritime Infrastructure",
      "Senior Counsel of the Supreme Court of Sri Lanka & Celebrated Tamil Poet ('Naan Ennum Nee')",
      "Resettled & Rehabilitated 100,000+ Conflict-Displaced Families across North & East"
    ],
    tags: ["SLMC", "Leadership", "Politics", "Eastern Province", "Ports", "Education", "SEUSL", "National Unity"],
    social: { facebook: "#", twitter: "#", youtube: "#" },
    interviewSeries: [
      {
        id: "ep-9-1",
        episode: 1,
        title: "Part 1: The Founding of SLMC & The Democratic Awakening in the East",
        videoId: "dQw4w9WgXcQ",
        duration: "28:45",
        date: "2026-01-10",
        description: "Archival historical documentary detailing the genesis of SLMC in Kattankudy and Kalmunai, and Ashraff's parliamentary leadership."
      },
      {
        id: "ep-9-2",
        episode: 2,
        title: "Part 2: The Port of Colombo Revolution & The Oluvil University Vision",
        videoId: "9bZkp7q19f0",
        duration: "24:18",
        date: "2026-02-05",
        description: "In-depth historical coverage of Minister Ashraff's transformation of the Sri Lanka Ports Authority and building of South Eastern University."
      },
      {
        id: "ep-9-3",
        episode: 3,
        title: "Part 3: The National Unity Alliance & The Poet Statesman ('Naan Ennum Nee')",
        videoId: "kJQP7kiw5Fk",
        duration: "31:10",
        date: "2026-03-01",
        description: "Reflections on his literary masterwork 'Naan Ennum Nee' and his vision for an undivided, pluralistic Sri Lanka."
      }
    ],
    biographyPages: [
      {
        title: "Early Life, Roots in the East & Legal Brilliance",
        icon: "📖",
        paragraphs: [
          "Mohammed Hussain Mohamed Ashraff was born on October 23, 1948, in the historic town of Sammanthurai in the Ampara District of Sri Lanka's Eastern Province. Raised in Kalmunai in a cultured and deeply principled family, young Ashraff displayed exceptional intellectual prowess and literary eloquence from his early schooling at Wesley High School, Kalmunai.",
          "He pursued legal studies at the Sri Lanka Law College, excelling with first-class honors, and was admitted to the Bar as an Advocate in 1974. He later completed his Master of Laws (LL.M) degree from the University of Colombo with research focused on constitutional safeguards and minority rights.",
          "As a Senior Attorney-at-Law and State Counsel, Ashraff earned universal respect in the legal fraternity for his forensic precision, spellbinding oratory, and unwavering defense of fundamental human rights before the Supreme Court."
        ]
      },
      {
        title: "Political Awakening & The Genesis of SLMC",
        icon: "🌟",
        paragraphs: [
          "During the turbulent socio-political shifts of the late 1970s and 1980s, the Muslim community of the Northern and Eastern provinces faced severe geopolitical marginalization, caught between escalating armed militancy and state apathy.",
          "Recognizing the urgent necessity for a distinct, democratic political identity, Ashraff alongside dedicated community leaders founded the Sri Lanka Muslim Congress (SLMC) in Kattankudy in 1981, formally launching it as a national political party in 1986 with its iconic 'Tree' symbol.",
          "In the 1989 Parliamentary General Elections, under Ashraff's charismatic leadership, the SLMC achieved a historic breakthrough by securing 4 parliamentary seats, elevating the voice of the Eastern Province directly into the national legislature."
        ]
      },
      {
        title: "Ministerial Mastery: Ports, Shipping & SEUSL",
        icon: "⚓",
        paragraphs: [
          "In 1994, following the election of the People's Alliance government, Ashraff was appointed Cabinet Minister of Ports, Shipping, Rehabilitation and Reconstruction. His six-year tenure at the helm of the Ports Authority is widely heralded as a golden era in Sri Lankan maritime history.",
          "He revolutionized container terminal throughput at the Port of Colombo, commissioning the Queen Elizabeth Quay expansion, introducing modern gantry cranes, and establishing performance-linked worker welfare schemes that catapulted Colombo into the top 30 container ports globally.",
          "Believing passionately that higher education was the ultimate catalyst for regional empowerment, Ashraff founded the South Eastern University of Sri Lanka (SEUSL) at Oluvil in 1995. Today, SEUSL stands as a thriving national academic institution educating thousands of students across engineering, management, technology, and arts."
        ]
      },
      {
        title: "Reconstruction, Pluralism & National Unity Alliance",
        icon: "🏛️",
        paragraphs: [
          "As Minister of Rehabilitation and Reconstruction, Ashraff oversaw the monumental task of rebuilding war-ravaged communities across the North and East. Over 100,000 displaced families were provided with permanent housing, drinking water schemes, rural road networks, and livelihood grants without ethnic discrimination.",
          "Driven by a profound vision for an inclusive Sri Lanka, Ashraff founded the National Unity Alliance (NUA) in 1999 under the slogan 'Sri Lankan First'. His goal was to build a broad multi-ethnic coalition uniting Muslims, Tamils, and Sinhalese under a single democratic platform.",
          "He articulated a vision of shared sovereignty, democratic decentralization, and harmonious coexistence, arguing that true national security could only be achieved through social justice and equal dignity for all communities."
        ]
      },
      {
        title: "The Poet-Statesman ('Naan Ennum Nee') & Enduring Legacy",
        icon: "📜",
        paragraphs: [
          "Beyond his political and legal achievements, Ashraff was a gifted Tamil poet and philosopher. His celebrated poetic anthology 'Naan Ennum Nee' (I and You) is revered for its profound spiritual metaphors, social consciousness, and lyrical beauty.",
          "On September 16, 2000, tragedy struck when the Sri Lanka Air Force Mi-17 helicopter carrying Minister Ashraff crashed into the Bible Rock mountain in Aranayake, claiming his life and the lives of 14 companions on the eve of general elections.",
          "The nation went into profound mourning. Ashraff's legacy lives on in the institutions he built — the South Eastern University of Sri Lanka, the modern Colombo Port, and the enduring democratic voice of the Eastern Province. He remains forever etched in the annals of Sri Lankan history as a leader of the people."
        ]
      },
      {
        title: "Public Tributes & National Voice",
        icon: "💬",
        paragraphs: [
          "Statues, memorial halls, and academic chairs honoring M. H. M. Ashraff stand across Kalmunai, Sammanthurai, Oluvil, Colombo, and universities islandwide.",
          "Every year, citizens from all ethnic and religious communities gather to pay homage to the visionary leader who proved that regional development and national unity go hand in hand.",
          "Leave your heartfelt tributes, memories, and reflections on the life and monumental contributions of Marhoom M. H. M. Ashraff below."
        ]
      }
    ]
  }
];

export const categories = [
  "All",
  "Politics & Leadership",
  "Healthcare & Medicine",
  "Education & Heritage",
  "Engineering & Technology",
  "Social Impact",
  "Sports",
  "Arts & Culture",
  "Linguistics & Culture",
  "Humanitarian Service"
];

const ACHIEVERS_STORAGE_KEY = 'peoplefirst_custom_achievers';

export function getStoredAchievers() {
  try {
    const saved = localStorage.getItem(ACHIEVERS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored achievers', e);
  }
  return [];
}

import api from '../services/api';

let inMemoryAchievers = null;

export function getAllAchievers() {
  if (inMemoryAchievers && inMemoryAchievers.length > 0) {
    return inMemoryAchievers;
  }
  const custom = getStoredAchievers();
  if (custom.length > 0) {
    inMemoryAchievers = custom;
    return custom;
  }
  return achievers;
}

export async function fetchAchieversFromApi(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/achievers${query ? `?${query}` : ''}`);
    if (res.success && Array.isArray(res.data) && res.data.length > 0) {
      const normalized = res.data.map(item => ({
        ...item,
        id: item._id || item.id,
      }));
      inMemoryAchievers = normalized;
      localStorage.setItem(ACHIEVERS_STORAGE_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('API fetch for achievers failed, using cache:', err.message);
  }
  return getAllAchievers();
}

export async function saveAchiever(achieverData) {
  try {
    const isEdit = achieverData._id || (typeof achieverData.id === 'string' && achieverData.id.length === 24);
    let resultAchiever;

    if (isEdit) {
      const id = achieverData._id || achieverData.id;
      const res = await api.put(`/achievers/${id}`, achieverData);
      resultAchiever = res.data ? { ...res.data, id: res.data._id || id } : achieverData;
    } else {
      const res = await api.post('/achievers', achieverData);
      resultAchiever = res.data ? { ...res.data, id: res.data._id } : { ...achieverData, id: Date.now() };
    }

    const current = getAllAchievers();
    const updated = [
      resultAchiever,
      ...current.filter(item => item.id !== resultAchiever.id && item._id !== resultAchiever._id)
    ];
    inMemoryAchievers = updated;
    localStorage.setItem(ACHIEVERS_STORAGE_KEY, JSON.stringify(updated));
    return resultAchiever;
  } catch (e) {
    console.error('Error saving achiever via API, saving to local cache', e);
    const current = getAllAchievers();
    const newAchiever = {
      ...achieverData,
      id: achieverData.id || Date.now(),
      verified: achieverData.verified ?? true,
      featured: achieverData.featured ?? false,
    };
    const updated = [newAchiever, ...current.filter((item) => item.id !== newAchiever.id)];
    inMemoryAchievers = updated;
    localStorage.setItem(ACHIEVERS_STORAGE_KEY, JSON.stringify(updated));
    return newAchiever;
  }
}

export async function deleteAchiever(id) {
  try {
    if (typeof id === 'string' && id.length === 24) {
      await api.delete(`/achievers/${id}`);
    }
  } catch (e) {
    console.warn('Error deleting achiever via API:', e.message);
  }
  const current = getAllAchievers();
  const filtered = current.filter((item) => item.id !== id && item._id !== id);
  inMemoryAchievers = filtered;
  localStorage.setItem(ACHIEVERS_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function getAchieverInterviewSeries(achiever) {
  if (!achiever) return [];
  if (Array.isArray(achiever.interviewSeries) && achiever.interviewSeries.length > 0) {
    return achiever.interviewSeries;
  }
  return [
    {
      id: `ep-${achiever.id || 1}-1`,
      episode: 1,
      title: `${achiever.name || 'Achiever'} — Full Interview Part 1`,
      videoId: achiever.videoId || 'dQw4w9WgXcQ',
      duration: '22:15',
      date: `${achiever.year || 2026}-01-15`,
      description: `In-depth biographical interview covering national milestones and community leadership.`
    }
  ];
}

