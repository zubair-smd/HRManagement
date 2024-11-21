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
            s = XRegExp.replace(
                s, 
                XRegExp('([^-_\\p{L}\\p{N}\\s])', 'g'), 
                ''
            );
        } else {
            // Remove all characters except alphanumeric, whitespace, and hyphens
            s = s.replace(
                /([^-\w\s])/g, 
                ''
            );
        }

        // Explicitly group trim pattern for leading and trailing spaces
        s = s.replace(
            /^(\s+)|(\s+)$/g, 
            ''
        );

        // Group space and hyphen characters for replacement
        s = s.replace(
            /([-\s])+/g, 
            '-'
        );

        // Trim to specified length
        s = s.substring(0, num_chars);

        // Remove trailing hyphens with explicit grouping
        return s.replace(
            /(-)+$/g, 
            ''
        );
    }

    window.URLify = URLify;
}