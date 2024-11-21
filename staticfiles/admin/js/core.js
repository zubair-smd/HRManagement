'use strict';

class DOMUtils {
    static createElement(tagType, parent, textContent = null, ...attributes) {
        const element = document.createElement(tagType);
        if (textContent !== null) {
            element.textContent = textContent;
        }
        for (let i = 0; i < attributes.length; i += 2) {
            element.setAttribute(attributes[i], attributes[i + 1]);
        }
        parent.appendChild(element);
        return element;
    }

    static removeChildren(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

    static getPosition(element) {
        let position = { x: 0, y: 0 };
        let current = element;

        while (current) {
            if (current.offsetParent) {
                position.x += current.offsetLeft - current.scrollLeft;
                position.y += current.offsetTop - current.scrollTop;
                current = current.offsetParent;
            } else {
                position.x += current.x || 0;
                position.y += current.y || 0;
                break;
            }
        }
        return position;
    }
}

class DateFormatter {
    constructor(date) {
        this.date = date instanceof Date ? date : new Date(date);
    }

    static padTwoDigits(num) {
        return String(num).padStart(2, '0');
    }

    getTwelveHours() {
        return this.date.getHours() % 12 || 12;
    }

    getFormattedMonth() {
        return DateFormatter.padTwoDigits(this.date.getMonth() + 1);
    }

    getFormattedDate() {
        return DateFormatter.padTwoDigits(this.date.getDate());
    }

    getFormattedTwelveHour() {
        return DateFormatter.padTwoDigits(this.getTwelveHours());
    }

    getFormattedHour() {
        return DateFormatter.padTwoDigits(this.date.getHours());
    }

    getFormattedMinute() {
        return DateFormatter.padTwoDigits(this.date.getMinutes());
    }

    getFormattedSecond() {
        return DateFormatter.padTwoDigits(this.date.getSeconds());
    }

    getDayName(abbreviated = false) {
        if (!window.CalendarNamespace) {
            return DateFormatter.padTwoDigits(this.date.getDay());
        }
        return abbreviated 
            ? window.CalendarNamespace.daysOfWeekAbbrev[this.date.getDay()]
            : window.CalendarNamespace.daysOfWeek[this.date.getDay()];
    }

    getMonthName(abbreviated = false) {
        if (!window.CalendarNamespace) {
            return this.getFormattedMonth();
        }
        return abbreviated
            ? window.CalendarNamespace.monthsOfYearAbbrev[this.date.getMonth()]
            : window.CalendarNamespace.monthsOfYear[this.date.getMonth()];
    }

    format(formatString) {
        const fields = {
            a: this.getDayName(true),
            A: this.getDayName(false),
            b: this.getMonthName(true),
            B: this.getMonthName(false),
            c: this.date.toString(),
            d: this.getFormattedDate(),
            H: this.getFormattedHour(),
            I: this.getFormattedTwelveHour(),
            m: this.getFormattedMonth(),
            M: this.getFormattedMinute(),
            p: this.date.getHours() >= 12 ? 'PM' : 'AM',
            S: this.getFormattedSecond(),
            w: DateFormatter.padTwoDigits(this.date.getDay()),
            x: this.date.toLocaleDateString(),
            X: this.date.toLocaleTimeString(),
            y: String(this.date.getFullYear()).slice(-2),
            Y: String(this.date.getFullYear()),
            '%': '%'
        };

        let result = '';
        let skipNext = false;

        for (let i = 0; i < formatString.length; i++) {
            if (skipNext) {
                // Skip this iteration and reset the flag
                skipNext = false;
                continue;
            }

            if (formatString[i] === '%' && i + 1 < formatString.length) {
                result += fields[formatString[i + 1]] || '';
                skipNext = true; // Indicate to skip the next character
            } else {
                result += formatString[i];
            }
        }

        return result;
    }

    static parseDate(dateString, format) {
        const formatParts = format.split(/[.\-/]/);
        const dateParts = dateString.split(/[.\-/]/);
        let day, month, year;

        formatParts.forEach((part, index) => {
            const value = parseInt(dateParts[index], 10);
            switch (part) {
                case "%d":
                    day = value;
                    break;
                case "%m":
                    month = value - 1;
                    break;
                case "%Y":
                    year = value;
                    break;
                case "%y":
                    year = value >= 69 ? 1900 + value : 2000 + value;
                    break;
            }
        });

        return new Date(Date.UTC(year, month, day));
    }
}

export { DOMUtils, DateFormatter };
