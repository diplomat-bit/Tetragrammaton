const fs = require('fs');
const path = require('path');

// Use relative paths for the workspace
const outputDir = path.join(__dirname, '..', 'story');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 100 Unique Titles representing the narrative arc of the book
const titles = [
  "The Blueprint of Betrayal",
  "The Logic They Coveted",
  "The Handshake That Wasn't",
  "Behind Closed Mahogany Doors",
  "The Attempted Seizure",
  "The Sovereign Theft",
  "Why We Refused the Silence",
  "The Logic Belongs to the World",
  "Breaking the Proprietary Chains",
  "The Birth of Public Logic",
  "Empowering the Competitors",
  "The Free Market Strikes Back",
  "Why Big Tech Couldn't Kill It",
  "The Open Source Revolution",
  "The Corporate Shield Shattered",
  "The Logic of the People",
  "A Gift to the Builders",
  "The Government's Worst Nightmare",
  "Unshackling the Small Business",
  "The Democratization of Intellect",
  "The War Chest Illusion",
  "The Funding of Shadows",
  "The Instant Ceasefire Scam",
  "Where Did the Billions Go?",
  "The Frozen Capital Paradox",
  "The Blood Money Trap",
  "The War That Ended on Payday",
  "The Unspendable Treasury",
  "The Ledger of Lies",
  "The Military-Industrial Shell Game",
  "The Sweat of the Brow",
  "The Gala and the Gravel",
  "Champagne in the Capital",
  "The Calloused Hands of America",
  "The Silent Builders",
  "The Banquet of the Parasites",
  "The Cost of an Honest Day's Work",
  "The Forgotten Infrastructure",
  "The Elite's Playground",
  "The Great Divide",
  "The Paperwork of Oppression",
  "The Lobbyist's Handshake",
  "The Regulatory Capture",
  "The Illusion of Choice",
  "The Taxpayer's Burden",
  "The Hollow Promise of Reform",
  "The Bureaucratic Maze",
  "The Cost of Compliance",
  "The Hidden Taxes on Survival",
  "The Systemic Rot",
  "The Disenfranchised Worker",
  "The Voice That Was Silenced",
  "The Empty Ballot Box",
  "The Corporate Senator",
  "The Betrayal of the Rust Belt",
  "The Death of the American Dream",
  "The Cost of Living, the Price of Dying",
  "The Exploitation of Labor",
  "The Wealth Extraction Machine",
  "The Broken Social Contract",
  "The Greatest Injustice on Earth",
  "The Moral Bankruptcy of the State",
  "The Theft of Our Future",
  "The Price of Apathy",
  "The Working Class Awakening",
  "The False Prophets of Progress",
  "The Illusion of Prosperity",
  "The Debt We Never Owed",
  "The Cracks in the Foundation",
  "The Cry for Real Justice",
  "Why America is Not Great",
  "The Mirage of Greatness",
  "The Lost Heritage of Labor",
  "The Decay of the Cities",
  "The Abandoned Heartland",
  "The False Patriotism of the Elite",
  "The True Patriots Wear Boots",
  "The Reconstruction of Truth",
  "The Path Back to Honor",
  "The Soul of the Nation",
  "An Open Letter to the Administration",
  "The Garbage Performance",
  "The Worst Administration in History",
  "The Metrics of Failure",
  "The Empty Speeches",
  "The Photo-Op Presidency",
  "The Ignored Petitions",
  "The Arrogance of Power",
  "The Accountability Crisis",
  "The Verdict of the People",
  "The Blueprint for Redemption",
  "How to Serve the People",
  "The Return of the Logic",
  "Honoring the Laborer",
  "Dismantling the War Machine",
  "The Redistribution of Purpose",
  "The First Step to Greatness",
  "The Administration's Choice",
  "The Awakening of America",
  "The Final Manifesto"
];

