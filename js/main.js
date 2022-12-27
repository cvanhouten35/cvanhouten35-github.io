const FETCHOBJ = { method: "GET", mode: "same-origin" };

async function onLoad(e) {
    const [footer_res, header_res]   = await Promise.all([fetch("parts/footer.html", FETCHOBJ), fetch("parts/header.html", FETCHOBJ)]);
    const [footer_body, header_body] = await Promise.all([footer_res.text(), header_res.text()]);

    document.getElementById("header").innerHTML = header_body;
    document.getElementById("footer").innerHTML = footer_body;
}

window.addEventListener("load", onLoad);