const BS_COL_WIDTH = 4,
	MAX_WIDTH = MAX_HEIGHT = 1000,
	WATERMARK_SRC = "/static/res/wm.png",
	WATERMARK_WIDTH = 325,
	WATERMARK_HEIGHT = 98,
	IG_TEMPLATE_SRC = "/static/res/ig.png",
	IG_MIN_OFFSET_X = 0,
	IG_MIN_OFFSET_Y = 342,
	IG_MAX_WIDTH = 1080,
	IG_MAX_HEIGHT = 988,
	
	WATERMARK = new Image(),
	IG_TEMPLATE = new Image(),
	date = new Date(),
	month_input = document.getElementById("month_input"),
	month_div = document.getElementById("month_div"),
	get_button = document.getElementById("get_button"),
	selectall_button = document.getElementById("selectall_button"),
	selectnone_button = document.getElementById("selectnone_button"),
	togglecolor_button = document.getElementById("togglecolor_button"),
	controls_div = document.getElementById("controls"),
	opacity_range = document.getElementById("opacity_range"),
	main_container_div = document.getElementById("main_container"),
	content_div = document.getElementById("content"),
	canvas_link = document.getElementById("canvas-download"),
	canvas_ig = document.getElementById("instagram-canvas");

let	fanarts = new Array(),
	watermark_invert = '';

