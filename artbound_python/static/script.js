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
	controls_div = document.getElementById("controls"),
	opacity_range = document.getElementById("opacity_range"),
	main_container_div = document.getElementById("main_container"),
	content_div = document.getElementById("content"),
	canvas_link = document.getElementById("canvas-download"),
	canvas_ig = document.getElementById("instagram-canvas"),
	fanart_template = document.getElementById("fanart-template").innerHTML;

let fanarts = new Array(),
	watermark_invert = '';

WATERMARK.src = WATERMARK_SRC;
IG_TEMPLATE.src = IG_TEMPLATE_SRC;
month_input.value = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}`;

function addCanvasEvents(element, ctx) {
	function abc(e) {
		if (element.enabled == 0) return;
		if (e.button == 0) {
			if (e.type == "mousedown") {
				element.clicked = true;
				console.log(element);
			}
			element.watermark.opacity = opacity_range.value;
			addWatermark(e, element, ctx);
		}
	}

	if (element.clicked) {
		element.canvas.addEventListener('mousedown', abc);
		return;
	}
	element.canvas.addEventListener('mousemove', abc);
	element.canvas.addEventListener('mouseleave', () => {
		if (!element.clicked && element.enabled)
			setBaseImage(element.image, element.canvas, ctx);
	});
	element.canvas.addEventListener('mousedown', (e) => {
		abc(e);
		element.canvas.removeEventListener('mousemove', abc);
		element.canvas.addEventListener('mousedown', abc);
	});
}

function createElementFromHTML(htmlString) {
	const div = document.createElement('div');
	div.innerHTML = htmlString.trim();
	return div.firstChild;
}

function getNewCardHtml(element) {

	const id = element.id,
		index = element.index,
		name = element.name,
		content = element.content,
		filename = `${('0' + element.index).slice(-2)} - ${element.name}.png`,
		disabled = element.enabled == 0 ? " entry-disabled" : "";

	const html_string = Mustache.render("{{={| |}=}}" + fanart_template, { id, index, name, content, filename, disabled });
	element.div = createElementFromHTML(html_string);
	element.canvas = element.div.getElementsByTagName("canvas")[0];

	const ctx = element.canvas.getContext("2d");

	element.image = new Image();
	element.image.addEventListener("load", () => {
		const wm_info = element.watermark;
		setBaseImage(element.image, element.canvas, ctx);
		if (element.clicked) {
			drawWatermark(wm_info, ctx);
		}
		addCanvasEvents(element, ctx);
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
		if (fanart.enabled) {
			i++;
			fanart.index = i;
			content_div.appendChild(getNewCardHtml(fanart));
		}
	}

	for (fanart of fanarts) {
		if (!fanart.enabled) {
			fanart.index = 0;
			content_div.appendChild(getNewCardHtml(fanart));
		}
	}
}

function getFanart(id) {
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

function reloadEntry(id) {
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

function debugFn() {
	fanarts = JSON.parse('[{"id":"1dE8L7w2DuOfQSJwf5oRjAeJ-VZfy5o-6","date":["03","08","2022"],"name":"Saro","content":"/static/res/wm.png","enabled":1,"index":1,"div":{}},{"id":"1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","date":["18","08","2022"],"name":"suchetto","content":"https://drive.google.com/uc?id=1ZO2poqaylmh7_FkEjRthozVXFpcP1Edx","enabled":1,"index":2,"div":{}},{"id":"1jkpZzqnQUdXv7QiW1khuwnSsdnjudBt-","date":["18","08","2022"],"name":"suca","content":"https://drive.google.com/uc?id=1clZbi1QzJQo_c7PGWx-nmLgfPhXqHdZR","enabled":1,"index":3,"div":{}}]');
	controls_div.hidden = false;
	updateOpacity();
	updateFanartList();
}

function clickCoordsToCanvas(clickX, clickY, c) {
	const rect = c.getBoundingClientRect();
	const x = (clickX - rect.left) * c.width / c.clientWidth;
	const y = (clickY - rect.top) * c.height / c.clientHeight;
	return [x, y];
}

function drawWatermark(wm_info, ctx) {
	ctx.globalAlpha = wm_info.opacity;
	ctx.filter = wm_info.invert;
	ctx.drawImage(WATERMARK, wm_info.x - (WATERMARK_WIDTH / 2), wm_info.y - (WATERMARK_HEIGHT / 2), WATERMARK_WIDTH, WATERMARK_HEIGHT);
}

function addWatermark(event, element, ctx) {
	setBaseImage(element.image, element.canvas, ctx);
	const [x, y] = clickCoordsToCanvas(event.clientX, event.clientY, element.canvas);
	element.watermark.x = x;
	element.watermark.y = y
	drawWatermark(element.watermark, ctx);
}

function updateOpacity() {
	opacity_label.innerHTML = Math.round(opacity_range.value * 100) + '%';
}

function getFactor(img_width, img_height, max_width, max_height) {
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

function toggleInvert(id, button) {
	const entry = fanarts.find(element => element.id == id);
	entry.watermark.invert = entry.watermark.invert == '' ? 'invert(1)' : '';
	button.innerText = entry.watermark.invert ? "⚫" : "⚪";
	const ctx = entry.canvas.getContext('2d');
	setBaseImage(entry.image, entry.canvas, ctx);
	drawWatermark(entry.watermark, ctx);
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
		//console.log(data);
		fanarts = fanarts.concat(data);
		controls_div.hidden = false;
		updateOpacity();
		updateFanartList();
	});
}

function saveAll() {
	const response = confirm("Vuoi davvero scaricare tutte le fanart?");
	if (response == false) return;

	fanarts.forEach((fanart) => {
		if (fanart.enabled)
			saveCanvas(fanart.canvas, fanart.canvas.getAttribute("data-filename"));
	})
}

function saveAllIG() {
	const response = confirm("Vuoi davvero scaricare tutte le storie per le fanart?");
	if (response == false) return;

	fanarts.forEach((fanart) => {
		if (fanart.enabled)
			saveCanvasIG(fanart.canvas);
	});
}
