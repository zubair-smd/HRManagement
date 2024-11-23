'use strict';
{
    function URLify(s, num_chars, allowUnicode) {
        // Convert string to URL-friendly format
        if (!allowUnicode) {
            s = downcode(s); // Transform Unicode to ASCII (if downcode function exists)
        }

        s = s.toLowerCase();

        if (allowUnicode) {
            // Keep Unicode letters, numbers, whitespace, dash, and underscore
            s = s.replace(
                /([^\w\s\-_]|[^\p{L}\p{N}])/gu, // Match characters outside allowed sets
                ''
            );
        } else {
            // Remove all characters except alphanumeric, whitespace, and hyphens
            s = s.replace(
                /([^-\w\s])/g, // Match characters not alphanumeric, hyphen, or whitespace
                ''
            );
        }

        // Remove leading spaces using non-greedy match
        s = s.replace(/^\s+/, ''); // Remove leading spaces

        // Remove trailing spaces using non-greedy match
        s = s.replace(/\s+$/, ''); // Remove trailing spaces

        // Replace consecutive spaces or hyphens with a single hyphen
        s = s.replace(/[\s\-]+/g, '-'); // Replace multiple spaces or hyphens with a single hyphen

        // Trim to specified length
        s = s.substring(0, num_chars);

        // Remove trailing hyphens efficiently
        return s.replace(/-+$/, ''); // Remove trailing hyphens
    }

    window.URLify = URLify;
}
