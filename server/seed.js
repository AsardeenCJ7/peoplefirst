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
    name: "உமர்லெவ்வை போடியார் (உமறுப்போடியார்)",
    title: "எமது மண்ணின் சமூகமும் மார்க்கமும் வடிவமைத்த தலைவர் | நமது முதுசங்கங்கள் – 01",
    category: "சமூகமும் மார்க்கமும்",
    location: "ஓட்டமாவடி, கல்குடா",
    year: "1901 – 1976",
    verified: true,
    featured: true,
    thumbnail: "/image/achiever1.jpeg",
    videoId: "iTvo6_eh48k",
    bio: "எமது மண்ணின் சமூக வரலாற்றை நாம் திரும்பிப் பார்க்கும்போது, சில மனிதர்கள் காலத்தைத் தாண்டியும் மக்களின் நினைவுகளில் நிலைத்து நிற்பதை காணலாம். அவர்கள் தங்களின் செல்வத்தால் உயர்ந்தவர்கள் அல்ல… சமூகத்திற்கு செய்த சேவையாலும், நேர்மையாலும், ஒழுக்கத்தாலும், மனிதநேயத்தாலும் மக்களின் மரியாதையைப் பெற்றவர்கள்.\n\nஅத்தகைய ஆளுமைகளில் ஒருவர்தான் உமர்லெவ்வை போடியார், பொதுவாக “உமறுப்போடியார்” என அழைக்கப்பட்டவர். 1901 ஆம் ஆண்டு பிறந்த அவர், 1976 ஆம் ஆண்டு ஜூன் மாதம் 30 ஆம் தேதி தனது 75வது வயதில் மறைந்தார்.\n\nதனது வாழ்நாளில் விவசாயம், மார்க்க சேவை, சமூக நீதி, கல்வி வளர்ச்சி என பல துறைகளில் அவர் அழியாத பங்களிப்புகளைச் செய்தார். People First Media Channel-இன் “நமது முதுசங்கங்கள்” ஆவணப்படுத்தல் பயணத்தின் முதல் வரலாற்றுப் பதிவாக உமறுப்போடியார் அவர்களின் வாழ்க்கை சமர்ப்பிக்கப்படுகிறது.",
    achievements: [
      "ஓட்டமாவடி முஹைதீன் ஜும்ஆ பள்ளிவாயல் மரைக்கார் சபைத் தலைவராக 30+ ஆண்டுகள் முன்மாதிரி சேவை",
      "ஓட்டமாவடியில் புகழ்பெற்ற வரலாற்று புஹாரி மஜ்லிஸை (74 வருட பாரம்பரியம்) ஆரம்பித்து வைத்த முன்னோடி",
      "வாழைச்சேனை பிரதேசத்தில் முதல் ஜும்ஆ தொழுகை ஆரம்பிக்கப்பட வரலாற்று ஆதரவும் அனுமதியும் வழங்கியமை",
      "பெருவெட்டை பகுதியில் 150+ ஏக்கர் காட்டு நிலங்களை மனித உழைப்பால் நெல் வயல்களாக மாற்றிய விவசாயப் புரட்சி",
      "பள்ளிவாயல் பயன்பாட்டிற்காக 05 ஏக்கர் பரந்த நிலத்தை தானமாக வழங்கிய குடும்ப மரபு",
      "காவத்தமுனை ஜும்ஆ பள்ளிவாயல் நிர்மாணத்திற்கு முழுமையான ஆதரவும் மரப் பொருட்களும் வழங்கியமை",
      "கிராம சபை தலைமைத்துவ மாற்றத்திற்கும் (1965) சமூக நீதிக்கும் வித்திட்ட சமூக நீதிமான்"
    ],
    tags: ["நமது முதுசங்கங்கள்", "உமறுப்போடியார்", "ஓட்டமாவடி", "வாழைச்சேனை", "கல்குடா", "புஹாரி மஜ்லிஸ்", "விவசாயம்", "பள்ளிவாயல்"],
    interviewSeries: [
      {
        id: "ep-1-1",
        episode: 1,
        title: "நமது முதுசங்கங்கள் – 01: உமர்லெவ்வை போடியார் (உமறுப்போடியார்) முழுமையான ஆவணப்படம்",
        videoId: "iTvo6_eh48k",
        duration: "25:00",
        date: "2026-10-02",
        description: "People First Media Channel வழங்கும் 'நமது முதுசங்கங்கள்' முதல் பாகம்: கல்குடா மண்ணின் சமூகமும் மார்க்கமும் வடிவமைத்த உமறுப்போடியார் அவர்களின் வாழ்க்கை ஆவணப்படம்."
      }
    ],
    biographyPages: [
      {
        title: "அறிமுகமும் வாழ்வும்",
        icon: "📖",
        paragraphs: [
          "எமது மண்ணின் சமூக வரலாற்றை நாம் திரும்பிப் பார்க்கும்போது, சில மனிதர்கள் காலத்தைத் தாண்டியும் மக்களின் நினைவுகளில் நிலைத்து நிற்பதை காணலாம். அவர்கள் தங்களின் செல்வத்தால் உயர்ந்தவர்கள் அல்ல… சமூகத்திற்கு செய்த சேவையாலும், நேர்மையாலும், ஒழுக்கத்தாலும், மனிதநேயத்தாலும் மக்களின் மரியாதையைப் பெற்றவர்கள்.",
          "அத்தகைய ஆளுமைகளில் ஒருவர்தான் உமர்லெவ்வை போடியார், பொதுவாக “உமறுப்போடியார்” என அழைக்கப்பட்டவர். 1901 ஆம் ஆண்டு பிறந்த அவர், 1976 ஆம் ஆண்டு ஜூன் மாதம் 30 ஆம் தேதி தனது 75வது வயதில் மறைந்தார்.",
          "தனது வாழ்நாளில் விவசாயம், மார்க்க சேவை, சமூக நீதி, கல்வி வளர்ச்சி என பல துறைகளில் அவர் அழியாத பங்களிப்புகளைச் செய்தார்."
        ]
      },
      {
        title: "குடும்பப் பின்னணி",
        icon: "🏛️",
        paragraphs: [
          "உமறுப்போடியார் அவர்கள் காத்தான்குடி பகுதியைச் சேர்ந்த சின்னத் தொப்பியர் ஆதம்பாவா அவர்களின் வம்சாவளியைச் சேர்ந்தவர். அவரது தந்தையின் பெயர் முஹம்மது தம்பி. அவரது வாப்பாவின் வாப்பா, அதாவது மூத்தப்பாவின் பெயரும் உமறு போடியார் ஆகும்.",
          "அவரது மூத்தப்பாவிற்கு மொத்தம் 12 சகோதரர்கள் (10 ஆண்களும், 02 பெண்களும்) இருந்தனர். மார்க்கப் பணியிலும், சமூக சேவையிலும் முன்னிலையில் இருந்த இந்த மரபுக் குடும்பத்தின் பரம்பரையினர் கல்குடா மட்டுமன்றி பொலன்னறுவை மாவட்டத்தின் கல்லல்ல, மாணிக்கம்பிட்டி, முஸ்லிம் கொலனி, தம்பாளை போன்ற பகுதிகளிலும் பரந்து வாழ்கின்றனர்.",
          "உமறுப்போடியார் அவர்கள் வாழைச்சேனை பகுதியைச் சேர்ந்த மீரா நாச்சி அவர்களைத் திருமணம் செய்து கொண்டார். இவர்களுக்கு 09 பிள்ளைகள் (07 பெண்களும், 02 ஆண்களும்) ஆவர். சமூகத்தில் பெருமதிப்புடன் அறியப்பட்ட குடும்பமாக இவர்கள் திகழ்ந்தனர்."
        ]
      },
      {
        title: "முன்னோடி விவசாயமும் நிலதானமும்",
        icon: "🌾",
        paragraphs: [
          "உமறுப்போடியார் அவர்களின் முக்கியத் தொழில் விவசாயம். நிலத்தை வளமாக மாற்றிய ஒரு முன்னோடி விவசாய மரபைக் கொண்ட குடும்பமாக இது விளங்கியது. இவரது மூத்தப்பா உமறுப்போடியார் அவர்கள் பெருவெட்டை பகுதியில் சுமார் 150 ஏக்கருக்கும் மேற்பட்ட காட்டு நிலங்களை இயந்திர வசதிகள் இல்லாத காலத்தில் மனித உழைப்பு, விடாமுயற்சி, உறுதியால் திருத்தி நெல் வயல்களாக மாற்றியவர்.",
          "பின்னர், இவரது பேரன் உமறு மரைக்காயர் அவர்கள் மரபு ரீதியாக விவசாயத் தொழிலை முன்னெடுத்தார். அன்றைய காலத்தில் இவ்வளவு பெரிய நிலப்பரப்பை அபிவிருத்தி செய்தது, இக்குடும்பத்தின் கடின உழைப்பையும் முன்னோக்குப் பார்வையையும் வெளிப்படுத்துகிறது.",
          "மேலும், ஓட்டமாவடி பகுதியில் இவர்களுக்கு பரந்தளவில் வளவுகள் இருந்தன. அவற்றில் இருந்து 05 ஏக்கர் நிலம் பள்ளிவாயல் பயன்பாட்டிற்காக இவரது முன்னோரால் (மூத்த வாப்பா) தானமாக வழங்கப்பட்டது."
        ]
      },
      {
        title: "பள்ளிவாயல் தலைமைத்துவமும் நேர்மையும்",
        icon: "🕌",
        paragraphs: [
          "உமறுப்போடியார் அவர்கள் ஓட்டமாவடி முஹைதீன் ஜும்ஆ பள்ளிவாயல் மரைக்கார் சபையின் தலைவராக 30 ஆண்டுகளுக்கும் மேலாக பணியாற்றினார். அவரது தலைமையில் பள்ளிவாயல் சமூக நிர்வாகத்தின் முக்கிய மையமாகச் செயல்பட்டது. நோன்பு கால ஒழுங்குமுறைகள் மற்றும் சந்தை மீன் விலைக் கட்டுப்பாடு வரை சமூக ஒழுங்கு காக்கப்பட்டது.",
          "பள்ளிவாயலின் பணத்தை தனது வீட்டில் வைக்காமல், MK. அஹமது முஹைதீன் ஹாஜியார் அவர்களின் கடையில் பிரத்தியேக இரும்பு அலுமாரியில் பாதுகாத்து வந்தார். பள்ளிவாயலிலிருந்து வெளியே வரும்போது மிதியடியில் ஒட்டியிருந்த மண்ணைத் தட்டிவிட்டு, 'இந்த பள்ளிவாயல் மண் கூட என்னுடன் சேரக்கூடாது' என்ற அதீத பேணுதலுடன் நடந்தார்.",
          "மரைக்கார் சபைத் தலைவர் பதவியிலிருந்து விலகும் போது கணக்குகளை முழுமையாக ஒப்படைத்தார். கணக்காய்வு அதிகாரி நேர்மையைப் பாராட்டி தொடருமாறு கோரியும், பதவி என்பது தனக்கான அதிகாரம் அல்ல, அது ஒரு பொறுப்பு என்பதை நிரூபித்து பதவியை விட்டு விலகினார்."
        ]
      },
      {
        title: "மார்க்கக் கல்வி, புஹாரி மஜ்லிஸ் & காவத்தமுனை",
        icon: "📚",
        paragraphs: [
          "அந்தக் காலங்களில் புஹாரி மஜ்லிஸில் கலந்து கொள்ள மக்கள் காத்தான்குடிக்குச் செல்ல வேண்டிய சிரமத்தைப் போக்க, 'மையத்துப்புட்டி ஆலிம்' என அழைக்கப்பட்ட ஆதம்பாவா அவர்களை அழைத்து ஓட்டமாவடியிலேயே புஹாரி மஜ்லிஸை ஆரம்பிக்க உமறுப்போடியார் ஏற்பாடு செய்தார். இன்று 74வது வருடத்தை எட்டியுள்ள அந்த மார்க்க மரபு இன்றும் தொடர்கிறது.",
          "மாணவர்கள் குர்ஆன் ஓதுவதற்காக தனது சொந்த வளவில் ஒரு கொட்டிலையும் அமைத்துக் கொடுத்தார்.",
          "1949 காலப்பகுதியில் காவத்தமுனையில் பள்ளிவாயல் அமைக்க மரங்களும் பொருள் உதவிகளும் வழங்கினார். பின்னர் அது காவத்தமுனை ஜும்ஆ பள்ளிவாயலாக உயர்ந்த போது, உமறுப்போடியார் அவர்களின் இரண்டாவது மகன் மௌலவி யூ. அஹமது லெவ்வை (பஹ்ஜி) அவர்களே முதல் குத்பாவை நிகழ்த்தினார்."
        ]
      },
      {
        title: "வாழைச்சேனை ஜும்ஆ & உலமாக்களுடனான உறவு",
        icon: "🤝",
        paragraphs: [
          "அக்காலத்தில் ஓட்டமாவடி பெரிய ஜும்ஆ பள்ளிவாயலில் மட்டுமே ஜும்ஆ நடைபெற்றது. வாழைச்சேனை மக்கள் அங்கு வந்து தொழும் சிரமத்தை உணர்ந்து, அவர்கள் விடுத்த கோரிக்கையை ஏற்று வாழைச்சேனையில் ஜும்ஆ ஆரம்பிக்க உமறுப்போடியார் உறுதியான ஆதரவை வழங்கி வழிவகுத்தார். இது கல்குடா வரலாற்றில் பொன்னெழுத்துக்களால் பொறிக்கப்பட வேண்டிய ஒன்றாகும்.",
          "மார்க்க அறிஞர் ஒகுது லெவ்வை அவர்களுடனும், கிண்ணியாவிலிருந்து வந்த மார்க்க அறிஞரும் அரபு எழுத்தணிக் கலைஞருமான அப்துஸ்ஸமது ஆலிம் அவர்களுடனும் இணைந்து பணியாற்றினார். ஆலிம் அவர்களை ஓட்டமாவடியில் குடியமர்த்தி குர்ஆன் மத்ரஸா உருவாக்க துணை நின்றார். உமறுப்போடியாரின் பிள்ளைகளும் அவரிடமே கல்வி பயின்றனர்."
        ]
      },
      {
        title: "சமூக நீதி, மனிதநேயம் & சமூக நிர்வாகம்",
        icon: "⚖️",
        paragraphs: [
          "உமறுப்போடியார் சமூகத்தில் நடுநிலை நீதிமானாகவும் சமரசகராகவும் விளங்கினார். குடும்பப் பிரச்சனைகள், நில மற்றும் கடன் தகராறுகளை சுமுகமாகத் தீர்த்து வைத்தார். ஏழைகள், நோயாளிகள் மற்றும் திருமண உதவிகளுக்கு அவரது இல்லக் கதவுகள் எப்போதும் திறந்திருந்தன.",
          "1965 ஆம் ஆண்டு கிராம சபைக்கு புதிய, செயல்பாடு மிக்க தலைவர் தேவை என்பதை உணர்ந்து, ஏ. இஸ்மா லெவ்வை (இஸ்மான் குட்டி சேர்மன்) அவர்களை முன்மொழிந்து வெற்றி பெறச் செய்து சிறந்த மக்கள் நிர்வாகத்திற்கு வித்திட்டார்.",
          "ஒரு மனிதன் தனது செல்வத்தால் அல்ல, சமூகத்திற்கு செய்த பங்களிப்பால் உயர்கிறான். உமர்லெவ்வை போடியார் அவர்கள் ஒரு குடும்பத் தலைவர் மட்டுமல்ல — சமூகத் தூண், மார்க்க ஒளிக்கோல், நேர்மையான தலைமைத்துவத்தின் வரலாற்றுச் சின்னம்."
        ]
      },
      {
        title: "People First Media – நமது முதுசங்கங்கள்",
        icon: "🎥",
        paragraphs: [
          "மக்களுக்காக ஊடகம் – உண்மைக்காக சேவை என்ற தாரக மந்திரத்துடன் செயல்படும் People First Media Channel, நமது மண்ணின் முன்னோடிகளின் வரலாற்றுச் சுவடுகளை ஆவணப்படுத்தும் உன்னத முயற்சியாக 'நமது முதுசங்கங்கள்' தொடரை முன்னெடுக்கிறது.",
          "தலைவர்: I. M. Jamaldeen | பிரதம நிறைவேற்று அதிகாரி (CEO): Abdul Ahad Ahmed Afri",
          "நமது முதுசங்கங்கள் – 01: உமர்லெவ்வை போடியார் (உமறுப்போடியார்) – அடுத்த முதுசம் தொடரும்…"
        ]
      }
    ]
  },
  {
    name: "Dr. C. W. W. Kannangara",
    title: "Father of Free Education in Sri Lanka & First Minister of Education",
    category: "Education & Heritage",
    location: "Randomgoda, Galle District",
    year: "1945",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    videoId: "9bZkp7q19f0",
    bio: "Dr. Christopher William Wijekoon Kannangara (1884 – 1969) is universally revered as the 'Father of Free Education' in Sri Lanka. As the Minister of Education in the State Council of Ceylon from 1931 to 1947, he authored and enacted the historic Free Education Bill of 1945, guaranteeing free education from kindergarten through university for every child regardless of wealth or social standing.\n\nHe established 54 Central Schools (Madhya Maha Vidyalayas) across rural Sri Lanka, providing underprivileged rural students with access to elite science, arts, and humanities education. His visionary reforms unlocked social mobility for millions of Sri Lankans, creating one of the highest literacy rates in Asia.",
    achievements: [
      "Father of Free Education in Sri Lanka",
      "Enacted the Historic Free Education Bill of 1945",
      "Founded 54 Central Schools (Madhya Maha Vidyalayas) Island-wide",
      "First Minister of Education in the State Council of Ceylon (1931–1947)",
      "Elevated Sri Lanka to Have Asia's Highest Public Literacy Rate (over 92%)"
    ],
    tags: ["Free Education", "Madhya Maha Vidyalaya", "Kannangara", "Galle", "Education Reform"],
    interviewSeries: [
      { id: "ep-2-1", episode: 1, title: "Part 1: The Great Free Education Bill of 1945", videoId: "9bZkp7q19f0", duration: "25:30", date: "2026-01-12", description: "Documentary on Dr. C.W.W. Kannangara's fierce parliamentary battle to make education free for every Sri Lankan child." }
    ],
    biographyPages: [
      {
        title: "Early Life & Academic Brilliance",
        icon: "📖",
        paragraphs: [
          "C. W. W. Kannangara was born on October 18, 1884, in Randomgoda, Galle. Having lost his father at an early age, young Kannangara overcame immense poverty through sheer academic excellence.",
          "He won a scholarship to Richmond College, Galle, where he excelled as a scholar and captain of the cricket team. He subsequently studied law and became a leading Proctor in Galle."
        ]
      },
      {
        title: "The Battle for Free Education",
        icon: "🎓",
        paragraphs: [
          "Elected to the State Council in 1931, Kannangara served as Minister of Education for 16 pivotal years. He witnessed how colonial education favoured urban elites while rural children were left in poverty.",
          "In 1945, despite fierce opposition from vested interest groups, Kannangara successfully passed the landmark Free Education Ordinance, declaring that education from kindergarten to university level should be provided completely free by the state."
        ]
      },
      {
        title: "Central Schools & Legacy",
        icon: "🏛️",
        paragraphs: [
          "To ensure rural students received world-class instruction, Kannangara established 54 Central Schools (Madhya Maha Vidyalayas) equipped with laboratories, libraries, and dormitories.",
          "His legacy remains the foundation of Sri Lanka's human capital development. Today, millions of Sri Lankan doctors, engineers, scholars, and leaders owe their education to the vision of Dr. C. W. W. Kannangara."
        ]
      }
    ]
  },
  {
    name: "Muttiah Muralitharan",
    title: "Legendary Cricketer & World Record Holder (800 Test Wickets)",
    category: "Sports",
    location: "Kandy District",
    year: "1996",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80",
    videoId: "kJQP7kiw5Fk",
    bio: "Deshabandu Muttiah Muralitharan is widely regarded as the greatest spin bowler in the history of international cricket. Born in Kandy, he captured an unprecedented 800 Test wickets and 534 One Day International (ODI) wickets, establishing a world record that remains unbroken.\n\nA key member of Sri Lanka's historic 1996 ICC Cricket World Cup winning team, Muralitharan played 133 Tests and 350 ODIs with unmatched wizardry. Beyond cricket, he co-founded the 'Foundation of Goodness', a humanitarian trust that has built schools, medical centers, sports complexes, and housing for over 35,000 tsunami and war-affected rural Sri Lankans.",
    achievements: [
      "World Record Holder: Most Wickets in Test Cricket (800 Wickets)",
      "World Record Holder: Most Wickets in ODI Cricket (534 Wickets)",
      "1996 ICC Cricket World Cup Champion",
      "Inducted into ICC Cricket Hall of Fame",
      "Founder of the 'Foundation of Goodness' Humanitarian Charity (35,000+ Beneficiaries)"
    ],
    tags: ["Cricket", "800 Wickets", "Kandy", "World Cup 1996", "Foundation of Goodness", "Sports Legend"],
    interviewSeries: [
      { id: "ep-3-1", episode: 1, title: "Part 1: The Road to 800 Wickets & 1996 World Cup Glory", videoId: "kJQP7kiw5Fk", duration: "26:40", date: "2026-01-20", description: "Muralitharan reflects on his extraordinary spin bowling journey, the 1996 victory, and overcoming adversity." }
    ],
    biographyPages: [
      {
        title: "Early Life in Kandy & St. Anthony's",
        icon: "🏏",
        paragraphs: [
          "Muttiah Muralitharan was born on April 17, 1972, in Kandy. He attended St. Anthony's College, Katugastota, where he started as a medium-pace bowler before his coach advised him to switch to off-spin.",
          "His natural wrist wrist-spin action and sharp turn quickly dominated school cricket, earning him a call-up to the Sri Lanka national team in 1992 at the age of 20."
        ]
      },
      {
        title: "The 800 Test Wickets & World Cup Victory",
        icon: "🏆",
        paragraphs: [
          "Over two decades, Muralitharan revolutionized spin bowling. In 1996, he helped Sri Lanka lift the ICC Cricket World Cup in Lahore, bowling with economic precision.",
          "In July 2010, at the Galle International Stadium, he took his 800th Test wicket with his final ball in Test cricket, leading Sri Lanka to victory against India."
        ]
      },
      {
        title: "Humanitarian Impact: Foundation of Goodness",
        icon: "🤝",
        paragraphs: [
          "In 1999, Muralitharan partnered with Kushil Gunasekera to establish the Foundation of Goodness in Seenigama. Following the 2004 Tsunami, the foundation rebuilt the entire village with housing, schools, computer centers, and a sports academy.",
          "Today, the Foundation of Goodness provides free education, vocational training, and sports coaching to thousands of rural youth across Sri Lanka."
        ]
      }
    ]
  },
  {
    name: "Dr. Ray Wijewardene",
    title: "Iconic Engineer, Inventor of the Two-Wheel Hand Tractor & Renewable Energy Pioneer",
    category: "Engineering & Technology",
    location: "Colombo District",
    year: "1955",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    videoId: "fRh_vgS2dFE",
    bio: "Dr. Philip Revatha \"Ray\" Wijewardene (1924 – 2010) was a world-renowned Sri Lankan engineer, aviator, agricultural innovator, and Olympic athlete. He gained international fame by inventing the 'Landmaster' two-wheel hand tractor in 1955, which revolutionized small-scale farming across Asia and Africa.\n\nA graduate of Cambridge University and Harvard Business School, Dr. Ray served as Chancellor of the University of Moratuwa and Chairman of the Tea Research Institute. He pioneered dendro-thermal power generation in Sri Lanka using fast-growing Gliricidia trees and represented Sri Lanka in sailing at the 1968 Mexico Olympics.",
    achievements: [
      "Inventor of the Landmaster Two-Wheel Hand Tractor (1955)",
      "Chancellor of the University of Moratuwa",
      "Pioneer of Dendro-Thermal Biomass Energy in Sri Lanka",
      "Represented Sri Lanka in Sailing at the 1968 Mexico Olympics",
      "FAO International Agricultural Engineering Consultant"
    ],
    tags: ["Engineering", "Landmaster", "Moratuwa", "Renewable Energy", "Aviation", "Agriculture"],
    interviewSeries: [
      { id: "ep-4-1", episode: 1, title: "Part 1: The Landmaster Invention & Dendro Energy Vision", videoId: "fRh_vgS2dFE", duration: "23:15", date: "2026-01-25", description: "Exploring Dr. Ray Wijewardene's ground-breaking mechanical inventions and sustainable energy research." }
    ],
    biographyPages: [
      {
        title: "Cambridge Scholar & The Landmaster Innovation",
        icon: "⚙️",
        paragraphs: [
          "Ray Wijewardene was born in Colombo in 1924. He studied engineering and agriculture at Peterhouse, Cambridge University, followed by business studies at Harvard.",
          "In 1955, recognizing that smallholder Asian farmers could not afford heavy 4-wheel tractors, he designed and patented the 'Landmaster' two-wheel tractor in Nottingham, selling over 300,000 units worldwide."
        ]
      },
      {
        title: "Dendro Power & Aviation Leadership",
        icon: "✈️",
        paragraphs: [
          "Dr. Ray was an avid aviator who designed, built, and flew his own light aircraft and autogyros in Sri Lanka.",
          "He championed Dendro-thermal power — generating electricity from biomass wood gasification using Gliricidia sepium — as a zero-carbon energy solution for Sri Lanka."
        ]
      }
    ]
  },
  {
    name: "Dr. Lester James Peries",
    title: "Father of Sri Lankan Cinema & UNESCO Fellini Gold Medalist",
    category: "Arts & Culture",
    location: "Dehiwala, Colombo District",
    year: "1956",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    videoId: "L_jWHffIx5E",
    bio: "Dr. Lester James Peries (1919 – 2018) was the undisputed pioneer of authentic Sri Lankan cinema. His debut feature film 'Rekava' (Line of Destiny, 1956) revolutionized Sinhala filmmaking by breaking away from artificial studio sets and filming entirely on location in Sri Lankan villages.\n\nHis cinematic masterpiece 'Gamperaliya' (The Village Upheaval, 1963) won the Golden Peacock for Best Feature Film at the International Film Festival of India. In 2003, Peries was awarded the UNESCO Fellini Gold Medal for lifetime outstanding contribution to global cinema.",
    achievements: [
      "Father of Sri Lankan Cinema",
      "Directed Landmark Masterpieces: Rekava (1956), Gamperaliya (1963), Nidhanaya (1972)",
      "Winner of the Golden Peacock Award (IFFI 1965)",
      "UNESCO Fellini Gold Medal Laureate (2003)",
      "Sri Lankabhimanya Highest National Honor Awardee"
    ],
    tags: ["Cinema", "Gamperaliya", "Rekava", "Arts", "Culture", "UNESCO"],
    interviewSeries: [
      { id: "ep-5-1", episode: 1, title: "Part 1: Rekava & The Birth of Realistic Sinhala Cinema", videoId: "L_jWHffIx5E", duration: "27:10", date: "2026-02-02", description: "Retrospective on how Lester James Peries created authentic real-location Sri Lankan cinema." }
    ],
    biographyPages: [
      {
        title: "London Years & The Return to Ceylon",
        icon: "🎬",
        paragraphs: [
          "Lester James Peries was born on April 5, 1919, in Dehiwala. He worked as a journalist in London in the late 1940s before returning to Ceylon to join the Government Film Unit (GFU).",
          "In 1956, he left the GFU to direct 'Rekava', taking cameras into real village houses and rice fields for the first time in South Asian cinematic history."
        ]
      }
    ]
  },
  {
    name: "Deshamanya Dr. Christopher Weeramantry",
    title: "Vice-President of the International Court of Justice (ICJ) & Global Jurist",
    category: "Politics & Leadership",
    location: "Colombo District",
    year: "1991",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    videoId: "QH2-TGUlwu4",
    bio: "Deshamanya Dr. Christopher Gregory Weeramantry (1926 – 2017) was a world-renowned Sri Lankan jurist who served as Judge and Vice-President of the International Court of Justice (ICJ) in The Hague from 1991 to 2000.\n\nA former Justice of the Supreme Court of Sri Lanka and Professor of Law at Monash University, Dr. Weeramantry authored pioneering treatises on international law, human rights, and environmental protection. He received the UNESCO Prize for Peace Education in 2006 and the Right Livelihood Award (the 'Alternative Nobel Prize') for his lifetime dedication to global peace and nuclear disarmament.",
    achievements: [
      "Vice-President of the International Court of Justice (ICJ) at The Hague (1997–2000)",
      "UNESCO Prize for Peace Education Laureate (2006)",
      "Right Livelihood Award Winner ('Alternative Nobel Prize', 2007)",
      "Justice of the Supreme Court of Sri Lanka",
      "Sri Lankabhimanya Highest National Honor Awardee"
    ],
    tags: ["ICJ", "International Law", "Peace", "Human Rights", "The Hague", "Jurist"],
    interviewSeries: [
      { id: "ep-6-1", episode: 1, title: "Part 1: International Law, Nuclear Disarmament & World Peace", videoId: "QH2-TGUlwu4", duration: "29:00", date: "2026-02-10", description: "Dr. Weeramantry shares legal insights from his tenure at the International Court of Justice." }
    ],
    biographyPages: [
      {
        title: "From Colombo Courts to The Hague",
        icon: "⚖️",
        paragraphs: [
          "Christopher Weeramantry was born in Colombo in 1926. He graduated from Royal College Colombo and the University of Ceylon, called to the Bar in 1948.",
          "Elected to the ICJ in 1991, his landmark judicial opinions integrated traditional Asian, African, and indigenous jurisprudence into international environmental and human rights law."
        ]
      }
    ]
  },
  {
    name: "Otara Gunewardene",
    title: "Entrepreneur, Founder of ODEL & Embark Animal Welfare Champion",
    category: "Social Impact",
    location: "Colombo District",
    year: "1990",
    verified: true,
    featured: true,
    thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    videoId: "uelHwf8o7_U",
    bio: "Otara Del Gunewardene is a celebrated Sri Lankan entrepreneur, fashion icon, and animal welfare advocate. In 1990, she founded ODEL, transforming a single boot-of-a-car clothing business into Sri Lanka's most iconic retail department store brand and the first fashion retailer to list on the Colombo Stock Exchange.\n\nIn 2007, Otara launched 'Embark', a pioneering social enterprise dedicated to rescuing, treating, vaccinating, and rehoming street dogs across Sri Lanka. Through Embark, she has facilitated the adoption of over 4,500 rescue dogs and vaccinated over 30,000 animals, while tirelessly advocating for environmental conservation and wildlife protection.",
    achievements: [
      "Founder of ODEL — Sri Lanka's Premier Retail Department Store Chain",
      "Founder of Embark — 4,500+ Rescue Dog Adoptions & 30,000+ Vaccinations",
      "First Female Entrepreneur to List a Fashion Retail Enterprise on the CSE",
      "World Animal Day Country Ambassador for Sri Lanka",
      "Stevie International Business Woman of the Year Awardee"
    ],
    tags: ["ODEL", "Embark", "Animal Welfare", "Women Entrepreneurs", "Social Enterprise", "Colombo"],
    interviewSeries: [
      { id: "ep-7-1", episode: 1, title: "Part 1: Building ODEL & The Mission of Embark", videoId: "uelHwf8o7_U", duration: "21:45", date: "2026-02-14", description: "Otara Gunewardene talks about her journey from fashion entrepreneurship to nationwide animal rescue leadership." }
    ],
    biographyPages: [
      {
        title: "The ODEL Journey",
        icon: "🛍️",
        paragraphs: [
          "Otara Gunewardene was born in Colombo. After completing her degree in Biology at Bowling Green State University, USA, she returned to Sri Lanka in 1989 and started selling surplus apparel out of her car trunk.",
          "Her passion for quality led to the opening of the flagship ODEL store in Alexandra Place, Colombo, which became a national landmark."
        ]
      },
      {
        title: "Embark & Animal Advocacy",
        icon: "🐾",
        paragraphs: [
          "In 2007, inspired by a rescued street dog named Niko, Otara launched Embark to change societal attitudes towards street dogs in Sri Lanka.",
          "Embark has conducted hundreds of free sterilisation and vaccination clinics, saving thousands of lives and promoting compassionate living."
        ]
      }
    ]
  },
  {
    name: "Sanath Jayasuriya",
    title: "Master Blaster, 1996 World Cup MVP & Cricket Revolutionary",
    category: "Sports",
    location: "Matara District",
    year: "1996",
    verified: true,
    featured: false,
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    videoId: "YR5ApYxkU-U",
    bio: "Sanath Teriran Jayasuriya is a Sri Lankan cricket legend whose explosive batting revolutionized One Day International (ODI) cricket worldwide during the 1996 World Cup. Born in Matara, Jayasuriya was named Most Valuable Player of the 1996 ICC Cricket World Cup for his devastating opening partnerships with Romesh Kaluwitharana.\n\nOver a glittering 22-year international career, he scored 13,430 ODI runs and took 323 ODI wickets, making him one of the greatest all-rounders in cricket history. He holds the record for the highest individual score by a Sri Lankan in ODIs (189 vs India) and scored 340 in a Test match against India.",
    achievements: [
      "Most Valuable Player (MVP) of the 1996 ICC Cricket World Cup",
      "13,430 ODI Runs & 323 ODI Wickets",
      "Highest Individual ODI Score by a Sri Lankan (189 runs vs India)",
      "Test Triple Century (340 vs India at R. Premadasa Stadium)",
      "Former Sri Lanka National Cricket Captain & Chief Selector"
    ],
    tags: ["Sanath Jayasuriya", "Matara", "Cricket", "World Cup 1996", "Master Blaster", "Sports"],
    interviewSeries: [
      { id: "ep-8-1", episode: 1, title: "Part 1: The Matara Marauder & The 1996 World Cup Revolution", videoId: "YR5ApYxkU-U", duration: "24:50", date: "2026-02-18", description: "Sanath Jayasuriya discusses how Sri Lanka changed global ODI cricket in 1996." }
    ],
    biographyPages: [
      {
        title: "From St. Servatius Matara to World Champion",
        icon: "🏏",
        paragraphs: [
          "Sanath Jayasuriya was born on June 30, 1969, in Matara. Educated at St. Servatius' College Matara, his natural hand-eye coordination and left-handed power hitting made him a standout talent.",
          "Selected for Sri Lanka in 1989, his pinch-hitting strategy in the first 15 overs of ODIs permanently changed how international teams approached limited-overs cricket."
        ]
      }
    ]
  }
];

