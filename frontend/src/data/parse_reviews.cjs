const fs = require('fs');

const raw = fs.readFileSync('./raw_reviews.txt', 'utf8');
const lines = raw.split('\n').map(l => l.trim());

let reviews = [];
let currentReview = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // A new review typically starts after a bunch of empty lines or at the beginning.
  // Actually, we can look for patterns like "X reviews" or "Local Guide"
  // If the NEXT line or line after contains "reviews" or "Local Guide", the current line is a Name.
  
  if (line.length > 0 && (lines[i+1]?.includes('reviews') || lines[i+1]?.includes('Local Guide') || lines[i+1]?.includes('photo'))) {
    // Start of a new review
    if (currentReview && currentReview.text) {
      reviews.push(currentReview);
    }
    currentReview = {
      id: reviews.length + 1,
      name: line,
      location: 'Google Review',
      rating: 5,
      avatar: line.charAt(0).toUpperCase(),
      text: ''
    };
    i++; // skip the "X reviews" line
    
    // find the time line
    while (i < lines.length && !lines[i].includes('ago') && !lines[i].includes('New') && !lines[i].includes('Edited')) {
      i++;
    }
    i++; // skip the time line
    
    // now we are at the text
    let textLines = [];
    while (i < lines.length && !lines[i].includes('Like') && !lines[i].includes('Share') && !lines[i].includes('Translated by Google') && !lines[i].match(/^\+\d+$/) && lines[i] !== '1' && lines[i] !== '2') {
      if (lines[i].trim().length > 0 && !lines[i].includes('Response from the owner') && !lines[i].match(/^\d+:\d+/)) {
        textLines.push(lines[i]);
      }
      i++;
    }
    
    let fullText = textLines.join(' ').replace('… More', '').replace('... More', '').trim();
    if (fullText.length > 10) {
       currentReview.text = fullText;
    } else {
       currentReview = null; // discard if no text
    }
  }
}
if (currentReview && currentReview.text) {
  reviews.push(currentReview);
}

// deduplicate and filter
reviews = reviews.filter(r => r.text.length > 20);

const out = `export const ALL_REVIEWS = ${JSON.stringify(reviews, null, 2)};`;
fs.writeFileSync('./reviewsData.js', out);
console.log('Saved', reviews.length, 'reviews');
