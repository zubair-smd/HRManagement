const CalendarNamespace = {
    // ... existing month/day arrays ...

    draw: function(month, year, div_id, callback, selected) {
        const calendarState = this.initializeState(month, year, selected);
        const calTable = this.createTable(calendarState);
        const tableBody = this.createTableBody(calTable);
        
        this.drawHeader(tableBody);
        let tableRow = this.drawEmptyCells(tableBody, calendarState);
        tableRow = this.drawDays(tableBody, calendarState, callback, tableRow);
        this.fillRemainingCells(tableRow);
        
        const calDiv = document.getElementById(div_id);
        removeChildren(calDiv);
        calDiv.appendChild(calTable);
    },

    initializeState: function(month, year, selected) {
        const today = new Date();
        return {
            month: parseInt(month),
            year: parseInt(year),
            today: {
                day: today.getDate(),
                month: today.getMonth() + 1,
                year: today.getFullYear()
            },
            isSelectedMonth: selected ? 
                selected.getUTCFullYear() === year && 
                (selected.getUTCMonth() + 1) === month : false,
            selected: selected,
            days: this.getDaysInMonth(month, year),
            startingPos: new Date(year, month - 1, 1 - this.firstDayOfWeek).getDay()
        };
    },

    createTable: function(state) {
        const table = document.createElement('table');
        quickElement('caption', table, 
            this.monthsOfYear[state.month - 1] + ' ' + state.year);
        return table;
    },

    createTableBody: function(table) {
        return quickElement('tbody', table);
    },

    drawHeader: function(tableBody) {
        const headerRow = quickElement('tr', tableBody);
        for (let i = 0; i < 7; i++) {
            quickElement('th', headerRow, 
                this.daysOfWeekInitial[(i + this.firstDayOfWeek) % 7]);
        }
    },

    drawEmptyCells: function(tableBody, state) {
        const tableRow = quickElement('tr', tableBody);
        for (let i = 0; i < state.startingPos; i++) {
            const cell = quickElement('td', tableRow, ' ');
            cell.className = "nonday";
        }
        return tableRow;
    },

    drawDays: function(tableBody, state, callback, tableRow) {
        let currentDay = 1;
        let i = state.startingPos;

        while (currentDay <= state.days) {
            if (i % 7 === 0 && currentDay !== 1) {
                tableRow = quickElement('tr', tableBody);
            }

            const todayClass = this.getDayClass(currentDay, state);
            const cell = quickElement('td', tableRow, '', 'class', todayClass);
            const link = quickElement('a', cell, currentDay, 'href', '#');
            link.addEventListener('click', this.createClickHandler(state.year, state.month, callback));

            currentDay++;
            i++;
        }
        return tableRow;
    },

    getDayClass: function(currentDay, state) {
        const classes = [];
        
        if (currentDay === state.today.day && 
            state.month === state.today.month && 
            state.year === state.today.year) {
            classes.push('today');
        }

        if (state.isSelectedMonth && 
            currentDay === state.selected?.getUTCDate()) {
            classes.push('selected');
        }

        return classes.join(' ');
    },

    createClickHandler: function(year, month, callback) {
        return function(e) {
            e.preventDefault();
            callback(year, month, this.textContent);
        };
    },

    fillRemainingCells: function(tableRow) {
        while (tableRow.childNodes.length < 7) {
            const cell = quickElement('td', tableRow, ' ');
            cell.className = "nonday";
        }
    }
};