// ── AWARDS ────────────────────────────────────────────────────────────────────
const awardsData = [
  { title: "National Statesmanship & Public Service Laureate 2026", category: "Politics & Leadership", nominee: "M. H. M. Ashraff", description: "For transformative leadership in founding SLMC, modernizing Colombo Port, and establishing South Eastern University at Oluvil.", status: "Nominee", year: 2026, presenter: "National Governance & Leadership Council", thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", votes: 0, icon: "🏛️" },
  { title: "National Education Vanguard Honor", category: "Education & Heritage", nominee: "Dr. C. W. W. Kannangara", description: "For authoring the historic 1945 Free Education Bill and establishing 54 Central Schools island-wide.", status: "Nominee", year: 2026, presenter: "Ministry of Education & National Heritage", thumbnail: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", votes: 0, icon: "🎓" },
  { title: "Global Sports Legend & Humanitarian Award", category: "Sports", nominee: "Muttiah Muralitharan", description: "For capturing a world-record 800 Test wickets and building the Foundation of Goodness empowering 35,000+ rural citizens.", status: "Nominee", year: 2026, presenter: "Sri Lanka Sports Ministry & Olympic Committee", thumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80", votes: 0, icon: "🏏" },
  { title: "Green Engineering & Agricultural Innovation Prize", category: "Engineering & Technology", nominee: "Dr. Ray Wijewardene", description: "For inventing the Landmaster two-wheel tractor and pioneering renewable dendro-thermal power generation.", status: "Nominee", year: 2026, presenter: "Institution of Engineers Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", votes: 0, icon: "⚡" },
  { title: "Cultural Cinema Masterpiece Fellowship", category: "Arts & Culture", nominee: "Dr. Lester James Peries", description: "Lifetime achievement in realistic Sri Lankan cinema, directing Rekava, Gamperaliya, and Nidhanaya.", status: "Nominee", year: 2026, presenter: "National Film Corporation & UNESCO Sri Lanka", thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80", votes: 0, icon: "🎬" },
  { title: "International Justice & Human Rights Laureate", category: "Politics & Leadership", nominee: "Deshamanya Dr. Christopher Weeramantry", description: "For distinguished international jurisprudence as Vice-President of the ICJ at The Hague and peace education leadership.", status: "Nominee", year: 2026, presenter: "Sri Lanka Bar Association & ICJ Fellowship", thumbnail: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80", votes: 0, icon: "⚖️" },
  { title: "Social Enterprise & Animal Welfare Pioneer Award", category: "Social Impact", nominee: "Otara Gunewardene", description: "For building ODEL and founding Embark, rescuing and vaccinating thousands of street dogs across Sri Lanka.", status: "Nominee", year: 2026, presenter: "National Social Services Council", thumbnail: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80", votes: 0, icon: "🐾" },
  { title: "Cricket Revolution & Master Blaster Trophy", category: "Sports", nominee: "Sanath Jayasuriya", description: "1996 World Cup MVP who revolutionized international ODI batting and scored 13,000+ runs for Sri Lanka.", status: "Nominee", year: 2026, presenter: "Sri Lanka Cricket Board", thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80", votes: 0, icon: "🏃‍♂️" }
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
