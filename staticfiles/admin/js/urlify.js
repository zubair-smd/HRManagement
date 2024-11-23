'use strict';
{
    function URLify(s, num_chars, allowUnicode) {
        // Convert string to URL-friendly format
        if (!allowUnicode) {
            s = downcode(s);
        }
        
        s = s.toLowerCase();

        if (allowUnicode) {
            // Keep Unicode letters, numbers, whitespace, dash, and underscore
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

        // Remove leading and trailing spaces (optimized)
        s = s.replace(/^\s+|\s+$/g, '');  // Directly remove leading and trailing spaces

        // Replace consecutive spaces or hyphens with a single hyphen
        s = s.replace(/[\s-]+/g, '-');  // Simplified to avoid unnecessary backtracking

        // Trim to specified length
        s = s.substring(0, num_chars);

        // Remove trailing hyphens with a more efficient regex
        return s.replace(/-+$/g, '');  // Optimized to remove trailing hyphens
    }

    window.URLify = URLify;
}
