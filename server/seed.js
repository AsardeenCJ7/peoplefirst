/**
 * seed.js – Database Seeder for PeopleFirst Platform
 *
 * Seeds all static data (News, Achievers, Awards, VotingConfig, Admin User)
 * into MongoDB from the original client-side data files.
 *
 * Usage:
 *   node seed.js           → seed all collections (non-destructive, skips if data exists)
 *   node seed.js --fresh   → drop and reseed everything fresh
 *   node seed.js --destroy → drop all data (wipe)
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

// ── Models ───────────────────────────────────────────────────────────────────
import User from './models/User.js';
import News from './models/News.js';
import Achiever from './models/Achiever.js';
import Award, { VotingConfig } from './models/Award.js';

// ══════════════════════════════════════════════════════════════════════════════
//  SEED DATA
// ══════════════════════════════════════════════════════════════════════════════

// ── NEWS ARTICLES ─────────────────────────────────────────────────────────────
const newsData = [
  {
    title: "Sri Lanka's Youngest Nobel Laureate Nominee Recognized at Geneva Summit",
    summary: "A 28-year-old Sri Lankan scientist from Moratuwa has been nominated for the Nobel Prize in Chemistry for her breakthrough work in biodegradable plastics derived from coconut husk.",
    content: `A landmark moment for Sri Lankan science unfolded at the Geneva International Science Summit as Dr. Amara Perera, 28, from Moratuwa was officially nominated for the Nobel Prize in Chemistry. Her research focuses on converting coconut husk cellulose into fully biodegradable plastic alternatives, a breakthrough that has garnered global attention from environmental scientists and policymakers alike.\n\nDr. Perera, who completed her doctoral studies at the University of Moratuwa and did post-doctoral research at MIT, returned to Sri Lanka in 2024 with a singular goal: to use Sri Lanka's abundant coconut resources to solve the global plastics crisis.\n\nHer patented process — dubbed "CocoPlast" — uses an enzymatic bio-conversion technique to create packaging polymers that decompose completely within 90 days in natural conditions. Major multinationals have already expressed interest in licensing the technology.\n\nSpeaking from Geneva, Dr. Perera said: "This is not just a win for me or for science — it is a win for every coconut farmer in Sri Lanka who never imagined that their harvest could one day help save the planet."\n\nThe Nobel committee citation noted her work as "an elegant, scalable solution to one of the most urgent environmental crises of our century." A final decision is expected in October.`,
    category: "International", subcategory: "Science", author: "PeopleFirst Editorial",
    date: "2026-09-08", time: "09:30", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    tags: ["Nobel Prize", "Science", "Youth", "International"], featured: true, readTime: "4 min read"
  },
  {
    title: "Colombo Tech Startup Wins $5M Investment at Silicon Valley Pitch",
    summary: "A Colombo-based AI startup founded by two university graduates secured $5 million in Series A funding from leading Silicon Valley investors, putting Sri Lanka on the global tech map.",
    content: `NexSense Technologies, a startup born out of a university dorm room in Colombo, has secured $5 million in Series A funding from two of Silicon Valley's most prominent venture capital firms — Sequoia's emerging markets fund and Y Combinator alumni network.\n\nFounded by Dilshan Wickramasinghe and Priya Navaratnam, both 2022 graduates of the University of Colombo, NexSense builds AI-powered supply chain optimization tools specifically designed for South Asian logistics networks.\n\nThe platform has already reduced delivery times by 34% for three major Sri Lankan retailers and is now being piloted in Bangladesh and Pakistan. The new funding will be used to expand the engineering team and open offices in Singapore and Dubai.\n\n"Sri Lanka has incredible engineering talent. We just needed the right platform and the right moment," said Dilshan at the pitch event in San Francisco.\n\nThe $5M raise is the largest Series A by a Sri Lanka-founded startup in recorded history, surpassing the previous record of $2.8M held by a Kandy-based health-tech firm in 2023.`,
    category: "Local", subcategory: "Technology", author: "PeopleFirst Business Desk",
    date: "2026-09-07", time: "14:15", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80",
    tags: ["Startup", "Technology", "Investment", "Youth"], featured: true, readTime: "3 min read"
  },
  {
    title: "Sri Lanka Cricketer Breaks 40-Year-Old National Record",
    summary: "Chamara Silva's 287 not out against Australia has broken the 40-year national record set in 1986, as Sri Lanka posts their highest ever test innings total.",
    content: "In one of the most extraordinary batting performances in Sri Lankan cricket history, Chamara Silva played an unbeaten 287-run innings against Australia at the R. Premadasa Stadium in Colombo, shattering the 40-year individual batting record set by Roy Dias in 1986.\n\nSilva came to the crease on day two with Sri Lanka struggling at 87 for 3, and proceeded to play 11 hours of masterful cricket, facing 412 deliveries and hitting 28 fours and 7 sixes. Sri Lanka eventually declared at 648 for 6 — their highest ever Test innings total.\n\nThe 29-year-old from Gampaha has been in exceptional form this series after recovering from a shoulder injury that kept him out for 18 months. His innings included a record seventh-wicket partnership of 219 with Shanaka Peris.\n\nCaptain Dimuth Karannagoda praised Silva's mental fortitude: \"He showed the world what Sri Lankan cricket is capable of when our players believe in themselves.\"",
    category: "Sports", subcategory: "Cricket", author: "PeopleFirst Sports Desk",
    date: "2026-09-06", time: "18:45", image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&q=80",
    tags: ["Cricket", "Sports", "Record", "National Pride"], featured: false, readTime: "3 min read"
  },
  {
    title: "Jaffna Solar Grid Project Powers 50,000 Rural Homes Cleanly",
    summary: "The newly completed 100MW Northern Solar Park is now fully operational, bringing renewable clean energy and over 1,200 local jobs to the Jaffna peninsula.",
    content: "The Northern Solar Park in Pooneryn was officially commissioned by the Sustainable Energy Authority today, marking Sri Lanka's largest single renewable energy installation to date.\n\nThe 100-megawatt facility spans 320 acres and will generate an estimated 175 gigawatt-hours of clean electricity annually — sufficient to power over 50,000 homes in the Jaffna, Kilinochchi, and Mannar districts while offsetting 120,000 metric tons of carbon emissions each year.\n\nThe $82M project was developed through a public-private partnership involving local engineering consortia and international climate finance institutions. Over 1,200 local residents were employed during construction, and 85 permanent technical roles have been created for Northern Province youth who completed specialized solar-maintenance diplomas funded by the project.",
    category: "Environment", subcategory: "Renewable Energy", author: "PeopleFirst Green Desk",
    date: "2026-09-05", time: "11:20", image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&q=80",
    tags: ["Solar", "Renewable Energy", "Jaffna", "Environment"], featured: false, readTime: "4 min read"
  },
  {
    title: "Traditional Kandyan Dance Troupe Receives Standing Ovation in Paris",
    summary: "The Chitrasena Dance Ensemble captivated an audience of 2,500 at the Théâtre des Champs-Élysées with their new production 'Mayura', bridging tradition and modern contemporary dance.",
    content: "Sri Lanka's premier traditional dance company, the Chitrasena Dance Ensemble, concluded a sold-out three-night run at the prestigious Théâtre des Champs-Élysées in Paris last night, receiving an eight-minute standing ovation from European arts critics and audiences.\n\nTheir latest production, 'Mayura' (The Peacock), choreographs centuries-old Kandyan vannams into a contemporary narrative exploring humanity's connection to nature and ecological stewardship.\n\nFrench newspaper Le Monde called the performance \"an intoxicating masterclass in rhythmic precision, spiritual gravitas, and exquisite athletic grace.\"",
    category: "Arts", subcategory: "Culture & Dance", author: "PeopleFirst Arts Desk",
    date: "2026-09-04", time: "20:10", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    tags: ["Kandyan Dance", "Culture", "Arts", "Paris"], featured: false, readTime: "3 min read"
  },
  {
    title: "University of Peradeniya Students Win Global Robotics Championship",
    summary: "A team of five undergraduate engineering students from Peradeniya defeated 48 international teams in Tokyo to win the 2026 Autonomous Agriculture Robotics Cup.",
    content: "Team 'AgriBot' from the Faculty of Engineering at the University of Peradeniya was crowned champion at the 2026 International Autonomous Agriculture Robotics Competition held in Tokyo, Japan.\n\nCompeting against elite teams from MIT, Tokyo University, ETH Zurich, and IIT Madras, the Sri Lankan team took first place with their autonomous multi-spectral drone and ground-rover system designed to detect tea plant diseases at early stages without chemical sampling.\n\nThe prototype robot, built with a total budget under $2,000 using locally fabricated components and custom computer vision neural networks, demonstrated 96.4% diagnostic accuracy under field testing conditions in Japan.",
    category: "Education", subcategory: "Robotics", author: "PeopleFirst Tech Desk",
    date: "2026-09-03", time: "16:00", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    tags: ["Robotics", "Peradeniya", "Education", "Youth", "Innovation"], featured: false, readTime: "4 min read"
  },
  {
    title: "Sri Lankan Diaspora Sets Up $10M Academic Heritage Endowment Fund",
    summary: "Prominent Sri Lankan professionals across the UK, USA, Australia, and Canada have launched a permanent $10M endowment fund to support underprivileged university scholars in Sri Lanka.",
    content: "The Sri Lankan Alumni & Heritage Foundation (SLAHF), an umbrella organization representing expatriate professionals across North America, Europe, and Australasia, officially launched the 'Nalanda-Ananda Heritage Fund' with an initial capital of $10 million USD.\n\nThe endowment will provide fully funded 4-year undergraduate scholarships, research equipment grants, and international mentoring partnerships for 500 high-achieving, low-income students entering state universities across Sri Lanka each year.",
    category: "International", subcategory: "Diaspora", author: "PeopleFirst Diaspora Desk",
    date: "2026-09-02", time: "13:00", image: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80",
    tags: ["Diaspora", "Heritage", "Scholarship", "International"], featured: false, readTime: "3 min read"
  },
  {
    title: "National Healthcare Reform Bill Passes with Landmark Provisions",
    summary: "Parliament has passed the National Healthcare Reform Act with historic provisions guaranteeing free specialist care for all citizens under 18 and over 65.",
    content: "The National Healthcare Reform Act 2026 passed in Parliament with 142 votes in favour and 37 against, introducing the most significant overhaul of Sri Lanka's public healthcare system in 40 years.\n\nThe landmark provisions include: universal free specialist consultations for all children under 18 and all citizens over 65; a 40% increase in base salaries for nurses and paramedic staff; mandatory mental health services at all district-level hospitals; and a new pharmaceutical bulk procurement framework designed to reduce medicine costs by an estimated 30%.",
    category: "Health", subcategory: "Healthcare Policy", author: "PeopleFirst Parliament Desk",
    date: "2026-09-01", time: "17:30", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80",
    tags: ["Healthcare", "Parliament", "Reform", "Policy"], featured: false, readTime: "5 min read"
  },
  {
    title: "Sri Lanka's Deep-Sea Coral Conservation Reserve Declared Marine Sanctuary",
    summary: "Over 400 square kilometers off the coast of Mirissa have been designated as a zero-trawling marine sanctuary to protect endemic blue whale migration corridors and coral reefs.",
    content: "The Department of Wildlife Conservation and marine biologists from Ruhuna University have finalized the declaration of the Mirissa Deep-Sea Ecological Reserve. The zone safeguards vital breeding grounds for blue whales and endangered sea turtles while establishing sustainable eco-tourism corridors.",
    category: "Environment", subcategory: "Marine Biology", author: "PeopleFirst Eco Desk",
    date: "2026-08-30", time: "08:15", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tags: ["Oceans", "Wildlife", "Conservation", "Mirissa"], featured: false, readTime: "3 min read"
  },
  {
    title: "Ella Mountain Railway Modernization Project Completed Ahead of Schedule",
    summary: "Sri Lanka Railways has completed the heritage upgrade of the famous Main Line railway, featuring panoramic eco-trains and digital safety signaling systems.",
    content: "Travelers on Sri Lanka's iconic high-altitude railway between Kandy, Nanu Oya, and Ella will now enjoy modernized panoramic observation cars manufactured domestically. The project preserves the colonial masonry viaducts, including Nine Arch Bridge, while upgrading track ballast and safety automation.",
    category: "Local", subcategory: "Infrastructure", author: "PeopleFirst Transport Desk",
    date: "2026-08-28", time: "10:45", image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80",
    tags: ["Railways", "Ella", "Tourism", "Infrastructure"], featured: false, readTime: "3 min read"
  },
  {
    title: "Kandy Tea Innovation Center Launches Zero-Carbon Ceylon Black Tea",
    summary: "The Tea Research Institute in Talawakelle has certified the island's first verified zero-carbon single-estate orthodox tea blend, commanding record auction bids in London.",
    content: "Produced using 100% solar micro-hydropower processing and regenerative organic farming techniques, the new 'Ceylon Zero' grade was auctioned at the Royal Exchange in London for £480 per kilogram, setting a modern global benchmark for climate-conscious agricultural exports.",
    category: "Local", subcategory: "Agriculture", author: "PeopleFirst Agribusiness",
    date: "2026-08-26", time: "15:20", image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80",
    tags: ["Tea", "Ceylon Tea", "Sustainability", "Export"], featured: false, readTime: "4 min read"
  },
  {
    title: "Sri Lankan Young Filmmaker Wins Jury Prize at Venice Film Biennale",
    summary: "Director Sanduni Wickramasinghe's indie feature 'Whispering Palms' won the Silver Lion Jury Prize for its poignant depiction of fishing community resilience.",
    content: "Filmed entirely in the fishing villages of Negombo and Chilaw in the Sinhala and Tamil languages, 'Whispering Palms' received international critical acclaim for its visual cinematography and authentic emotional resonance at the 83rd Venice International Film Festival.",
    category: "Arts", subcategory: "Cinema", author: "PeopleFirst Culture Desk",
    date: "2026-08-24", time: "21:00", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    tags: ["Cinema", "Venice Film Festival", "Arts", "Youth"], featured: false, readTime: "3 min read"
  },
  {
    title: "Galle Literary Festival 2027 Announces International Author Roster",
    summary: "The UNESCO World Heritage fort of Galle will host over 60 acclaimed authors, historians, and Booker Prize winners for its twentieth-anniversary literary season.",
    content: "Organizers of the Fairway Galle Literary Festival announced the milestone 2027 festival programme, featuring poetry recitals along the ramparts, multilingual writing masterclasses, and keynote lectures on South Asian literary heritage.",
    category: "Arts", subcategory: "Literature", author: "PeopleFirst Literary Desk",
    date: "2026-08-22", time: "11:30", image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=800&q=80",
    tags: ["Galle", "Literature", "Festival", "Heritage"], featured: false, readTime: "3 min read"
  },
  {
    title: "Badulla Organic Farmers Cooperative Exports 1,000 Metric Tons of Spice",
    summary: "A cooperative of 3,200 smallholder spice farmers in Uva Province achieved direct-to-market fair trade exports of Ceylon cinnamon and cardamom to Europe.",
    content: "By eliminating intermediate supply brokers through a blockchain certification registry, cooperative farmers increased household earnings by 74% while preserving indigenous heirloom agroforestry practices.",
    category: "Local", subcategory: "Rural Development", author: "PeopleFirst Rural Desk",
    date: "2026-08-20", time: "09:00", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80",
    tags: ["Cinnamon", "Spices", "Badulla", "Agriculture"], featured: false, readTime: "3 min read"
  },
  {
    title: "National STEM Olympiad Crowns Junior Innovators from Batticaloa",
    summary: "School students from St. Michael's College Batticaloa invented an affordable solar water filtration kit for coastal communities, taking top honors at the national finals.",
    content: "The National Science Foundation awarded gold medals and university scholarships to four 16-year-old inventors whose low-cost distillation prototype purifies brackish well water using passive parabolic mirrors.",
    category: "Education", subcategory: "STEM", author: "PeopleFirst Education Desk",
    date: "2026-08-18", time: "14:40", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&q=80",
    tags: ["Education", "STEM", "Batticaloa", "Innovation"], featured: false, readTime: "3 min read"
  },
  {
    title: "Sri Lanka Paralympic Team Secures 4 Medals at Asian Para Games",
    summary: "Sri Lankan para-athletes recorded a historic performance in Hangzhou, winning two golds in javelin and two bronzes in wheelchair sprint disciplines.",
    content: "Record-breaking javelin thrower Dinesh Priyantha led the contingent with a championship-record throw of 68.24 meters, inspiring thousands of young athletes across the island.",
    category: "Sports", subcategory: "Athletics", author: "PeopleFirst Sports Desk",
    date: "2026-08-15", time: "17:15", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
    tags: ["Paralympics", "Sports", "Athletics", "Inspiration"], featured: false, readTime: "3 min read"
  },
  {
    title: "Colombo Port City Financial Centre Welcomes First 20 Global Fintech Firms",
    summary: "Special economic zone authorities have issued operating licenses to top international venture builders, creating 4,500 high-income digital tech careers.",
    content: "The Colombo Port City Special Economic Zone officially opened its international business boulevard today, anchoring multinational headquarters and digital banking hubs in South Asia.",
    category: "Local", subcategory: "Finance", author: "PeopleFirst Business Desk",
    date: "2026-08-12", time: "10:00", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    tags: ["Port City", "Finance", "Fintech", "Economy"], featured: false, readTime: "4 min read"
  },
  {
    title: "Sigiriya Ancient Hydraulic Engineering Museum Opens for Public",
    summary: "Archaeologists and digital historians have unveiled a state-of-the-art interactive museum showing how King Kashyapa's water gardens functioned in the 5th century.",
    content: "Using holographic projection and archaeological plumbing models, visitors can witness the subterranean gravity-pressurized fountain mechanisms that have operated at Sigiriya for over 1,500 years.",
    category: "Arts", subcategory: "Archaeology", author: "PeopleFirst Heritage Desk",
    date: "2026-08-10", time: "12:30", image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=800&q=80",
    tags: ["Sigiriya", "Archaeology", "History", "Heritage"], featured: false, readTime: "4 min read"
  },
  {
    title: "Matara Ayurveda Research Institute Develops Standardized Herbal Formulations",
    summary: "Clinical trials published in international medical journals confirm efficacy of traditional herbal formulations for managing metabolic wellness.",
    content: "The National Institute of Traditional Medicine in Matara has received WHO Good Manufacturing Practices (GMP) certification for its modernized indigenous pharmaceutical laboratory.",
    category: "Health", subcategory: "Ayurveda", author: "PeopleFirst Health Desk",
    date: "2026-08-08", time: "16:45", image: "https://images.unsplash.com/photo-1512290900672-1f4f46ef6701?w=800&q=80",
    tags: ["Ayurveda", "Health", "Medicine", "Matara"], featured: false, readTime: "3 min read"
  },
  {
    title: "Sri Lankan Marine Expedition Discovers Pristine Deep Reef in Trincomalee Canyon",
    summary: "Submersible ocean surveys in Trincomalee's submarine canyon have mapped coral colonies 300 meters below the surface, hosting previously undocumented marine species.",
    content: "The National Aquatic Resources Research and Development Agency (NARA) collaborated with international oceanographers to document deep-water sea fans and bioluminescent organisms in the bay.",
    category: "Environment", subcategory: "Oceanography", author: "PeopleFirst Science Desk",
    date: "2026-08-05", time: "14:10", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    tags: ["Ocean", "Trincomalee", "Discovery", "Science"], featured: false, readTime: "3 min read"
  },
  {
    title: "Kandy Municipal Council Implements Island's First 100% Waste-to-Biogas Grid",
    summary: "The hill capital has diverted 120 tons of daily organic municipal refuse into high-grade clean cooking gas supplying central hospital kitchens.",
    content: "The bio-energy initiative reduces municipal methane emissions while generating localized energy autonomy for provincial public healthcare infrastructure.",
    category: "Environment", subcategory: "Clean Energy", author: "PeopleFirst Green Desk",
    date: "2026-08-02", time: "09:50", image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80",
    tags: ["Biogas", "Clean Energy", "Kandy", "Sustainability"], featured: false, readTime: "3 min read"
  },
  {
    title: "Sri Lankan Young Musicians Win Accolades at Royal Albert Hall London",
    summary: "The National Youth Orchestra of Sri Lanka received thunderous applause for their fusion rendition of traditional drum rhythms and classical symphony.",
    content: "Performing under the baton of maestro Dushyanthi Perera, 85 young musicians from across the country showcased Sri Lanka's rich musical tapestry on the international stage.",
    category: "Arts", subcategory: "Music", author: "PeopleFirst Arts Desk",
    date: "2026-07-28", time: "20:00", image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80",
    tags: ["Music", "Orchestra", "London", "Youth"], featured: false, readTime: "3 min read"
  },
  {
    title: "Anuradhapura Irrigation Reservoir Restoration Revitalizes 15,000 Acres of Paddy",
    summary: "Ancient cascading tank networks dating back to King Dhatusena have been scientifically desilted, guaranteeing triple-crop cycles for North Central farmers.",
    content: "The restoration honors ancient hydraulic knowledge while utilizing satellite telemetry to monitor reservoir capacity and optimize flood water storage.",
    category: "Local", subcategory: "Irrigation", author: "PeopleFirst Agriculture Desk",
    date: "2026-07-24", time: "11:15", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    tags: ["Irrigation", "Anuradhapura", "Agriculture", "Heritage"], featured: false, readTime: "4 min read"
  },
  {
    title: "Sri Lanka Telecommunications Launches 5G Nationwide Rural Coverage Drive",
    summary: "High-speed broadband connectivity is now operational across 95% of remote provincial schools, enabling digital classrooms and telemedicine.",
    content: "The universal service initiative bridges the digital divide, allowing students in remote village schools to access global open educational resources.",
    category: "Education", subcategory: "Digital Access", author: "PeopleFirst Tech Desk",
    date: "2026-07-20", time: "13:40", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    tags: ["5G", "Telecommunications", "Digital", "Schools"], featured: false, readTime: "3 min read"
  }
];

// ── ACHIEVERS ─────────────────────────────────────────────────────────────────
const achieversData = [
  {
    name: "Dr. Nilanthi Jayasinghe",
    title: "Pioneer of Rural Tele-Health Diagnostics",
    category: "Healthcare & Medicine",
    location: "Badulla District",
    year: "2018",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: "Dr. Nilanthi Jayasinghe is a pioneering medical professional who revolutionized healthcare access in rural Sri Lanka. Born in Badulla, she dedicated three decades to serving underprivileged communities across the Uva Province.\n\nHer groundbreaking achievement was establishing a network of decentralized tele-health diagnostics, connecting over 400 rural clinics with specialist units in Colombo. This innovation allowed patients in the most remote areas to receive specialist consultations without traveling hundreds of kilometers.\n\nHer work has benefited over 2 million rural patients since 2018, significantly reducing maternal mortality rates by 67% in the regions she served.",
    achievements: ["National Medical Excellence Award 2020", "Commonwealth Medical Innovation Prize 2022", "500+ Community Health Officers Trained", "67% reduction in maternal mortality", "2M+ rural patients served"],
    tags: ["Healthcare", "Innovation", "Rural Development", "Women in Medicine"],
    interviewSeries: [
      { id: "ep-1-1", episode: 1, title: "Part 1: The Remote Diagnostic Vision & Early Days", videoId: "dQw4w9WgXcQ", duration: "18:24", date: "2026-01-15", description: "Dr. Nilanthi discusses the foundational hurdles of establishing tele-health kiosks in Badulla." },
      { id: "ep-1-2", episode: 2, title: "Part 2: Overcoming Mountain Road Realities & Maternal Care", videoId: "9bZkp7q19f0", duration: "22:10", date: "2026-02-01", description: "In-depth insights into emergency maternal diagnostic systems in Uva Province." },
      { id: "ep-1-3", episode: 3, title: "Part 3: The Rural Health Academy & Future Vision", videoId: "kJQP7kiw5Fk", duration: "15:45", date: "2026-03-05", description: "Training over 500 community officers and the roadmap to nationwide healthcare coverage." }
    ],
    biographyPages: [
      { title: "Early Life & Beginnings", icon: "📖", paragraphs: ["Dr. Nilanthi Jayasinghe was born in 1972 in the verdant hills of Badulla, the heart of Sri Lanka's Uva Province. Growing up in a modest family of teachers, she witnessed firsthand the chronic lack of medical care that plagued rural communities.", "Her father, a village school principal, often walked five miles to fetch a doctor for ailing neighbours. That sight never left her. At the age of nine, she resolved to become a doctor — not to work in a city hospital, but to return to the people who needed her most.", "She excelled academically, earning a full scholarship to the University of Colombo Faculty of Medicine in 1990."] },
      { title: "Journey & Contribution", icon: "🌟", paragraphs: ["After completing her medical degree and postgraduate specialisation in Internal Medicine, Dr. Jayasinghe made a decision that shocked her peers: she turned down a prestigious Colombo hospital offer and returned to Badulla.", "Over the next decade, she drove long mountain roads daily to reach remote clinics, often treating patients by lantern-light.", "In 2010, she began conceptualizing a tele-health network — a system that would use satellite internet and telemedicine kiosks to connect village clinics directly with specialist units at teaching hospitals."] },
      { title: "Key Achievements", icon: "🏆", paragraphs: ["By 2018, Dr. Jayasinghe had successfully connected 400 rural clinics across the Uva Province to specialist units in Colombo.", "The results were transformative. Maternal mortality in connected regions dropped by 67% within three years.", "She was awarded the National Medical Excellence Award in 2020 by the Sri Lankan President."] },
      { title: "Historical Impact & Legacy", icon: "🌍", paragraphs: ["Dr. Jayasinghe's work transcends medicine. In communities she served, school enrolment rates rose as families no longer needed to keep older children home to care for chronically ill parents.", "International health organisations from Bangladesh, Nepal, and three Sub-Saharan African nations have dispatched delegations to study her model.", "\"I did not invent technology,\" she has said. \"I simply refused to let geography be a death sentence. Every child in Badulla deserves the same doctor as every child in Colombo.\""] },
      { title: "Public Tributes & Community Voice", icon: "💬", paragraphs: ["The communities Dr. Jayasinghe served have honoured her in ways no award could match. Villages across Badulla have named streets, schools, and clinics after her.", "Her story has been adapted into a Sinhala-language film and a children's educational graphic novel distributed free to all primary schools in the Uva Province.", "Share your tribute, memory, or message for Dr. Nilanthi Jayasinghe in the community comments below."] }
    ]
  },
  {
    name: "Prof. Shantha Wickramasinghe",
    title: "Guardian of Ancient Palm-Leaf Manuscripts",
    category: "Education & Heritage",
    location: "Peradeniya, Kandy",
    year: "2015",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    videoId: "9bZkp7q19f0",
    bio: "Professor Shantha Wickramasinghe has dedicated his life to preserving Sri Lanka's ancient literary heritage. As a senior professor at the University of Peradeniya, he spearheaded the most ambitious digitization project in South Asian cultural history.\n\nOver 30 years, Prof. Wickramasinghe personally supervised the archiving of more than 12,000 ancient palm-leaf Ola manuscripts, converting them into high-resolution digital formats now accessible to scholars worldwide through open-access repositories.",
    achievements: ["UNESCO Cultural Heritage Champion 2019", "12,000+ Manuscripts Digitized", "Peradeniya University Emeritus Professor", "45+ Countries Access His Archive", "Presidential Award for Cultural Preservation"],
    tags: ["Heritage", "Education", "Digital Preservation", "Academia"],
    interviewSeries: [
      { id: "ep-2-1", episode: 1, title: "Part 1: The Vanishing Palm-Leaf Manuscripts of Peradeniya", videoId: "9bZkp7q19f0", duration: "24:10", date: "2026-01-18", description: "Prof. Shantha shares the thrilling discovery of thousands of Ola manuscripts preserved across ancient temple archives." }
    ],
    biographyPages: [
      { title: "Early Life & Beginnings", icon: "📖", paragraphs: ["Professor Shantha Wickramasinghe was born in 1955 in the ancient city of Kandy, raised in the shadow of the Temple of the Tooth — a childhood steeped in centuries of living heritage.", "His passion for ancient literature led him to the University of Peradeniya, where he pursued a degree in Sinhala Literature before completing his doctorate in South Asian Manuscript Studies at Oxford.", "At the time, thousands of Ola leaf manuscripts in temple libraries and private collections across Sri Lanka were crumbling from humidity, insect damage, and neglect."] },
      { title: "Journey & Contribution", icon: "🌟", paragraphs: ["In 1992, Prof. Wickramasinghe secured a landmark grant to begin systematic digitization of Sri Lanka's palm-leaf manuscript heritage.", "Over 30 years, his project expanded from a single university room to a fully-equipped digitization centre employing 45 researchers and conservators.", "He pioneered a unique crowd-sourcing method where village temples registered their collections online, enabling his team to reach locations that no formal survey had ever documented."] },
      { title: "Key Achievements", icon: "🏆", paragraphs: ["UNESCO named Prof. Wickramasinghe a Cultural Heritage Champion in 2019, one of only seven individuals globally to receive the honour that year.", "His archive is now accessible to scholars in over 45 countries through an open-access online platform that receives over 120,000 academic visits annually.", "His team recovered 2,000 manuscripts previously believed destroyed in the catastrophic 1981 Jaffna Public Library fire."] },
      { title: "Public Tributes & Community Voice", icon: "💬", paragraphs: ["Researchers, monks, historians, and ordinary Sri Lankans have written thousands of letters and messages to Prof. Wickramasinghe over the decades.", "The Peradeniya University campus has named its manuscript reading room the Wickramasinghe Hall.", "Leave your tribute or message for Prof. Shantha Wickramasinghe below."] }
    ]
  },
  {
    name: "Eng. Priyantha Dissanayake",
    title: "Sri Lanka's Solar Energy Revolution Pioneer",
    category: "Engineering & Technology",
    location: "Colombo",
    year: "2020",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    videoId: "kJQP7kiw5Fk",
    bio: "Engineer Priyantha Dissanayake is the visionary behind Sri Lanka's most ambitious renewable energy transformation. His innovative approach using locally manufactured solar panels reduced costs by 40% compared to imported alternatives, creating a thriving local solar industry that employs over 5,000 workers.",
    achievements: ["ADB Green Energy Champion 2021", "150,000 Homes Electrified", "5,000+ Jobs Created", "Patent: Solar Water Pumping Technology", "Technology adopted in 12 countries"],
    tags: ["Engineering", "Renewable Energy", "Innovation", "Environment"],
    interviewSeries: [
      { id: "ep-3-1", episode: 1, title: "Part 1: Designing Solar Tech for Off-Grid Rural Homes", videoId: "kJQP7kiw5Fk", duration: "21:15", date: "2026-01-22", description: "Eng. Priyantha explains the engineering behind affordable indigenous solar panels." }
    ],
    biographyPages: [
      { title: "Early Life & Beginnings", icon: "📖", paragraphs: ["Priyantha Dissanayake grew up in a village without reliable electricity in Hambantota, where his childhood was marked by the contrast between the abundant sunshine and the absence of power.", "His determination to solve this paradox led him to study electrical engineering at the University of Moratuwa, where he graduated top of his class in 2002.", "After a brief career in industrial automation, he pivoted entirely to renewable energy — a decision that would transform Sri Lanka's energy landscape."] },
      { title: "Journey & Contribution", icon: "🌟", paragraphs: ["His National Solar Grid Initiative, launched in 2016, was the most ambitious rural electrification programme in Sri Lankan history.", "Using locally manufactured panels he designed in collaboration with university labs, he reduced per-unit costs by 40% compared to imported alternatives.", "By 2020, 150,000 agrarian households across the Dry Zone had reliable electricity for the first time in their history."] },
      { title: "Key Achievements", icon: "🏆", paragraphs: ["The Asian Development Bank named him a Green Energy Champion in 2021, citing the initiative as a model for developing nations.", "His patented solar water pumping technology has been adopted in 12 countries across South and Southeast Asia.", "His work prevents an estimated 2 million tons of CO2 emissions annually."] },
      { title: "Public Tributes & Community Voice", icon: "💬", paragraphs: ["Farmers across the Dry Zone credit Dissanayake's solar pumps with tripling their crop yields through reliable irrigation.", "Village children who grew up studying by candlelight now charge tablets and access online education through the grids he built.", "Leave your tribute or message for Eng. Priyantha Dissanayake in the community comments below."] }
    ]
  },
  {
    name: "Mrs. Kamala Perera",
    title: "Champion of Girl's Education & Women's Empowerment",
    category: "Social Impact & Philanthropy",
    location: "Gampaha District",
    year: "2016",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: "Mrs. Kamala Perera is a celebrated social entrepreneur who has transformed educational opportunities for girls in Sri Lanka's most vulnerable communities. Her organization, the Kamala Foundation, has guaranteed secondary education and university sponsorships for over 10,000 girls since 2016.",
    achievements: ["UNICEF Social Champion Award 2022", "10,000+ Girls Educated", "National Woman of the Year 2021", "50 Schools Partnered", "International Women's Day Honoree 2023"],
    tags: ["Education", "Women's Rights", "Social Impact", "Philanthropy"],
    interviewSeries: [
      { id: "ep-4-1", episode: 1, title: "Part 1: The Education Gap & Why It Must End", videoId: "dQw4w9WgXcQ", duration: "20:35", date: "2026-01-28", description: "Mrs. Kamala explains the systemic barriers keeping rural girls from school and how her foundation breaks them." }
    ],
    biographyPages: [
      { title: "Early Life & Beginnings", icon: "📖", paragraphs: ["Kamala Perera was born in 1968 in a village near Gampaha, the eldest of six siblings in a farming family. As a girl, she had to fight her own family's reluctance to invest in a daughter's education.", "Determined to prove that education transforms lives, she earned a scholarship to the University of Kelaniya and later completed a Master's degree in Social Policy at the University of Colombo.", "After two decades in the corporate sector, she left her career in 2015 to confront the educational injustice she had personally overcome."] },
      { title: "Journey & Contribution", icon: "🌟", paragraphs: ["The Kamala Foundation, established in 2016, began by sponsoring 12 girls in Gampaha District. Within five years, it had grown into a national programme with 50 partner schools and a waiting list of hundreds.", "Mrs. Perera developed a mentoring model pairing sponsored girls with professional women volunteers — providing not just financial support but career guidance and emotional mentorship.", "She successfully lobbied Parliament for the inclusion of female student retention metrics in school performance evaluation frameworks."] },
      { title: "Key Achievements", icon: "🏆", paragraphs: ["Over 10,000 girls have received full secondary education sponsorships, with 3,200 going on to university — 92% of whom are the first university graduates in their families.", "UNICEF named Mrs. Perera a Social Champion in 2022, and she was honoured as National Woman of the Year in 2021 by the Ministry of Women's Affairs.", "Her model has been replicated in Bangladesh, Nepal, and Myanmar through partnerships with international development agencies."] },
      { title: "Public Tributes & Community Voice", icon: "💬", paragraphs: ["Thousands of girls sponsored by the Kamala Foundation have written letters to their benefactor over the years, many describing her as the reason they dared to dream.", "Alumni of the programme now include doctors, engineers, teachers, and entrepreneurs serving communities across Sri Lanka.", "Leave your tribute or message for Mrs. Kamala Perera in the community comments below."] }
    ]
  },
  {
    name: "Ravi Jayawardena",
    title: "National Athletics Coach & Youth Sports Pioneer",
    category: "Sports & Athletics",
    location: "Colombo",
    year: "2019",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: "Coach Ravi Jayawardena is a national legend in Sri Lankan athletics who has coached 14 athletes to Asian Games podium finishes over his 25-year career. His free sports camps for underprivileged school students have trained over 2,000 young athletes.",
    achievements: ["National Sports Coach of the Year 2022", "14 Asian Games Medalists Trained", "2,000+ Youth Athletes Coached", "Commonwealth Games Delegation Coach 2022", "Sports Ministry Achievement Award"],
    tags: ["Athletics", "Sports", "Youth Development", "Coaching"],
    interviewSeries: [
      { id: "ep-5-1", episode: 1, title: "Part 1: Building Champions from Nothing", videoId: "dQw4w9WgXcQ", duration: "17:50", date: "2026-02-05", description: "Coach Ravi shares stories of transforming raw talent in underprivileged youth into national champions." }
    ],
    biographyPages: [
      { title: "Early Life & Beginnings", icon: "📖", paragraphs: ["Ravi Jayawardena was a national 400m sprinter in the 1990s who represented Sri Lanka at two Commonwealth Games before a knee injury ended his competitive career at 28.", "Rather than stepping away from athletics, he channelled his passion into coaching — initially volunteering at a school in Colombo where he noticed exceptional but untrained talent going to waste.", "His philosophy was simple: every child with heart and dedication deserves world-class coaching, regardless of their family's income."] },
      { title: "Journey & Contribution", icon: "🌟", paragraphs: ["Over 25 years, Coach Jayawardena built one of Sri Lanka's most respected athletics academies — entirely funded through corporate partnerships and his own personal resources.", "His training methodology, blending indigenous physical conditioning techniques with modern biomechanics, produced athletes who consistently outperformed those from better-resourced programmes.", "He fought tirelessly for better facilities and stipends for national athletes, lobbying the Sports Ministry through multiple administrations."] },
      { title: "Key Achievements", icon: "🏆", paragraphs: ["14 of his athletes have won podium medals at Asian Games, with three going on to Commonwealth Games representation.", "His free Saturday morning camps in Colombo's Sugathadasa Stadium have trained over 2,000 youth athletes, many from families below the poverty line.", "He was named National Sports Coach of the Year in 2022 and received the Sports Ministry's Lifetime Achievement Award in 2023."] },
      { title: "Public Tributes & Community Voice", icon: "💬", paragraphs: ["His athletes describe him as a father figure who held them to standards they didn't believe they could meet.", "\"He saw something in me I couldn't see in myself,\" wrote one Asian Games medalist in an open letter published nationally.", "Leave your tribute or message for Coach Ravi Jayawardena in the community comments below."] }
    ]
  },
  {
    name: "M. H. M. Ashraff",
    title: "Visionary Statesman, Founder of SLMC & Minister of Ports & Shipping",
    category: "Politics & Leadership",
    location: "Kalmunai, Ampara District",
    year: "1989",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    videoId: "dQw4w9WgXcQ",
    bio: "Mohammed Hussain Mohamed Ashraff (1948 – 2000), affectionately known as 'Marhoom Ashraff', was one of Sri Lanka's most charismatic political visionaries, senior legal counsels, and acclaimed literary figures. Born in Sammanthurai and rooted in Kalmunai in the Ampara District, he founded the Sri Lanka Muslim Congress (SLMC) and later the National Unity Alliance (NUA), completely reshaping the democratic representation of minority communities in Sri Lanka.\n\nAs Cabinet Minister of Ports, Shipping, Rehabilitation and Reconstruction from 1994 until his untimely demise in 2000, Ashraff spearheaded a golden era of national infrastructure development. He revolutionized the Port of Colombo with the expansion of the Queen Elizabeth Quay into a world-class global transshipment hub and envisioned the strategic Oluvil Port development project in the Eastern Province.\n\nA staunch champion of higher education, Ashraff founded the South Eastern University of Sri Lanka (SEUSL) at Oluvil, bringing university education directly to underserved rural youth in the East. Under his rehabilitation ministry, over 100,000 conflict-displaced families across the Northern and Eastern provinces were resettled with permanent housing and livelihoods.\n\nBeyond politics, Ashraff was a distinguished Senior Attorney-at-Law and a celebrated Tamil poet whose anthology 'Naan Ennum Nee' remains a landmark of contemporary Sri Lankan literature.",
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
    interviewSeries: [
      { id: "ep-9-1", episode: 1, title: "Part 1: The Founding of SLMC & The Democratic Awakening in the East", videoId: "dQw4w9WgXcQ", duration: "28:45", date: "2026-01-10", description: "Archival historical documentary detailing the genesis of SLMC in Kattankudy and Kalmunai, and Ashraff's parliamentary leadership." },
      { id: "ep-9-2", episode: 2, title: "Part 2: The Port of Colombo Revolution & The Oluvil University Vision", videoId: "9bZkp7q19f0", duration: "24:18", date: "2026-02-05", description: "In-depth historical coverage of Minister Ashraff's transformation of the Sri Lanka Ports Authority and building of South Eastern University." },
      { id: "ep-9-3", episode: 3, title: "Part 3: The National Unity Alliance & The Poet Statesman ('Naan Ennum Nee')", videoId: "kJQP7kiw5Fk", duration: "31:10", date: "2026-03-01", description: "Reflections on his literary masterwork 'Naan Ennum Nee' and his vision for an undivided, pluralistic Sri Lanka." }
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

// ── AWARDS ────────────────────────────────────────────────────────────────────
const awardsData = [
  { title: "National Healthcare Pioneer Award 2026", category: "Healthcare", nominee: "Dr. Nilanthi Jayasinghe", description: "For revolutionary contributions to rural healthcare access through tele-medicine clinics in Uva province.", status: "Nominee", year: 2026, presenter: "College of Community Physicians Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80", votes: 0, icon: "🏆" },
  { title: "Community Child Health Award", category: "Healthcare", nominee: "Dr. Rohan Abeyratne", description: "Pioneered mobile diagnostic vans screening 45,000 rural children for congenital cardiac and eye diseases.", status: "Nominee", year: 2026, presenter: "Sri Lanka Paediatric Association", thumbnail: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80", votes: 0, icon: "🩺" },
  { title: "Distinguished Public Health & Epidemiology Laureate", category: "Healthcare", nominee: "Dr. Anula Wijesundera", description: "Spearheaded national dengue containment strategies and mobile diagnostic clinical labs serving over 60,000 plantation workers.", status: "Nominee", year: 2026, presenter: "Sri Lanka Medical Association", thumbnail: "https://images.unsplash.com/photo-1594824813576-90f70a7f14b6?w=400&q=80", votes: 0, icon: "🩺" },
  { title: "Cultural Heritage Preservation Award", category: "Arts & Culture", nominee: "Prof. Shantha Wickramasinghe", description: "Lifetime achievement in digital preservation of 12,000 ancient Sri Lankan palm-leaf ola manuscripts.", status: "Nominee", year: 2026, presenter: "Ministry of Cultural Affairs & Heritage", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", votes: 0, icon: "🎖️" },
  { title: "Traditional Arts Revitalization Prize", category: "Arts & Culture", nominee: "Kalasuri Rohana Baddegama", description: "Preserved Sabaragamuwa folk rituals and founded free training academies for over 3,000 rural youth.", status: "Nominee", year: 2026, presenter: "Arts Council of Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", votes: 0, icon: "🎭" },
  { title: "Indigenous Performing Arts & Dance Master", category: "Arts & Culture", nominee: "Heshma Wignaraja", description: "Global ambassador for Sri Lankan classical Kandyan dance theater, mentoring young dancers across 20 international cultural tours.", status: "Nominee", year: 2026, presenter: "Chitrasena Cultural Foundation & UNESCO Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", votes: 0, icon: "💃" },
  { title: "Green Innovation Pioneer Award", category: "Environment & Technology", nominee: "Eng. Priyantha Dissanayake", description: "Engineered micro-solar power solutions powering 150,000 off-grid agrarian households across the Dry Zone.", status: "Nominee", year: 2026, presenter: "Sri Lanka Sustainable Energy Authority", thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", votes: 0, icon: "⚡" },
  { title: "Marine Ecology Restoration Award", category: "Environment & Technology", nominee: "Chamari Senaratne", description: "Developed biodegradable coral-reef seeding matrices restoring 40 kilometers of southern coastal reef ecosystems.", status: "Nominee", year: 2026, presenter: "National Aquatic Resources Agency (NARA)", thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", votes: 0, icon: "🌊" },
  { title: "Biodiversity & Wildlife Conservation Fellowship", category: "Environment & Technology", nominee: "Dr. Sumith Pilapitiya", description: "Architect of community-based human-elephant conflict mitigation fences protecting 45 agrarian villages across the North Central Province.", status: "Nominee", year: 2026, presenter: "Wildlife and Nature Protection Society (WNPS)", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", votes: 0, icon: "🐘" },
  { title: "Social Impact Champion Award", category: "Social Service", nominee: "Mrs. Kamala Perera", description: "Guaranteed secondary education and university sponsorships for 10,000+ girls in vulnerable communities.", status: "Nominee", year: 2026, presenter: "National Commission for Women", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", votes: 0, icon: "💛" },
  { title: "Elder Care & Dignity Honor", category: "Social Service", nominee: "Ven. Ananda Thero", description: "Established 8 community hospices and elder shelters providing compassionate dignity care without fee.", status: "Nominee", year: 2026, presenter: "National Social Services Council", thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", votes: 0, icon: "🕊️" },
  { title: "Grassroots Community Empowerment Prize", category: "Social Service", nominee: "K. Rathnasingham", description: "Rebuilt 32 village water irrigation reservoirs and community micro-credit banks supporting over 8,000 war-affected families.", status: "Nominee", year: 2026, presenter: "National Council for Voluntary Social Services", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", votes: 0, icon: "🌱" },
  { title: "Sports Excellence & Mentorship Award", category: "Sports", nominee: "Ravi Jayawardena", description: "Coached 14 national athletes to Asian Games podiums and runs free sports camps for underprivileged schools.", status: "Nominee", year: 2026, presenter: "Sri Lanka Sports Ministry & Olympic Committee", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", votes: 0, icon: "🥇" },
  { title: "Para-Athletics Trailblazer Award", category: "Sports", nominee: "Dilani Fernando", description: "Paralympic archery medalist advocating and creating adaptive sports training facilities island-wide.", status: "Nominee", year: 2026, presenter: "National Paralympic Committee", thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", votes: 0, icon: "🎯" },
  { title: "Youth Athletics & Olympic Promise Honor", category: "Sports", nominee: "Tharushi Karunarathne", description: "Asian Games 800m Gold Medalist inspiring a generation of schoolgirl athletes from rural schools to compete on world athletic stages.", status: "Nominee", year: 2026, presenter: "Athletics Association of Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80", votes: 0, icon: "🏃‍♀️" },
  { title: "Humanitarian Service Leadership Award", category: "Humanitarian Service", nominee: "Maj. Gen. (Ret.) Arjuna Silva", description: "Led humanitarian mine-clearing of 15,000 hectares, enabling 80,000 displaced citizens to rebuild their lives in peace.", status: "Nominee", year: 2026, presenter: "United Nations Human Rights Council & Sri Lanka Office", thumbnail: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80", votes: 0, icon: "🌟" },
  { title: "Disaster Relief Vanguard Honor", category: "Humanitarian Service", nominee: "Sister Mary Bernadette", description: "Coordinated emergency flood and landslide rescue feeding stations serving 200,000 meals during monsoon emergencies.", status: "Nominee", year: 2026, presenter: "Sri Lanka Red Cross Society", thumbnail: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80", votes: 0, icon: "🤝" },
  { title: "Crisis Response & Resettlement Fellowship", category: "Humanitarian Service", nominee: "Dr. Kasun Pathirana", description: "Directed volunteer doctors network providing 24/7 trauma and emergency surgeries across drought and flood disaster corridors.", status: "Nominee", year: 2026, presenter: "Disaster Management Center & WHO Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", votes: 0, icon: "🕊️" },
  { title: "National Education Vanguard & STEM Leadership Award", category: "Education", nominee: "Prof. Malik Ranasinghe", description: "Transformed digital engineering education and university research incubation, graduating 15,000 modern IT and engineering innovators.", status: "Nominee", year: 2026, presenter: "National Science Foundation Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", votes: 0, icon: "🎓" },
  { title: "Rural Schools Literacy & Digital Access Prize", category: "Education", nominee: "Sandamali Jayakody", description: "Equipped 120 remote rural schools with off-grid solar computer labs and digital Sinhala/Tamil multimedia libraries.", status: "Nominee", year: 2026, presenter: "Ministry of Education & NIE Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", votes: 0, icon: "📚" },
  { title: "Inclusive Special Needs Education Laureate", category: "Education", nominee: "K. Sivalingam", description: "Pioneered trilingual braille and sign-language learning frameworks integrated into over 200 mainstream secondary schools.", status: "Nominee", year: 2026, presenter: "Sri Lanka Special Education Teachers Guild", thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", votes: 0, icon: "📖" }
];

// ── TEST USERS ────────────────────────────────────────────────────────────────
const adminUser = {
  name: 'PeopleFirst Admin',
  email: 'admin@peoplefirst.lk',
  password: 'admin@2026',
  whatsapp: '+94771234567',
  district: 'Colombo',
  address: 'PeopleFirst HQ, Colombo 03',
  role: 'admin',
  emailVerified: true,
  bio: 'Platform Administrator – PeopleFirst Media',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
};

const demoUser = {
  name: 'Kasun Perera',
  email: 'user@peoplefirst.lk',
  password: 'user@2026',
  whatsapp: '+94719876543',
  district: 'Kandy',
  address: 'No. 45, Peradeniya Road, Kandy',
  role: 'reader',
  emailVerified: true,
  bio: 'Community member passionate about civic development and education in Sri Lanka.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
};

// ══════════════════════════════════════════════════════════════════════════════
//  SEEDER LOGIC
// ══════════════════════════════════════════════════════════════════════════════

const isFresh   = process.argv.includes('--fresh');
const isDestroy = process.argv.includes('--destroy');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/peoplefirst');
    console.log('\n✅ MongoDB Connected\n');

    if (isDestroy || isFresh) {
      console.log('🗑️  Dropping existing collections...');
      await Promise.all([
        News.deleteMany({}),
        Achiever.deleteMany({}),
        Award.deleteMany({}),
        VotingConfig.deleteMany({}),
        User.deleteMany({ role: 'admin' }),
      ]);
      console.log('✅ Collections cleared\n');
    }

    if (isDestroy) {
      console.log('💥 Destroy mode complete. Database wiped.');
      process.exit(0);
    }

    // ── Seed News ──────────────────────────────────────────────────────────
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      await News.insertMany(newsData);
      console.log(`📰 Seeded ${newsData.length} news articles`);
    } else {
      console.log(`📰 News: ${newsCount} articles already exist — skipped`);
    }

    // ── Seed Achievers ─────────────────────────────────────────────────────
    const achieverCount = await Achiever.countDocuments();
    if (achieverCount === 0) {
      await Achiever.insertMany(achieversData);
      console.log(`🏅 Seeded ${achieversData.length} achievers`);
    } else {
      console.log(`🏅 Achievers: ${achieverCount} already exist — skipped`);
    }

    // ── Seed Awards ────────────────────────────────────────────────────────
    const awardCount = await Award.countDocuments();
    if (awardCount === 0) {
      await Award.insertMany(awardsData);
      console.log(`🏆 Seeded ${awardsData.length} awards`);
    } else {
      console.log(`🏆 Awards: ${awardCount} already exist — skipped`);
    }

    // ── Seed Voting Config ─────────────────────────────────────────────────
    const configCount = await VotingConfig.countDocuments();
    if (configCount === 0) {
      await VotingConfig.create({
        isActive: true,
        seasonTitle: 'National Honors Community Voting 2026',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        categories: ["Healthcare", "Arts & Culture", "Environment & Technology", "Social Service", "Sports", "Humanitarian Service", "Education"],
      });
      console.log('⚙️  Seeded voting configuration');
    } else {
      console.log('⚙️  Voting config already exists — skipped');
    }

    // ── Seed Admin & Demo Users ─────────────────────────────────────────────
    await User.deleteMany({ email: { $in: [adminUser.email.toLowerCase(), demoUser.email.toLowerCase()] } });

    const createdAdmin = await User.create({
      ...adminUser,
      emailVerified: true,
      status: 'active',
    });
    console.log(`👤 Admin user created → ${createdAdmin.email} / ${adminUser.password}`);

    const createdDemo = await User.create({
      ...demoUser,
      emailVerified: true,
      status: 'active',
    });
    console.log(`👤 Demo user created → ${createdDemo.email} / ${demoUser.password}`);

    console.log('\n🎉 Database seeding complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin Login:');
    console.log(`    Email    : ${adminUser.email}`);
    console.log(`    Password : ${adminUser.password}`);
    console.log('  Member Login:');
    console.log(`    Email    : ${demoUser.email}`);
    console.log(`    Password : ${demoUser.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
