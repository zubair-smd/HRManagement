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

        // Remove leading and trailing spaces
        s = s.replace(/^(\s+)|(\s+)$/g, ''); // Use explicit groups for leading/trailing spaces

        // Replace consecutive spaces or hyphens with a single hyphen
        s = s.replace(/([\s\-]+)/g, '-'); // Group to emphasize the combination of spaces and hyphens

        // Trim to specified length
        s = s.substring(0, num_chars);

        // Remove trailing hyphens
        return s.replace(/(-+)$/g, ''); // Explicit grouping for trailing hyphens
    }

    window.URLify = URLify;
}
