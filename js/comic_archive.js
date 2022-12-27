"use strict";

(async _ => {
    //Wait for MAXPG count to finish
    while (MAXPG === 0) { await new Promise((ok, err) => { setTimeout(ok, 100); }); }
    
    writeArchive( "chrono", 1, MAXPG, -1, true, true);
    writeArchive("lastfirst", 1, MAXPG, 0, true,true);
    writeArchive("chapter1", 1, 3, -1, false, true);
    writeArchive("chapter2", 4, 9, -1, false, false);
    writeArchive("chapter3", 9, 12, -1, false, false);
    writeArchive("chapter4", 13, 15, -1, false, false);

    //=======================================\/===DO NOT TOUCH===\/==============================================//

    /**
     * The function for creating archive sections. Calling this function multiple times
     * with different page ranges allows you to split up the archives into chapters.
     *
     * @param {HTMLDivElement} divClass - The class of the div you want this section of the archive to appear in.
     * @param {number} min - The first page to list.
     * @param {number} max - The latest page to list. Setting it to {@link MAXPG} will automatically have it update with the latest page.
     * @param {boolean} reverseOrder - If set to 0, list is displayed "latest first". if set to -1, list is displayed chronologically.
     * @param {boolean} useThumbs - If set to true, each comic will have its own thumbnail image next to it. If a comic doesn't have its own thumbnail, it'll be set to the default thumbnail.
     * @param {boolean} useNums - If set to true, each comic will have a display number.
     */
    function writeArchive(divClass, min, max, reverseOrder, useThumbs, useNums) {
        //create a table to put the archive data
        let archiveTable = document.createElement("table");
        archiveTable.setAttribute("class", "archiveTable"); //set class to archiveTable for css styling
        let getDiv = document.getElementsByClassName(divClass)[0]; //get div class
        getDiv.appendChild(archiveTable);
        //make the table from the currently available comics
        for (let i = min; i <= max; i++) {
            let row = archiveTable.insertRow(reverseOrder); //if reverseOrder is set to 0 it'll reverse the order, otherwise it'll display it in regular order

            //insert table cells
            let cellThumb = useThumbs ? row.insertCell() : 0; //only insert thumbs and number rows if useThumbs and useNums are toggled respectively
            let cellNum = useNums ? row.insertCell() : 0;

            let cellTitle = row.insertCell();
            let cellDate = row.insertCell();

            //default values when you don't have page data set
            let pgTitle = "Page " + i;
            let pgDate = "";
            let pgNum = "";

            //url of thumbnail
            let pgThumb = thumbFolder + "/" + image + i + "." + thumbExt;
            //url of default thumbnail
            let pgThumbDefault = thumbFolder + "/" + thumbDefault + "." + thumbExt;

            if (pgData.length >= i) {
                //set values to the values indicated in the pgData object if available
                if (pgData[i - 1].title) pgTitle = pgData[i - 1].title;
                if (pgData[i - 1].date)  pgDate = pgData[i - 1].date;

                pgNum = i;
            }

            //make the whole row a clickable link to the corresponding comic
            row.setAttribute("class", `archiveRow`);

            let linkToComic = `${indexPage}?pg=${i + navScrollTo}`;

            row.addEventListener("click", () => {
                window.location.href = linkToComic;
            });

            if (useThumbs) {
                //draw thumbnails if you have thumbnails toggled
                cellThumb.innerHTML = `<img alt="${pgTitle}" title="${pgTitle}" src="${pgThumb}" onerror="javascript:this.src='${pgThumbDefault}'"/>`;
                cellThumb.setAttribute("class", "archiveCellThumb");
            }

            if (useNums) {
                //same for numbers
                cellNum.innerHTML = `<span><strong>${pgNum}</strong></span>`;
                cellNum.setAttribute("class", "archiveCellNum");
            }

            //draw each row
            cellTitle.innerHTML = `<span><strong>${pgTitle}</strong></span>`;
            cellTitle.setAttribute("class", "archiveCellTitle");
            cellDate.innerHTML = "<span> " + pgDate + " </span>";
            cellDate.setAttribute("class", "archiveCellDate");

            //left align text if not using thumbnails
            cellTitle.className += " leftAlignTableText";
        }
    }
})();