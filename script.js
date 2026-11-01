// Embedded Disaster & Safety Dataset
const dataset = [
  {
    category: "floods",
    categoryLabel: "Floods & Water",
    instruction: "What are the major flooding events in India over the past 20 years?",
    context: "Major floods in India over the last two decades include the 2004 Indian Ocean Tsunami/floods, 2005 Mumbai floods, 2013 Uttarakhand flash floods, 2014 Jammu & Kashmir floods, 2015 Chennai floods, 2018 Kerala floods, and the 2023 North India monsoon floods.",
    response: "Significant Indian flood events in the last two decades include:<br>• <strong>2005 Mumbai Floods</strong>: Record breaking rainfall caused severe urban flooding.<br>• <strong>2013 Uttarakhand Floods</strong>: Cloudbursts caused devastating flash floods.<br>• <strong>2014 J&K Floods</strong>: Severe flooding in Srinagar and surrounding areas.<br>• <strong>2015 Chennai Floods</strong>: Heavy monsoon rainfall submerged Chennai city.<br>• <strong>2018 Kerala Floods</strong>: Worst flooding in Kerala in nearly a century.<br>• <strong>2023 North India Floods</strong>: Monsoon rains flooded Himachal Pradesh, Uttarakhand, and Delhi."
  },
  {
    category: "safety",
    categoryLabel: "General Safety",
    instruction: "What precautions should be taken during a flood?",
    context: "Flood safety precautions: Move to higher ground, avoid walking or driving through moving water, stay tuned to local emergency broadcasts, disconnect electrical utilities if instructed, and keep an emergency kit ready.",
    response: "<ol><li><strong>Evacuate to Higher Ground</strong>: Immediately move to elevated areas or designated shelters.</li><li><strong>Never Cross Moving Water</strong>: As little as 6 inches of moving water can knock you down.</li><li><strong>Shut Off Utilities</strong>: Turn off main electrical breakers and gas supplies before evacuating.</li><li><strong>Keep a Go-Bag Ready</strong>: Pack clean drinking water, food, medicines, flashlights, and vital documents.</li><li><strong>Monitor Official Broadcasts</strong>: Follow official NDMA weather and civil defense advisories.</li></ol>"
  },
  {
    category: "earthquakes",
    categoryLabel: "Earthquakes",
    instruction: "What safety precautions should be taken before and during an earthquake?",
    context: "Earthquake safety precautions: Secure heavy furniture to walls, create an emergency contact plan, prepare a disaster kit, and practice Drop, Cover, and Hold On.",
    response: "<strong>During an Earthquake:</strong><br>• <strong>Drop</strong> onto your hands and knees.<br>• <strong>Cover</strong> your head and neck under a sturdy table or desk.<br>• <strong>Hold On</strong> until all shaking stops entirely.<br><br><strong>Before an Earthquake:</strong><br>• Anchor heavy furniture and bookshelves to walls using brackets.<br>• Pre-identify safe spots under sturdy furniture in every room."
  },
  {
    category: "cyclones",
    categoryLabel: "Cyclones & Storms",
    instruction: "What safety measures should be followed during a cyclone?",
    context: "Cyclone safety measures: Secure loose outdoor items, stay indoors in reinforced shelter, avoid electrical connections during storm, keep emergency radio on, and do not venture near coastal areas.",
    response: "<ol><li><strong>Secure Outdoor Hazards</strong>: Move loose outdoor items indoors to avoid flying debris.</li><li><strong>Stay Indoors</strong>: Retreat to the safest, central room away from glass windows and doors.</li><li><strong>Turn Off Mains</strong>: Switch off the main power supply to prevent short circuits.</li><li><strong>Avoid Coastal Areas</strong>: Stay clear of ocean shores and storm surge zones completely.</li></ol>"
  },
  {
    category: "extreme-weather",
    categoryLabel: "Extreme Weather",
    instruction: "What causes heatwaves and how to stay safe?",
    context: "Heatwaves are prolonged periods of excessively hot weather. Safety tips include staying hydrated, avoiding direct sun between 12 PM and 4 PM, wearing lightweight clothing, and checking on vulnerable individuals.",
    response: "<strong>Safety Guidelines for Heatwaves:</strong><br>• Hydrate regularly with water, ORS, or natural electrolytes even if not thirsty.<br>• Avoid direct sunlight exposure between 12:00 PM and 4:00 PM.<br>• Wear loose-fitting, light-colored cotton clothing and protective hats.<br>• Never leave children or pets inside parked vehicles."
  },
  {
    category: "safety",
    categoryLabel: "General Safety",
    instruction: "How to prepare an Emergency Disaster Kit (Go-Bag)?",
    context: "Emergency kit essentials: Water, non-perishable food, flashlight, first aid kit, whistle, power bank, battery radio, copies of personal documents, and personal hygiene items.",
    response: "Key items for a home Emergency Go-Bag:<br>1. <strong>Water & Food</strong>: 3-day supply of drinking water (1 gallon/person/day) & non-perishables.<br>2. <strong>Medical Supplies</strong>: First-aid kit, prescription medicines, and sanitizers.<br>3. <strong>Light & Power</strong>: LED flashlights, extra batteries, and a fully charged power bank.<br>4. <strong>Documents & Tools</strong>: Emergency whistle, multi-tool knife, waterproof document pouch, and emergency cash."
  },
  {
    category: "safety",
    categoryLabel: "General Safety",
    instruction: "What precautions should be taken during a chemical gas leak?",
    context: "Chemical hazard safety: Cover nose and mouth with a wet cloth, move upwind from the leak, stay indoors with sealed windows, and follow civil defense directives.",
    response: "<ol><li><strong>Evacuate Upwind</strong>: Move perpendicular or upwind from the direction of the wind.</li><li><strong>Cover Respiratory Tract</strong>: Place a wet cloth over your mouth and nose to filter airborne toxins.</li><li><strong>Shelter in Place</strong>: Close all doors/windows and switch off air conditioning units if evacuating is unsafe.</li></ol>"
  },
  {
    category: "floods",
    categoryLabel: "Floods & Water",
    instruction: "What is a cloudburst and how is it different from a flash flood?",
    context: "A cloudburst is an extreme localized rain event (>100 mm/hour over a small area). A flash flood is the sudden high-velocity water movement that results within hours or minutes.",
    response: "• <strong>Cloudburst</strong>: A meteorological event involving intense precipitation exceeding <strong>100 mm per hour</strong> over a localized area (20-30 sq km).<br>• <strong>Flash Flood</strong>: The immediate, high-velocity flooding outcome caused by cloudbursts or dam breaches that surges down river valleys with minimal notice."
  }
];

