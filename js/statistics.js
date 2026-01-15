$(document).ready(function () {
    const csvPath = "tmp/data.csv";

    fetch(csvPath)
        .then(response => response.text())
        .then(text => processCSV(text))
        .catch(err => console.error("CSV load error:", err));
});

function processCSV(csv) {
    const lines = csv.trim().split("\n");
    const headers = lines.shift().split(",");

    const dataByDay = {};

    lines.forEach(line => {
        const cols = line.split(",");

        const dateTime = cols[0];
        //const day = dateTime.split(" ")[0]; // DD.MM.YY
		const [d,m,y] = dateTime.split(" ")[0].split(".");
		const day = "20"+y+"-"+m+"-"+d;


        const ok = parseFloat(cols[4]);
        const error = parseFloat(cols[5]);
        const hint = parseFloat(cols[6]);
        const time = parseFloat(cols[7]);

        if (!dataByDay[day]) {
            dataByDay[day] = {
                ok: 0,
                error: 0,
                hint: 0,
                time: 0
            };
        }

        dataByDay[day].ok += ok;
        dataByDay[day].error += error;
        dataByDay[day].hint += hint;
        dataByDay[day].time += time;
    });

    const days = Object.keys(dataByDay).sort();

    const totalOk = [];
    const okPerError = [];
    const okPerHint = [];
    const totalTime = [];

    days.forEach(day => {
        const d = dataByDay[day];
        totalOk.push(d.ok);
        okPerError.push(d.ok > 0 ? d.error / d.ok : null);
        okPerHint.push(d.ok > 0 ?  d.hint / d.ok : null);
        totalTime.push(d.time/60);
    });

    drawPlot("plot-ok", days, totalOk, "OK");
    drawPlot("plot-ok-error", days, okPerError, "Error/OK");
    drawPlot("plot-ok-hint", days, okPerHint, "Hint/OK");
    drawPlot("plot-time", days, totalTime, "Time (minutes)");
}

function drawPlot(elementId, x, y, title) {
    const trace = {
        x: x,
        y: y,
        mode: "markers+lines",
        type: "bar"
        
    };

    const layout = {
        title: title,
		xaxis: {
			title: "Date",
			tickmode: "array",
			tickvals: x,
			ticktext: x.map(d => {
				const date = (d instanceof Date) ? d : new Date(d);
				return String(date.getDate()).padStart(2, "0") + "." +
					   String(date.getMonth() + 1).padStart(2, "0");
			}),
			tickangle: -45
		},
        yaxis: { automargin: true },
		bargap: 0.2,
        margin: { t: 50 }
    };

    Plotly.newPlot(elementId, [trace], layout, { responsive: true });
}
