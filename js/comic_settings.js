"use strict";

//comic_settings.js was created by geno7, with much needed assistance from Dannarchy

let pg = Number(location.search.split("=")[1] || 1);
let MAXPG = 0;

////////////////////////
//VARIABLES FOR TWEAKING
////////////////////////

// COMIC PAGE SETTINGS
const folder = "img/comics";
const image = "pg";
const imgPart = "_";
const ext = "jpg";

//THUMBNAIL SETTINGS
const thumbFolder = "img/thumbs"
const thumbExt = "png";
const thumbDefault = "default";

//NAVIGATION SETTINGS
const navText = ["First", "Previous", "Next", "Last"];
const navFolder = "img/comicnav";
const navExt = "png";
const navScrollTo = "#showComic";

class PageData {
    constructor(title, date, alt_text, author_notes) {
        this.title        = title || "";
        this.date         = date || "";
        this.alt_text     = alt_text || "";
        this.author_notes = author_notes || "";
    }
}

const pgData = [
    new PageData("The First Page Title", "Jan 3rd, 2021", "Page 1 alt text", `
    <p>These are the notes for page 1.</p>
    <p>There are many like them, but these notes are mine.</p>`),
    new PageData("The Second Page Title", "Jan 4th, 2021", "Page 2 alt text", `
    <p>These are the notes for page 2.</p>
    <p>There are many like them, but these notes are mine.</p>`),
    new PageData("The Third Page Title", "Jan 6th, 2021", "Page 3 alt text", `
    <p>These are the notes for page 3.</p>
    <p>There are many like them, but these notes are mine.</p>`),
    new PageData("Really Long Page 4 Title, To Show That Long Titles Will Wrap So Call It Whatever You Want", "Jan 8th, 2021", "Page 4 alt text", `
    <p>These are the notes for page 3.</p>
    <p>There are many like them, but these notes are mine.</p>`),
    new PageData("If A Page Doesn't Have A Title, It Will Just Be Called Page X", "Jan 9th, 2021", "Page 5 alt text", `
    <p>These are the notes for page 3.</p>
    <p>There are many like them, but these notes are mine.</p>`),
    new PageData(null, "Jan 10th, 2021", "Page 6 alt text", `
    <p>These are the notes for page 3.</p>
    <p>There are many like them, but these notes are mine.</p>`),
];

function writeDate(year,month,day) { //write date of comic page
    const date = new Date(year, month - 1, day)
    .toDateString() //format date as Day Month Date Year
    .toString() //convert it to a string
    .slice(4) //remove the Day

    return date;
}

(async _ => {
    const path = `img/comics/pg`;

    let pages = 0;
    let res = { status: 0 };

    while (true) {
        pages++;

        try {
            res = await fetch(`${path}${pages}/1.${ext}`);

            if (res.status !== 200) throw new Error();
        } catch (e) {
            pages--;

            break;
        }
    }

    MAXPG = pages;

    if (pg === 0) { pg = MAXPG; }
})();
