'use strict';
{
    // A simple downcode function to handle non-ASCII characters.
    // This can be extended if needed to normalize or transliterate Unicode characters.
    function downcode(s) {
        const mapping = {
            'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
            'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
            'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
            'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
            'ç': 'c', 'ñ': 'n', 'ø': 'o', 'å': 'a', 'œ': 'o'
        };
        return s.replace(/[áéíóúàèìòùäëïöüâêîôûçñøåœ]/gi, match => mapping[match.toLowerCase()] || match);
    }

    function URLify(s, num_chars, allowUnicode) {
        // Ensure num_chars is a positive integer
        if (typeof num_chars !== 'number' || num_chars <= 0 || !Number.isInteger(num_chars)) {
            throw new Error('num_chars must be a positive integer');
        }

        // Convert string to URL-friendly format
        if (!allowUnicode) {
            s = downcode(s);
        }
        
        s = s.toLowerCase();

        // Remove non-allowed characters based on allowUnicode flag
        if (allowUnicode) {
            // Grouping parts of the regex to make operator precedence explicit
            s = s.replace(
                /([^\w\s-_\p{L}\p{N}])/gu,  // Match characters that are not alphanumeric, whitespace, dash, or underscore
                ''
            );
        } else {
            // Remove all characters except alphanumeric, whitespace, and hyphens
            s = s.replace(
                /([^-\w\s])/g,  // Match characters that are not alphanumeric, hyphen, or whitespace
                ''
            );
        }

        // Remove leading and trailing spaces
        s = s.replace(/^\s+|\s+$/g, '');  // Optimized: Directly remove leading and trailing spaces

        // Replace consecutive spaces or hyphens with a single hyphen
        s = s.replace(/[\s-]+/g, '-');  // Optimized: Simplified to avoid unnecessary backtracking

        // Trim to the specified length, ensuring the length does not exceed num_chars
        s = s.substring(0, num_chars);

        // Remove trailing hyphens
        return s.replace(/-+$/g, '');  // Optimized: Efficient regex to remove trailing hyphens
    }

    window.URLify = URLify;
}