WATERMARK.src = WATERMARK_SRC;
IG_TEMPLATE.src = IG_TEMPLATE_SRC;
month_input.value = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}`;

function addCanvasEvents(img, canvas, ctx){
	function abc(e) {
		if (e.button == 0) addWatermark(e, img, canvas, ctx);
	}

	canvas.addEventListener('mousemove', abc);
	canvas.addEventListener('mousedown', function(e) {
		canvas.removeEventListener('mousemove', abc);
		canvas.addEventListener('mousedown', abc);
	});
}

function getNewCardHtml(element) {
	element.div = document.createElement("div");
	element.canvas = document.createElement("canvas");
	const div1 = document.createElement("div"),
		div2 = document.createElement("div"),
		a = document.createElement("a"),
		div3 = document.createElement("div"),
		div4 = document.createElement("div"),
		button1 = document.createElement("button"),
		button2 = document.createElement("button"),
		button3 = document.createElement("button"),
		button4 = document.createElement("button"),
		button5 = document.createElement("button"),
		button6 = document.createElement("button"),
		filename = `${('0' + element.index).slice(-2)} - ${element.name}.png`;
	
	element.div.className = `col-md-${BS_COL_WIDTH} entry${element.enabled == 0 ? " entry-disabled" : ""}`;
	element.div.id = `div-${element.id}`;
	element.div.setAttribute("data-index", element.index);
	div1.className = `card mb-${BS_COL_WIDTH} box-shadow my-card`;
	element.canvas.className = "card-img-top entry-img";
	element.canvas.id = element.id;
	element.canvas.setAttribute("data-name", element.name);
	element.canvas.setAttribute("data-content", element.content);
	element.canvas.setAttribute("data-filename", filename)
	div2.className = "card-body";
	a.className = "card-text";
	a.innerText = filename;
	a.title = "Clicca per copiare."
	a.addEventListener("click", function() { navigator.clipboard.writeText(a.innerText); }, false)
	div3.className = "d-flex justify-content-between align-items-center card-controls";
	div4.className = "btn-group";

	button1.className = button2.className = button3.className = button4.className = button5.className = button6.className = "btn btn-sm btn-outline-secondary";
	button1.innerText = "⬅️";
	button2.innerText = "*️⃣";
	button3.innerText = "🔄";
	button4.innerText = "💾";
	button5.innerText = "📷";
	button6.innerText = "➡️";
	button1.addEventListener("click", function() { moveUpDown(element.id, -1); }, false);
	button2.addEventListener("click", function() { toggleEntry(element.id); }, false);
	button3.addEventListener("click", function() { reloadEntry(element.id); }, false);
	button4.addEventListener("click", function() { saveEntry(element.id); }, false);
	button5.addEventListener("click", function() { saveEntryIG(element.id); }, false);
	button6.addEventListener("click", function() { moveUpDown(element.id, 1); }, false);

	div4.appendChild(button1);
	div4.appendChild(button2);
	//div4.appendChild(button3);
	div4.appendChild(button4);
	div4.appendChild(button5);
	div4.appendChild(button6);
	div3.appendChild(div4);
	div2.appendChild(a);
	div2.appendChild(div3);
	div1.appendChild(element.canvas);
	div1.appendChild(div2);
	element.div.appendChild(div1);

	const ctx = element.canvas.getContext("2d");

	element.image = new Image();
	element.image.addEventListener("load", () => {
		setBaseImage(element.image, element.canvas, ctx);
		addCanvasEvents(element.image, element.canvas, ctx);
	});
	element.image.src = element.content;

	return element.div;
}

async function updateFanartList() {
	main_container_div.hidden = false;
	content_div.innerHTML = "";
	get_button.disabled = false;
	get_button.innerText = "Aggiungi";
	
	let i = 0;
	for (fanart of fanarts) {
		if(fanart.enabled){
			i++;
			fanart.index = i;
			content_div.appendChild(getNewCardHtml(fanart));
		}
	}

	for (fanart of fanarts) {
		if(!fanart.enabled){
			fanart.index = 0;
			content_div.appendChild(getNewCardHtml(fanart));
		}
	}
}

function getFanart(id){
	return fanarts.find(element => element.id == id)
}

function toggleEntry(id) {
	entry = getFanart(id);
	if (!entry) return;

	entry.enabled = !entry.enabled;
	updateFanartList()
}

function saveCanvas(my_canvas, filename) {
	canvas_link.href = my_canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
	canvas_link.setAttribute("download", filename);
	canvas_link.click()
}

function reloadEntry(id){
	const fanart = getFanart(id);
	if (!fanart) return;

	const old_div = fanart.div;
	content_div.replaceChild(getNewCardHtml(fanart), old_div);
	old_div.remove();
}

function selectAllNone(toggle) {
	fanarts.map(x => x.enabled = toggle)
	updateFanartList()
}

function debugFn(){
	fanarts = JSON.parse('[{"id":"1dE8L7w2DuOfQSJwf5oRjAeJ-VZfy5o-6","date":["03","08","2022"],"name":"Saro","content":"/static/res/wm.png","enabled":1,"index":1,"div":{}},{"id":"1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","date":["18","08","2022"],"name":"suchetto","content":"https://drive.google.com/uc?id=1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","enabled":1,"index":2,"div":{}},{"id":"1jkpZzqnQUdXv7QiW1khuwnSsdnjudBt-","date":["18","08","2022"],"name":"suca","content":"https://drive.google.com/uc?id=1clZbi1QzJQo_c7PGWx-nmLgfPhXqHdZR","enabled":1,"index":3,"div":{}}]');
	controls_div.hidden = false;
	updateOpacity();
	updateFanartList();
}

function toggleColor() {
	watermark_invert = watermark_invert == '' ? 'invert(1)' : '';
	updateColorDisplay();
}

function updateColorDisplay() {
	togglecolor_button.innerText = watermark_invert ? "⚫" : "⚪";
}

function addWatermark(event, img, c, ctx) {
	setBaseImage(img, c, ctx);

	const rect = c.getBoundingClientRect();
	const x = (event.clientX - rect.left) * c.width / c.clientWidth;
	const y = (event.clientY - rect.top) * c.height / c.clientHeight;

	ctx.globalAlpha = opacity_range.value;
	ctx.filter = watermark_invert;
	ctx.drawImage(WATERMARK, x - (WATERMARK_WIDTH / 2), y - (WATERMARK_HEIGHT / 2), WATERMARK_WIDTH, WATERMARK_HEIGHT);
}

function updateOpacity() {
	opacity_label.innerHTML = Math.round(opacity_range.value * 100) + '%';
}

function getFactor(img_width, img_height, max_width, max_height){
	return Math.min(max_width / img_width, max_height / img_height);
}

function setBaseImage(img, c, ctx) {
	const f = getFactor(img.width, img.height, MAX_WIDTH, MAX_HEIGHT);

	const new_width = c.width = Math.ceil(img.width * f);
	const new_height = c.height = Math.ceil(img.height * f)

	ctx.imageSmoothingEnabled = (f < 1);
	ctx.drawImage(img, 0, 0, new_width, new_height);
}

function moveUpDown(id, amount) {
	const pos = fanarts.indexOf(fanarts.find(element => element.id == id));
	const new_pos = pos + amount;

	if (new_pos <= -1 || new_pos >= fanarts.length) {
		return;
	}

	[fanarts[pos], fanarts[new_pos]] = [fanarts[new_pos], fanarts[pos]];

	updateFanartList();
}

async function postData(url = "", data = {}, contentType = "application/json") {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": contentType }, body: JSON.stringify(data) });
    return response.json();
}

function saveEntry(id) {
	entry = getFanart(id);
	if (!entry) return;
	saveCanvas(entry.canvas, entry.canvas.getAttribute("data-filename"));
}

function saveCanvasIG(my_canvas) {
	const f = getFactor(my_canvas.width, my_canvas.height, IG_MAX_WIDTH, IG_MAX_HEIGHT);

	const width = Math.ceil(my_canvas.width * f);
	const height = Math.ceil(my_canvas.height * f);

	const offset_x = Math.round((IG_MAX_WIDTH - width) / 2);
	const offset_y = Math.round((IG_MAX_HEIGHT - height) / 2);

	destCtx = canvas_ig.getContext('2d');
	destCtx.drawImage(IG_TEMPLATE, 0, 0);
	destCtx.drawImage(my_canvas, IG_MIN_OFFSET_X + offset_x, IG_MIN_OFFSET_Y + offset_y, width, height);
	saveCanvas(canvas_ig, "IG - " + my_canvas.getAttribute("data-filename"));
}

function saveEntryIG(id) {
	entry = getFanart(id);
	if (!entry) return;
	saveCanvasIG(entry.canvas);
}

function getArtworks() {
	get_button.disabled = true;
	get_button.innerText = "…"
    postData("/", { month: month_input.value }).then((data) => {
        console.log(data);
        fanarts = fanarts.concat(data);
        controls_div.hidden = false;
	    updateOpacity();
	    updateFanartList();
    });
}

function saveAll() {
	const response = confirm("Vuoi davvero scaricare tutte le fanart?");
	if(response == false) return;

	fanarts.forEach((fanart) => {
		if(fanart.enabled)
			saveCanvas(fanart.canvas, fanart.canvas.getAttribute("data-filename"));
	})
}

function saveAllIG() {
	const response = confirm("Vuoi davvero scaricare tutte le storie per le fanart?");
	if(response == false) return;

	fanarts.forEach((fanart) => {
		if(fanart.enabled)
			saveCanvasIG(fanart.canvas);
	});
}
