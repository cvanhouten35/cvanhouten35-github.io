"use strict";

(async _ => {
    //Wait for MAXPG count to finish
    while (MAXPG === 0) { await new Promise((ok, err) => { setTimeout(ok, 100); }); }

    writeNav("writeNav", true);
    writePageTitle("writePageTitle", true, " - ");
    writePageClickable("writePageClickable", true);
    writeAuthorNotes("writeAuthorNotes");
    keyNav();
    
    //=======================================\/===DO NOT TOUCH===\/==============================================//
    
    /**
     * Shows the current comic page, along with a boolean to defined whether the clicking action changes the page.
     *
     * @param {HTMLDivElement} div - The class of the div(s) you want this section to appear in.
     * @param {boolean} clickable - Whether clicking on the image will move to the next page or not.
     */
    async function writePageClickable(div, clickable) {
        for (const el of document.getElementsByClassName(div)) {
            if (!clickable) {
                el.innerHTML = `<div class="comicPage">${await writePage(pg)}</div>`;
            } else if (pg < MAXPG) {
                //check whether comic is on the last page
                el.innerHTML = `<div class="comicPage"><a href="?pg=${pg + 1}${navScrollTo}"/>${await writePage(pg)}</a></div>`;
            } else {
                el.innerHTML = `<div class="comicPage">${await writePage(pg)}</div>`;
            }
        }
    }
    
    /**
     * Writes the title of the page.
     * 
     * @param {HTMLDivElement} div - The class of the div(s) you want this section to appear in.
     * @param {boolean} toggleNum - Whether the page number should also be displayed.
     * @param {string} char - The character to seperate between the page title and page number.
     */
    function writePageTitle(div, toggleNum, char) {
        for (const el of document.getElementsByClassName(div)) {
            if (pgData.length >= pg) {
                el.innerHTML = `<h1>${pgData[pg - 1].title}</h1>`;
                if (toggleNum) {
                    //toggle whether you want to display the page number
                    el.innerHTML = `<h1>${pg}${char + pgData[pg - 1].title}</h1>`; //char denotes a separating character between the number and the title
                }
              }
        }
    }
    
    /**
     * Writes in the author notes. Without this, the author notes section will simply not exist, as opposed to it
     * existing, but being empty.
     * 
     * @param {HTMLDivElement} div - The class of the div(s) you want this section to appear in.
     */
    function writeAuthorNotes(div) {
        for (const el of document.getElementsByClassName(div)) {
            if (pgData.length >= pg) {
                el.innerHTML = `${pgData[pg-1].author_notes}`
            }
        }
    }
    
    /**
     * Internal function for building a page.
     * 
     * @param {number} page_num - The page number for this specific comic page.
     * 
     */
    async function writePage(page_num) {
        let partExtension = "";
        let path = `img/comics/pg${page_num}/`;
        let page = ``;
    
        let parts = 0;
        let res = { status: 0 };
    
        while (true) {
            parts++;
    
            try {
                res = await fetch(`${path}${parts}.${ext}`);
    
                if (res.status !== 200) throw new Error();
            } catch (e) {
                parts--;
    
                break;
            }
        }
    
        for (let i = 1; parts >= i; i++) {            
            if (i > 1) page += `<br/>`;
    
            page += `<img alt="${pgData[pg - 1].alt_text}" title="${pgData[pg - 1].title}" src="${path}${i}.${ext}" />`;
        }
    
        return page;
    }
    
    /**
     * Internal function for determining whether an image, or text is used for navigation.
     *
     */
    function imgOrText(setImg, navTextSet) {
        if (setImg) {
            return `<img src="${navFolder}/nav_${navText[navTextSet].toLowerCase()}.${navExt}" alt="${navText[navTextSet]}" />`;
        } else {
            return navText[navTextSet];
        }
    }
    
    /**
     * Adds in the navigation controls for moving to previous/next comic panels.
     * 
     * @param {HTMLDivElement} div - The class of the div you want this section to appear in.
     * @param {boolean} imageToggle - If true, use images for navigation. Images should exist in the `img/comicnav/nav_*` location.
     */
    function writeNav(div, imageToggle) {
        function firstButton() {
            //FIRST BUTTON
            if (pg > 1) {
                //wait until page 2 to make button active
                return `<a href="?pg=` + 1 + navScrollTo + `"/>` + imgOrText(imageToggle, 0) + `</a>`;
            } else {
                if (!imageToggle) {
                    return imgOrText(imageToggle, 0);
                } else {
                    return ``;
                }
            }
        }
    
        function divider() {
            //divider
            if (!imageToggle) {
                return ` | `;
            }
            return ``;
        }
    
        function prevButton() {
            //PREV BUTTON
            if (pg > 1) {
                //wait until page 2 to make button active
                return `<a href="?pg=` + (pg - 1) + navScrollTo + `"/>` + imgOrText(imageToggle, 1) + `</a>`;
            } else {
                if (!imageToggle) {
                    return imgOrText(imageToggle, 1);
                } else {
                    return ``;
                }
            }
        }
    
        function nextButton() {
            //NEXT BUTTON
            if (pg < MAXPG) {
                //only make active if not on the last page
                return `<a href="?pg=` + (pg + 1) + navScrollTo + `"/>` + imgOrText(imageToggle, 2) + `</a>`;
            } else {
                if (!imageToggle) {
                    return imgOrText(imageToggle, 2);
                } else {
                    return ``;
                }
            }
        }
    
        function lastButton() {
            //LAST BUTTON
            if (pg < MAXPG) {
                //only make active if not on last page
                return `<a href="?pg=` + MAXPG + navScrollTo + `"/>` + imgOrText(imageToggle, 3) + `</a>`;
            } else {
                if (!imageToggle) {
                    return imgOrText(imageToggle, 3);
                } else {
                    return ``;
                }
            }
        }
        
        for (const el of document.getElementsByClassName(div)) {
            el.innerHTML = `<div class="comicNav">
            ${firstButton()}
            ${divider()}
            ${prevButton()}
            ${divider()}
            ${nextButton()}
            ${divider()}
            ${lastButton()}
            </div>`;
        }
    }
    
    /**
     * Enables navigating to previous or next comic pages with the keyboard.
     * - W: Scroll up
     * - S: Scroll down
     * - Left Arrow/A: Previous Page
     * - Right Arrow/A: Next Page
     *
     */
    function keyNav() {
        document.addEventListener("keydown", e => {
            if ((e.key == 'ArrowRight' || e.key.toLowerCase() == 'd') && pg < MAXPG) { //right arrow or D goes to next page
                window.location.href = "?pg=" + (pg + 1) + navScrollTo;
            } else if ((e.key == "ArrowLeft" || e.key.toLowerCase() == "a") && pg > 1) { //left arrow or A goes to previous page
                window.location.href = "?pg=" + (pg - 1) + navScrollTo;
            } else if (e.key.toLowerCase() == "w") { //W scrolls up
                window.scrollBy({ top: -30 });
            } else if (e.key.toLowerCase() == "s") { //S scrolls down
                window.scrollBy({ top: 30 });
            }
        });
    }
})();