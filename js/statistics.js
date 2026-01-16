$(document).ready(function () {
	
	processRows();
		
});




async function processRows() {

    const dataByDay = {};
	
	const rows = await DB_getall();

    rows.forEach(row => {
		const [d,m,y] = row.date.split(" ")[0].split(".");
		const day = "20"+y+"-"+m+"-"+d;	
        if (!dataByDay[day]) 
            dataByDay[day] = {  ok: 0, error: 0, hint: 0, time: 0 };
        dataByDay[day].ok += row.ok;
        dataByDay[day].error += row.error;
        dataByDay[day].hint += row.hint;
        dataByDay[day].time += row.time;	
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
