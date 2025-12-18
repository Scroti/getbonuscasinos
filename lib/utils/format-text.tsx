import React from 'react';

/**
 * Preserves formatting from Firestore text
 * Handles line breaks (\n), HTML tags, and other formatting
 */
export function formatText(text: string): React.ReactNode {
  if (!text) return '';

  // Split by line breaks and preserve them
  const lines = text.split('\n').filter(line => line.trim() !== '');

  return (
    <>
      {lines.map((line, index) => {
        // Check if line contains HTML tags
        const hasHTML = /<[^>]+>/.test(line);
        
        if (hasHTML) {
          // If HTML is present, render it as HTML (be careful with XSS)
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: line }}
              className="mb-1 last:mb-0"
            />
          );
        } else {
          // Regular text with line breaks
          return (
            <div key={index} className="mb-1 last:mb-0">
              {line.trim()}
            </div>
          );
        }
      })}
    </>
  );
}

/**
 * Simple version that just preserves line breaks as <br> tags
 */
export function formatTextSimple(text: string): string {
  if (!text) return '';
  // Replace \n with <br> for simple line break preservation
  return text.split('\n').join('<br>');
}

/**
 * Preserves line breaks in React by splitting and rendering as separate elements
 */
export function formatTextWithBreaks(text: string): React.ReactNode {
  if (!text) return '';

  const parts = text.split('\n');
  
  return parts.map((part, index) => (
    <React.Fragment key={index}>
      {part}
      {index < parts.length - 1 && <br />}
    </React.Fragment>
  ));
}

