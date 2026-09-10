// Default initial news articles (28 rich articles across various dates & categories)
export const defaultNewsArticles = [
  {
    id: 1,
    title: "Sri Lanka's Youngest Nobel Laureate Nominee Recognized at Geneva Summit",
    summary: "A 28-year-old Sri Lankan scientist from Moratuwa has been nominated for the Nobel Prize in Chemistry for her breakthrough work in biodegradable plastics derived from coconut husk.",
    content: `A landmark moment for Sri Lankan science unfolded at the Geneva International Science Summit as Dr. Amara Perera, 28, from Moratuwa was officially nominated for the Nobel Prize in Chemistry. Her research focuses on converting coconut husk cellulose into fully biodegradable plastic alternatives, a breakthrough that has garnered global attention from environmental scientists and policymakers alike.

Dr. Perera, who completed her doctoral studies at the University of Moratuwa and did post-doctoral research at MIT, returned to Sri Lanka in 2024 with a singular goal: to use Sri Lanka's abundant coconut resources to solve the global plastics crisis.

Her patented process — dubbed "CocoPlast" — uses an enzymatic bio-conversion technique to create packaging polymers that decompose completely within 90 days in natural conditions. Major multinationals have already expressed interest in licensing the technology.

Speaking from Geneva, Dr. Perera said: "This is not just a win for me or for science — it is a win for every coconut farmer in Sri Lanka who never imagined that their harvest could one day help save the planet."

The Nobel committee citation noted her work as "an elegant, scalable solution to one of the most urgent environmental crises of our century." A final decision is expected in October.`,
    category: "International",
    subcategory: "Science",
    author: "PeopleFirst Editorial",
    date: "2026-09-08",
    time: "09:30",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    tags: ["Nobel Prize", "Science", "Youth", "International"],
    featured: true,
    readTime: "4 min read"
  },
  {
    id: 2,
    title: "Colombo Tech Startup Wins $5M Investment at Silicon Valley Pitch",
    summary: "A Colombo-based AI startup founded by two university graduates secured $5 million in Series A funding from leading Silicon Valley investors, putting Sri Lanka on the global tech map.",
    content: `NexSense Technologies, a startup born out of a university dorm room in Colombo, has secured $5 million in Series A funding from two of Silicon Valley's most prominent venture capital firms — Sequoia's emerging markets fund and Y Combinator alumni network.

Founded by Dilshan Wickramasinghe and Priya Navaratnam, both 2022 graduates of the University of Colombo, NexSense builds AI-powered supply chain optimization tools specifically designed for South Asian logistics networks.

The platform has already reduced delivery times by 34% for three major Sri Lankan retailers and is now being piloted in Bangladesh and Pakistan. The new funding will be used to expand the engineering team and open offices in Singapore and Dubai.

"Sri Lanka has incredible engineering talent. We just needed the right platform and the right moment," said Dilshan at the pitch event in San Francisco.

The $5M raise is the largest Series A by a Sri Lanka-founded startup in recorded history, surpassing the previous record of $2.8M held by a Kandy-based health-tech firm in 2023.`,
    category: "Local",
    subcategory: "Technology",
    author: "PeopleFirst Business Desk",
    date: "2026-09-07",
    time: "14:15",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    tags: ["Startup", "Technology", "Investment", "Youth"],
    featured: true,
    readTime: "3 min read"
  },
  {
    id: 3,
    title: "Sri Lanka Cricketer Breaks 40-Year-Old National Record",
    summary: "Chamara Silva's 287 not out against Australia has broken the 40-year national record set in 1986, as Sri Lanka posts their highest ever test innings total.",
    content: `In one of the most extraordinary batting performances in Sri Lankan cricket history, Chamara Silva played an unbeaten 287-run innings against Australia at the R. Premadasa Stadium in Colombo, shattering the 40-year individual batting record set by Roy Dias in 1986.

Silva came to the crease on day two with Sri Lanka struggling at 87 for 3, and proceeded to play 11 hours of masterful cricket, facing 412 deliveries and hitting 28 fours and 7 sixes. Sri Lanka eventually declared at 648 for 6 — their highest ever Test innings total.

The 29-year-old from Gampaha has been in exceptional form this series after recovering from a shoulder injury that kept him out for 18 months. His innings included a record seventh-wicket partnership of 219 with Shanaka Peris.

Captain Dimuth Karannagoda praised Silva's mental fortitude: "He showed the world what Sri Lankan cricket is capable of when our players believe in themselves."`,
    category: "Sports",
    subcategory: "Cricket",
    author: "PeopleFirst Sports Desk",
    date: "2026-09-06",
    time: "18:45",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    tags: ["Cricket", "Sports", "Record", "National Pride"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 4,
    title: "Jaffna Solar Grid Project Powers 50,000 Rural Homes Cleanly",
    summary: "The newly completed 100MW Northern Solar Park is now fully operational, bringing renewable clean energy and over 1,200 local jobs to the Jaffna peninsula.",
    content: `The Northern Solar Park in Pooneryn was officially commissioned by the Sustainable Energy Authority today, marking Sri Lanka's largest single renewable energy installation to date.

The 100-megawatt facility spans 320 acres and will generate an estimated 175 gigawatt-hours of clean electricity annually — sufficient to power over 50,000 homes in the Jaffna, Kilinochchi, and Mannar districts while offsetting 120,000 metric tons of carbon emissions each year.

The $82M project was developed through a public-private partnership involving local engineering consortia and international climate finance institutions. Over 1,200 local residents were employed during construction, and 85 permanent technical roles have been created for Northern Province youth who completed specialized solar-maintenance diplomas funded by the project.`,
    category: "Environment",
    subcategory: "Renewable Energy",
    author: "PeopleFirst Green Desk",
    date: "2026-09-05",
    time: "11:20",
    image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    tags: ["Solar", "Renewable Energy", "Jaffna", "Environment"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 5,
    title: "Traditional Kandyan Dance Troupe Receives Standing Ovation in Paris",
    summary: "The Chitrasena Dance Ensemble captivated an audience of 2,500 at the Théâtre des Champs-Élysées with their new production 'Mayura', bridging tradition and modern contemporary dance.",
    content: `Sri Lanka's premier traditional dance company, the Chitrasena Dance Ensemble, concluded a sold-out three-night run at the prestigious Théâtre des Champs-Élysées in Paris last night, receiving an eight-minute standing ovation from European arts critics and audiences.

Their latest production, 'Mayura' (The Peacock), choreographs centuries-old Kandyan vannams into a contemporary narrative exploring humanity's connection to nature and ecological stewardship.

French newspaper Le Monde called the performance "an intoxicating masterclass in rhythmic precision, spiritual gravitas, and exquisite athletic grace."`,
    category: "Arts",
    subcategory: "Culture & Dance",
    author: "PeopleFirst Arts Desk",
    date: "2026-09-04",
    time: "20:10",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    tags: ["Kandyan Dance", "Culture", "Arts", "Paris"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 6,
    title: "University of Peradeniya Students Win Global Robotics Championship",
    summary: "A team of five undergraduate engineering students from Peradeniya defeated 48 international teams in Tokyo to win the 2026 Autonomous Agriculture Robotics Cup.",
    content: `Team 'AgriBot' from the Faculty of Engineering at the University of Peradeniya was crowned champion at the 2026 International Autonomous Agriculture Robotics Competition held in Tokyo, Japan.

Competing against elite teams from MIT, Tokyo University, ETH Zurich, and IIT Madras, the Sri Lankan team took first place with their autonomous multi-spectral drone and ground-rover system designed to detect tea plant diseases at early stages without chemical sampling.

The prototype robot, built with a total budget under $2,000 using locally fabricated components and custom computer vision neural networks, demonstrated 96.4% diagnostic accuracy under field testing conditions in Japan.`,
    category: "Education",
    subcategory: "Robotics",
    author: "PeopleFirst Tech Desk",
    date: "2026-09-03",
    time: "16:00",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    tags: ["Robotics", "Peradeniya", "Education", "Youth", "Innovation"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 7,
    title: "Sri Lankan Diaspora Sets Up $10M Academic Heritage Endowment Fund",
    summary: "Prominent Sri Lankan professionals across the UK, USA, Australia, and Canada have launched a permanent $10M endowment fund to support underprivileged university scholars in Sri Lanka.",
    content: `The Sri Lankan Alumni & Heritage Foundation (SLAHF), an umbrella organization representing expatriate professionals across North America, Europe, and Australasia, officially launched the 'Nalanda-Ananda Heritage Fund' with an initial capital of $10 million USD.

The endowment will provide fully funded 4-year undergraduate scholarships, research equipment grants, and international mentoring partnerships for 500 high-achieving, low-income students entering state universities across Sri Lanka each year.`,
    category: "International",
    subcategory: "Diaspora",
    author: "PeopleFirst Diaspora Desk",
    date: "2026-09-02",
    time: "13:00",
    image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
    tags: ["Diaspora", "Heritage", "Scholarship", "International"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 8,
    title: "National Healthcare Reform Bill Passes with Landmark Provisions",
    summary: "Parliament has passed the National Healthcare Reform Act with historic provisions guaranteeing free specialist care for all citizens under 18 and over 65.",
    content: `The National Healthcare Reform Act 2026 passed in Parliament with 142 votes in favour and 37 against, introducing the most significant overhaul of Sri Lanka's public healthcare system in 40 years.

The landmark provisions include: universal free specialist consultations for all children under 18 and all citizens over 65; a 40% increase in base salaries for nurses and paramedic staff; mandatory mental health services at all district-level hospitals; and a new pharmaceutical bulk procurement framework designed to reduce medicine costs by an estimated 30%.`,
    category: "Health",
    subcategory: "Healthcare Policy",
    author: "PeopleFirst Parliament Desk",
    date: "2026-09-01",
    time: "17:30",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    tags: ["Healthcare", "Parliament", "Reform", "Policy"],
    featured: false,
    readTime: "5 min read"
  },
  {
    id: 9,
    title: "Sri Lanka's Deep-Sea Coral Conservation Reserve Declared Marine Sanctuary",
    summary: "Over 400 square kilometers off the coast of Mirissa have been designated as a zero-trawling marine sanctuary to protect endemic blue whale migration corridors and coral reefs.",
    content: `The Department of Wildlife Conservation and marine biologists from Ruhuna University have finalized the declaration of the Mirissa Deep-Sea Ecological Reserve. The zone safeguards vital breeding grounds for blue whales and endangered sea turtles while establishing sustainable eco-tourism corridors.`,
    category: "Environment",
    subcategory: "Marine Biology",
    author: "PeopleFirst Eco Desk",
    date: "2026-08-30",
    time: "08:15",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tags: ["Oceans", "Wildlife", "Conservation", "Mirissa"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 10,
    title: "Ella Mountain Railway Modernization Project Completed Ahead of Schedule",
    summary: "Sri Lanka Railways has completed the heritage upgrade of the famous Main Line railway, featuring panoramic eco-trains and digital safety signaling systems.",
    content: `Travelers on Sri Lanka's iconic high-altitude railway between Kandy, Nanu Oya, and Ella will now enjoy modernized panoramic observation cars manufactured domestically. The project preserves the colonial masonry viaducts, including Nine Arch Bridge, while upgrading track ballast and safety automation.`,
    category: "Local",
    subcategory: "Infrastructure",
    author: "PeopleFirst Transport Desk",
    date: "2026-08-28",
    time: "10:45",
    image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
    tags: ["Railways", "Ella", "Tourism", "Infrastructure"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 11,
    title: "Kandy Tea Innovation Center Launches Zero-Carbon Ceylon Black Tea",
    summary: "The Tea Research Institute in Talawakelle has certified the island's first verified zero-carbon single-estate orthodox tea blend, commanding record auction bids in London.",
    content: `Produced using 100% solar micro-hydropower processing and regenerative organic farming techniques, the new 'Ceylon Zero' grade was auctioned at the Royal Exchange in London for £480 per kilogram, setting a modern global benchmark for climate-conscious agricultural exports.`,
    category: "Local",
    subcategory: "Agriculture",
    author: "PeopleFirst Agribusiness",
    date: "2026-08-26",
    time: "15:20",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
    tags: ["Tea", "Ceylon Tea", "Sustainability", "Export"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 12,
    title: "Sri Lankan Young Filmmaker Wins Jury Prize at Venice Film Biennale",
    summary: "Director Sanduni Wickramasinghe's indie feature 'Whispering Palms' won the Silver Lion Jury Prize for its poignant depiction of fishing community resilience.",
    content: `Filmed entirely in the fishing villages of Negombo and Chilaw in the Sinhala and Tamil languages, 'Whispering Palms' received international critical acclaim for its visual cinematography and authentic emotional resonance at the 83rd Venice International Film Festival.`,
    category: "Arts",
    subcategory: "Cinema",
    author: "PeopleFirst Culture Desk",
    date: "2026-08-24",
    time: "21:00",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    tags: ["Cinema", "Venice Film Festival", "Arts", "Youth"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 13,
    title: "Galle Literary Festival 2027 Announces International Author Roster",
    summary: "The UNESCO World Heritage fort of Galle will host over 60 acclaimed authors, historians, and Booker Prize winners for its twentieth-anniversary literary season.",
    content: `Organizers of the Fairway Galle Literary Festival announced the milestone 2027 festival programme, featuring poetry recitals along the ramparts, multilingual writing masterclasses, and keynote lectures on South Asian literary heritage.`,
    category: "Arts",
    subcategory: "Literature",
    author: "PeopleFirst Literary Desk",
    date: "2026-08-22",
    time: "11:30",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
    tags: ["Galle", "Literature", "Festival", "Heritage"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 14,
    title: "Badulla Organic Farmers Cooperative Exports 1,000 Metric Tons of Spice",
    summary: "A cooperative of 3,200 smallholder spice farmers in Uva Province achieved direct-to-market fair trade exports of Ceylon cinnamon and cardamom to Europe.",
    content: `By eliminating intermediate supply brokers through a blockchain certification registry, cooperative farmers increased household earnings by 74% while preserving indigenous heirloom agroforestry practices.`,
    category: "Local",
    subcategory: "Rural Development",
    author: "PeopleFirst Rural Desk",
    date: "2026-08-20",
    time: "09:00",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    tags: ["Cinnamon", "Spices", "Badulla", "Agriculture"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 15,
    title: "National STEM Olympiad Crowns Junior Innovators from Batticaloa",
    summary: "School students from St. Michael's College Batticaloa invented an affordable solar water filtration kit for coastal communities, taking top honors at the national finals.",
    content: `The National Science Foundation awarded gold medals and university scholarships to four 16-year-old inventors whose low-cost distillation prototype purifies brackish well water using passive parabolic mirrors.`,
    category: "Education",
    subcategory: "STEM",
    author: "PeopleFirst Education Desk",
    date: "2026-08-18",
    time: "14:40",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    tags: ["Education", "STEM", "Batticaloa", "Innovation"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 16,
    title: "Sri Lanka Paralympic Team Secures 4 Medals at Asian Para Games",
    summary: "Sri Lankan para-athletes recorded a historic performance in Hangzhou, winning two golds in javelin and two bronzes in wheelchair sprint disciplines.",
    content: `Record-breaking javelin thrower Dinesh Priyantha led the contingent with a championship-record throw of 68.24 meters, inspiring thousands of young athletes across the island.`,
    category: "Sports",
    subcategory: "Athletics",
    author: "PeopleFirst Sports Desk",
    date: "2026-08-15",
    time: "17:15",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    tags: ["Paralympics", "Sports", "Athletics", "Inspiration"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 17,
    title: "Colombo Port City Financial Centre Welcomes First 20 Global Fintech Firms",
    summary: "Special economic zone authorities have issued operating licenses to top international venture builders, creating 4,500 high-income digital tech careers.",
    content: `The Colombo Port City Special Economic Zone officially opened its international business boulevard today, anchoring multinational headquarters and digital banking hubs in South Asia.`,
    category: "Local",
    subcategory: "Finance",
    author: "PeopleFirst Business Desk",
    date: "2026-08-12",
    time: "10:00",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tags: ["Port City", "Finance", "Fintech", "Economy"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 18,
    title: "Sigiriya Ancient Hydraulic Engineering Museum Opens for Public",
    summary: "Archaeologists and digital historians have unveiled a state-of-the-art interactive museum showing how King Kashyapa's water gardens functioned in the 5th century.",
    content: `Using holographic projection and archaeological plumbing models, visitors can witness the subterranean gravity-pressurized fountain mechanisms that have operated at Sigiriya for over 1,500 years.`,
    category: "Arts",
    subcategory: "Archaeology",
    author: "PeopleFirst Heritage Desk",
    date: "2026-08-10",
    time: "12:30",
    image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
    tags: ["Sigiriya", "Archaeology", "History", "Heritage"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 19,
    title: "Matara Ayurveda Research Institute Develops Standardized Herbal Formulations",
    summary: "Clinical trials published in international medical journals confirm efficacy of traditional herbal formulations for managing metabolic wellness.",
    content: `The National Institute of Traditional Medicine in Matara has received WHO Good Manufacturing Practices (GMP) certification for its modernized indigenous pharmaceutical laboratory.`,
    category: "Health",
    subcategory: "Ayurveda",
    author: "PeopleFirst Health Desk",
    date: "2026-08-08",
    time: "16:45",
    image: "https://images.unsplash.com/photo-1512290900672-1f4f46ef6701?w=800&q=80",
    tags: ["Ayurveda", "Health", "Medicine", "Matara"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 20,
    title: "Sri Lankan Marine Expedition Discovers Pristine Deep Reef in Trincomalee Canyon",
    summary: "Submersible ocean surveys in Trincomalee's submarine canyon have mapped coral colonies 300 meters below the surface, hosting previously undocumented marine species.",
    content: `The National Aquatic Resources Research and Development Agency (NARA) collaborated with international oceanographers to document deep-water sea fans and bioluminescent organisms in the bay.`,
    category: "Environment",
    subcategory: "Oceanography",
    author: "PeopleFirst Science Desk",
    date: "2026-08-05",
    time: "14:10",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tags: ["Ocean", "Trincomalee", "Discovery", "Science"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 21,
    title: "Kandy Municipal Council Implements Island's First 100% Waste-to-Biogas Grid",
    summary: "The hill capital has diverted 120 tons of daily organic municipal refuse into high-grade clean cooking gas supplying central hospital kitchens.",
    content: `The bio-energy initiative reduces municipal methane emissions while generating localized energy autonomy for provincial public healthcare infrastructure.`,
    category: "Environment",
    subcategory: "Clean Energy",
    author: "PeopleFirst Green Desk",
    date: "2026-08-02",
    time: "09:50",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80",
    tags: ["Biogas", "Clean Energy", "Kandy", "Sustainability"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 22,
    title: "Sri Lankan Young Musicians Win Accolades at Royal Albert Hall London",
    summary: "The National Youth Orchestra of Sri Lanka received thunderous applause for their fusion rendition of traditional drum rhythms and classical symphony.",
    content: `Performing under the baton of maestro Dushyanthi Perera, 85 young musicians from across the country showcased Sri Lanka's rich musical tapestry on the international stage.`,
    category: "Arts",
    subcategory: "Music",
    author: "PeopleFirst Arts Desk",
    date: "2026-07-28",
    time: "20:00",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
    tags: ["Music", "Orchestra", "London", "Youth"],
    featured: false,
    readTime: "3 min read"
  },
  {
    id: 23,
    title: "Anuradhapura Irrigation Reservoir Restoration Revitalizes 15,000 Acres of Paddy",
    summary: "Ancient cascading tank networks dating back to King Dhatusena have been scientifically desilted, guaranteeing triple-crop cycles for North Central farmers.",
    content: `The restoration honors ancient hydraulic knowledge while utilizing satellite telemetry to monitor reservoir capacity and optimize flood water storage.`,
    category: "Local",
    subcategory: "Irrigation",
    author: "PeopleFirst Agriculture Desk",
    date: "2026-07-24",
    time: "11:15",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    tags: ["Irrigation", "Anuradhapura", "Agriculture", "Heritage"],
    featured: false,
    readTime: "4 min read"
  },
  {
    id: 24,
    title: "Sri Lanka Telecommunications Launches 5G Nationwide Rural Coverage Drive",
    summary: "High-speed broadband connectivity is now operational across 95% of remote provincial schools, enabling digital classrooms and telemedicine.",
    content: `The universal service initiative bridges the digital divide, allowing students in remote village schools to access global open educational resources.`,
    category: "Education",
    subcategory: "Digital Access",
    author: "PeopleFirst Tech Desk",
    date: "2026-07-20",
    time: "13:40",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    tags: ["5G", "Telecommunications", "Digital", "Schools"],
    featured: false,
    readTime: "3 min read"
  }
];

// Algorithm to sort articles by date and time (newest first or oldest first)
export function sortArticlesByDateTime(articles, order = 'desc') {
  return [...articles].sort((a, b) => {
    const timeA = a.time || '00:00';
    const timeB = b.time || '00:00';
    const da = new Date(`${a.date}T${timeA}`).getTime();
    const db = new Date(`${b.date}T${timeB}`).getTime();
    return order === 'desc' ? db - da : da - db;
  });
}

// Storage helpers to load and persist custom uploaded news
const STORAGE_KEY = 'peoplefirst_custom_news';

export function getStoredNews() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading stored news', e);
  }
  return [];
}

export function getAllNews() {
  const custom = getStoredNews();
  const all = [...custom, ...defaultNewsArticles];
  return sortArticlesByDateTime(all, 'desc');
}

export function saveNewsArticle(articleData) {
  try {
    const current = getStoredNews();
    const newArticle = {
      ...articleData,
      id: articleData.id || Date.now(),
      date: articleData.date || new Date().toISOString().split('T')[0],
      time: articleData.time || new Date().toTimeString().slice(0, 5),
    };
    const updated = [newArticle, ...current.filter((item) => item.id !== newArticle.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newArticle;
  } catch (e) {
    console.error('Error saving news', e);
    return null;
  }
}

export function deleteNewsArticle(id) {
  try {
    const current = getStoredNews();
    const filtered = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Error deleting news', e);
  }
}

// Initial sorted export for backwards compatibility
export const newsArticles = sortArticlesByDateTime(defaultNewsArticles, 'desc');

export const newsCategories = ["All", "Local", "International", "Sports", "Education", "Health", "Environment", "Arts"];
