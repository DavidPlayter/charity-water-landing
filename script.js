'use strict';
// Navigation on narrow screens.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('open', open);
});
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});
// Search real actions on this page; never inject text as HTML.
const actions = [
  { label: 'Give clean water', url: '#donate', keywords: 'donate donation give gift money support water' },
  { label: 'Create an official charity: water account', url: 'https://www.charitywater.org/account/register', keywords: 'register join account sign up community' },
  { label: 'Explore the journey', url: '#journey', keywords: 'journey projects impact help how work' },
  { label: 'Our mission and common questions', url: '#about', keywords: 'about mission learn faq why water questions' },
  { label: 'Try the clean water question', url: '#interact', keywords: 'interact play quiz game test' }
];
const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-input');
const searchResults = document.querySelector('#search-results');
const searchStatus = document.querySelector('#search-status');
function searchActions() {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.replaceChildren();
  if (!query) {
    searchResults.hidden = true;
    searchStatus.textContent = 'Try “donate”, “register”, “journey”, or “mission”.';
    searchInput.focus();
    return;
  }
  const words = query.split(/\s+/).filter(word => word.length > 2);
  const matches = actions.filter(action => words.some(word => (action.keywords + ' ' + action.label.toLowerCase()).includes(word)));
  searchResults.hidden = matches.length === 0;
  searchStatus.textContent = matches.length ? `${matches.length} way${matches.length === 1 ? '' : 's'} to take part. Choose one below.` : 'No match yet. Try “donate”, “register”, “journey”, or “mission”.';
  matches.forEach(action => {
    const link = document.createElement('a');
    link.href = action.url;
    link.textContent = action.label + ' →';
    searchResults.append(link);
  });
}
searchForm.addEventListener('submit', event => { event.preventDefault(); searchActions(); });
searchInput.addEventListener('input', () => { if (!searchInput.value) { searchResults.hidden = true; searchResults.replaceChildren(); searchStatus.textContent = ''; } });
// Optional voice input uses the visitor's browser permission flow.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const voiceButton = document.querySelector('#voice-search');
if (SpeechRecognition) {
  voiceButton.hidden = false;
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US'; recognition.interimResults = false; recognition.maxAlternatives = 1;
  let listening = false;
  voiceButton.addEventListener('click', () => {
    if (listening) { recognition.stop(); return; }
    try { recognition.start(); } catch { searchStatus.textContent = 'Voice search is unavailable right now. Please type your search.'; }
  });
  recognition.onstart = () => { listening = true; voiceButton.setAttribute('aria-pressed', 'true'); searchStatus.textContent = 'Listening… Say “donate”, “register”, or “mission”.'; };
  recognition.onresult = event => { searchInput.value = event.results[0][0].transcript; searchActions(); };
  recognition.onerror = () => { searchStatus.textContent = 'Voice search could not start. You can type your search instead.'; };
  recognition.onend = () => { listening = false; voiceButton.setAttribute('aria-pressed', 'false'); };
}
const quizChoices = Array.from(document.querySelectorAll('[data-answer]'));
const quizFeedback = document.querySelector('#quiz-feedback');
const quizReset = document.querySelector('#quiz-reset');
quizChoices.forEach(button => button.addEventListener('click', () => {
  quizChoices.forEach(choice => choice.setAttribute('aria-pressed', String(choice === button)));
  const correct = button.dataset.answer === '100';
  quizFeedback.textContent = correct ? 'That’s right! 100% of public donations fund clean water projects. Private donors cover operating costs.' : 'Good try! The answer is 100%. Private donors cover operating costs so public donations can fund water projects.';
  quizReset.hidden = false;
}));
quizReset.addEventListener('click', () => {
  quizChoices.forEach(choice => choice.setAttribute('aria-pressed', 'false'));
  quizFeedback.textContent = 'Choose an answer to find out.';
  quizReset.hidden = true;
  quizChoices[0].focus();
});
