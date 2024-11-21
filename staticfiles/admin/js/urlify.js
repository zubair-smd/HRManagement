'use strict';
{
    // Utility function for downcoding, replacing non-ASCII characters with ASCII equivalents
    function downcode(s) {
        // Example of downcoding non-ASCII characters to ASCII equivalents
        return s.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove diacritical marks (accents)
    }

    function URLify(s, num_chars, allowUnicode) {
        // Convert string to URL-friendly format
        if (!allowUnicode) {
            s = downcode(s);  // Downcode non-ASCII characters if allowUnicode is false
        }
        
        s = s.toLowerCase();  // Convert the string to lowercase

        if (allowUnicode) {
            // Keep Unicode letters, numbers, whitespace, dash, and underscore
            s = s.replace(
                /([^\w\s-_])/g,  // Match characters that are not alphanumeric, whitespace, dash, or underscore
                ''
            );
        } else {
            // Remove all characters except alphanumeric, whitespace, and hyphens
            s = s.replace(
                /([^-\w\s])/g,  // Match characters that are not alphanumeric, hyphen, or whitespace
                ''
            );
        }

        // Explicitly group trim pattern for leading and trailing spaces
        s = s.replace(
            /(^\s+)|(\s+$)/g,  // Remove leading and trailing spaces
            ''
        );

        // Group space and hyphen characters for replacement
        s = s.replace(
            /([-\s])+/g,  // Replace consecutive spaces or hyphens with a single hyphen
            '-'
        );

        // Trim to specified length
        s = s.substring(0, num_chars);

        // Remove trailing hyphens with explicit grouping
        return s.replace(
            /(-)+$/g,  // Remove any trailing hyphens
            ''
        );
    }

    window.URLify = URLify;
}