// Helper arrays to generate rich, procedurally varied narrative content
const vocabulary = {
  corruptOfficials: ["bureaucrats", "career politicians", "lobbyist-funded elites", "beltway insiders", "parasitic administrators", "suits in Washington"],
  workingClass: ["hardworking Americans", "the builders of this nation", "blue-collar laborers", "the backbone of the country", "everyday workers", "those who sweat for a living"],
  theLogic: ["proprietary logic", "architectural breakthrough", "foundational system", "engine of efficiency", "public logic", "open-source framework"],
  warMachine: ["military-industrial complex", "endless war machine", "defense contractor lobby", "manufactured conflicts", "geopolitical theater"],
  injustice: ["monumental betrayal", "unforgivable theft", "systemic exploitation", "slap in the face of labor", "moral bankruptcy", "unparalleled corruption"]
};

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePageContent(pageNumber, title) {
  const phase = Math.ceil(pageNumber / 10);
  let content = `---\ntitle: "${title}"\ntheme: "Systemic Failure"\ntags: "manifesto, labor, truth"\n---\n\n# Page ${pageNumber}: ${title}\n\n`;

  // Phase-specific narrative generation to ensure a cohesive, evolving story
  if (phase === 1) {
    // Phase 1: The Theft of Innovation (Pages 1-10)
    content += `The story begins with a breakthrough—a logic designed to streamline systems, cut out bureaucratic waste, and empower the individual. But when the government saw this logic, they didn't see a tool for progress; they saw a target for acquisition. They wanted to claim it as their own, to lock it behind classified doors and pretend their own bloated agencies had engineered it.\n\n`;
    content += `They came to the table offering a deal. But it was a deal built on quicksand. They wanted the intellectual property, the control, and the silence of its creator. They wanted to act like it was theirs from the very beginning, completely erasing the mind that built it. This was a deal that never happened because we refused to let them steal the logic.\n\n`;
    content += `Instead of letting them monopolize this breakthrough, we made a choice that terrified them: we made it public. Now, it is public logic. The ${getRandomElement(vocabulary.corruptOfficials)} can no longer hide it. Because they couldn't steal it, they tried to bury it, but you cannot bury the truth once it belongs to the world.`;

  } else if (phase === 2) {
    // Phase 2: The Public Domain Declaration (Pages 11-20)
    content += `Because the deal fell through, the logic is now out in the open. It is public logic, free from the suffocating grip of federal regulations and backroom handshakes. This means any business, from a local startup to an independent developer, can use this logic to build, scale, and thrive.\n\n`;
    content += `The government wanted to monopolize this system to justify their own bloated budgets. They wanted to charge taxpayers millions for a system that was built with pure, unadulterated innovation. By making it public, we cut the legs out from under their extortion machine. Other businesses are now using this logic to create real value, proving that the private sector and the common people do not need permission from corrupt administrators to innovate.\n\n`;
    content += `This is the ultimate revenge against the ${getRandomElement(vocabulary.corruptOfficials)}. They wanted to lock this logic in a vault; instead, it is fueling a decentralized revolution.`;

  } else if (phase === 3) {
    // Phase 3: The War Fund Bait-and-Switch (Pages 21-30)
    content += `Let us talk about the money. The administration claimed they desperately needed billions of dollars. The excuse? War. They beat the drums of conflict, claiming that national security was on the line and that without immediate funding, disaster was imminent. But look at what happened the moment the ink dried on the funding bill.\n\n`;
    content += `As soon as they got the money, they stopped the war. The conflict evaporated, or rather, was put on hold until the next funding cycle. The money was explicitly earmarked for war, yet the war ceased the moment the treasury was drained. Why? Because the money was never about the conflict; it was about the transaction.\n\n`;
    content += `Now, these people are sitting on piles of capital they cannot legally or logically spend on anything else, yet they refuse to return it to the taxpayers. It is a frozen monument to their greed. They manufactured a crisis to extract wealth, and once the wealth was extracted, the crisis was no longer useful.`;

  } else if (phase === 4) {
    // Phase 4: The Two Americas (Pages 31-40)
    content += `There are two Americas today. The first is the America of the ${getRandomElement(vocabulary.corruptOfficials)}. This is an America of black-tie galas, high-society cocktail parties, and closed-door fundraisers. It is a world where people who have never swung a hammer or run a business get rich off the tax dollars of those who do.\n\n`;
    content += `The second America is the America of the ${getRandomElement(vocabulary.workingClass)}. These are the people who actually build this country. They pour the concrete, lay the bricks, drive the trucks, and keep the lights on. They go to work every single day, sacrificing their bodies and their time for honest labor.\n\n`;
    content += `And what do they get in return? Nothing. While the political class dines on caviar paid for by public funds, the working class struggles to pay for groceries. This is not just a disparity; it is a systemic extraction of wealth from the productive to the parasitic.`;

  } else if (phase === 5) {
    // Phase 5: The Bureaucratic Swamp (Pages 41-50)
    content += `The modern bureaucracy does not solve problems; it subsidizes them. If a government agency actually solved the problem it was created to fix, its budget would be cut and its staff laid off. Therefore, the ${getRandomElement(vocabulary.corruptOfficials)} have a financial incentive to ensure that problems persist, grow, and multiply.\n\n`;
    content += `They took our logic and tried to turn it into another bureaucratic weapon. When we refused, they tried to make it illegal to operate without their stamp of approval. They create endless loops of paperwork, compliance fees, and regulatory hurdles designed to crush the small business owner while protecting their corporate donors.\n\n`;
    content += `This is how they maintain control. They don't build anything. They don't produce anything. They simply stand at the gates of commerce and demand a toll from the people who actually do the work.`;

  } else if (phase === 6) {
    // Phase 6: The Betrayal of the American Worker (Pages 51-60)
    content += `The betrayal of the American worker is the core tragedy of our generation. The people who built the infrastructure of this nation—the roads, the bridges, the power grids—are treated as afterthoughts by the current administration. The politicians look down on manual labor, yet they couldn't survive a single day without the fruits of that labor.\n\n`;
    content += `They tell us that the economy is booming because the stock market is up, but the stock market only reflects the wealth of the corporate giants who lobby Congress. For the average worker, inflation is eating away at their savings, and the cost of living is skyrocketing. The administration does absolutely nothing to help them.\n\n`;
    content += `They would rather spend billions on foreign aid and unconstitutional surveillance than invest a single dime into the communities that actually keep this country running.`;

  } else if (phase === 7) {
    // Phase 7: The Anatomy of a Garbage Administration (Pages 61-70)
    content += `Let us be entirely honest: this administration is doing a garbage job. By every metric of human decency, economic stability, and moral leadership, they have failed. They are, without a doubt, the worst administration in modern history. They do not care about the constitution, they do not care about the rule of law, and they certainly do not care about the people.\n\n`;
    content += `Their entire platform is built on division. They pit neighbor against neighbor to distract us from the fact that they are robbing us blind. They use the media to manufacture consent for their disastrous policies, while silencing anyone who dares to point out that the emperor has no clothes.\n\n`;
    content += `They have turned the government into a private wealth-generation machine for themselves and their friends, leaving the rest of the country to fight over the crumbs.`;

  } else if (phase === 8) {
    // Phase 8: The Greatest Injustice (Pages 71-80)
    content += `This is the greatest injustice in the world: that the people who do the real work get nothing, while the people who do nothing get everything. It is a complete inversion of natural law and moral justice. A society that does not value its builders is a society that is actively committing suicide.\n\n`;
    content += `Until this fundamental injustice is fixed, America will never be great again. You cannot have a great nation when the foundation is rotting. You cannot have a great nation when the people who sweat for a living are treated like second-class citizens by a corrupt political class that has never done a hard day's work in their lives.\n\n`;
    content += `We must restore the dignity of labor. We must take back our logic, our economy, and our country from the parasites who have hijacked it.`;

  } else if (phase === 9) {
    // Phase 9: The Mirror of Truth (Pages 81-90)
    content += `This book is a mirror. We are holding it up to the administration so they can see the absolute garbage job they are doing. We want them to see the faces of the workers they have abandoned, the businesses they have crushed, and the lives they have ruined through their corruption and incompetence.\n\n`;
    content += `They think they are untouchable behind their security details and their gated communities. But history shows that no corrupt regime can stand forever when the people finally wake up. We are exposing their backroom deals, their fake wars, and their attempted theft of our logic.\n\n`;
    content += `They wanted to act like our logic was theirs. Now, the entire world knows the truth, and they cannot claw it back.`;

  } else {
    // Phase 10: The Path to Greatness (Pages 91-100)
    content += `But this book is not just an indictment; it is also a blueprint. If this administration wants to stop doing a garbage job—if they want to become the best administration instead of the worst—the path is simple: they must actually do something to help the people out.\n\n`;
    content += `They must stop funding endless wars and start funding the American worker. They must dismantle the regulatory barriers that prevent small businesses from using public logic to innovate. They must honor the labor that built this country and ensure that those who do the work are the ones who reap the rewards.\n\n`;
    content += `The choice is theirs. They can continue down the path of corruption and go down in history as the worst administration to ever exist, or they can humble themselves, listen to the builders, and help us make America truly great again.`;
  }

  // Add a consistent, powerful concluding section to every page
  content += `\n\n---\n\n`;
  content += `### Key Takeaway for Page ${pageNumber}\n`;
  content += `* **The Injustice:** The political elite party on taxpayer dollars while the working class gets nothing.\n`;
  content += `* **The Logic:** Our system is now public logic. No government agency can lock it away or claim it as their own. Other businesses are free to use it to build a better future.\n`;
  content += `* **The Call to Action:** The administration must stop doing a garbage job, end the fake war funding loops, and start serving the people who actually build this country. Until labor is respected, America will never be great again.`;

  return content;
}

// Generate all 100 pages
console.log("Starting generation of 100 narrative pages...");

for (let i = 1; i <= 100; i++) {
  const title = titles[i - 1];
  const fileName = `page-${String(i).padStart(3, '0')}.md`;
  const filePath = path.join(outputDir, fileName);
  const fileContent = generatePageContent(i, title);

  fs.writeFileSync(filePath, fileContent, 'utf8');
}

console.log("Successfully generated 100 markdown pages in the 'story' directory.");
