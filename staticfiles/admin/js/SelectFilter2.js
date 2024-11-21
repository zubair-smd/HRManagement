/* global SelectBox, gettext, ngettext, interpolate */
'use strict';

(function () {
    const SelectFilter = {
        init: function (field_id, field_name, is_stacked) {
            if (field_id.includes('__prefix__')) {
                return; // Skip dynamically added inline forms
            }

            const from_box = document.getElementById(field_id);
            if (!from_box) {
                console.error(`SelectFilter.init: No element found with id "${field_id}"`);
                return;
            }

            from_box.id += '_from';
            from_box.classList.add('filtered');

            // Move help text or information
            Array.from(from_box.parentNode.getElementsByTagName('p')).forEach((p) => {
                if (p.classList.contains('info')) {
                    p.remove();
                } else if (p.classList.contains('help')) {
                    from_box.parentNode.insertBefore(p, from_box.parentNode.firstChild);
                }
            });

            // Create selector UI
            const selector_div = this.createElement('div', from_box.parentNode);
            selector_div.className = is_stacked ? 'selector stacked' : 'selector';

            // Create "Available" box
            const selector_available = this.createElement('div', selector_div, '', { class: 'selector-available' });
            const title_available = this.createElement('h2', selector_available, `${interpolate(gettext('Available %s'), [field_name])} `);
            this.createElement('span', title_available, '', {
                class: 'help help-tooltip help-icon',
                title: interpolate(
                    gettext(
                        'This is the list of available %s. You may choose some by selecting them in the box below and then clicking the "Choose" arrow between the two boxes.'
                    ),
                    [field_name]
                )
            });

            // Create filter input for available box
            const filter_p = this.createElement('p', selector_available, '', { id: `${field_id}_filter`, class: 'selector-filter' });
            const search_filter_label = this.createElement('label', filter_p, '', { for: `${field_id}_input` });
            this.createElement('span', search_filter_label, '', {
                class: 'help-tooltip search-label-icon',
                title: interpolate(gettext('Type into this box to filter down the list of available %s.'), [field_name])
            });
            filter_p.appendChild(document.createTextNode(' '));
            this.createElement('input', filter_p, '', {
                type: 'text',
                placeholder: gettext('Filter'),
                id: `${field_id}_input`
            });

            selector_available.appendChild(from_box);

            const choose_all = this.createElement('a', selector_available, gettext('Choose all'), {
                href: '#',
                id: `${field_id}_add_all_link`,
                title: interpolate(gettext('Click to choose all %s at once.'), [field_name]),
                class: 'selector-chooseall'
            });

            // Create chooser UI
            const selector_chooser = this.createElement('ul', selector_div, '', { class: 'selector-chooser' });
            const add_link = this.createElement('a', this.createElement('li', selector_chooser), gettext('Choose'), {
                href: '#',
                id: `${field_id}_add_link`,
                title: gettext('Choose'),
                class: 'selector-add'
            });
            const remove_link = this.createElement('a', this.createElement('li', selector_chooser), gettext('Remove'), {
                href: '#',
                id: `${field_id}_remove_link`,
                title: gettext('Remove'),
                class: 'selector-remove'
            });

            // Create "Chosen" box
            const selector_chosen = this.createElement('div', selector_div, '', { id: `${field_id}_selector_chosen`, class: 'selector-chosen' });
            const title_chosen = this.createElement('h2', selector_chosen, `${interpolate(gettext('Chosen %s'), [field_name])} `);
            this.createElement('span', title_chosen, '', {
                class: 'help help-tooltip help-icon',
                title: interpolate(
                    gettext(
                        'This is the list of chosen %s. You may remove some by selecting them in the box below and then clicking the "Remove" arrow between the two boxes.'
                    ),
                    [field_name]
                )
            });

            const filter_selected_p = this.createElement('p', selector_chosen, '', { id: `${field_id}_filter_selected`, class: 'selector-filter' });
            const search_filter_selected_label = this.createElement('label', filter_selected_p, '', { for: `${field_id}_selected_input` });
            this.createElement('span', search_filter_selected_label, '', {
                class: 'help-tooltip search-label-icon',
                title: interpolate(gettext('Type into this box to filter down the list of selected %s.'), [field_name])
            });
            filter_selected_p.appendChild(document.createTextNode(' '));
            this.createElement('input', filter_selected_p, '', {
                type: 'text',
                placeholder: gettext('Filter'),
                id: `${field_id}_selected_input`
            });

            this.createElement('select', selector_chosen, '', {
                id: `${field_id}_to`,
                multiple: '',
                size: from_box.size,
                name: from_box.name,
                class: 'filtered'
            });

            // Add event listeners
            choose_all.addEventListener('click', (e) => {
                e.preventDefault();
                SelectBox.move_all(`${field_id}_from`, `${field_id}_to`);
                this.refresh(field_id);
            });
            add_link.addEventListener('click', (e) => {
                e.preventDefault();
                SelectBox.move(`${field_id}_from`, `${field_id}_to`);
                this.refresh(field_id);
            });
            remove_link.addEventListener('click', (e) => {
                e.preventDefault();
                SelectBox.move(`${field_id}_to`, `${field_id}_from`);
                this.refresh(field_id);
            });

            from_box.closest('form').addEventListener('submit', () => {
                SelectBox.select_all(`${field_id}_to`);
            });

            SelectBox.init(`${field_id}_from`);
            SelectBox.init(`${field_id}_to`);
            this.refresh(field_id);
        },

        createElement: function (tag, parent, text, attributes) {
            const el = document.createElement(tag);
            if (text) el.textContent = text;
            if (attributes) {
                Object.keys(attributes).forEach((key) => {
                    el.setAttribute(key, attributes[key]);
                });
            }
            if (parent) parent.appendChild(el);
            return el;
        },

        refresh: function (field_id) {
            const from = document.getElementById(`${field_id}_from`);
            const to = document.getElementById(`${field_id}_to`);
            const add_link = document.getElementById(`${field_id}_add_link`);
            const remove_link = document.getElementById(`${field_id}_remove_link`);

            add_link.classList.toggle('active', from.options.length > 0);
            remove_link.classList.toggle('active', to.options.length > 0);
        }
    };

    // Initialize SelectFilter on page load
    window.addEventListener('load', () => {
        document.querySelectorAll('select.selectfilter, select.selectfilterstacked').forEach((el) => {
            const { fieldName, isStacked } = el.dataset;
            SelectFilter.init(el.id, fieldName, parseInt(isStacked, 10));
        });
    });

    window.SelectFilter = SelectFilter;
})();