// DOM Elements
const cardsGrid = document.getElementById('cardsGrid');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const noResults = document.getElementById('noResults');

// Modal DOM Elements
const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const modalBadge = document.getElementById('modalBadge');
const modalContext = document.getElementById('modalContext');
const modalResponse = document.getElementById('modalResponse');
const closeModalBtn = document.getElementById('closeModalBtn');
const doneModalBtn = document.getElementById('doneModalBtn');
const copyBtn = document.getElementById('copyBtn');

let currentCategory = 'all';

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  renderCards(dataset);

  // Category Filter Click Event
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      filterData();
    });
  });

  // Search Input Event
  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    filterData();
  });

  // Clear Search
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    filterData();
  });

  // Close Modal Events
  closeModalBtn.addEventListener('click', closeModal);
  doneModalBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Copy Content Event
  copyBtn.addEventListener('click', () => {
    const textToCopy = `${modalTitle.innerText}\n\nSummary:\n${modalContext.innerText}\n\nResponse:\n${modalResponse.innerText}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
      setTimeout(() => {
        copyBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Information`;
      }, 2000);
    });
  });
});

// Filter Cards based on Search and Selected Category
function filterData() {
  const searchTerm = searchInput.value.toLowerCase().trim();

  const filtered = dataset.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = item.instruction.toLowerCase().includes(searchTerm) ||
                          item.context.toLowerCase().includes(searchTerm) ||
                          item.response.toLowerCase().includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  renderCards(filtered);
}

// Render Topic Cards
function renderCards(data) {
  cardsGrid.innerHTML = '';

  if (data.length === 0) {
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  data.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'topic-card';

    card.innerHTML = `
      <div>
        <span class="card-tag tag-${item.category}">${item.categoryLabel}</span>
        <h3>${item.instruction}</h3>
        <p>${item.context}</p>
      </div>
      <button class="view-btn" onclick="openModal(${dataset.indexOf(item)})">
        Interact & View <i class="fa-solid fa-arrow-right"></i>
      </button>
    `;

    cardsGrid.appendChild(card);
  });
}

// Open Detailed View Modal
function openModal(index) {
  const item = dataset[index];

  modalTitle.innerText = item.instruction;
  modalBadge.innerText = item.categoryLabel;
  modalBadge.className = `modal-badge tag-${item.category}`;
  modalContext.innerText = item.context;
  modalResponse.innerHTML = item.response;

  modalOverlay.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Lock background scrolling
}

// Close Modal
function closeModal() {
  modalOverlay.classList.add('hidden');
  document.body.style.overflow = 'auto'; // Unlock background scrolling
}
// AI Chatbot Frontend Backend Connection
const aiChatToggleBtn = document.getElementById('aiChatToggleBtn');
const aiChatDrawer = document.getElementById('aiChatDrawer');
const closeChatBtn = document.getElementById('closeChatBtn');
const sendChatBtn = document.getElementById('sendChatBtn');
const userChatInput = document.getElementById('userChatInput');
const chatMessages = document.getElementById('chatMessages');

// Toggle Chat Window
aiChatToggleBtn.addEventListener('click', () => aiChatDrawer.classList.toggle('hidden'));
closeChatBtn.addEventListener('click', () => aiChatDrawer.classList.add('hidden'));

// Handle Sending Messages to Flask Python Server
async function handleSendMessage() {
  const query = userChatInput.value.trim();
  if (!query) return;

  // Display User Message
  appendBubble(query, 'user-bubble');
  userChatInput.value = '';

  // Display Loading Indicator
  const loadingId = appendBubble('AI is thinking...', 'bot-bubble');

  try {
    // Send request to Python server.py running locally on port 5000
    const response = await fetch('http://127.0.0.1:5000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query })
    });

    const data = await response.json();
    
    // Replace Loading Indicator with AI Response
    document.getElementById(loadingId).innerText = data.response || "Sorry, I could not process your query.";
  } catch (error) {
    document.getElementById(loadingId).innerText = "Error: Unable to connect to backend server. Make sure server.py is running on port 5000!";
  }
}

function appendBubble(text, className) {
    const bubble = document.createElement('div');
    const id = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4); // Unique ID guaranteed
    bubble.id = id;
    bubble.className = `chat-bubble ${className}`;
    bubble.innerText = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
    return id;
}

sendChatBtn.addEventListener('click', handleSendMessage);
userChatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSendMessage();
});