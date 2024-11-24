'use strict';

function URLify(s, num_chars, allowUnicode) {
    // Convert string to URL-friendly format
    if (!allowUnicode) {
        s = downcode(s); // Transform Unicode to ASCII (if downcode function exists)
    }

    s = s.toLowerCase();

    if (allowUnicode) {
        // Keep Unicode letters, numbers, whitespace, dash, and underscore
        s = s.replace(
            /([^\w\s-_]|[^\p{L}\p{N}])/gu, // Match characters outside allowed sets
            ''
        );
    } else {
        // Remove all characters except alphanumeric, whitespace, and hyphens
        s = s.replace(
            /[^-\w\s]/g, // Match characters not alphanumeric, hyphen, or whitespace
            ''
        );
    }

    // Remove leading and trailing spaces
    s = s.trim(); // More efficient than using regex for this purpose

    // Replace consecutive spaces or hyphens with a single hyphen
    s = s.replace(/[\s-]+/g, '-'); // Fixed: Removed unnecessary escape on hyphen

    // Trim to specified length
    s = s.substring(0, num_chars);

    // Remove trailing hyphens
    return s.replace(/-+$/, '');
}

// Export for browser environments
if (typeof window !== 'undefined') {
    window.URLify = URLify;
}